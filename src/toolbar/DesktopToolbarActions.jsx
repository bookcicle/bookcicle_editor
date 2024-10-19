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
import { styled } from "@mui/material/styles";

const DividerSpan = styled("span")(() => ({
    margin: "0 15px", color: "lightgrey",
}));

export const DesktopToolbarActions = (props) => {
    const {
        savingBookContent,
        handleSave,
        handleUndo,
        handleRedo,
        handleBold,
        handleItalic,
        handleUnderline,
        handleHighlight,
        handleQuote,
        handleClearFormatting,
        isAdvanced,
    } = props;

    const renderIconButton = (title, IconComponent, className, onClick) => (
        <Tooltip disableTouchListener leaveDelay={0} leaveTouchDelay={0} title={title}>
            <IconButton className={className} value={"customControl"} onClick={onClick}>
                <IconComponent fontSize={"small"} />
            </IconButton>
        </Tooltip>
    );

    return (
        <React.Fragment>
            {isAdvanced && (
                <>
                    {renderIconButton("Remove Formatting", FormatClearIcon, "ql-clean", handleClearFormatting)}
                    {renderIconButton("Undo", UndoIcon, "ql-bc-undo", handleUndo)}
                    {renderIconButton("Redo", RedoIcon, "ql-bc-redo", handleRedo)}
                </>
            )}

            <>
                {renderIconButton("Italics", FormatItalic, "ql-italic", handleItalic)}
                {renderIconButton("Highlight Text", HighlightIcon, "ql-bc-highlighter", handleHighlight)}
                {renderIconButton("Bold", FormatBold, "ql-bold", handleBold)}
                {renderIconButton("Underline", FormatUnderline, "ql-underline", handleUnderline)}
                {renderIconButton("Block Quote", FormatQuote, "ql-blockquote", handleQuote)}
            </>
            <>
                <DividerSpan />
                <IconButton
                    value={"customControl"}
                    onClick={() => handleSave(false)}
                    style={{ color: "#2196f3" }}
                    disabled={savingBookContent}
                >
                    <Save />
                </IconButton>
            </>
        </React.Fragment>
    );
};

DesktopToolbarActions.propTypes = {
    isAdvanced: t.bool.isRequired,
    savingBookContent: t.bool.isRequired,
    handleSave: t.func.isRequired,
    handleUndo: t.func.isRequired,
    handleRedo: t.func.isRequired,
    handleBold: t.func.isRequired,
    handleItalic: t.func.isRequired,
    handleUnderline: t.func.isRequired,
    handleHighlight: t.func.isRequired,
    handleQuote: t.func.isRequired,
    handleClearFormatting: t.func.isRequired,
};

export default DesktopToolbarActions;