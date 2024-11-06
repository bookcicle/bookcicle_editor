import {IconButton, Menu, MenuItem, Tooltip} from '@mui/material';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import {useState} from "react";

const AlignmentTools = ({ handleAlignmentChange, selectedAlignment }) => {
    const [alignmentMenuAnchorEl, setAlignmentMenuAnchorEl] = useState(null);

    const handleAlignmentMenuClick = (event) => setAlignmentMenuAnchorEl(event.currentTarget);
    const handleAlignmentMenuClose = () => setAlignmentMenuAnchorEl(null);

    const getAlignmentIcon = () => {
        switch (selectedAlignment) {
            case 'center':
                return <FormatAlignCenterIcon />;
            case 'right':
                return <FormatAlignRightIcon />;
            default:
                return <FormatAlignLeftIcon />;
        }
    };

    return (
        <>
            <Tooltip title="Alignment">
                <IconButton onClick={handleAlignmentMenuClick}>
                    {getAlignmentIcon()}
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={alignmentMenuAnchorEl}
                open={Boolean(alignmentMenuAnchorEl)}
                onClose={handleAlignmentMenuClose}
                sx={{
                    '& .MuiPaper-root': {
                        textAlign: "center",
                        width: 33
                    },
                }}
            >
                <MenuItem onClick={() => handleAlignmentChange('left')} sx={{padding: "2px 1px 2px 4px"}}>
                    <FormatAlignLeftIcon />
                </MenuItem>
                <MenuItem onClick={() => handleAlignmentChange('center')} sx={{padding: "2px 1px 2px 4px"}}>
                    <FormatAlignCenterIcon />
                </MenuItem>
                <MenuItem onClick={() => handleAlignmentChange('right')} sx={{padding: "2px 1px 2px 4px"}}>
                    <FormatAlignRightIcon />
                </MenuItem>
            </Menu>
        </>
    );
};

export default AlignmentTools;