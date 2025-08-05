import { useRecipes } from './hooks/useRecipes'

function App() {
	const { recipes, loading, error } = useRecipes()

	return (
		<div className="min-h-screen bg-gray-100 p-8">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
					Mi App de Recetas
				</h1>
				
				{loading && (
					<div className="text-center text-gray-600">
						Cargando recetas...
					</div>
				)}
				
				{error && (
					<div className="text-center text-red-600 bg-red-100 p-4 rounded-lg">
						{error}
					</div>
				)}
				
				{!loading && !error && (
					<div className="text-center text-gray-600">
						{recipes.length === 0 
							? 'No hay recetas disponibles. Configura Firebase para ver las recetas.'
							: `Se encontraron ${recipes.length} recetas`
						}
					</div>
				)}
			</div>
		</div>
	)
}

export default App
