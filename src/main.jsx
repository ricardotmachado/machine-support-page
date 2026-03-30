import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import StickerPage from './StickerPage.jsx'
import AdminPage from './pages/AdminPage.jsx'

function Root() {
  const path = window.location.pathname
  const hash = window.location.hash

  // /admin → backoffice
  if (path === '/admin' || path.startsWith('/admin/')) {
    return <AdminPage />
  }

  // /#sticker → sticker generator
  if (hash === '#sticker') {
    return <StickerPage onBack={() => { window.location.hash = ''; window.location.reload() }} />
  }

  // /machine/:stickerId → dynamic machine page
  const machineMatch = path.match(/^\/machine\/(.+)$/)
  if (machineMatch) {
    return <App stickerId={machineMatch[1]} />
  }

  // / → redirect to admin (no public homepage without a sticker)
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="text-center">
        <img src="/wac-logo.png" alt="WAC" className="w-16 h-16 rounded-2xl object-cover mx-auto mb-4 shadow-md" />
        <p className="text-slate-500 text-sm">Digitalize o código QR da máquina para continuar.</p>
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
