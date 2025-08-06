import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore'
import { db } from '../services/firebase'
import toast from 'react-hot-toast'

const RecipeRating = ({ recipe, onUpdate }) => {
	const { currentUser } = useAuth()
	const [isLiked, setIsLiked] = useState(false)
	const [likesCount, setLikesCount] = useState(recipe.likes || 0)
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if (currentUser && recipe.likedBy) {
			setIsLiked(recipe.likedBy.includes(currentUser.uid))
		}
		setLikesCount(recipe.likes || 0)
	}, [recipe, currentUser])

	const getMedal = (likes) => {
		if (likes >= 100) return { emoji: '🏆', text: 'Leyenda' }
		if (likes >= 50) return { emoji: '🥇', text: 'Oro' }
		if (likes >= 25) return { emoji: '🥈', text: 'Plata' }
		if (likes >= 10) return { emoji: '🥉', text: 'Bronce' }
		if (likes >= 5) return { emoji: '⭐', text: 'Popular' }
		return null
	}

	const handleLike = async () => {
		if (!currentUser) {
			toast.error('Debes iniciar sesión para dar like')
			return
		}

		setLoading(true)
		try {
			const recipeRef = doc(db, 'recipes', recipe.id)
			
			if (isLiked) {
				// Quitar like
				await updateDoc(recipeRef, {
					likes: likesCount - 1,
					likedBy: arrayRemove(currentUser.uid)
				})
				setLikesCount(likesCount - 1)
				setIsLiked(false)
				toast.success('Like removido')
			} else {
				// Agregar like
				await updateDoc(recipeRef, {
					likes: likesCount + 1,
					likedBy: arrayUnion(currentUser.uid)
				})
				setLikesCount(likesCount + 1)
				setIsLiked(true)
				toast.success('¡Receta marcada como favorita!')
			}

			// Actualizar el componente padre
			if (onUpdate) {
				onUpdate()
			}
		} catch (error) {
			console.error('Error al actualizar like:', error)
			toast.error('Error al actualizar like')
		} finally {
			setLoading(false)
		}
	}

	const medal = getMedal(likesCount)

	return (
		<div className="flex items-center space-x-4">
			{/* Botón de like */}
			<button
				onClick={handleLike}
				disabled={loading}
				className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
					isLiked
						? 'bg-red-100 text-red-600 hover:bg-red-200'
						: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
				}`}
			>
				<span className="text-lg">
					{isLiked ? '❤️' : '🤍'}
				</span>
				<span className="font-medium">{likesCount}</span>
			</button>

			{/* Medalla */}
			{medal && (
				<div className="flex items-center space-x-2 px-3 py-2 bg-yellow-100 text-yellow-700 rounded-md">
					<span className="text-lg">{medal.emoji}</span>
					<span className="text-sm font-medium">{medal.text}</span>
				</div>
			)}

			{/* Información adicional */}
			{recipe.author && (
				<div className="text-sm text-gray-500">
					por {recipe.author.displayName}
				</div>
			)}
		</div>
	)
}

export default RecipeRating 