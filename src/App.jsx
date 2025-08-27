/**
 * 🍳 Sazonea - Aplicación de Recetas Argentinas
 * Copyright (c) 2024 Matias Rocha
 * https://github.com/MatiasRocha92/recetas
 * Licencia MIT - Ver LICENSE para más detalles
 */

import React, { Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import LoadingSpinner from './components/LoadingSpinner'
import DebugInfo from './components/DebugInfo'

// Lazy loading para todas las páginas
const HomePage = React.lazy(() => import('./pages/HomePage'))
const RecipesPage = React.lazy(() => import('./pages/RecipesPage'))
const RecipeDetailPage = React.lazy(() => import('./pages/RecipeDetailPage'))
const FavoritesPage = React.lazy(() => import('./pages/FavoritesPage'))
const LoginPage = React.lazy(() => import('./pages/LoginPage'))
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'))
const AdminPage = React.lazy(() => import('./pages/AdminPage'))

function App() {
	return (
		<AuthProvider>
			<BrowserRouter>
				<div className="min-h-screen flex flex-col">
					<Navbar />
					<main className="flex-1">
						<Suspense fallback={<LoadingSpinner />}>
							<Routes>
								<Route path="/" element={<HomePage />} />
								<Route path="/recipes" element={<RecipesPage />} />
								<Route path="/recipe/:id" element={<RecipeDetailPage />} />
								<Route path="/favorites" element={
									<ProtectedRoute>
										<FavoritesPage />
									</ProtectedRoute>
								} />
								<Route path="/admin" element={
									<ProtectedRoute>
										<AdminPage />
									</ProtectedRoute>
								} />
								<Route path="/login" element={<LoginPage />} />
								<Route path="/register" element={<RegisterPage />} />
							</Routes>
						</Suspense>
					</main>
					<Footer />
				</div>
				<Toaster
					position="top-right"
					toastOptions={{
						duration: 4000,
						style: { background: '#363636', color: '#fff' },
						success: { duration: 3000, theme: { primary: '#f97316', secondary: '#fff' } },
					}}
				/>
				<DebugInfo />
			</BrowserRouter>
		</AuthProvider>
	)
}

export default App
