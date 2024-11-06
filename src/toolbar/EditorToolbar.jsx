import {useState} from 'react';
import {AppBar, Box, Toolbar} from '@mui/material';
import ListAndBlockTools from './ListAndBlockTools';
import FontAndColorTools from './FontAndColorTools';
import AlignmentTools from './AlignmentTools';
import InsertTools from './InsertTools';
import UndoRedoTools from './UndoRedoTools';
import TextClearTools from './TextClearTools';
import PropTypes from 'prop-types';
import TextFormattingTools from "./TextFormattingTools.jsx";

const EditorToolbar = ({editor}) => {
    const [fontMenuAnchorEl, setFontMenuAnchorEl] = useState(null);
    const [selectedAlignment, setSelectedAlignment] = useState('left');

    const handleFontMenuClick = (event) => setFontMenuAnchorEl(event.currentTarget);
    const handleFontMenuClose = () => setFontMenuAnchorEl(null);

    const handleFontStyleChange = (style) => {
        editor.chain().focus().setMark('textStyle', {fontFamily: style}).run();
        handleFontMenuClose();
    };

    const handleAlignmentChange = (alignment) => {
        editor.chain().focus().setTextAlign(alignment).run();
        setSelectedAlignment(alignment); // Update the selected alignment
    };

    const handleAction = (action, color = null) => {
        switch (action) {
            case 'link': {
                const url = prompt('Enter the link URL');
                if (url) {
                    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
                }
                break;
            }
            case 'unlink': {
                editor.chain().focus().unsetLink().run();
                break;
            }
            case 'color':
                console.log(color)
                if (color) {
                    editor.chain().focus().setMark('textStyle', { color }).run();
                }
                break;
            case 'highlight':
                if (color) {
                    editor.chain().focus().setHighlight({ color }).run();
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
            case 'image': {
                const url = prompt('Enter the image URL');
                if (url) {
                    editor.chain().focus().setImage({src: url}).run();
                }
                break;
            }
            case 'superscript':
                editor.chain().focus().toggleSuperscript().run();
                break;
            case 'subscript':
                editor.chain().focus().toggleSubscript().run();
                break;
            case 'formula': {
                const formula = prompt('Enter LaTeX formula');
                if (formula) {
                    editor.chain().focus().insertContent(`$${formula}$`).run();
                }
                break;
            }
            default:
                break;
        }
    };

    return (<AppBar position="static" color="transparent" elevation={0}>
            <Toolbar variant="dense">
                <Box sx={{flexGrow: 1, display: 'flex', justifyContent: 'center'}}>
                    <TextFormattingTools handleAction={handleAction}/>
                    <ListAndBlockTools handleAction={handleAction}/>
                    <FontAndColorTools
                        fontMenuAnchorEl={fontMenuAnchorEl}
                        handleFontMenuClick={handleFontMenuClick}
                        handleFontMenuClose={handleFontMenuClose}
                        handleFontStyleChange={handleFontStyleChange}
                        handleAction={handleAction}
                    />
                    <AlignmentTools
                        selectedAlignment={selectedAlignment}
                        handleAlignmentChange={handleAlignmentChange}
                    />
                    <InsertTools handleAction={handleAction}/>
                    <TextClearTools handleAction={handleAction}/>
                    <UndoRedoTools handleAction={handleAction}/>
                </Box>
            </Toolbar>
        </AppBar>);
};

EditorToolbar.propTypes = {
    editor: PropTypes.any.isRequired,
};

export default EditorToolbar;