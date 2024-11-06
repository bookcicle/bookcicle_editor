import {IconButton, Tooltip} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import FunctionsIcon from '@mui/icons-material/Functions';
import LinkIcon from "@mui/icons-material/Link";

const InsertTools = ({handleAction}) => (<>
        <Tooltip title="Insert Link">
            <IconButton onClick={() => handleAction('link')}>
                <LinkIcon/>
            </IconButton>
        </Tooltip>
        <Tooltip title="Insert Image">
            <IconButton onClick={() => handleAction('image')}>
                <ImageIcon/>
            </IconButton>
        </Tooltip>
        <Tooltip title="Insert Formula">
            <IconButton onClick={() => handleAction('formula')}>
                <FunctionsIcon/>
            </IconButton>
        </Tooltip>

    </>);

export default InsertTools;