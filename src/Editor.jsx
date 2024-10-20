/** @jsxImportSource @emotion/react */
import { Global, css } from '@emotion/react';
import {
    forwardRef,
    useCallback,
    useContext,
    useEffect,
    useLayoutEffect,
    useRef,
    useState
} from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // Ensure Quill CSS is imported for proper styling
import styled from '@emotion/styled';
import { AppContext } from './AppContext.jsx';
import DesktopToolbarActions from './toolbar/DesktopToolbarActions';
import { useTheme } from '@mui/material';
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
                               readOnly,
                               defaultValue,
                               onTextChange,
                               onSelectionChange
                           }, ref) => {
    const containerRef = useRef(null);
    const defaultValueRef = useRef(defaultValue);
    const onTextChangeRef = useRef(onTextChange);
    const onSelectionChangeRef = useRef(onSelectionChange);
    const { state } = useContext(AppContext);
    const theme = useTheme();

    const [editorReady, setEditorReady] = useState(false);

    const handleTextChange = useCallback(() => {
        if (ref.current) {
            onTextChangeRef.current?.(ref.current.getText());
        }
    }, [ref]);

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
            theme: state.appSettings.quillTheme || 'snow', // Ensure a valid theme is applied
            modules: {
                toolbar: false,
                history: {
                    delay: 1000,
                    maxStack: 100,
                    userOnly: false,
                },
            },
            formats: ['header', 'bold', 'italic', 'underline', 'background', 'blockquote'],
        });

        ref.current = quill;

        if (defaultValueRef.current) {
            quill.setContents(defaultValueRef.current);
            quill.history.clear(); // Clear history to remove default state changes
        }

        // Listen for text changes and update line numbers
        quill.on('text-change', handleTextChange);

        quill.on('selection-change', (range, oldRange, source) => {
            onSelectionChangeRef.current?.(range, oldRange, source);
            highlightActiveLine(quill, range);
        });

        setEditorReady(true);

        return () => {
            ref.current = null;
            container.innerHTML = ''; // Clean up the container content on unmount
        };
    }, [handleTextChange, ref, state.appSettings.quillTheme]);

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

    // Dynamically generate CSS for line numbers and active line highlighting
    const dynamicStyles = css`
        /* Line Numbers */
        .ql-editor {
            counter-reset: line;
            position: initial;
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
        /* Handle empty paragraphs and headings */
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

        /* Active Line Highlighting */
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

    // Custom toolbar functions
    const handleHeadingChange = (event) => {
        const value = event.target.value;
        const quill = ref.current;
        if (quill) {
            quill.format('header', value);
        }
    };

    const handleUndo = () => ref.current?.history.undo();
    const handleRedo = () => ref.current?.history.redo();
    const handleBold = () => ref.current?.format('bold', true);
    const handleItalic = () => ref.current?.format('italic', true);
    const handleUnderline = () => ref.current?.format('underline', true);
    const handleHighlight = () => ref.current?.format('background', 'yellow');
    const handleQuote = () => ref.current?.format('blockquote', true);
    const handleClearFormatting = () => {
        const selection = ref.current?.getSelection();
        if (selection) {
            ref.current?.removeFormat(selection.index, selection.length);
        }
    };

    return (
        <div>
            {/* Inject dynamic CSS for line numbers and active line highlighting */}
            <Global styles={dynamicStyles} />

            {editorReady && (
                <DesktopToolbarActions
                    quillRef={ref}
                    handleUndo={handleUndo}
                    handleRedo={handleRedo}
                    handleBold={handleBold}
                    handleItalic={handleItalic}
                    handleHeader={handleHeadingChange}
                    handleUnderline={handleUnderline}
                    handleHighlight={handleHighlight}
                    handleQuote={handleQuote}
                    handleClearFormatting={handleClearFormatting}
                    isAdvanced={true}
                    isReadOnly={readOnly}
                    handleSave={() => { }}
                    savingBookContent={false}
                />
            )}

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
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
    onTextChange: PropTypes.func.isRequired,
    onSelectionChange: PropTypes.func.isRequired,
};

export default Editor;