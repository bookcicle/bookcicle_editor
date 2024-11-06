import {IconButton, Tooltip} from '@mui/material';
import FormatClearIcon from '@mui/icons-material/FormatClear';

const TextClearTools = ({ handleAction }) => (
    <Tooltip title="Clear Formatting">
        <IconButton onClick={() => handleAction('clearFormatting')}>
            <FormatClearIcon />
        </IconButton>
    </Tooltip>
);

export default TextClearTools;