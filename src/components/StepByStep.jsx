import { motion } from 'framer-motion'
import Step from './Step'

const StepByStep = ({ steps = [], instructions = [] }) => {
	// Usar steps o instructions, cualquiera que esté disponible
	const stepsToRender = steps.length > 0 ? steps : instructions

	if (!Array.isArray(stepsToRender) || stepsToRender.length === 0) {
		return (
			<div className="text-gray-500 italic">
				No se especificaron instrucciones para esta receta.
			</div>
		)
	}

	// Filtrar elementos vacíos o undefined
	const validSteps = stepsToRender.filter(step => step && typeof step === 'string' && step.trim() !== '')

	if (validSteps.length === 0) {
		return (
			<div className="text-gray-500 italic">
				No se especificaron instrucciones válidas para esta receta.
			</div>
		)
	}

	return (
		<motion.div 
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6 }}
			className="space-y-6"
		>
			{validSteps.map((step, index) => (
				<motion.div
					key={index}
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.4, delay: index * 0.1 }}
				>
					<Step 
						step={step} 
						stepNumber={index + 1}
						totalSteps={validSteps.length}
					/>
				</motion.div>
			))}
		</motion.div>
	)
}

export default StepByStep 