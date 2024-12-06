import {Menu, MenuItem, Tooltip, useTheme} from '@mui/material';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import HighlightIcon from '@mui/icons-material/Highlight';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import ColorDropdown from "./ColorDropdown.jsx";
import CustomIconButton from "./ToolbarIconButton.jsx";
import PropTypes from "prop-types";

const FontAndColorTools = ({
                               fontMenuAnchorEl,
                               handleFontMenuClick,
                               handleFontMenuClose,
                               handleFontStyleChange,
                               handleAction,
                               toolbarStyle
                           }) => {
    const theme = useTheme();
    return <>
        <Tooltip title="Font Style">
            <CustomIconButton onClick={handleFontMenuClick} sx={{color: theme.palette.text.primary}}>
                <TextFieldsIcon/>
            </CustomIconButton>
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
            icon={<HighlightIcon/>}
            title="Highlight Color"
            onSelectColor={(color) => handleAction('highlight', color)}
        />

        {toolbarStyle === "all" && <ColorDropdown
            icon={<FormatColorTextIcon/>}
            title="Text Color"
            onSelectColor={(color) => handleAction('color', color)}
        />}
    </>
};
FontAndColorTools.propTypes = {
    fontMenuAnchorEl: PropTypes.object,
    handleFontMenuClick: PropTypes.func.isRequired,
    handleFontMenuClose: PropTypes.func.isRequired,
    handleFontStyleChange: PropTypes.func.isRequired,
    handleAction: PropTypes.func.isRequired,
    toolbarStyle: PropTypes.string.isRequired,
};
export default FontAndColorTools;