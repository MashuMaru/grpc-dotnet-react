import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: path.resolve(__dirname, '../GRPCPrototype.Web/wwwroot'),
    emptyOutDir: true, // clears wwwroot before each build
  },
  server: {
    port: 5002,
    proxy: {
      '/api': 'http://localhost:5001',
    }
  }
})
