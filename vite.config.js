import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' so the built site works from any folder or sub-path on shared hosting
export default defineConfig({
  plugins: [react()],
  base: './',
});
