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
                    handleAi={handleAi}
                    handleInsertLink={handleInsertLink}
                    handleInsertImage={handleInsertImage}
                    handleInsertFormula={handleInsertFormula}
                />
            </Container>
        </ThemeProvider>
    </main>);
};

export default App;