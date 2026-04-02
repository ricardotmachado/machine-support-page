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

// ── Occurrence Detail ────────────────────────────────────────────────────────

function OccurrenceDetail({ occurrence: o, onBack, onDelete, onStatusChange, updatingStatus, deleting }) {
  const [notes, setNotes] = useState(o.notes ?? '')
  const [status, setStatus] = useState(o.status)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const urgencyStyle = {
    urgent: { dot: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50 border-red-200', label: 'Urgente' },
    medium: { dot: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', label: 'Média' },
    low:    { dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', label: 'Baixa' },
  }[o.urgency] ?? { dot: 'bg-slate-400', text: 'text-slate-600', bg: 'bg-slate-50 border-slate-200', label: o.urgency }

  return (
    <div>
      {/* Back */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="text-slate-400 hover:text-slate-700 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <p className="text-xs text-slate-400 font-mono">{o.ref_code}</p>
          <h1 className="text-xl font-bold text-slate-900 leading-tight">{o.issue_type}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Left — details */}
        <div className="md:col-span-2 space-y-4">
          {/* Info card */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Detalhes</h2>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Operador', value: o.operator_name },
                { label: 'Máquina', value: o.machines?.name ?? o.sticker_code ?? '—' },
                { label: 'Urgência', value: (
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${urgencyStyle.bg} ${urgencyStyle.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${urgencyStyle.dot}`} />
                    {urgencyStyle.label}
                  </span>
                )},
                { label: 'Data', value: new Date(o.created_at).toLocaleString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1">{label}</p>
                  <div className="text-sm font-medium text-slate-800">{value}</div>
                </div>
              ))}
            </div>

            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-2">Descrição</p>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{o.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right — status update */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Estado</h2>
            <div className="space-y-2 mb-4">
              {[
                { key: 'open',        label: 'Aberta',       cls: 'border-red-300 text-red-700 bg-red-50',         activeCls: 'ring-2 ring-red-400' },
                { key: 'in_progress', label: 'Em Progresso', cls: 'border-blue-300 text-blue-700 bg-blue-50',       activeCls: 'ring-2 ring-blue-400' },
                { key: 'resolved',    label: 'Resolvida',    cls: 'border-emerald-300 text-emerald-700 bg-emerald-50', activeCls: 'ring-2 ring-emerald-400' },
              ].map(s => (
                <button key={s.key} onClick={() => setStatus(s.key)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl border font-semibold text-sm transition-all ${s.cls} ${status === s.key ? s.activeCls : 'opacity-60 hover:opacity-100'}`}>
                  {s.label}
                </button>
              ))}
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Notas internas</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
                placeholder="Adicione notas sobre a resolução…"
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400 resize-none" />
            </div>

            <button
              onClick={() => onStatusChange(o.id, status, notes)}
              disabled={updatingStatus || (status === o.status && notes === (o.notes ?? ''))}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-xl text-sm transition-colors">
              {updatingStatus ? 'A guardar…' : 'Guardar alterações'}
            </button>
          </div>

          {/* Delete zone */}
          <div className="bg-white rounded-2xl border border-red-100 p-4 shadow-sm">
            <h2 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-3">Zona de perigo</h2>
            {confirmDelete ? (
              <div>
                <p className="text-xs text-slate-600 mb-3">Esta ação é irreversível. Confirma que pretende eliminar esta ocorrência?</p>
                <div className="flex gap-2">
                  <button onClick={() => onDelete(o.id)} disabled={deleting}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-2 rounded-xl text-sm transition-colors">
                    {deleting ? 'A eliminar…' : 'Eliminar'}
                  </button>
                  <button onClick={() => setConfirmDelete(false)}
                    className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold py-2 rounded-xl text-sm transition-colors">
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => setConfirmDelete(true)}
                className="w-full flex items-center justify-center gap-2 border border-red-200 hover:bg-red-50 text-red-500 font-semibold py-2 rounded-xl text-sm transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Eliminar ocorrência
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main Admin Page ───────────────────────────────────────────────────────────

export default function AdminPage() {
  const [authed, setAuthed] = useState(!!sessionStorage.getItem('wac-admin'))
  const [tab, setTab] = useState('machines') // machines | occurrences

  // ── Machines state ──
  const [machines, setMachines] = useState([])
  const [machinesLoading, setMachinesLoading] = useState(true)
  const [machineSearch, setMachineSearch] = useState('')
  const [view, setView] = useState('list') // list | create | edit
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [assigning, setAssigning] = useState(null)
  const [deletingMachine, setDeletingMachine] = useState(null) // machine id awaiting confirmation
  const [deleting, setDeleting] = useState(false)

  // ── Occurrences state ──
  const [occurrences, setOccurrences] = useState([])
  const [occLoading, setOccLoading] = useState(true)
  const [occFilter, setOccFilter] = useState('all') // all | open | in_progress | resolved
  const [occDetail, setOccDetail] = useState(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  const [toast, setToast] = useState(null)

  function login() { sessionStorage.setItem('wac-admin', '1'); setAuthed(true) }
  function logout() {
    if (!window.confirm('Tem a certeza que deseja sair?')) return
    sessionStorage.removeItem('wac-admin'); setAuthed(false)
  }

  async function loadMachines() {
    setMachinesLoading(true)
    const res = await fetch('/api/machines', { headers: { 'x-admin-token': ADMIN_TOKEN } })
    if (res.ok) setMachines(await res.json())
    setMachinesLoading(false)
  }

  async function loadOccurrences() {
    setOccLoading(true)
    const res = await fetch('/api/occurrences', { headers: { 'x-admin-token': ADMIN_TOKEN } })
    if (res.ok) setOccurrences(await res.json())
    setOccLoading(false)
  }

  useEffect(() => {
    if (!authed) return
    loadMachines()
    loadOccurrences()
  }, [authed])

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  async function handleCreate(form) {
    setSaving(true)
    const res = await fetch('/api/machines/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': ADMIN_TOKEN },
      body: JSON.stringify(form),
    })
    if (res.ok) { await loadMachines(); setView('list'); showToast('✓ Máquina criada com sucesso!') }
    else showToast('Erro ao criar máquina.')
    setSaving(false)
  }

  async function handleDeleteMachine(id) {
    setDeleting(true)
    const res = await fetch(`/api/machines/delete/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-token': ADMIN_TOKEN },
    })
    if (res.ok) {
      setMachines(prev => prev.filter(m => m.id !== id))
      setDeletingMachine(null)
      showToast('✓ Máquina eliminada.')
    } else showToast('Erro ao eliminar máquina.')
    setDeleting(false)
  }

  async function handleDeleteOccurrence(id) {
    setDeleting(true)
    const res = await fetch(`/api/occurrences/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-token': ADMIN_TOKEN },
    })
    if (res.ok) {
      setOccurrences(prev => prev.filter(o => o.id !== id))
      setOccDetail(null)
      showToast('✓ Ocorrência eliminada.')
    } else showToast('Erro ao eliminar ocorrência.')
    setDeleting(false)
  }

  async function handleUpdate(form) {
    setSaving(true)
    const res = await fetch(`/api/machines/update/${editing.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': ADMIN_TOKEN },
      body: JSON.stringify(form),
    })
    if (res.ok) { await loadMachines(); setView('list'); setEditing(null); showToast('✓ Alterações guardadas!') }
    else showToast('Erro ao guardar alterações.')
    setSaving(false)
  }

  if (!authed) return <LoginScreen onLogin={login} />

  const filteredOccurrences = occurrences.filter(o => occFilter === 'all' || o.status === occFilter)

  const q = machineSearch.trim().toLowerCase()
  const filteredMachines = q
    ? machines.filter(m =>
        m.client?.toLowerCase().includes(q) ||
        m.name?.toLowerCase().includes(q) ||
        m.location?.toLowerCase().includes(q)
      )
    : machines

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white text-sm font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-fade-in">
          <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          {toast}
        </div>
      )}
      {/* Header */}
      <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/wac-logo.png" alt="WAC" className="w-8 h-8 rounded-lg object-cover" />
          <div>
            <p className="text-sm font-bold leading-tight">WAC Backoffice</p>
            <p className="text-slate-400 text-xs">Gestão de Máquinas</p>
          </div>
        </div>
        <button onClick={logout} className="flex items-center gap-1.5 text-slate-400 hover:text-white text-xs transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sair
        </button>
      </div>

      {/* Tab nav */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 flex gap-1">
          {[
            { key: 'machines', label: 'Máquinas', count: machines.length,
              icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" /></svg> },
            { key: 'occurrences', label: 'Ocorrências', count: occurrences.filter(o => o.status === 'open').length,
              countLabel: 'abertas',
              icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg> },
          ].map(t => (
            <button key={t.key} onClick={() => { setTab(t.key); setView('list') }}
              className={`flex items-center gap-2 px-4 py-3.5 text-sm font-semibold border-b-2 transition-colors ${
                tab === t.key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}>
              {t.icon}
              {t.label}
              {t.count > 0 && (
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                  tab === t.key ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
                }`}>{t.count}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* ── MACHINES TAB ─────────────────────────────────────────── */}
        {tab === 'machines' && view === 'list' && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold text-slate-900">Máquinas</h1>
              <button onClick={() => setView('create')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors">
                + Nova Máquina
              </button>
            </div>

            {!machinesLoading && machines.length > 0 && (
              <div className="relative mb-5">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                </svg>
                <input
                  type="text"
                  value={machineSearch}
                  onChange={e => setMachineSearch(e.target.value)}
                  placeholder="Pesquisar por cliente, nome ou local…"
                  className="w-full pl-9 pr-9 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400 transition-colors"
                />
                {machineSearch && (
                  <button onClick={() => setMachineSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            )}

            {machinesLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <svg className="w-6 h-6 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                <p className="text-slate-400 text-sm">A carregar máquinas…</p>
              </div>
            ) : machines.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
                  </svg>
                </div>
                <p className="text-slate-700 font-semibold mb-1">Nenhuma máquina registada</p>
                <p className="text-slate-400 text-sm mb-5">Crie a primeira máquina para começar a associar stickers QR.</p>
                <button onClick={() => setView('create')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-lg text-sm transition-colors">
                  + Criar primeira máquina
                </button>
              </div>
            ) : filteredMachines.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                  </svg>
                </div>
                <p className="text-slate-700 font-semibold mb-1">Sem resultados</p>
                <p className="text-slate-400 text-sm mb-4">Nenhuma máquina corresponde a "<span className="font-medium text-slate-600">{machineSearch}</span>".</p>
                <button onClick={() => setMachineSearch('')}
                  className="text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                  Limpar pesquisa
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredMachines.map(m => {
                  const sticker = m.sticker_assignments?.[0]?.sticker_code
                  return (
                    <div key={m.id} className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <p className="font-bold text-slate-900 text-sm">{m.name}</p>
                            <StatusPill status={m.status} />
                            {!sticker && (
                              <span className="text-xs bg-amber-50 text-amber-600 border border-amber-200 font-semibold px-2 py-0.5 rounded-full">Sem QR</span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 mt-1">
                            {m.client && <span>{m.client}</span>}
                            {m.location && <><span>·</span><span>{m.location}</span></>}
                            {m.technician && <><span>·</span><span>{m.technician}</span></>}
                          </div>
                          {sticker && (
                            <div className="mt-2 inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-mono px-2.5 py-1 rounded-lg">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 3.5a.5.5 0 11-1 0 .5.5 0 011 0zM6.5 8.5a.5.5 0 11-1 0 .5.5 0 011 0z" />
                              </svg>
                              QR: {sticker}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {deletingMachine === m.id ? (
                            <>
                              <span className="text-xs text-slate-500 font-medium hidden sm:block">Eliminar?</span>
                              <button onClick={() => handleDeleteMachine(m.id)} disabled={deleting}
                                className="text-xs bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold px-3 py-1.5 rounded-lg transition-colors">
                                {deleting ? '…' : 'Confirmar'}
                              </button>
                              <button onClick={() => setDeletingMachine(null)}
                                className="text-xs border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold px-3 py-1.5 rounded-lg transition-colors">
                                Cancelar
                              </button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => setAssigning(m)}
                                className="text-xs border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">
                                {sticker ? 'Reatribuir QR' : 'Atribuir QR'}
                              </button>
                              <button onClick={() => { setEditing(m); setView('edit') }}
                                className="text-xs bg-slate-900 hover:bg-slate-700 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors">
                                Editar
                              </button>
                              <button onClick={() => setDeletingMachine(m.id)}
                                className="text-xs border border-red-200 hover:bg-red-50 text-red-500 font-semibold p-1.5 rounded-lg transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}

        {tab === 'machines' && view === 'create' && (
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

        {tab === 'machines' && view === 'edit' && editing && (
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

        {/* ── OCCURRENCES TAB ─────────────────────────────────────── */}
        {tab === 'occurrences' && !occDetail && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl font-bold text-slate-900">Ocorrências</h1>
              <button onClick={loadOccurrences} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-xs font-semibold transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Atualizar
              </button>
            </div>

            {/* Filter pills */}
            <div className="flex gap-2 mb-5 flex-wrap">
              {[
                { key: 'all', label: 'Todas', count: occurrences.length },
                { key: 'open', label: 'Abertas', count: occurrences.filter(o => o.status === 'open').length },
                { key: 'in_progress', label: 'Em Progresso', count: occurrences.filter(o => o.status === 'in_progress').length },
                { key: 'resolved', label: 'Resolvidas', count: occurrences.filter(o => o.status === 'resolved').length },
              ].map(f => (
                <button key={f.key} onClick={() => setOccFilter(f.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                    occFilter === f.key
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}>
                  {f.label}
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${occFilter === f.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {f.count}
                  </span>
                </button>
              ))}
            </div>

            {occLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <svg className="w-6 h-6 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                <p className="text-slate-400 text-sm">A carregar ocorrências…</p>
              </div>
            ) : filteredOccurrences.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <p className="text-slate-700 font-semibold mb-1">Sem ocorrências</p>
                  <p className="text-slate-400 text-sm">Nenhuma ocorrência encontrada para este filtro.</p>
                </div>
            ) : (
                <div className="space-y-3">
                  {filteredOccurrences.map(o => {
                    const urgencyStyle = {
                      urgent:   { bg: 'bg-red-50 border-red-200',    dot: 'bg-red-500',    text: 'text-red-700',    label: 'Urgente' },
                      medium:   { bg: 'bg-amber-50 border-amber-200', dot: 'bg-amber-500',  text: 'text-amber-700',  label: 'Média' },
                      low:      { bg: 'bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500', text: 'text-emerald-700', label: 'Baixa' },
                    }[o.urgency] ?? { bg: 'bg-slate-50 border-slate-200', dot: 'bg-slate-400', text: 'text-slate-600', label: o.urgency }

                    const statusStyle = {
                      open:        { label: 'Aberta',       cls: 'bg-red-100 text-red-700' },
                      in_progress: { label: 'Em Progresso', cls: 'bg-blue-100 text-blue-700' },
                      resolved:    { label: 'Resolvida',    cls: 'bg-emerald-100 text-emerald-700' },
                    }[o.status] ?? { label: o.status, cls: 'bg-slate-100 text-slate-600' }

                    return (
                      <button key={o.id} onClick={() => setOccDetail(o)}
                        className="w-full text-left bg-white rounded-xl border border-slate-100 p-4 shadow-sm hover:shadow-md hover:border-slate-200 transition-all">
                        <div className="flex items-start gap-3">
                          {/* Urgency dot */}
                          <div className={`mt-1 w-2.5 h-2.5 rounded-full flex-shrink-0 ${urgencyStyle.dot}`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="font-mono font-bold text-sm text-slate-900">{o.ref_code}</span>
                              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusStyle.cls}`}>{statusStyle.label}</span>
                              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${urgencyStyle.bg} ${urgencyStyle.text} border`}>{urgencyStyle.label}</span>
                            </div>
                            <p className="text-sm font-semibold text-slate-800 mb-1">{o.issue_type}</p>
                            <div className="flex flex-wrap gap-x-3 text-xs text-slate-400">
                              {o.machines?.name && <span>{o.machines.name}</span>}
                              <span>· {o.operator_name}</span>
                              <span>· {new Date(o.created_at).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                            </div>
                            {o.description && (
                              <p className="text-xs text-slate-400 mt-1.5 line-clamp-1">{o.description}</p>
                            )}
                          </div>
                          <svg className="w-4 h-4 text-slate-300 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </button>
                    )
                  })}
                </div>
            )}
          </>
        )}

        {/* ── OCCURRENCE DETAIL ──────────────────────────────────────── */}
        {tab === 'occurrences' && occDetail && (
          <OccurrenceDetail
            occurrence={occDetail}
            onBack={() => setOccDetail(null)}
            onStatusChange={async (id, status, notes) => {
              setUpdatingStatus(true)
              const res = await fetch(`/api/occurrences/status/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'x-admin-token': ADMIN_TOKEN },
                body: JSON.stringify({ status, notes }),
              })
              if (res.ok) {
                const updated = await res.json()
                setOccurrences(prev => prev.map(o => o.id === id ? { ...o, ...updated } : o))
                setOccDetail(prev => ({ ...prev, ...updated }))
                showToast('✓ Estado atualizado!')
              }
              setUpdatingStatus(false)
            }}
            updatingStatus={updatingStatus}
            onDelete={handleDeleteOccurrence}
            deleting={deleting}
          />
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
