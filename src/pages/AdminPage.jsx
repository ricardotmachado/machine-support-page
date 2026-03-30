import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN

// ── Auth ──────────────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }) {
  const [token, setToken] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (token === ADMIN_TOKEN) { onLogin(); setError('') }
    else setError('Token inválido.')
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-slate-800 rounded-2xl p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-8">
          <img src="/wac-logo.png" alt="WAC" className="w-10 h-10 rounded-xl object-cover" />
          <div>
            <p className="text-white font-bold text-sm">WAC Backoffice</p>
            <p className="text-slate-400 text-xs">Gestão de Máquinas</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 font-semibold mb-1.5 uppercase tracking-wider">Token de Acesso</label>
            <input
              type="password"
              value={token}
              onChange={e => setToken(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg text-sm transition-colors">
            Entrar
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Machine Form ───────────────────────────────────────────────────────────────

const EMPTY_MACHINE = { name: '', brand: '', model: '', serial: '', year: '', client: '', location: '', technician: '', status: 'operational', install_date: '', notes: '' }

function MachineForm({ initial = EMPTY_MACHINE, onSave, onCancel, loading }) {
  const [form, setForm] = useState(initial)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form) }} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { key: 'name', label: 'Nome *', placeholder: 'Ex: Costa Levigatrici B71' },
          { key: 'brand', label: 'Marca', placeholder: 'Ex: Costa Levigatrici' },
          { key: 'model', label: 'Modelo', placeholder: 'Ex: B71RRFF1350' },
          { key: 'serial', label: 'Nº de Série', placeholder: 'Ex: LCOB2004A' },
          { key: 'year', label: 'Ano', placeholder: 'Ex: 2021' },
          { key: 'client', label: 'Cliente', placeholder: 'Ex: Euromolding' },
          { key: 'location', label: 'Localização', placeholder: 'Ex: Ourém' },
          { key: 'technician', label: 'Técnico', placeholder: 'Ex: Rui Freitas' },
          { key: 'install_date', label: 'Data Instalação', placeholder: '', type: 'date' },
        ].map(({ key, label, placeholder, type = 'text' }) => (
          <div key={key}>
            <label className="block text-xs font-semibold text-slate-600 mb-1">{label}</label>
            <input
              type={type}
              value={form[key]}
              onChange={e => set(key, e.target.value)}
              placeholder={placeholder}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
            />
          </div>
        ))}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Estado</label>
          <select value={form.status} onChange={e => set('status', e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400">
            <option value="operational">Operacional</option>
            <option value="maintenance">Em Manutenção</option>
            <option value="inactive">Inativo</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1">Notas</label>
        <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={2}
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 resize-none" />
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading || !form.name}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-colors">
          {loading ? 'A guardar…' : 'Guardar'}
        </button>
        <button type="button" onClick={onCancel} className="border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors">
          Cancelar
        </button>
      </div>
    </form>
  )
}

// ── Sticker Assignment Modal ───────────────────────────────────────────────────

function AssignStickerModal({ machine, onClose, onAssigned }) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleAssign(e) {
    e.preventDefault()
    if (!code.trim()) return
    setLoading(true); setError('')
    const res = await fetch('/api/stickers/assign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': ADMIN_TOKEN },
      body: JSON.stringify({ sticker_code: code.trim(), machine_id: machine.id, assigned_by: 'admin' }),
    })
    if (res.ok) { onAssigned(code.trim()); onClose() }
    else { setError('Erro ao associar sticker. Tente novamente.') }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
        <h3 className="font-bold text-slate-900 mb-1">Associar Sticker QR</h3>
        <p className="text-xs text-slate-500 mb-4">Máquina: <span className="font-semibold">{machine.name}</span></p>
        <form onSubmit={handleAssign} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Código do Sticker</label>
            <input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="Ex: 001 ou A42"
              autoFocus
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-blue-400"
            />
            <p className="text-xs text-slate-400 mt-1">Introduza o número impresso no sticker físico.</p>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
          <div className="flex gap-2 pt-1">
            <button type="submit" disabled={loading || !code.trim()}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-2.5 rounded-lg text-sm transition-colors">
              {loading ? 'A associar…' : 'Associar'}
            </button>
            <button type="button" onClick={onClose} className="flex-1 border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold py-2.5 rounded-lg text-sm transition-colors">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Status badge ──────────────────────────────────────────────────────────────

