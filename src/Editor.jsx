import {Global} from '@emotion/react';
import {EditorContent, useEditor} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import DragHandle from '@tiptap-pro/extension-drag-handle-react';
import {Box, useTheme} from '@mui/material';
import PropTypes from 'prop-types';
import dynamicStyles from './helpers/dynamicStyles.js';
import styled from '@emotion/styled';
import EditorToolbar from './toolbar/EditorToolbar.jsx';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import Highlight from '@tiptap/extension-highlight';
import DragHandleIcon from '@mui/icons-material/DragHandleOutlined';
import FontFamily from '@tiptap/extension-font-family';
import 'katex/dist/katex.min.css';
import {Mathematics} from '@tiptap-pro/extension-mathematics';
import TextStyle from '@tiptap/extension-text-style';
import {Link} from "@tiptap/extension-link";
import {Color} from "@tiptap/extension-color";
import {Decoration, DecorationSet} from "prosemirror-view";
import {LanguageToolMark} from "./extensions/spellchecker/langtool.js";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {SpellingActionsMenu} from "./extensions/spellchecker/SpellingActionsMenu.jsx";
import {ListKeymap} from "@tiptap/extension-list-keymap";
import IndentHandler from "./extensions/Indent.js";
import {getCursorPositionInfo} from "./helpers/positionHelper.js";

/**
 * @typedef {Object} EditorSettings
 * @property {boolean} openLinks - Allow opening links from the editor on click. Default is `false`.
 * @property {boolean} enableDragHandle - Enable a drag handle for content dragging. Default is `false`.
 * @property {boolean} showLineNumbers - Whether line numbers are displayed. Default is `true`.
 * @property {boolean} showLineHighlight - Enable line highlighting for the current line. Default is `true`.
 * @property {string} buttonSize - The size of buttons in the editor toolbar. Options are `'xs'`, `'small'`, `'medium'`, `'large'`, `'xl'`. Default is `'xl'`.
 * @property {string} linePadding - Padding for lines in the editor. Options are `'xs'`, `'small'`, `'medium'`, `'large'`, `'xl'`. Default is `'small'`.
 * @property {boolean} showVerticalDivider - Show a vertical divider in the editor. Default is `true`.
 * @property {boolean} enablePageEditor - Whether to enable page editor view (centered content with a width constraint). Default is `true`.
 * @property {string} pageEditorWidth - Width of the page editor when `enablePageEditor` is `true`. Default is `'800px'`.
 * @property {number} pageEditorElevation - Elevation level for the Paper component in the page editor, controlling the depth of the shadow. Default is `1`.
 * @property {boolean} pageEditorBoxShadow - Whether to display a box shadow around the page editor. Default is `true`.
 * @property {string} toolbarStyle - Style of the toolbar, used to control the button set shown. Options are `'science'`, `'general'`, `'fiction'`, `'non-fiction'`, `'all'`. Default is `'all'`.
 * @property {string} toolbarPlacement - Placement of the toolbar in the editor. Options are `'top'`, `'bottom'`, `'left'`, `'right'`. Default is `'top'`.
 * @property {boolean} showGrammarSuggestions - Enable grammar suggestions in the editor. Default is `true`.
 * @property {boolean} showSpellingSuggestions - Enable spelling suggestions in the editor. Default is `true`.
 * @property {string} langtoolUrl - The URL for spell/grammar checking, expecting an instance of LanguageTool v2. Default is `'http://localhost:8010/v2/check'`.
 * @property {string} [languageCode="en-US"] - (Optional) Language code used for the editor (e.g., `"en-US"`). Default is `"en-US"`.
 */

const EditorContainer = styled.div`
    position: relative;
    height: 100%;
    width: 100%;
`;

const TiptapEditorWrapper = styled.div`
    display: flex;
    width: 100%;
    position: relative;
`;

const PageEditorWrapper = styled(Box)(({width}) => ({
    width: '100%',
    maxWidth: width,
    margin: '0px auto',
    padding: '5px',
    borderRadius: 20,
}));

/**
 * Editor component for rich text editing.
 *
 * @param {Object} props - The properties for the Editor component.
 * @param {string} props.documentId - The Document/Project Identifier.
 * @param {boolean} props.readOnly - Whether the editor is in read-only mode.
 * @param {string} props.content - The initial content of the editor.
 * @param {Function} props.onTextChange - Callback when the text changes returns text content (string).
 * @param {Function} props.handleInsertImage - Handler when insert Image is clicked.
 * @param {Function} props.handleInsertFormula - Handler when insert Formula is clicked.
 * @param {Function} props.handleInsertLink - Handler when insert Link is clicked.
 * @param {Function} props.onSelectionChange - Callback when the selection changes ({selection, currentParagraph, currentColumn}).
 * @param {Function} props.onTransaction - Callback when a transaction is fired by TipTap, returns {editor, transaction}
 * @param {Function} props.onJsonChange - Callback with the entire document Delta when content changes returns the tiptap json doc
 * @param {Function} props.onEditorReady - Callback triggered when the tipTap editor first becomes ready.
 * @param {EditorSettings} [props.editorSettings] - Configuration object for editor settings.
 * @param {Object} [props.tipTapSettings] - Configuration object for TipTap's useEditor settings, or override existing configurations.
 */
