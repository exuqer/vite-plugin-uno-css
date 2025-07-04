import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import unocssCSSPlugin from '../dist/index.mjs';

export default defineConfig({
  plugins: [
    vue(),
    // unocssCSSPlugin не подключается в dev-режиме
  ],
  build: {
    outDir: 'dist'
  },
  css: {
    modules: false
  }
}); 