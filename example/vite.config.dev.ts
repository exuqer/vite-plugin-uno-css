import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import unocssCSSPlugin from '../dist/index.mjs';

export default defineConfig({
  plugins: [
    vue(),
    // Плагин с включенной опцией dev - CSS файлы будут обработаны и заменены на UnoCSS классы
    unocssCSSPlugin({ dev: true }),
  ],
  build: {
    outDir: 'dist-example'
  },
  css: {
    modules: false
  }
}); 