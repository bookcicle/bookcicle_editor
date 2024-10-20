/** @jsxImportSource @emotion/react */
import {forwardRef, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState} from 'react';
import Quill from 'quill';
import styled from '@emotion/styled';
import './assets/css/bubble.css';
import {AppContext} from './AppContext.jsx';
import DesktopToolbarActions from './toolbar/DesktopToolbarActions';
import {useTheme} from "@mui/material";

// Styled components for the line number gutter and editor container
const EditorContainer = styled.div`
    display: flex;
    position: relative;
    height: 100%;
    width: 100%;
`;

const LineNumberGutter = styled.div`
    width: 40px;
    background-color: ${({theme}) => theme.palette.background || '#f0f0f0'};
    text-align: right;
    padding-right: 10px;
    color: ${({theme}) => theme.palette.text.secondary || '#888'};
    font-size: 14px;
    border-right: 1px solid ${({theme}) => theme.palette.divider || '#ddd'};
    user-select: none;
    overflow: hidden;
    padding-top: 10px; /* Adjust based on Quill's padding */
`;

const QuillEditorWrapper = styled.div`
    flex-grow: 1;
    overflow: auto;
    position: relative;
`;

// Define a consistent line height
const LINE_HEIGHT = 20; // in pixels

const Editor = forwardRef((// eslint-disable-next-line react/prop-types
    {readOnly, defaultValue, onTextChange, onSelectionChange}, ref) => {
    const containerRef = useRef(null);
    const defaultValueRef = useRef(defaultValue);
    const onTextChangeRef = useRef(onTextChange);
    const onSelectionChangeRef = useRef(onSelectionChange);
    const {state} = useContext(AppContext);
    const theme = useTheme();

    const [editorReady, setEditorReady] = useState(false);
    const [lineNumbers, setLineNumbers] = useState([]); // Track line numbers

    const handleTextChange = useCallback(() => {
        calculateLineNumbers(ref.current);
        onTextChangeRef.current?.(ref.current.getText());
    }, [ref]);

    useLayoutEffect(() => {
        onTextChangeRef.current = onTextChange;
        onSelectionChangeRef.current = onSelectionChange;
    });

    useEffect(() => {
        if (ref.current) {
            ref.current.enable(!readOnly);
        }
    }, [ref, readOnly]);

    useEffect(() => {
        const container = containerRef.current;
        const editorContainer = container.appendChild(container.ownerDocument.createElement('div'));

        const quill = new Quill(editorContainer, {
            theme: state.appSettings.quillTheme, modules: {
                toolbar: false, history: {
                    delay: 1000, maxStack: 100, userOnly: false,
                },
            }, formats: ['header', 'bold', 'italic', 'underline', 'background', 'blockquote',],
        });

        ref.current = quill;

        if (defaultValueRef.current) {
            quill.setContents(defaultValueRef.current);
            quill.history.clear(); // Clear history to remove default state changes
        }

        // Listen for text changes and update line numbers
        quill.on('text-change', handleTextChange);

        quill.on('selection-change', (...args) => {
            onSelectionChangeRef.current?.(...args);
        });

        setEditorReady(true);

        calculateLineNumbers(quill);

        // Recalculate line numbers on window resize
        const handleResize = () => {
            calculateLineNumbers(quill);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            ref.current = null;
            container.innerHTML = '';
            window.removeEventListener('resize', handleResize);
        };
    }, [handleTextChange, ref, state.appSettings.quillTheme, state.appSettings.theme]);


    const calculateLineNumbers = (quillInstance) => {
        if (!quillInstance) return;

        const editorElement = quillInstance.container.firstChild;
        const editorHeight = editorElement.clientHeight;
        const lines = Math.ceil(editorHeight / LINE_HEIGHT);
        setLineNumbers(Array.from({length: lines}, (_, i) => i + 1));
    };

    // Custom toolbar functions
    const handleHeadingChange = (event) => {
        const value = event.target.value;
        const quill = ref.current;
        if (quill) {
            quill.format('header', value);
        }
    };

    const handleUndo = () => ref.current.history.undo();
    const handleRedo = () => ref.current.history.redo();
    const handleBold = () => ref.current.format('bold', true);
    const handleItalic = () => ref.current.format('italic', true);
    const handleUnderline = () => ref.current.format('underline', true);
    const handleHighlight = () => ref.current.format('background', 'yellow');
    const handleQuote = () => ref.current.format('blockquote', true);
    const handleClearFormatting = () => {
        const selection = ref.current.getSelection();
        if (selection) {
            ref.current.removeFormat(selection.index, selection.length);
        }
    };

    // Synchronize scrolling between gutter and editor
    const editorScrollRef = useRef(null);

    useEffect(() => {
        if (!editorScrollRef.current && ref.current) {
            editorScrollRef.current = ref.current.container.firstChild;
            const gutterElement = containerRef.current.previousSibling;

            const handleEditorScroll = () => {
                if (gutterElement) {
                    gutterElement.scrollTop = editorScrollRef.current.scrollTop;
                }
            };

            editorScrollRef.current.addEventListener('scroll', handleEditorScroll);

            return () => {
                if (editorScrollRef.current) {
                    editorScrollRef.current.removeEventListener('scroll', handleEditorScroll);
                }
            };
        }
    }, [editorReady, ref]);

    return (<div>
        {editorReady && (<DesktopToolbarActions
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
            handleSave={() => {
            }}
            savingBookContent={false}
        />)}

        {/* Line numbers and editor container with dynamic theming */}
        <EditorContainer>
            {/* Line number gutter */}
            <LineNumberGutter theme={theme}>
                {lineNumbers.map((lineNumber) => (<div key={lineNumber}>{lineNumber}</div>))}
            </LineNumberGutter>

            {/* Quill editor */}
            <QuillEditorWrapper>
                <div ref={containerRef}></div>
            </QuillEditorWrapper>
        </EditorContainer>
    </div>);
});

Editor.displayName = 'Editor';

export default Editor;