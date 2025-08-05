import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
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
			const userDocRef = doc(db, 'users', currentUser.uid)
			const userDoc = await getDoc(userDocRef)
			
			if (userDoc.exists()) {
				const userData = userDoc.data()
				setFavorites(userData.favorites || [])
			} else {
				// Si el documento no existe, crearlo
				await setDoc(userDocRef, {
					email: currentUser.email,
					displayName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Usuario',
					photoURL: currentUser.photoURL || null,
					favorites: [],
					createdAt: new Date().toISOString()
				})
				setFavorites([])
				console.log('Documento de usuario creado en loadFavorites')
			}
		} catch (error) {
			console.error('Error al cargar favoritos:', error)
			toast.error('Error al cargar favoritos')
		} finally {
			setLoading(false)
		}
	}

	// Función para agregar/quitar favoritos (toggle)
	const toggleFavorite = async (recipeId) => {
		if (!currentUser) {
			toast.error('Debes iniciar sesión para gestionar favoritos')
			return false
		}

		try {
			const userDocRef = doc(db, 'users', currentUser.uid)
			
			if (favorites.includes(recipeId)) {
				// Remover de favoritos
				await updateDoc(userDocRef, {
					favorites: arrayRemove(recipeId)
				})
				
				// Actualizar estado local
				setFavorites(prev => prev.filter(id => id !== recipeId))
				toast.success('Receta removida de favoritos')
			} else {
				// Agregar a favoritos
				await updateDoc(userDocRef, {
					favorites: arrayUnion(recipeId)
				})
				
				// Actualizar estado local
				setFavorites(prev => [...prev, recipeId])
				toast.success('Receta agregada a favoritos')
			}
			
			return true
		} catch (error) {
			console.error('Error al gestionar favoritos:', error)
			toast.error('Error al gestionar favoritos')
			return false
		}
	}

	// Verificar si una receta está en favoritos
	const isFavorite = (recipeId) => {
		return favorites.includes(recipeId)
	}

	return {
		favorites,
		loading,
		toggleFavorite,
		isFavorite,
		loadFavorites
	}
} 