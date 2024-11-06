Certainly! Here's the updated README with the **`toolbarStyle`** attribute added to the **Editor Settings** section.

---

# Bookcicle Editor

**Bookcicle Editor** is a feature-rich text editor built on **TipTap** with **React** and **Vite**, leveraging *
*Material UI (MUI)** for styling and theming. It offers a seamless rich-text editing experience with a modern,
customizable interface, allowing users to format text, insert media, and write with style. The editor is designed to be
responsive, flexible, and easy to integrate into various projects.

## Features

- **Rich Text Editing**: Powered by **TipTap**, the editor supports bold, italic, underline, strikethrough, blockquotes,
  lists, headings, and more.
- **Formula Support**: Add and display mathematical formulas using **KaTeX**.
- **Text Alignment**: Align text to the left, center, right, or justify it.
- **Text Color and Highlighting**: Change text color and highlight content with background colors.
- **Image and Media Embedding**: Embed images and links directly into the editor.
- **Indentation Support**: Increase or decrease indentation for lists or paragraphs.
- **Superscript and Subscript**: Support for superscript and subscript text formatting.
- **Drag and Drop**: Easily rearrange content blocks with drag-and-drop functionality.
- **Theming and Styling**: Fully integrated with **Material UI**, supporting light and dark themes, custom color
  palettes, and responsive design.
- **KaTeX Support**: Render LaTeX-based mathematical expressions with **KaTeX**.
- **Extensibility**: Leverage TipTap's extension system to add custom functionality.
- **Page Editor Mode**: Option to display the editor in a page-like format, centered on the screen.
- **Customizable Toolbar**: Adjust the toolbar buttons based on the writing context (e.g., fiction, non-fiction,
  science).

## Installation

You can install **Bookcicle Editor** from npm:

```bash
npm install @bookcicle/bookcicle_editor
```

**Note:** **Bookcicle Editor** has several peer dependencies that need to be installed alongside it:

> **Tip:** Since we leverage TipTap Pro (free) extensions, it's important to configure your npm authentication. See
> TipTap documentation for more details.

```bash
npm install react react-dom @mui/material @mui/icons-material @emotion/react @emotion/styled @tiptap/react @tiptap/core @tiptap/starter-kit @tiptap/extension-underline @tiptap/extension-image @tiptap/extension-text-align @tiptap/extension-subscript @tiptap/extension-superscript @tiptap/extension-font-family @tiptap/extension-highlight @tiptap/extension-text-style @tiptap/extension-color @tiptap/extension-link @tiptap-pro/extension-mathematics katex
```

### Local Development Setup

If you are contributing to the project or developing locally, you can set up your environment with the following steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/bookcicle-editor.git
   cd bookcicle-editor
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the project:**
   ```bash
   npm run build
   ```

4. **Link the editor locally for development:**
   In the `bookcicle-editor` project directory, run:
   ```bash
   npm link
   ```

5. **In the project where you want to use Bookcicle Editor, run:**
   ```bash
   npm link @bookcicle/bookcicle_editor
   ```

