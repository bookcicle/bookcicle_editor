import {css} from "@emotion/react";
import {alpha} from "@mui/material";

const dynamicStyles = (theme, showLineNumbers, showDivider, linePadding, buttonSize = "xs") => {

    let p = "0"
    switch (linePadding) {
        case "xs":
            p = "0 !important";
            break;
        case "small":
            p = "2px 0 !important"
            break;
        case "medium":
            p = "4px 0 !important"
            break;
        case "large":
            p = "6px 0 !important"
            break;
        default:
            p = "0"
    }

    let b;
    switch (buttonSize) {
        case "xs":
            b = "24px !important"
            break;
        case "small":
            b = "28px !important"
            break;
        case "medium":
            b = "34px !important"
            break;
        case "large":
            b = "38px !important"
            break;
        default:
            b = "28px !important"
    }

    return css`
        .custom-quill-icon svg {
            fill: currentColor;
            display: inline-block;
            vertical-align: middle;
            color: ${theme.palette.text.primary};
        }

        .ql-snow.ql-toolbar button {
            width: ${b};
            height: ${b};
            padding: 3px;
        }

        .custom-quill-icon svg:hover {
            fill: currentColor; /* Use current text color */
            display: inline-block;
            vertical-align: middle;
            color: ${theme.palette.text.secondary};
            font-size: 24px; /* Set the icon size relative to the toolbar */
            width: auto; /* Ensure width adapts to the svg */
            height: auto; /* Ensure height adapts to the svg */
        }

        .ql-editor {
            counter-reset: line;
            position: initial;
        }

        .ql-editor p, .ql-editor h1, .ql-editor h2, .ql-editor h3, .ql-editor h4, .ql-editor h5, .ql-editor h6 {
            padding: ${p};
        }

        .ql-toolbar {
            position: relative;
            z-index: 3;
            background-color: transparent !important;
            border-bottom: 1px solid ${theme.palette.divider};
            border-radius: 25px;
        }

        .ql-active {
            border: solid 1px ${alpha(theme.palette.primary.main, 0.5)} !important;
            background-color: ${alpha(theme.palette.primary.main, 0.5)} !important;
            border-radius: 3px;
        }

        .ql-active:hover {
            background-color: ${theme.palette.primary.main} !important;
        }

        .ql-editor p::before,
        .ql-editor h1::before,
        .ql-editor h2::before,
        .ql-editor h3::before,
        .ql-editor h4::before,
        .ql-editor h5::before,
        .ql-editor h6::before,
        .ql-editor blockquote::before {
            counter-increment: line;
            content: counter(line);
            position: absolute;
            left: 0;
            width: 2em;
            text-align: right;
            padding-right: 0.5em;
            color: ${showLineNumbers ? (theme.palette.text.secondary || '#888') : theme.palette.background.default};
            user-select: none;
            font-size: 14px; /* Fixed font size for line numbers */
            line-height: 1.6; /* Adjust for better vertical alignment */
            border-right: none; /* Remove border-right to avoid overlapping with vertical border */
            z-index: 2; /* Ensure line numbers appear above the gutter border */
        }

        /* Adjust paragraph and heading position to make space for line numbers */

        .ql-editor p,
        .ql-editor h1,
        .ql-editor h2,
        .ql-editor h3,
        .ql-editor h4,
        .ql-editor h5,
        .ql-editor h6,
        .ql-editor blockquote {
            position: initial;
            margin-left: 0;
        }

        .ql-editor p:empty::before,
        .ql-editor h1:empty::before,
        .ql-editor h2:empty::before,
        .ql-editor h3:empty::before,
        .ql-editor h4:empty::before,
        .ql-editor h5:empty::before,
        .ql-editor h6:empty::before,
        .ql-editor blockquote:empty::before {
            content: counter(line);
        }

        .active-line {
            background-color: ${theme.palette.action.hover || 'rgba(0, 0, 0, 0.04)'};
        }

        .ql-toolbar .ql-stroke {
            fill: none;
            stroke: ${theme.palette.text.primary};
        }

        .ql-toolbar .ql-fill {
            fill: ${theme.palette.text.primary};
            stroke: ${theme.palette.text.primary};
        }

        .ql-toolbar .ql-picker {
            color: ${theme.palette.text.primary};
        }

        .ql-picker-label {
            color: ${theme.palette.text.primary}
        }

        .ql-picker-label svg {
            vertical-align: unset;
        }

        .ql-snow.ql-toolbar .ql-picker-label.ql-active {
            color: ${theme.palette.text.primary}
        }

        .ql-snow .ql-tooltip {
            color: ${theme.palette.text.primary};
            background-color: ${theme.palette.background.paper};
        }

        .ql-picker-options {
            background-color: ${theme.palette.background.default} !important;
        }

        button:hover .ql-stroke, .ql-picker-label:hover .ql-stroke {
            fill: none;
            stroke: ${theme.palette.primary.main} !important;
        }

        .ql-active .ql-stroke {
            fill: none;
            stroke: ${alpha(theme.palette.primary.main, 0.5)} !important;
        }

        button:hover .ql-fill, .ql-picker-label:hover .ql-fill {
            fill: ${theme.palette.primary.main} !important;
            stroke: ${alpha(theme.palette.primary.main, 0.5)};
        }

        .ql-active .ql-fill {
            fill: ${alpha(theme.palette.primary.main, 0.5)} !important;
            stroke: ${alpha(theme.palette.primary.main, 0.5)};
        }

        .ql-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-label, .ql-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-options {
            border-color: ${theme.palette.primary.main};
            border-radius: 4px;
        }

        .ql-picker-item:hover {
            color: ${theme.palette.primary.main} !important;
        }

        .ql-picker-label:hover {
            color: ${theme.palette.primary.main} !important;
        }

        .ql-picker-label.ql-active {
            color: ${theme.palette.primary.main} !important;
            background-color: transparent !important;
        }

        /* Continuous Vertical Border for Gutter */


        .quill-editor-wrapper::before {
            content: '';
            position: absolute;
            top: 2.5em; /* Adjust this value to start where your editor's content begins */
            left: 1.7em;
            width: 1px;
            height: calc(100% - 2em); /* Adjust this value to stop where the editor ends */
            background-color: ${showDivider ? (theme.palette.primary.main || '#ddd') : theme.palette.background.default};
            transform: scaleX(0.2);
            transform-origin: left;
            z-index: 1;
        }

    `;
}

export default dynamicStyles;