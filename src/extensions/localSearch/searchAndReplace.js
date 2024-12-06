import {Extension} from "@tiptap/core";
import {Decoration, DecorationSet} from "@tiptap/pm/view";
import {Plugin, PluginKey} from "@tiptap/pm/state";


/**
 * @typedef {Object} TextNodesWithPosition
 * @property {string} text
 * @property {number} pos
 */

/**
 * Generates a regular expression based on the search parameters.
 *
 * @param {string} s - The search string.
 * @param {boolean} disableRegex - Whether to disable regex.
 * @param {boolean} caseSensitive - Whether the search is case sensitive.
 * @returns {RegExp} The generated regular expression.
 */
const getRegex = (s, disableRegex, caseSensitive) => {
    return RegExp(
        disableRegex ? s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") : s,
        caseSensitive ? "gu" : "gui"
    );
};

/**
 * @typedef {Object} ProcessedSearches
 * @property {DecorationSet} decorationsToReturn
 * @property {Range[]} results
 */

/**
 * Processes the document to find search results and create decorations.
 *
 * @param {PMNode} doc - The ProseMirror document node.
 * @param {RegExp} searchTerm - The search term as a regular expression.
 * @param {string} searchResultClass - The CSS class for search results.
 * @param {number} resultIndex - The index of the current search result.
 * @returns {ProcessedSearches} The processed search results and decorations.
 */
function processSearches(doc, searchTerm, searchResultClass, resultIndex) {
    const decorations = [];
    const results = [];

    let textNodesWithPosition = [];
    let index = 0;

    if (!searchTerm) {
        return {
            decorationsToReturn: DecorationSet.empty,
            results: [],
        };
    }

    doc?.descendants((node, pos) => {
        if (node.isText) {
            if (textNodesWithPosition[index]) {
                textNodesWithPosition[index] = {
                    text: textNodesWithPosition[index].text + node.text,
                    pos: textNodesWithPosition[index].pos,
                };
            } else {
                textNodesWithPosition[index] = {
                    text: `${node.text}`,
                    pos,
                };
            }
        } else {
            index += 1;
        }
    });

    textNodesWithPosition = textNodesWithPosition.filter(Boolean);

    for (const element of textNodesWithPosition) {
        const {text, pos} = element;
        const matches = Array.from(text.matchAll(searchTerm)).filter(
            ([matchText]) => matchText.trim()
        );

        for (const m of matches) {
            if (m[0] === "") break;

            if (m.index !== undefined) {
                results.push({
                    from: pos + m.index,
                    to: pos + m.index + m[0].length,
                });
            }
        }
    }

    for (let i = 0; i < results.length; i += 1) {
        const r = results[i];
        const className =
            i === resultIndex
                ? `${searchResultClass} ${searchResultClass}-current`
                : searchResultClass;
        const decoration = Decoration.inline(r.from, r.to, {
            class: className,
        });

        decorations.push(decoration);
    }

    return {
        decorationsToReturn: DecorationSet.create(doc, decorations),
        results,
    };
};

/**
 * Replaces the first instance of the search result with the replace term.
 *
 * @param {string} replaceTerm - The term to replace with.
 * @param {Range[]} results - The search results.
 * @param {Object} param2 - Contains state and dispatch.
 */
const replace = (replaceTerm, results, {state, dispatch}) => {
    const firstResult = results[0];

    if (!firstResult) return;

    const {from, to} = results[0];

    if (dispatch) dispatch(state.tr.insertText(replaceTerm, from, to));
};

/**
 * Rebases the next search result after a replacement.
 *
 * @param {string} replaceTerm - The term to replace with.
 * @param {number} index - The current index in the results.
 * @param {number} lastOffset - The last offset applied.
 * @param {Range[]} results - The search results.
 * @returns {[number, Range[]] | null} The new offset and updated results or null.
 */
const rebaseNextResult = (replaceTerm, index, lastOffset, results) => {
    const nextIndex = index + 1;

    if (!results[nextIndex]) return null;

    const {from: currentFrom, to: currentTo} = results[index];

    const offset = currentTo - currentFrom - replaceTerm.length + lastOffset;

    const {from, to} = results[nextIndex];

    results[nextIndex] = {
        to: to - offset,
        from: from - offset,
    };

    return [offset, results];
};

/**
 * Replaces all instances of the search result with the replace term.
 *
 * @param {string} replaceTerm - The term to replace with.
 * @param {Range[]} results - The search results.
 * @param {Object} param2 - Contains transaction and dispatch.
 */
const replaceAll = (replaceTerm, results, {tr, dispatch}) => {
    let offset = 0;

    let resultsCopy = results.slice();

    if (!resultsCopy.length) return;

    for (let i = 0; i < resultsCopy.length; i += 1) {
        const {from, to} = resultsCopy[i];

        tr.insertText(replaceTerm, from, to);

        const rebaseNextResultResponse = rebaseNextResult(
            replaceTerm,
            i,
            offset,
            resultsCopy
        );

        if (!rebaseNextResultResponse) continue;

        offset = rebaseNextResultResponse[0];
        resultsCopy = rebaseNextResultResponse[1];
    }

    dispatch(tr);
};

