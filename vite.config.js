import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // Sesuaikan dengan plugin bawaanmu

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,       // 1. Kunci agar selalu berjalan di port 5174
    strictPort: true, // 2. Jika port 5174 sedang dipakai aplikasi lain, jangan ganti port, tapi munculkan error
  }
})