import {useState} from 'react';
import {Box, IconButton, Menu, MenuItem, Tooltip, useTheme} from '@mui/material';
import PropTypes from "prop-types";

const lightTextColors = [
    '#000000', '#4A4A4A', '#7F7F7F', '#8B0000', '#006400', '#00008B', '#800080', '#8B4513', '#008080'
];

const darkTextColors = [
    '#FFFFFF', '#BFBFBF', '#7F7F7F', '#FF6347', '#32CD32', '#4682B4', '#9370DB', '#FFD700', '#40E0D0'
];

const lightHighlightColors = [
    '#FFFF77', '#AEFF77', '#77FF92', '#77FFE4', '#7777FF', '#FF77E4', '#FF7792'
];

const darkHighlightColors = [
    '#FFFF77', '#77FF77', '#77E4FF', '#FF7777', '#FFAE77'
];

const ColorDropdown = ({icon, title, onSelectColor}) => {
    const theme = useTheme();
    const mode = theme.palette.mode;
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleColorSelect = (color) => {
        onSelectColor(color);
        handleClose();
    };

    const textColors = mode === 'dark' ? darkTextColors : lightTextColors;
    const highlightColors = mode === 'dark' ? darkHighlightColors : lightHighlightColors;

    return (
        <>
            <Tooltip title={title}>
                <IconButton onClick={handleClick} sx={{
                    borderRadius: '8px', // Default borderRadius
                    transition: 'border-radius 0.3s', // Smooth transition
                    '&:hover': {
                        borderRadius: '4px', // Hover borderRadius
                    },
                }}
                >
                    {icon}
                </IconButton>
            </Tooltip>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                {title === "Text Color" && textColors.map((color) => (
                    <MenuItem key={color} onClick={() => handleColorSelect(color)}>
                        <Box
                            sx={{
                                width: 24,
                                height: 24,
                                backgroundColor: color,
                                borderRadius: '50%',
                                marginRight: 1,
                                border: '1px solid #ccc',
                            }}
                        />
                        {color}
                    </MenuItem>
                ))}
                {title === "Highlight Color" && highlightColors.map((color) => (
                    <MenuItem key={color} onClick={() => handleColorSelect(color)}>
                        <Box
                            sx={{
                                width: 24,
                                height: 24,
                                backgroundColor: color,
                                borderRadius: '50%',
                                marginRight: 1,
                                border: '1px solid #ccc',
                            }}
                        />
                        {color}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};

ColorDropdown.propTypes = {
    icon: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired,
    onSelectColor: PropTypes.func.isRequired,
};

export default ColorDropdown;