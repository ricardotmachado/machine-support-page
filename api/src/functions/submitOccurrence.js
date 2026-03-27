const { app } = require('@azure/functions')
const { Resend } = require('resend')

app.http('submitOccurrence', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'submit-occurrence',
  handler: async (request, context) => {
    let body
    try {
      body = await request.json()
    } catch {
      return { status: 400, jsonBody: { error: 'Invalid JSON' } }
    }

    const { name, issueType, urgency, description, machineId, machineName } = body

    if (!name || !issueType || !description) {
      return { status: 400, jsonBody: { error: 'Missing required fields' } }
    }

    const ref = `OC-${Date.now().toString(36).toUpperCase()}`

    const urgencyLabel = { low: 'Baixa', medium: 'Média', urgent: 'Urgente' }[urgency] ?? urgency
    const urgencyColor = { low: '#22c55e', medium: '#f59e0b', urgent: '#ef4444' }[urgency] ?? '#94a3b8'

    const html = `
      <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;background:#f8fafc;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0">
        <div style="background:#0f172a;padding:24px 28px;display:flex;align-items:center;gap:12px">
          <div style="background:#2563eb;border-radius:8px;width:36px;height:36px;display:flex;align-items:center;justify-content:center;flex-shrink:0">
            <span style="color:#fff;font-size:18px">🔧</span>
          </div>
          <div>
            <p style="margin:0;color:#f1f5f9;font-size:15px;font-weight:700">WAC — Nova Ocorrência</p>
            <p style="margin:0;color:#64748b;font-size:12px">Referência: <span style="font-family:monospace;color:#93c5fd">${ref}</span></p>
          </div>
        </div>

        <div style="padding:24px 28px;background:#fff;border-bottom:1px solid #f1f5f9">
          <p style="margin:0 0 4px;color:#94a3b8;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase">Equipamento</p>
          <p style="margin:0;color:#0f172a;font-size:15px;font-weight:700">${machineName ?? machineId}</p>
          <p style="margin:2px 0 0;color:#64748b;font-size:12px;font-family:monospace">${machineId}</p>
        </div>

        <div style="padding:24px 28px;display:grid;grid-template-columns:1fr 1fr;gap:16px">
          <div>
            <p style="margin:0 0 4px;color:#94a3b8;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase">Operador</p>
            <p style="margin:0;color:#0f172a;font-size:14px;font-weight:600">${name}</p>
          </div>
          <div>
            <p style="margin:0 0 4px;color:#94a3b8;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase">Urgência</p>
            <span style="display:inline-block;padding:3px 10px;border-radius:99px;background:${urgencyColor}22;color:${urgencyColor};font-size:12px;font-weight:700">${urgencyLabel}</span>
          </div>
          <div>
            <p style="margin:0 0 4px;color:#94a3b8;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase">Tipo de Problema</p>
            <p style="margin:0;color:#0f172a;font-size:14px;font-weight:600">${issueType}</p>
          </div>
        </div>

        <div style="padding:0 28px 24px">
          <p style="margin:0 0 8px;color:#94a3b8;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase">Descrição</p>
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:14px">
            <p style="margin:0;color:#334155;font-size:14px;line-height:1.6">${description.replace(/\n/g, '<br>')}</p>
          </div>
        </div>

        <div style="padding:16px 28px;background:#f8fafc;border-top:1px solid #e2e8f0">
          <p style="margin:0;color:#94a3b8;font-size:11px;text-align:center">
            Ocorrência submetida em ${new Date().toLocaleString('pt-PT', { timeZone: 'Europe/Lisbon' })}
          </p>
        </div>
      </div>
    `

    try {
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: 'WAC Suporte <onboarding@resend.dev>',
        to: [process.env.NOTIFY_EMAIL],
        subject: `[${ref}] ${urgencyLabel === 'Urgente' ? '🚨 ' : ''}Nova Ocorrência — ${machineName ?? machineId}`,
        html,
      })
    } catch (err) {
      context.error('Email send failed:', err)
      return { status: 500, jsonBody: { error: 'Failed to send notification' } }
    }

    return { status: 200, jsonBody: { ref } }
  },
})
