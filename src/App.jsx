// App.jsx

import Editor from './Editor';
import {Container, createTheme, CssBaseline, ThemeProvider} from "@mui/material";

const App = () => {

    const handleInsertLink = async () => {
        // Display your custom link insertion dialog
        const url = prompt('Enter the link URL');
        return url; // Return the URL to be inserted
    };

    const handleInsertImage = async () => {
        // Display your custom image insertion dialog
        const url = prompt('Enter the URL');
        return url; // Return the image URL to be inserted
    };

    const handleInsertFormula = async () => {
        // Display your custom formula insertion dialog
        const formula = prompt('Enter the Formula'); // Replace with your dialog implementation
        return formula; // Return the LaTeX formula to be inserted
    };

    return (<main>
        <ThemeProvider theme={createTheme({palette: {mode: "dark"}})}>
            <CssBaseline/>
            <Container maxWidth={false} style={{padding: 0}}>
                <Editor
                    readOnly={false}
                    defaultValue={`
      <h1>
        This is a unique heading.
      </h1>
      <p>
        This is a unique paragraph. It’s so unique, it even has an ID attached to it.
      </p>
      <p>
        And this one, too. $\\sin(x)$
      </p>
    `}
                    onSelectionChange={() => {
                    }}
                    onTextChange={() => {
                    }}
                    onDeltaChange={() => {
                    }}
                    onDeltaChangeIteration={() => {
                    }}
                    onInsertLink={handleInsertLink}
                    onInsertImage={handleInsertImage}
                    onInsertFormula={handleInsertFormula}
                />
            </Container>
        </ThemeProvider>
    </main>);
};

export default App;