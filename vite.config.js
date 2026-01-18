import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost',
    port: 5173,
    strictPort: false, // Allow fallback to another port if 5173 is busy
    hmr: {
      overlay: true, // Show errors as overlay
    },
  },
  build: {
    sourcemap: false, // Disable sourcemaps in production to reduce bundle size
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress warnings from browser extensions and polyfills
        if (warning.code === 'EVAL' || warning.message.includes('polyfill')) return;
        warn(warning);
      },
    },
  },
})
