// App.jsx

import {useRef} from 'react';
import Editor from './Editor';
import Quill from 'quill';
import './App.css';
import {Container, CssBaseline} from "@mui/material";
import BookcicleThemeProvider from "../BookcicleThemeProvider.jsx";

const Delta = Quill.import('delta');

const App = () => {

    const quillRef = useRef(null);

    return (<BookcicleThemeProvider>
        <CssBaseline/>
        <Container maxWidth={false} style={{padding: 0}}>
            <Editor
                ref={quillRef}
                readOnly={false}
                defaultValue={new Delta()
                    .insert('Hello')
                    .insert('\n', {header: 1})
                    .insert('Some ')
                    .insert('initial', {bold: true})
                    .insert(' ')
                    .insert('content', {underline: true})
                    .insert('\n')}
                onSelectionChange={() => {
                }}
                onTextChange={() => {
                }}
            />
        </Container>
    </BookcicleThemeProvider>);
};

export default App;