import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: './src/index.js',  // Point to the file where all components are exported
      name: 'BookcicleEditor',
      fileName: (format) => `bookcicle-editor.${format}.js`,
      formats: ['es', 'cjs'], // Export as ES module and CommonJS
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'quill'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          quill: 'Quill',
        },
      },
    },
  },
});