const Editor = ({
                    documentId,
                    readOnly,
                    content,
                    onTextChange,
                    onSelectionChange,
                    onJsonChange,
                    onHtmlChange,
                    onTransaction,
                    onEditorReady,
                    handleInsertLink,
                    handleInsertFormula,
                    handleInsertImage,
                    hOffset = "0",
                    editorSettings = {
                        openLinks: false,
                        enableDragHandle: false,
                        showLineNumbers: true,
                        showLineHighlight: true,
                        buttonSize: "xl",
                        linePadding: "small",
                        showVerticalDivider: true,
                        enablePageEditor: true,
                        pageEditorWidth: '800px',
                        pageEditorElevation: 1,
                        pageEditorBoxShadow: true,
                        toolbarStyle: "all",
                        toolbarPlacement: "bottom",
                        showGrammarSuggestions: true,
                        showSpellingSuggestions: true,
                        langtoolUrl: "http://localhost:8010/v2/check",
                        languageCode: "auto"
                    },
                    tipTapSettings = {},
                }) => {
    const isUpdatingEditor = useRef(false);
    const pendingContentUpdate = useRef(null);
    const theme = useTheme();
    const activeLineDecoration = useRef(DecorationSet.empty);
    const [match, setMatch] = useState(null);
    const isMountedRef = useRef(true);

    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    // Memoize extensions to prevent unnecessary re-renders
    const editorExtensions = useMemo(() => [
        StarterKit.configure({heading: {levels: [1, 2, 3]}}),
        LanguageToolMark.configure({
            apiUrl: editorSettings.langtoolUrl,
            language: editorSettings.languageCode,
            automaticMode: true,
            documentId,
            enableSpellcheck: editorSettings.showSpellingSuggestions,
            enableGrammarCheck: editorSettings.showGrammarSuggestions,
        }),
        FontFamily,
        TextStyle,
        Color,
        Underline,
        Image,
        TextAlign.configure({
            types: ['heading', 'paragraph'],
            alignments: ['left', 'center', 'right'],
        }),
        Subscript,
        Superscript,
        Mathematics,
        Highlight.configure({multicolor: true}),
        Link.configure({openOnClick: editorSettings.openLinks}),
        IndentHandler,
        ListKeymap,
    ], [
        editorSettings.langtoolUrl,
        editorSettings.languageCode,
        editorSettings.showSpellingSuggestions,
        editorSettings.showGrammarSuggestions,
        editorSettings.openLinks,
        documentId,
    ]);

    // Memoize event handlers
    const handleCreate = useCallback(({editor}) => {
        onEditorReady?.({editor});
    }, [onEditorReady]);

    const handleUpdate = useCallback(({ editor }) => {
        if (!isUpdatingEditor.current) {
            const jsonContent = editor.getJSON();
            const htmlContent = editor.getHTML();
            onTextChange?.(editor.getText());
            onJsonChange?.(jsonContent);
            onHtmlChange?.(htmlContent);
        }
    }, [onTextChange, onJsonChange, onHtmlChange]);

    const handleSelectionUpdate = useCallback(({editor}) => {
        const selection = editor.state.selection;
        const {$from} = selection;
        const doc = editor.state.doc;
        const {paragraphNumber, columnOffset} = getCursorPositionInfo($from, doc);
        onSelectionChange?.({selection, paragraphNumber, columnOffset});

        if (editorSettings.showLineHighlight) {
            const {state} = editor;
            const {$from} = state.selection;
            const start = $from.start($from.depth);
            const end = $from.end($from.depth);
            const deco = Decoration.node(start - 1, end + 1, {class: 'active-line'});
            activeLineDecoration.current = DecorationSet.create(state.doc, [deco]);
            editor.view.setProps({
                decorations: () => activeLineDecoration.current,
            });
        }
    }, [onSelectionChange, editorSettings.showLineHighlight]);

    const handleTransaction = useCallback(({transaction, editor}) => {
        if (isMountedRef.current) {
            setMatch(transaction.meta.match);
        }
        onTransaction?.({editor, transaction});
    }, [onTransaction]);

    const handleBlur = useCallback(({editor}) => {
        if (editorSettings.showLineHighlight) {
            editor.view.setProps({
                decorations: () => DecorationSet.empty,
            });
        }
    }, [editorSettings.showLineHighlight]);

    // Memoize editor options
    const editorOptions = useMemo(() => ({
        extensions: editorExtensions,
        content: content || '<p>Start editing...</p>',
        editable: !readOnly,
        onCreate: handleCreate,
        onUpdate: handleUpdate,
        onSelectionUpdate: handleSelectionUpdate,
        onTransaction: handleTransaction,
        onBlur: handleBlur,
        immediatelyRender: true,
        shouldRerenderOnTransaction: false,
        ...tipTapSettings,
    }), [
        editorExtensions,
        content,
        readOnly,
        handleCreate,
        handleUpdate,
        handleSelectionUpdate,
        handleTransaction,
        handleBlur,
        tipTapSettings,
    ]);

    const editor = useEditor(editorOptions)


    return (
        <Box>
            <Global styles={dynamicStyles({
                theme,
                showLineNumbers: editorSettings.showLineNumbers,
                showDivider: editorSettings.showVerticalDivider,
                linePadding: editorSettings.linePadding,
                buttonSize: editorSettings.buttonSize,
                enableDragHandle: editorSettings.enableDragHandle,
                enableSpellcheckDecoration: editorSettings.showSpellingSuggestions,
                enabledGrammarCheckDecoration: editorSettings.showGrammarSuggestions
            })}/>
            <EditorContentWrapper
                documentId={documentId}
                match={match}
                setMatch={setMatch}
                isUpdatingEditor={isUpdatingEditor}
                pendingContentUpdate={pendingContentUpdate}
                content={content}
                onTextChange={onTextChange}
                onSelectionChange={onSelectionChange}
                editorSettings={editorSettings}
                handleInsertLink={handleInsertLink}
                handleInsertFormula={handleInsertFormula}
                handleInsertImage={handleInsertImage}
                theme={theme}
                hOffset={hOffset}
                editor={editor}
            />
        </Box>
    );
};

