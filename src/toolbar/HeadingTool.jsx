import {Button, Menu, MenuItem, Tooltip, Typography, useTheme} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {useState} from 'react';

const HeadingTools = ({handleHeadingChange, selectedHeading}) => {
    const theme = useTheme();
    const [headingMenuAnchorEl, setHeadingMenuAnchorEl] = useState(null);

    const handleHeadingMenuClick = (event) => setHeadingMenuAnchorEl(event.currentTarget);
    const handleHeadingMenuClose = () => setHeadingMenuAnchorEl(null);

    // Display selected heading level in the dropdown button
    const getHeadingLabel = () => `H${selectedHeading || 1}`;

    return (<>
            <Tooltip title="Heading Level">
                <Button onClick={handleHeadingMenuClick} sx={{color: theme.palette.text.primary}}>
                    <Typography variant="h6">{getHeadingLabel()}</Typography>
                    <ArrowDropDownIcon/>
                </Button>
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

export default HeadingTools;
