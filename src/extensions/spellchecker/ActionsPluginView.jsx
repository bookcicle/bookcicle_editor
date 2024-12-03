import PropTypes from 'prop-types';
import {posToDOMRect} from '@tiptap/react';

export class ActionsView {
    constructor({editor, view, updateDelay = 250, shouldShow}) {
        this.editor = editor;
        this.view = view;
        this.updateDelay = updateDelay;
        this.shouldShow = shouldShow;

        // Removed the container and root creation since we're not rendering Popper here
        // this.container = document.createElement('div');
        // document.body.appendChild(this.container);
        // this.root = ReactDOM.createRoot(this.container);

        // Initial state
        this.state = {
            open: false,
            anchorEl: null,
            matchData: null,
        };

        // Bind methods
        this.update = this.update.bind(this);
        this.destroy = this.destroy.bind(this);
        this.acceptSuggestion = this.acceptSuggestion.bind(this);
        this.ignoreSuggestion = this.ignoreSuggestion.bind(this);
        // Removed binding of renderPopper
        // this.renderPopper = this.renderPopper.bind(this);

        // Removed initial render call
        // this.renderPopper();

        // Listeners
        this.editor.on('transaction', this.update);
        this.editor.on('focus', this.update);
        this.editor.on('blur', this.update);
    }

    update() {
        clearTimeout(this.updateDebounceTimer);

        // Ensure update runs outside the React render cycle
        this.updateDebounceTimer = setTimeout(() => {
            const {state, composing} = this.view;
            const {selection} = state;
            if (composing) {
                return;
            }

            const {from, to} = selection;

            const shouldShow = this.shouldShow?.({
                editor: this.editor,
                view: this.view,
                state,
                from,
                to,
            });

            if (!shouldShow) {
                this.state.open = false;
                // Removed renderPopper call
                // this.renderPopper();
                return;
            }

            const $from = selection.$from;
            const langToolMark = $from.marks().find(
                (mark) => mark.type.name === 'languagetool'
            );
            if (!langToolMark) {
                this.state.open = false;
                // Removed renderPopper call
                // this.renderPopper();
                return;
            }
            const match = JSON.parse(langToolMark.attrs.match);
            this.state.matchData = match;
            const domRect = posToDOMRect(this.view, from, to);
            const virtualAnchorEl = {
                getBoundingClientRect: () => domRect,
            };
            this.state.anchorEl = virtualAnchorEl;
            this.state.open = true;
            // Removed renderPopper call
            // this.renderPopper();
        }, this.updateDelay);
    }

    acceptSuggestion(suggestion) {
        this.editor
            .chain()
            .focus()
            .extendMarkRange('languagetool')
            .insertContent(suggestion)
            .unsetMark('languagetool')
            .run();
        this.state.open = false;
        // Removed renderPopper call
        // this.renderPopper();
    }

    ignoreSuggestion() {
        this.editor
            .chain()
            .focus()
            .extendMarkRange('languagetool')
            .unsetMark('languagetool')
            .run();
        this.state.open = false;
        // Removed renderPopper call
        // this.renderPopper();
    }

    destroy() {
        clearTimeout(this.updateDebounceTimer);

        // Removed unmounting and container removal
        // setTimeout(() => {
        //   this.root.unmount();
        //   document.body.removeChild(this.container);
        // }, 0);

        this.editor.off('transaction', this.update);
        this.editor.off('focus', this.update);
        this.editor.off('blur', this.update);
    }
}

// Add propTypes at the bottom
ActionsView.propTypes = {
    /** An instance of the TipTap Editor. */
    editor: PropTypes.object.isRequired,
    /** The ProseMirror editor view. */
    view: PropTypes.object.isRequired,
    /** Delay in milliseconds before the tooltip updates. */
    updateDelay: PropTypes.number,
    /** Function to determine whether to show the actions view. */
    shouldShow: PropTypes.func,
};