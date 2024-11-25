import { useEffect, useState } from 'react';
import { SpellingActionsPlugin } from './SpellingActionsPlugin.js';
import {
    LinkEditingMenu,
    EditLinkMenuActionButton,
    OpenInNewTabLinkMenuActionButton,
} from './DefaultActionsButtons.jsx';

export const SpellingActionsMenu = (props) => {
    const {
        editor,
        pluginKey = 'langtoolActions',
        tippyOptions = {},
        updateDelay,
        shouldShow = null,
        className,
    } = props;

    const [element, setElement] = useState(null);
    const [linkHref, setLinkHref] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');

    useEffect(() => {
        if (!element || editor.isDestroyed) {
            return;
        }

        const plugin = SpellingActionsPlugin({
            updateDelay,
            editor,
            element,
            pluginKey,
            shouldShow,
            tippyOptions,
        });

        editor.registerPlugin(plugin);

        return () => {
            editor.unregisterPlugin(pluginKey);
        };
    }, [editor, element]);

    useEffect(() => {
        const { $from } = editor.state.selection;
        const linkMark = $from.marks().find((mark) => mark.type.name === 'languagetool');

        if (!linkMark) {
            setLinkHref(null);
        } else {
            setLinkHref(linkMark.attrs.href);
        }

        return () => {
            setLinkUrl('');
            setLinkHref(null);
            setIsEditing(false);
        };
    }, [editor.state.selection]);

    if (isEditing) {
        return (
            <div
                ref={setElement}
                className={className}
                style={{ visibility: 'hidden' }}
            >
                <LinkEditingMenu
                    editor={editor}
                    linkUrl={linkUrl}
                    setLinkUrl={setLinkUrl}
                    setIsEditing={setIsEditing}
                />
            </div>
        );
    }

    return (
        <div
            ref={setElement}
            className={className}
            style={{ visibility: 'hidden' }}
        >
            <EditLinkMenuActionButton
                linkHref={linkHref}
                setLinkUrl={setLinkUrl}
                setIsEditing={setIsEditing}
            />
            <OpenInNewTabLinkMenuActionButton linkHref={linkHref} />
        </div>
    );
};
