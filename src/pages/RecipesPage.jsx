import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRecipes } from '../hooks/useRecipes'
import RecipeCard from '../components/RecipeCard'
import AddRecipeForm from '../components/AddRecipeForm'
import { useAuth } from '../context/AuthContext'

const RecipesPage = () => {
	const { recipes, loading, error } = useRecipes()
	const { currentUser } = useAuth()
	const [searchTerm, setSearchTerm] = useState('')
	const [difficultyFilter, setDifficultyFilter] = useState('')
	const [showAddRecipeForm, setShowAddRecipeForm] = useState(false)

	// Filtrar recetas con validaciones
	const filteredRecipes = recipes.filter(recipe => {
		// Validar que recipe y sus propiedades existan
		if (!recipe || !recipe.title || !recipe.description) {
			return false
		}

		const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
							recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
		const matchesDifficulty = difficultyFilter === '' || recipe.difficulty === difficultyFilter
		
		return matchesSearch && matchesDifficulty
	})

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-6xl mx-auto px-8 py-8">
				{/* Header */}
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold text-gray-800 mb-4">
						Todas las Recetas
					</h1>
					<p className="text-gray-600 mb-6">
						Explora nuestra colección completa de recetas
					</p>
					
					{/* Botón de agregar receta solo para usuarios autenticados */}
					{currentUser && (
						<motion.button
							whileHover={{ scale: 1.05, y: -3 }}
							whileTap={{ scale: 0.95 }}
							onClick={() => setShowAddRecipeForm(true)}
							className="flex items-center mx-auto px-8 py-4 font-medium text-white transition-all duration-200 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl hover:from-green-600 hover:to-green-700 shadow-xl hover:shadow-2xl"
						>
							<svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
							</svg>
							Agregar Mi Receta
						</motion.button>
					)}
				</div>

				{/* Filtros */}
				<div className="bg-white rounded-lg shadow-md p-6 mb-8">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{/* Búsqueda */}
						<div>
							<label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
								Buscar recetas
							</label>
							<input
								type="text"
								id="search"
								placeholder="Buscar por título o descripción..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
							/>
						</div>

						{/* Filtro de dificultad */}
						<div>
							<label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
								Filtrar por dificultad
							</label>
							<select
								id="difficulty"
								value={difficultyFilter}
								onChange={(e) => setDifficultyFilter(e.target.value)}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
							>
								<option value="">Todas las dificultades</option>
								<option value="Fácil">Fácil</option>
								<option value="Medio">Medio</option>
								<option value="Difícil">Difícil</option>
							</select>
						</div>
					</div>
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

				{/* Resultados */}
				{!loading && !error && (
					<>
						{/* Contador de resultados */}
						<div className="mb-6">
							<p className="text-gray-600">
								{filteredRecipes.length === 1 
									? 'Se encontró 1 receta' 
									: `Se encontraron ${filteredRecipes.length} recetas`
								}
							</p>
						</div>

						{/* Grid de recetas */}
						{filteredRecipes.length > 0 ? (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
								{filteredRecipes.map((recipe) => (
									<RecipeCard key={recipe.id} recipe={recipe} />
								))}
							</div>
						) : (
							<div className="text-center py-12">
								<div className="bg-gray-100 rounded-lg p-8">
									<p className="text-gray-600 text-lg">
										No se encontraron recetas que coincidan con tu búsqueda.
									</p>
									<button 
										onClick={() => {
											setSearchTerm('')
											setDifficultyFilter('')
										}}
										className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
									>
										Limpiar filtros
									</button>
								</div>
							</div>
						)}
					</>
				)}
			</div>
			
			{/* Formulario de agregar receta */}
			<AddRecipeForm 
				isOpen={showAddRecipeForm} 
				onClose={() => setShowAddRecipeForm(false)} 
			/>
		</div>
	)
}

export default RecipesPage 