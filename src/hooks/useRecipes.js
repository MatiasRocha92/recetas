import { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../services/firebase'

export const useRecipes = () => {
	const [recipes, setRecipes] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		const fetchRecipes = async () => {
			try {
				setLoading(true)
				setError(null)
				
				// Obtener referencia a la colección 'recipes'
				const recipesRef = collection(db, 'recipes')
				
				// Obtener todos los documentos de la colección
				const querySnapshot = await getDocs(recipesRef)
				
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
		}

		fetchRecipes()
	}, [])

	return { recipes, loading, error }
} 