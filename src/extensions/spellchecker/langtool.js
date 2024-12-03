import {Mark} from '@tiptap/core';
import {Plugin, PluginKey} from 'prosemirror-state';
import {debounce} from 'lodash';
import {v4 as uuidv4} from 'uuid';
import db from '../../db/db.js';

export const LanguageToolHelpingWords = {
    LanguageToolTransactionName: 'languageToolTransaction',
    MatchUpdatedTransactionName: 'matchUpdated',
    LoadingTransactionName: 'languageToolLoading',
};

let editorView = null;
let proofReadInitially = false;

export const LanguageToolMark = Mark.create({
    name: 'languagetool',

    addOptions() {
        return {
            apiUrl: '',
            language: 'auto',
            automaticMode: true,
            documentId: undefined,
            debounceTime: 1000,
            maxWordsPerRequest: 500,
            enableSpellcheck: true,
            enableGrammarCheck: true,
        };
    },

    addAttributes() {
        return {
            match: {
                default: null,
            },
            uuid: {
                default: null,
            },
            class: {
                default: null,
            }, // Allow dynamic classes
        };
    },

    parseHTML() {
        return [
            {
                tag: 'span.lt',
                getAttrs: (dom) => ({
                    match: dom.getAttribute('data-match') || null,
                    uuid: dom.getAttribute('data-uuid') || null,
                    class: dom.getAttribute('class') || null,
                }),
            },
        ];
    },

    renderHTML({HTMLAttributes}) {
        const {match, uuid, ...rest} = HTMLAttributes;
        return [
            'span',
            {
                ...rest, // Use the rest of the attributes, including class
                'data-match': match,
                'data-uuid': uuid,
            },
            0,
        ];
    },

    addCommands() {
        return {
            proofread:
                () =>
                    ({editor}) => {
                        if (editorView && this.options.automaticMode) {
                            const {doc} = editor.state;
                            // Call processDocument from the closure
                            this.processDocument(doc, editorView);
                        }
                        return true;
                    },
            ignoreLanguageToolSuggestion:
                () =>
                    ({editor}) => {
                        const {selection, doc} = editor.state;
                        const {from, to} = selection;
                        const content = doc.textBetween(from, to);

                        if (this.options.documentId) {
                            db.ignoredWords.add({
                                value: content,
                                documentId: String(this.options.documentId),
                            });
                        }
                        return editor.commands.unsetMark('languagetool', {from, to});
                    },
        };
    },

    addProseMirrorPlugins() {
        const extension = this; // Capture 'this' context
        const {
            apiUrl,
            language,
            automaticMode,
            debounceTime,
        } = this.options;

        const getClassForCategoryId = (categoryId) => {
            const spellingCategories = [
                'TYPOS',
                'CASING',
                'COMPOUNDING',
                'CONFUSED_WORDS',
            ];
            const grammarCategories = [
                'GRAMMAR',
                'PUNCTUATION',
                'REDUNDANCY',
                'REPETITIONS',
                'REPETITIONS_STYLE',
                'SEMANTICS',
                'GENDER_NEUTRALITY',
                'FALSE_FRIENDS',
                'TYPOGRAPHY',
            ];
            if (spellingCategories.includes(categoryId)) {
                return 'lt lt-spelling-error';
            } else if (grammarCategories.includes(categoryId)) {
                return 'lt lt-grammar-error';
            } else {
                return 'lt lt-other-error';
            }
        };

        const getMatchType = (categoryId) => {
            const spellingCategories = [
                'TYPOS',
                'CASING',
                'COMPOUNDING',
                'CONFUSED_WORDS',
            ];
            const grammarCategories = [
                'GRAMMAR',
                'PUNCTUATION',
                'REDUNDANCY',
                'REPETITIONS',
                'REPETITIONS_STYLE',
                'SEMANTICS',
                'GENDER_NEUTRALITY',
                'FALSE_FRIENDS',
                'TYPOGRAPHY',
            ];
            if (spellingCategories.includes(categoryId)) {
                return 'spelling';
            } else if (grammarCategories.includes(categoryId)) {
                return 'grammar';
            } else {
                return 'other';
            }
        };

        const fetchSuggestions = async (text, offset = 0) => {
            if (!apiUrl) return [];
            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        Accept: 'application/json',
                    },
                    body: `text=${encodeURIComponent(text)}&language=${
                        language
                    }&enabledOnly=false`,
                });
                const data = await response.json();
                return (data.matches || []).map((match) => ({
                    ...match,
                    offset: match.offset + offset,
                }));
            } catch (error) {
                console.error('LanguageTool API error:', error);
                return [];
            }
        };

        const filterByOptions = (matches) => {
            return matches.filter((match) => {
                const categoryId = match?.rule?.category?.id || 'TYPOS';
                const matchType = getMatchType(categoryId);
                if (
                    (matchType === 'spelling' && !extension.options.enableSpellcheck) ||
                    (matchType === 'grammar' && !extension.options.enableGrammarCheck)
                ) {
                    return false; // Skip this match
                }
                return true;
            });
        };

        const filterIgnoredMatches = async (matches, doc, mapping) => {
            const uniqueMatches = [];
            for (const match of matches) {
                const fromOffset = match.offset;
                const toOffset = match.offset + match.length - 1;
                const from = mapping[fromOffset];
                const to =
                    mapping[toOffset] !== undefined
                        ? mapping[toOffset] + 1
                        : from + match.length;
                const content = doc.textBetween(from, to);

                let ignored = false;
                if (extension.options.documentId) {
                    if (
                        match.rule.id === 'MORFOLOGIK_RULE_EN_US' ||
                        match.rule.id === 'MORFOLOGIK_RULE_EN_GB'
                    ) {
                        // Spelling error, check ignoredWords
                        ignored = await db.ignoredWords
                            .where('[value+documentId]')
                            .equals([content, String(extension.options.documentId)])
                            .first();
                    } else {
                        // Grammar error, check ignoredGrammarErrors
                        ignored = await db.ignoredGrammarErrors
                            .where('[ruleId+contextText+contextOffset+documentId]')
                            .equals([
                                match.rule.id,
                                match.context.text,
                                match.context.offset,
                                String(extension.options.documentId),
                            ])
                            .first();
                    }
                }

                if (!ignored) {
                    uniqueMatches.push(match);
                }
            }
            return uniqueMatches;
        };

        const applyMarks = (view, matches, mapping) => {
            const {tr, schema} = view.state;

            // Remove existing marks
            view.state.doc.nodesBetween(
                0,
                view.state.doc.content.size,
                (node, pos) => {
                    if (node.isText) {
                        const marks = node.marks.filter(
                            (m) => m.type.name === 'languagetool'
                        );
                        if (marks.length > 0) {
                            tr.removeMark(
                                pos,
                                pos + node.nodeSize,
                                schema.marks.languagetool
                            );
                        }
                    }
                }
            );

            // Apply new marks with appropriate classes
            matches.forEach((match) => {
                const fromOffset = match.offset;
                const toOffset = match.offset + match.length - 1;
                const from = mapping[fromOffset];
                const to =
                    mapping[toOffset] !== undefined
                        ? mapping[toOffset] + 1
                        : from + match.length;
                if (
                    from !== undefined &&
                    to !== undefined &&
                    from >= 0 &&
                    to <= view.state.doc.content.size
                ) {
                    tr.addMark(
                        from,
                        to,
                        view.state.schema.marks.languagetool.create({
                            match: JSON.stringify(match),
                            uuid: uuidv4(),
                            class: getClassForCategoryId(
                                match?.rule?.category?.id || 'TYPOS'
                            ),
                        })
                    );
                }
            });

            tr.setMeta('languageToolProcessing', true);
            view.dispatch(tr);

            // Add event listeners
            setTimeout(addMarkListeners, 0);
        };

        // Event handling
        const handleMouseEnter = (e) => {
            const matchData = e.target.getAttribute('data-match');
            updateCurrentMatch(matchData ? JSON.parse(matchData) : undefined);
        };

        const handleMouseLeave = () => {
            updateCurrentMatch(undefined);
        };

        const addMarkListeners = () => {
            document.querySelectorAll('span.lt').forEach((mark) => {
                mark.removeEventListener('mouseenter', handleMouseEnter);
                mark.removeEventListener('mouseleave', handleMouseLeave);
                mark.addEventListener('mouseenter', handleMouseEnter);
                mark.addEventListener('mouseleave', handleMouseLeave);
            });
        };

        const updateCurrentMatch = (match) => {
            if (editorView) {
                editorView.dispatch(editorView.state.tr.setMeta('match', match));
            }
        };

        const processDocument = async (doc, view) => {
            if (
                !extension.options.enableSpellcheck &&
                !extension.options.enableGrammarCheck
            ) {
                return; // Skip processing if both options are disabled
            }

            let text = '';
            const mapping = []; // text offset -> doc position
            let lastDocPos = 0;
            let textOffset = 0;

            doc.descendants((node, pos) => {
                if (node.isText) {
                    const nodeText = node.text;
                    for (let i = 0; i < nodeText.length; i++) {
                        text += nodeText[i];
                        mapping[textOffset] = pos + i;
                        textOffset++;
                    }
                    lastDocPos = pos + node.nodeSize;
                } else if (node.isInline && !node.isText) {
                    // Inline non-text node, e.g., image
                    text += ' ';
                    mapping[textOffset] = pos;
                    textOffset++;
                    lastDocPos = pos + node.nodeSize;
                } else if (node.isBlock) {
                    if (text.length > 0 && text[text.length - 1] !== '\n') {
                        // Add newline between blocks
                        text += '\n';
                        // Map this newline character to a position after the block node
                        mapping[textOffset] = lastDocPos;
                        textOffset++;
                    }
                    lastDocPos = pos + node.nodeSize;
                }
            });

            // Send text to LanguageTool
            const matches = await fetchSuggestions(text);

            // Filter matches based on enabled options
            const matchesAfterOptionFiltering = filterByOptions(matches);

            // Filter out ignored matches (if applicable)
            const filteredMatches = await filterIgnoredMatches(
                matchesAfterOptionFiltering,
                doc,
                mapping
            );

            // Apply the marks
            applyMarks(view, filteredMatches, mapping);
        };

        // Debounce the processDocument function
        const debouncedProcess = debounce(processDocument, debounceTime);

        // Assign processDocument to the extension for access in commands
        this.processDocument = processDocument;

        // Create and return the plugin
        return [
            new Plugin({
                key: new PluginKey('languagetool'),
                state: {
                    init(_, {doc}) {
                        if (automaticMode && editorView) {
                            debouncedProcess(doc, editorView);
                        }
                        return null;
                    },
                    apply(tr, _, __, newState) {
                        if (
                            !tr.getMeta('languageToolProcessing') &&
                            tr.docChanged &&
                            extension.options.automaticMode &&
                            editorView
                        ) {
                            debouncedProcess(newState.doc, editorView);
                        }
                        return null;
                    },
                },
                props: {
                    decorations: () => null,
                    attributes: {
                        spellcheck: 'false',
                    },
                },
                view(view) {
                    editorView = view;
                    if (extension.options.automaticMode && !proofReadInitially) {
                        debouncedProcess(view.state.doc, view);
                        proofReadInitially = true;
                    }
                    return {
                        update: (v) => {
                            editorView = v;
                        },
                        destroy: () => {
                            editorView = null;
                        },
                    };
                },
            }),
        ];
    },
});

export function removeLanguageToolMarksFromJson(jsonContent) {
    if (Array.isArray(jsonContent.content)) {
        jsonContent.content = jsonContent.content.map((node) => {
            if (node.marks) {
                node.marks = node.marks.filter(
                    (mark) => mark.type !== 'languagetool'
                );
            }
            if (node.content) {
                node = removeLanguageToolMarksFromJson(node);
            }
            return node;
        });
    }
    return jsonContent;
}

export function stripLanguageToolAnnotationsFromHTML(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const elements = doc.querySelectorAll('span.lt');

    elements.forEach(el => {
        const parent = el.parentNode;
        // Replace the span with its child nodes
        while (el.firstChild) {
            parent.insertBefore(el.firstChild, el);
        }
        parent.removeChild(el);
    });

    return doc.body.innerHTML;
}