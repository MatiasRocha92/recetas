import { motion } from 'framer-motion'
import Step from './Step'

const StepByStep = ({ steps }) => {
	return (
		<motion.div 
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6 }}
			className="space-y-6"
		>
			<h2 className="text-2xl font-bold text-gray-800 mb-6">Instrucciones Paso a Paso</h2>
			
			{steps.map((step, index) => (
				<motion.div
					key={index}
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.4, delay: index * 0.1 }}
				>
					<Step 
						step={step} 
						stepNumber={index + 1}
						totalSteps={steps.length}
					/>
				</motion.div>
			))}
		</motion.div>
	)
}

export default StepByStep 