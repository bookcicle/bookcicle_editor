import {Mark} from '@tiptap/core';
import {Plugin, PluginKey} from 'prosemirror-state';
import {debounce} from 'lodash';
import {v4 as uuidv4} from 'uuid';
import sha1 from 'crypto-js/sha1';
import db from '../../db/db.js';

export const LanguageToolHelpingWords = {
    LanguageToolTransactionName: 'languageToolTransaction',
    MatchUpdatedTransactionName: 'matchUpdated',
    LoadingTransactionName: 'languageToolLoading',
};

let editorView = null;
const initialisedViews = new WeakSet();

/* ───────── helpers ───────────────────────────────────────────────────── */
const SPELL_CATS = ['TYPOS', 'CASING', 'COMPOUNDING', 'CONFUSED_WORDS'];
const GRAMMAR_CATS = [
    'GRAMMAR', 'PUNCTUATION', 'REDUNDANCY', 'REPETITIONS', 'REPETITIONS_STYLE',
    'SEMANTICS', 'GENDER_NEUTRALITY', 'FALSE_FRIENDS', 'TYPOGRAPHY',
];

const getMatchType = id =>
    SPELL_CATS.includes(id) ? 'spelling' :
        GRAMMAR_CATS.includes(id) ? 'grammar' : 'other';

const classForCat = id =>
    SPELL_CATS.includes(id) ? 'lt lt-spelling-error' :
        GRAMMAR_CATS.includes(id) ? 'lt lt-grammar-error' : 'lt lt-other-error';

const buildMapping = (doc) => {
    const mapping = [], textParts = [];
    doc.descendants((node, pos) => {
        if (node.isText) {
            for (let i = 0; i < node.text.length; i++) {
                mapping[textParts.join('').length + i] = pos + i;
            }
            textParts.push(node.text);
        } else if (node.isBlock) {
            mapping[textParts.join('').length] = '\n';
            textParts.push('\n');
        }
    });
    return {text: textParts.join(''), mapping};
};

const changedSpan = (tr) => {
    let f = null, t = null;
    tr.mapping.maps.forEach(m => m.forEach((a, b, c, d) => {
        if (f === null || c < f) f = c;
        if (t === null || d > t) t = d;
    }));
    return f === null ? null : {from: f, to: t};
};

const extractFragment = (txt, {from, to}, pad = 250) => {
    const start = Math.max(0, from - pad), end = Math.min(txt.length, to + pad);
    return {text: txt.slice(start, end), offset: start};
};
/* ─────────────────────────────────────────────────────────────────────── */

