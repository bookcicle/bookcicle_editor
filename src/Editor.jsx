/** @jsxImportSource @emotion/react */
import { Global } from '@emotion/react';
import {
    forwardRef,
    useCallback,
    useContext,
    useEffect,
    useLayoutEffect,
    useRef
} from 'react';
import Quill from 'quill';
import styled from '@emotion/styled';
import { AppContext } from './AppContext.jsx';
import { useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import dynamicStyles from './helpers/dynamicStyles.js';
import katex from 'katex';

import './assets/css/quill.snow.css';
import './App.css';
import 'katex/dist/katex.min.css';

import QuillIcons from "./helpers/QuillIcons";

window.katex = katex;

/**
 * @typedef {Object} EditorSettings
 * @property {string} buttonSize - oneOf(['small', 'medium', 'large']),
 * @property {string} linePadding - oneOf(['small', 'medium', 'large']),
 * @property {string} languageCode - The language code for the editor (e.g., "en-US"). Default is "en-US".
 * @property {boolean} showGrammarSuggestions - Whether grammar suggestions are shown. Default is true.
 * @property {boolean} showLineHighlight - Whether line highlighting is enabled. Default is true.
 * @property {boolean} showLineNumbers - Whether line numbers are displayed. Default is true.
 * @property {boolean} showSpellingSuggestions - Whether spelling suggestions are shown. Default is true.
 */

/**
 * Editor component for rich text editing.
 *
 * @param {Object} props - The properties for the Editor component.
 * @param {boolean} props.readOnly - Whether the editor is in read-only mode.
 * @param {Object} props.defaultValue - The initial content of the editor as a Delta object.
 * @param {Function} props.onTextChange - Callback triggered when the text in the editor changes (plain text).
 * @param {Function} props.onSelectionChange - Callback triggered when the selection in the editor changes.
 * @param {Function} props.onDeltaChange - Callback triggered with the entire document Delta when content changes.
 * @param {Function} props.onDeltaChangeIteration - Callback triggered with individual Delta changes during content changes.
 * @param {EditorSettings} [props.editorSettings] - Configuration object for editor settings.
 */
const EditorContainer = styled.div`
    position: relative;
    height: 100%;
    width: 100%;
`;

const QuillEditorWrapper = styled.div`
    height: 100%;
    width: 100%;
    position: relative; /* Ensure that the pseudo-element is positioned correctly */

    .ql-editor {
        min-height: 100%;
        padding-left: 2.5em;
    }
`;

const Editor = forwardRef(({
                               readOnly,
                               defaultValue,
                               onTextChange,
                               onSelectionChange,
                               onDeltaChange,
                               onDeltaChangeIteration,
                               editorSettings = {
                                   showLineNumbers: true,
                                   showLineHighlight: true,
                                   buttonSize: "xs",
                                   linePadding: "xs",
                                   doubleNewlineOnEnter: false, // Added default for doubleNewlineOnEnter
                               }
                           }, ref) => {
    const containerRef = useRef(null);
    const defaultValueRef = useRef(defaultValue);
    const onTextChangeRef = useRef(onTextChange);
    const onSelectionChangeRef = useRef(onSelectionChange);
    const onDeltaChangeRef = useRef(onDeltaChange);
    const onDeltaChangeIterationRef = useRef(onDeltaChangeIteration);

    const { state } = useContext(AppContext);
    const theme = useTheme();

    /**
     * Highlights the active line based on the current cursor position.
     *
     * @param {Quill} quillInstance - The Quill editor instance.
     * @param {Object} range - The current selection range.
     */
    const highlightActiveLine = useCallback((quillInstance, range) => {
        if (editorSettings.showLineHighlight) {
            const editor = quillInstance.root;

            // Remove 'active-line' class from all block-level elements
            editor.querySelectorAll('.active-line').forEach(elem => {
                elem.classList.remove('active-line');
            });

            if (range && range.length === 0) { // Only when cursor is active (no text selected)
                const [line] = quillInstance.getLine(range.index);
                if (line && line.domNode) {
                    line.domNode.classList.add('active-line');
                }
            }
        }
    }, [editorSettings.showLineHighlight]);

    /**
     * Callback for handling plain text changes.
     */
    const handleTextChangeCallback = useCallback(() => {
        if (ref.current) {
            const text = ref.current.getText();
            onTextChangeRef.current?.(text);
        }
    }, [ref]);

    /**
     * Callback for handling the entire document Delta changes.
     */
    const handleDeltaChangeCallback = useCallback(() => {
        if (ref.current) {
            const fullDelta = ref.current.getContents();
            onDeltaChangeRef.current?.(fullDelta);
        }
    }, [ref]);

    /**
     * Callback for handling individual Delta changes (iterations).
     *
     * @param {Object} delta - The Delta object representing the change.
     */
    const handleDeltaChangeIterationCallback = useCallback((delta) => {
        if (ref.current && onDeltaChangeIterationRef.current) {
            onDeltaChangeIterationRef.current(delta);
        }
    }, [ref]);

    const undo = useCallback(() => {
        if (ref.current) {
            ref.current.history.undo();
        }
    }, [ref]);

    const redo = useCallback(() => {
        if (ref.current) {
            ref.current.history.redo();
        }
    }, [ref]);

    /**
     * Keeps the latest prop callbacks in refs to avoid stale closures.
     */
    useLayoutEffect(() => {
        onTextChangeRef.current = onTextChange;
        onSelectionChangeRef.current = onSelectionChange;
        onDeltaChangeRef.current = onDeltaChange;
        onDeltaChangeIterationRef.current = onDeltaChangeIteration;
    }, [onTextChange, onSelectionChange, onDeltaChange, onDeltaChangeIteration]);

    /**
     * Enables or disables the editor based on the readOnly prop.
     */
    useEffect(() => {
        if (ref.current) {
            ref.current.enable(!readOnly);
        }
    }, [ref, readOnly]);

    /**
     * Initializes the Quill editor and sets up event listeners.
     */
    useEffect(() => {
        if (!containerRef.current) {
            console.error('Container ref is not defined');
            return;
        }

        const container = containerRef.current;
        const editorContainer = container.appendChild(container.ownerDocument.createElement('div'));

        const toolbarOptions = [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote'],  // Blockquote icon
            ['link', 'image'],  // Link and image icons
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ script: 'sub' }, { script: 'super' }],  // Superscript and subscript icons
            ['formula'],  // Function (fx) icon
            [{ indent: '-1' }, { indent: '+1' }],  // Tab left and right icons
            [{ background: [] }],  // Background color (highlight) button
            [{ color: [] }],  // Text color button
            [{ align: [] }],
            ['clean'],
        ];
        // Initialize Quill editor with options
        const quill = new Quill(editorContainer, {
            formula: true,
            theme: 'snow',
            modules: {
                toolbar: toolbarOptions,
                history: {
                    delay: 1000,
                    maxStack: 100,
                    userOnly: false,
                },
            },
        });

        ref.current = quill;

        // Set the initial content if defaultValue is provided
        if (defaultValueRef.current) {
            quill.setContents(defaultValueRef.current);
            quill.history.clear();
        }

        /**
         * Handles the 'text-change' event.
         *
         * @param {Object} delta - The Delta object representing the change.
         * @param {Object} oldDelta - The Delta object representing the old content before the change.
         * @param {string} source - The source of the change ('user', 'api', or 'silent').
         */
        quill.on('text-change', (delta, oldDelta, source) => {
            // Handle plain text changes
            handleTextChangeCallback();

            // Handle individual Delta changes
            handleDeltaChangeIterationCallback(delta);

            // After the DOM has updated, handle entire Delta and highlighting
            setTimeout(() => {
                const range = quill.getSelection();
                highlightActiveLine(quill, range);
                // Handle entire Delta changes
                handleDeltaChangeCallback();
            }, 0);
        });

        /**
         * Handles the 'selection-change' event.
         *
         * @param {Object} range - The new selection range.
         * @param {Object} oldRange - The old selection range.
         * @param {string} source - The source of the change ('user', 'api', or 'silent').
         */
        quill.on('selection-change', (range, oldRange, source) => {
            onSelectionChangeRef.current?.(range, oldRange, source);
            highlightActiveLine(quill, range);
        });

        // Handle double newline behavior if set in editorSettings
        if (editorSettings.doubleNewlineOnEnter) {
            quill.keyboard.addBinding({ key: 13 }, () => {
                const range = quill.getSelection();
                quill.insertText(range.index, '\n\n');
                quill.setSelection(range.index + 2);
            });
        }

        // Clean up on unmount
        return () => {
            ref.current = null;
            container.innerHTML = '';
        };
    }, [
        handleTextChangeCallback,
        handleDeltaChangeCallback,
        handleDeltaChangeIterationCallback,
        redo,
        ref,
        state.appSettings.quillTheme,
        undo,
        editorSettings,
        highlightActiveLine
    ]);

    return (
        <div>
            {/* Initialize Quill icons */}
            <QuillIcons />
            <Global
                styles={dynamicStyles(
                    theme,
                    editorSettings.showLineNumbers,
                    editorSettings.showLineNumbers,
                    editorSettings.linePadding,
                    editorSettings.buttonSize
                )}
            />
            <EditorContainer>
                <QuillEditorWrapper className="quill-editor-wrapper">
                    <div ref={containerRef}></div>
                </QuillEditorWrapper>
            </EditorContainer>
        </div>
    );
});

Editor.displayName = 'Editor';

Editor.propTypes = {
    readOnly: PropTypes.bool.isRequired,
    defaultValue: PropTypes.object, // Expecting a Delta object
    onTextChange: PropTypes.func.isRequired,
    onSelectionChange: PropTypes.func.isRequired,
    onDeltaChange: PropTypes.func.isRequired, // New prop for handling entire Delta changes
    onDeltaChangeIteration: PropTypes.func.isRequired, // New prop for handling individual Delta changes
    editorSettings: PropTypes.shape({
        languageCode: PropTypes.string,
        showGrammarSuggestions: PropTypes.bool,
        showLineHighlight: PropTypes.bool,
        showLineNumbers: PropTypes.bool,
        showSpellingSuggestions: PropTypes.bool,
        buttonSize: PropTypes.oneOf(['small', 'medium', 'large']),
        linePadding: PropTypes.oneOf(['small', 'medium', 'large']),
        doubleNewlineOnEnter: PropTypes.bool, // Added based on your code
    }),
};

export default Editor;
