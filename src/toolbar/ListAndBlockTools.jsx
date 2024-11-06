import {Tooltip} from '@mui/material';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import CodeIcon from '@mui/icons-material/Code';
import CustomIconButton from "./ToolbarIconButton.jsx";

const ListAndBlockTools = ({handleAction}) => (<>
        <Tooltip title="Bullet List">
            <CustomIconButton onClick={() => handleAction('bulletList')}>
                <FormatListBulletedIcon/>
            </CustomIconButton>
        </Tooltip>
        <Tooltip title="Ordered List">
            <CustomIconButton onClick={() => handleAction('orderedList')}>
                <FormatListNumberedIcon/>
            </CustomIconButton>
        </Tooltip>
        <Tooltip title="Blockquote">
            <CustomIconButton onClick={() => handleAction('blockquote')}>
                <FormatQuoteIcon/>
            </CustomIconButton>
        </Tooltip>
        <Tooltip title="Code Block">
            <CustomIconButton onClick={() => handleAction('code')}>
                <CodeIcon/>
            </CustomIconButton>
        </Tooltip>
    </>);

export default ListAndBlockTools;