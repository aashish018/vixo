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
            background: 'rgba(9, 17, 31, 0.92)',
            color: '#f6fbff',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '18px',
            fontFamily: 'Space Grotesk, sans-serif',
            backdropFilter: 'blur(18px)',
          },
          success: { iconTheme: { primary: '#73e6ff', secondary: '#071019' } },
          error: { iconTheme: { primary: '#ff8a65', secondary: '#071019' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
)
