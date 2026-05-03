import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './assets/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1e1e28',
            color: '#f0f0f8',
            border: '1px solid #2a2a38',
            borderRadius: '10px',
            fontFamily: 'DM Sans, sans-serif',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#0a0a0f' } },
          error:   { iconTheme: { primary: '#f43f5e', secondary: '#0a0a0f' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
)
