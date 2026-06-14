import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
// import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    // VitePWA({
    //   registerType: 'autoUpdate',
    //   includeAssets: ['favicon.svg', 'icons/icon-192.png', 'icons/icon-512.png'],
    //   manifest: false,
    //   workbox: {
    //     globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
    //     globIgnores: ['**/*.glb'],
    //     maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
    //   },
    // }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
  },
})