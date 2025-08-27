/**
 * 🔥 Firebase Configuration Service
 * Copyright (c) 2024 Matias Rocha
 * https://github.com/MatiasRocha92/recetas
 * Licencia MIT - Ver LICENSE para más detalles
 */

import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'

// Configuración de Firebase usando variables de entorno
const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_FIREBASE_APP_ID
}

// Verificar que todas las variables de entorno estén definidas
const requiredEnvVars = [
	'VITE_FIREBASE_API_KEY',
	'VITE_FIREBASE_AUTH_DOMAIN',
	'VITE_FIREBASE_PROJECT_ID',
	'VITE_FIREBASE_STORAGE_BUCKET',
	'VITE_FIREBASE_MESSAGING_SENDER_ID',
	'VITE_FIREBASE_APP_ID'
]

const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName])

if (missingVars.length > 0) {
	console.error('❌ Variables de entorno de Firebase faltantes:', missingVars)
	console.error('🔧 Asegúrate de configurar las siguientes variables en Vercel:')
	missingVars.forEach(varName => {
		console.error(`   - ${varName}`)
	})
}

// Inicializar Firebase solo si todas las variables están presentes
let app, db, auth, appCheck

try {
	if (missingVars.length === 0) {
		app = initializeApp(firebaseConfig)
		db = getFirestore(app)
		auth = getAuth(app)
		
		// Inicializar App Check solo en producción
		if (import.meta.env.PROD) {
			appCheck = initializeAppCheck(app, {
				provider: new ReCaptchaV3Provider(import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6Lc...'),
				isTokenAutoRefreshEnabled: true
			})
		}
		
		console.log('✅ Firebase inicializado correctamente')
	} else {
		console.error('❌ Firebase no se pudo inicializar debido a variables faltantes')
		// Crear objetos mock para evitar errores
		db = null
		auth = null
		appCheck = null
	}
} catch (error) {
	console.error('❌ Error al inicializar Firebase:', error)
	db = null
	auth = null
	appCheck = null
}

export { db, auth, appCheck }
export default app 