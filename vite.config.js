import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/mystic-cards/',
  plugins: [react()],
  server: { host: '0.0.0.0', port: 5174, watch: { usePolling: true, interval: 1000 } },
  optimizeDeps: { exclude: ['@mediapipe/tasks-vision'] },
})
