import { useRecipes } from '../hooks/useRecipes'
import { Link } from 'react-router-dom'
import RecipeCard from '../components/RecipeCard'

const HomePage = () => {
	const { recipes, loading, error } = useRecipes()

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Hero Section */}
			<div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
				<div className="max-w-6xl mx-auto px-8 text-center">
					<h1 className="text-5xl font-bold mb-4">
						¡Descubrí las Mejores Recetas Criollas!
					</h1>
					<p className="text-xl mb-8 opacity-90">
						Explorá nuestra colección de recetas caseras y encontrá tu próxima comida favorita.Lo importante se hace en casa.
					</p>
					<Link 
						to="/recipes" 
						className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
					>
						Ver Todas las Recetas
					</Link>
				</div>
			</div>

			{/* Content Section */}
			<div className="max-w-6xl mx-auto px-8 py-12">
				{loading && (
					<div className="text-center py-12">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
						<p className="mt-4 text-gray-600">Cargando recetas, che...</p>
					</div>
				)}

				{error && (
					<div className="text-center py-12">
						<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
							{error}
						</div>
					</div>
				)}

				{!loading && !error && (
					<>
						<h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
							Recetas Destacadas
						</h2>
						
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
							{recipes.slice(0, 6).map((recipe) => (
								<RecipeCard key={recipe.id} recipe={recipe} />
							))}
						</div>

						{recipes.length > 6 && (
							<div className="text-center mt-8">
								<Link 
									to="/recipes" 
									className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
								>
									Ver Todas las Recetas ({recipes.length})
								</Link>
							</div>
						)}
					</>
				)}
			</div>
		</div>
	)
}

export default HomePage 