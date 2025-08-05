import { motion } from 'framer-motion'

const LoadingSpinner = ({ message = "Cargando..." }) => {
	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center">
			<div className="text-center">
				<motion.div
					animate={{ rotate: 360 }}
					transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
					className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full mx-auto"
				/>
				<p className="mt-4 text-gray-600 font-medium">{message}</p>
			</div>
		</div>
	)
}

export default LoadingSpinner 