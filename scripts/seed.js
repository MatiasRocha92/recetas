import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { readFileSync } from 'fs'

// Configurar dotenv para leer variables de entorno
config()

// Obtener la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Leer el archivo .env si existe
try {
	const envPath = join(__dirname, '..', '.env')
	const envContent = readFileSync(envPath, 'utf8')
	
	// Parsear las variables de entorno
	const envVars = {}
	envContent.split('\n').forEach(line => {
		const [key, value] = line.split('=')
		if (key && value) {
			envVars[key.trim()] = value.trim()
		}
	})
	
	// Establecer las variables de entorno
	Object.keys(envVars).forEach(key => {
		process.env[key] = envVars[key]
	})
	
	console.log('✅ Variables de entorno cargadas desde .env')
} catch (error) {
	console.log('⚠️  No se encontró archivo .env, usando variables del sistema')
}

// Importar y ejecutar el script de población
import('./seed-firestore.js') 