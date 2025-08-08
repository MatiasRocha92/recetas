import { useParams, Link } from 'react-router-dom'
import { useRecipe } from '../hooks/useRecipe'
import { useFavorites } from '../hooks/useFavorites'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import StepByStep from '../components/StepByStep'
import ShareRecipeModal from '../components/ShareRecipeModal'
import { useState } from 'react'

const RecipeDetailPage = () => {
	const { id } = useParams()
	const { recipe, loading, error } = useRecipe(id)
	const { toggleFavorite, isFavorite } = useFavorites()
	const { currentUser } = useAuth()
	const [showShareModal, setShowShareModal] = useState(false)

	const handleFavoriteToggle = async () => {
		if (!currentUser) {
			// Redirigir a login si no está autenticado
			window.location.href = '/login'
			return
		}

		await toggleFavorite(id)
	}

	const handleShareRecipe = () => {
		setShowShareModal(true)
	}

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
					<p className="mt-4 text-gray-600">Cargando receta, che...</p>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
						{error}
					</div>
					<Link 
						to="/" 
						className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
					>
						Volver al Inicio
					</Link>
				</div>
			</div>
		)
	}

	if (!recipe) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<h2 className="text-2xl font-bold text-gray-800 mb-4">Receta no encontrada</h2>
					<Link 
						to="/" 
						className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
					>
						Volver al Inicio
					</Link>
				</div>
			</div>
		)
	}

	// Validar que los arrays existan antes de usarlos
	const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : []
	const instructions = Array.isArray(recipe.instructions) ? recipe.instructions : []

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-6xl mx-auto px-8 py-8">
				{/* Breadcrumb */}
				<nav className="mb-6">
					<Link to="/" className="text-orange-600 hover:text-orange-700">
						← Volver al Inicio
					</Link>
				</nav>

				{/* Imagen Principal */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="mb-8"
				>
					{recipe.imageUrl && (
						<div className="h-96 md:h-[500px] bg-gray-200 rounded-lg overflow-hidden">
							<img 
								src={recipe.imageUrl} 
								alt={recipe.title}
								className="w-full h-full object-cover"
							/>
						</div>
					)}
				</motion.div>

				{/* Información de la Receta */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
					className="bg-white rounded-lg shadow-lg p-8 mb-8"
				>
					<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
						<div>
							<h1 className="text-4xl font-bold text-gray-800 mb-2">
								{recipe.title}
							</h1>
							<p className="text-gray-600 text-lg">
								{recipe.description}
							</p>
						</div>
						
						{/* Botones de Acción */}
						<div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
							{currentUser && (
								<motion.button
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									onClick={handleFavoriteToggle}
									className="flex items-center justify-center px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
								>
									<svg 
										className={`w-5 h-5 mr-2 ${isFavorite(id) ? 'fill-current' : ''}`}
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
									{isFavorite(id) ? 'Quitar de Favoritos' : 'Agregar a Favoritos'}
								</motion.button>
							)}
							
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={handleShareRecipe}
								className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
							>
								<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
								</svg>
								Compartir Receta
							</motion.button>
						</div>
					</div>

					{/* Metadatos */}
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-t border-gray-200">
						<div className="text-center">
							<div className="text-2xl font-bold text-orange-500">⏱️</div>
							<div className="text-sm text-gray-600">Tiempo</div>
							<div className="font-semibold">{recipe.cookingTime || 0} min</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-orange-500">👥</div>
							<div className="text-sm text-gray-600">Porciones</div>
							<div className="font-semibold">{recipe.servings || 0}</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-orange-500">📊</div>
							<div className="text-sm text-gray-600">Dificultad</div>
							<div className="font-semibold">{recipe.difficulty || 'No especificada'}</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-orange-500">🍽️</div>
							<div className="text-sm text-gray-600">Categoría</div>
							<div className="font-semibold">{recipe.category || 'General'}</div>
						</div>
					</div>
				</motion.div>

				{/* Ingredientes */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.4 }}
					className="bg-white rounded-lg shadow-lg p-8 mb-8"
				>
					<h2 className="text-2xl font-bold text-gray-800 mb-6">
						Ingredientes
					</h2>
					{ingredients.length > 0 ? (
						<ul className="space-y-2">
							{ingredients.map((ingredient, index) => (
								<li key={index} className="flex items-center">
									<span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
									{ingredient}
								</li>
							))}
						</ul>
					) : (
						<p className="text-gray-500 italic">No se especificaron ingredientes para esta receta.</p>
					)}
				</motion.div>

				{/* Instrucciones */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.6 }}
					className="bg-white rounded-lg shadow-lg p-8"
				>
					<h2 className="text-2xl font-bold text-gray-800 mb-6">
						Instrucciones
					</h2>
					{instructions.length > 0 ? (
						<StepByStep instructions={instructions} />
					) : (
						<p className="text-gray-500 italic">No se especificaron instrucciones para esta receta.</p>
					)}
				</motion.div>
			</div>

			{/* Modal de compartir */}
			{showShareModal && (
				<ShareRecipeModal 
					recipe={recipe} 
					isOpen={showShareModal} 
					onClose={() => setShowShareModal(false)} 
				/>
			)}
		</div>
	)
}

export default RecipeDetailPage 