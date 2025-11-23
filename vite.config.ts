import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Dynamic import of ESM-only Tailwind Vite plugin so it loads correctly under CommonJS project settings.
export default defineConfig(async () => {
  const tailwindcss = (await import('@tailwindcss/vite')).default;
  return {
    plugins: [react(), tailwindcss()],
    root: '.',
    publicDir: '.',
    build: {
      outDir: 'dist/renderer',
      emptyOutDir: true
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    }
  };
});
