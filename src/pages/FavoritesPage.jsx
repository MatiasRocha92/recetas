import { useState, useEffect } from 'react'
import { useRecipes } from '../hooks/useRecipes'
import RecipeCard from '../components/RecipeCard'

const FavoritesPage = () => {
	const { recipes, loading, error } = useRecipes()
	const [favorites, setFavorites] = useState([])

	// Cargar favoritos desde localStorage
	useEffect(() => {
		const savedFavorites = localStorage.getItem('favorites')
		if (savedFavorites) {
			setFavorites(JSON.parse(savedFavorites))
		}
	}, [])

	// Filtrar recetas favoritas
	const favoriteRecipes = recipes.filter(recipe => favorites.includes(recipe.id))

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-6xl mx-auto px-8 py-8">
				{/* Header */}
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold text-gray-800 mb-4">
						Mis Favoritos
					</h1>
					<p className="text-gray-600">
						Recetas que has guardado como favoritas
					</p>
				</div>

				{/* Estados de carga y error */}
				{loading && (
					<div className="text-center py-12">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
						<p className="mt-4 text-gray-600">Cargando recetas...</p>
					</div>
				)}

				{error && (
					<div className="text-center py-12">
						<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
							{error}
						</div>
					</div>
				)}

				{/* Contenido */}
				{!loading && !error && (
					<>
						{/* Contador */}
						<div className="mb-6">
							<p className="text-gray-600">
								{favoriteRecipes.length === 0 
									? 'No tienes recetas favoritas aún'
									: favoriteRecipes.length === 1
									? 'Tienes 1 receta favorita'
									: `Tienes ${favoriteRecipes.length} recetas favoritas`
								}
							</p>
						</div>

						{/* Grid de recetas favoritas */}
						{favoriteRecipes.length > 0 ? (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
								{favoriteRecipes.map((recipe) => (
									<RecipeCard key={recipe.id} recipe={recipe} />
								))}
							</div>
						) : (
							<div className="text-center py-12">
								<div className="bg-white rounded-lg shadow-md p-8">
									<div className="text-6xl mb-4">❤️</div>
									<h3 className="text-xl font-semibold text-gray-800 mb-2">
										No tienes favoritos aún
									</h3>
									<p className="text-gray-600 mb-6">
										Explora nuestras recetas y agrega las que más te gusten a tus favoritos.
									</p>
									<a 
										href="/recipes" 
										className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors inline-block"
									>
										Explorar Recetas
									</a>
								</div>
							</div>
						)}
					</>
				)}
			</div>
		</div>
	)
}

export default FavoritesPage 