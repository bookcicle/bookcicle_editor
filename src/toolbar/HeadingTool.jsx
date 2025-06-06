import {Menu, MenuItem, Tooltip, Typography, useTheme} from '@mui/material';
import {useState} from 'react';
import {FormatSize} from "@mui/icons-material";
import CustomIconButton from "./ToolbarIconButton.jsx";
import PropTypes from "prop-types";

const HeadingTools = ({handleHeadingChange}) => {
    const theme = useTheme();
    const [headingMenuAnchorEl, setHeadingMenuAnchorEl] = useState(null);

    const handleHeadingMenuClick = (event) => setHeadingMenuAnchorEl(event.currentTarget);
    const handleHeadingMenuClose = () => setHeadingMenuAnchorEl(null);

    return (<>
        <Tooltip title="Heading Level">
            <CustomIconButton onClick={handleHeadingMenuClick} sx={{color: theme.palette.text.primary}}>
                <FormatSize/>
            </CustomIconButton>
        </Tooltip>
        <Menu
            anchorEl={headingMenuAnchorEl}
            open={Boolean(headingMenuAnchorEl)}
            onClose={handleHeadingMenuClose}
            sx={{
                '& .MuiPaper-root': {
                    textAlign: 'center',
                },
            }}
        >
            {[1, 2, 3].map((level) => (<MenuItem
                key={level}
                onClick={() => {
                    handleHeadingChange(level);
                    handleHeadingMenuClose();
                }}
                sx={{padding: '4px 8px'}}
            >
                <Typography variant={`h${level + 2}`}>
                    H{level}
                </Typography>
            </MenuItem>))}
        </Menu>
    </>);
};
HeadingTools.propTypes = {
    handleHeadingChange: PropTypes.func.isRequired,
};
export default HeadingTools;
