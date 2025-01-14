import { css } from "@emotion/react";
import { alpha } from "@mui/material";
import { adjustColorForTheme, generateActiveColor } from "./colorUtils.js";

const dynamicStyles = ({
                           theme,
                           showLineNumbers,
                           showDivider,
                           linePadding,
                           buttonSize = "xs",
                           enableDragHandle,
                           enableChecksBackgroundDecoration = false,
                           enableSpellcheckDecoration = true,
                           enabledGrammarCheckDecoration = true,
                       }) => {
    let tipTapPadding = "1em";
    let dragDisplay = "none";
    if (enableDragHandle) {
        tipTapPadding = "3em";
        dragDisplay = "flex";
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
        case "xl":
            padding = "32px !important";
            break;
        default:
            padding = "12px !important";
    }

    let buttonScale;
    switch (buttonSize) {
        case "xs":
            buttonScale = 0.7;
            break;
        case "small":
            buttonScale = 0.8;
            break;
        case "medium":
            buttonScale = 0.9;
            break;
        case "large":
            buttonScale = 1.0;
            break;
        case "xl":
            buttonScale = 1.2;
            break;
        default:
            buttonScale = 0.6;
    }

    let spellingLtBackground;
    let grammarLtBackground;
    let otherLtBackground;

    if (enableChecksBackgroundDecoration) {
        spellingLtBackground = alpha(theme.palette.error.main, 0.2);
        grammarLtBackground = alpha(theme.palette.warning.main, 0.2);
        otherLtBackground = alpha(theme.palette.primary.main, 0.2);
    } else {
        spellingLtBackground = "transparent";
        grammarLtBackground = "transparent";
        otherLtBackground = "transparent";
    }

    const searchHighlightColor = adjustColorForTheme(
        theme.palette.mode === "dark"
            ? theme.palette.primary.dark
            : theme.palette.primary.light,
        theme,
        0.1
    );
    const searchActiveColor = generateActiveColor(searchHighlightColor, theme, 0.4);

    return css`
        /* Search and Replace */
        .search-result {
            background-color: ${searchHighlightColor};
        }

        .search-result-current {
            background-color: ${searchActiveColor};
        }

        /* Editor Wrapper */
        .tiptap-editor-wrapper {
            display: flex;
            position: relative;
            height: 100%;
            width: 100%;
        }

        /* 
         * LINE NUMBERS GUTTER
         * We first reset the line counter for the editor. 
         */
        .tiptap-editor {
            counter-reset: line;
            padding-left: ${tipTapPadding};
            position: relative;
            flex-grow: 1;
            overflow-y: auto;
        }

        /*
         * ONLY increment the line counter and show ::before 
         * for top-level elements that are NOT blockquote, ul, ol, pre, or code.
         * This completely excludes them from line numbering.
         */
        .tiptap-editor .ProseMirror > *:not(blockquote):not(ul):not(ol):not(pre):not(code) {
            counter-increment: line;
            position: relative;
            margin-left: 0;
            padding-left: 0;
        }

        /*
         * Show the actual line number with ::before
         * on those same elements only.
         */
        .tiptap-editor .ProseMirror > *:not(blockquote):not(ul):not(ol):not(pre):not(code)::before {
            content: counter(line);
            position: absolute;
            left: -2em;
            width: 2em;
            text-align: left;
            color: ${showLineNumbers ? theme.palette.text.secondary : "transparent"};
            user-select: none;
            font-size: 14px;
            line-height: 1.68em;
        }

        /* 
         * Indentation for blockquotes, lists, etc.
         * Because we excluded them above, they won't get line numbers or increment the counter.
         */
        .tiptap-editor .ProseMirror > blockquote {
            padding-left: 1em;
            border-left: 2px solid ${theme.palette.divider};
        }

        .tiptap-editor .ProseMirror > ul,
        .tiptap-editor .ProseMirror > ol {
            padding-left: 2em;
        }

        .tiptap-editor .ProseMirror > ul > li,
        .tiptap-editor .ProseMirror > ol > li {
            padding-left: 2em;
        }

        /* Code blocks (pre, code) remain unnumbered */
        .active-line {
            background-color: ${alpha(theme.palette.primary.light, 0.1)} !important;
            width: 100%;
            position: relative;
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

        /* Divider between gutter and editor */
        .tiptap-editor-wrapper::before {
            content: "";
            position: absolute;
            top: 0;
            left: 1.2em;
            width: 1px;
            height: 100%;
            background-color: ${showDivider ? theme.palette.divider : "transparent"};
            z-index: 1;
        }

        .MuiToolbar-root {
            scale: ${buttonScale};
        }

        /* 
         * The main ProseMirror content area 
         */
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
            display: ${dragDisplay};
            height: 1.5rem;
            justify-content: center;
            width: 1.5rem;
            svg {
                width: 1.25rem;
                height: 1.25rem;
                color: ${theme.palette.text.primary};
            }
        }

        /* LanguageTool highlights */
        .ProseMirror {
            .lt {
                text-decoration: none; /* Default: no underline */
                ${
                        (enableSpellcheckDecoration || enabledGrammarCheckDecoration) &&
                        css`
                            text-decoration: underline;
                            text-decoration-style: wavy;
                            text-decoration-color: ${theme.palette.error.main};
                            transition: background 0.25s ease-in-out;
                            &:hover {
                                background: ${alpha(theme.palette.error.main, 0.2)};
                            }
                        `
                }

                &-style {
                    text-decoration-color: ${theme.palette.secondary.main};
                    &:hover {
                        background: ${alpha(theme.palette.secondary.main, 0.2)} !important;
                    }
                }

                ${
                        enableSpellcheckDecoration &&
                        css`
                            &-spelling-error {
                                background: ${spellingLtBackground};
                            }
                        `
                }

                ${
                        enabledGrammarCheckDecoration &&
                        css`
                            &-typographical,
                            &-grammar-error {
                                text-decoration-color: ${theme.palette.warning.main};
                                background: ${grammarLtBackground} !important;
                                &:hover {
                                    background: ${alpha(theme.palette.warning.main, 0.2)} !important;
                                }
                            }
                        `
                }

                    /* Other error types */
                &-other-error {
                    text-decoration-color: ${theme.palette.primary.main};
                    background: ${otherLtBackground} !important;
                    &:hover {
                        background: ${alpha(theme.palette.primary.main, 0.2)} !important;
                    }
                }
            }
        }

        .ProseMirror-focused {
            outline: none !important;
        }

        .flex {
            display: flex;
            div {
                width: 50%;
            }
        }

        .bubble-menu > .bubble-menu-section-container {
            display: flex;
            flex-direction: column;
            background-color: ${theme.palette.background.paper};
            padding: 8px;
            border-radius: 8px;
            box-shadow: 0 0 10px ${alpha(theme.palette.common.black, 0.25)};
            max-width: 400px;

            .suggestions-section {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                gap: 4px;
                margin-top: 1em;

                .suggestion {
                    background-color: ${theme.palette.info.main};
                    border-radius: 4px;
                    color: ${theme.palette.common.white};
                    cursor: pointer;
                    font-weight: 500;
                    padding: 4px;
                    display: flex;
                    align-items: center;
                    font-size: 1.1em;
                    max-width: fit-content;
                }
            }
        }

        /* Suggestion box styling */
        .suggestion-box {
            position: absolute;
            background: white;
            border: 1px solid #ccc;
            border-radius: 4px;
            z-index: 1000;
            padding: 5px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .suggestion-item {
            padding: 2px 5px;
            cursor: pointer;
        }

        .suggestion-item:hover {
            background-color: #f0f0f0;
        }
    `;
};

export default dynamicStyles;
