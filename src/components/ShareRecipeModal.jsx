import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { 
	FiShare2, 
	FiCopy, 
	FiCheck,
	FiX,
	FiRotateCw
} from 'react-icons/fi'
import { 
	FaWhatsapp, 
	FaFacebook, 
	FaTwitter, 
	FaInstagram 
} from 'react-icons/fa'

const ShareRecipeModal = ({ isOpen, onClose, recipe }) => {
	const [copied, setCopied] = useState(false)
	const [shareUrl, setShareUrl] = useState('')

	useEffect(() => {
		if (isOpen && recipe) {
			// Crear URL para compartir
			const url = `${window.location.origin}/recipe/${recipe.id}`
			setShareUrl(url)
		}
	}, [isOpen, recipe])

	const handleCopyLink = async () => {
		try {
			await navigator.clipboard.writeText(shareUrl)
			setCopied(true)
			toast.success('¡Enlace copiado al portapapeles!')
			setTimeout(() => setCopied(false), 2000)
		} catch (error) {
			toast.error('Error al copiar el enlace')
		}
	}

	const handleShareWhatsApp = () => {
		const text = `¡Mira esta deliciosa receta de ${recipe.title}! 🍳\n\n${shareUrl}`
		const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`
		window.open(whatsappUrl, '_blank')
	}

	const handleShareFacebook = () => {
		const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
		window.open(facebookUrl, '_blank')
	}

	const handleShareTwitter = () => {
		const text = `¡Mira esta deliciosa receta de ${recipe.title}! 🍳`
		const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`
		window.open(twitterUrl, '_blank')
	}

	const handleShareInstagram = () => {
		toast.success('Para compartir en Instagram, copia el enlace y pégalo en tu historia')
		handleCopyLink()
	}

	if (!recipe) return null

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
							className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-gray-100"
						>
							{/* Header */}
							<motion.div 
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.1 }}
								className="p-8 border-b border-gray-100"
							>
								<div className="flex items-center justify-between">
									<div className="flex items-center">
										<motion.div
											whileHover={{ scale: 1.1, rotate: 15 }}
											whileTap={{ scale: 0.9 }}
											className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mr-4 transition-all duration-200"
										>
											<FiShare2 className="text-white text-xl" />
										</motion.div>
										<div>
											<h2 className="text-2xl font-bold text-gray-800">Compartir Receta</h2>
											<p className="text-gray-600 text-sm">¡Comparte esta deliciosa receta!</p>
										</div>
									</div>
									<motion.button
										whileHover={{ scale: 1.1, rotate: 90 }}
										whileTap={{ scale: 0.9 }}
										onClick={onClose}
										className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
									>
										<FiX className="w-5 h-5 text-gray-600" />
									</motion.button>
								</div>
							</motion.div>

							{/* Contenido */}
							<motion.div 
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.2 }}
								className="p-8"
							>
								{/* Información de la receta */}
								<motion.div 
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.3 }}
									className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-100"
								>
									<h3 className="font-semibold text-gray-800 mb-2">{recipe.title}</h3>
									<p className="text-sm text-gray-600">{recipe.description}</p>
								</motion.div>

								{/* Enlace para copiar */}
								<motion.div 
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.4 }}
									className="mb-6"
								>
									<label className="block text-sm font-semibold text-gray-700 mb-3">
										🔗 Enlace para compartir
									</label>
									<div className="flex">
										<input
											type="text"
											value={shareUrl}
											readOnly
											className="flex-1 px-4 py-3 border border-gray-200 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 text-sm"
										/>
										<motion.button
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
											onClick={handleCopyLink}
											className={`px-4 py-3 rounded-r-xl font-medium transition-all duration-200 flex items-center justify-center ${
												copied 
													? 'bg-green-500 text-white' 
													: 'bg-green-500 text-white hover:bg-green-600'
											}`}
										>
											{copied ? <FiCheck className="w-5 h-5" /> : <FiCopy className="w-5 h-5" />}
										</motion.button>
									</div>
								</motion.div>

								{/* Botones de redes sociales */}
								<motion.div 
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.5 }}
									className="space-y-3"
								>
									<label className="block text-sm font-semibold text-gray-700 mb-3">
										📱 Compartir en redes sociales
									</label>
									
									{/* WhatsApp */}
									<motion.button
										whileHover={{ scale: 1.02, x: 5 }}
										whileTap={{ scale: 0.98 }}
										onClick={handleShareWhatsApp}
										className="w-full flex items-center px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-200 shadow-lg hover:shadow-xl"
									>
										<FaWhatsapp className="text-xl mr-3" />
										<span className="font-medium">Compartir en WhatsApp</span>
									</motion.button>

									{/* Facebook */}
									<motion.button
										whileHover={{ scale: 1.02, x: 5 }}
										whileTap={{ scale: 0.98 }}
										onClick={handleShareFacebook}
										className="w-full flex items-center px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
									>
										<FaFacebook className="text-xl mr-3" />
										<span className="font-medium">Compartir en Facebook</span>
									</motion.button>

									{/* Twitter */}
									<motion.button
										whileHover={{ scale: 1.02, x: 5 }}
										whileTap={{ scale: 0.98 }}
										onClick={handleShareTwitter}
										className="w-full flex items-center px-4 py-3 bg-blue-400 text-white rounded-xl hover:bg-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl"
									>
										<FaTwitter className="text-xl mr-3" />
										<span className="font-medium">Compartir en Twitter</span>
									</motion.button>

									{/* Instagram */}
									<motion.button
										whileHover={{ scale: 1.02, x: 5 }}
										whileTap={{ scale: 0.98 }}
										onClick={handleShareInstagram}
										className="w-full flex items-center px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl"
									>
										<FaInstagram className="text-xl mr-3" />
										<span className="font-medium">Compartir en Instagram</span>
									</motion.button>
								</motion.div>
							</motion.div>
						</motion.div>
					</div>
				</>
			)}
		</AnimatePresence>
	)
}

export default ShareRecipeModal
