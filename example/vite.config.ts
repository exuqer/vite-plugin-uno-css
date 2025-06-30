import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import unocssCSSPlugin from '../dist/index.mjs';

export default defineConfig({
  plugins: [
    unocssCSSPlugin(),
    vue(),
  ],
  build: {
    outDir: 'dist-example'
  },
  css: {
    modules: false
  }
}); 