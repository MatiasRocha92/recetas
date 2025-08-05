import { useState, useEffect } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../services/firebase'
import { useFavorites } from './useFavorites'

export const useFavoriteRecipes = () => {
	const [favoriteRecipes, setFavoriteRecipes] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const { favorites, loading: favoritesLoading } = useFavorites()

	useEffect(() => {
		const fetchFavoriteRecipes = async () => {
			// Si aún se están cargando los favoritos, esperar
			if (favoritesLoading) return
			
			// Si no hay favoritos, establecer array vacío
			if (!favorites || favorites.length === 0) {
				setFavoriteRecipes([])
				setLoading(false)
				return
			}

			try {
				setLoading(true)
				setError(null)
				
				// Crear consulta para obtener solo las recetas que están en favoritos
				const recipesRef = collection(db, 'recipes')
				const q = query(
					recipesRef,
					where('__name__', 'in', favorites)
				)
				
				const querySnapshot = await getDocs(q)
				
				// Mapear los documentos a un array con id y datos
				const recipesData = querySnapshot.docs.map(doc => ({
					id: doc.id,
					...doc.data()
				}))
				
				setFavoriteRecipes(recipesData)
			} catch (err) {
				console.error('Error al obtener recetas favoritas:', err)
				setError('Error al cargar las recetas favoritas')
			} finally {
				setLoading(false)
			}
		}

		fetchFavoriteRecipes()
	}, [favorites, favoritesLoading])

	return { 
		favoriteRecipes, 
		loading: loading || favoritesLoading, 
		error,
		favoritesCount: favorites?.length || 0
	}
} 