import { IconButton, Tooltip } from '@mui/material';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import CodeIcon from '@mui/icons-material/Code';

const ListAndBlockTools = ({ handleAction }) => (
    <>
        <Tooltip title="Bullet List">
            <IconButton onClick={() => handleAction('bulletList')}>
                <FormatListBulletedIcon />
            </IconButton>
        </Tooltip>
        <Tooltip title="Ordered List">
            <IconButton onClick={() => handleAction('orderedList')}>
                <FormatListNumberedIcon />
            </IconButton>
        </Tooltip>
        <Tooltip title="Blockquote">
            <IconButton onClick={() => handleAction('blockquote')}>
                <FormatQuoteIcon />
            </IconButton>
        </Tooltip>
        <Tooltip title="Code Block">
            <IconButton onClick={() => handleAction('code')}>
                <CodeIcon />
            </IconButton>
        </Tooltip>
    </>
);

export default ListAndBlockTools;