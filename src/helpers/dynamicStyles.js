import {css} from "@emotion/react";
import {alpha} from "@mui/material";

const dynamicStyles = (theme) => {
    return css`
        /* Line Numbers */

        .ql-editor {
            counter-reset: line;
            position: initial;
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
            color: ${theme.palette.text.secondary || '#888'};
            user-select: none;
            font-size: 14px; /* Fixed font size for line numbers */
            line-height: 1.2; /* Adjust for better vertical alignment */
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
        /* Continuous Vertical Border for Gutter */

        .quill-editor-wrapper::before {
            content: '';
            position: absolute;
            top: 0;
            left: 1.7em;
            width: 1px;
            height: 100%;
            background-color: ${theme.palette.divider || '#ddd'};
            z-index: 1;
        }
    `;
}

export default dynamicStyles;