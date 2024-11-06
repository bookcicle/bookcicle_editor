import {Tooltip} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import FunctionsIcon from '@mui/icons-material/Functions';
import LinkIcon from "@mui/icons-material/Link";
import CustomIconButton from "./ToolbarIconButton.jsx";

const InsertTools = ({handleAction}) => (<>
    <Tooltip title="Insert Link">
        <CustomIconButton onClick={() => handleAction('link')}>
            <LinkIcon/>
        </CustomIconButton>
    </Tooltip>
    <Tooltip title="Insert Image">
        <CustomIconButton onClick={() => handleAction('image')}>
            <ImageIcon/>
        </CustomIconButton>
    </Tooltip>
    <Tooltip title="Insert Formula">
        <CustomIconButton onClick={() => handleAction('formula')}>
            <FunctionsIcon/>
        </CustomIconButton>
    </Tooltip>

</>);

export default InsertTools;