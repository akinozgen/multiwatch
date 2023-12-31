import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path';

// copy __redirects file to dist folder

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  // config of react-bootstrap
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
      '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
    }
  }
})
