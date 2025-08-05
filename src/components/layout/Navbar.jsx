import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Navbar = () => {
	const { currentUser, signOut } = useAuth()

	const handleSignOut = async () => {
		try {
			await signOut()
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
					<Link to="/favorites" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">Favoritos</Link>
					
					{/* Información del usuario */}
					{currentUser ? (
						<div className="flex items-center space-x-3">
							<span className="text-sm text-gray-600">
								👤 {currentUser.email}
							</span>
							<button 
								onClick={handleSignOut}
								className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
							>
								Cerrar Sesión
							</button>
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