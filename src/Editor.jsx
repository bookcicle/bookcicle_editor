/** @jsxImportSource @emotion/react */
import {Global, css} from '@emotion/react';
import React, {
    forwardRef, useCallback, useContext, useEffect, useLayoutEffect, useRef
} from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // Ensure Quill CSS is imported for proper styling
import styled from '@emotion/styled';
import {AppContext} from './AppContext.jsx';
import DesktopToolbarActions from './toolbar/DesktopToolbarActions';
import {alpha, useTheme} from '@mui/material';
import PropTypes from 'prop-types';

// Styled components for the editor container and wrapper
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
                               readOnly, defaultValue, onTextChange, onSelectionChange
                           }, ref) => {
    const containerRef = useRef(null);
    const defaultValueRef = useRef(defaultValue);
    const onTextChangeRef = useRef(onTextChange);
    const onSelectionChangeRef = useRef(onSelectionChange);

    const [currentHeader, setCurrentHeader] = React.useState(0);
    const [currentBold, setCurrentBold] = React.useState(false);
    console.log(currentBold)
    const {state} = useContext(AppContext);
    const theme = useTheme();

    const handleTextChange = useCallback(() => {
        if (ref.current) {
            onTextChangeRef.current?.(ref.current.getText());
        }
    }, [ref]);

    const undo = useCallback(() => {
        if (ref.current) {
            ref.current.history.undo();
        }
    }, [ref])

    const redo = useCallback(() => {
        if (ref.current) {
            ref.current.history.redo();
        }
    }, [ref])

    useLayoutEffect(() => {
        onTextChangeRef.current = onTextChange;
        onSelectionChangeRef.current = onSelectionChange;
    }, [onTextChange, onSelectionChange]);

    useEffect(() => {
        if (ref.current) {
            ref.current.enable(!readOnly);
        }
    }, [ref, readOnly]);

    useEffect(() => {
        if (!containerRef.current) {
            console.error('Container ref is not defined');
            return;
        }

        const container = containerRef.current;
        const editorContainer = container.appendChild(container.ownerDocument.createElement('div'));

        const quill = new Quill(editorContainer, {
            formats: ['header', 'bold', 'italic', 'underline', 'background', 'blockquote'], modules: {
                toolbar: {
                    container: "#toolbar", handlers: {
                        "undo": undo, "redo": redo,
                    }
                }, history: {
                    delay: 1000, maxStack: 100, userOnly: false,
                },
            },

        });

        ref.current = quill;

        if (defaultValueRef.current) {
            quill.setContents(defaultValueRef.current);
            quill.history.clear();
        }

        // Listen for text changes and update line numbers
        quill.on('text-change', handleTextChange);

        quill.on('selection-change', (range, oldRange, source) => {
            onSelectionChangeRef.current?.(range, oldRange, source);
            highlightActiveLine(quill, range);
        });

        quill.on('editor-change', () => {

            const range = quill.getSelection();
            if (range) {
                const format = quill.getFormat(range);
                setCurrentBold(format.bold);
                setCurrentHeader(format.header);
            }
        });


        return () => {
            ref.current = null;
            container.innerHTML = '';
        };
    }, [handleTextChange, redo, ref, state.appSettings.quillTheme, undo]);


    // Function to highlight the active line
    const highlightActiveLine = (quillInstance, range) => {
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
    };

    // Custom toolbar functions
    const handleHeadingChange = (event) => {
        const value = event.target.value;
        const quill = ref.current;
        if (quill) {
            quill.format('header', value);
        }
    };

    return (<div>
        {/* Inject dynamic CSS for line numbers and active line highlighting */}
        <Global styles={dynamicStyles(theme)}/>

        <div id={"toolbar"} className={"ql-toolbar"}>
            <DesktopToolbarActions
                currentHeader={currentHeader}
                currentBold={currentBold}
                quillRef={ref}
                handleHeader={handleHeadingChange}
                isAdvanced={true}
                handleSave={() => {
                }}
                savingBookContent={false}
            />
        </div>

        <EditorContainer>
            <QuillEditorWrapper className="quill-editor-wrapper">
                <div ref={containerRef}></div>
            </QuillEditorWrapper>
        </EditorContainer>
    </div>);
});

Editor.displayName = 'Editor';

Editor.propTypes = {
    readOnly: PropTypes.bool.isRequired,
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
    onTextChange: PropTypes.func.isRequired,
    onSelectionChange: PropTypes.func.isRequired,
};

export default Editor;

const dynamicStyles = (theme) => {
    return css`
        /* Line Numbers */

        .ql-editor {
            counter-reset: line;
            position: initial;
        }

        .ql-active {
            border: solid 1px ${alpha(theme.palette.primary.main, 0.5)} !important;
            background-color: ${alpha(theme.palette.primary.main, 0.5)} !important;
            border-radius: 3px;
        }

        .ql-active:hover {
            background-color: ${theme.palette.primary.main} !important;
        }

        .ql-editor p::before,
        .ql-editor h1::before,
        .ql-editor h2::before,
        .ql-editor h3::before,
        .ql-editor h4::before,
        .ql-editor h5::before,
        .ql-editor h6::before,
        .ql-editor blockquote::before {
            counter-increment: line;
            content: counter(line);
            position: absolute;
            left: 0;
            width: 2em;
            text-align: right;
            padding-right: 0.5em;
            color: ${theme.palette.text.secondary || '#888'};
            user-select: none;
            font-size: 14px; /* Fixed font size for line numbers */
            line-height: 1.2; /* Adjust for better vertical alignment */
            border-right: none; /* Remove border-right to avoid overlapping with vertical border */
            z-index: 2; /* Ensure line numbers appear above the gutter border */
        }

        /* Adjust paragraph and heading position to make space for line numbers */

        .ql-editor p,
        .ql-editor h1,
        .ql-editor h2,
        .ql-editor h3,
        .ql-editor h4,
        .ql-editor h5,
        .ql-editor h6,
        .ql-editor blockquote {
            position: initial;
            margin-left: 0;
        }

        .ql-editor p:empty::before,
        .ql-editor h1:empty::before,
        .ql-editor h2:empty::before,
        .ql-editor h3:empty::before,
        .ql-editor h4:empty::before,
        .ql-editor h5:empty::before,
        .ql-editor h6:empty::before,
        .ql-editor blockquote:empty::before {
            content: counter(line);
        }

        .active-line {
            background-color: ${theme.palette.action.hover || 'rgba(0, 0, 0, 0.04)'};
        }

        /* Continuous Vertical Border for Gutter */

        .quill-editor-wrapper::before {
            content: '';
            position: absolute;
            top: 0;
            left: 1.7em;
            width: 1px;
            height: 100%;
            background-color: ${theme.palette.divider || '#ddd'};
            z-index: 1;
        }
    `;
}