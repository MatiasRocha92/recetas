import { useState, useEffect, useMemo, useCallback } from 'react'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '../services/firebase'

export const useRecipes = () => {
	const [recipes, setRecipes] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	// Memoizar la función de fetch para evitar re-creaciones
	const fetchRecipes = useCallback(async () => {
		try {
			setLoading(true)
			setError(null)
			
			// Obtener referencia a la colección 'recipes' con ordenamiento
			const recipesRef = collection(db, 'recipes')
			const q = query(recipesRef, orderBy('createdAt', 'desc'))
			
			// Obtener todos los documentos de la colección
			const querySnapshot = await getDocs(q)
			
			// Mapear los documentos a un array con id y datos
			const recipesData = querySnapshot.docs.map(doc => ({
				id: doc.id,
				...doc.data()
			}))
			
			setRecipes(recipesData)
		} catch (err) {
			console.error('Error al obtener recetas:', err)
			setError('Error al cargar las recetas')
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		fetchRecipes()
	}, [fetchRecipes])

	// Memoizar las recetas para evitar re-renders innecesarios
	const memoizedRecipes = useMemo(() => recipes, [recipes])

	return { 
		recipes: memoizedRecipes, 
		loading, 
		error,
		refetch: fetchRecipes // Exponer función para re-fetch
	}
} 