function StatusPill({ status }) {
  const map = {
    operational: 'bg-emerald-100 text-emerald-700',
    maintenance:  'bg-amber-100 text-amber-700',
    inactive:     'bg-slate-100 text-slate-500',
  }
  const label = { operational: 'Operacional', maintenance: 'Manutenção', inactive: 'Inativo' }
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${map[status] ?? map.inactive}`}>
      {label[status] ?? status}
    </span>
  )
}

// ── Main Admin Page ───────────────────────────────────────────────────────────

export default function AdminPage() {
  const [authed, setAuthed] = useState(!!sessionStorage.getItem('wac-admin'))
  const [machines, setMachines] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('list') // list | create | edit
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [assigning, setAssigning] = useState(null) // machine being sticker-assigned

  function login() { sessionStorage.setItem('wac-admin', '1'); setAuthed(true) }
  function logout() { sessionStorage.removeItem('wac-admin'); setAuthed(false) }

  async function loadMachines() {
    setLoading(true)
    const res = await fetch('/api/machines', { headers: { 'x-admin-token': ADMIN_TOKEN } })
    if (res.ok) setMachines(await res.json())
    setLoading(false)
  }

  useEffect(() => { if (authed) loadMachines() }, [authed])

  async function handleCreate(form) {
    setSaving(true)
    const res = await fetch('/api/machines/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': ADMIN_TOKEN },
      body: JSON.stringify(form),
    })
    if (res.ok) { await loadMachines(); setView('list') }
    setSaving(false)
  }

  async function handleUpdate(form) {
    setSaving(true)
    const res = await fetch(`/api/machines/update/${editing.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': ADMIN_TOKEN },
      body: JSON.stringify(form),
    })
    if (res.ok) { await loadMachines(); setView('list'); setEditing(null) }
    setSaving(false)
  }

  if (!authed) return <LoginScreen onLogin={login} />

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/wac-logo.png" alt="WAC" className="w-8 h-8 rounded-lg object-cover" />
          <div>
            <p className="text-sm font-bold leading-tight">WAC Backoffice</p>
            <p className="text-slate-400 text-xs">Gestão de Máquinas</p>
          </div>
        </div>
        <button onClick={logout} className="text-slate-400 hover:text-white text-xs transition-colors">Sair</button>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* List view */}
        {view === 'list' && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl font-bold text-slate-900">Máquinas</h1>
              <button onClick={() => setView('create')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors">
                + Nova Máquina
              </button>
            </div>

            {loading ? (
              <p className="text-slate-400 text-sm text-center py-12">A carregar…</p>
            ) : machines.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-slate-500 text-sm mb-2">Nenhuma máquina registada.</p>
                <button onClick={() => setView('create')} className="text-blue-600 text-sm font-semibold hover:underline">
                  Criar a primeira máquina
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {machines.map(m => {
                  const sticker = m.sticker_assignments?.[0]?.sticker_code
                  return (
                    <div key={m.id} className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-4 shadow-sm">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-slate-900 text-sm truncate">{m.name}</p>
                          <StatusPill status={m.status} />
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          {m.client && <span>{m.client}</span>}
                          {m.location && <span>· {m.location}</span>}
                          {sticker
                            ? <span className="font-mono text-blue-500">· QR: {sticker}</span>
                            : <span className="text-amber-500">· Sem sticker</span>
                          }
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button onClick={() => setAssigning(m)}
                          className="text-xs border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold px-3 py-1.5 rounded-lg transition-colors">
                          {sticker ? 'Reatribuir QR' : 'Atribuir QR'}
                        </button>
                        <button onClick={() => { setEditing(m); setView('edit') }}
                          className="text-xs bg-slate-900 hover:bg-slate-700 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors">
                          Editar
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}

        {/* Create view */}
        {view === 'create' && (
          <>
            <div className="flex items-center gap-3 mb-6">
              <button onClick={() => setView('list')} className="text-slate-400 hover:text-slate-700 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-xl font-bold text-slate-900">Nova Máquina</h1>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <MachineForm onSave={handleCreate} onCancel={() => setView('list')} loading={saving} />
            </div>
          </>
        )}

        {/* Edit view */}
        {view === 'edit' && editing && (
          <>
            <div className="flex items-center gap-3 mb-6">
              <button onClick={() => { setView('list'); setEditing(null) }} className="text-slate-400 hover:text-slate-700 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-xl font-bold text-slate-900">Editar — {editing.name}</h1>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <MachineForm initial={editing} onSave={handleUpdate} onCancel={() => { setView('list'); setEditing(null) }} loading={saving} />
            </div>
          </>
        )}
      </div>

      {/* Sticker assignment modal */}
      {assigning && (
        <AssignStickerModal
          machine={assigning}
          onClose={() => setAssigning(null)}
          onAssigned={() => loadMachines()}
        />
      )}
    </div>
  )
}
