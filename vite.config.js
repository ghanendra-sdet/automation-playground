import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/automation-playground/',
  server: {
    // Pinned away from Vite's default 5173 — that port is frequently already
    // claimed by an unrelated project's dev server on this machine, which
    // silently made Playwright test the wrong app entirely (reuseExistingServer
    // sees *something* answering and assumes it's this one).
    port: 5180,
    strictPort: true,
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
