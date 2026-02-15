import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // Add this
  build: {
    outDir: 'dist',
    // Add this for client-side routing support
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
})