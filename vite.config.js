import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: './src/index.js',
      name: 'bookcicle_editor',
      fileName: (format) => `bookcicle-editor.${format}.js`,
      formats: ['es'], // Only ES module format
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'quill'], // External dependencies
      output: {
        entryFileNames: 'index.js',
        format: 'es',
        exports: 'named',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          quill: 'Quill',
        },
      },
    },
  },
});
