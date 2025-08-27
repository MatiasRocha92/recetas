/**
 * ⚡ Vite Configuration
 * Copyright (c) 2024 Matias Rocha
 * https://github.com/MatiasRocha92/recetas
 * Licencia MIT - Ver LICENSE para más detalles
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	build: {
		chunkSizeWarningLimit: 1000,
		rollupOptions: {
			output: {
				manualChunks: {
					// Separar librerías grandes en chunks específicos
					vendor: ['react', 'react-dom'],
					animations: ['framer-motion'],
					firebase: ['firebase/app', 'firebase/firestore', 'firebase/auth'],
					router: ['react-router-dom'],
					ui: ['react-hot-toast']
				}
			}
		},
		// Optimizaciones adicionales
		minify: 'terser',
		terserOptions: {
			compress: {
				drop_console: true,
				drop_debugger: true
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
	},
	// Optimizaciones de desarrollo
	optimizeDeps: {
		include: ['react', 'react-dom', 'framer-motion', 'firebase/app', 'firebase/firestore', 'firebase/auth']
	}
})
