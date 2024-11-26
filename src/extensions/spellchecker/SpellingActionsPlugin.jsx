import { Plugin, PluginKey } from 'prosemirror-state';
import { posToDOMRect } from '@tiptap/react';

export const spellingActionsPluginKey = new PluginKey('spellingActions');

export const SpellingActionsPlugin = ({ updateDelay = 250, shouldShow }) => {
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

            const update = () => {
                clearTimeout(updateDebounceTimer);
                updateDebounceTimer = setTimeout(() => {
                    const { state, composing } = editorView;
                    const { selection } = state;

                    if (composing) {
                        return;
                    }

                    const { from, to } = selection;
                    const shouldShowPopper = shouldShow
                        ? shouldShow({ editorView, state, from, to })
                        : true;

                    if (!shouldShowPopper) {
                        editorView.dispatch(
                            editorView.state.tr.setMeta(spellingActionsPluginKey, {
                                open: false,
                                anchorEl: null,
                                matchData: null,
                            })
                        );
                        return;
                    }

                    const $from = selection.$from;
                    const langToolMark = $from.marks().find(
                        (mark) => mark.type.name === 'languagetool'
                    );

                    if (!langToolMark) {
                        editorView.dispatch(
                            editorView.state.tr.setMeta(spellingActionsPluginKey, {
                                open: false,
                                anchorEl: null,
                                matchData: null,
                            })
                        );
                        return;
                    }

                    const match = JSON.parse(langToolMark.attrs.match);

                    const domRect = posToDOMRect(editorView, from, to);
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

            update(); // Initial call

            return {
                update: update,
                destroy() {
                    clearTimeout(updateDebounceTimer);
                },
            };
        },
    });
};