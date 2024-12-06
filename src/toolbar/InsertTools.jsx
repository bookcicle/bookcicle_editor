import {Tooltip} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import LinkIcon from "@mui/icons-material/Link";
import CustomIconButton from "./ToolbarIconButton.jsx";
import PropTypes from "prop-types";

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
InsertTools.propTypes = {
    handleAction: PropTypes.func.isRequired,
    toolbarStyle: PropTypes.string.isRequired,
};
export default InsertTools;