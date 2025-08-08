import React, { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../services/firebase'

const DebugInfo = () => {
	const [showDebug, setShowDebug] = useState(false)
	const [debugInfo, setDebugInfo] = useState({})

	// Mostrar en desarrollo o cuando se presiona Ctrl+Shift+D
	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.ctrlKey && e.shiftKey && e.key === 'D') {
				setShowDebug(prev => !prev)
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [])

	useEffect(() => {
		const checkFirebaseStatus = async () => {
			const info = {
				environment: import.meta.env.MODE,
				baseUrl: import.meta.env.BASE_URL,
				userAgent: navigator.userAgent,
				timestamp: new Date().toISOString(),
				firebaseVars: {
					VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY ? '✅ Configurada' : '❌ Faltante',
					VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? '✅ Configurada' : '❌ Faltante',
					VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID ? '✅ Configurada' : '❌ Faltante',
					VITE_FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ? '✅ Configurada' : '❌ Faltante',
					VITE_FIREBASE_MESSAGING_SENDER_ID: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ? '✅ Configurada' : '❌ Faltante',
					VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID ? '✅ Configurada' : '❌ Faltante'
				},
				firebaseStatus: 'Verificando...',
				recipesCount: 0,
				error: null
			}

			// Verificar Firebase
			if (!db) {
				info.firebaseStatus = '❌ Firebase no inicializado'
				info.error = 'Firebase no está disponible'
			} else {
				info.firebaseStatus = '✅ Firebase inicializado'
				
				// Intentar obtener recetas
				try {
					const recipesRef = collection(db, 'recipes')
					const querySnapshot = await getDocs(recipesRef)
					info.recipesCount = querySnapshot.docs.length
					info.firebaseStatus = `✅ Firebase OK - ${info.recipesCount} recetas encontradas`
				} catch (error) {
					info.firebaseStatus = '❌ Error al conectar con Firestore'
					info.error = error.message
				}
			}

			setDebugInfo(info)
		}

		if (showDebug) {
			checkFirebaseStatus()
		}
	}, [showDebug])

	if (!showDebug) return null

	return (
		<div className="fixed bottom-4 right-4 bg-black bg-opacity-95 text-white p-6 rounded-lg max-w-md z-50 shadow-2xl">
			<div className="flex justify-between items-center mb-4">
				<h3 className="font-bold text-lg">🔧 Debug Info</h3>
				<button 
					onClick={() => setShowDebug(false)}
					className="text-red-400 hover:text-red-200"
				>
					✕
				</button>
			</div>
			
			<div className="text-sm space-y-2">
				<p><strong>Environment:</strong> {debugInfo.environment}</p>
				<p><strong>Base URL:</strong> {debugInfo.baseUrl}</p>
				<p><strong>Timestamp:</strong> {debugInfo.timestamp}</p>
				
				<div className="mt-4">
					<p className="font-bold mb-2">Firebase Variables:</p>
					{debugInfo.firebaseVars && Object.entries(debugInfo.firebaseVars).map(([key, status]) => (
						<p key={key} className="text-xs">
							{key}: {status}
						</p>
					))}
				</div>

				<div className="mt-4">
					<p className="font-bold">Firebase Status:</p>
					<p className="text-xs">{debugInfo.firebaseStatus}</p>
					{debugInfo.recipesCount > 0 && (
						<p className="text-xs text-green-400">
							📊 Recetas en la base de datos: {debugInfo.recipesCount}
						</p>
					)}
					{debugInfo.error && (
						<p className="text-xs text-red-400">
							❌ Error: {debugInfo.error}
						</p>
					)}
				</div>
			</div>

			<div className="mt-4 text-xs text-gray-400">
				Presiona Ctrl+Shift+D para mostrar/ocultar
			</div>
		</div>
	)
}

export default DebugInfo
