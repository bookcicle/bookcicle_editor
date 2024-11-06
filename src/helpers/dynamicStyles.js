// dynamicStyles.js
import {css} from "@emotion/react";
import {alpha} from "@mui/material";

const dynamicStyles = (theme, showLineNumbers, showDivider, linePadding, buttonSize = "xs", enableDragHandle) => {

    let tipTapPadding = 0
    if (enableDragHandle) {
        tipTapPadding = "3em"
    }

    let padding = "0";
    switch (linePadding) {
        case "xs":
            padding = "8px !important";
            break;
        case "small":
            padding = "12px !important";
            break;
        case "medium":
            padding = "16px !important";
            break;
        case "large":
            padding = "24px !important";
            break;
        default:
            padding = "12px !important";
    }

    let buttonSizeStyle;
    switch (buttonSize) {
        case "xs":
            buttonSizeStyle = "18px !important";
            break;
        case "small":
            buttonSizeStyle = "22px !important";
            break;
        case "medium":
            buttonSizeStyle = "26px !important";
            break;
        case "large":
            buttonSizeStyle = "30px !important";
            break;
        default:
            buttonSizeStyle = "18px !important";
    }

    return css`
        /* Editor Wrapper */

        .tiptap-editor-wrapper {
            display: flex;
            position: relative;
            border-right: 1px solid ${showDivider ? theme.palette.divider : "transparent"};
            height: 100%;
            width: 100%;
        }

        /* Line Numbers Gutter */

        .tiptap-editor {
            counter-reset: line; /* Reset the line counter */
            padding-left: ${tipTapPadding}; /* Space for line numbers */
            position: relative;
            flex-grow: 1;
            overflow-y: auto;
        }

        /* Increment the line counter only for direct children of ProseMirror */

        .tiptap-editor .ProseMirror > p,
        .tiptap-editor .ProseMirror > h1,
        .tiptap-editor .ProseMirror > h2,
        .tiptap-editor .ProseMirror > h3,
        .tiptap-editor .ProseMirror > blockquote,
        .tiptap-editor .ProseMirror > ul > li,
        .tiptap-editor .ProseMirror > ol > li {
            counter-increment: line;
            position: relative;
            margin-left: 0; /* Remove default margin */
            padding-left: 0; /* Remove default padding */
        }

        /* Display line numbers in the gutter */

        .tiptap-editor .ProseMirror > p::before,
        .tiptap-editor .ProseMirror > h1::before,
        .tiptap-editor .ProseMirror > h2::before,
        .tiptap-editor .ProseMirror > h3::before,
        .tiptap-editor .ProseMirror > blockquote::before,
        .tiptap-editor .ProseMirror > ul > li::before,
        .tiptap-editor .ProseMirror > ol > li::before {
            content: counter(line);
            position: fixed;
            left: -0.7em; /* Align with gutter padding */
            width: 2em;
            text-align: right;
            color: ${showLineNumbers ? theme.palette.text.secondary : "transparent"};
            user-select: none;
            font-size: 14px;
            line-height: 1.68em;
        }

        /* Indentation for blockquotes and lists */

        .tiptap-editor .ProseMirror > blockquote {
            padding-left: 1em; /* Indent blockquotes */
            border-left: 2px solid ${theme.palette.divider};
        }

        .tiptap-editor .ProseMirror > ul,
        .tiptap-editor .ProseMirror > ol {
            padding-left: 1em; /* Indent lists */
        }

        .tiptap-editor .ProseMirror > ul > li,
        .tiptap-editor .ProseMirror > ol > li {
            padding-left: 1em; /* Indent list items */
        }

        .active-line {
            background-color: ${alpha(theme.palette.primary.light, 0.1)} !important;
            width: calc(100% - 10px);
            position: relative;
            padding: 0 5px !important;
        }

        .tiptap-editor .ProseMirror p,
        .tiptap-editor .ProseMirror h1,
        .tiptap-editor .ProseMirror h2,
        .tiptap-editor .ProseMirror h3,
        .tiptap-editor .ProseMirror h4,
        .tiptap-editor .ProseMirror h5,
        .tiptap-editor .ProseMirror h6,
        .tiptap-editor .ProseMirror blockquote,
        .tiptap-editor .ProseMirror ul,
        .tiptap-editor .ProseMirror ol,
        .tiptap-editor .ProseMirror li,
        .tiptap-editor .ProseMirror pre,
        .tiptap-editor .ProseMirror code {
            margin-top: ${padding};
            margin-bottom: ${padding};
        }

        /* Vertical divider between gutter and editor */

        .tiptap-editor-wrapper::before {
            content: '';
            position: fixed;
            top: 2.5em; /* Adjust this value to start where your editor's content begins */
            left: 2em;
            width: 1px;
            height: calc(100% - 2em); /* Adjust this value to stop where the editor ends */
            background-color: ${showDivider ? (theme.palette.text.primary || '#ddd') : theme.palette.background.default};
            transform: scaleX(0.1);
            transform-origin: left;
            z-index: 1;
        }

        /* Toolbar button sizing */

        .MuiIconButton-root {
            width: ${buttonSizeStyle};
            height: ${buttonSizeStyle};
            margin: 3px !important;
            transition: border-radius 0.2s ease; /* Smooth transition on hover */
        }

        /* ProseMirror editor styling */

        .ProseMirror {
            padding-inline: 1em;

            > * + * {
                margin-top: 0.75em;
            }

            [data-id] {
                border: 3px solid ${theme.palette.background.default};
                border-radius: 0.5rem;
                margin: 1rem 0;
                position: relative;
                margin-top: 1.5rem;
                padding: 2rem 1rem 1rem;

                &::before {
                    content: attr(data-id);
                    background-color: ${theme.palette.background.default};
                    font-size: 0.6rem;
                    letter-spacing: 1px;
                    font-weight: bold;
                    text-transform: uppercase;
                    color: ${theme.palette.primary.main};
                    position: absolute;
                    top: 0;
                    padding: 0.25rem 0.75rem;
                    border-radius: 0 0 0.5rem 0.5rem;
                }
            }
        }

        .ProseMirror:focus {
            outline: none;
        }

        /* Drag handle styling */

        .drag-handle {
            align-items: center;
            border-radius: 0.25rem;
            border: 1px solid ${theme.palette.text.primary};
            cursor: grab;
            display: flex;
            height: 1.5rem;
            justify-content: center;
            width: 1.5rem;

            svg {
                width: 1.25rem;
                height: 1.25rem;
                color: ${theme.palette.text.primary};
            }
        }
    `;

};

export default dynamicStyles;
