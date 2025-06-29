import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import unocssCSSPlugin from '../dist/index.mjs';

export default defineConfig({
  plugins: [
    vue(),
    unocssCSSPlugin({ build: true }),
  ],
  build: {
    outDir: 'dist-example'
  },
  css: {
    modules: false
  }
}); 