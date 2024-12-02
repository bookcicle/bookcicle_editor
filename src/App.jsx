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
        return prompt('Enter the URL'); // Return the image URL to be inserted
    };

    const handleInsertFormula = async () => {
        return prompt('Enter the Formula'); // Return the LaTeX formula to be inserted
    };

    return (<main>
        <ThemeProvider theme={createTheme({palette: {mode: "dark"}})}>
            <CssBaseline/>
            <Container maxWidth={false} style={{padding: 0}}
                       sx={{display: "flex", flexDirection: "column", justifyContent: "center", width: "100%"}}
            >
                <Editor
                    documentId={"document_id"}
                    readOnly={false}
                    content={`<h1>This is a unique heading.</h1><p>This is a unique paragraph. It’s so unique, it even has an ID attached to it.</p><p>And this one, too. $\\sin(x)$</p>`}
                    handleInsertLink={handleInsertLink}
                    handleInsertImage={handleInsertImage}
                    handleInsertFormula={handleInsertFormula}
                />
            </Container>
        </ThemeProvider>
    </main>);
};

export default App;