const EditorContentWrapper = ({
                                  documentId,
                                  match,
                                  isUpdatingEditor,
                                  pendingContentUpdate,
                                  content,
                                  editorSettings,
                                  handleInsertLink,
                                  handleInsertFormula,
                                  handleInsertImage,
                                  theme,
                                  hOffset,
                                  editor
                              }) => {

    useEffect(() => {
        if (editor && content !== undefined && !isUpdatingEditor.current) {
            const currentContent = editor.getHTML();
            if (currentContent !== content) {
                if (!editor.isFocused) {
                    isUpdatingEditor.current = true;
                    editor.commands.setContent(content, false, { preserveWhitespace: 'full' });
                    isUpdatingEditor.current = false;
                } else {
                    // If editor is focused, store the pending content update only if it's newer
                    pendingContentUpdate.current = content;
                }
            }
        }
    }, [content, editor]);

    useEffect(() => {
        if (editor) {
            const handleBlur = () => {
                if (pendingContentUpdate.current) {
                    const currentContent = editor.getHTML();
                    if (currentContent !== pendingContentUpdate.current) {
                        isUpdatingEditor.current = true;
                        editor.commands.setContent(pendingContentUpdate.current, false, { preserveWhitespace: 'full' });
                        isUpdatingEditor.current = false;
                    }
                    pendingContentUpdate.current = null;
                }
            };
            editor.on('blur', handleBlur);
            return () => {
                editor.off('blur', handleBlur);
            };
        }
    }, [editor]);

    const editorContent = (
        <TiptapEditorWrapper
            className="tiptap-editor-wrapper"
            style={{marginBottom: editorSettings.toolbarPlacement === "bottom" ? 70 : 0, marginTop: 0}}
        >
            <div className="tiptap-editor" style={{paddingLeft: editorSettings.enableDragHandle ? '3em' : "1em"}}>
                {editorSettings.enableDragHandle && (
                    <DragHandle editor={editor}>
                        <DragHandleIcon/>
                    </DragHandle>
                )}
                <EditorContent className="content" editor={editor}/>
                {editor && (
                    <SpellingActionsMenu
                        documentId={documentId}
                        editor={editor}
                        matchMessage={match?.message || 'No Message'}
                        replacements={match?.replacements || []}
                        ignoreSuggestion={() => {
                            editor.commands.ignoreLanguageToolSuggestion()
                        }}
                        acceptSuggestion={(sug) => editor.commands.insertContent(sug.value)}
                    />
                )}
            </div>
        </TiptapEditorWrapper>
    );

    return (
        <Box sx={{height: `calc(100vh - ${hOffset}px)`, display: 'flex', flexDirection: 'column'}}>
            {editorSettings.toolbarPlacement === 'top' && (
                <EditorToolbar
                    editor={editor}
                    toolbarStyle={editorSettings.toolbarStyle}
                    handleInsertFormula={handleInsertFormula}
                    handleInsertImage={handleInsertImage}
                    handleInsertLink={handleInsertLink}
                    position={editorSettings.toolbarPlacement}
                />
            )}
            <Box
                id={"content-wrapper"}
                sx={{flexGrow: 1, overflowY: 'auto', boxSizing: 'border-box', minHeight: 0, mb: 2, zIndex: 0}}
            >
                <EditorContainer style={{position: 'relative', alignSelf: "stretch"}}>
                    <Box
                        sx={{backgroundColor: editorSettings.enablePageEditor ? "transparent" : (editorSettings.pageEditorElevation === 1 ? "background.default" : "transparent")}}>
                        {editorSettings.enablePageEditor ? (
                            <PageEditorWrapper width={editorSettings.pageEditorWidth} sx={{
                                backgroundColor: editorSettings.pageEditorElevation === 1 ? "background.default" : "transparent",
                                boxShadow: editorSettings.pageEditorBoxShadow ? theme.shadows[25] : "none"
                            }}>
                                {editorContent}
                            </PageEditorWrapper>
                        ) : (
                            editorContent
                        )}
                    </Box>
                </EditorContainer>
            </Box>
            {editorSettings.toolbarPlacement === 'bottom' && (
                <EditorToolbar
                    editor={editor}
                    toolbarStyle={editorSettings.toolbarStyle}
                    handleInsertFormula={handleInsertFormula}
                    handleInsertImage={handleInsertImage}
                    handleInsertLink={handleInsertLink}
                    position={editorSettings.toolbarPlacement}
                />
            )}
        </Box>
    );
};

