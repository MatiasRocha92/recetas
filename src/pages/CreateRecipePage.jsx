import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { doc, addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../services/firebase'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/LoadingSpinner'

const CreateRecipePage = () => {
	const navigate = useNavigate()
	const { currentUser } = useAuth()
	const [loading, setLoading] = useState(false)
	const [imageFile, setImageFile] = useState(null)
	const [imagePreview, setImagePreview] = useState(null)
	const fileInputRef = useRef(null)

	const [formData, setFormData] = useState({
		title: '',
		description: '',
		category: 'Comidas Típicas',
		ingredients: [''],
		steps: [''],
		cookingTime: '',
		servings: '',
		difficulty: 'Fácil'
	})

	// Redirigir si no está autenticado
	if (!currentUser) {
		navigate('/login')
		return null
	}

	const handleInputChange = (e) => {
		const { name, value } = e.target
		setFormData(prev => ({
			...prev,
			[name]: value
		}))
	}

	const handleImageChange = (e) => {
		const file = e.target.files[0]
		if (file) {
			setImageFile(file)
			const reader = new FileReader()
			reader.onload = (e) => setImagePreview(e.target.result)
			reader.readAsDataURL(file)
		}
	}

	const addIngredient = () => {
		setFormData(prev => ({
			...prev,
			ingredients: [...prev.ingredients, '']
		}))
	}

	const removeIngredient = (index) => {
		setFormData(prev => ({
			...prev,
			ingredients: prev.ingredients.filter((_, i) => i !== index)
		}))
	}

	const updateIngredient = (index, value) => {
		setFormData(prev => ({
			...prev,
			ingredients: prev.ingredients.map((ingredient, i) => 
				i === index ? value : ingredient
			)
		}))
	}

	const addStep = () => {
		setFormData(prev => ({
			...prev,
			steps: [...prev.steps, '']
		}))
	}

	const removeStep = (index) => {
		setFormData(prev => ({
			...prev,
			steps: prev.steps.filter((_, i) => i !== index)
		}))
	}

	const updateStep = (index, value) => {
		setFormData(prev => ({
			...prev,
			steps: prev.steps.map((step, i) => 
				i === index ? value : step
			)
		}))
	}

	const uploadImage = async (file) => {
		if (!file) return null
		
		const storageRef = ref(storage, `recipes/${Date.now()}_${file.name}`)
		const snapshot = await uploadBytes(storageRef, file)
		return await getDownloadURL(snapshot.ref)
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		setLoading(true)

		try {
			// Validaciones
			if (!formData.title.trim()) {
				toast.error('El título es obligatorio')
				return
			}
			if (!formData.description.trim()) {
				toast.error('La descripción es obligatoria')
				return
			}
			if (formData.ingredients.filter(i => i.trim()).length === 0) {
				toast.error('Agrega al menos un ingrediente')
				return
			}
			if (formData.steps.filter(s => s.trim()).length === 0) {
				toast.error('Agrega al menos un paso')
				return
			}

			// Subir imagen si existe
			let imageURL = null
			if (imageFile) {
				imageURL = await uploadImage(imageFile)
			}

			// Crear documento de receta
			const recipeData = {
				title: formData.title.trim(),
				description: formData.description.trim(),
				category: formData.category,
				ingredients: formData.ingredients.filter(i => i.trim()),
				steps: formData.steps.filter(s => s.trim()),
				cookingTime: formData.cookingTime,
				servings: formData.servings,
				difficulty: formData.difficulty,
				imageURL,
				author: {
					uid: currentUser.uid,
					email: currentUser.email,
					displayName: currentUser.displayName || currentUser.email?.split('@')[0]
				},
				likes: 0,
				likedBy: [],
				createdAt: serverTimestamp(),
				updatedAt: serverTimestamp(),
				isUserRecipe: true
			}

			await addDoc(collection(db, 'recipes'), recipeData)
			
			toast.success('¡Receta creada exitosamente!')
			navigate('/recipes')
		} catch (error) {
			console.error('Error al crear receta:', error)
			toast.error('Error al crear la receta')
		} finally {
			setLoading(false)
		}
	}

	if (loading) {
		return <LoadingSpinner message="Creando receta..." />
	}

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-4xl mx-auto px-4">
				<div className="bg-white rounded-lg shadow-lg p-6">
					<h1 className="text-3xl font-bold text-gray-900 mb-6">Crear Nueva Receta</h1>
					
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Información básica */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Título de la receta *
								</label>
								<input
									type="text"
									name="title"
									value={formData.title}
									onChange={handleInputChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									placeholder="Ej: Empanadas de carne"
									required
								/>
							</div>
							
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Categoría
								</label>
								<select
									name="category"
									value={formData.category}
									onChange={handleInputChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								>
									<option value="Comidas Típicas">Comidas Típicas</option>
									<option value="Panadería">Panadería</option>
									<option value="Pastelería">Pastelería</option>
									<option value="Confitería">Confitería</option>
									<option value="Pastas">Pastas</option>
									<option value="Carnes">Carnes</option>
								</select>
							</div>
						</div>

						{/* Descripción */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Descripción *
							</label>
							<textarea
								name="description"
								value={formData.description}
								onChange={handleInputChange}
								rows={3}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Describe tu receta..."
								required
							/>
						</div>

						{/* Imagen */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Imagen de la receta
							</label>
							<div className="flex items-center space-x-4">
								<button
									type="button"
									onClick={() => fileInputRef.current?.click()}
									className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
								>
									Seleccionar imagen
								</button>
								{imagePreview && (
									<img
										src={imagePreview}
										alt="Preview"
										className="w-20 h-20 object-cover rounded-md"
									/>
								)}
							</div>
							<input
								ref={fileInputRef}
								type="file"
								accept="image/*"
								onChange={handleImageChange}
								className="hidden"
							/>
						</div>

						{/* Detalles adicionales */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Tiempo de cocción
								</label>
								<input
									type="text"
									name="cookingTime"
									value={formData.cookingTime}
									onChange={handleInputChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									placeholder="Ej: 30 minutos"
								/>
							</div>
							
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Porciones
								</label>
								<input
									type="text"
									name="servings"
									value={formData.servings}
									onChange={handleInputChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									placeholder="Ej: 4 personas"
								/>
							</div>
							
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Dificultad
								</label>
								<select
									name="difficulty"
									value={formData.difficulty}
									onChange={handleInputChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								>
									<option value="Fácil">Fácil</option>
									<option value="Media">Media</option>
									<option value="Difícil">Difícil</option>
								</select>
							</div>
						</div>

						{/* Ingredientes */}
						<div>
							<div className="flex items-center justify-between mb-4">
								<label className="block text-sm font-medium text-gray-700">
									Ingredientes *
								</label>
								<button
									type="button"
									onClick={addIngredient}
									className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
								>
									+ Agregar ingrediente
								</button>
							</div>
							<div className="space-y-2">
								{formData.ingredients.map((ingredient, index) => (
									<div key={index} className="flex items-center space-x-2">
										<input
											type="text"
											value={ingredient}
											onChange={(e) => updateIngredient(index, e.target.value)}
											className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
											placeholder={`Ingrediente ${index + 1}`}
										/>
										{formData.ingredients.length > 1 && (
											<button
												type="button"
												onClick={() => removeIngredient(index)}
												className="px-2 py-2 text-red-600 hover:text-red-800"
											>
												🗑️
											</button>
										)}
									</div>
								))}
							</div>
						</div>

						{/* Pasos */}
						<div>
							<div className="flex items-center justify-between mb-4">
								<label className="block text-sm font-medium text-gray-700">
									Pasos a seguir *
								</label>
								<button
									type="button"
									onClick={addStep}
									className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
								>
									+ Agregar paso
								</button>
							</div>
							<div className="space-y-4">
								{formData.steps.map((step, index) => (
									<div key={index} className="flex items-start space-x-2">
										<div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
											{index + 1}
										</div>
										<div className="flex-1">
											<textarea
												value={step}
												onChange={(e) => updateStep(index, e.target.value)}
												rows={2}
												className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
												placeholder={`Paso ${index + 1}`}
											/>
										</div>
										{formData.steps.length > 1 && (
											<button
												type="button"
												onClick={() => removeStep(index)}
												className="px-2 py-2 text-red-600 hover:text-red-800"
											>
												🗑️
											</button>
										)}
									</div>
								))}
							</div>
						</div>

						{/* Botones */}
						<div className="flex justify-end space-x-4 pt-6">
							<button
								type="button"
								onClick={() => navigate('/recipes')}
								className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
							>
								Cancelar
							</button>
							<button
								type="submit"
								className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
							>
								Crear Receta
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}

export default CreateRecipePage 