import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0', 
    port: 3000, 
    strictPort: true, 
    allowedHosts: [
      '5206-2401-4900-4ff0-fd79-44e2-aeeb-4281-c86a.ngrok-free.app', 
      'localhost', 
      '127.0.0.1', 
    ]
  }
})


