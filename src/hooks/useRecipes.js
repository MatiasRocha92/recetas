import { useState, useEffect, useMemo, useCallback } from 'react'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
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
			
			console.log('🔄 Iniciando carga de recetas...')
			
			// Verificar si Firebase está inicializado
			if (!db) {
				const errorMsg = '❌ Firebase no está inicializado - Verifica las variables de entorno'
				console.error(errorMsg)
				setError(errorMsg)
				setLoading(false)
				return
			}
			
			console.log('✅ Firebase está inicializado, conectando a Firestore...')
			
			// Obtener referencia a la colección 'recipes' con ordenamiento
			const recipesRef = collection(db, 'recipes')
			
			// Intentar ordenar por createdAt, si no existe usar orden por defecto
			let q
			try {
				q = query(recipesRef, orderBy('createdAt', 'desc'))
				console.log('📊 Aplicando ordenamiento por createdAt...')
			} catch (orderError) {
				console.warn('⚠️ No se pudo ordenar por createdAt, usando orden por defecto:', orderError)
				q = query(recipesRef)
			}
			
			// Obtener todos los documentos de la colección
			console.log('🔍 Consultando Firestore...')
			const querySnapshot = await getDocs(q)
			
			// Mapear los documentos a un array con id y datos
			const recipesData = querySnapshot.docs.map(doc => ({
				id: doc.id,
				...doc.data()
			}))
			
			console.log(`✅ Se cargaron ${recipesData.length} recetas exitosamente`)
			
			// Log de las primeras recetas para debug
			if (recipesData.length > 0) {
				console.log('📋 Primeras recetas:', recipesData.slice(0, 2).map(r => ({ id: r.id, title: r.title })))
			} else {
				console.warn('⚠️ No se encontraron recetas en la base de datos')
			}
			
			setRecipes(recipesData)
		} catch (err) {
			const errorMsg = `❌ Error al obtener recetas: ${err.message}`
			console.error(errorMsg, err)
			setError(errorMsg)
			
			// Información adicional para debug
			if (err.code) {
				console.error('🔍 Código de error:', err.code)
			}
			if (err.details) {
				console.error('🔍 Detalles:', err.details)
			}
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