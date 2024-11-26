import { Mark } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';
import { debounce } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import Dexie from 'dexie';

let editorView = null;
let db = null;
let currentMatch = undefined;
let proofReadInitially = false;

export const LanguageToolHelpingWords = {
    LanguageToolTransactionName: 'languageToolTransaction',
    MatchUpdatedTransactionName: 'matchUpdated',
    LoadingTransactionName: 'languageToolLoading',
};

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
        };
    },

    addAttributes() {
        return {
            match: { default: null },
            uuid: { default: null },
            class: { default: null }, // Allow dynamic classes
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

    renderHTML({ HTMLAttributes }) {
        const { match, uuid, ...rest } = HTMLAttributes;
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
                    ({ editor }) => {
                        if (editorView && this.options.automaticMode) {
                            const { doc } = editor.state;
                            processDocument(doc, editorView);
                        }
                        return true;
                    },

            toggleProofreading:
                () =>
                    ({ commands }) => {
                        this.options.automaticMode = !this.options.automaticMode;
                        return commands.proofread();
                    },

            ignoreLanguageToolSuggestion:
                () =>
                    ({ editor }) => {
                        const { selection, doc } = editor.state;
                        const { from, to } = selection;
                        const content = doc.textBetween(from, to);
                        if (this.options.documentId) {
                            db.ignoredWords.add({
                                value: content,
                                documentId: String(this.options.documentId),
                            });
                        }
                        return editor.commands.unsetMark('languagetool', { from, to });
                    },
        };
    },

    addProseMirrorPlugins() {
        const extension = this;
        const { apiUrl, language, automaticMode, documentId, debounceTime } = this.options;

        // Initialize database if documentId is provided
        if (documentId) {
            db = new Dexie('LanguageToolIgnoredSuggestions');
            db.version(1).stores({
                ignoredWords: '++id, &value, documentId',
            });
        }

        // Core functionality helpers
        const fetchSuggestions = async (text, offset = 0) => {
            if (!apiUrl) return [];
            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        Accept: 'application/json',
                    },
                    body: `text=${encodeURIComponent(text)}&language=${language}&enabledOnly=false`,
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

        const filterIgnoredMatches = async (matches, doc) => {
            if (!documentId) return matches;
            const uniqueMatches = [];
            for (const match of matches) {
                const content = doc.textBetween(match.offset, match.offset + match.length);
                const ignored = await db.ignoredWords.get({
                    value: content,
                    documentId: String(documentId),
                });
                if (!ignored) uniqueMatches.push(match);
            }
            return uniqueMatches;
        };

        // Function to determine the class based on issue type
        const getClassForIssueType = (issueType) => {
            switch (issueType) {
                case 'misspelling':
                    return 'lt lt-spelling-error'; // Red for spelling errors
                case 'grammar':
                    return 'lt lt-grammar-error'; // Green for grammar errors
                case 'typographical':
                    return 'lt lt-typography-error'; // Yellow for typographical errors
                default:
                    return 'lt lt-other-error'; // Default class
            }
        };

        const applyMarks = (view, matches, mapping) => {
            const { tr, schema } = view.state;

            // Remove existing marks
            view.state.doc.nodesBetween(0, view.state.doc.content.size, (node, pos) => {
                if (node.isText) {
                    const marks = node.marks.filter((m) => m.type.name === 'languagetool');
                    if (marks.length > 0) {
                        tr.removeMark(pos, pos + node.nodeSize, schema.marks.languagetool);
                    }
                }
            });

            // Apply new marks with appropriate classes
            matches.forEach((match) => {
                const fromOffset = match.offset;
                const toOffset = match.offset + match.length - 1;
                const from = mapping[fromOffset];
                const to =
                    mapping[toOffset] !== undefined
                        ? mapping[toOffset] + 1 // Include the last character
                        : from + match.length; // Fallback in case mapping is undefined

                if (
                    from !== undefined &&
                    to !== undefined &&
                    from >= 0 &&
                    to <= view.state.doc.content.size
                ) {
                    tr.addMark(
                        from,
                        to,
                        schema.marks.languagetool.create({
                            match: JSON.stringify(match),
                            uuid: uuidv4(),
                            class: getClassForIssueType(match.rule.issueType),
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
            currentMatch = match;
            if (editorView) {
                editorView.dispatch(editorView.state.tr.setMeta('match', match));
            }
        };

        // Document processing
        const processDocument = async (doc, view) => {
            // Build mapping from text offsets to document positions
            let text = '';
            let mapping = []; // text offset to doc position mapping
            let textOffset = 0;
            doc.descendants((node, pos) => {
                if (node.isText) {
                    const nodeText = node.text;
                    for (let i = 0; i < nodeText.length; i++) {
                        text += nodeText[i];
                        mapping[textOffset] = pos + i;
                        textOffset++;
                    }
                } else if (node.isInline && !node.isText) {
                    // Handle non-text inline nodes, e.g., images or formulas
                    const nodeText = ' '; // Placeholder for non-text nodes
                    text += nodeText;
                    mapping[textOffset] = pos;
                    textOffset++;
                }
            });
            const matches = await fetchSuggestions(text);
            const filteredMatches = await filterIgnoredMatches(matches, doc);
            // Apply the marks
            applyMarks(view, filteredMatches, mapping);
        };

        const debouncedProcess = debounce(processDocument, debounceTime);

        // Create and return the plugin
        return [
            new Plugin({
                key: new PluginKey('languagetool'),
                state: {
                    init(_, { doc }) {
                        if (automaticMode && editorView) {
                            debouncedProcess(doc, editorView);
                        }
                        return null;
                    },
                    apply(tr, _, __, newState) {
                        if (
                            !tr.getMeta('languageToolProcessing') &&
                            tr.docChanged &&
                            automaticMode &&
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
                    if (automaticMode && !proofReadInitially) {
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