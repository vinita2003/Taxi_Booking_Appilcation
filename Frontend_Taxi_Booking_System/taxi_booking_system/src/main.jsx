import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AuthProvider from './context/AuthContext.jsx'
import { SocketProvider } from './context/SocketContext.jsx'

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <SocketProvider>
  <BrowserRouter>
    <App/>
  </BrowserRouter>,
  </SocketProvider>
  </AuthProvider>

)
