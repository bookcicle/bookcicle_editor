import {Tooltip} from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import CustomIconButton from "./ToolbarIconButton.jsx";

export const TextFormattingTools = ({handleAction, editor}) => (<>
        <Tooltip title="Bold">
            <CustomIconButton onClick={() => handleAction('bold')} isActive={editor.isActive('bold') } >
                <FormatBoldIcon/>
            </CustomIconButton>
        </Tooltip>
        <Tooltip title="Italic">
            <CustomIconButton onClick={() => handleAction('italic')} isActive={editor.isActive('italic') }>
                <FormatItalicIcon/>
            </CustomIconButton>
        </Tooltip>
        <Tooltip title="Underline">
            <CustomIconButton onClick={() => handleAction('underline')} isActive={editor.isActive('underline') }>
                <FormatUnderlinedIcon/>
            </CustomIconButton>
        </Tooltip>
    </>);

export default TextFormattingTools;