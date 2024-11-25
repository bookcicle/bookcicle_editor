import { CheckOutlined, CloseOutlined, EditOutlined, OpenInNewOutlined } from '@mui/icons-material';
import { IconButton, TextField } from '@mui/material';
import { ToolbarButton } from './ToolbarButtons.jsx';

export const LinkEditingMenu = ({ linkUrl, setLinkUrl, editor, setIsEditing }) => {
    return (
        <>
            <TextField
                id="edit-link-url"
                size="small"
                variant="outlined"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                style={{ height: 12, padding: '0px 10px', marginTop: '6px' }}
                InputLabelProps={{
                    style: {
                        fontSize: '12px',
                    },
                }}
                inputProps={{
                    style: {
                        height: 12,
                        fontSize: '14px',
                    },
                }}
            />

            <IconButton
                color="success"
                component="label"
                onClick={() => {
                    editor.chain().extendMarkRange('link').updateAttributes('link', { href: linkUrl }).run();
                }}
                disableRipple
            >
                <CheckOutlined />
            </IconButton>

            <IconButton
                color="error"
                component="label"
                onClick={() => {
                    setLinkUrl('');
                    setIsEditing(false);
                }}
                disableRipple
            >
                <CloseOutlined />
            </IconButton>
        </>
    );
};

export const EditLinkMenuActionButton = ({ setLinkUrl, linkHref, setIsEditing }) => {
    return (
        <ToolbarButton
            tooltip="Edit link"
            Icon={EditOutlined}
            onClick={() => {
                setLinkUrl(linkHref || '');
                setIsEditing(true);
            }}
        />
    );
};

export const OpenInNewTabLinkMenuActionButton = ({ linkHref }) => {
    return (
        <ToolbarButton
            tooltip="Open link"
            Icon={OpenInNewOutlined}
            onClick={() => {
                if (linkHref) {
                    window.open(linkHref, '_blank');
                }
            }}
        />
    );
};
