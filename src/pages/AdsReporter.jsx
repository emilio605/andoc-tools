import Layout from '../components/Layout'

const TOOL_URL = 'https://ads-reporter.pendiente.cl'

export default function AdsReporter() {
  return (
    <Layout>
      <div style={{
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        background: '#0f0f13',
        minHeight: '100vh',
        color: '#e2e8f0',
        padding: '36px 40px',
      }}>
        <div style={{ maxWidth: 700 }}>
          {/* Header */}
          <div style={{ marginBottom: 36 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
            <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
              Ads Reporter
            </h1>
            <p style={{ fontSize: 14, color: '#94a3b8', marginTop: 8, lineHeight: 1.6 }}>
              Reportes automáticos de campañas publicitarias. Analiza métricas de Facebook Ads, Google Ads y más desde un solo lugar.
            </p>
          </div>

          {/* Card */}
          <div style={{
            background: '#1a1a24',
            border: '1px solid #1e1e2e',
            borderRadius: 14,
            padding: '28px 32px',
            marginBottom: 20,
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 20,
            }}>
              <div style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#eab308',
                boxShadow: '0 0 8px #eab308',
              }} />
              <span style={{ fontSize: 12, color: '#eab308', fontFamily: "'DM Mono', monospace", letterSpacing: '0.06em' }}>
                PENDIENTE DE DEPLOY
              </span>
            </div>

            <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 24, lineHeight: 1.7 }}>
              Esta herramienta está en desarrollo. Cuando esté lista, se abrirá en una nueva pestaña directamente desde aquí.
            </p>

            <div style={{
              background: '#0f0f13',
              border: '1px solid #1e1e2e',
              borderRadius: 8,
              padding: '10px 14px',
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}>
              <span style={{ fontSize: 12, color: '#475569', fontFamily: "'DM Mono', monospace" }}>
                URL pendiente de configurar
              </span>
            </div>

            <button
              disabled
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: '#1e1e2e',
                color: '#475569',
                border: 'none',
                borderRadius: 8,
                padding: '12px 24px',
                fontSize: 15,
                fontWeight: 700,
                cursor: 'not-allowed',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Próximamente disponible
              <span style={{ fontSize: 16 }}>⏳</span>
            </button>
          </div>

          <div style={{
            background: 'rgba(234,179,8,0.06)',
            border: '1px solid rgba(234,179,8,0.15)',
            borderRadius: 10,
            padding: '14px 18px',
            fontSize: 13,
            color: '#94a3b8',
            lineHeight: 1.6,
          }}>
            <strong style={{ color: '#eab308' }}>Estado:</strong> Pendiente de deploy. Una vez que la URL esté disponible, actualiza la variable <code style={{ fontFamily: "'DM Mono', monospace", background: '#0f0f13', padding: '1px 6px', borderRadius: 4, fontSize: 12 }}>TOOL_URL</code> en este componente.
          </div>
        </div>
      </div>
    </Layout>
  )
}
