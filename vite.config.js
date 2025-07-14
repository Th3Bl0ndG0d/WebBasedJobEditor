import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,     // Hier stel je de gewenste poort in
    open: true      // (optioneel) opent automatisch de browser
  }
})
