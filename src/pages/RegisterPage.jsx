import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

const RegisterPage = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const { signUp } = useAuth()
	const navigate = useNavigate()

	const handleSubmit = async (e) => {
		e.preventDefault()
		
		if (!email || !password || !confirmPassword) {
			return
		}

		if (password !== confirmPassword) {
			alert('Las contraseñas no coinciden')
			return
		}

		if (password.length < 6) {
			alert('La contraseña debe tener al menos 6 caracteres')
			return
		}

		try {
			setLoading(true)
			await signUp(email, password)
			navigate('/')
		} catch (error) {
			console.error('Error al registrar usuario:', error)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className="max-w-md w-full space-y-8"
			>
				<div className="text-center">
					<motion.h2
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className="text-3xl font-bold text-gray-900"
					>
						Crear Cuenta
					</motion.h2>
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.6, delay: 0.3 }}
						className="mt-2 text-sm text-gray-600"
					>
						Únete a RecetasApp y guarda tus recetas favoritas
					</motion.p>
				</div>

				<motion.form
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.6, delay: 0.4 }}
					className="mt-8 space-y-6"
					onSubmit={handleSubmit}
				>
					<div className="space-y-4">
						<div>
							<label htmlFor="email" className="block text-sm font-medium text-gray-700">
								Email
							</label>
							<input
								id="email"
								name="email"
								type="email"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
								placeholder="tu@email.com"
							/>
						</div>

						<div>
							<label htmlFor="password" className="block text-sm font-medium text-gray-700">
								Contraseña
							</label>
							<input
								id="password"
								name="password"
								type="password"
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
								placeholder="••••••••"
							/>
							<p className="mt-1 text-xs text-gray-500">Mínimo 6 caracteres</p>
						</div>

						<div>
							<label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
								Confirmar Contraseña
							</label>
							<input
								id="confirmPassword"
								name="confirmPassword"
								type="password"
								required
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
								placeholder="••••••••"
							/>
						</div>
					</div>

					<div>
						<button
							type="submit"
							disabled={loading}
							className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{loading ? (
								<div className="flex items-center">
									<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
									Creando cuenta...
								</div>
							) : (
								'Crear Cuenta'
							)}
						</button>
					</div>

					<div className="text-center">
						<p className="text-sm text-gray-600">
							¿Ya tienes cuenta?{' '}
							<Link to="/login" className="font-medium text-orange-600 hover:text-orange-500">
								Inicia sesión aquí
							</Link>
						</p>
					</div>
				</motion.form>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.6, delay: 0.5 }}
					className="text-center"
				>
					<Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
						← Volver al Inicio
					</Link>
				</motion.div>
			</motion.div>
		</div>
	)
}

export default RegisterPage 