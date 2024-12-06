import {Plugin} from 'prosemirror-state';
import {posToDOMRect} from '@tiptap/react';
import {spellingActionsPluginKey} from "./spellingActionsPluginKey.js";

export const SpellingActionsPlugin = ({updateDelay = 250, shouldShow}) => {
    return new Plugin({
        key: spellingActionsPluginKey,
        state: {
            init: () => ({
                open: false,
                anchorEl: null,
                matchData: null,
            }),
            apply(tr, prev) {
                const meta = tr.getMeta(spellingActionsPluginKey);
                if (meta) {
                    return meta;
                }
                return prev;
            },
        },
        view(editorView) {
            let updateDebounceTimer = null;

            const handleClick = (event) => {
                clearTimeout(updateDebounceTimer);

                updateDebounceTimer = setTimeout(() => {
                    const {state} = editorView;
                    const pos = editorView.posAtCoords({
                        left: event.clientX,
                        top: event.clientY,
                    });

                    if (!pos) {
                        // Hide the pop-up if no position is found
                        editorView.dispatch(
                            editorView.state.tr.setMeta(spellingActionsPluginKey, {
                                open: false,
                                anchorEl: null,
                                matchData: null,
                            })
                        );
                        return;
                    }

                    const $pos = state.doc.resolve(pos.pos);
                    const marks = $pos.marks();
                    const langToolMark = marks.find(
                        (mark) => mark.type.name === 'languagetool'
                    );

                    if (!langToolMark) {
                        // Hide the pop-up if there is no languagetool mark at the click position
                        editorView.dispatch(
                            editorView.state.tr.setMeta(spellingActionsPluginKey, {
                                open: false,
                                anchorEl: null,
                                matchData: null,
                            })
                        );
                        return;
                    }

                    const shouldShowPopper = shouldShow
                        ? shouldShow({editorView, state, pos: pos.pos})
                        : true;

                    if (!shouldShowPopper) {
                        // Hide the pop-up if shouldShow returns false
                        editorView.dispatch(
                            editorView.state.tr.setMeta(spellingActionsPluginKey, {
                                open: false,
                                anchorEl: null,
                                matchData: null,
                            })
                        );
                        return;
                    }

                    // Show the pop-up if a languagetool mark is found
                    const match = JSON.parse(langToolMark.attrs.match);
                    const domRect = posToDOMRect(editorView, pos.pos, pos.pos);
                    const virtualAnchorEl = {
                        getBoundingClientRect: () => domRect,
                    };

                    const popperState = {
                        open: true,
                        anchorEl: virtualAnchorEl,
                        matchData: match,
                    };

                    editorView.dispatch(
                        editorView.state.tr.setMeta(spellingActionsPluginKey, popperState)
                    );
                }, updateDelay);
            };

            // Add click event listener to the editor's DOM
            editorView.dom.addEventListener('click', handleClick);

            return {
                destroy() {
                    // Clear any pending timeouts and remove the event listener when the plugin is destroyed
                    clearTimeout(updateDebounceTimer);
                    editorView.dom.removeEventListener('click', handleClick);
                },
            };
        },
    });
};