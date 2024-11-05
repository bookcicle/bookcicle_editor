# Bookcicle Editor

**Bookcicle Editor** is a feature-rich text editor built on **Quill.js** with **React** and **Vite**, leveraging *
*Material UI (MUI)** for styling and theming. It offers a seamless rich-text editing experience with a modern,
customizable interface, allowing users to format text, insert media, and write with style. The editor is designed to be
responsive, flexible, and easy to integrate into various projects.

## Features

- **Rich Text Editing**: Powered by **Quill.js**, the editor supports bold, italic, underline, strikethrough,
  blockquotes, lists, and more.
- **Formula Support**: Add and display mathematical formulas using **KaTeX**.
- **Text Alignment**: Align text to the left, center, right, or justify it.
- **Text Color and Highlighting**: Change text color and highlight content with background colors.
- **Image and Media Embedding**: Embed images and links directly into the editor.
- **Tab (Indentation) Support**: Increase or decrease indentation for lists or paragraphs.
- **Superscript and Subscript**: Support for superscript and subscript text formatting.
- **Theming and Styling**: Fully integrated with **Material UI**, supporting light and dark themes, custom color
  palettes, and responsive design.
- **KaTeX Support**: Render LaTeX-based mathematical expressions with **KaTeX**.

## Installation

You can install **Bookcicle Editor** from npm:

```bash
npm install @bookcicle/bookcicle_editor
```

This will install the editor and all necessary dependencies.

### Local Development Setup

If you are contributing to the project or developing locally, you can set up your environment with the following steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/bookcicle-editor.git
   cd bookcicle-editor
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

4. Link the editor locally for development:
   In the `bookcicle-editor` project directory, run:
   ```bash
   npm link
   ```

5. In the project where you want to use **Bookcicle Editor**, run:
   ```bash
   npm link @bookcicle/bookcicle_editor
   ```

6. Run the development server:
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

The editor is fully customizable and integrates deeply with **Material UI**. You can adjust the themes, colors, and
typography to fit your project's needs.

To modify the theme:

1. Open `src/theme.js` or your theme configuration file.
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
│   └── Editor.jsx     # Editor EntrytPoint
├── README.md          # This file
├── package.json       # Project metadata and scripts
└── vite.config.js     # Vite configuration
```

## Using the Bookcicle Editor

### Toolbar Options

The **Bookcicle Editor** provides a set of toolbar options for formatting content. The toolbar includes:

- **Bold**, **Italic**, **Underline**, **Strikethrough**
- **Text Color** and **Background Color** (highlighting)
- **Lists** (ordered, bullet)
- **Blockquotes**
- **Alignment** (left, center, right, justify)
- **Superscript** and **Subscript**
- **Formula** (powered by **KaTeX**)
- **Image** and **Link** embedding
- **Tab (Indentation)** control

These options are highly customizable. To modify the toolbar or add custom functionality, you can adjust the toolbar
configuration in the `Editor` component.

### Adding New Features

To add new functionality or modify existing behavior, you can update the **Quill.js** configuration in
`src/components/Editor.jsx`. You can easily add custom modules or integrate other third-party libraries to extend the
editor’s capabilities.

### Themes

**Bookcicle Editor** supports theming with **Material UI**. You can easily switch between light and dark themes or
customize the existing theme to match your branding.

An MUI `<ThemeProvider><Editor /></ThemeProvider>` should wrap this component, see App.jsx for an example.

### Formula Support

The editor includes support for LaTeX-style formulas using **KaTeX**. You can insert formulas using the `fx` button in
the toolbar. Ensure you have **KaTeX** installed:

```bash
npm install katex
```

## Contributing

We welcome contributions to the **Bookcicle Editor**! To contribute:

1. Fork the repository.
2. Create a new feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Create a pull request.

## Testing In Upstream

Since we do not build a cjs entry, make sure you add a `transformIgnorePattern`

```json
{ 
  "jest": {
    "transformIgnorePatterns": [
      "<rootDir>/node_modules/(?!@bookcicle/bookcicle_editor.*\\.js$)"
    ]
  }
}
```

You may also need to handle quill inside jest config. 

```json
{
  "moduleNameMapper": {
    "^quill$": "<rootDir>/node_modules/quill/dist/quill.js"
  }
}
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Quill.js** for the powerful text editor engine.
- **Material UI** for the design components and theming.
- **Vite** for the fast build tool.
- **KaTeX** for LaTeX formula rendering.

---

Happy coding with **Bookcicle Editor**!

```