import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initErrorSuppressor } from './utils/errorSuppressor'

// Initialize error suppressor to filter browser extension errors
if (import.meta.env.DEV) {
  initErrorSuppressor();
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

