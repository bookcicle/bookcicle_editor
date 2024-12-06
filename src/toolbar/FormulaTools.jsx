import {Tooltip} from '@mui/material';
import FunctionsIcon from '@mui/icons-material/Functions';
import CustomIconButton from "./ToolbarIconButton.jsx";
import PropTypes from "prop-types";

const FormulaTools = ({handleAction}) => (<>
   <Tooltip title="Insert Formula">
        <CustomIconButton onClick={() => handleAction('formula')}>
            <FunctionsIcon/>
        </CustomIconButton>
    </Tooltip>
</>);
FormulaTools.propTypes = {
    handleAction: PropTypes.func.isRequired
}
export default FormulaTools;