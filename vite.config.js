import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	build: {
		chunkSizeWarningLimit: 1000, // Aumentar el límite a 1000kb
		rollupOptions: {
			output: {
				manualChunks: {
					// Separar framer-motion en su propio chunk
					vendor: ['react', 'react-dom'],
					animations: ['framer-motion'],
					firebase: ['firebase/app', 'firebase/firestore', 'firebase/auth']
				}
			}
		}
	},
	server: {
		host: true,
		port: 5173,
		strictPort: true,
		hmr: {
			port: 5173,
			protocol: 'ws'
		}
	}
})
