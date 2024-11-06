import {Tooltip} from '@mui/material';
import FormatClearIcon from '@mui/icons-material/FormatClear';
import CustomIconButton from "./ToolbarIconButton.jsx";

const TextClearTools = ({handleAction}) => (<Tooltip title="Clear Formatting">
        <CustomIconButton onClick={() => handleAction('clearFormatting')}>
            <FormatClearIcon/>
        </CustomIconButton>
    </Tooltip>);

export default TextClearTools;