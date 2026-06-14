import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/icon-192.png', 'icons/icon-512.png'],
      manifest: false, // We use our own manifest.json
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        // Don't cache the huge .glb files in service worker
        globIgnores: ['**/*.glb'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB max per file
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true, // Always expose to network
  },
})