# Bookcicle Editor

**Bookcicle Editor** is a feature-rich, opinionated text editor built on **TipTap** with **React** and **Vite**,
leveraging **Material UI (MUI)** for styling and theming. It offers a seamless rich-text editing experience with a
modern,
customizable interface, allowing users to format text, insert media, and write with style. The editor is designed to be
responsive and flexible, built to be integrated into desktop application frontends. Bookcicle uses it in its Tauri V2
cross-platform desktop application.

## Features

- **Rich Text Editing**: Powered by **TipTap**, the editor supports bold, italic, underline, strikethrough, blockquotes,
  lists, headings, and more.
- **Spellcheck and Grammar Checking** with **LanguageTool** Support.
- **Local Find And Replace**: Search local document content, navigate occurrences, and replace.
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
- **AI Generation** *(New!)*: Type `/// ai [your prompt]` on a line, press **Enter**, and watch partial text from an AI
  stream in real time. (See [AI Generation with AiEnterExtension](#ai-generation-with-aienterextension) below.)

## Installation

You can install **Bookcicle Editor** from npm:

```bash
npm install @bookcicle/bookcicle_editor
```

> **Note**: **Bookcicle Editor** has several peer dependencies that need to be installed alongside it:

```bash
npm install react react-dom @mui/material @mui/icons-material @emotion/react @emotion/styled @tiptap/react @tiptap/core @tiptap/starter-kit @tiptap/extension-underline @tiptap/extension-image @tiptap/extension-text-align @tiptap/extension-subscript @tiptap/extension-superscript @tiptap/extension-font-family @tiptap/extension-highlight @tiptap/extension-text-style @tiptap/extension-color @tiptap/extension-link @tiptap-pro/extension-mathematics katex
```

### Local Development Setup

If you are contributing to the project or developing locally, you can set up your environment with the following steps:

1. **Clone the repository**:

   Fork it... then:

   ```bash
   git clone https://github.com/your-username/bookcicle-editor.git
   cd bookcicle-editor
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Build the project**:

   ```bash
   npm run build
   ```

4. **In the project where you want to use Bookcicle Editor, run**:

   ```bash
   npm install path/to/bookcicle_editor
   ```

**Import** examples:

```js
import {lazy, Suspense} from "react";

const Editor = lazy(() =>
    import("@bookcicle/bookcicle_editor").then((module) => ({
        default: module.Editor,
    })),
);

// or

import {Editor} from "@bookcicle/bookcicle_editor"

function App() {
    return (
        <Suspense fallback={<div>Loading Editor...</div>}>
            <Editor
                // your props...
            />
        </Suspense>
    );
}
```

5. **Run the development server**:

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

   ```js
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
 * @param {Function} props.onTextChange - Callback when the text changes (returns text content as a string).
 * @param {Function} props.onSelectionChange - Callback when the selection changes
 * @param {Function} props.onJsonChange - Callback with the entire document Delta (JSON) when content changes
 * @param {Function} props.onHtmlChange - Callback with the HTML when content changes
 * @param {Function} props.onTransaction - Callback when a transaction is fired by TipTap,
 * @param {Function} props.onFocus - Callback when the editor gains focus (see "Handling focus events" below).
 * @param {Function} props.onEditorReady - Callback triggered when the TipTap editor first becomes ready.
 * @param {Function} props.handleInsertImage - Handler when insert Image is clicked.
 * @param {Function} props.handleInsertFormula - Handler when insert Formula is clicked.
 * @param {Function} props.handleInsertLink - Handler when insert Link is clicked.
 * @param {Function} props.handleAi - Optional callback for AI generation. (See "AI Generation with AiEnterExtension")
 * @param {EditorSettings} [props.editorSettings] - Configuration object for editor settings.
 * @param {Object} [props.tipTapSettings] - Configuration object for TipTap's useEditor settings,
 */
```

#### Editor Props Explained

- **`documentId`** (`string`): A unique identifier for the document being edited.
- **`readOnly`** (`boolean`): Sets the editor to read-only mode when `true`.
- **`content`** (`string`): The initial (HTML) content to load into the editor.
- **`onTextChange`** (`function`): Called whenever the text content changes. Receives the current text as a parameter.
- **`onSelectionChange`** (`function`): Called whenever the text selection changes.
- **`onJsonChange`** (`function`): Called when the TipTap JSON document representation changes.
- **`onHtmlChange`** (`function`): Called when the raw HTML changes.
- **`onTransaction`** (`function`): Called after every TipTap transaction.
- **`onFocus`** (`function`): Called when the editor receives focus. (See **Handling focus events** below.)
- **`onEditorReady`** (`function`): Called when the editor becomes ready.
- **`handleInsertImage`** (`function`): Custom handler for inserting images.
- **`handleInsertLink`** (`function`): Custom handler for inserting links.
- **`handleInsertFormula`** (`function`): Custom handler for inserting formulas.
- **`editorSettings`** (`EditorSettings`): An object containing UI/UX configurations (see below).
- **`tipTapSettings`** (`Object`): Advanced override or extension of TipTap’s native `useEditor` settings.

### Handling Focus Events

The editor supports an **`onFocus`** callback if you need to respond whenever the user clicks into or tabs into the
editor. For example, you might want to update some global state about which editor is currently active, or dispatch a
Redux action when the editor is focused.

**Example:**

```jsx
import {Editor} from '@bookcicle/bookcicle_editor';

function MyComponent() {
    const handleEditorFocus = () => {
        console.log("The editor has focus!");
        // e.g., dispatch some redux action:
        // dispatch(updateActiveTabProperties({ path: "/my/doc/path", fileType: "document" }));
    };

    return (
        <Editor
            content="<p>Hello World</p>"
            onFocus={handleEditorFocus}
            onTextChange={(text) => console.log("Text changed:", text)}
            // ...other props
        />
    );
}
```

> **Implementation Note**: Internally, we either pass the native HTML focus event or use a TipTap plugin that listens to
> focus. The net effect is that your `onFocus` callback will trigger whenever the editor or its editable area gains
> focus.

### Editor Settings

The **Bookcicle Editor** provides an `editorSettings` object that allows you to customize various aspects of the
editor's behavior and appearance. Below is a detailed explanation of each setting:

```js
/**
 * @typedef {Object} EditorSettings
 * @property {boolean} openLinks - Allow opening links from the editor on click. Default `false`.
 * @property {boolean} enableDragHandle - Enable a drag handle for content dragging. Default `false`.
 * @property {boolean} showLineNumbers - Whether line numbers are displayed. Default `true`.
 * @property {boolean} showLineHighlight - Enable line highlighting for the current line. Default `true`.
 * @property {string} buttonSize - The size of buttons in the editor toolbar. Options: 'xs','small','medium','large','xl'. Default 'xl'.
 * @property {string} linePadding - Padding for lines in the editor. Options: 'xs','small','medium','large','xl'. Default 'small'.
 * @property {boolean} showVerticalDivider - Show a vertical divider in the editor. Default `true`.
 * @property {boolean} enablePageEditor - Whether to enable page editor view (centered content). Default `true`.
 * @property {string} pageEditorWidth - Width of the page editor. Default '800px'.
 * @property {number} pageEditorElevation - MUI Paper elevation in page editor. Default 1.
 * @property {boolean} pageEditorBoxShadow - Show box shadow in page editor. Default `true`.
 * @property {string} toolbarStyle - 'science','general','fiction','non-fiction','all'. Default 'all'.
 * @property {string} toolbarPlacement - 'top','bottom','left','right'. Default 'top'.
 * @property {boolean} showGrammarSuggestions - Enable grammar suggestions. Default `true`.
 * @property {boolean} showSpellingSuggestions - Enable spelling suggestions. Default `true`.
 * @property {string} langtoolUrl - Endpoint for grammar/spell checks. Default 'http://localhost:8010/v2/check'.
 * @property {string} [languageCode="en-US"] - Language code for the editor. Default 'auto'.
 */
```

#### Editor Settings Explained

- **`openLinks`**: Allows clicking hyperlinks to open them.
- **`enableDragHandle`**: Enables a drag-handle for content blocks.
- **`showLineNumbers`**: Displays line numbers along the left side.
- **`showLineHighlight`**: Highlights the current line.
- **`buttonSize`**: Controls the toolbar button size ( `'xs' | 'small' | 'medium' | 'large' | 'xl'`).
- **`linePadding`**: Extra spacing between lines ( `'xs' | 'small' | 'medium' | 'large' | 'xl'`).
- **`showVerticalDivider`**: Shows a vertical line between line numbers and text.
- **`enablePageEditor`**: Displays a page-like layout (centered, with a set width).
- **`pageEditorWidth`**: Specifies width if page editor is enabled.
- **`pageEditorElevation`**: MUI Paper elevation for the page editor.
- **`pageEditorBoxShadow`**: Toggle box shadow for page editor.
- **`toolbarStyle`**: Adjusts which toolbar buttons are shown.
- **`toolbarPlacement`**: Positions the toolbar relative to the editor.
- **`showGrammarSuggestions`** and **`showSpellingSuggestions`**: Enable grammar/spelling highlights and suggestions.
- **`langtoolUrl`**: URL for a LanguageTool server (default `'http://localhost:8010/v2/check'`).
- **`languageCode`**: For the editor's internal language. Defaults to `'auto'`.

#### Example Usage

```jsx
import {Editor} from '@bookcicle/bookcicle_editor';

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
        toolbarStyle: 'non-fiction',
        toolbarPlacement: 'top',
    };

    const handleFocus = () => {
        console.log("Editor focused!");
    };

    return (
        <Editor
            documentId="your-document-id"
            readOnly={false}
            content="<p>Your initial content here...</p>"
            onFocus={handleFocus}
            onTextChange={(text) => console.log('Text changed:', text)}
            onSelectionChange={({editor, selection}) => console.log('Selection changed:', selection, editor)}
            onJsonChange={(delta) => console.log('Delta changed:', delta)}
            onHtmlChange={(html) => console.log('HTML changed:', html)}
            handleInsertImage={() => {/* custom image insertion logic */
            }}
            handleInsertLink={() => {/* custom link insertion logic */
            }}
            handleInsertFormula={() => {/* custom formula insertion logic */
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

- **`fiction`**: Basic text tools (headings, alignment, etc.). Minimal insertions.
- **`non-fiction`**: More extensive than `fiction`; includes lists, links, color, etc.
- **`general`**: Balanced set (similar to `non-fiction`).
- **`science`**: Same as `general`, plus formula insertion for math/science.
- **`all`**: Everything enabled.

To customize, adjust the **TipTap** extensions or the built-in config.

### Themes

**Bookcicle Editor** supports theming with **Material UI**. You can easily switch between light and dark themes or
customize the existing theme to match your branding. An MUI `<ThemeProvider><Editor /></ThemeProvider>` should wrap this
component. Example:

```jsx
import React from "react";
import {Editor} from "@bookcicle/bookcicle_editor";

function MyComponent() {

    /**
     * Mocks an AI streaming function with a "typing" effect.
     *
     * Yields partial text in increments (characters, in this example).
     *
     * @param {string} prompt The user's prompt.
     * @returns {AsyncGenerator<string>} An async generator that yields *incremental* text.
     */
    async function handleAi(prompt, abortSignal) {
        async function* generator() {
            const fullResponse =
                `Sure, let's continue from your prompt: "${prompt}"\n` +
                "This is a typing effect demo, so each character arrives individually.\n" +
                "It might take a while if the text is long, but you see partial updates.\n";

            let partial = "";
            // Break into characters
            const chars = fullResponse.split("");

            for (const ch of chars) {
                partial += ch;

                if (abortSignal && abortSignal.aborted) {
                    throw new Error('User canceled streaming')
                }
                yield partial;
                // Add a short delay to simulate typing
                await new Promise((resolve) => setTimeout(resolve, 100));
            }
        }

        // Return the async generator
        return generator();
    }

    return (
        <ThemeProvider theme={theme}>
            <Editor
                documentId="doc-123"
                content="<p>Try typing: <code>/// ai Hello World</code> and press enter.</p>"
                handleAi={handleAi}  // <<--- wire up your AI callback
                // ...other props
            />
        </ThemeProvider>
    );
}

export default MyComponent;
```

### Canceling or Aborting

A simple approach is to ignore user input and let the AI finish. For a more advanced approach—where the user can press a
key to cancel, or click a “Stop” button—you can:

- Track a **cancel** flag or use an **AbortController** inside `handleAi`.
- In your extension or code, set that flag/abort if the user hits a key.
- Check that flag each time you yield a chunk, and `throw new Error("User canceled")` if set.

### Example Flow

1. The user types `/// ai Write a short poem about the moon.` on a line.
2. Presses **Enter**.
3. Editor replaces that line with a “Generating...” placeholder.
4. Calls `handleAi("Write a short poem about the moon.")`.
    - If it’s a simple function returning a string, the final text is inserted all at once.
    - If it’s an async generator yielding partial text, the extension inserts each chunk in real time.
5. When done, the placeholder is removed, and the final text remains in the document. If an error occurs, an error
   message is shown.

---

### Formula Support

The editor includes support for LaTeX-style formulas using **KaTeX**. You can insert formulas using the appropriate
button in the toolbar. Ensure you have **KaTeX** installed:

```bash
npm install katex
```

## Contributing

We welcome contributions to the **Bookcicle Editor**! To contribute:

1. **Fork the repository.**
2. **Create a new feature branch** (`git checkout -b feature/your-feature`).
3. **Commit your changes** (`git commit -m 'Add your feature'`).
4. **Push to the branch** (`git push origin feature/your-feature`).
5. **Create a pull request**.

## Testing in Upstream Projects

Because **Bookcicle Editor** ships as an ES module, you may need to adjust your testing config (e.g., Jest) so it can
properly process the module. For example, in your `jest.config.js` (or `package.json` Jest config):

```json
{
  "jest": {
    "transformIgnorePatterns": [
      "<rootDir>/node_modules/(?!@bookcicle/bookcicle_editor.*\\.js$)"
    ]
  }
}
```

You may also need to handle TipTap’s dependencies similarly in your `transformIgnorePatterns`.

### Mocking Bookcicle Editor

In many test suites, especially unit tests, you might not want the **full** TipTap environment. A simple approach is to
mock out **Bookcicle Editor**. For example, create `__mocks__/@bookcicle/bookcicle_editor.js`:

```js
// __mocks__/@bookcicle/bookcicle_editor.js

import React, {useEffect, useRef} from "react";

// A minimal mock of the Editor component from @bookcicle/bookcicle_editor
export function Editor({
                           content = "",
                           readOnly,
                           onSelectionChange,
                           onTextChange,
                           onJsonChange,
                           onHtmlChange,
                           onTransaction,
                           handleInsertLink,
                           handleInsertImage,
                           handleInsertFormula,
                           documentId,
                           hOffset,
                           editorSettings,
                       }) {
    // Mock an editorRef with getHTML() and commands.setContent
    const editorRef = useRef({
        getHTML: () => content,
        commands: {
            setContent: (newContent, _, __) => {
                // In a real mock, you might store or check newContent if needed
            },
        },
    });

    // Simulate the editor being “ready” by calling onTransaction with the mocked editorRef
    useEffect(() => {
        if (onTransaction) {
            onTransaction({editor: editorRef.current});
        }
    }, [onTransaction]);

    // Fire text/html callbacks whenever `content` changes
    useEffect(() => {
        if (onTextChange) {
            onTextChange(content);
        }
        if (onHtmlChange) {
            onHtmlChange(content);
        }
    }, [content, onTextChange, onHtmlChange]);

    return (
        <div data-testid="mock-bookcicle-editor">
            <p>
                <strong>Mock Bookcicle Editor</strong>
                (documentId: {documentId})
            </p>
            <div>Mock content: {content}</div>
        </div>
    );
}
```

This mock allows you to test your components that consume `<Editor />` without needing the full TipTap pipeline.

---

**Happy coding with Bookcicle Editor!**  
Feel free to open an issue or pull request with questions, suggestions, or improvements.  