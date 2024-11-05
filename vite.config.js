import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import {visualizer} from 'rollup-plugin-visualizer';

export default defineConfig({
    plugins: [react(), cssInjectedByJsPlugin()],
    build: {
        lib: {
            entry: './src/index.js',
            name: 'bookcicle_editor',
            fileName: () => `index.js`,
            formats: ['es'], // Add 'umd' if you need UMD format
        },
        rollupOptions: {
            plugins: [visualizer()],
            external: [
                'react',
                'react-dom',
                'quill',
                '@emotion/react',
                '@emotion/styled',
                '@mui/material',
                '@mui/icons-material',
                '@mui/material-pigment-css',
                'styled-components',
                "katex"
            ],
            output: {
                entryFileNames: 'index.js',
                assetFileNames: 'index.[ext]',
                format: 'es',
                exports: 'named',
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                    quill: 'Quill',
                    '@emotion/react': 'emotionReact',
                    '@emotion/styled': 'emotionStyled',
                    '@mui/material': 'MaterialUI',
                    '@mui/icons-material': 'MaterialUIIcons',
                    '@mui/material-pigment-css': 'MaterialUIPigmentCSS',
                    'styled-components': 'styled',
                    'katex': 'katex'
                },
            },
        },
    },
});