6. **Run the development server:**
   ```bash
   npm run dev
   ```
   The app should now be running on [http://localhost:3000](http://localhost:3000).

### Building for Production

To create a production build, run:

```bash
npm run build
```

The build output will be located in the `dist/` folder.

## Customization

The editor is fully customizable and integrates deeply with **Material UI** and **TipTap**. You can adjust the themes,
colors, and typography to fit your project's needs, as well as extend the editor's functionality with TipTap extensions.

To modify the theme:

1. Open your theme configuration file.
2. Customize the palette, typography, and component styles as needed.

### Folder Structure

Here’s an overview of the project structure:

```
bookcicle-editor/
├── public/            # Static files
├── src/
│   ├── components/    # React components
│   ├── assets/        # Styles, fonts, images, etc.
│   ├── App.jsx        # Main app file
│   ├── index.jsx      # Entry point
│   └── Editor.jsx     # Editor entry point
├── README.md          # This file
├── package.json       # Project metadata and scripts
└── vite.config.js     # Vite configuration
```

## Using the Bookcicle Editor

### Editor Settings

The **Bookcicle Editor** provides an `editorSettings` object that allows you to customize various aspects of the
editor's behavior and appearance. Below is a detailed explanation of each setting:

```javascript
/**
 * @typedef {Object} EditorSettings
 * @property {boolean} showVerticalDivider - Show vertical divider between line numbers and editor content. Default is `true`.
 * @property {boolean} openLinks - Allow opening links directly from the editor when clicked. Default is `true`.
 * @property {boolean} enableDragHandle - Enable content dragging using drag handles. Default is `false`.
 * @property {string} buttonSize - Size of the toolbar buttons. One of `['small', 'medium', 'large']`. Default is `'small'`.
 * @property {string} linePadding - Padding size between lines. One of `['small', 'medium', 'large']`. Default is `'small'`.
 * @property {string} languageCode - The language code for the editor (e.g., `'en-US'`). Default is `'en-US'`.
 * @property {boolean} showGrammarSuggestions - Show grammar suggestions within the editor. Default is `true`.
 * @property {boolean} showLineHighlight - Highlight the current line where the cursor is located. Default is `true`.
 * @property {boolean} showLineNumbers - Display line numbers beside each line of content. Default is `true`.
 * @property {boolean} showSpellingSuggestions - Show spelling suggestions within the editor. Default is `true`.
 * @property {boolean} enablePageEditor - Display the editor in a page-like format, centered on the screen. Default is `false`.
 * @property {string} pageEditorWidth - The width of the editor when `enablePageEditor` is `true` (e.g., `'800px'`). Default is `'800px'`.
 * @property {string} toolbarStyle - Style of the toolbar. One of `['fiction', 'non-fiction', 'general', 'science', 'all']`. Default is `'all'`.
 */
```

#### Editor Settings Explained

- **`showVerticalDivider`** (`boolean`): Determines whether a vertical divider is displayed between the line numbers and
  the editor content. Useful for visually separating line numbers from the text area.
    - **Default**: `true`

- **`openLinks`** (`boolean`): Allows users to open hyperlinks directly from the editor by clicking on them.
    - **Default**: `true`

- **`enableDragHandle`** (`boolean`): Enables drag handles on content blocks, allowing users to drag and rearrange
  blocks within the editor.
    - **Default**: `false`

- **`buttonSize`** (`string`): Sets the size of the toolbar buttons. Can be one of:
    - `'small'`: Smaller buttons
    - `'medium'`: Medium-sized buttons
    - `'large'`: Larger buttons
    - **Default**: `'small'`

- **`linePadding`** (`string`): Adjusts the padding between lines in the editor. Can be one of:
    - `'small'`: Less space between lines
    - `'medium'`: Medium space between lines
    - `'large'`: More space between lines
    - **Default**: `'small'`

- **`languageCode`** (`string`): Sets the language code for the editor, which can be used for localization and
  spell-checking purposes.
    - **Default**: `'en-US'`

- **`showGrammarSuggestions`** (`boolean`): Enables or disables grammar suggestions within the editor.
    - **Default**: `true`

- **`showLineHighlight`** (`boolean`): Highlights the line where the cursor is currently positioned, helping users keep
  track of their location in the text.
    - **Default**: `true`

- **`showLineNumbers`** (`boolean`): Displays line numbers next to each line of content in the editor.
    - **Default**: `true`

- **`showSpellingSuggestions`** (`boolean`): Enables or disables spelling suggestions and corrections within the editor.
    - **Default**: `true`

- **`enablePageEditor`** (`boolean`): Activates the page editor mode, which displays the editor content in a page-like
  format, centered on the screen. This provides a writing experience similar to editing a page in a book or a document.
    - **Default**: `false`

- **`pageEditorWidth`** (`string`): Sets the width of the editor when `enablePageEditor` is `true`. This allows you to
  control how wide the page appears on the screen.
    - **Default**: `'800px'`

- **`toolbarStyle`** (`string`): Determines which toolbar buttons are displayed based on the writing context. Possible
  values are:
    - `'fiction'`: Simplified toolbar suitable for fiction writing.
    - `'non-fiction'`: Toolbar optimized for non-fiction writing, including lists and references.
    - `'general'`: Standard toolbar suitable for most writing contexts.
    - `'science'`: Specialized toolbar with tools for scientific writing, including formula insertion.
    - `'all'`: Includes all available toolbar options.
    - **Default**: `'all'`

  This setting allows you to tailor the editor's toolbar to match the specific needs of your writing context, providing
  a more focused and efficient user experience.

#### Example Usage

```jsx
import Editor from '@bookcicle/bookcicle_editor';

function App() {
    const editorSettings = {
        openLinks: true,
        enableDragHandle: true,
        showLineNumbers: true,
        showLineHighlight: true,
        buttonSize: 'medium',
        linePadding: 'medium',
        showVerticalDivider: true,
        enablePageEditor: true,
        pageEditorWidth: '700px',
        toolbarStyle: 'non-fiction', // Choose 'fiction', 'non-fiction', 'general', 'science', or 'all'
    };

    return (
        <Editor
            readOnly={false}
            defaultValue="<p>Your initial content here...</p>"
            onTextChange={(text) => console.log('Text changed:', text)}
            onSelectionChange={(selection) => console.log('Selection changed:', selection)}
            onDeltaChange={(delta) => console.log('Delta changed:', delta)}
            editorSettings={editorSettings}
        />
    );
}
```

### Toolbar Options

The **Bookcicle Editor** provides a customizable toolbar that adjusts based on the `toolbarStyle` setting. Below are the
toolbar options available:

- **Text Formatting**: Bold, Italic, Underline, Strikethrough
- **Text Color** and **Background Color** (highlighting)
- **Lists**: Ordered (numbered) and bullet lists
- **Blockquotes**
- **Alignment**: Left, center, right, justify
- **Superscript** and **Subscript**
- **Formula Insertion**: Insert mathematical formulas using **KaTeX**
- **Image** and **Link** Embedding
- **Heading Levels**: Adjust heading levels for structured content
- **Text Clear Tools**: Clear formatting from selected text
- **Undo/Redo**: Essential editing actions

#### Toolbar Styles Explained

- **`fiction`**:
    - **Includes**: Text Formatting, Alignment Tools, Heading Tools, Text Clear Tools, Undo/Redo
    - **Excludes**: Lists, Blockquotes, Superscript/Subscript, Font and Color Tools, Insert Tools (Images, Links),
      Formula Insertion

- **`non-fiction`**:
    - **Includes**: All from 'fiction', plus Lists, Blockquotes, Superscript/Subscript, Font and Color Tools, Insert
      Tools (Images, Links)
    - **Excludes**: Formula Insertion (unless scientific content is expected)

- **`general`**:
    - **Includes**: A balanced set of tools suitable for most writing contexts, including Text Formatting, Lists,
      Blockquotes, Alignment, Heading Tools, Superscript/Subscript, Font and Color Tools, Insert Tools, Text Clear
      Tools, Undo/Redo

- **`science`**:
    - **Includes**: All from 'general', plus Formula Insertion for mathematical and scientific content
    - **Excludes**: May exclude certain styling tools not commonly used in scientific writing

- **`all`**:
    - **Includes**: All available toolbar options, providing the most comprehensive set of tools

These options are highly customizable. To modify the toolbar or add custom functionality, you can adjust the extensions
and toolbar configuration in the `Editor` component.

### Adding New Features

To add new functionality or modify existing behavior, you can update the **TipTap** configuration in
`src/components/Editor.jsx`. TipTap's extension-based architecture allows you to easily add custom extensions or
integrate third-party extensions to extend the editor’s capabilities.

For example, to add a new extension:

1. **Install the extension via npm.**
2. **Import the extension in your `Editor.jsx` file.**
3. **Add the extension to the `extensions` array in the `useEditor` hook.**

### Themes

**Bookcicle Editor** supports theming with **Material UI**. You can easily switch between light and dark themes or
customize the existing theme to match your branding.

An MUI `<ThemeProvider><Editor /></ThemeProvider>` should wrap this component. See `App.jsx` for an example.

### Formula Support

The editor includes support for LaTeX-style formulas using **KaTeX**. You can insert formulas using the appropriate
button in the toolbar. Ensure you have **KaTeX** installed:

```bash
npm install katex
```

## Contributing

We welcome contributions to the **Bookcicle Editor**! To contribute:

1. **Fork the repository.**
2. **Create a new feature branch (`git checkout -b feature/your-feature`).**
3. **Commit your changes (`git commit -m 'Add your feature'`).**
4. **Push to the branch (`git push origin feature/your-feature`).**
5. **Create a pull request.**

## Testing in Upstream

Since we do not build a CommonJS entry, make sure you adjust your Jest configuration if you are testing in a project
that consumes this module.

For example, you may need to configure `transformIgnorePatterns` in your Jest config:

```json
{
  "jest": {
    "transformIgnorePatterns": [
      "<rootDir>/node_modules/(?!@bookcicle/bookcicle_editor.*\\.js$)"
    ]
  }
}
```

You may also need to handle TipTap packages inside your Jest config.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **TipTap** for the powerful text editor engine.
- **Material UI** for the design components and theming.
- **Vite** for the fast build tool.
- **KaTeX** for LaTeX formula rendering.

---

Happy coding with **Bookcicle Editor**!