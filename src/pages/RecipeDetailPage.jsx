import { useParams, Link } from 'react-router-dom'
import { useRecipe } from '../hooks/useRecipe'
import { motion } from 'framer-motion'
import StepByStep from '../components/StepByStep'

const RecipeDetailPage = () => {
	const { id } = useParams()
	const { recipe, loading, error } = useRecipe(id)

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
					<p className="mt-4 text-gray-600">Cargando receta...</p>
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

				{/* Título */}
				<motion.h1 
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.6, delay: 0.2 }}
					className="text-4xl font-bold text-center my-4 text-gray-800"
				>
					{recipe.title}
				</motion.h1>

				{/* Descripción */}
				<motion.p 
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.6, delay: 0.3 }}
					className="text-gray-600 text-lg text-center mb-8 max-w-3xl mx-auto"
				>
					{recipe.description}
				</motion.p>

				{/* Información General */}
				<motion.div 
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.4 }}
					className="bg-white rounded-lg shadow-lg p-6 mb-8"
				>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
						<div className="flex flex-col items-center">
							<span className="text-3xl mb-2">⏱️</span>
							<span className="text-sm text-gray-500">Tiempo</span>
							<span className="font-semibold text-gray-800">{recipe.cookingTime} min</span>
						</div>
						<div className="flex flex-col items-center">
							<span className="text-3xl mb-2">👥</span>
							<span className="text-sm text-gray-500">Porciones</span>
							<span className="font-semibold text-gray-800">{recipe.servings}</span>
						</div>
						<div className="flex flex-col items-center">
							<span className="text-3xl mb-2">📊</span>
							<span className="text-sm text-gray-500">Dificultad</span>
							<span className="font-semibold text-gray-800">{recipe.difficulty}</span>
						</div>
						<div className="flex flex-col items-center">
							<span className="text-3xl mb-2">🍽️</span>
							<span className="text-sm text-gray-500">Categoría</span>
							<span className="font-semibold text-gray-800">Principal</span>
						</div>
					</div>
				</motion.div>

				{/* Contenido Principal */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{/* Ingredientes */}
					<motion.div 
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6, delay: 0.5 }}
						className="bg-white rounded-lg shadow-lg p-6"
					>
						<h2 className="text-2xl font-bold text-gray-800 mb-6">Ingredientes</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{recipe.ingredients.map((ingredient, index) => (
								<div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
									<span className="w-2 h-2 bg-orange-500 rounded-full mr-3 flex-shrink-0"></span>
									<span className="text-gray-700">{ingredient}</span>
								</div>
							))}
						</div>
					</motion.div>

					{/* Instrucciones Paso a Paso */}
					<motion.div 
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6, delay: 0.6 }}
						className="bg-white rounded-lg shadow-lg p-6"
					>
						<StepByStep steps={recipe.instructions} />
					</motion.div>
				</div>

				{/* Botones de Acción */}
				<motion.div 
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.7 }}
					className="mt-8 text-center"
				>
					<button className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors mr-4">
						❤️ Agregar a Favoritos
					</button>
					<button className="bg-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors">
						📱 Compartir Receta
					</button>
				</motion.div>
			</div>
		</div>
	)
}

export default RecipeDetailPage 