import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

const Step = ({ step, stepNumber, totalSteps }) => {
	const [isChecked, setIsChecked] = useState(false)
	const [isActive, setIsActive] = useState(false)
	const [secondsLeft, setSecondsLeft] = useState(0)

	// Detectar si el paso tiene un temporizador basado en palabras clave
	const hasTimer = step.toLowerCase().includes('minutos') || 
					step.toLowerCase().includes('minuto') ||
					step.toLowerCase().includes('cocinar') ||
					step.toLowerCase().includes('hervir') ||
					step.toLowerCase().includes('freír') ||
					step.toLowerCase().includes('horno')

	// Extraer tiempo del texto del paso
	const extractTimeFromStep = (stepText) => {
		const timeMatch = stepText.match(/(\d+)\s*(?:a\s*)?(?:minutos?|min)/i)
		if (timeMatch) {
			return parseInt(timeMatch[1]) * 60 // Convertir a segundos
		}
		return 0
	}

	// Inicializar el temporizador basado en el texto del paso
	useEffect(() => {
		if (hasTimer) {
			const timeInSeconds = extractTimeFromStep(step)
			setSecondsLeft(timeInSeconds)
		}
	}, [step, hasTimer])

	// Efecto para el temporizador
	useEffect(() => {
		let interval = null

		if (isActive && secondsLeft > 0) {
			interval = setInterval(() => {
				setSecondsLeft(prev => {
					if (prev <= 1) {
						setIsActive(false)
						// Notificación y efecto sonoro
						toast.success('¡Tiempo cumplido!', {
							duration: 4000,
							icon: '⏰',
						})
						// Reproducir sonido de notificación
						playNotificationSound()
						return 0
					}
					return prev - 1
				})
			}, 1000)
		}

		// Cleanup del intervalo
		return () => {
			if (interval) {
				clearInterval(interval)
			}
		}
	}, [isActive, secondsLeft])

	// Función para reproducir sonido de notificación
	const playNotificationSound = () => {
		try {
			// Crear un audio context para generar un beep
			const audioContext = new (window.AudioContext || window.webkitAudioContext)()
			const oscillator = audioContext.createOscillator()
			const gainNode = audioContext.createGain()

			oscillator.connect(gainNode)
			gainNode.connect(audioContext.destination)

			oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
			oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1)

			gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
			gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

			oscillator.start(audioContext.currentTime)
			oscillator.stop(audioContext.currentTime + 0.5)
		} catch (error) {
			console.log('No se pudo reproducir el sonido:', error)
		}
	}

	// Función para iniciar el temporizador
	const startTimer = () => {
		if (hasTimer && secondsLeft > 0) {
			setIsActive(true)
			toast.success('¡Temporizador iniciado!', {
				duration: 2000,
				icon: '⏱️',
			})
		}
	}

	// Función para pausar el temporizador
	const pauseTimer = () => {
		setIsActive(false)
		toast('Temporizador pausado', {
			duration: 2000,
			icon: '⏸️',
		})
	}

	// Función para resetear el temporizador
	const resetTimer = () => {
		setIsActive(false)
		const timeInSeconds = extractTimeFromStep(step)
		setSecondsLeft(timeInSeconds)
		toast('Temporizador reseteado', {
			duration: 2000,
			icon: '🔄',
		})
	}

	// Formatear tiempo en minutos y segundos
	const formatTime = (seconds) => {
		const mins = Math.floor(seconds / 60)
		const secs = seconds % 60
		return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
	}

	return (
		<motion.div
			whileHover={{ scale: 1.02 }}
			className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500"
		>
			<div className="flex items-start space-x-4">
				{/* Número del paso */}
				<div className="flex-shrink-0">
					<span className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
						{stepNumber}
					</span>
				</div>

				{/* Contenido del paso */}
				<div className="flex-1">
					{/* Checkbox y descripción */}
					<div className="flex items-start space-x-3 mb-4">
						<input
							type="checkbox"
							checked={isChecked}
							onChange={(e) => setIsChecked(e.target.checked)}
							className="mt-1 w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
						/>
						<p className={`text-gray-700 leading-relaxed ${isChecked ? 'line-through text-gray-500' : ''}`}>
							{step}
						</p>
					</div>

					{/* Temporizador */}
					{hasTimer && secondsLeft > 0 && (
						<div className="bg-gray-50 rounded-lg p-4">
							<div className="flex items-center justify-between mb-3">
								<span className="text-sm font-medium text-gray-700">⏱️ Temporizador</span>
								<span className={`text-lg font-bold ${isActive ? 'text-orange-600' : 'text-gray-600'}`}>
									{formatTime(secondsLeft)}
								</span>
							</div>
							
							<div className="flex space-x-2">
								{!isActive ? (
									<button
										onClick={startTimer}
										disabled={secondsLeft === 0}
										className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
									>
										▶️ Iniciar
									</button>
								) : (
									<button
										onClick={pauseTimer}
										className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-600 transition-colors"
									>
										⏸️ Pausar
									</button>
								)}
								
								<button
									onClick={resetTimer}
									className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors"
								>
									🔄 Resetear
								</button>
							</div>
						</div>
					)}

					{/* Progreso */}
					<div className="mt-4">
						<div className="flex items-center justify-between text-sm text-gray-500">
							<span>Progreso</span>
							<span>{stepNumber} de {totalSteps}</span>
						</div>
						<div className="w-full bg-gray-200 rounded-full h-2 mt-1">
							<motion.div
								className="bg-orange-500 h-2 rounded-full"
								initial={{ width: 0 }}
								animate={{ width: `${(stepNumber / totalSteps) * 100}%` }}
								transition={{ duration: 0.5 }}
							/>
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	)
}

export default Step 