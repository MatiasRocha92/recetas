import { useState } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../services/firebase'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

// Datos de recetas argentinas
const recipesData = [
	// ===== PANADERÍA (20 recetas) =====
	{
		title: "Facturas de Manteca",
		description: "Facturas tradicionales argentinas con manteca y dulce de leche",
		ingredients: [
			"500g de harina 0000",
			"250g de manteca",
			"2 huevos",
			"1/2 taza de leche",
			"1/4 taza de azúcar",
			"1 cucharadita de sal",
			"25g de levadura fresca",
			"Dulce de leche para rellenar"
		],
		instructions: [
			"Disolver la levadura en leche tibia con una cucharada de azúcar",
			"Mezclar harina, azúcar y sal",
			"Agregar los huevos y la leche con levadura",
			"Amasar hasta formar una masa suave",
			"Estirar la masa y agregar manteca en capas",
			"Plegar y estirar 3 veces",
			"Cortar en formas de facturas y rellenar",
			"Hornear a 180°C por 20 minutos"
		],
		cookingTime: 120,
		servings: 12,
		difficulty: "Difícil",
		category: "Panadería",
		imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500"
	},
	{
		title: "Medialunas de Manteca",
		description: "Croissants argentinos con manteca y azúcar espolvoreado",
		ingredients: [
			"500g de harina 0000",
			"300g de manteca",
			"2 huevos",
			"1 taza de leche",
			"1/4 taza de azúcar",
			"1 cucharadita de sal",
			"25g de levadura fresca",
			"Azúcar para espolvorear"
		],
		instructions: [
			"Preparar la masa base con harina, leche, huevos y levadura",
			"Amasar hasta que esté suave y elástica",
			"Estirar la masa y agregar manteca en capas",
			"Plegar y estirar varias veces",
			"Cortar en triángulos y enrollar",
			"Dejar leudar 2 horas",
			"Hornear a 180°C por 15-20 minutos",
			"Espolvorear con azúcar"
		],
		cookingTime: 180,
		servings: 16,
		difficulty: "Difícil",
		category: "Panadería",
		imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500"
	},
	{
		title: "Pan de Campo",
		description: "Pan rústico argentino con corteza crujiente y miga tierna",
		ingredients: [
			"1kg de harina 000",
			"600ml de agua tibia",
			"25g de levadura fresca",
			"2 cucharaditas de sal",
			"1 cucharada de azúcar",
			"2 cucharadas de aceite de oliva"
		],
		instructions: [
			"Disolver la levadura en agua tibia con azúcar",
			"Mezclar harina y sal en un bowl grande",
			"Agregar el agua con levadura y el aceite",
			"Amasar durante 10 minutos hasta que esté suave",
			"Dejar leudar 2 horas en lugar cálido",
			"Formar el pan y hacer cortes en la superficie",
			"Hornear a 200°C por 40-45 minutos"
		],
		cookingTime: 180,
		servings: 8,
		difficulty: "Medio",
		category: "Panadería",
		imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500"
	},
	{
		title: "Tortitas Negras",
		description: "Galletas tradicionales argentinas con miel y especias",
		ingredients: [
			"500g de harina 0000",
			"200g de miel",
			"100g de azúcar negra",
			"2 huevos",
			"1/2 taza de leche",
			"1 cucharadita de canela",
			"1 cucharadita de jengibre",
			"1/2 cucharadita de clavo de olor",
			"1 cucharadita de bicarbonato"
		],
		instructions: [
			"Mezclar harina, especias y bicarbonato",
			"Batir huevos con miel y azúcar",
			"Agregar la leche y mezclar",
			"Combinar con la harina hasta formar masa",
			"Estirar y cortar en círculos",
			"Hornear a 180°C por 12-15 minutos"
		],
		cookingTime: 45,
		servings: 24,
		difficulty: "Fácil",
		category: "Panadería",
		imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500"
	},
	{
		title: "Rosca de Pascua",
		description: "Pan dulce tradicional de Pascua con frutas confitadas",
		ingredients: [
			"500g de harina 0000",
			"100g de azúcar",
			"3 huevos",
			"1/2 taza de leche",
			"100g de manteca",
			"25g de levadura fresca",
			"100g de frutas confitadas",
			"1 cucharadita de esencia de vainilla",
			"1 cucharadita de ralladura de limón"
		],
		instructions: [
			"Disolver levadura en leche tibia",
			"Mezclar harina, azúcar y sal",
			"Agregar huevos, manteca y leche con levadura",
			"Amasar hasta formar masa suave",
			"Agregar frutas confitadas y especias",
			"Dejar leudar 2 horas",
			"Formar rosca y decorar",
			"Hornear a 180°C por 30 minutos"
		],
		cookingTime: 150,
		servings: 10,
		difficulty: "Medio",
		category: "Panadería",
		imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500"
	},
	{
		title: "Pan de Yema",
		description: "Pan tradicional argentino con yemas de huevo",
		ingredients: [
			"500g de harina 0000",
			"6 yemas de huevo",
			"1/2 taza de leche",
			"100g de manteca",
			"1/4 taza de azúcar",
			"1 cucharadita de sal",
			"25g de levadura fresca"
		],
		instructions: [
			"Disolver levadura en leche tibia",
			"Mezclar harina, azúcar y sal",
			"Agregar yemas, manteca y leche con levadura",
			"Amasar hasta formar masa suave",
			"Dejar leudar 1 hora",
			"Formar bollos y decorar",
			"Hornear a 180°C por 20 minutos"
		],
		cookingTime: 90,
		servings: 12,
		difficulty: "Medio",
		category: "Panadería",
		imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500"
	},
	{
		title: "Galletas de Vainilla",
		description: "Galletas caseras argentinas con esencia de vainilla",
		ingredients: [
			"300g de harina 0000",
			"200g de manteca",
			"150g de azúcar",
			"2 huevos",
			"1 cucharadita de esencia de vainilla",
			"1/2 cucharadita de sal",
			"1 cucharadita de polvo para hornear"
		],
		instructions: [
			"Batir manteca con azúcar hasta que esté cremosa",
			"Agregar huevos y vainilla",
			"Mezclar harina, sal y polvo para hornear",
			"Combinar hasta formar masa",
			"Enfriar 30 minutos",
			"Estirar y cortar con cortapastas",
			"Hornear a 180°C por 12 minutos"
		],
		cookingTime: 60,
		servings: 30,
		difficulty: "Fácil",
		category: "Panadería",
		imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500"
	},
	{
		title: "Pan de Miga",
		description: "Pan de molde tradicional argentino",
		ingredients: [
			"500g de harina 0000",
			"300ml de leche",
			"2 huevos",
			"50g de manteca",
			"25g de levadura fresca",
			"1 cucharadita de sal",
			"1 cucharada de azúcar"
		],
		instructions: [
			"Disolver levadura en leche tibia",
			"Mezclar harina, sal y azúcar",
			"Agregar huevos, manteca y leche",
			"Amasar hasta formar masa suave",
			"Dejar leudar 2 horas",
			"Colocar en molde de pan",
			"Hornear a 180°C por 40 minutos"
		],
		cookingTime: 180,
		servings: 12,
		difficulty: "Medio",
		category: "Panadería",
		imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500"
	},
	{
		title: "Bizcochos de Grasa",
		description: "Bizcochos tradicionales argentinos con grasa vacuna",
		ingredients: [
			"500g de harina 0000",
			"200g de grasa vacuna",
			"1 taza de leche",
			"2 huevos",
			"1/4 taza de azúcar",
			"1 cucharadita de sal",
			"25g de levadura fresca"
		],
		instructions: [
			"Disolver levadura en leche tibia",
			"Mezclar harina, azúcar y sal",
			"Agregar huevos, grasa y leche",
			"Amasar hasta formar masa suave",
			"Dejar leudar 1 hora",
			"Formar bizcochos",
			"Hornear a 200°C por 15 minutos"
		],
		cookingTime: 90,
		servings: 20,
		difficulty: "Medio",
		category: "Panadería",
		imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500"
	},
	{
		title: "Pan de Leche",
		description: "Pan dulce argentino con leche y azúcar",
		ingredients: [
			"500g de harina 0000",
			"300ml de leche",
			"100g de azúcar",
			"2 huevos",
			"50g de manteca",
			"25g de levadura fresca",
			"1 cucharadita de sal"
		],
		instructions: [
			"Calentar leche y disolver levadura",
			"Mezclar harina, azúcar y sal",
			"Agregar huevos, manteca y leche",
			"Amasar hasta formar masa suave",
			"Dejar leudar 2 horas",
			"Formar bollos",
			"Hornear a 180°C por 25 minutos"
		],
		cookingTime: 150,
		servings: 10,
		difficulty: "Medio",
		category: "Panadería",
		imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500"
	},
	{
		title: "Galletas de Miel",
		description: "Galletas caseras con miel y especias",
		ingredients: [
			"400g de harina 0000",
			"200g de miel",
			"100g de manteca",
			"2 huevos",
			"1 cucharadita de canela",
			"1/2 cucharadita de jengibre",
			"1 cucharadita de bicarbonato"
		],
		instructions: [
			"Batir manteca con miel",
			"Agregar huevos y mezclar",
			"Combinar harina, especias y bicarbonato",
			"Formar masa y refrigerar",
			"Estirar y cortar",
			"Hornear a 180°C por 15 minutos"
		],
		cookingTime: 75,
		servings: 25,
		difficulty: "Fácil",
		category: "Panadería",
		imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500"
	},
	{
		title: "Pan de Papa",
		description: "Pan suave argentino con puré de papa",
		ingredients: [
			"500g de harina 0000",
			"200g de papa cocida y pisada",
			"300ml de leche",
			"2 huevos",
			"50g de manteca",
			"25g de levadura fresca",
			"1 cucharadita de sal"
		],
		instructions: [
			"Preparar puré de papa",
			"Disolver levadura en leche tibia",
			"Mezclar harina, papa y sal",
			"Agregar huevos, manteca y leche",
			"Amasar hasta formar masa suave",
			"Dejar leudar 2 horas",
			"Hornear a 180°C por 30 minutos"
		],
		cookingTime: 120,
		servings: 8,
		difficulty: "Medio",
		category: "Panadería",
		imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500"
	},
	{
		title: "Bizcochos de Agua",
		description: "Bizcochos ligeros argentinos sin grasa",
		ingredients: [
			"500g de harina 0000",
			"300ml de agua tibia",
			"2 huevos",
			"1/4 taza de aceite",
			"25g de levadura fresca",
			"1 cucharadita de sal"
		],
		instructions: [
			"Disolver levadura en agua tibia",
			"Mezclar harina y sal",
			"Agregar huevos, aceite y agua",
			"Amasar hasta formar masa suave",
			"Dejar leudar 1 hora",
			"Formar bizcochos",
			"Hornear a 200°C por 15 minutos"
		],
		cookingTime: 90,
		servings: 20,
		difficulty: "Fácil",
		category: "Panadería",
		imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500"
	},
	{
		title: "Pan de Maíz",
		description: "Pan tradicional argentino con harina de maíz",
		ingredients: [
			"300g de harina de maíz",
			"200g de harina 0000",
			"400ml de leche",
			"2 huevos",
			"50g de manteca",
			"25g de levadura fresca",
			"1 cucharadita de sal"
		],
		instructions: [
			"Disolver levadura en leche tibia",
			"Mezclar harinas y sal",
			"Agregar huevos, manteca y leche",
			"Amasar hasta formar masa suave",
			"Dejar leudar 2 horas",
			"Formar pan",
			"Hornear a 180°C por 35 minutos"
		],
		cookingTime: 150,
		servings: 8,
		difficulty: "Medio",
		category: "Panadería",
		imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500"
	},
	{
		title: "Galletas de Limón",
		description: "Galletas caseras con ralladura de limón",
		ingredients: [
			"300g de harina 0000",
			"200g de manteca",
			"150g de azúcar",
			"2 huevos",
			"Ralladura de 2 limones",
			"1 cucharadita de esencia de vainilla",
			"1/2 cucharadita de sal"
		],
		instructions: [
			"Batir manteca con azúcar",
			"Agregar huevos, ralladura y vainilla",
			"Mezclar harina y sal",
			"Combinar hasta formar masa",
			"Enfriar 30 minutos",
			"Estirar y cortar",
			"Hornear a 180°C por 12 minutos"
		],
		cookingTime: 60,
		servings: 30,
		difficulty: "Fácil",
		category: "Panadería",
		imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500"
	},
	{
		title: "Pan de Centeno",
		description: "Pan saludable argentino con harina de centeno",
		ingredients: [
			"400g de harina de centeno",
			"100g de harina 0000",
			"400ml de agua tibia",
			"25g de levadura fresca",
			"2 cucharaditas de sal",
			"2 cucharadas de miel"
		],
		instructions: [
			"Disolver levadura en agua tibia",
			"Mezclar harinas, sal y miel",
			"Agregar agua con levadura",
			"Amasar hasta formar masa suave",
			"Dejar leudar 3 horas",
			"Formar pan",
			"Hornear a 200°C por 45 minutos"
		],
		cookingTime: 240,
		servings: 8,
		difficulty: "Medio",
		category: "Panadería",
		imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500"
	},
	{
		title: "Bizcochos de Leche",
		description: "Bizcochos suaves argentinos con leche",
		ingredients: [
			"500g de harina 0000",
			"300ml de leche",
			"2 huevos",
			"100g de manteca",
			"25g de levadura fresca",
			"1 cucharadita de sal",
			"1 cucharada de azúcar"
		],
		instructions: [
			"Calentar leche y disolver levadura",
			"Mezclar harina, sal y azúcar",
			"Agregar huevos, manteca y leche",
			"Amasar hasta formar masa suave",
			"Dejar leudar 1 hora",
			"Formar bizcochos",
			"Hornear a 180°C por 20 minutos"
		],
		cookingTime: 90,
		servings: 15,
		difficulty: "Medio",
		category: "Panadería",
		imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500"
	},
	{
		title: "Pan de Salvado",
		description: "Pan integral argentino con salvado",
		ingredients: [
			"400g de harina 0000",
			"100g de salvado de trigo",
			"400ml de agua tibia",
			"25g de levadura fresca",
			"2 cucharaditas de sal",
			"2 cucharadas de miel"
		],
		instructions: [
			"Disolver levadura en agua tibia",
			"Mezclar harina, salvado, sal y miel",
			"Agregar agua con levadura",
			"Amasar hasta formar masa suave",
			"Dejar leudar 2 horas",
			"Formar pan",
			"Hornear a 200°C por 40 minutos"
		],
		cookingTime: 180,
		servings: 8,
		difficulty: "Medio",
		category: "Panadería",
		imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500"
	},
	{
		title: "Galletas de Chocolate",
		description: "Galletas caseras con chips de chocolate",
		ingredients: [
			"300g de harina 0000",
			"200g de manteca",
			"150g de azúcar",
			"2 huevos",
			"200g de chips de chocolate",
			"1 cucharadita de esencia de vainilla",
			"1/2 cucharadita de sal"
		],
		instructions: [
			"Batir manteca con azúcar",
			"Agregar huevos y vainilla",
			"Mezclar harina y sal",
			"Agregar chips de chocolate",
			"Formar bolitas",
			"Hornear a 180°C por 12 minutos"
		],
		cookingTime: 45,
		servings: 24,
		difficulty: "Fácil",
		category: "Panadería",
		imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500"
	},
	{
		title: "Pan de Avena",
		description: "Pan saludable argentino con avena",
		ingredients: [
			"400g de harina 0000",
			"100g de avena",
			"400ml de leche",
			"2 huevos",
			"50g de manteca",
			"25g de levadura fresca",
			"1 cucharadita de sal"
		],
		instructions: [
			"Disolver levadura en leche tibia",
			"Mezclar harina, avena y sal",
			"Agregar huevos, manteca y leche",
			"Amasar hasta formar masa suave",
			"Dejar leudar 2 horas",
			"Formar pan",
			"Hornear a 180°C por 35 minutos"
		],
		cookingTime: 150,
		servings: 8,
		difficulty: "Medio",
		category: "Panadería",
		imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500"
	}
]

