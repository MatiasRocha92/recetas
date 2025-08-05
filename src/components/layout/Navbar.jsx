import { Link } from 'react-router-dom'

const Navbar = () => {
	return (
		<nav className="bg-white shadow-md py-4 px-8">
			<div className="flex justify-between items-center max-w-6xl mx-auto">
				{/* Logo */}
				<Link to="/" className="text-2xl font-bold text-orange-600 hover:text-orange-700 transition-colors">
					🍳 RecetasApp
				</Link>
				
				{/* Navegación */}
				<div className="flex items-center space-x-6">
					<Link 
						to="/" 
						className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
					>
						Inicio
					</Link>
					<Link 
						to="/recipes" 
						className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
					>
						Recetas
					</Link>
					<Link 
						to="/favorites" 
						className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
					>
						Favoritos
					</Link>
				</div>
			</div>
		</nav>
	)
}

export default Navbar 