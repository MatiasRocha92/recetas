import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import AddRecipeForm from '../AddRecipeForm'

const Navbar = () => {
	const { currentUser, signOut, isAdmin } = useAuth()
	const [showUserMenu, setShowUserMenu] = useState(false)
	const [showAddRecipeForm, setShowAddRecipeForm] = useState(false)
	const [showMobileMenu, setShowMobileMenu] = useState(false)
	const menuRef = useRef(null)
	const mobileMenuRef = useRef(null)

	// Cerrar menú cuando se hace clic fuera
	useEffect(() => {
		const handleClickOutside = (event) => {
			// Solo cerrar si el click es fuera del menú y fuera del botón hamburguesa
			if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
				// Verificar si el click es en el backdrop o fuera del menú
				const menuContent = document.querySelector('[data-menu-content]')
				if (menuContent && !menuContent.contains(event.target)) {
					setShowMobileMenu(false)
				}
			}
		}

		const handleEscapeKey = (event) => {
			if (event.key === 'Escape') {
				setShowMobileMenu(false)
			}
		}

		if (showMobileMenu) {
			document.addEventListener('mousedown', handleClickOutside)
			document.addEventListener('keydown', handleEscapeKey)
			// Prevenir scroll del body cuando el menú está abierto
			document.body.style.overflow = 'hidden'
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
			document.removeEventListener('keydown', handleEscapeKey)
			// Restaurar scroll del body cuando el menú se cierra
			document.body.style.overflow = 'unset'
		}
	}, [showMobileMenu])

	const handleSignOut = async () => {
		try {
			await signOut()
			setShowUserMenu(false)
			setShowMobileMenu(false)
		} catch (error) {
			console.error('Error al cerrar sesión:', error)
		}
	}

	const handleLinkClick = () => {
		setShowMobileMenu(false)
	}

	return (
		<>
			<nav className="px-4 py-4 bg-white shadow-md md:px-8">
				<div className="flex items-center justify-between max-w-6xl mx-auto">
					<Link to="/" className="text-xl font-bold text-orange-600 transition-colors md:text-2xl hover:text-orange-700">
						🍳 Sazonea
					</Link>
					
					{/* Botón de menú hamburguesa - visible en todas las resoluciones */}
					<div className="flex" ref={mobileMenuRef}>
						<motion.button
							whileTap={{ scale: 0.95 }}
							onClick={() => setShowMobileMenu(!showMobileMenu)}
							className="flex flex-col items-center justify-center w-8 h-8 space-y-1"
						>
							<span className={`block w-6 h-0.5 bg-gray-600 transition-all duration-300 ${showMobileMenu ? 'rotate-45 translate-y-1.5' : ''}`}></span>
							<span className={`block w-6 h-0.5 bg-gray-600 transition-all duration-300 ${showMobileMenu ? 'opacity-0' : ''}`}></span>
							<span className={`block w-6 h-0.5 bg-gray-600 transition-all duration-300 ${showMobileMenu ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
						</motion.button>
					</div>
				</div>

				{/* Menú desplegable - visible en todas las resoluciones */}
				<AnimatePresence>
					{showMobileMenu && (
						<>
							{/* Backdrop */}
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.3 }}
								className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
								onClick={() => setShowMobileMenu(false)}
							/>
							
							{/* Menú principal */}
							<motion.div
								initial={{ opacity: 0, x: '100%' }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: '100%' }}
								transition={{ 
									duration: 0.4,
									ease: [0.25, 0.46, 0.45, 0.94]
								}}
								className="fixed top-0 right-0 z-50 flex flex-col w-full h-full max-w-md bg-white shadow-2xl"
								data-menu-content
							>
								{/* Header del menú - Solo visible en móvil */}
								<div className="flex items-center justify-between flex-shrink-0 p-6 border-b border-gray-100 md:hidden">
									<h2 className="text-xl font-bold text-gray-900">Menú</h2>
									<button
										onClick={() => setShowMobileMenu(false)}
										className="p-2 text-gray-400 transition-colors hover:text-gray-600"
									>
										<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
										</svg>
									</button>
								</div>

								{/* Contenido del menú con scroll */}
								<div className="flex-1 overflow-y-auto menu-scrollbar">
									<div className="px-6 pb-6 space-y-4 md:pt-6">
										{/* Información del usuario - Movida al tope */}
										{currentUser && (
											<div className="space-y-4">
												<div className="flex items-center p-4 rounded-lg bg-gray-50">
													{currentUser.photoURL ? (
														<img 
															src={currentUser.photoURL} 
															alt="Avatar" 
															className="w-12 h-12 mr-4 rounded-full"
														/>
													) : (
														<div className="flex items-center justify-center w-12 h-12 mr-4 bg-orange-500 rounded-full">
															<span className="text-lg font-medium text-white">
																{currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : currentUser.email.charAt(0).toUpperCase()}
															</span>
														</div>
													)}
													<div>
														<p className="text-lg font-medium text-gray-900">
															{currentUser.displayName || 'Usuario'}
														</p>
														<p className="text-sm text-gray-500">
															{currentUser.email}
														</p>
													</div>
												</div>
											</div>
										)}

										{/* Navegación principal */}
										<div className="space-y-2">
											<Link 
												to="/" 
												onClick={handleLinkClick}
												className="flex items-center py-3 text-lg font-medium text-gray-900 transition-colors border-b border-transparent hover:text-orange-600 hover:border-orange-200"
											>
												Inicio
											</Link>
											<Link 
												to="/recipes" 
												onClick={handleLinkClick}
												className="flex items-center py-3 text-lg font-medium text-gray-900 transition-colors border-b border-transparent hover:text-orange-600 hover:border-orange-200"
											>
												Recetas
											</Link>
										</div>

										{/* Acciones del usuario */}
										{currentUser && (
											<div className="space-y-2">
												<motion.button
													whileHover={{ scale: 1.02 }}
													whileTap={{ scale: 0.98 }}
													onClick={() => {
														setShowAddRecipeForm(true)
														setShowMobileMenu(false)
													}}
													className="flex items-center w-full py-3 text-lg font-medium text-white transition-all duration-200 rounded-lg shadow-sm bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
												>
													<svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
													</svg>
													Agregar Receta
												</motion.button>
												<Link 
													to="/favorites" 
													onClick={handleLinkClick}
													className="flex items-center py-3 text-lg font-medium text-gray-900 transition-colors border-b border-transparent hover:text-orange-600 hover:border-orange-200"
												>
													Mis Favoritos
												</Link>
											</div>
										)}

										{/* Información adicional del usuario */}
										{currentUser && (
											<div className="space-y-4">
												{isAdmin && (
													<Link
														to="/admin"
														onClick={handleLinkClick}
														className="flex items-center py-3 text-lg font-medium text-gray-900 transition-colors border-b border-transparent hover:text-orange-600 hover:border-orange-200"
													>
														Administración
													</Link>
												)}
												
												<button
													onClick={handleSignOut}
													className="flex items-center w-full py-3 text-lg font-medium text-red-600 transition-colors border-b border-transparent hover:text-red-700 hover:border-red-200"
												>
													Cerrar Sesión
												</button>
											</div>
										)}

										{/* Acceso para usuarios no autenticados */}
										{!currentUser && (
											<div className="space-y-2">
												<Link 
													to="/login" 
													onClick={handleLinkClick}
													className="flex items-center py-3 text-lg font-medium text-gray-900 transition-colors border-b border-transparent hover:text-orange-600 hover:border-orange-200"
												>
													Iniciar Sesión
												</Link>
												<Link 
													to="/register" 
													onClick={handleLinkClick}
													className="flex items-center py-3 text-lg font-medium text-white transition-colors bg-orange-500 rounded-lg hover:bg-orange-600"
												>
													Registrarse
												</Link>
											</div>
										)}
									</div>
								</div>
							</motion.div>
						</>
					)}
				</AnimatePresence>
			</nav>
			
			{/* Formulario de agregar receta */}
			<AddRecipeForm 
				isOpen={showAddRecipeForm} 
				onClose={() => setShowAddRecipeForm(false)} 
			/>
		</>
	)
}

export default Navbar 
