import { useState, useEffect } from 'react'
import { collection, doc, setDoc, deleteDoc, getDocs, query, where } from 'firebase/firestore'
import { db } from '../services/firebase'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export const useFavorites = () => {
	const [favorites, setFavorites] = useState([])
	const [loading, setLoading] = useState(true)
	const { currentUser } = useAuth()

	// Cargar favoritos del usuario
	useEffect(() => {
		if (currentUser) {
			loadFavorites()
		} else {
			setFavorites([])
			setLoading(false)
		}
	}, [currentUser])

	const loadFavorites = async () => {
		if (!currentUser) return

		try {
			setLoading(true)
			const favoritesRef = collection(db, 'favorites')
			const q = query(favoritesRef, where('userId', '==', currentUser.uid))
			const querySnapshot = await getDocs(q)
			
			const favoritesData = querySnapshot.docs.map(doc => ({
				id: doc.id,
				...doc.data()
			}))
			
			setFavorites(favoritesData)
		} catch (error) {
			console.error('Error al cargar favoritos:', error)
			toast.error('Error al cargar favoritos')
		} finally {
			setLoading(false)
		}
	}

	// Agregar a favoritos
	const addToFavorites = async (recipe) => {
		if (!currentUser) {
			toast.error('Debes iniciar sesión para agregar favoritos')
			return false
		}

		try {
			const favoriteData = {
				userId: currentUser.uid,
				recipeId: recipe.id,
				recipeTitle: recipe.title,
				recipeImage: recipe.imageUrl,
				addedAt: new Date()
			}

			await setDoc(doc(db, 'favorites', `${currentUser.uid}_${recipe.id}`), favoriteData)
			
			// Actualizar estado local
			setFavorites(prev => [...prev, { id: `${currentUser.uid}_${recipe.id}`, ...favoriteData }])
			
			toast.success('Receta agregada a favoritos')
			return true
		} catch (error) {
			console.error('Error al agregar a favoritos:', error)
			toast.error('Error al agregar a favoritos')
			return false
		}
	}

	// Remover de favoritos
	const removeFromFavorites = async (recipeId) => {
		if (!currentUser) return false

		try {
			await deleteDoc(doc(db, 'favorites', `${currentUser.uid}_${recipeId}`))
			
			// Actualizar estado local
			setFavorites(prev => prev.filter(fav => fav.recipeId !== recipeId))
			
			toast.success('Receta removida de favoritos')
			return true
		} catch (error) {
			console.error('Error al remover de favoritos:', error)
			toast.error('Error al remover de favoritos')
			return false
		}
	}

	// Verificar si una receta está en favoritos
	const isFavorite = (recipeId) => {
		return favorites.some(fav => fav.recipeId === recipeId)
	}

	// Obtener IDs de recetas favoritas
	const getFavoriteRecipeIds = () => {
		return favorites.map(fav => fav.recipeId)
	}

	return {
		favorites,
		loading,
		addToFavorites,
		removeFromFavorites,
		isFavorite,
		getFavoriteRecipeIds,
		loadFavorites
	}
} 