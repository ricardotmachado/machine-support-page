import { useState, useEffect } from 'react'

const COMPANY = {
  name: 'WAC - Equipamentos Industriais',
  email: 'ricardojtmachado@hotmail.com',
  whatsapp: '351913882119',
}

const ISSUE_TYPES = [
  { label: 'Falha Mecânica',     value: 'mecanica',  icon: IcoWrench },
  { label: 'Falha Elétrica',     value: 'eletrica',  icon: IcoZap },
  { label: 'Ruído Anormal',      value: 'ruido',     icon: IcoSound },
  { label: 'Vibração Excessiva', value: 'vibracao',  icon: IcoWave },
  { label: 'Sobreaquecimento',   value: 'calor',     icon: IcoFire },
  { label: 'Fuga de Fluido',     value: 'vazamento', icon: IcoDrop },
  { label: 'Paragem Imprevista', value: 'parada',    icon: IcoStop },
  { label: 'Outro',              value: 'outro',     icon: IcoMore },
]

const URGENCY = [
  {
    label: 'Baixa', value: 'low',
    hint: 'Pode aguardar agendamento',
    bg: 'bg-emerald-50', border: 'border-emerald-400', text: 'text-emerald-700',
    dot: 'bg-emerald-500', ring: 'ring-emerald-100',
  },
  {
    label: 'Média', value: 'medium',
    hint: 'Afeta a produção parcialmente',
    bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-700',
    dot: 'bg-amber-500', ring: 'ring-amber-100',
  },
  {
    label: 'Urgente', value: 'urgent',
    hint: 'Máquina parada ou risco de segurança',
    bg: 'bg-red-50', border: 'border-red-400', text: 'text-red-700',
    dot: 'bg-red-500', ring: 'ring-red-100',
  },
]

// ─── Icons ────────────────────────────────────────────────────────────────────

function IcoWrench({ cls }) {
  return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" /></svg>
}
function IcoZap({ cls }) {
  return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
}
function IcoSound({ cls }) {
  return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14" /></svg>
}
function IcoWave({ cls }) {
  return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
}
function IcoFire({ cls }) {
  return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" /></svg>
}
function IcoDrop({ cls }) {
  return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" /></svg>
}
function IcoStop({ cls }) {
  return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" /></svg>
}
function IcoMore({ cls }) {
  return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
}
function IcoPhone({ cls }) {
  return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .99h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>
}
function IcoCalendar({ cls }) {
  return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
}
function IcoUser({ cls }) {
  return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
}
function IcoTag({ cls }) {
  return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>
}
function IcoHash({ cls }) {
  return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="9" x2="20" y2="9" /><line x1="4" y1="15" x2="20" y2="15" /><line x1="10" y1="3" x2="8" y2="21" /><line x1="16" y1="3" x2="14" y2="21" /></svg>
}
function IcoSend({ cls }) {
  return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
}
function IcoCheck({ cls }) {
  return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
}
function IcoSpinner({ cls }) {
  return (
    <svg className={`${cls} animate-spin`} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  )
}

function WhatsAppIcon({ cls = 'w-5 h-5' }) {
  return (
    <svg className={cls} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  )
}

