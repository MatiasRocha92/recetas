import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from '../services/firebase'
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

// Lista de UIDs de administradores
const ADMIN_UIDS = [
	'zzp3JQtgqMMoT0GzGlMOFp2zH1S2', // Tu UID (con l minúscula)
	// Agregar más UIDs de administradores aquí si es necesario
]

// Componente proveedor del contexto
export const AuthProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		// Suscribirse a los cambios de autenticación
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (user) {
				// Asegurar documento de usuario para favoritos
				try {
					await ensureUserDocument(user)
				} catch (error) {
					console.error('Error al crear documento de usuario:', error)
				}
				
				// Notificar si es administrador
				const adminStatus = isAdmin(user)
				
				if (adminStatus) {
					toast.success('👑 ¡Bienvenido Administrador!', {
						duration: 2000,
						icon: '👑'
					})
				}
			}
			setCurrentUser(user)
			setLoading(false)
		})

		// Cleanup: desuscribirse cuando el componente se desmonte
		return unsubscribe
	}, [])

	// Función para verificar si el usuario es administrador
	const isAdmin = (user) => {
		if (!user || !user.uid) return false
		return ADMIN_UIDS.includes(user.uid)
	}

	// Función para asegurar que el usuario tenga documento en Firestore (solo para favoritos)
	const ensureUserDocument = async (user) => {
		try {
			const userDocRef = doc(db, 'users', user.uid)
			const userDoc = await getDoc(userDocRef)
			
			if (!userDoc.exists()) {
				// Crear documento del usuario si no existe
				await setDoc(userDocRef, {
					email: user.email,
					displayName: user.displayName || user.email?.split('@')[0] || 'Usuario',
					photoURL: user.photoURL || null,
					favorites: [],
					createdAt: new Date().toISOString()
				})
			}
		} catch (error) {
			console.error('Error al verificar/crear documento de usuario:', error)
		}
	}

	// Función para registrar usuario
	const signUp = async (email, password) => {
		try {
			const userCredential = await createUserWithEmailAndPassword(auth, email, password)
			
			// Crear documento del usuario en Firestore
			const userDocRef = doc(db, 'users', userCredential.user.uid)
			await setDoc(userDocRef, {
				email: userCredential.user.email,
				favorites: [],
				createdAt: new Date().toISOString()
			})
			
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

	// Función para autenticación con Google
	const signInWithGoogle = async () => {
		try {
			const provider = new GoogleAuthProvider()
			const result = await signInWithPopup(auth, provider)
			
			// Verificar si el usuario ya existe en Firestore
			const userDocRef = doc(db, 'users', result.user.uid)
			const userDoc = await getDoc(userDocRef)
			
			// Si el usuario no existe, crear su documento
			if (!userDoc.exists()) {
				await setDoc(userDocRef, {
					email: result.user.email,
					displayName: result.user.displayName,
					photoURL: result.user.photoURL,
					favorites: [],
					createdAt: new Date().toISOString()
				})
				toast.success('¡Cuenta creada exitosamente con Google!')
			} else {
				toast.success('¡Sesión iniciada exitosamente con Google!')
			}
			
			return result.user
		} catch (error) {
			let errorMessage = 'Error al autenticarse con Google'
			switch (error.code) {
				case 'auth/popup-closed-by-user':
					errorMessage = 'Se cerró la ventana de autenticación'
					break
				case 'auth/popup-blocked':
					errorMessage = 'El popup fue bloqueado. Permite popups para este sitio'
					break
				case 'auth/cancelled-popup-request':
					errorMessage = 'Operación cancelada'
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
		signInWithGoogle,
		signOut: signOutUser,
		isAdmin: currentUser ? isAdmin(currentUser) : false
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