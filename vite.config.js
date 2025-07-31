import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://adium-backend.mozartai.com.co',
        changeOrigin: true
        // Removed the rewrite rule to keep /api in the path
      },
      '/ws': {
        target: 'wss://adium-backend.mozartai.com.co',
        ws: true,
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: 'index.html'
      }
    }
  }
}) 