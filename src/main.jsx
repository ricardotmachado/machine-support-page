import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import StickerPage from './StickerPage.jsx'

function Root() {
  const [view, setView] = useState(
    window.location.hash === '#sticker' ? 'sticker' : 'app'
  )

  if (view === 'sticker') {
    return <StickerPage onBack={() => { window.location.hash = ''; setView('app') }} />
  }

  return (
    <div>
      <App />
      {/* Admin link — hidden in production, visible for internal use */}
      <div className="fixed bottom-4 right-4 no-print">
        <button
          onClick={() => { window.location.hash = 'sticker'; setView('sticker') }}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-lg transition-colors opacity-60 hover:opacity-100"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          Etiquetas
        </button>
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
