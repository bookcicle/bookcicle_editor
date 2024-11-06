// App.jsx

import Editor from './Editor';
import {Container, createTheme, CssBaseline, ThemeProvider} from "@mui/material";

const App = () => {

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
                />
            </Container>
        </ThemeProvider>
    </main>);
};

export default App;