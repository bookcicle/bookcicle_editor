import {Tooltip} from '@mui/material';
import FunctionsIcon from '@mui/icons-material/Functions';
import CustomIconButton from "./ToolbarIconButton.jsx";

const FormulaTools = ({handleAction, toolbarStyle}) => (<>
    {['non-fiction', 'general', 'science', 'all'].includes(toolbarStyle) && (<Tooltip title="Insert Formula">
        <CustomIconButton onClick={() => handleAction('formula')}>
            <FunctionsIcon/>
        </CustomIconButton>
    </Tooltip>)}
</>);

export default FormulaTools;