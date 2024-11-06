import {Tooltip} from '@mui/material';
import SuperscriptIcon from '@mui/icons-material/Superscript';
import SubscriptIcon from '@mui/icons-material/Subscript';
import CustomIconButton from "./ToolbarIconButton.jsx";

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

export default SuperscriptSubscriptTools;