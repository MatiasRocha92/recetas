/**
 * 🍳 Sazonea - Punto de Entrada Principal
 * Copyright (c) 2024 Matias Rocha
 * https://github.com/MatiasRocha92/recetas
 * Licencia MIT - Ver LICENSE para más detalles
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
