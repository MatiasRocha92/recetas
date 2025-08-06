import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import HomePage from './pages/HomePage'
import RecipesPage from './pages/RecipesPage'
import RecipeDetailPage from './pages/RecipeDetailPage'
import FavoritesPage from './pages/FavoritesPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AdminPage from './pages/AdminPage'
import CreateRecipePage from './pages/CreateRecipePage'

function App() {
	return (
		<AuthProvider>
			<BrowserRouter>
				<div className="min-h-screen flex flex-col">
					<Navbar />
					<main className="flex-1">
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
							<Route path="/create-recipe" element={
								<ProtectedRoute>
									<CreateRecipePage />
								</ProtectedRoute>
							} />
							<Route path="/login" element={<LoginPage />} />
							<Route path="/register" element={<RegisterPage />} />
						</Routes>
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
			</BrowserRouter>
		</AuthProvider>
	)
}

export default App
