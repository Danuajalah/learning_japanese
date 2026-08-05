import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'

const backendPublicDir = resolve(import.meta.dirname, '../backend/public')

export default defineConfig(({ command }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: command === 'build' ? {
    outDir: backendPublicDir,
    emptyOutDir: false,
  } : undefined,
}))
