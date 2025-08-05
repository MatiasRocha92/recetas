import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const RecipeCard = ({ recipe }) => {
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