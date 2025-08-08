import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import GoogleAuthButton from '../components/GoogleAuthButton'

const LoginPage = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const { signIn } = useAuth()
	const navigate = useNavigate()

	const handleSubmit = async (e) => {
		e.preventDefault()
		setError('')
		
		if (!email || !password) {
			setError('Por favor completá todos los campos, che')
			return
		}

		try {
			setLoading(true)
			await signIn(email, password)
			navigate('/')
		} catch (error) {
			console.error('Error al iniciar sesión:', error)
			// El error ya se maneja en el AuthContext con toast
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
						Iniciar Sesión
					</motion.h2>
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.6, delay: 0.3 }}
						className="mt-2 text-sm text-gray-600"
					>
						Accedé a tu cuenta para guardar tus recetas favoritas
					</motion.p>
				</div>

				<motion.form
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.6, delay: 0.4 }}
					className="mt-8 space-y-6"
					onSubmit={handleSubmit}
				>
					{error && (
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md"
						>
							{error}
						</motion.div>
					)}
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
								placeholder="Tu contraseña"
							/>
						</div>
					</div>

					<div>
						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							type="submit"
							disabled={loading}
							className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{loading ? (
								<div className="flex items-center">
									<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
									Iniciando sesión...
								</div>
							) : (
								'Iniciar Sesión'
							)}
						</motion.button>
					</div>

					<div className="text-center">
						<p className="text-sm text-gray-600">
							¿No tenés cuenta?{' '}
							<Link to="/register" className="font-medium text-orange-600 hover:text-orange-500">
								Registrate acá
							</Link>
						</p>
					</div>

					<div className="mt-6">
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-gray-300" />
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="px-2 bg-gray-50 text-gray-500">O continuá con</span>
							</div>
						</div>

						<div className="mt-6">
							<GoogleAuthButton />
						</div>
					</div>
				</motion.form>
			</motion.div>
		</div>
	)
}

export default LoginPage 