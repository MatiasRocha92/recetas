import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore'

// Configuración de Firebase - usa las mismas variables de entorno
const firebaseConfig = {
	apiKey: process.env.VITE_FIREBASE_API_KEY,
	authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.VITE_FIREBASE_APP_ID
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Datos de prueba
const recipesData = [
	{
		title: "Pasta Carbonara",
		description: "Clásica pasta italiana con huevo, queso parmesano y panceta",
		ingredients: [
			"400g de pasta spaghetti",
			"200g de panceta o guanciale",
			"4 yemas de huevo",
			"100g de queso parmesano rallado",
			"Pimienta negra molida",
			"Sal"
		],
		instructions: [
			"Cocinar la pasta en agua con sal hasta que esté al dente",
			"Mientras tanto, cortar la panceta en cubos pequeños",
			"Freír la panceta en una sartén hasta que esté crujiente",
			"En un bowl, batir las yemas con el parmesano y pimienta",
			"Escurrir la pasta y mezclar inmediatamente con la panceta",
			"Agregar la mezcla de huevo y parmesano, mezclando rápidamente"
		],
		cookingTime: 20,
		servings: 4,
		difficulty: "Fácil",
		imageUrl: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=500"
	},
	{
		title: "Ensalada César",
		description: "Ensalada fresca con aderezo cremoso y crutones caseros",
		ingredients: [
			"2 lechugas romanas",
			"1 taza de crutones caseros",
			"1/2 taza de queso parmesano rallado",
			"2 anchoas en aceite",
			"1 diente de ajo",
			"1 yema de huevo",
			"2 cucharadas de jugo de limón",
			"1/4 taza de aceite de oliva",
			"Sal y pimienta"
		],
		instructions: [
			"Lavar y cortar la lechuga en trozos",
			"Preparar el aderezo: mezclar ajo, anchoas, yema de huevo y limón",
			"Agregar aceite de oliva gradualmente mientras se bate",
			"Mezclar la lechuga con el aderezo",
			"Agregar crutones y queso parmesano",
			"Servir inmediatamente"
		],
		cookingTime: 15,
		servings: 4,
		difficulty: "Fácil",
		imageUrl: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=500"
	},
	{
		title: "Pollo al Curry",
		description: "Pollo tierno en salsa de curry aromática con especias",
		ingredients: [
			"800g de pechuga de pollo",
			"2 cebollas",
			"3 dientes de ajo",
			"2 cucharadas de pasta de curry",
			"400ml de leche de coco",
			"2 tomates",
			"1 cucharadita de cúrcuma",
			"1 cucharadita de comino",
			"Aceite de oliva",
			"Sal y pimienta"
		],
		instructions: [
			"Cortar el pollo en cubos y sazonar",
			"Picar finamente la cebolla y el ajo",
			"Calentar aceite en una sartén grande",
			"Sofreír la cebolla hasta que esté transparente",
			"Agregar el ajo y las especias, cocinar 1 minuto",
			"Agregar el pollo y dorar por todos los lados",
			"Agregar la pasta de curry y cocinar 2 minutos",
			"Agregar la leche de coco y los tomates",
			"Cocinar a fuego bajo 20-25 minutos hasta que el pollo esté tierno"
		],
		cookingTime: 45,
		servings: 6,
		difficulty: "Medio",
		imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500"
	},
	{
		title: "Tacos de Carne Asada",
		description: "Tacos tradicionales mexicanos con carne asada y guacamole",
		ingredients: [
			"500g de carne de res para asar",
			"12 tortillas de maíz",
			"2 aguacates",
			"1 cebolla",
			"2 tomates",
			"1 limón",
			"Cilantro fresco",
			"Sal y pimienta",
			"Aceite de oliva"
		],
		instructions: [
			"Sazonar la carne con sal y pimienta",
			"Asar la carne en una parrilla o sartén hasta el punto deseado",
			"Dejar reposar la carne 5 minutos y cortar en tiras",
			"Preparar el guacamole: machacar aguacates con limón y sal",
			"Calentar las tortillas",
			"Rellenar las tortillas con carne, guacamole, cebolla y cilantro"
		],
		cookingTime: 30,
		servings: 4,
		difficulty: "Fácil",
		imageUrl: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500"
	},
	{
		title: "Sopa de Tomate",
		description: "Sopa cremosa de tomate con hierbas frescas",
		ingredients: [
			"1kg de tomates maduros",
			"1 cebolla",
			"2 dientes de ajo",
			"2 cucharadas de aceite de oliva",
			"1 taza de caldo de verduras",
			"1/2 taza de crema de leche",
			"Albahaca fresca",
			"Sal y pimienta"
		],
		instructions: [
			"Picar la cebolla y el ajo finamente",
			"Sofreír la cebolla en aceite hasta que esté transparente",
			"Agregar el ajo y cocinar 1 minuto",
			"Agregar los tomates picados y cocinar 10 minutos",
			"Agregar el caldo y cocinar 15 minutos más",
			"Licuar la sopa hasta que esté suave",
			"Agregar la crema y albahaca picada",
			"Sazonar con sal y pimienta"
		],
		cookingTime: 35,
		servings: 4,
		difficulty: "Fácil",
		imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500"
	}
]

// Función para poblar la base de datos
async function seedFirestore() {
	try {
		console.log('🌱 Iniciando población de Firestore...')
		
		const recipesRef = collection(db, 'recipes')
		
		for (const recipe of recipesData) {
			// Agregar timestamps
			const recipeWithTimestamps = {
				...recipe,
				createdAt: serverTimestamp(),
				updatedAt: serverTimestamp()
			}
			
			const docRef = await addDoc(recipesRef, recipeWithTimestamps)
			console.log(`✅ Receta agregada: ${recipe.title} (ID: ${docRef.id})`)
		}
		
		console.log('🎉 ¡Base de datos poblada exitosamente!')
		console.log(`📊 Se agregaron ${recipesData.length} recetas`)
		
	} catch (error) {
		console.error('❌ Error al poblar la base de datos:', error)
	}
}

// Ejecutar el script
seedFirestore() 