import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    allowedHosts: ['3000-iwzypr4ci2436olg230v9-2fa26a4c.sg2.manus.computer'],
  },
})
