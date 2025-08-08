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
			if (menuRef.current && !menuRef.current.contains(event.target)) {
				setShowUserMenu(false)
			}
			if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
				setShowMobileMenu(false)
			}
		}

		if (showUserMenu || showMobileMenu) {
			document.addEventListener('mousedown', handleClickOutside)
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [showUserMenu, showMobileMenu])

	const handleSignOut = async () => {
		try {
			await signOut()
			setShowUserMenu(false)
			setShowMobileMenu(false)
		} catch (error) {
			console.error('Error al cerrar sesión:', error)
		}
	}

	return (
		<>
			<nav className="px-4 md:px-8 py-4 bg-white shadow-md">
				<div className="flex items-center justify-between max-w-6xl mx-auto">
					<Link to="/" className="text-xl md:text-2xl font-bold text-orange-600 transition-colors hover:text-orange-700">
						🍳 Sazonea
					</Link>
					
					{/* Menú de escritorio */}
					<div className="hidden md:flex items-center space-x-6">
						<Link to="/" className="font-medium text-gray-700 transition-colors hover:text-orange-600">Inicio</Link>
						<Link to="/recipes" className="font-medium text-gray-700 transition-colors hover:text-orange-600">Recetas</Link>
						
						{/* Mostrar botón de agregar receta solo si el usuario está autenticado */}
						{currentUser && (
							<motion.button
								whileHover={{ scale: 1.05, y: -2 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => {
									console.log('Botón clickeado, currentUser:', currentUser)
									console.log('showAddRecipeForm antes:', showAddRecipeForm)
									setShowAddRecipeForm(true)
									console.log('showAddRecipeForm después:', true)
								}}
								className="flex items-center px-4 py-2.5 font-medium text-white transition-all duration-200 bg-gradient-to-r from-green-500 to-green-600 rounded-xl hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl"
							>
								<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
								</svg>
								Agregar Receta
							</motion.button>
						)}
						
						{/* Mostrar Favoritos solo si el usuario está autenticado */}
						{currentUser && (
							<Link to="/favorites" className="font-medium text-gray-700 transition-colors hover:text-orange-600">
								Mis Favoritos
							</Link>
						)}
						
						{/* Información del usuario */}
						{currentUser ? (
							<div className="relative" ref={menuRef}>
								{/* Botón del usuario */}
								<motion.button
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									onClick={() => setShowUserMenu(!showUserMenu)}
									className="flex items-center px-3 py-2 space-x-2 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
								>
									{currentUser.photoURL ? (
										<img 
											src={currentUser.photoURL} 
											alt="Avatar" 
											className="w-6 h-6 rounded-full"
										/>
									) : (
										<div className="flex items-center justify-center w-6 h-6 bg-orange-500 rounded-full">
											<span className="text-xs font-medium text-white">
												{currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : currentUser.email.charAt(0).toUpperCase()}
											</span>
										</div>
									)}
									<span className="text-sm font-medium text-gray-700">
										{currentUser.displayName || currentUser.email.split('@')[0]}
									</span>
									<svg 
										className={`w-4 h-4 text-gray-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} 
										fill="none" 
										stroke="currentColor" 
										viewBox="0 0 24 24"
									>
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
									</svg>
								</motion.button>

								{/* Menú desplegable */}
								<AnimatePresence>
									{showUserMenu && (
										<motion.div
											initial={{ opacity: 0, y: -10, scale: 0.95 }}
											animate={{ opacity: 1, y: 0, scale: 1 }}
											exit={{ opacity: 0, y: -10, scale: 0.95 }}
											transition={{ duration: 0.2 }}
											className="absolute right-0 z-50 w-48 py-2 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg"
										>
											<div className="px-4 py-2 border-b border-gray-100">
												<p className="text-sm font-medium text-gray-900">
													{currentUser.displayName || 'Usuario'}
												</p>
												<p className="text-xs text-gray-500">
													{currentUser.email}
												</p>
											</div>
											
											<div className="py-1">
												<Link
													to="/favorites"
													onClick={() => setShowUserMenu(false)}
													className="flex items-center px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100"
												>
													<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
													</svg>
													Mis Favoritos
												</Link>
												
												{isAdmin && (
													<Link
														to="/admin"
														onClick={() => setShowUserMenu(false)}
														className="flex items-center px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100"
													>
														<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
														</svg>
														Administración
													</Link>
												)}
												
												<button
													onClick={handleSignOut}
													className="flex items-center w-full px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
												>
													<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
													</svg>
													Cerrar Sesión
												</button>
											</div>
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						) : (
							<div className="flex items-center space-x-3">
								<Link to="/login" className="font-medium text-gray-700 transition-colors hover:text-orange-600">
									Iniciar Sesión
								</Link>
								<Link to="/register" className="px-4 py-2 font-medium text-white transition-colors bg-orange-500 rounded-lg hover:bg-orange-600">
									Registrarse
								</Link>
							</div>
						)}
					</div>

					{/* Botón de menú hamburguesa para móviles */}
					<div className="md:hidden" ref={mobileMenuRef}>
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

				{/* Menú móvil */}
				<AnimatePresence>
					{showMobileMenu && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: 'auto' }}
							exit={{ opacity: 0, height: 0 }}
							transition={{ duration: 0.3 }}
							className="md:hidden border-t border-gray-200 bg-white"
						>
							<div className="px-4 py-4 space-y-4">
								<Link 
									to="/" 
									onClick={() => setShowMobileMenu(false)}
									className="block font-medium text-gray-700 transition-colors hover:text-orange-600"
								>
									Inicio
								</Link>
								<Link 
									to="/recipes" 
									onClick={() => setShowMobileMenu(false)}
									className="block font-medium text-gray-700 transition-colors hover:text-orange-600"
								>
									Recetas
								</Link>
								
								{/* Mostrar botón de agregar receta solo si el usuario está autenticado */}
								{currentUser && (
									<motion.button
										whileTap={{ scale: 0.95 }}
										onClick={() => {
											setShowAddRecipeForm(true)
											setShowMobileMenu(false)
										}}
										className="flex items-center w-full px-4 py-2 font-medium text-white transition-all duration-200 bg-gradient-to-r from-green-500 to-green-600 rounded-lg hover:from-green-600 hover:to-green-700"
									>
										<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
										</svg>
										Agregar Receta
									</motion.button>
								)}
								
								{/* Mostrar Favoritos solo si el usuario está autenticado */}
								{currentUser && (
									<Link 
										to="/favorites" 
										onClick={() => setShowMobileMenu(false)}
										className="block font-medium text-gray-700 transition-colors hover:text-orange-600"
									>
										Mis Favoritos
									</Link>
								)}

								{/* Información del usuario en móvil */}
								{currentUser ? (
									<div className="pt-4 border-t border-gray-200">
										<div className="flex items-center space-x-3 mb-4">
											{currentUser.photoURL ? (
												<img 
													src={currentUser.photoURL} 
													alt="Avatar" 
													className="w-8 h-8 rounded-full"
												/>
											) : (
												<div className="flex items-center justify-center w-8 h-8 bg-orange-500 rounded-full">
													<span className="text-sm font-medium text-white">
														{currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : currentUser.email.charAt(0).toUpperCase()}
													</span>
												</div>
											)}
											<div>
												<p className="text-sm font-medium text-gray-900">
													{currentUser.displayName || 'Usuario'}
												</p>
												<p className="text-xs text-gray-500">
													{currentUser.email}
												</p>
											</div>
										</div>
										
										{isAdmin && (
											<Link
												to="/admin"
												onClick={() => setShowMobileMenu(false)}
												className="flex items-center px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 rounded-lg"
											>
												<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
												</svg>
												Administración
											</Link>
										)}
										
										<button
											onClick={handleSignOut}
											className="flex items-center w-full px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 rounded-lg"
										>
											<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
											</svg>
											Cerrar Sesión
										</button>
									</div>
								) : (
									<div className="pt-4 border-t border-gray-200 space-y-3">
										<Link 
											to="/login" 
											onClick={() => setShowMobileMenu(false)}
											className="block font-medium text-gray-700 transition-colors hover:text-orange-600"
										>
											Iniciar Sesión
										</Link>
										<Link 
											to="/register" 
											onClick={() => setShowMobileMenu(false)}
											className="block px-4 py-2 font-medium text-white transition-colors bg-orange-500 rounded-lg hover:bg-orange-600 text-center"
										>
											Registrarse
										</Link>
									</div>
								)}
							</div>
						</motion.div>
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