export const LanguageToolMark = Mark.create({
    name: 'languagetool',

    addOptions() {
        return {
            apiUrl: '',
            language: 'auto',
            debounceTime: 800,
            automaticMode: true,
            enableSpellcheck: true,
            enableGrammarCheck: true,
            documentId: undefined,
        };
    },

    addAttributes() {
        return {
            match: {default: null},
            uuid: {default: null},
            class: {default: null},
        };
    },

    parseHTML() {
        return [{
            tag: 'span.lt',
            getAttrs: dom => ({
                match: dom.getAttribute('data-match') || null,
                uuid: dom.getAttribute('data-uuid') || null,
                class: dom.getAttribute('class') || null,
            }),
        }];
    },

    renderHTML({HTMLAttributes}) {
        const {match, uuid, ...rest} = HTMLAttributes;
        return ['span', {...rest, 'data-match': match, 'data-uuid': uuid}, 0];
    },

    addCommands() {
        return {
            proofread: () => (() => {
                if (editorView) {
                    editorView.dispatch(editorView.state.tr.setMeta('lt:proof', true));
                }
                return true;
            }),
        };
    },

    addProseMirrorPlugins() {
        const ext = this;
        const {apiUrl, language, debounceTime} = this.options;

        /* fetch + filter */
        const fetchSuggestions = async (text, offset = 0) => {
            if (!apiUrl) return [];
            try {
                const r = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    body: `text=${encodeURIComponent(text)}&language=${language}&enabledOnly=false`
                });
                const data = await r.json();
                return (data.matches || []).map(m => ({...m, offset: m.offset + offset}));
            } catch (e) {
                console.error('LT API', e);
                return [];
            }
        };

        const filterByOptions = ms => ms.filter(m => {
            const typ = getMatchType(m.rule?.category?.id || 'TYPOS');
            return (typ === 'spelling' && ext.options.enableSpellcheck) ||
                (typ === 'grammar' && ext.options.enableGrammarCheck);
        });

        const filterIgnored = async (ms, doc, mapping) => {
            if (!ext.options.documentId) return ms;
            const out = [];
            for (const m of ms) {
                const from = mapping[m.offset], to = from + m.length;
                const word = doc.textBetween(from, to);
                let ignored = false;
                if (getMatchType(m.rule?.category?.id || '') === 'spelling') {
                    ignored = await db.ignoredWords.where('[value+documentId]')
                        .equals([word, String(ext.options.documentId)]).first();
                } else {
                    ignored = await db.ignoredGrammarErrors.where('[ruleId+contextText+contextOffset+documentId]')
                        .equals([m.rule.id, m.context.text, m.context.offset, String(ext.options.documentId)]).first();
                }
                if (!ignored) out.push(m);
            }
            return out;
        };

        /* mark utils */
        const removeMarks = (tr, from, to) => {
            tr.doc.nodesBetween(from, to, (n, pos) => {
                if (n.isText) n.marks.filter(m => m.type.name === 'languagetool')
                    .forEach(() => tr.removeMark(pos, pos + n.nodeSize, tr.doc.type.schema.marks.languagetool));
            });
        };

        const applyMatches = (view, matches, mapping, span = null) => {
            if (!view || !view.state) return;
            const {tr} = view.state;
            if (span) removeMarks(tr, span.from, span.to);
            matches.forEach(m => {
                const from = mapping[m.offset], to = from + m.length;
                if (from !== undefined && to !== undefined) {
                    tr.addMark(from, to,
                        view.state.schema.marks.languagetool.create({
                            match: JSON.stringify(m),
                            uuid: uuidv4(),
                            class: classForCat(m.rule?.category?.id || 'TYPOS')
                        }));
                }
            });
            tr.setMeta('languageToolProcessing', true);
            view.dispatch(tr);
        };

        /* cache */
        const cache = new Map();

        /* processors */
        const full = async (doc, view) => {
            const {text, mapping} = buildMapping(doc);
            const h = sha1(text).toString();
            let m = cache.get(h);
            if (!m) {
                m = await fetchSuggestions(text);
                m = filterByOptions(m);
                m = await filterIgnored(m, doc, mapping);
                cache.set(h, m);
            }
            applyMatches(view, m, mapping);
        };
        const frag = async (doc, span, view) => {
            const {text: dt, mapping} = buildMapping(doc);
            const {text, offset} = extractFragment(dt, span);
            const h = sha1(text + offset).toString();
            let m = cache.get(h);
            if (!m) {
                m = await fetchSuggestions(text, offset);
                m = filterByOptions(m);
                m = await filterIgnored(m, doc, mapping);
                cache.set(h, m);
            }
            applyMatches(view, m, mapping, span);
        };

        const debFull = debounce(full, debounceTime);
        const debFrag = debounce(frag, debounceTime);

        return [new Plugin({
            key: new PluginKey('languagetool'),
            state: {
                init() {
                    return {initialDone: false}; // track first change
                },
                apply(tr, val, _old, newState) {
                    // manual proof-read command
                    if (tr.getMeta('lt:proof') && editorView) {
                        debFull(newState.doc, editorView);
                        return {initialDone: true};
                    }
                    // regular typing edits
                    if (tr.docChanged && editorView) {
                        if (!val.initialDone) {
                            // skip the first implicit change generated by initial content
                            return {initialDone: true};
                        }
                        const span = changedSpan(tr);
                        if (span) debFrag(newState.doc, span, editorView);
                    }
                    return val;
                },
            },
            props: {attributes: {spellcheck: 'false'}},
            view(view) {
                editorView = view;
                // Run full-document proof-read exactly once per actual view
                if (!initialisedViews.has(view)) {
                    debFull(view.state.doc, view);
                    initialisedViews.add(view);
                }
                return {
                    update: v => (editorView = v),
                    destroy: () => (editorView = null),
                };
            },
        })];
    },
});

/* helper exports (unchanged) */
export function removeLanguageToolMarksFromJson(json) {
    if (Array.isArray(json.content)) {
        json.content = json.content.map(n => {
            if (n.marks) n.marks = n.marks.filter(m => m.type !== 'languagetool');
            if (n.content) n = removeLanguageToolMarksFromJson(n);
            return n;
        });
    }
    return json;
}

export function stripLanguageToolAnnotationsFromHTML(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    doc.querySelectorAll('span.lt').forEach(el => {
        const p = el.parentNode;
        while (el.firstChild) p.insertBefore(el.firstChild, el);
        p.removeChild(el);
    });
    return doc.body.innerHTML;
}