Editor.propTypes = {
    documentId: PropTypes.string.isRequired,
    readOnly: PropTypes.bool.isRequired,
    content: PropTypes.string,
    onTextChange: PropTypes.func,
    onSelectionChange: PropTypes.func,
    onJsonChange: PropTypes.func,
    onHtmlChange: PropTypes.func,
    onTransaction: PropTypes.func,
    onEditorReady: PropTypes.func,
    handleInsertLink: PropTypes.func.isRequired,
    handleInsertImage: PropTypes.func.isRequired,
    handleInsertFormula: PropTypes.func.isRequired,
    hOffset: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    editorSettings: PropTypes.shape({
        openLinks: PropTypes.bool,
        enableDragHandle: PropTypes.bool,
        showLineNumbers: PropTypes.bool,
        showLineHighlight: PropTypes.bool,
        buttonSize: PropTypes.oneOf(['xs', 'small', 'medium', 'large', 'xl']),
        linePadding: PropTypes.oneOf(['xs', 'small', 'medium', 'large', 'xl']),
        showVerticalDivider: PropTypes.bool,
        enablePageEditor: PropTypes.bool,
        pageEditorWidth: PropTypes.string,
        pageEditorElevation: PropTypes.number,
        pageEditorBoxShadow: PropTypes.bool,
        toolbarStyle: PropTypes.oneOf(['science', 'general', 'fiction', 'non-fiction', 'all']),
        toolbarPlacement: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
        showGrammarSuggestions: PropTypes.bool,
        showSpellingSuggestions: PropTypes.bool,
        langtoolUrl: PropTypes.string,
        languageCode: PropTypes.string,
    }),
    tipTapSettings: PropTypes.object,
};

EditorContentWrapper.propTypes = {
    documentId: PropTypes.string.isRequired,
    match: PropTypes.object,
    isUpdatingEditor: PropTypes.shape({current: PropTypes.bool}).isRequired,
    pendingContentUpdate: PropTypes.shape({current: PropTypes.string}).isRequired,
    content: PropTypes.string,
    editorSettings: PropTypes.shape({
        openLinks: PropTypes.bool,
        enableDragHandle: PropTypes.bool,
        showLineNumbers: PropTypes.bool,
        showLineHighlight: PropTypes.bool,
        buttonSize: PropTypes.oneOf(['xs', 'small', 'medium', 'large', 'xl']),
        linePadding: PropTypes.oneOf(['xs', 'small', 'medium', 'large', 'xl']),
        showVerticalDivider: PropTypes.bool,
        enablePageEditor: PropTypes.bool,
        pageEditorWidth: PropTypes.string,
        pageEditorElevation: PropTypes.number,
        pageEditorBoxShadow: PropTypes.bool,
        toolbarStyle: PropTypes.oneOf(['science', 'general', 'fiction', 'non-fiction', 'all']),
        toolbarPlacement: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
        showGrammarSuggestions: PropTypes.bool,
        showSpellingSuggestions: PropTypes.bool,
        langtoolUrl: PropTypes.string,
        languageCode: PropTypes.string,
    }).isRequired,
    handleInsertLink: PropTypes.func.isRequired,
    handleInsertFormula: PropTypes.func.isRequired,
    handleInsertImage: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
    hOffset: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    editor: PropTypes.any.isRequired,
};

export default Editor;