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
		toast.error('Esta es una versión de muestra. La funcionalidad de agregar recetas propias no está conectada a la base de datos.', {
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
				<div className="p-8">
					{/* Header moderno */}
					<div className="flex justify-between items-center mb-8">
						<div className="flex items-center space-x-3">
							<motion.div
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
								className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center"
							>
								<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
								</svg>
							</motion.div>
							<div>
								<motion.h2 
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.3 }}
									className="text-2xl font-bold text-gray-800"
								>
									Agregar Receta Propia
								</motion.h2>
								<motion.p 
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.4 }}
									className="text-sm text-gray-500"
								>
									Comparte tu receta favorita con la comunidad
								</motion.p>
							</div>
						</div>
						<motion.button
							whileHover={{ scale: 1.1, rotate: 90 }}
							whileTap={{ scale: 0.9 }}
							onClick={onClose}
							className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
						>
							<svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</motion.button>
					</div>

					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Título */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.5 }}
						>
							<label className="block text-sm font-semibold text-gray-700 mb-3">
								Título de la Receta *
							</label>
							<input
								type="text"
								name="title"
								value={formData.title}
								onChange={handleInputChange}
								required
								className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
								placeholder="Ej: Asado Argentino"
							/>
						</motion.div>

						{/* Descripción */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.6 }}
						>
							<label className="block text-sm font-semibold text-gray-700 mb-3">
								Descripción *
							</label>
							<textarea
								name="description"
								value={formData.description}
								onChange={handleInputChange}
								required
								rows="3"
								className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white resize-none"
								placeholder="Describe brevemente tu receta..."
							/>
						</motion.div>

						{/* Categoría y Dificultad en grid */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.7 }}
							className="grid grid-cols-2 gap-4"
						>
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-3">
									Categoría *
								</label>
								<select
									name="category"
									value={formData.category}
									onChange={handleInputChange}
									required
									className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
								>
									<option value="Típicas Argentinas">Típicas Argentinas</option>
									<option value="Panadería">Panadería</option>
									<option value="Postres">Postres</option>
								</select>
							</div>

							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-3">
									Dificultad *
								</label>
								<select
									name="difficulty"
									value={formData.difficulty}
									onChange={handleInputChange}
									required
									className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
								>
									<option value="Fácil">Fácil</option>
									<option value="Medio">Medio</option>
									<option value="Difícil">Difícil</option>
								</select>
							</div>
						</motion.div>

						{/* Tiempo de cocción y porciones */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.8 }}
							className="grid grid-cols-2 gap-4"
						>
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-3">
									Tiempo de Cocción (minutos) *
								</label>
								<input
									type="number"
									name="cookingTime"
									value={formData.cookingTime}
									onChange={handleInputChange}
									required
									min="1"
									className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
									placeholder="60"
								/>
							</div>
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-3">
									Porciones *
								</label>
								<input
									type="number"
									name="servings"
									value={formData.servings}
									onChange={handleInputChange}
									required
									min="1"
									className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
									placeholder="4"
								/>
							</div>
						</motion.div>

						{/* URL de imagen */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.9 }}
						>
							<label className="block text-sm font-semibold text-gray-700 mb-3">
								URL de la Imagen
							</label>
							<input
								type="url"
								name="imageUrl"
								value={formData.imageUrl}
								onChange={handleInputChange}
								className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
								placeholder="https://ejemplo.com/imagen.jpg"
							/>
						</motion.div>

						{/* Ingredientes */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 1.0 }}
						>
							<label className="block text-sm font-semibold text-gray-700 mb-3">
								Ingredientes *
							</label>
							<div className="space-y-3">
								{formData.ingredients.map((ingredient, index) => (
									<motion.div 
										key={index} 
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: 20 }}
										transition={{ delay: index * 0.1 }}
										className="flex gap-3"
									>
										<input
											type="text"
											value={ingredient}
											onChange={(e) => handleArrayChange(index, 'ingredients', e.target.value)}
											required
											className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
											placeholder={`Ingrediente ${index + 1}`}
										/>
										{formData.ingredients.length > 1 && (
											<motion.button
												whileHover={{ scale: 1.1 }}
												whileTap={{ scale: 0.9 }}
												type="button"
												onClick={() => removeArrayItem('ingredients', index)}
												className="w-10 h-10 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center"
											>
												<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
												</svg>
											</motion.button>
										)}
									</motion.div>
								))}
							</div>
							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								type="button"
								onClick={() => addArrayItem('ingredients')}
								className="mt-3 text-green-600 hover:text-green-700 text-sm font-medium flex items-center space-x-2"
							>
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
								</svg>
								<span>Agregar ingrediente</span>
							</motion.button>
						</motion.div>

						{/* Instrucciones */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 1.1 }}
						>
							<label className="block text-sm font-semibold text-gray-700 mb-3">
								Instrucciones *
							</label>
							<div className="space-y-3">
								{formData.instructions.map((instruction, index) => (
									<motion.div 
										key={index} 
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: 20 }}
										transition={{ delay: index * 0.1 }}
										className="flex gap-3"
									>
										<div className="flex-1">
											<div className="flex items-center space-x-2 mb-2">
												<span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold">
													{index + 1}
												</span>
												<span className="text-sm text-gray-500">Paso {index + 1}</span>
											</div>
											<textarea
												value={instruction}
												onChange={(e) => handleArrayChange(index, 'instructions', e.target.value)}
												required
												rows="2"
												className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white resize-none"
												placeholder={`Describe el paso ${index + 1}...`}
											/>
										</div>
										{formData.instructions.length > 1 && (
											<motion.button
												whileHover={{ scale: 1.1 }}
												whileTap={{ scale: 0.9 }}
												type="button"
												onClick={() => removeArrayItem('instructions', index)}
												className="w-10 h-10 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center self-end"
											>
												<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
												</svg>
											</motion.button>
										)}
									</motion.div>
								))}
							</div>
							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								type="button"
								onClick={() => addArrayItem('instructions')}
								className="mt-3 text-green-600 hover:text-green-700 text-sm font-medium flex items-center space-x-2"
							>
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
								</svg>
								<span>Agregar paso</span>
							</motion.button>
						</motion.div>

						{/* Botones */}
						<motion.div 
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 1.2 }}
							className="flex gap-4 pt-8 border-t border-gray-100"
						>
							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								type="button"
								onClick={onClose}
								className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
							>
								Cancelar
							</motion.button>
							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								type="submit"
								disabled={isSubmitting}
								className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
							>
								{isSubmitting ? (
									<div className="flex items-center justify-center space-x-2">
										<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
										<span>Guardando...</span>
									</div>
								) : (
									<div className="flex items-center justify-center space-x-2">
										<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
										</svg>
										<span>Guardar Receta</span>
									</div>
								)}
							</motion.button>
						</motion.div>
					</form>
				</div>
						</motion.div>
					</div>
				</>
			)}
		</AnimatePresence>
	)
}

export default AddRecipeForm
