import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'

const Navbar = () => {
	const { currentUser, signOut } = useAuth()
	const [showUserMenu, setShowUserMenu] = useState(false)
	const menuRef = useRef(null)

	// Cerrar menú cuando se hace clic fuera
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (menuRef.current && !menuRef.current.contains(event.target)) {
				setShowUserMenu(false)
			}
		}

		if (showUserMenu) {
			document.addEventListener('mousedown', handleClickOutside)
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [showUserMenu])

	const handleSignOut = async () => {
		try {
			await signOut()
			setShowUserMenu(false)
		} catch (error) {
			console.error('Error al cerrar sesión:', error)
		}
	}

	return (
		<nav className="bg-white shadow-md py-4 px-8">
			<div className="flex justify-between items-center max-w-6xl mx-auto">
				<Link to="/" className="text-2xl font-bold text-orange-600 hover:text-orange-700 transition-colors">
					🍳 RecetasApp
				</Link>
				<div className="flex items-center space-x-6">
					<Link to="/" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">Inicio</Link>
					<Link to="/recipes" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">Recetas</Link>
					
					{/* Mostrar Favoritos solo si el usuario está autenticado */}
					{currentUser && (
						<Link to="/favorites" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
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
								className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors"
							>
								{currentUser.photoURL ? (
									<img 
										src={currentUser.photoURL} 
										alt="Avatar" 
										className="w-6 h-6 rounded-full"
									/>
								) : (
									<div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
										<span className="text-white text-xs font-medium">
											{currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : currentUser.email.charAt(0).toUpperCase()}
										</span>
									</div>
								)}
								<span className="text-sm text-gray-700 font-medium">
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
										className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
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
												className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
											>
												<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
												</svg>
												Mis Favoritos
											</Link>
											
											<button
												onClick={handleSignOut}
												className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
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
							<Link to="/login" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
								Iniciar Sesión
							</Link>
							<Link to="/register" className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors">
								Registrarse
							</Link>
						</div>
					)}
				</div>
			</div>
		</nav>
	)
}

export default Navbar 