import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import HomePage from './pages/HomePage'
import RecipesPage from './pages/RecipesPage'
import RecipeDetailPage from './pages/RecipeDetailPage'
import FavoritesPage from './pages/FavoritesPage'

function App() {
	return (
		<BrowserRouter>
			<div className="min-h-screen flex flex-col">
				<Navbar />
				
				<main className="flex-1">
					<Routes>
						<Route path="/" element={<HomePage />} />
						<Route path="/recipes" element={<RecipesPage />} />
						<Route path="/recipe/:id" element={<RecipeDetailPage />} />
						<Route path="/favorites" element={<FavoritesPage />} />
					</Routes>
				</main>
				
				<Footer />
			</div>
			
			<Toaster 
				position="top-right"
				toastOptions={{
					duration: 4000,
					style: {
						background: '#363636',
						color: '#fff',
					},
					success: {
						duration: 3000,
						theme: {
							primary: '#f97316',
							secondary: '#fff',
						},
					},
				}}
			/>
		</BrowserRouter>
	)
}

export default App
