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
import React, {useCallback, useEffect} from "react";
import t from "prop-types";
import {styled} from "@mui/material/styles";
import {FormControl, MenuItem, Select} from "@mui/material";

const DividerSpan = styled("span")(() => ({
    margin: "0 4px", color: "lightgrey",
}));

export const DesktopToolbarActions = (props) => {
    const {
        savingBookContent,
        handleSave,
        handleUndo,
        handleRedo,
        handleBold,
        handleHeader,
        handleItalic,
        handleUnderline,
        handleHighlight,
        handleQuote,
        handleClearFormatting,
        isAdvanced,
        quillRef
    } = props;

    const [currentHeader, setCurrentHeader] = React.useState(null);

    const renderIconButton = (title, IconComponent, className, onClick) => (
        <Tooltip disableTouchListener leaveDelay={0} leaveTouchDelay={0} title={title}>
            <IconButton className={className} value={"customControl"} onClick={onClick}>
                <IconComponent fontSize={"small"}/>
            </IconButton>
        </Tooltip>);

    const getCurrentHeader = useCallback(() => {
        const quill = quillRef.current;
        if (quill) {
            const range = quill.getSelection();
            if (range) {
                const format = quill.getFormat(range);
                return format.header || 0; // 0 for normal text
            }
        }
        return 0;
    }, [quillRef]);

    useEffect(() => {
        setCurrentHeader(getCurrentHeader())
    }, [getCurrentHeader])

    useEffect(() => {
        quillRef.current.on('editor-change', () => {
            setCurrentHeader(getCurrentHeader())
        });
    }, [getCurrentHeader, quillRef]);


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
            </Select></FormControl>}
            <DividerSpan/>
            {renderIconButton("Remove Formatting", FormatClearIcon, "ql-clean", handleClearFormatting)}
            {renderIconButton("Undo", UndoIcon, "ql-bc-undo", handleUndo)}
            {renderIconButton("Redo", RedoIcon, "ql-bc-redo", handleRedo)}
        </>)}

        <>
            {renderIconButton("Italics", FormatItalic, "ql-italic", handleItalic)}
            {renderIconButton("Highlight Text", HighlightIcon, "ql-bc-highlighter", handleHighlight)}
            {renderIconButton("Bold", FormatBold, "ql-bold", handleBold)}
            {renderIconButton("Underline", FormatUnderline, "ql-underline", handleUnderline)}
            {renderIconButton("Block Quote", FormatQuote, "ql-blockquote", handleQuote)}
        </>
        <>
            <DividerSpan/>
            <IconButton
                value={"customControl"}
                onClick={() => handleSave(false)}
                style={{color: "#2196f3"}}
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
    handleUndo: t.func.isRequired,
    handleRedo: t.func.isRequired,
    handleBold: t.func.isRequired,
    handleHeader: t.func.isRequired,
    handleItalic: t.func.isRequired,
    handleUnderline: t.func.isRequired,
    handleHighlight: t.func.isRequired,
    handleQuote: t.func.isRequired,
    handleClearFormatting: t.func.isRequired,
    quillRef: t.any.isRequired
};

export default DesktopToolbarActions;