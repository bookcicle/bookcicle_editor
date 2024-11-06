import { IconButton, Tooltip } from '@mui/material';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';

const UndoRedoTools = ({ handleAction }) => (
    <>
        <Tooltip title="Undo">
            <IconButton onClick={() => handleAction('undo')}>
                <UndoIcon />
            </IconButton>
        </Tooltip>
        <Tooltip title="Redo">
            <IconButton onClick={() => handleAction('redo')}>
                <RedoIcon />
            </IconButton>
        </Tooltip>
    </>
);

export default UndoRedoTools;