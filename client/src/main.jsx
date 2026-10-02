import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { Toaster } from 'react-hot-toast'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#ffffff',
              color: '#0f172a',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '14px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.08)'
            },
            success: { iconTheme: { primary: '#059669', secondary: '#ffffff' } },
            error: { iconTheme: { primary: '#dc2626', secondary: '#ffffff' } }
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
