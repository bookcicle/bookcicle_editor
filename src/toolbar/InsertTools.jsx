import {Tooltip} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import FunctionsIcon from '@mui/icons-material/Functions';
import LinkIcon from "@mui/icons-material/Link";
import CustomIconButton from "./ToolbarIconButton.jsx";

const InsertTools = ({handleAction, toolbarStyle}) => (<>
    <Tooltip title="Insert Link">
        <CustomIconButton onClick={() => handleAction('link')}>
            <LinkIcon/>
        </CustomIconButton>
    </Tooltip>
    {['non-fiction', 'science', 'all'].includes(toolbarStyle) && <Tooltip title="Insert Image">
        <CustomIconButton onClick={() => handleAction('image')}>
            <ImageIcon/>
        </CustomIconButton>
    </Tooltip>}
</>);

export default InsertTools;