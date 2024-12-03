import {useState} from 'react';
import {Box, Toolbar} from '@mui/material';
import ListAndBlockTools from './ListAndBlockTools';
import FontAndColorTools from './FontAndColorTools';
import AlignmentTools from './AlignmentTools';
import InsertTools from './InsertTools';
import UndoRedoTools from './UndoRedoTools';
import TextClearTools from './TextClearTools';
import PropTypes from 'prop-types';
import TextFormattingTools from './TextFormattingTools';
import HeadingTools from './HeadingTool';
import SuperscriptSubscriptTools from './SuperscriptSubscriptTools.jsx';
import FormulaTools from './FormulaTools.jsx';

const EditorToolbar = ({
                           editor,
                           toolbarStyle,
                           handleInsertLink,
                           handleInsertImage,
                           handleInsertFormula,
                           position
                       }) => {
    const [fontMenuAnchorEl, setFontMenuAnchorEl] = useState(null);
    const [selectedAlignment, setSelectedAlignment] = useState('left');
    const [selectedHeading, setSelectedHeading] = useState(1);

    const handleFontMenuClick = (event) => setFontMenuAnchorEl(event.currentTarget);
    const handleFontMenuClose = () => setFontMenuAnchorEl(null);

    const handleFontStyleChange = (style) => {
        editor.chain().focus().setMark('textStyle', {fontFamily: style}).run();
        handleFontMenuClose();
    };

    const handleAlignmentChange = (alignment) => {
        editor.chain().focus().setTextAlign(alignment).run();
        setSelectedAlignment(alignment);
    };

    const handleHeadingChange = (level) => {
        editor.chain().focus().toggleHeading({level}).run();
        setSelectedHeading(level);
    };

    const handleAction = async (action, color = null) => {
        switch (action) {
            case 'link':
                if (handleInsertLink) {
                    const url = await handleInsertLink();
                    if (url) {
                        editor.chain().focus().extendMarkRange('link').setLink({href: url}).run();
                    }
                } else {
                    const url = prompt('Enter the link URL');
                    if (url) {
                        editor.chain().focus().extendMarkRange('link').setLink({href: url}).run();
                    }
                }
                break;
            case 'unlink':
                editor.chain().focus().unsetLink().run();
                break;
            case 'color':
                if (color) {
                    editor.chain().focus().setMark('textStyle', {color}).run();
                }
                break;
            case 'highlight':
                if (color) {
                    editor.chain().focus().setHighlight({color}).run();
                }
                break;
            case 'bold':
                editor.chain().focus().toggleBold().run();
                break;
            case 'italic':
                editor.chain().focus().toggleItalic().run();
                break;
            case 'underline':
                editor.chain().focus().toggleUnderline().run();
                break;
            case 'orderedList':
                editor.chain().focus().toggleOrderedList().run();
                break;
            case 'bulletList':
                editor.chain().focus().toggleBulletList().run();
                break;
            case 'blockquote':
                editor.chain().focus().toggleBlockquote().run();
                break;
            case 'code':
                editor.chain().focus().toggleCode().run();
                break;
            case 'undo':
                editor.chain().focus().undo().run();
                break;
            case 'redo':
                editor.chain().focus().redo().run();
                break;
            case 'clearFormatting':
                editor.chain().focus().clearNodes().unsetAllMarks().run();
                break;
            case 'image':
                if (handleInsertImage) {
                    const url = await handleInsertImage();
                    if (url) {
                        editor.chain().focus().setImage({src: url}).run();
                    }
                } else {
                    const url = prompt('Enter the image URL');
                    if (url) {
                        editor.chain().focus().setImage({src: url}).run();
                    }
                }
                break;
            case 'superscript':
                editor.chain().focus().toggleSuperscript().run();
                break;
            case 'subscript':
                editor.chain().focus().toggleSubscript().run();
                break;
            case 'formula':
                if (handleInsertFormula) {
                    const formula = await handleInsertFormula();
                    if (formula) {
                        editor.chain().focus().insertContent(`$${formula}$`).run();
                    }
                } else {
                    const formula = prompt('Enter LaTeX formula');
                    if (formula) {
                        editor.chain().focus().insertContent(`$${formula}$`).run();
                    }
                }
                break;
            default:
                break;
        }
    };

    return (
        <Box
            sx={{
                backgroundColor: 'transparent',
                // Optionally, you can set fixed positioning if you want the toolbar to always be visible
                position: position === 'bottom' ? 'fixed' : "sticky",
                bottom: position === 'bottom' ? '20px' : 'auto',
                top: position === 'top' ? 0 : 'auto',
                zIndex: 1,
                alignSelf: "center"
            }}
        >
            <Toolbar variant="dense" sx={{backgroundColor: 'transparent'}}>
                <Box
                    sx={{
                        flexGrow: 1,
                        display: 'flex',
                        justifyContent: 'center',
                        backgroundColor: 'transparent',
                    }}
                >
                    <Box sx={{backgroundColor: "background.default"}}>
                        {/* Always included in all styles */}
                        <TextFormattingTools handleAction={handleAction} editor={editor}/>
                        <AlignmentTools
                            selectedAlignment={selectedAlignment}
                            handleAlignmentChange={handleAlignmentChange}
                        />
                        <HeadingTools
                            selectedHeading={selectedHeading}
                            handleHeadingChange={handleHeadingChange}
                        />
                        <TextClearTools handleAction={handleAction}/>
                        {['all'].includes(toolbarStyle) && <UndoRedoTools handleAction={handleAction}/>}

                        {/* Include Lists and Blockquotes except in 'fiction' */}
                        {['non-fiction', 'all'].includes(toolbarStyle) && (
                            <ListAndBlockTools handleAction={handleAction}/>
                        )}

                        {/* Include Superscript/Subscript in 'non-fiction', 'general', 'science', 'all' */}
                        {['non-fiction', 'general', 'science', 'all'].includes(toolbarStyle) && (
                            <SuperscriptSubscriptTools handleAction={handleAction}/>
                        )}

                        {/* Include Font and Color Tools in 'non-fiction', 'general', 'all' */}
                        {['non-fiction', 'general', 'all'].includes(toolbarStyle) && (
                            <FontAndColorTools
                                fontMenuAnchorEl={fontMenuAnchorEl}
                                handleFontMenuClick={handleFontMenuClick}
                                handleFontMenuClose={handleFontMenuClose}
                                handleFontStyleChange={handleFontStyleChange}
                                handleAction={handleAction}
                                toolbarStyle={toolbarStyle}
                            />
                        )}

                        {/* Include Insert Tools in 'non-fiction', 'general', 'science', 'all' */}
                        {['non-fiction', 'general', 'science', 'all'].includes(toolbarStyle) && (
                            <InsertTools handleAction={handleAction} toolbarStyle={toolbarStyle}/>
                        )}

                        {/* Include Formula Insertion only in 'science' and 'all' */}
                        {['science', 'all'].includes(toolbarStyle) && (
                            <FormulaTools handleAction={handleAction}/>
                        )}
                    </Box>
                </Box>
            </Toolbar>
        </Box>
    );
};

EditorToolbar.propTypes = {
    editor: PropTypes.any.isRequired,
    toolbarStyle: PropTypes.oneOf(['science', 'general', 'fiction', 'non-fiction', 'all']).isRequired,
    handleInsertLink: PropTypes.func,
    handleInsertImage: PropTypes.func,
    handleInsertFormula: PropTypes.func,
    position: PropTypes.string,
};

export default EditorToolbar;
