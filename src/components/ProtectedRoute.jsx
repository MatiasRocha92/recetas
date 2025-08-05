import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'

const ProtectedRoute = ({ children }) => {
	const { currentUser, loading } = useAuth()

	// Mostrar spinner mientras se verifica la autenticación
	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<motion.div
						animate={{ rotate: 360 }}
						transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
						className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full mx-auto"
					/>
					<p className="mt-4 text-gray-600">Verificando autenticación...</p>
				</div>
			</div>
		)
	}

	// Si no hay usuario autenticado, redirigir a login
	if (!currentUser) {
		return <Navigate to="/login" replace />
	}

	// Si hay usuario autenticado, mostrar el contenido protegido
	return children
}

export default ProtectedRoute 