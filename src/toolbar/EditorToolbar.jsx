import { useState } from 'react';
import { AppBar, Box, Container, Toolbar } from '@mui/material';
import ListAndBlockTools from './ListAndBlockTools';
import FontAndColorTools from './FontAndColorTools';
import AlignmentTools from './AlignmentTools';
import InsertTools from './InsertTools';
import UndoRedoTools from './UndoRedoTools';
import TextClearTools from './TextClearTools';
import PropTypes from 'prop-types';
import TextFormattingTools from './TextFormattingTools';
import HeadingTools from './HeadingTool';
import SuperscriptSubscriptTools from "./SuperscriptSubscriptTools.jsx";
import FormulaTools from "./FormulaTools.jsx";

const EditorToolbar = ({ editor, toolbarStyle }) => {
    const [fontMenuAnchorEl, setFontMenuAnchorEl] = useState(null);
    const [selectedAlignment, setSelectedAlignment] = useState('left');
    const [selectedHeading, setSelectedHeading] = useState(1);

    const handleFontMenuClick = (event) => setFontMenuAnchorEl(event.currentTarget);
    const handleFontMenuClose = () => setFontMenuAnchorEl(null);

    const handleFontStyleChange = (style) => {
        editor.chain().focus().setMark('textStyle', { fontFamily: style }).run();
        handleFontMenuClose();
    };

    const handleAlignmentChange = (alignment) => {
        editor.chain().focus().setTextAlign(alignment).run();
        setSelectedAlignment(alignment);
    };

    const handleHeadingChange = (level) => {
        editor.chain().focus().toggleHeading({ level }).run();
        setSelectedHeading(level);
    };

    const handleAction = (action, color = null) => {
        // ... existing switch case for actions
    };

    return (
        <Container maxWidth="md">
            <AppBar position="static" color="transparent" elevation={0} sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
                <Toolbar variant="dense" sx={{ backgroundColor: 'transparent' }}>
                    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', backgroundColor: 'transparent' }}>
                        {/* Always included in all styles */}
                        <TextFormattingTools handleAction={handleAction} />
                        <AlignmentTools selectedAlignment={selectedAlignment} handleAlignmentChange={handleAlignmentChange} />
                        <HeadingTools selectedHeading={selectedHeading} handleHeadingChange={handleHeadingChange} />
                        <TextClearTools handleAction={handleAction} />
                        {['all'].includes(toolbarStyle) &&<UndoRedoTools handleAction={handleAction} />}

                        {/* Include Lists and Blockquotes except in 'fiction' */}
                        {['non-fiction', 'all'].includes(toolbarStyle) && (
                            <ListAndBlockTools handleAction={handleAction} />
                        )}

                        {/* Include Superscript/Subscript in 'non-fiction', 'general', 'science', 'all' */}
                        {['non-fiction', 'general', 'science', 'all'].includes(toolbarStyle) && (
                            <SuperscriptSubscriptTools handleAction={handleAction} />
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
                            <InsertTools handleAction={handleAction} toolbarStyle={toolbarStyle} />
                        )}

                        {/* Include Formula Insertion only in 'science' and 'all' */}
                        {['science', 'all'].includes(toolbarStyle) && (
                            <FormulaTools handleAction={handleAction} />
                        )}
                    </Box>
                </Toolbar>
            </AppBar>
        </Container>
    );
};

EditorToolbar.propTypes = {
    editor: PropTypes.any.isRequired,
    toolbarStyle: PropTypes.oneOf(['science', 'general', 'all']).isRequired,
};

export default EditorToolbar;
