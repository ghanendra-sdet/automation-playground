import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/automation-playground/',
  server: {
    watch: {
      ignored: [
        '**/playwright-report/**',
        '**/test-results/**',
        '**/tests/**',
        '**/.git/**',
      ],
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        iframe: resolve(__dirname, 'iframe-content.html'),
        newWindow: resolve(__dirname, 'new-window.html'),
      },
    },
  },
});
