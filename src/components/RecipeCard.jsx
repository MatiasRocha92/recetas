import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useFavorites } from '../hooks/useFavorites'
import { useAuth } from '../context/AuthContext'
import { useImageOptimization } from '../hooks/useImageOptimization'

const RecipeCard = memo(({ recipe }) => {
	const { isFavorite, toggleFavorite } = useFavorites()
	const { currentUser } = useAuth()
	const { src: optimizedSrc, loading: imageLoading, error: imageError } = useImageOptimization(recipe.imageUrl)

	// Validar que recipe exista y tenga las propiedades necesarias
	if (!recipe || !recipe.id || !recipe.title) {
		return null
	}

	const isFavorited = isFavorite(recipe.id)

	return (
		<motion.div
			whileHover={{ scale: 1.03 }}
			transition={{ duration: 0.2 }}
		>
			<Link 
				to={`/recipe/${recipe.id}`}
				className="block overflow-hidden transition-transform bg-white rounded-lg shadow-lg"
			>
				{/* Imagen optimizada */}
				<div className="relative h-48 bg-gray-200">
					{optimizedSrc && !imageError ? (
						<img 
							src={optimizedSrc} 
							alt={recipe.title}
							className={`w-full h-48 object-cover transition-opacity duration-300 ${
								imageLoading ? 'opacity-50' : 'opacity-100'
							}`}
							loading="lazy"
						/>
					) : (
						<div className="flex items-center justify-center w-full h-48 bg-gradient-to-br from-gray-300 to-gray-400">
							<span className="text-sm text-gray-500">Sin imagen</span>
						</div>
					)}
					
					{/* Badge de dificultad */}
					{recipe.difficulty && (
						<div className="absolute px-2 py-1 text-sm font-medium text-white bg-orange-500 rounded top-2 right-2">
							{recipe.difficulty}
						</div>
					)}
					
					{/* Botón de favoritos */}
					{currentUser && (
						<motion.button
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
							onClick={(e) => {
								e.stopPropagation()
								e.preventDefault()
								toggleFavorite(recipe.id)
							}}
							className="absolute p-2 transition-all duration-200 bg-white rounded-full shadow-lg top-2 left-2 bg-opacity-90 hover:bg-opacity-100"
						>
							<svg 
								className={`w-5 h-5 transition-colors duration-200 ${
									isFavorited 
										? 'text-red-500 fill-current' 
										: 'text-gray-400 hover:text-red-400'
								}`}
								fill="none" 
								stroke="currentColor" 
								viewBox="0 0 24 24"
							>
								<path 
									strokeLinecap="round" 
									strokeLinejoin="round" 
									strokeWidth={2} 
									d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
								/>
							</svg>
						</motion.button>
					)}
				</div>
				
				{/* Contenido */}
				<div className="p-6">
					<h3 className="mb-2 text-lg font-semibold text-gray-800 line-clamp-2">
						{recipe.title}
					</h3>
					<p className="mb-3 text-sm text-gray-600 line-clamp-2">
						{recipe.description || 'Sin descripción'}
					</p>
					
					{/* Metadatos */}
					<div className="flex items-center justify-between text-sm text-gray-500">
						<span className="flex items-center">
							<span className="mr-1">⏱️</span>
							{recipe.cookingTime || 0} min
						</span>
						<span className="flex items-center">
							<span className="mr-1">👥</span>
							{recipe.servings || 0} porciones
						</span>
					</div>

					{/* Botón de quitar de favoritos para móviles */}
					{currentUser && isFavorited && (
						<div className="mt-4 md:hidden">
							<motion.button
								whileTap={{ scale: 0.95 }}
								onClick={(e) => {
									e.stopPropagation()
									e.preventDefault()
									toggleFavorite(recipe.id)
								}}
								className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-red-600 transition-colors border border-red-200 rounded-lg bg-red-50 hover:bg-red-100"
							>
								<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
								Quitar de favoritos
							</motion.button>
						</div>
					)}
				</div>
			</Link>
		</motion.div>
	)
})

RecipeCard.displayName = 'RecipeCard'

export default RecipeCard 