import {Plugin, PluginKey} from '@tiptap/pm/state';
import {ActionsView} from './ActionsPluginView.js';

class SpellingActionsPluginView extends ActionsView {
    shouldShow = ({view, state, from, to}) => {
        const {selection} = state;
        const {$from} = selection;

        const isCursorSelection = from === to;

        const hasLinkMark = $from.marks().some((mark) => mark.type.name === 'languagetool');

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

export const SpellingActionsPlugin = (options) => {
    return new Plugin({
        key: typeof options.pluginKey === 'string' ? new PluginKey(options.pluginKey) : options.pluginKey,
        view: (view) => new SpellingActionsPluginView({view, ...options}),
    });
};
