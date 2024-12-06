import {Tooltip} from '@mui/material';
import FormatClearIcon from '@mui/icons-material/FormatClear';
import CustomIconButton from "./ToolbarIconButton.jsx";
import PropTypes from "prop-types";

const TextClearTools = ({handleAction}) => (<Tooltip title="Clear Formatting">
    <CustomIconButton onClick={() => handleAction('clearFormatting')}>
        <FormatClearIcon/>
    </CustomIconButton>
</Tooltip>);

TextClearTools.propTypes = {
    handleAction: PropTypes.func.isRequired,
};
export default TextClearTools;