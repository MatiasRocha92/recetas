import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useFavorites } from '../hooks/useFavorites'
import { useAuth } from '../context/AuthContext'

const RecipeCard = ({ recipe }) => {
	const { isFavorite, toggleFavorite } = useFavorites()
	const { currentUser } = useAuth()
	// Validar que recipe exista y tenga las propiedades necesarias
	if (!recipe || !recipe.id || !recipe.title) {
		return null
	}

	return (
		<motion.div
			whileHover={{ scale: 1.03 }}
			transition={{ duration: 0.2 }}
		>
			<Link 
				to={`/recipe/${recipe.id}`}
				className="block bg-white rounded-lg shadow-lg overflow-hidden transition-transform"
			>
				{/* Imagen */}
				<div className="relative h-48 bg-gray-200">
					{recipe.imageUrl && (
						<img 
							src={recipe.imageUrl} 
							alt={recipe.title}
							className="w-full h-48 object-cover"
						/>
					)}
					{/* Badge de dificultad */}
					{recipe.difficulty && (
						<div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded text-sm font-medium">
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
							className="absolute top-2 left-2 bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full shadow-lg transition-all duration-200"
						>
							<svg 
								className={`w-5 h-5 transition-colors duration-200 ${
									isFavorite(recipe.id) 
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
					<h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-2">
						{recipe.title}
					</h3>
					<p className="text-gray-600 text-sm mb-3 line-clamp-2">
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
				</div>
			</Link>
		</motion.div>
	)
}

export default RecipeCard 