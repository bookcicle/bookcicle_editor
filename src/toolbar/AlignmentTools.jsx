import {Menu, MenuItem, Tooltip, useTheme} from '@mui/material';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import {useState} from "react";
import CustomIconButton from "./ToolbarIconButton.jsx";
import PropTypes from "prop-types";

const AlignmentTools = ({handleAlignmentChange, selectedAlignment}) => {
    const [alignmentMenuAnchorEl, setAlignmentMenuAnchorEl] = useState(null);
    const theme = useTheme();
    const handleAlignmentMenuClick = (event) => setAlignmentMenuAnchorEl(event.currentTarget);
    const handleAlignmentMenuClose = () => setAlignmentMenuAnchorEl(null);

    const getAlignmentIcon = () => {
        switch (selectedAlignment) {
            case 'center':
                return <FormatAlignCenterIcon/>;
            case 'right':
                return <FormatAlignRightIcon/>;
            default:
                return <FormatAlignLeftIcon/>;
        }
    };

    return (<>
        <Tooltip title="Alignment">
            <CustomIconButton onClick={handleAlignmentMenuClick} sx={{color: theme.palette.text.primary}}>
                {getAlignmentIcon()}
            </CustomIconButton>
        </Tooltip>
        <Menu
            anchorEl={alignmentMenuAnchorEl}
            open={Boolean(alignmentMenuAnchorEl)}
            onClose={handleAlignmentMenuClose}
            sx={{
                '& .MuiPaper-root': {
                    textAlign: "center",
                    width: 40
                },
            }}
        >
            <MenuItem onClick={() => handleAlignmentChange('left')} sx={{padding: "2px 1px 2px 6px"}}>
                <FormatAlignLeftIcon/>
            </MenuItem>
            <MenuItem onClick={() => handleAlignmentChange('center')} sx={{padding: "2px 1px 2px 6px"}}>
                <FormatAlignCenterIcon/>
            </MenuItem>
            <MenuItem onClick={() => handleAlignmentChange('right')} sx={{padding: "2px 1px 2px 6px"}}>
                <FormatAlignRightIcon/>
            </MenuItem>
        </Menu>
    </>);
};

AlignmentTools.propTypes = {
    handleAlignmentChange: PropTypes.func.isRequired,
    selectedAlignment: PropTypes.string.isRequired
}
export default AlignmentTools;