function EmailIcon({ cls = 'w-5 h-5' }) {
  return (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateRef() {
  return 'OC-' + Date.now().toString(36).toUpperCase()
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' })
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const map = {
    operational: { label: 'Operacional',    bg: 'bg-emerald-500', pulse: 'bg-emerald-400' },
    maintenance:  { label: 'Em Manutenção', bg: 'bg-amber-500',   pulse: 'bg-amber-400'   },
    offline:      { label: 'Fora de Serviço',bg: 'bg-red-500',    pulse: 'bg-red-400'     },
  }
  const { label, bg, pulse } = map[status] || map.operational
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white text-xs font-semibold border border-white/20">
      <span className="relative flex h-2 w-2">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${pulse} opacity-75`} />
        <span className={`relative inline-flex rounded-full h-2 w-2 ${bg}`} />
      </span>
      {label}
    </span>
  )
}

// ─── Info Row ─────────────────────────────────────────────────────────────────

function InfoRow({ Icon, label, value, mono = false }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon cls="w-4 h-4 text-slate-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-slate-400 uppercase tracking-widest font-semibold leading-none mb-1">{label}</p>
        <p className={`text-sm text-slate-800 font-semibold break-words ${mono ? 'font-mono' : ''}`}>{value}</p>
      </div>
    </div>
  )
}

// ─── Success Screen ───────────────────────────────────────────────────────────

function SuccessScreen({ refCode, urgency, issueLabel, operatorName, description, machineName, stickerId, onReset }) {
  const urgencyItem = URGENCY.find(u => u.value === urgency)

  const waMsg = encodeURIComponent(
    `*NOVA OCORRÊNCIA — ${machineName}*\n` +
    `Código: ${refCode}\n` +
    `Problema: ${issueLabel}\n` +
    `Urgência: ${urgencyItem?.label}\n` +
    `Operador: ${operatorName}\n\n` +
    `${description}`
  )

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">

        {/* Check circle */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-200">
            <IcoCheck cls="w-10 h-10 text-white" />
          </div>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Ocorrência Registada!</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            A equipa foi notificada. Pode também enviar via WhatsApp para resposta imediata.
          </p>
        </div>

        {/* Ref card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-4 text-center shadow-sm">
          <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-2">Código da Ocorrência</p>
          <p className="text-3xl font-mono font-bold text-slate-900 tracking-widest mb-3">{refCode}</p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs text-slate-400 font-mono">{stickerId}</span>
            <span className="text-slate-300">·</span>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              urgency === 'urgent' ? 'bg-red-100 text-red-600' :
              urgency === 'medium' ? 'bg-amber-100 text-amber-600' :
              'bg-emerald-100 text-emerald-600'
            }`}>
              {urgencyItem?.label}
            </span>
          </div>
        </div>

        {/* Email sent notice */}
        <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-4">
          <EmailIcon cls="w-5 h-5 text-blue-600 flex-shrink-0" />
          <div>
            <p className="text-xs font-bold text-blue-800">Equipa notificada por e-mail</p>
            <p className="text-xs text-blue-600">A equipa técnica recebeu os detalhes da ocorrência.</p>
          </div>
        </div>

        {/* CTAs */}
        <div className="space-y-3">
          <a
            href={`https://wa.me/${COMPANY.whatsapp}?text=${waMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl bg-[#25D366] hover:bg-[#1fba5a] active:scale-[0.98] text-white font-bold text-sm transition-all shadow-sm shadow-green-200"
          >
            <WhatsAppIcon cls="w-5 h-5" />
            Enviar também por WhatsApp
          </a>
          <button
            onClick={onReset}
            className="w-full py-3.5 rounded-2xl border-2 border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold text-sm transition-colors"
          >
            Abrir nova ocorrência
          </button>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Guarde este código para acompanhar a sua ocorrência.
        </p>
      </div>
    </div>
  )
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App({ stickerId }) {
  const [machine, setMachine] = useState(null)
  const [machineLoading, setMachineLoading] = useState(true)
  const [machineNotFound, setMachineNotFound] = useState(false)
  const [form, setForm] = useState({ operatorName: '', issueType: '', urgency: 'medium', description: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [refCode, setRefCode] = useState('')
  const [sentForm, setSentForm] = useState(null)
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    if (!stickerId) { setMachineLoading(false); setMachineNotFound(true); return }
    fetch(`/api/machine/${stickerId}`)
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(data => { setMachine(data); setMachineLoading(false) })
      .catch(() => { setMachineNotFound(true); setMachineLoading(false) })
  }, [stickerId])

  function validate() {
    const e = {}
    if (!form.operatorName.trim()) e.operatorName = 'Indique o seu nome.'
    if (!form.issueType) e.issueType = 'Selecione o tipo de problema.'
    if (!form.description.trim()) e.description = 'Descreva o problema.'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }
    setSubmitting(true)

    const ref = generateRef()
    const issueItem = ISSUE_TYPES.find(i => i.value === form.issueType)

    try {
      const res = await fetch('/api/submit-occurrence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ref,
          name: form.operatorName,
          issueType: issueItem?.label ?? form.issueType,
          urgency: form.urgency,
          description: form.description,
          machineId: machine?.id,
          machineName: machine?.name,
          stickerId,
        }),
      })
      if (!res.ok) throw new Error('Server error')
    } catch {
      // still show success — avoid blocking the operator
    }

    setRefCode(ref)
    setSentForm({ ...form, issueLabel: issueItem?.label })
    setSubmitting(false)
    setSubmitted(true)
  }

  function handleChange(field, value) {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(er => ({ ...er, [field]: undefined }))
  }

  if (machineLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-4">
        <img src="/wac-logo.png" alt="WAC" className="w-14 h-14 rounded-2xl object-cover shadow-lg opacity-90" />
        <div className="flex items-center gap-2.5">
          <IcoSpinner cls="w-5 h-5 text-blue-400 animate-spin" />
          <span className="text-slate-400 text-sm">A carregar dados da máquina…</span>
        </div>
      </div>
    )
  }

  if (machineNotFound) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-4 text-center">
        <img src="/wac-logo.png" alt="WAC" className="w-16 h-16 rounded-2xl object-cover mx-auto mb-6 shadow-md opacity-80" />
        <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Sticker não registado</h2>
        <p className="text-slate-400 text-sm max-w-xs leading-relaxed">Este código QR ainda não está associado a nenhuma máquina. Contacte a equipa WAC.</p>
        <p className="text-xs text-slate-600 font-mono mt-5 bg-slate-800 px-3 py-1.5 rounded-lg">{stickerId}</p>
        <a href={`https://wa.me/${COMPANY.whatsapp}`} target="_blank" rel="noopener noreferrer"
          className="mt-6 flex items-center gap-2 bg-[#25D366] hover:bg-[#1fba5a] text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors">
          <WhatsAppIcon cls="w-4 h-4" />
          Contactar WAC
        </a>
      </div>
    )
  }

  if (submitted) {
    return (
      <SuccessScreen
        refCode={refCode}
        urgency={sentForm.urgency}
        issueLabel={sentForm.issueLabel}
        operatorName={sentForm.operatorName}
        description={sentForm.description}
        machineName={machine?.name}
        stickerId={stickerId}
        onReset={() => {
          setSubmitted(false)
          setSentForm(null)
          setForm({ operatorName: '', issueType: '', urgency: 'medium', description: '' })
        }}
      />
    )
  }

  const infoRows = [
    { Icon: IcoTag,      label: 'Marca',               value: machine.brand },
    { Icon: IcoTag,      label: 'Modelo',              value: machine.model },
    { Icon: IcoHash,     label: 'Nº de Série',          value: machine.serial, mono: true },
    { Icon: IcoHash,     label: 'Ano de Fabrico',       value: machine.year },
    { Icon: IcoUser,     label: 'Técnico Responsável',  value: machine.technician },
    { Icon: IcoCalendar, label: 'Instalação',           value: formatDate(machine.install_date) },
  ]

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <div className="relative w-full overflow-hidden" style={{ minHeight: !imgError && machine.image ? undefined : 'auto' }}>

        {!imgError && machine.image ? (
          /* ── Photo hero ── */
          <div className="h-72 md:h-96">
            <img
              src={machine.image}
              alt={machine.name}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/15" />
          </div>
        ) : (
          /* ── No-image hero — dark branded panel ── */
          <div className="bg-[#080f1e] pt-16 pb-8 px-4">
            {/* subtle dot grid */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="hero-dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="1" cy="1" r="1" fill="#ffffff" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#hero-dots)" />
            </svg>
            {/* blue glow */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 80% at 80% 50%, rgba(37,99,235,0.15) 0%, transparent 70%)' }} />

            <div className="relative max-w-5xl mx-auto">
              <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-3 opacity-80">Equipamento</p>
              <h1 className="text-white text-3xl md:text-4xl font-extrabold leading-tight mb-3">{machine.name}</h1>

              {/* Quick spec pills */}
              <div className="flex flex-wrap gap-2 mb-5">
                {machine.brand && (
                  <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 text-slate-300 text-xs font-medium px-3 py-1.5 rounded-full">
                    <IcoTag cls="w-3 h-3 text-blue-400" />{machine.brand}
                  </span>
                )}
                {machine.model && (
                  <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 text-slate-300 text-xs font-medium px-3 py-1.5 rounded-full">
                    <IcoTag cls="w-3 h-3 text-blue-400" />{machine.model}
                  </span>
                )}
                {machine.year && (
                  <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 text-slate-300 text-xs font-medium px-3 py-1.5 rounded-full">
                    <IcoCalendar cls="w-3 h-3 text-blue-400" />{machine.year}
                  </span>
                )}
                {machine.location && (
                  <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 text-slate-300 text-xs font-medium px-3 py-1.5 rounded-full">
                    <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    {machine.location}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-slate-500 text-xs">
                <span className="font-mono text-slate-400">{stickerId}</span>
                {machine.client && <><span>·</span><span>{machine.client}</span></>}
              </div>
            </div>
          </div>
        )}

        {/* Top bar — overlaid for photo hero, absolute for both */}
        <div className={`${!imgError && machine.image ? 'absolute top-0' : 'absolute top-0'} left-0 right-0 pt-5`}>
          <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/wac-logo.png" alt="WAC" className="w-8 h-8 rounded-xl object-cover shadow-lg flex-shrink-0" />
              <div>
                <p className="text-white text-xs font-semibold tracking-wide leading-none">{COMPANY.name}</p>
                {machine.location && <p className="text-slate-400 text-[10px] mt-0.5 leading-none">{machine.location}</p>}
              </div>
            </div>
            <StatusBadge status={machine.status} />
          </div>
        </div>

        {/* Machine title for photo hero only */}
        {!imgError && machine.image && (
          <div className="absolute bottom-0 left-0 right-0 pb-6">
            <div className="max-w-5xl mx-auto px-4">
              <p className="text-blue-300 text-xs font-semibold uppercase tracking-widest mb-1 opacity-80">Equipamento</p>
              <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight">{machine.name}</h1>
              <p className="text-slate-400 text-xs mt-1.5">
                <span className="font-mono">{stickerId}</span>
                {machine.client && <><span className="mx-1.5 opacity-40">·</span><span>{machine.client}</span></>}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── BODY ─────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 pt-5 pb-10">
        <div className="md:grid md:grid-cols-[300px_1fr] md:gap-5 md:items-start">

          {/* ── Left: machine card (sticky) ── */}
          <div className="mb-4 md:mb-0 md:sticky md:top-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-5 pt-5 pb-2">
              <p className="text-[11px] text-slate-400 uppercase tracking-widest font-semibold mb-1">Ficha do Equipamento</p>
              {infoRows.map((row, i) => <InfoRow key={i} {...row} />)}
            </div>
          </div>

          {/* ── Right: form + contact ── */}
          <div className="space-y-4">

            {/* Form card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">

              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm shadow-blue-200">
                  <IcoSend cls="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Abrir Ocorrência</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Preencha os campos e a equipa será notificada.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-5">

                {/* Operator name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    O seu nome <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: João Silva"
                    value={form.operatorName}
                    onChange={e => handleChange('operatorName', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all
                      ${errors.operatorName
                        ? 'border-red-300 bg-red-50 focus:border-red-400'
                        : 'border-slate-200 bg-slate-50 focus:border-blue-500 focus:bg-white'
                      }`}
                  />
                  {errors.operatorName && <FieldError msg={errors.operatorName} />}
                </div>

                {/* Issue type — 2-col mobile, 4-col desktop */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Tipo de problema <span className="text-red-400">*</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {ISSUE_TYPES.map(({ label, value, icon: Icon }) => {
                      const active = form.issueType === value
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => handleChange('issueType', value)}
                          className={`flex flex-col items-center gap-2 px-2 py-3 rounded-xl border-2 text-center transition-all active:scale-[0.97]
                            ${active
                              ? 'border-blue-500 bg-blue-50 shadow-sm'
                              : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white'
                            }`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${active ? 'bg-blue-100' : 'bg-white border border-slate-200'}`}>
                            <Icon cls={`w-4 h-4 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
                          </div>
                          <span className={`text-xs font-semibold leading-tight ${active ? 'text-blue-700' : 'text-slate-600'}`}>{label}</span>
                        </button>
                      )
                    })}
                  </div>
                  {errors.issueType && <FieldError msg={errors.issueType} />}
                </div>

                {/* Urgency — 3-col always */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Urgência</label>
                  <div className="grid grid-cols-3 gap-2">
                    {URGENCY.map(u => {
                      const active = form.urgency === u.value
                      return (
                        <button
                          key={u.value}
                          type="button"
                          onClick={() => handleChange('urgency', u.value)}
                          className={`flex flex-col items-center text-center gap-1.5 px-3 py-3.5 rounded-xl border-2 transition-all active:scale-[0.98]
                            ${active
                              ? `${u.bg} ${u.border} ring-4 ${u.ring}`
                              : 'border-slate-200 bg-slate-50 hover:bg-white'
                            }`}
                        >
                          <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${active ? u.dot : 'bg-slate-300'}`} />
                          <p className={`text-sm font-bold leading-none ${active ? u.text : 'text-slate-700'}`}>{u.label}</p>
                          <p className={`text-[11px] leading-tight ${active ? u.text + ' opacity-75' : 'text-slate-400'}`}>{u.hint}</p>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Descrição <span className="text-red-400">*</span>
                    </label>
                    <span className={`text-xs font-medium tabular-nums ${form.description.length > 280 ? 'text-red-500' : 'text-slate-400'}`}>
                      {form.description.length}/300
                    </span>
                  </div>
                  <textarea
                    placeholder="Descreva o que está a acontecer com a máquina..."
                    rows={4}
                    maxLength={300}
                    value={form.description}
                    onChange={e => handleChange('description', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all resize-none
                      ${errors.description
                        ? 'border-red-300 bg-red-50 focus:border-red-400'
                        : 'border-slate-200 bg-slate-50 focus:border-blue-500 focus:bg-white'
                      }`}
                  />
                  {errors.description && <FieldError msg={errors.description} />}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98] text-white font-bold text-sm transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                >
                  {submitting
                    ? <><IcoSpinner cls="w-4 h-4" /> A enviar...</>
                    : <><IcoSend cls="w-4 h-4" /> Registar Ocorrência</>
                  }
                </button>

              </form>
            </div>

            {/* Direct contact */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <p className="text-sm font-bold text-slate-800 mb-1">Prefere contacto direto?</p>
              <p className="text-xs text-slate-400 mb-4">Fale connosco directamente sem preencher o formulário.</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <a
                  href={`https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent('Olá! Preciso de suporte técnico para o equipamento ' + stickerId + ' — ' + machine.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#1fba5a] active:scale-[0.98] text-white text-sm font-bold transition-all shadow-sm shadow-green-200"
                >
                  <WhatsAppIcon cls="w-4 h-4" />
                  WhatsApp
                </a>
                <a
                  href={`tel:+${COMPANY.whatsapp}`}
                  className="flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-sm font-bold transition-all shadow-sm shadow-blue-200"
                >
                  <IcoPhone cls="w-4 h-4" />
                  Telefone
                </a>
                <a
                  href={`mailto:${COMPANY.email}?subject=${encodeURIComponent('[Suporte] ' + stickerId + ' — ' + machine.name)}`}
                  className="flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white text-sm font-bold transition-all shadow-sm"
                >
                  <EmailIcon cls="w-4 h-4" />
                  E-mail
                </a>
              </div>
            </div>

            <p className="text-center text-xs text-slate-400 py-2">{COMPANY.name}</p>
          </div>

        </div>
      </div>
    </div>
  )
}

function FieldError({ msg }) {
  return (
    <p className="flex items-center gap-1.5 text-xs text-red-500 mt-1.5">
      <span className="w-3.5 h-3.5 rounded-full bg-red-100 inline-flex items-center justify-center text-[9px] font-bold flex-shrink-0">!</span>
      {msg}
    </p>
  )
}
