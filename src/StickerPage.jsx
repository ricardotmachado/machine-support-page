import { useState } from 'react'
import { Sticker } from './Sticker'

const DEMO_MACHINES = [
  {
    id: 'ERM-2021-001',
    name: 'Costa Levigatrici B71RRFF1350',
    model: 'B71RRFF1350',
    serial: 'LCOB2004A',
    location: 'Ourém',
  },
  {
    id: 'MCH-2024-0017',
    name: 'CNC Lathe TL-800',
    model: 'TL-800 Industrial',
    serial: 'SN-44019-A',
    location: 'Linha A — Armazém 1',
  },
  {
    id: 'MCH-2024-0091',
    name: 'Compressor Atlas CP-3',
    model: 'CP-3 Heavy',
    serial: 'SN-20817-C',
    location: 'Sala de Utilidades',
  },
]

export default function StickerPage({ onBack }) {
  const [selected, setSelected] = useState(DEMO_MACHINES[0].id)
  const [baseUrl, setBaseUrl] = useState('https://thankful-field-0ed015510.4.azurestaticapps.net')
  const machine = DEMO_MACHINES.find(m => m.id === selected)

  return (
    <div className="min-h-screen bg-slate-100">

      {/* ── Top bar ── */}
      <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <img src="/wac-logo.png" alt="WAC" className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
          <div>
            <h1 className="text-sm font-bold leading-tight">Gerador de Etiquetas</h1>
            <p className="text-slate-400 text-xs">WAC - Equipamentos Industriais</p>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Imprimir / Exportar PDF
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-5 py-8 flex flex-col lg:flex-row gap-8">

        {/* ── Controls ── */}
        <div className="lg:w-72 flex-shrink-0 space-y-5 no-print">

          {/* Machine selector */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-3">Selecionar Máquina</p>
            <div className="space-y-2">
              {DEMO_MACHINES.map(m => (
                <button
                  key={m.id}
                  onClick={() => setSelected(m.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg border text-sm transition-all ${
                    selected === m.id
                      ? 'border-blue-400 bg-blue-50 text-blue-800'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="font-semibold text-xs truncate">{m.name}</div>
                  <div className="text-xs opacity-60 font-mono mt-0.5">{m.id}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Base URL */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-3">URL de Base</p>
            <input
              type="text"
              value={baseUrl}
              onChange={e => setBaseUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-mono text-slate-700 bg-slate-50 focus:outline-none focus:border-blue-400 focus:bg-white"
            />
            <p className="text-xs text-slate-400 mt-2">
              URL final: <span className="font-mono text-slate-600">/machine/{machine?.id}</span>
            </p>
          </div>

          {/* Print tip */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex gap-2">
              <svg className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="text-xs font-semibold text-amber-800 mb-1">Sugestões de impressão</p>
                <ul className="text-xs text-amber-700 space-y-1">
                  <li>· Papel autocolante plastificado</li>
                  <li>· Impressão em alta resolução</li>
                  <li>· Laminado para ambientes industriais</li>
                  <li>· Dimensão: 85mm × 55mm</li>
                </ul>
              </div>
            </div>
          </div>

        </div>

        {/* ── Preview ── */}
        <div className="flex-1">
          <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-4 no-print">
            Pré-visualização — Escala real (85mm × 55mm)
          </p>

          {/* Single sticker preview */}
          <div className="print-area mb-8">
            <div className="bg-white rounded-2xl border border-slate-200 p-8 flex items-center justify-center shadow-sm">
              <Sticker machine={machine} baseUrl={baseUrl} />
            </div>
          </div>

          {/* Print sheet — 6 stickers per A4 page */}
          <div className="no-print">
            <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-4">
              Folha para impressão (6 etiquetas / A4)
            </p>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div
                className="grid gap-4"
                style={{ gridTemplateColumns: 'repeat(2, max-content)', justifyContent: 'center' }}
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} style={{ transform: 'scale(0.82)', transformOrigin: 'top left' }}>
                    <Sticker machine={machine} baseUrl={baseUrl} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ── Print styles injected via style tag ── */}
      <style>{`
        @media print {
          body { background: white !important; margin: 0; }
          .no-print { display: none !important; }
          .print-area {
            position: fixed;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: white;
          }
          .print-area > div {
            border: none !important;
            box-shadow: none !important;
            background: transparent !important;
          }
        }
      `}</style>
    </div>
  )
}
