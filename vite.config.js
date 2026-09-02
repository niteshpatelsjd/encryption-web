import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    // Only scan the active React app. The `github` folder contains an
    // archived, pre-built application with bundle references that are not
    // npm dependencies.
    entries: ['index.html'],
  },
})
