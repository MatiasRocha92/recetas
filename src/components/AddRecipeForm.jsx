import { useState, lazy, Suspense } from 'react'
import { useAuth } from '../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

const AddRecipeForm = ({ isOpen, onClose }) => {
	const { currentUser } = useAuth()
	const [formData, setFormData] = useState({
		title: '',
		description: '',
		ingredients: [''],
		instructions: [''],
		cookingTime: '',
		servings: '',
		difficulty: 'Fácil',
		category: 'Típicas Argentinas',
		imageUrl: ''
	})
	const [isSubmitting, setIsSubmitting] = useState(false)

	// Si no hay usuario autenticado, no mostrar el formulario
	if (!currentUser) {
		return null
	}

	const handleInputChange = (e) => {
		const { name, value } = e.target
		setFormData(prev => ({
			...prev,
			[name]: value
		}))
	}

	const handleArrayChange = (index, field, value) => {
		setFormData(prev => ({
			...prev,
			[field]: prev[field].map((item, i) => i === index ? value : item)
		}))
	}

	const addArrayItem = (field) => {
		setFormData(prev => ({
			...prev,
			[field]: [...prev[field], '']
		}))
	}

	const removeArrayItem = (field, index) => {
		setFormData(prev => ({
			...prev,
			[field]: prev[field].filter((_, i) => i !== index)
		}))
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		setIsSubmitting(true)

		// Simular carga
		await new Promise(resolve => setTimeout(resolve, 1500))

		// Mostrar mensaje de que es una muestra
		toast.error('Esta es una versión de muestra, che. La funcionalidad de agregar recetas propias no está conectada a la base de datos.', {
			duration: 5000,
			position: 'top-center',
			style: {
				background: '#f56565',
				color: '#fff',
				fontSize: '14px',
				maxWidth: '500px'
			}
		})

		setIsSubmitting(false)
		onClose()
	}

	console.log('AddRecipeForm renderizado, isOpen:', isOpen, 'currentUser:', currentUser)

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Backdrop con efecto de desenfoque */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3 }}
						className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-40"
						onClick={onClose}
					/>
					
					{/* Modal */}
					<div className="fixed inset-0 flex items-center justify-center z-50 p-4">
						<motion.div
							initial={{ opacity: 0, scale: 0.8, y: 20 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.8, y: 20 }}
							transition={{ 
								type: "spring",
								damping: 25,
								stiffness: 300,
								duration: 0.4
							}}
							className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-100"
						>
							{/* Header */}
							<div className="flex items-center justify-between p-6 border-b border-gray-200">
								<h2 className="text-2xl font-bold text-gray-800">
									Agregar Mi Receta
								</h2>
								<motion.button
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
									onClick={onClose}
									className="text-gray-400 hover:text-gray-600 transition-colors"
								>
									<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
									</svg>
								</motion.button>
							</div>

							{/* Formulario */}
							<form onSubmit={handleSubmit} className="p-6 space-y-6">
								{/* Título */}
								<div>
									<label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
										Título de la Receta
									</label>
									<input
										type="text"
										id="title"
										name="title"
										value={formData.title}
										onChange={handleInputChange}
										required
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
										placeholder="Ej: Asado criollo"
									/>
								</div>

								{/* Descripción */}
								<div>
									<label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
										Descripción
									</label>
									<textarea
										id="description"
										name="description"
										value={formData.description}
										onChange={handleInputChange}
										required
										rows={3}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
										placeholder="Contá de qué se trata tu receta..."
									/>
								</div>

								{/* Categoría */}
								<div>
									<label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
										Categoría
									</label>
									<select
										id="category"
										name="category"
										value={formData.category}
										onChange={handleInputChange}
										required
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
									>
										<option value="Típicas Argentinas">Típicas Argentinas</option>
										<option value="Panadería">Panadería</option>
										<option value="Postres">Postres</option>
										<option value="Platos Principales">Platos Principales</option>
										<option value="Entradas">Entradas</option>
										<option value="Bebidas">Bebidas</option>
									</select>
								</div>

								{/* Dificultad */}
								<div>
									<label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
										Dificultad
									</label>
									<select
										id="difficulty"
										name="difficulty"
										value={formData.difficulty}
										onChange={handleInputChange}
										required
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
									>
										<option value="Fácil">Fácil</option>
										<option value="Medio">Medio</option>
										<option value="Difícil">Difícil</option>
									</select>
								</div>

								{/* Tiempo de cocción */}
								<div>
									<label htmlFor="cookingTime" className="block text-sm font-medium text-gray-700 mb-2">
										Tiempo de Cocción (minutos)
									</label>
									<input
										type="number"
										id="cookingTime"
										name="cookingTime"
										value={formData.cookingTime}
										onChange={handleInputChange}
										required
										min="1"
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
										placeholder="30"
									/>
								</div>

								{/* Porciones */}
								<div>
									<label htmlFor="servings" className="block text-sm font-medium text-gray-700 mb-2">
										Porciones
									</label>
									<input
										type="number"
										id="servings"
										name="servings"
										value={formData.servings}
										onChange={handleInputChange}
										required
										min="1"
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
										placeholder="4"
									/>
								</div>

								{/* URL de imagen */}
								<div>
									<label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
										URL de la Imagen
									</label>
									<input
										type="url"
										id="imageUrl"
										name="imageUrl"
										value={formData.imageUrl}
										onChange={handleInputChange}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
										placeholder="https://ejemplo.com/imagen.jpg"
									/>
								</div>

								{/* Ingredientes */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Ingredientes
									</label>
									{formData.ingredients.map((ingredient, index) => (
										<div key={index} className="flex items-center mb-2">
											<input
												type="text"
												value={ingredient}
												onChange={(e) => handleArrayChange(index, 'ingredients', e.target.value)}
												required
												className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
												placeholder={`Ingrediente ${index + 1}`}
											/>
											{formData.ingredients.length > 1 && (
												<motion.button
													whileHover={{ scale: 1.1 }}
													whileTap={{ scale: 0.9 }}
													type="button"
													onClick={() => removeArrayItem('ingredients', index)}
													className="ml-2 p-2 text-red-500 hover:text-red-700"
												>
													<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
													</svg>
												</motion.button>
											)}
										</div>
									))}
									<motion.button
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										type="button"
										onClick={() => addArrayItem('ingredients')}
										className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
									>
										+ Agregar Ingrediente
									</motion.button>
								</div>

								{/* Instrucciones */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Instrucciones
									</label>
									{formData.instructions.map((instruction, index) => (
										<div key={index} className="flex items-start mb-2">
											<span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-2 mt-2">
												{index + 1}
											</span>
											<div className="flex-1">
												<textarea
													value={instruction}
													onChange={(e) => handleArrayChange(index, 'instructions', e.target.value)}
													required
													rows={2}
													className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
													placeholder={`Paso ${index + 1}`}
												/>
											</div>
											{formData.instructions.length > 1 && (
												<motion.button
													whileHover={{ scale: 1.1 }}
													whileTap={{ scale: 0.9 }}
													type="button"
													onClick={() => removeArrayItem('instructions', index)}
													className="ml-2 p-2 text-red-500 hover:text-red-700"
												>
													<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
													</svg>
												</motion.button>
											)}
										</div>
									))}
									<motion.button
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										type="button"
										onClick={() => addArrayItem('instructions')}
										className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
									>
										+ Agregar Paso
									</motion.button>
								</div>

								{/* Botones */}
								<div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
									<motion.button
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										type="button"
										onClick={onClose}
										className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
									>
										Cancelar
									</motion.button>
									<motion.button
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										type="submit"
										disabled={isSubmitting}
										className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
									>
										{isSubmitting ? (
											<div className="flex items-center">
												<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
												Guardando...
											</div>
										) : (
											'Guardar Receta'
										)}
									</motion.button>
								</div>
							</form>
						</motion.div>
					</div>
				</>
			)}
		</AnimatePresence>
	)
}

export default AddRecipeForm
