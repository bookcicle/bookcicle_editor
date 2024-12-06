import {Tooltip} from '@mui/material';
import SuperscriptIcon from '@mui/icons-material/Superscript';
import SubscriptIcon from '@mui/icons-material/Subscript';
import CustomIconButton from "./ToolbarIconButton.jsx";
import PropTypes from "prop-types";

export const SuperscriptSubscriptTools = ({handleAction}) => (<>
    <Tooltip title="Superscript">
        <CustomIconButton onClick={() => handleAction('superscript')}>
            <SuperscriptIcon/>
        </CustomIconButton>
    </Tooltip>
    <Tooltip title="Subscript">
        <CustomIconButton onClick={() => handleAction('subscript')}>
            <SubscriptIcon/>
        </CustomIconButton>
    </Tooltip>
</>);
SuperscriptSubscriptTools.propTypes = {
    handleAction: PropTypes.func.isRequired,
};
export default SuperscriptSubscriptTools;