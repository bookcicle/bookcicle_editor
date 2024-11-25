import {Extension} from '@tiptap/core';
import {Plugin, PluginKey} from 'prosemirror-state';
import {DecorationSet} from 'prosemirror-view';
import Spellchecker from './spellchecker';
import {selectAll} from 'prosemirror-commands';

// Transactions caused by the spellchecker are marked with this metadata
export const SPELLCHECKER_TRANSACTION = 'spellchecker-transaction';
export const LOADING_TRANSACTION = 'loading';

// Define the Spellchecker extension
export const SpellcheckerExtension = Extension.create({
    name: 'spellchecker',

    addOptions() {
        return {
            proofreader: undefined,
            uiStrings: {
                noSuggestions: ''
            }
        };
    },

    addStorage() {
        return {
            didPaste: false,
            spellchecker: undefined,
        };
    },

    addCommands() {
        return {
            checkSpelling: () => ({ tr }) => {
                this.storage.spellchecker.proofreadDoc(tr.doc);
                return true;
            },
            selectAll: () => ({ state, dispatch }) => {
                selectAll(state, dispatch);
                return true;
            },
            copy: () => () => {
                document.execCommand('copy');
                return true;
            }
        };
    },

    addProseMirrorPlugins() {
        const that = this;
        return [
            new Plugin({
                key: new PluginKey('spellcheckerPlugin'),
                props: {
                    decorations(state) {
                        return this.getState(state);
                    },
                    handlePaste() {
                        that.storage.didPaste = true;
                    },
                    handleClick() {
                        const spellchecker = that.storage.spellchecker;
                        spellchecker.hideSuggestionBox();
                    }
                },
                state: {
                    init(config, instance) {
                        const spellchecker = new Spellchecker(
                            that.options.proofreader,
                            that.options.uiStrings,
                            that.options.onShowSuggestionsEvent
                        );
                        that.storage.spellchecker = spellchecker;
                        spellchecker.setDecorationSet(DecorationSet.create(instance.doc, []));

                        spellchecker.proofreadDoc(instance.doc);

                        return spellchecker.getDecorationSet();
                    },
                    apply(transaction) {
                        const spellchecker = that.storage.spellchecker;
                        if (transaction.getMeta(SPELLCHECKER_TRANSACTION)) {
                            return spellchecker.getDecorationSet();
                        }

                        if (transaction.docChanged) {
                            if (that.storage.didPaste) {
                                that.storage.didPaste = false;
                                spellchecker.debouncedProofreadDoc(transaction.doc);
                            } else {
                                spellchecker.debouncedProofreadDoc(transaction.doc);
                            }
                        }

                        setTimeout(spellchecker.addEventListenersToDecorations, 100);
                        return spellchecker.getDecorationSet();
                    }
                },
                view: () => ({
                    update: (view) => {
                        const spellchecker = that.storage.spellchecker;
                        spellchecker.setEditorView(view);

                        view?.dom?.parentNode?.appendChild(spellchecker.getSuggestionBox());

                        setTimeout(spellchecker.addEventListenersToDecorations, 100);
                    },
                }),
            }),
        ];
    }
});