import { QRCodeSVG } from 'qrcode.react'

/**
 * Physical sticker dimensions: 85mm × 55mm (credit-card format)
 * At 96dpi → 1px ≈ 0.2646mm → 85mm ≈ 321px, 55mm ≈ 208px
 */

const W = 321
const H = 208

function WrenchIcon({ size = 14, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
    </svg>
  )
}

export function Sticker({ machine, baseUrl = 'https://thankful-field-0ed015510.4.azurestaticapps.net' }) {
  const url = `${baseUrl}/machine/${machine.id}`
  // Unique IDs per machine to avoid SVG pattern conflicts in multi-sticker print sheets
  const gridId = `grid-${machine.id}`
  const glowId = `glow-${machine.id}`

  return (
    <div
      className="sticker-root relative overflow-hidden select-none"
      style={{
        width: W,
        height: H,
        background: '#080f1e',
        borderRadius: 10,
        fontFamily: "'Inter', system-ui, sans-serif",
        boxShadow: '0 0 0 1px rgba(59,130,246,0.15), 0 12px 40px rgba(0,0,0,0.6)',
      }}
    >

      {/* ── Subtle dot-grid texture ── */}
      <svg style={{ position: 'absolute', inset: 0, opacity: 0.06, pointerEvents: 'none' }} width={W} height={H}>
        <defs>
          <pattern id={gridId} x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.8" fill="#ffffff" />
          </pattern>
        </defs>
        <rect width={W} height={H} fill={`url(#${gridId})`} />
      </svg>

      {/* ── Right-side blue glow ── */}
      <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} width={W} height={H}>
        <defs>
          <radialGradient id={glowId} cx="80%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#1d4ed8" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill={`url(#${glowId})`} />
      </svg>

      {/* ── Left accent bar ── */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 5,
        background: 'linear-gradient(180deg, #60a5fa 0%, #2563eb 50%, #1d4ed8 100%)',
      }} />

      {/* ── Header ── */}
      <div style={{
        position: 'absolute', top: 0, left: 5, right: 0, height: 30,
        background: 'linear-gradient(90deg, #0f1f4a 0%, #080f1e 100%)',
        borderBottom: '1px solid rgba(59,130,246,0.2)',
        display: 'flex', alignItems: 'center',
        padding: '0 10px', gap: 6,
      }}>
        {/* Logo */}
        <img
          src="/wac-logo.png"
          alt="WAC"
          style={{ width: 18, height: 18, borderRadius: 4, objectFit: 'cover', flexShrink: 0 }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <span style={{ color: '#f1f5f9', fontSize: 8.5, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', lineHeight: 1 }}>
            WAC
          </span>
          <span style={{ color: '#60a5fa', fontSize: 6, fontWeight: 500, letterSpacing: '0.06em', lineHeight: 1 }}>
            Equipamentos Industriais
          </span>
        </div>

        {/* Right: Suporte Técnico badge */}
        <div style={{
          marginLeft: 'auto',
          background: 'rgba(59,130,246,0.12)',
          border: '1px solid rgba(59,130,246,0.3)',
          borderRadius: 3,
          padding: '2px 5px',
        }}>
          <span style={{ color: '#93c5fd', fontSize: 6, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Suporte Técnico
          </span>
        </div>
      </div>

      {/* ── Accent separator line ── */}
      <div style={{
        position: 'absolute', top: 30, left: 5, right: 0, height: 2,
        background: 'linear-gradient(90deg, #3b82f6 0%, #1d4ed8 40%, transparent 100%)',
      }} />

      {/* ── Main body ── */}
      <div style={{
        position: 'absolute',
        top: 32, left: 5, right: 0, bottom: 20,
        display: 'flex',
        alignItems: 'stretch',
      }}>

        {/* QR zone */}
        <div style={{
          flexShrink: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '8px 10px 8px 10px',
          gap: 5,
        }}>
          {/* QR code in white block */}
          <div style={{
            background: '#ffffff',
            borderRadius: 7,
            padding: 5,
            boxShadow: '0 0 0 1.5px rgba(59,130,246,0.35), 0 4px 16px rgba(0,0,0,0.5)',
            position: 'relative',
          }}>
            <QRCodeSVG
              value={url}
              size={108}
              bgColor="#ffffff"
              fgColor="#0a0f1e"
              level="H"
              marginSize={0}
            />
            {/* Corner marks */}
            {[
              { top: -2.5, left: -2.5 },
              { top: -2.5, right: -2.5 },
              { bottom: -2.5, left: -2.5 },
              { bottom: -2.5, right: -2.5 },
            ].map((pos, i) => (
              <div key={i} style={{
                position: 'absolute', width: 9, height: 9,
                borderRadius: 2,
                border: '2px solid #3b82f6',
                background: 'transparent',
                ...pos,
              }} />
            ))}
          </div>

          {/* SCAN label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="3">
              <polyline points="9 18 15 12 9 6" />
            </svg>
            <span style={{
              color: '#3b82f6', fontSize: 6.5, fontWeight: 800,
              letterSpacing: '0.22em', textTransform: 'uppercase',
            }}>
              SCAN
            </span>
          </div>
        </div>

        {/* Vertical divider */}
        <div style={{ width: 1, background: 'rgba(255,255,255,0.05)', flexShrink: 0, margin: '10px 0' }} />

        {/* Info column */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '10px 12px 10px 12px', gap: 6,
        }}>

          {/* Machine name */}
          <div>
            <p style={{
              color: '#334155', fontSize: 6, fontWeight: 700,
              letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 3, lineHeight: 1,
            }}>
              Equipamento
            </p>
            <p style={{
              color: '#f8fafc', fontSize: 10.5, fontWeight: 800, lineHeight: 1.2,
              letterSpacing: '-0.01em',
            }}>
              {machine.name}
            </p>
          </div>

          {/* Separator */}
          <div style={{ height: 1, background: 'linear-gradient(90deg, rgba(59,130,246,0.4), transparent)' }} />

          {/* Info rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[
              { label: 'ID', value: machine.id },
              { label: 'Modelo', value: machine.model },
              { label: 'N/S', value: machine.serial },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{
                  color: '#475569', fontSize: 6.5, fontWeight: 700,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  minWidth: 26, lineHeight: 1,
                }}>
                  {label}
                </span>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
                <span style={{
                  color: '#cbd5e1', fontSize: 7.5, fontWeight: 600,
                  fontFamily: 'ui-monospace, Consolas, monospace',
                  letterSpacing: '0.04em',
                }}>
                  {value}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 5, right: 0, height: 20,
        background: '#030712',
        borderTop: '1px solid rgba(59,130,246,0.12)',
        display: 'flex', alignItems: 'center',
        padding: '0 10px', gap: 6,
      }}>
        {/* Status dot */}
        <div style={{
          width: 5, height: 5, borderRadius: '50%',
          background: '#22c55e',
          boxShadow: '0 0 5px #22c55e88',
          flexShrink: 0,
        }} />

        {/* URL — most useful in footer if someone can't scan */}
        <span style={{
          color: '#64748b', fontSize: 6.5,
          fontFamily: 'ui-monospace, Consolas, monospace',
          letterSpacing: '0.03em', flex: 1,
        }}>
          {url.replace('https://', '')}
        </span>

        {/* Machine ID pill */}
        <span style={{
          color: '#475569', fontSize: 5.5,
          fontFamily: 'ui-monospace, Consolas, monospace',
          letterSpacing: '0.06em',
        }}>
          {machine.id}
        </span>
      </div>

    </div>
  )
}