const SeedDatabaseButton = () => {
	const [loading, setLoading] = useState(false)
	const { isAdmin } = useAuth()

	// Solo mostrar el botón si el usuario es administrador
	if (!isAdmin) {
		return null
	}

	const handleSeedDatabase = async () => {
		if (!window.confirm('¿Estás seguro de que quieres poblar la base de datos con recetas argentinas? Esta acción no se puede deshacer.')) {
			return
		}

		setLoading(true)
		
		try {
			console.log('🌱 Iniciando población de Firestore con recetas argentinas...')
			
			const recipesRef = collection(db, 'recipes')
			let addedCount = 0
			
			for (const recipe of recipesData) {
				// Agregar timestamps
				const recipeWithTimestamps = {
					...recipe,
					createdAt: serverTimestamp(),
					updatedAt: serverTimestamp()
				}
				
				const docRef = await addDoc(recipesRef, recipeWithTimestamps)
				console.log(`✅ Receta agregada: ${recipe.title} (ID: ${docRef.id})`)
				addedCount++
				
				// Mostrar progreso
				toast.success(`Receta ${addedCount}/${recipesData.length}: ${recipe.title}`)
			}
			
			console.log('🎉 ¡Base de datos poblada exitosamente!')
			console.log(`📊 Se agregaron ${addedCount} recetas argentinas`)
			
			toast.success(`¡Base de datos poblada exitosamente! Se agregaron ${addedCount} recetas argentinas`)
			
		} catch (error) {
			console.error('❌ Error al poblar la base de datos:', error)
			toast.error('Error al poblar la base de datos: ' + error.message)
		} finally {
			setLoading(false)
		}
	}

	return (
		<motion.button
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.95 }}
			onClick={handleSeedDatabase}
			disabled={loading}
			className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
		>
			{loading ? (
				<div className="flex items-center">
					<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
					Poblando base de datos...
				</div>
			) : (
				'🌱 Poblar Base de Datos'
			)}
		</motion.button>
	)
}

export default SeedDatabaseButton 