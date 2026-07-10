import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { initializeIfNeeded } from './services/seed'
import { startOrderSimulation } from './services/simulation'
import './services/debug'

// Seed localStorage with demo data on first visit
initializeIfNeeded()

// Start background order status simulation
startOrderSimulation()

const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
