import {Global} from '@emotion/react';
import {EditorContent, useEditor} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import DragHandle from '@tiptap-pro/extension-drag-handle-react';
import {Box, Paper, useTheme} from '@mui/material';
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
import 'katex/dist/katex.min.css'; // Import KaTeX CSS
import {Mathematics} from '@tiptap-pro/extension-mathematics'; // Import the Mathematics extension
import TextStyle from '@tiptap/extension-text-style';
import {Link} from "@tiptap/extension-link";
import {Color} from "@tiptap/extension-color";
import {Decoration, DecorationSet} from "prosemirror-view";

/**
 * @typedef {Object} EditorSettings
 * @property {boolean} showVerticalDivider - Show vertical divider (true)
 * @property {boolean} openLinks - Allow opening links from editor (true)
 * @property {boolean} enableDragHandle - Enable content dragging (true)
 * @property {string} buttonSize - oneOf(['small', 'medium', 'large']),
 * @property {string} linePadding - oneOf(['small', 'medium', 'large']),
 * @property {string} languageCode - The language code for the editor (e.g., "en-US"). Default is "en-US".
 * @property {boolean} showGrammarSuggestions - Whether grammar suggestions are shown. Default is true.
 * @property {boolean} showLineHighlight - Whether line highlighting is enabled. Default is true.
 * @property {boolean} showLineNumbers - Whether line numbers are displayed. Default is true.
 * @property {boolean} showSpellingSuggestions - Whether spelling suggestions are shown. Default is true.
 */

const EditorContainer = styled.div`
    position: relative;
    height: 100%;
    width: 100%;
`;

const TiptapEditorWrapper = styled.div`
    height: 100%;
    display: flex;
    width: 100%;
    position: relative;
    min-height: calc(100vh - 150px);
`;


const PageEditorWrapper = styled(Paper)(({ width }) => ({
    width: width,
    margin: "10px auto",
    padding: "5px",
    borderRadius: 20
}));
/**
 * Editor component for rich text editing.
 *
 * @param {Object} props - The properties for the Editor component.
 * @param {boolean} props.readOnly - Whether the editor is in read-only mode.
 * @param {string} props.defaultValue - The initial content of the editor.
 * @param {Function} props.onTextChange - Callback when the text changes.
 * @param {Function} props.onSelectionChange - Callback when the selection changes.
 * @param {Function} props.onDeltaChange - Callback with the entire document Delta when content changes.
 * @param {EditorSettings} [props.editorSettings] - Configuration object for editor settings.
 * @param {Object} [props.tipTapSettings] - Configuration object for TipTap's useEditor settings.
 */
const Editor = ({
                    readOnly,
                    defaultValue,
                    onTextChange,
                    onSelectionChange,
                    onDeltaChange,
                    onInsertImage,
                    onInsertLink,
                    onInsertFormula,
                    editorSettings = {
                        openLinks: true,
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
                        toolbarStyle: "all"
                    },
                    tipTapSettings = {},
                }) => {

    const theme = useTheme();
    let activeLineDecoration = DecorationSet.empty;

    const editor = useEditor({
        // Default configurations
        extensions: [StarterKit.configure({heading: {levels: [1, 2, 3]}}), FontFamily, TextStyle, Color, Underline, Image, TextAlign.configure({
            types: ['heading', 'paragraph'], alignments: ['left', 'center', 'right'],
        }), Subscript, Superscript, Mathematics, Highlight.configure({multicolor: true}), Link.configure({
            openOnClick: editorSettings.openLinks,
        }),], content: defaultValue || `<p>Start editing...</p>`, editable: !readOnly, onUpdate: ({editor}) => {
            const jsonContent = editor.getJSON();
            onTextChange?.(editor.getText());
            onDeltaChange?.(jsonContent);
        }, onSelectionUpdate: ({editor}) => {
            const selection = editor.state.selection;
            onSelectionChange?.(selection);

            if (editorSettings.showLineHighlight) {
                const {state} = editor;
                const {$from} = state.selection;

                const start = $from.start($from.depth);
                const end = $from.end($from.depth);

                const deco = Decoration.node(start - 1, end + 1, {class: 'active-line'});

                activeLineDecoration = DecorationSet.create(state.doc, [deco]);

                editor.view.setProps({
                    decorations: () => activeLineDecoration,
                });
            }

        }, onBlur: ({editor}) => {
            if (editorSettings.showLineHighlight) {
                editor.view.setProps({
                    decorations: () => DecorationSet.empty,
                });
            }
        }, ...tipTapSettings,
    });

    const editorContent = (<TiptapEditorWrapper className="tiptap-editor-wrapper">
        <div className="tiptap-editor" style={{paddingLeft: (editorSettings.enableDragHandle ? '3em' : "1em")}}>
            <DragHandle editor={editor}>
                <DragHandleIcon/>
            </DragHandle>
            <EditorContent editor={editor}/>
        </div>
    </TiptapEditorWrapper>);

    return (<Box>
        <Global
            styles={dynamicStyles(theme, editorSettings.showLineNumbers, editorSettings.showVerticalDivider, editorSettings.linePadding, editorSettings.buttonSize, editorSettings.enableDragHandle)}
        />
        <Box sx={{flexGrow: 1, padding: '10px', overflowY: 'hidden', height: '100%', boxSizing: 'border-box'}}>
            <EditorToolbar editor={editor} toolbarStyle={editorSettings.toolbarStyle} onInsertFormula={onInsertFormula}
                           onInsertImage={onInsertImage} onInsertLink={onInsertLink}/>
            <EditorContainer>
                {editorSettings.enablePageEditor ? (<PageEditorWrapper
                    width={editorSettings.pageEditorWidth}
                    elevation={editorSettings.pageEditorElevation}
                    sx={{
                        boxShadow: editorSettings.pageEditorBoxShadow ? theme.shadows[25] : "none"
                    }}
                >
                    {editorContent}
                </PageEditorWrapper>) : (editorContent)}
            </EditorContainer>
        </Box>
    </Box>);
};

Editor.propTypes = {
    readOnly: PropTypes.bool.isRequired,
    defaultValue: PropTypes.string,
    onTextChange: PropTypes.func.isRequired,
    onSelectionChange: PropTypes.func.isRequired,
    onDeltaChange: PropTypes.func.isRequired,
    onInsertLink: PropTypes.func.isRequired,
    onInsertImage: PropTypes.func.isRequired,
    onInsertFormula: PropTypes.func.isRequired,
    editorSettings: PropTypes.shape({
        openLinks: PropTypes.bool,
        showGrammarSuggestions: PropTypes.bool,
        showLineHighlight: PropTypes.bool,
        showLineNumbers: PropTypes.bool,
        showVerticalDivider: PropTypes.bool,
        showSpellingSuggestions: PropTypes.bool,
        buttonSize: PropTypes.oneOf(['xs', 'small', 'medium', 'large', 'xl']),
        linePadding: PropTypes.oneOf(['xs', 'small', 'medium', 'large', 'xl']),
        enableDragHandle: PropTypes.bool,
        enablePageEditor: PropTypes.bool,
        pageEditorWidth: PropTypes.string,
        pageEditorElevation: PropTypes.number,
        pageEditorBoxShadow: PropTypes.bool,
        toolbarStyle: PropTypes.oneOf(['science', 'general', 'fiction', 'non-fiction', 'all']),
    }),
    tipTapSettings: PropTypes.object,
};

export default Editor;
