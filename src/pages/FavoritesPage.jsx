import { useFavorites } from '../hooks/useFavorites'
import { useRecipes } from '../hooks/useRecipes'
import { useAuth } from '../context/AuthContext'
import RecipeCard from '../components/RecipeCard'
import { motion } from 'framer-motion'
import { useMemo } from 'react'

const FavoritesPage = () => {
	const { favorites, loading: favoritesLoading } = useFavorites()
	const { recipes, loading: recipesLoading } = useRecipes()
	const { currentUser } = useAuth()

	// Filtrar recetas favoritas
	const favoriteRecipes = useMemo(() => {
		if (!favorites || !recipes) return []
		return recipes.filter(recipe => favorites.includes(recipe.id))
	}, [favorites, recipes])

	const loading = favoritesLoading || recipesLoading

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
					<p className="mt-4 text-gray-600">Cargando favoritos, che...</p>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-6xl mx-auto px-8 py-8">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="text-center mb-8"
				>
					<h1 className="text-4xl font-bold text-gray-800 mb-4">
						Mis Favoritos
					</h1>
					<p className="text-gray-600 text-lg">
						¡Hola {currentUser?.email}! Acá están tus recetas favoritas
					</p>
				</motion.div>

				{/* Lista de Favoritos */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.6, delay: 0.2 }}
				>
					{favoriteRecipes.length === 0 ? (
						<div className="text-center py-12">
							<div className="text-6xl mb-4">🤍</div>
							<h2 className="text-2xl font-bold text-gray-800 mb-4">
								Aún no guardaste ninguna receta
							</h2>
							<p className="text-gray-600 mb-6">
								¡Explorá y encontrá tus favoritas! Agregá las recetas que más te gusten a tus favoritos
							</p>
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
								onClick={() => window.location.href = '/recipes'}
							>
								Explorar Recetas
							</motion.button>
						</div>
					) : (
						<div>
							<div className="mb-6">
								<p className="text-gray-600">
									{`${favoriteRecipes.length} receta${favoriteRecipes.length !== 1 ? 's' : ''} favorita${favoriteRecipes.length !== 1 ? 's' : ''}`}
								</p>
							</div>
							
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
								{favoriteRecipes.map((recipe, index) => (
									<motion.div
										key={recipe.id}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.4, delay: index * 0.1 }}
									>
										<RecipeCard recipe={recipe} />
									</motion.div>
								))}
							</div>
						</div>
					)}
				</motion.div>
			</div>
		</div>
	)
}

export default FavoritesPage 