export const searchAndReplacePluginKey = new PluginKey(
    "searchAndReplacePlugin"
);

/**
 * @typedef {Object} SearchAndReplaceOptions
 * @property {string} searchResultClass
 * @property {boolean} disableRegex
 */

/**
 * @typedef {Object} SearchAndReplaceStorage
 * @property {string} searchTerm
 * @property {string} replaceTerm
 * @property {Range[]} results
 * @property {string} lastSearchTerm
 * @property {boolean} caseSensitive
 * @property {boolean} lastCaseSensitive
 * @property {number} resultIndex
 * @property {number} lastResultIndex
 */

export const SearchAndReplace = Extension.create({
    name: "searchAndReplace",

    addOptions() {
        return {
            searchResultClass: "search-result",
            disableRegex: true,
        };
    },

    addStorage() {
        return {
            searchTerm: "",
            replaceTerm: "",
            results: [],
            lastSearchTerm: "",
            caseSensitive: false,
            lastCaseSensitive: false,
            resultIndex: 0,
            lastResultIndex: 0,
        };
    },

    addCommands() {
        return {
            /**
             * @description Set search term in extension.
             */
            setSearchTerm: (searchTerm) => ({editor}) => {
                editor.storage.searchAndReplace.searchTerm = searchTerm;

                return false;
            },
            /**
             * @description Set replace term in extension.
             */
            setReplaceTerm: (replaceTerm) => ({editor}) => {
                editor.storage.searchAndReplace.replaceTerm = replaceTerm;

                return false;
            },
            /**
             * @description Set case sensitivity in extension.
             */
            setCaseSensitive: (caseSensitive) => ({editor}) => {
                editor.storage.searchAndReplace.caseSensitive = caseSensitive;

                return false;
            },
            /**
             * @description Reset current search result to first instance.
             */
            resetIndex: () => ({editor}) => {
                editor.storage.searchAndReplace.resultIndex = 0;

                return false;
            },
            /**
             * @description Find next instance of search result.
             */
            nextSearchResult: () => ({editor}) => {
                const {results, resultIndex} = editor.storage.searchAndReplace;

                const nextIndex = resultIndex + 1;

                if (results[nextIndex]) {
                    editor.storage.searchAndReplace.resultIndex = nextIndex;
                } else {
                    editor.storage.searchAndReplace.resultIndex = 0;
                }

                return false;
            },
            /**
             * @description Find previous instance of search result.
             */
            previousSearchResult: () => ({editor}) => {
                const {results, resultIndex} = editor.storage.searchAndReplace;

                const prevIndex = resultIndex - 1;

                if (results[prevIndex]) {
                    editor.storage.searchAndReplace.resultIndex = prevIndex;
                } else {
                    editor.storage.searchAndReplace.resultIndex = results.length - 1;
                }

                return false;
            },
            /**
             * @description Replace first instance of search result with given replace term.
             */
            replace: () => ({editor, state, dispatch}) => {
                const {replaceTerm, results} = editor.storage.searchAndReplace;

                replace(replaceTerm, results, {state, dispatch});

                return false;
            },
            /**
             * @description Replace all instances of search result with given replace term.
             */
            replaceAll: () => ({editor, tr, dispatch}) => {
                const {replaceTerm, results} = editor.storage.searchAndReplace;

                replaceAll(replaceTerm, results, {tr, dispatch});

                return false;
            },
        };
    },

    addProseMirrorPlugins() {
        const editor = this.editor;
        const {searchResultClass, disableRegex} = this.options;

        const setLastSearchTerm = (t) =>
            (editor.storage.searchAndReplace.lastSearchTerm = t);
        const setLastCaseSensitive = (t) =>
            (editor.storage.searchAndReplace.lastCaseSensitive = t);
        const setLastResultIndex = (t) =>
            (editor.storage.searchAndReplace.lastResultIndex = t);

        return [
            new Plugin({
                key: searchAndReplacePluginKey,
                state: {
                    init: () => DecorationSet.empty,
                    apply(tr, oldState) {
                        const {docChanged, doc} = tr;
                        const {
                            searchTerm,
                            lastSearchTerm,
                            caseSensitive,
                            lastCaseSensitive,
                            resultIndex,
                            lastResultIndex,
                        } = editor.storage.searchAndReplace;

                        if (
                            !docChanged &&
                            lastSearchTerm === searchTerm &&
                            lastCaseSensitive === caseSensitive &&
                            lastResultIndex === resultIndex
                        )
                            return oldState;

                        setLastSearchTerm(searchTerm);
                        setLastCaseSensitive(caseSensitive);
                        setLastResultIndex(resultIndex);

                        if (!searchTerm) {
                            editor.storage.searchAndReplace.results = [];
                            return DecorationSet.empty;
                        }

                        const {decorationsToReturn, results} = processSearches(
                            doc,
                            getRegex(searchTerm, disableRegex, caseSensitive),
                            searchResultClass,
                            resultIndex
                        );

                        editor.storage.searchAndReplace.results = results;

                        return decorationsToReturn;
                    },
                },
                props: {
                    decorations(state) {
                        return this.getState(state);
                    },
                },
            }),
        ];
    },
});

export default SearchAndReplace;
