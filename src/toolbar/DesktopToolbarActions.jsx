import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import FormatClearIcon from "@mui/icons-material/FormatClear";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import FormatItalic from "@mui/icons-material/FormatItalic";
import HighlightIcon from "@mui/icons-material/Highlight";
import FormatBold from "@mui/icons-material/FormatBold";
import FormatUnderline from "@mui/icons-material/FormatUnderlined";
import FormatQuote from "@mui/icons-material/FormatQuote";
import Save from "@mui/icons-material/Save";
import React from "react";
import t from "prop-types";
import {styled} from "@mui/material/styles";
import {FormControl, MenuItem, Select, useTheme} from "@mui/material";

const DividerSpan = styled("span")(() => ({
    margin: "0 4px", color: "lightgrey",
}));

export const DesktopToolbarActions = (props) => {
    const {
        savingBookContent, handleSave, handleHeader, isAdvanced, currentHeader
    } = props;

    const theme = useTheme()

    const renderIconButton = (title, IconComponent, className) => (
        <Tooltip disableTouchListener leaveDelay={0} leaveTouchDelay={0} title={title}>
            <IconButton className={className} value={"customControl"}>
                <IconComponent fontSize={"small"}/>
            </IconButton>
        </Tooltip>);

    return (<React.Fragment>
        {isAdvanced && (<>
            {<FormControl variant="standard" sx={{minWidth: 120}}><Select
                value={currentHeader}
                onChange={handleHeader}
                displayEmpty
                inputProps={{'aria-label': 'Select heading'}}
                sx={{
                    color: 'inherit',
                    '& .MuiSelect-icon': {color: 'inherit'},
                    '&:before, &:after': {borderColor: 'transparent'},
                    '& .MuiSvgIcon-root': {fontSize: 20},
                    backgroundColor: 'transparent',
                    border: 'none',
                    outline: 'none',
                    '& .MuiSelect-select': {
                        padding: '8px 0',
                    },
                }}
            >
                <MenuItem value={0}>Normal</MenuItem>
                <MenuItem value={1}>Heading 1</MenuItem>
                <MenuItem value={2}>Heading 2</MenuItem>
                <MenuItem value={3}>Heading 3</MenuItem>
                {/* Add more headings if needed */}
            </Select>
            </FormControl>}
            <DividerSpan/>
            <span className={"ql-formats"}>
            {renderIconButton("Remove Formatting", FormatClearIcon, "ql-clean")}
                {renderIconButton("Undo", UndoIcon, "ql-undo")}
                {renderIconButton("Redo", RedoIcon, "ql-redo")}
                </span>
        </>)}

        <span className={"ql-formats"}>
            {renderIconButton("Italics", FormatItalic, "ql-italic")}
            {renderIconButton("Highlight Text", HighlightIcon, "ql-background")}
            {renderIconButton("Bold", FormatBold, "ql-bold")}
            {renderIconButton("Underline", FormatUnderline, "ql-underline")}
            {renderIconButton("Block Quote", FormatQuote, "ql-blockquote")}
        </span>
        <>
            <DividerSpan/>
            <IconButton
                value={"customControl"}
                onClick={() => handleSave(false)}
                style={{color: theme.palette.text.primary}}
                disabled={savingBookContent}
            >
                <Save/>
            </IconButton>
        </>
    </React.Fragment>);
};

DesktopToolbarActions.propTypes = {
    isAdvanced: t.bool.isRequired,
    savingBookContent: t.bool.isRequired,
    handleSave: t.func.isRequired,
    handleHeader: t.func.isRequired,
    quillRef: t.any.isRequired,
    currentHeader: t.any.isRequired,
};

export default DesktopToolbarActions;