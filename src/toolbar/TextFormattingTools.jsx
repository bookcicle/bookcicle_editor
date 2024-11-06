import {Tooltip} from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import SuperscriptIcon from '@mui/icons-material/Superscript';
import SubscriptIcon from '@mui/icons-material/Subscript';
import CustomIconButton from "./ToolbarIconButton.jsx";

export const TextFormattingTools = ({ handleAction }) => (
    <>
        <Tooltip title="Bold">
            <CustomIconButton onClick={() => handleAction('bold')}>
                <FormatBoldIcon />
            </CustomIconButton>
        </Tooltip>
        <Tooltip title="Italic">
            <CustomIconButton onClick={() => handleAction('italic')}>
                <FormatItalicIcon />
            </CustomIconButton>
        </Tooltip>
        <Tooltip title="Underline">
            <CustomIconButton onClick={() => handleAction('underline')}>
                <FormatUnderlinedIcon />
            </CustomIconButton>
        </Tooltip>
        <Tooltip title="Superscript">
            <CustomIconButton onClick={() => handleAction('superscript')}>
                <SuperscriptIcon />
            </CustomIconButton>
        </Tooltip>
        <Tooltip title="Subscript">
            <CustomIconButton onClick={() => handleAction('subscript')}>
                <SubscriptIcon />
            </CustomIconButton>
        </Tooltip>
    </>
);

export default TextFormattingTools;