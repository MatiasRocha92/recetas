import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore'

// Configuración de Firebase
const firebaseConfig = {
	apiKey: "AIzaSyC6nNxwBySd1YiG4QUtU9XACrIMtR8w42M",
    authDomain: "recipe-app-ff529.firebaseapp.com",
    projectId: "recipe-app-ff529",
    storageBucket: "recipe-app-ff529.firebasestorage.app",
    messagingSenderId: "317582960360",
    appId: "1:317582960360:web:fd2d95a79efc7bb8788b5d"
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Solo las recetas más importantes (versión reducida)
const essentialRecipes = [
	{
		title: "Asado Argentino",
		description: "El asado tradicional argentino con carne de res y chorizo",
		ingredients: ["Carne de res", "Chorizo", "Achuras", "Sal", "Carbón"],
		instructions: ["Preparar el fuego", "Salar la carne", "Asar lentamente"],
		cookingTime: 120,
		servings: 6,
		difficulty: "Medio",
		category: "Típicas Argentinas",
		imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&h=400&fit=crop"
	},
	{
		title: "Empanadas de Carne",
		description: "Empanadas tradicionales argentinas rellenas de carne",
		ingredients: ["Harina", "Carne picada", "Cebolla", "Huevos duros"],
		instructions: ["Preparar la masa", "Hacer el relleno", "Armar las empanadas"],
		cookingTime: 90,
		servings: 12,
		difficulty: "Medio",
		category: "Típicas Argentinas",
		imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=400&fit=crop"
	}
]

// Función optimizada para poblar la base de datos
async function seedEssentialRecipes() {
	try {
		console.log('🌱 Iniciando población con recetas esenciales...')
		
		const recipesRef = collection(db, 'recipes')
		
		for (const recipe of essentialRecipes) {
			const recipeWithTimestamps = {
				...recipe,
				createdAt: serverTimestamp(),
				updatedAt: serverTimestamp()
			}
			
			await addDoc(recipesRef, recipeWithTimestamps)
			console.log(`✅ Receta agregada: ${recipe.title}`)
		}
		
		console.log('🎉 ¡Base de datos poblada exitosamente!')
		console.log(`📊 Se agregaron ${essentialRecipes.length} recetas esenciales`)
		
	} catch (error) {
		console.error('❌ Error al poblar la base de datos:', error)
	}
}

// Solo ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
	seedEssentialRecipes()
}

export { seedEssentialRecipes }
