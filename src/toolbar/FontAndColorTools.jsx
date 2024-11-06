import {IconButton, Menu, MenuItem, Tooltip} from '@mui/material';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import HighlightIcon from '@mui/icons-material/Highlight';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import ColorDropdown from "./ColorDropdown.jsx";

const FontAndColorTools = ({
                               fontMenuAnchorEl,
                               handleFontMenuClick,
                               handleFontMenuClose,
                               handleFontStyleChange,
                               handleAction,
                           }) => (
    <>
        <Tooltip title="Font Style">
            <IconButton onClick={handleFontMenuClick}>
                <TextFieldsIcon />
            </IconButton>
        </Tooltip>
        <Menu
            anchorEl={fontMenuAnchorEl}
            open={Boolean(fontMenuAnchorEl)}
            onClose={handleFontMenuClose}
        >
            <MenuItem onClick={() => handleFontStyleChange('Arial')}>Arial</MenuItem>
            <MenuItem onClick={() => handleFontStyleChange('Times New Roman')}>Times New Roman</MenuItem>
            <MenuItem onClick={() => handleFontStyleChange('Courier New')}>Courier New</MenuItem>
        </Menu>

        <ColorDropdown
            icon={<HighlightIcon />}
            title="Highlight Color"
            onSelectColor={(color) => handleAction('highlight', color)}
        />
        <ColorDropdown
            icon={<FormatColorTextIcon />}
            title="Text Color"
            onSelectColor={(color) => handleAction('color', color)}
        />
    </>
);

export default FontAndColorTools;