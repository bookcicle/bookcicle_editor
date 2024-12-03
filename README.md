# Bookcicle Editor

**Bookcicle Editor** is a feature-rich, opinionated impl, text editor built on **TipTap** with **React** and **Vite**,
leveraging *
*Material UI (MUI)** for styling and theming. It offers a seamless rich-text editing experience with a modern,
customizable interface, allowing users to format text, insert media, and write with style. The editor is designed to be
responsive and flexible, built to be integrated into desktop application frontends. Bookcicle uses it in its Tauri V2
cross-platform desktop application.

## Features

- **Rich Text Editing**: Powered by **TipTap**, the editor supports bold, italic, underline, strikethrough, blockquotes,
  lists, headings, and more.
- **Spellcheck and Grammar Checking** with **LanguageTool** Support.
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

   Fork it... then

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

4. **In the project where you want to use Bookcicle Editor, run:**

   ```bash
   npm install `paths/to/bookcicle_editor`
   ```

**Import**
`import {Editor} from @bookcicle/bookcicle_editor`

or

**Lazy Import**

```
const Editor = lazy(() =>
  import("@bookcicle/bookcicle_editor").then((module) => ({
    default: module.Editor,
  })),
);
```

5. **Run the development server:**

   ```bash
   npm run dev
   ```

   The app should now be running on [http://localhost:5173](http://localhost:5173).

### Building for Production

To create a production build, run:

```bash
npm run build
```

The build output will be located in the `dist/` folder.

## Enabling Spell Check and Grammar Suggestions

The **Bookcicle Editor** supports spell check and grammar suggestions through **LanguageTool**. To enable these
features, you'll need to install the `languagetool-rust` dependency.

### Prerequisites

- Ensure you have Rust installed on your system. You can install it via [rustup](https://rustup.rs/).
- A working installation of `npm` or `yarn`.

### Installing `languagetool-rust`

You can use any implementation of LanguageTool server. We use `languagetool-rust` to stand up a LanguageTool server
using Docker. Follow these steps to install and integrate `languagetool-rust`:

1. **Install `languagetool-rust`** as a project dependency:

   ```bash
   cargo install languagetool-rust
   ```

2. **Configure the spell check and grammar suggestion settings**:

   Update the `editorSettings` object in your editor configuration to enable spelling and grammar suggestions and set
   the `langtoolUrl`:

   ```javascript
   const editorSettings = {
     showGrammarSuggestions: true,
     showSpellingSuggestions: true,
     languageCode: 'auto',
     langtoolUrl: 'http://localhost:8010/v2/check', // Replace with your LanguageTool server URL
   };
   ```

3. **Run the LanguageTool server**:

   Once installed, start the LanguageTool server locally to handle spell check requests:

   ```bash
   ltrs docker start
   ```

4. **Connect the Editor to LanguageTool**:

   Ensure that the editor is configured to send spell check and grammar suggestion requests to the LanguageTool server.
   The integration code for LanguageTool uses the server's endpoint (e.g., `http://localhost:8010/v2/check`).

5. **Test the Integration**:

   Type some text in the editor to verify that spelling and grammar suggestions are appearing correctly.

### Folder Structure

Here’s an overview of the project structure:

```plaintext
bookcicle-editor/
├── public/             # Static files
├── src/
│   ├── extensions/     # TipTap extensions
│   ├── helpers/        # Utils and Helper functions
│   ├── components/     # React components
│   ├── db/             # Dexie config for local db.
│   ├── toolbar/        # Toolbar component
│   ├── assets/         # Styles, fonts, images, etc.
│   ├── App.jsx         # Main app file
│   ├── index.jsx       # Entry point
│   └── Editor.jsx      # Editor entry point
├── README.md           # This file
├── package.json        # Project metadata and scripts
└── vite.config.js      # Vite configuration
```

## Using the Bookcicle Editor

### Editor Component Props

The **Bookcicle Editor** exposes several props that allow you to control the editor's behavior and integrate it with
your application logic. Below is a detailed explanation of each prop:

```javascript
/**
 * Editor component for rich text editing.
 *
 * @param {Object} props - The properties for the Editor component.
 * @param {string} props.documentId - The Document/Project Identifier.
 * @param {boolean} props.readOnly - Whether the editor is in read-only mode.
 * @param {string} props.content - The initial content of the editor.
 * @param {Function} props.onTextChange - Callback when the text changes returns text content (string).
 * @param {Function} props.handleInsertImage - Handler when insert Image is clicked.
 * @param {Function} props.handleInsertFormula - Handler when insert Formula is clicked.
 * @param {Function} props.handleInsertLink - Handler when insert Link is clicked.
 * @param {Function} props.onSelectionChange - Callback when the selection changes ({selection, currentParagraph, currentColumn}).
 * @param {Function} props.onTransaction - Callback when a transaction is fired bny TipTap, returns {editor, transaction}
 * @param {Function} props.onJsonChange - Callback with the entire document Delta when content changes returns the tiptap json doc
 * @param {Function} props.onEditorReady - Callback with triggered when the tipTap editor first becomes ready.
 * @param {EditorSettings} [props.editorSettings] - Configuration object for editor settings.
 * @param {Object} [props.tipTapSettings] - Configuration object for TipTap's useEditor settings, or override existing configurations.
 */
```

#### Editor Props Explained

- **`documentId`** (`string`): A unique identifier for the document being edited. This can be used to save and retrieve
  content specific to this document.

    - **Required**: Yes

- **`readOnly`** (`boolean`): Sets the editor to read-only mode when `true`. Users will not be able to edit the content.

    - **Default**: `false`

- **`content`** (`string`): The initial (HTML, JSON) content to load into the editor when it mounts.

    - **Default**: `''` (empty string)

- **`onTextChange`** (`function`): A callback function that is invoked whenever the text content changes. It receives
  the current text content as a parameter.

    - **Parameters**:
        - `text` (`string`): The current text content of the editor.
    - **Usage**: Useful for updating application state or handling auto-save functionality.

- **`onSelectionChange`** (`function`): A callback function that is invoked whenever the text selection changes. It
  receives the selection object as a parameter.

    - **Parameters**:
        - `({editor, selection})`
            - `editor` (`object`): An object representing the current editor state.
            - `selection` (`object`): An object representing the current selection in the editor.
            - **Usage**: Can be used to display selection-based tools or information.

- **`onJsonChange`** (`function`): A callback function that is invoked when the document changes, providing the change
  delta.

    - **Parameters**:
        - `delta` (`object`): An object representing the changes made to the document as a json document.
    - **Usage**: Useful for syncing changes with a backend or implementing collaborative editing features.

- **`onEditorReady`** (`function`): A callback function that is invoked when the document first becomes ready

    - **Parameters**:
        - `{editor}` (`object`): An object representing the current editor state.
    - **Usage**: Useful for syncing changes with a backend or implementing collaborative editing features.

- **`handleInsertImage`** (`function`): A callback function to handle custom image insertion logic when the user
  attempts to insert an image.

    - **Usage**: A custom handler for inserting images via toolbar button press.

- **`handleInsertLink`** (`function`): A callback function to handle custom link insertion logic when the user attempts
  to insert a link.

    - **Usage**: A custom handler for inserting links via toolbar button press.

- **`handleInsertFormula`** (`function`): A callback function to handle custom formula insertion logic when the user
  attempts to insert a formula.

    - **Usage**: A custom handler for inserting formulas via toolbar button press.

- **`editorSettings`** (`EditorSettings`): An object containing configuration options for the editor's behavior and
  appearance.

    - **Default**: `{}` (default settings are applied)
    - **See**: [Editor Settings](#editor-settings) for detailed options.

### Editor Settings

The **Bookcicle Editor** provides an `editorSettings` object that allows you to customize various aspects of the
editor's behavior and appearance. Below is a detailed explanation of each setting:

```javascript
/**
 * @typedef {Object} EditorSettings
 * @property {boolean} openLinks - Allow opening links from the editor on click. Default is `false`.
 * @property {boolean} enableDragHandle - Enable a drag handle for content dragging. Default is `false`.
 * @property {boolean} showLineNumbers - Whether line numbers are displayed. Default is `true`.
 * @property {boolean} showLineHighlight - Enable line highlighting for the current line. Default is `true`.
 * @property {string} buttonSize - The size of buttons in the editor toolbar. Options are `'xs'`, `'small'`, `'medium'`, `'large'`, `'xl'`. Default is `'xl'`.
 * @property {string} linePadding - Padding for lines in the editor. Options are `'xs'`, `'small'`, `'medium'`, `'large'`, `'xl'`. Default is `'small'`.
 * @property {boolean} showVerticalDivider - Show a vertical divider in the editor. Default is `true`.
 * @property {boolean} enablePageEditor - Whether to enable page editor view (centered content with a width constraint). Default is `true`.
 * @property {string} pageEditorWidth - Width of the page editor when `enablePageEditor` is `true`. Default is `'800px'`.
 * @property {number} pageEditorElevation - Elevation level for the Paper component in the page editor, controlling the depth of the shadow. Default is `1`.
 * @property {boolean} pageEditorBoxShadow - Whether to display a box shadow around the page editor. Default is `true`.
 * @property {string} toolbarStyle - Style of the toolbar, used to control the button set shown. Options are `'science'`, `'general'`, `'fiction'`, `'non-fiction'`, `'all'`. Default is `'all'`.
 * @property {string} toolbarPlacement - Placement of the toolbar in the editor. Options are `'top'`, `'bottom'`, `'left'`, `'right'`. Default is `'top'`.
 * @property {boolean} showGrammarSuggestions - Enable grammar suggestions in the editor. Default is `true`.
 * @property {boolean} showSpellingSuggestions - Enable spelling suggestions in the editor. Default is `true`.
 * @property {string} langtoolUrl - The URL for spell/grammar checking, expecting an instance of LanguageTool v2. Default is `'http://localhost:8010/v2/check'`.
 * @property {string} [languageCode="en-US"] - (Optional) Language code used for the editor (e.g., `"en-US"`). Default is `"en-US"`.
 */
```

#### Editor Settings Explained

- **`openLinks`** (`boolean`): Allows users to open hyperlinks directly from the editor by clicking on them.

    - **Default**: `true`

- **`enableDragHandle`** (`boolean`): Enables drag handles on content blocks, allowing users to drag and rearrange
  blocks within the editor.

    - **Default**: `false`

- **`showLineNumbers`** (`boolean`): Displays line numbers next to each line of content in the editor.

    - **Default**: `true`

- **`showLineHighlight`** (`boolean`): Highlights the line where the cursor is currently positioned, helping users keep
  track of their location in the text.

    - **Default**: `true`

- **`buttonSize`** (`string`): Sets the size of the toolbar buttons.

    - **Options**: `'xs'`, `'small'`, `'medium'`, `'large'`, `'xl'`
    - **Default**: `'xl'`

- **`linePadding`** (`string`): Adjusts the padding between lines in the editor.

    - **Options**: `'xs'`, `'small'`, `'medium'`, `'large'`, `'xl'`
    - **Default**: `'small'`

- **`showVerticalDivider`** (`boolean`): Determines whether a vertical divider is displayed between the line numbers and
  the editor content.

    - **Default**: `true`

- **`enablePageEditor`** (`boolean`): Activates the page editor mode, which displays the editor content in a page-like
  format, centered on the screen. This provides a writing experience similar to editing a page in a book or a document.

    - **Default**: `true`

- **`pageEditorWidth`** (`string`): Sets the width of the editor when `enablePageEditor` is `true`. This allows you to
  control how wide the page appears on the screen.

    - **Default**: `'800px'`

- **`pageEditorElevation`** (`number`): Elevation level for the Paper component in the page editor, controlling the
  depth of the shadow.

    - **Default**: `1`

- **`pageEditorBoxShadow`** (`boolean`): Determines whether to display a box shadow around the page editor.

    - **Default**: `true`

- **`toolbarStyle`** (`string`): Determines which toolbar buttons are displayed based on the writing context.

    - **Options**: `'science'`, `'general'`, `'fiction'`, `'non-fiction'`, `'all'`
    - **Default**: `'all'`
    - **Description**: This setting allows you to tailor the editor's toolbar to match the specific needs of your
      writing context, providing a more focused and efficient user experience.

- **`toolbarPlacement`** (`string`): Sets the placement of the toolbar in relation to the editor content.

    - **Options**: `'top'`, `'bottom'`, `'left'`, `'right'`
    - **Default**: `'top'`

- **`languageCode`** (`string`): Sets the language code for the editor, which can be used for localization and
  spell-checking purposes.

    - **Default**: `'auto'`

- **`showGrammarSuggestions`** (`boolean`): Enables or disables grammar suggestions within the editor.

    - **Default**: `true`

- **`showSpellingSuggestions`** (`boolean`): Enables or disables spelling suggestions and corrections within the editor.

    - **Default**: `true`

- **`langtoolUrl`** (`string`): The URL for spell and grammar checking, expecting an instance of LanguageTool v2. This
  property allows you to specify a custom LanguageTool server endpoint for handling spelling and grammar suggestions.

    - **Default**: `'http://localhost:8010/v2/check'`

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
        pageEditorElevation: 2,
        pageEditorBoxShadow: true,
        languageCode: 'auto',
        showGrammarSuggestions: true,
        showSpellingSuggestions: true,
        langtoolUrl: 'http://localhost:8010/v2/check',
        toolbarStyle: 'non-fiction', // Choose 'fiction', 'non-fiction', 'general', 'science', or 'all'
        toolbarPlacement: 'top', // Options: 'top', 'bottom', 'left', 'right'
    };

    return (
        <Editor
            documentId="your-document-id"
            readOnly={false}
            content="<p>Your initial content here...</p>"
            onTextChange={(text) => console.log('Text changed:', text)}
            onSelectionChange={({editor, selection}) => console.log('Selection changed:', selection, editor)}
            onJsonChange={(delta) => console.log('Delta changed:', delta)}
            handleInsertImage={() => {
                // Custom image insertion logic
            }}
            handleInsertLink={() => {
                // Custom link insertion logic
            }}
            handleInsertFormula={() => {
                // Custom formula insertion logic
            }}
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

   ```bash
   npm install @tiptap/extension-your-extension
   ```

2. **Import the extension in your `Editor.jsx` file.**

   ```javascript
   import YourExtension from '@tiptap/extension-your-extension';
   ```

3. **Add the extension to the `extensions` array in the `useEditor` hook.**

   ```javascript
   const editor = useEditor({
     extensions: [
       // Existing extensions
       YourExtension.configure(/* options */),
     ],
     content: defaultValue,
     // other configurations
   });
   ```

### Themes

**Bookcicle Editor** supports theming with **Material UI**. You can easily switch between light and dark themes or
customize the existing theme to match your branding. An MUI `<ThemeProvider><Editor /></ThemeProvider>` should wrap this
component. See `App.jsx` for an example.

```jsx
import {createTheme, ThemeProvider} from '@mui/material/styles';

const theme = createTheme({
    // Customize your theme here
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <Editor {...props} />
        </ThemeProvider>
    );
}
```

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
that consumes this module. For example, you may need to configure `transformIgnorePatterns` in your Jest config:

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
- **LanguageTool** and **languagetool-rust** for spell check and grammar suggestions.

---

Happy coding with **Bookcicle Editor**!