import {forwardRef, useContext, useEffect, useLayoutEffect, useRef, useState} from 'react';
import Quill from 'quill';
import './assets/css/bubble.css';
import './assets/css/snow.css';
import {AppContext} from './AppContext.jsx';
import DesktopToolbarActions from './toolbar/DesktopToolbarActions'; // Import your custom toolbar

const Editor = forwardRef(
    (
        {readOnly, defaultValue, onTextChange, onSelectionChange},
        ref
    ) => {
        const containerRef = useRef(null);
        const defaultValueRef = useRef(defaultValue);
        const onTextChangeRef = useRef(onTextChange);
        const onSelectionChangeRef = useRef(onSelectionChange);
        const {state} = useContext(AppContext);

        // Local state for tracking editor readiness
        const [editorReady, setEditorReady] = useState(false);

        useLayoutEffect(() => {
            onTextChangeRef.current = onTextChange;
            onSelectionChangeRef.current = onSelectionChange;
        });

        useEffect(() => {
            ref.current?.enable(!readOnly);
        }, [ref, readOnly]);

        useEffect(() => {
            const container = containerRef.current;
            const editorContainer = container.appendChild(
                container.ownerDocument.createElement('div')
            );
            const quill = new Quill(editorContainer, {
                theme: state.appSettings.quillTheme,
                modules: {
                    toolbar: false, // Disable the default Quill toolbar since we'll use our custom one
                    history: {
                        // This ensures undo/redo works
                        delay: 1000,
                        maxStack: 100,
                        userOnly: false,
                    },
                },
            });

            ref.current = quill;

            if (defaultValueRef.current) {
                // Set the initial content
                quill.setContents(defaultValueRef.current);

                // Immediately record a snapshot for undo history
                quill.history.clear();  // Clear the history to remove any default state changes
            }

            quill.on(Quill.events.TEXT_CHANGE, (...args) => {
                onTextChangeRef.current?.(...args);
            });

            quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
                onSelectionChangeRef.current?.(...args);
            });

            // Set editor as ready after initialization
            setEditorReady(true);

            return () => {
                ref.current = null;
                container.innerHTML = '';
            };
        }, [ref, state.appSettings.quillTheme, state.appSettings.theme]);

        const handleUndo = () => {
            ref.current.history.undo();
        };

        const handleRedo = () => {
            ref.current.history.redo();
        };

        const handleBold = () => {
            ref.current.format('bold', true);
        };

        const handleItalic = () => {
            ref.current.format('italic', true);
        };

        const handleUnderline = () => {
            ref.current.format('underline', true);
        };

        const handleHighlight = () => {
            ref.current.format('background', 'yellow');
        };

        const handleQuote = () => {
            ref.current.format('blockquote', true);
        };

        const handleClearFormatting = () => {
            const selection = ref.current.getSelection();
            if (selection) {
                ref.current.removeFormat(selection.index, selection.length);
            }
        };

        // Custom toolbar integration (only when editor is ready)
        return (
            <div>
                {editorReady && (
                    <DesktopToolbarActions
                        quillRef={ref}
                        handleUndo={handleUndo}
                        handleRedo={handleRedo}
                        handleBold={handleBold}
                        handleItalic={handleItalic}
                        handleUnderline={handleUnderline}
                        handleHighlight={handleHighlight}
                        handleQuote={handleQuote}
                        handleClearFormatting={handleClearFormatting}
                        isAdvanced={true} // Assume you pass this prop based on the app state
                        isReadOnly={readOnly}
                        handleSave={() => {
                        }} savingBookContent={false}
                    />
                )}
                <div ref={containerRef}></div>
            </div>
        );
    }
);

Editor.displayName = 'Editor';

export default Editor;