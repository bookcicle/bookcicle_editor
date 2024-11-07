import {Tooltip} from '@mui/material';
import FunctionsIcon from '@mui/icons-material/Functions';
import CustomIconButton from "./ToolbarIconButton.jsx";

const FormulaTools = ({handleAction}) => (<>
   <Tooltip title="Insert Formula">
        <CustomIconButton onClick={() => handleAction('formula')}>
            <FunctionsIcon/>
        </CustomIconButton>
    </Tooltip>
</>);

export default FormulaTools;