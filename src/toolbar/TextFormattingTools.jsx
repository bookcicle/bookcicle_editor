import {IconButton, Tooltip} from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import SuperscriptIcon from '@mui/icons-material/Superscript';
import SubscriptIcon from '@mui/icons-material/Subscript';

export const TextFormattingTools = ({ handleAction }) => (
    <>
        <Tooltip title="Bold">
            <IconButton onClick={() => handleAction('bold')}>
                <FormatBoldIcon />
            </IconButton>
        </Tooltip>
        <Tooltip title="Italic">
            <IconButton onClick={() => handleAction('italic')}>
                <FormatItalicIcon />
            </IconButton>
        </Tooltip>
        <Tooltip title="Underline">
            <IconButton onClick={() => handleAction('underline')}>
                <FormatUnderlinedIcon />
            </IconButton>
        </Tooltip>
        <Tooltip title="Superscript">
            <IconButton onClick={() => handleAction('superscript')}>
                <SuperscriptIcon />
            </IconButton>
        </Tooltip>
        <Tooltip title="Subscript">
            <IconButton onClick={() => handleAction('subscript')}>
                <SubscriptIcon />
            </IconButton>
        </Tooltip>
    </>
);

export default TextFormattingTools;