import { useState, useEffect } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../services/firebase'

export const useRecipe = (recipeId) => {
	const [recipe, setRecipe] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		const fetchRecipe = async () => {
			// Si no hay recipeId, no hacer nada
			if (!recipeId) {
				setLoading(false)
				return
			}

			try {
				setLoading(true)
				setError(null)
				
				// Obtener referencia al documento específico
				const recipeRef = doc(db, 'recipes', recipeId)
				
				// Obtener el documento
				const recipeSnapshot = await getDoc(recipeRef)
				
				// Verificar si el documento existe
				if (recipeSnapshot.exists()) {
					setRecipe({
						id: recipeSnapshot.id,
						...recipeSnapshot.data()
					})
				} else {
					setError('Receta no encontrada')
				}
			} catch (err) {
				console.error('Error al obtener la receta:', err)
				setError('Error al cargar la receta')
			} finally {
				setLoading(false)
			}
		}

		fetchRecipe()
	}, [recipeId])

	return { recipe, loading, error }
} 