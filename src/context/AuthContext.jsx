import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from '../services/firebase'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

// Crear el contexto
const AuthContext = createContext({})

// Hook personalizado para usar el contexto
export const useAuth = () => {
	const context = useContext(AuthContext)
	if (!context) {
		throw new Error('useAuth debe ser usado dentro de un AuthProvider')
	}
	return context
}

// Componente proveedor del contexto
export const AuthProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		// Suscribirse a los cambios de autenticación
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setCurrentUser(user)
			setLoading(false)
		})

		// Cleanup: desuscribirse cuando el componente se desmonte
		return unsubscribe
	}, [])

	// Función para registrar usuario
	const signUp = async (email, password) => {
		try {
			const userCredential = await createUserWithEmailAndPassword(auth, email, password)
			toast.success('¡Cuenta creada exitosamente!')
			return userCredential.user
		} catch (error) {
			let errorMessage = 'Error al crear la cuenta'
			switch (error.code) {
				case 'auth/email-already-in-use':
					errorMessage = 'El email ya está registrado'
					break
				case 'auth/weak-password':
					errorMessage = 'La contraseña debe tener al menos 6 caracteres'
					break
				case 'auth/invalid-email':
					errorMessage = 'Email inválido'
					break
				default:
					errorMessage = error.message
			}
			toast.error(errorMessage)
			throw error
		}
	}

	// Función para iniciar sesión
	const signIn = async (email, password) => {
		try {
			const userCredential = await signInWithEmailAndPassword(auth, email, password)
			toast.success('¡Sesión iniciada exitosamente!')
			return userCredential.user
		} catch (error) {
			let errorMessage = 'Error al iniciar sesión'
			switch (error.code) {
				case 'auth/user-not-found':
					errorMessage = 'Usuario no encontrado'
					break
				case 'auth/wrong-password':
					errorMessage = 'Contraseña incorrecta'
					break
				case 'auth/invalid-email':
					errorMessage = 'Email inválido'
					break
				default:
					errorMessage = error.message
			}
			toast.error(errorMessage)
			throw error
		}
	}

	// Función para cerrar sesión
	const signOutUser = async () => {
		try {
			await signOut(auth)
			toast.success('Sesión cerrada exitosamente')
		} catch (error) {
			toast.error('Error al cerrar sesión')
			throw error
		}
	}

	// Valor del contexto
	const value = {
		currentUser,
		loading,
		signUp,
		signIn,
		signOut: signOutUser
	}

	// Mostrar spinner mientras se verifica la autenticación
	if (loading) {
		return <LoadingSpinner message="Verificando autenticación..." />
	}

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	)
} 