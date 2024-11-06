import {Tooltip} from '@mui/material';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import CustomIconButton from "./ToolbarIconButton.jsx";

const UndoRedoTools = ({handleAction}) => (
    <>
        <Tooltip title="Undo">
            <CustomIconButton onClick={() => handleAction('undo')}>
                <UndoIcon/>
            </CustomIconButton>
        </Tooltip>
        <Tooltip title="Redo">
            <CustomIconButton onClick={() => handleAction('redo')}>
                <RedoIcon/>
            </CustomIconButton>
        </Tooltip>
    </>
);

export default UndoRedoTools;