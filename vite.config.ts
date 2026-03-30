import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  // BẮT BUỘC: base phải là './'
  base: './', 
  
  plugins: [react(), tailwindcss()],

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Đảm bảo dọn dẹp thư mục cũ trước khi build mới
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'lucide-vendor': ['lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 2000, 
  },

  server: {
    port: 5173,
    strictPort: true,
  },

  resolve: {
    alias: {
      // Dùng cách này để alias @ hoạt động ổn định nhất
      '@': path.resolve(__dirname, './src'),
    },
  },
})