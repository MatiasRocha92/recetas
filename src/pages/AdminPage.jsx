import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const AdminPage = () => {
	const { currentUser, isAdmin } = useAuth()

	// Solo permitir acceso a usuarios autenticados y administradores
	if (!currentUser) {
		return <Navigate to="/login" replace />
	}

	if (!isAdmin) {
		return <Navigate to="/" replace />
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-4xl mx-auto px-8 py-8">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="text-center mb-8"
				>
					<h1 className="text-4xl font-bold text-gray-800 mb-4">
						Panel de Administración
					</h1>
					<p className="text-gray-600 text-lg">
						¡Bienvenido, {currentUser.email}!
					</p>
				</motion.div>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.6, delay: 0.2 }}
					className="bg-white rounded-lg shadow-md p-8"
				>
					<h2 className="text-2xl font-bold text-gray-800 mb-6">
						Gestión de Base de Datos
					</h2>
					
					<div className="space-y-6">
						<div className="border border-gray-200 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-gray-800 mb-4">
								Poblar Base de Datos con Recetas Argentinas
							</h3>
							<p className="text-gray-600 mb-4">
								El componente para poblar la base de datos ha sido temporalmente removido, che. 
								Las recetas ya están disponibles en la aplicación.
							</p>
							<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
								<p className="text-blue-800 text-sm">
									<strong>Nota:</strong> Si necesitás agregar más recetas, podés hacerlo manualmente 
									desde la interfaz de usuario o contactar al administrador del sistema.
								</p>
							</div>
						</div>

						<div className="border border-gray-200 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-gray-800 mb-4">
								Información del Sistema
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
								<div>
									<p><strong>Usuario:</strong> {currentUser.email}</p>
									<p><strong>ID:</strong> {currentUser.uid}</p>
								</div>
								<div>
									<p><strong>Proveedor:</strong> {currentUser.providerData[0]?.providerId || 'Email/Password'}</p>
									<p><strong>Verificado:</strong> {currentUser.emailVerified ? 'Sí' : 'No'}</p>
								</div>
							</div>
						</div>
					</div>
				</motion.div>
			</div>
		</div>
	)
}

export default AdminPage 