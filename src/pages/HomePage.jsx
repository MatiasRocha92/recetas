import { useRecipes } from '../hooks/useRecipes'
import { Link } from 'react-router-dom'
import RecipeCard from '../components/RecipeCard'

const HomePage = () => {
	const { recipes, loading, error } = useRecipes()

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Hero Section */}
			<div className="py-16 text-white bg-gradient-to-r from-orange-500 to-red-500">
				<div className="max-w-6xl px-8 mx-auto text-center">
					<h1 className="mb-4 text-5xl font-bold">
						¡Descubrí las Mejores Recetas Criollas!
					</h1>
					<p className="mb-8 text-xl opacity-90">
						Explorá nuestra colección de recetas caseras y encontrá tu próxima comida favorita.Lo importante se hace en casa.
					</p>
					<Link 
						to="/recipes" 
						className="inline-block px-8 py-3 font-semibold text-orange-600 transition-colors bg-white rounded-lg hover:bg-gray-100"
					>
						Ver Todas las Recetas
					</Link>
				</div>
			</div>

			{/* Content Section */}
			<div className="max-w-6xl px-8 py-12 mx-auto">
				{loading && (
					<div className="py-12 text-center">
						<div className="w-12 h-12 mx-auto border-b-2 border-orange-500 rounded-full animate-spin"></div>
						<p className="mt-4 text-gray-600">Cargando recetas, che...</p>
					</div>
				)}

				{error && (
					<div className="py-12 text-center">
						<div className="px-4 py-3 text-red-700 bg-red-100 border border-red-400 rounded-lg">
							{error}
						</div>
					</div>
				)}

				{!loading && !error && (
					<>
						<h2 className="mb-8 text-3xl font-bold text-center text-gray-800">
							Recetas Destacadas
						</h2>
						
						<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
							{recipes.slice(0, 6).map((recipe) => (
								<RecipeCard key={recipe.id} recipe={recipe} />
							))}
						</div>

						{recipes.length > 6 && (
							<div className="mt-8 text-center">
								<Link 
									to="/recipes" 
									className="px-6 py-3 font-semibold text-white transition-colors bg-orange-500 rounded-lg hover:bg-orange-600"
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