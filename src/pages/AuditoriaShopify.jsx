import Layout from '../components/Layout'

const TOOL_URL = 'https://shopify-auditor-production.up.railway.app'

export default function AuditoriaShopify() {
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
            <div style={{ fontSize: 40, marginBottom: 12 }}>🛍</div>
            <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
              Auditoría Shopify
            </h1>
            <p style={{ fontSize: 14, color: '#94a3b8', marginTop: 8, lineHeight: 1.6 }}>
              Herramienta de auditoría para tiendas Shopify. Analiza rendimiento, SEO, velocidad de carga y buenas prácticas para Ando Creativo.
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
                background: '#22c55e',
                boxShadow: '0 0 8px #22c55e',
              }} />
              <span style={{ fontSize: 12, color: '#22c55e', fontFamily: "'DM Mono', monospace", letterSpacing: '0.06em' }}>
                HERRAMIENTA ACTIVA
              </span>
            </div>

            <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 24, lineHeight: 1.7 }}>
              Esta herramienta se ejecuta en su propio servidor en Railway. Haz clic en el botón para abrirla en una nueva pestaña.
            </p>

            <div style={{
              background: '#0f0f13',
              border: '1px solid #1e1e2e',
              borderRadius: 8,
              padding: '10px 14px',
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
            }}>
              <span style={{ fontSize: 12, color: '#475569', fontFamily: "'DM Mono', monospace", wordBreak: 'break-all' }}>
                {TOOL_URL}
              </span>
            </div>

            <a
              href={TOOL_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: '#F97316',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: 8,
                padding: '12px 24px',
                fontSize: 15,
                fontWeight: 700,
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#ea6f0d'}
              onMouseLeave={e => e.currentTarget.style.background = '#F97316'}
            >
              Abrir Auditoría Shopify
              <span style={{ fontSize: 16 }}>↗</span>
            </a>
          </div>

          <div style={{
            background: 'rgba(249,115,22,0.06)',
            border: '1px solid rgba(249,115,22,0.15)',
            borderRadius: 10,
            padding: '14px 18px',
            fontSize: 13,
            color: '#94a3b8',
            lineHeight: 1.6,
          }}>
            <strong style={{ color: '#F97316' }}>Nota:</strong> Si el servidor está inactivo puede tardar unos segundos en iniciar. Espera y recarga si es necesario.
          </div>
        </div>
      </div>
    </Layout>
  )
}
