import { Plugin, PluginKey } from '@tiptap/pm/state';
import { ActionsView } from './ActionsPluginView.js';

class SpellingActionsPluginView extends ActionsView {
    shouldShow = ({ view, state, from, to }) => {
        const { selection } = state;
        const { $from } = selection;

        // When selection's start and end position are equal, it means the selection
        // is a cursor selection
        const isCursorSelection = from === to;

        console.log($from.marks())

        // Link mark is present on the selection
        const hasLinkMark = $from.marks().some((mark) => mark.type.name === 'languagetool');

        // When clicking on an element inside the link actions menu the editor "blur" event
        // is called and the link actions menu item is focused. In this case, we should
        // consider the menu as part of the editor and keep showing the menu
        const isChildOfMenu = this.element.contains(document.activeElement);

        const hasEditorFocus = view.hasFocus() || isChildOfMenu;

        if (!isCursorSelection || !hasEditorFocus || !this.editor.isEditable || !hasLinkMark) {
            return false;
        }

        return true;
    };

    constructor(linkActionsViewProps) {
        super(linkActionsViewProps);
    }
}

// Plugin to show link actions on click
export const SpellingActionsPlugin = (options) => {
    return new Plugin({
        key: typeof options.pluginKey === 'string'
            ? new PluginKey(options.pluginKey)
            : options.pluginKey,
        view: (view) => new SpellingActionsPluginView({ view, ...options }),
    });
};
