/** @jsxImportSource @emotion/react */
import {Global} from '@emotion/react';
import {forwardRef, useCallback, useContext, useEffect, useLayoutEffect, useRef} from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // Ensure Quill CSS is imported for proper styling
import styled from '@emotion/styled';
import {AppContext} from './AppContext.jsx';
import {useTheme} from '@mui/material';
import PropTypes from 'prop-types';
import dynamicStyles from "./helpers/dynamicStyles.js";

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

        const toolbarOptions = [[{header: [1, 2, false]}], ['bold', 'italic', 'underline', 'strike'], ['blockquote'], ['image', 'link'], ['formula'], [{'list': 'ordered'}, {'list': 'bullet'}], [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
            [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
            [{'background': []}], [{'align': []}], ['clean']];
        const quill = new Quill(editorContainer, {
            theme: 'snow', modules: {
                toolbar: toolbarOptions, history: {
                    delay: 1000, maxStack: 100, userOnly: false,
                },
            },
        });


        ref.current = quill;

        if (defaultValueRef.current) {
            quill.setContents(defaultValueRef.current);
            quill.history.clear();
        }

        quill.on('text-change', handleTextChange);

        quill.on('selection-change', (range, oldRange, source) => {
            onSelectionChangeRef.current?.(range, oldRange, source);
            highlightActiveLine(quill, range);
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

    return (<div>
        <Global styles={dynamicStyles(theme)}/>
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
