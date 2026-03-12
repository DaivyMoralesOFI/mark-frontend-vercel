import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

const srcPath = path.resolve(__dirname, './src')

const compatAliases = [
  {
    find: /^@\/modules\/chat-coach-modal/,
    replacement: path.resolve(
      __dirname,
      './src/domains/creation-studio/chat-coach/chat-coach-modal',
    ),
  },
  {
    find: /^@\/modules\/chat-coach/,
    replacement: path.resolve(__dirname, './src/domains/creation-studio/chat-coach'),
  },
  {
    find: /^@\/modules\/brand-dna/,
    replacement: path.resolve(__dirname, './src/domains/creation-studio/brand-dna'),
  },
  {
    find: /^@\/modules\/video-creator/,
    replacement: path.resolve(__dirname, './src/domains/creation-studio/video-creator'),
  },
  {
    find: /^@\/modules\/content-post/,
    replacement: path.resolve(__dirname, './src/domains/dashboard/calendar/content-post'),
  },
  {
    find: /^@\/modules\/campaigns/,
    replacement: path.resolve(
      __dirname,
      './src/domains/dashboard/management/campaigns',
    ),
  },
  {
    find: /^@\/modules\/dashboard/,
    replacement: path.resolve(__dirname, './src/domains/dashboard'),
  },
  {
    find: /^@\/modules\/social-network/,
    replacement: path.resolve(__dirname, './src/domains/social-network'),
  },
  {
    find: /^@\/modules\/auth/,
    replacement: path.resolve(__dirname, './src/domains/auth'),
  },
  {
    find: /^@\/modules\/create-post/,
    replacement: path.resolve(__dirname, './src/modules/creation-studio'),
  },
]

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: true,
    proxy: {
      '/sia-api': {
        target: 'https://sia-backend-sbw7.onrender.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/sia-api/, ''),
      },
    },
  },
  resolve: {
    alias: [...compatAliases, { find: '@', replacement: srcPath }],
  },
})
