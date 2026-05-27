import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// 1. Import library Google OAuth yang sudah diinstall tadi
import { GoogleOAuthProvider } from '@react-oauth/google'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 2. Bungkus App dengan GoogleOAuthProvider dan masukkan Client ID kamu */}
    <GoogleOAuthProvider clientId="666018414846-v86923a912h55a9nqlg1k3c9hkqrvmho.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)