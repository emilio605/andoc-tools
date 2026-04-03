import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'

const stats = [
  { label: 'Total Clientes', value: '12', icon: '🏢', color: '#F97316' },
  { label: 'Briefs este mes', value: '4', icon: '📝', color: '#EAB308' },
  { label: 'Propuestas enviadas', value: '7', icon: '💼', color: '#3B82F6' },
  { label: 'Herramientas activas', value: '7', icon: '🛠', color: '#22C55E' },
]

const tools = [
  { path: '/clientes', label: 'Clientes', icon: '🏢', color: '#F97316', desc: 'Gestión de clientes' },
  { path: '/onboarding', label: 'Onboarding', icon: '📋', color: '#F97316', desc: 'SOP para clientes nuevos' },
  { path: '/brief', label: 'Brief', icon: '📝', color: '#EAB308', desc: 'Formulario de descubrimiento' },
  { path: '/brief-ia', label: 'Brief IA', icon: '✨', color: '#A855F7', desc: 'Auto-completar con IA' },
  { path: '/propuesta', label: 'Propuesta', icon: '💼', color: '#3B82F6', desc: 'Generador de propuestas' },
  { path: '/flujo-caja', label: 'Flujo de Caja', icon: '💰', color: '#22C55E', desc: 'Calculadora financiera' },
  { path: '/auditoria', label: 'Auditoría Shopify', icon: '🛍', color: '#EC4899', desc: 'Auditor de tiendas' },
  { path: '/ads', label: 'Ads Reporter', icon: '📊', color: '#06B6D4', desc: 'Reportes de campañas' },
]

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Buenos días'
  if (h < 18) return 'Buenas tardes'
  return 'Buenas noches'
}

export default function Dashboard() {
  const { user } = useAuth()
  const name = user?.email?.split('@')[0] || 'equipo'

  return (
    <Layout>
      <div style={{
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        background: '#0f0f13',
        minHeight: '100vh',
        color: '#e2e8f0',
        padding: '36px 40px',
      }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{
            fontSize: 11,
            fontFamily: "'DM Mono', monospace",
            color: '#F97316',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: 8,
          }}>
            Andoc Creativo
          </div>
          <h1 style={{
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            margin: 0,
          }}>
            {getGreeting()}, {name}
          </h1>
          <p style={{ fontSize: 14, color: '#475569', marginTop: 6 }}>
            Aquí tienes un resumen del estado actual.
          </p>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
          marginBottom: 40,
        }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              background: '#1a1a24',
              border: '1px solid #1e1e2e',
              borderRadius: 12,
              padding: '20px 22px',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 12,
              }}>
                <div style={{
                  fontSize: 11,
                  color: '#475569',
                  fontFamily: "'DM Mono', monospace",
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}>
                  {s.label}
                </div>
                <div style={{ fontSize: 18 }}>{s.icon}</div>
              </div>
              <div style={{
                fontSize: 32,
                fontWeight: 800,
                color: s.color,
                lineHeight: 1,
              }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* Tools grid */}
        <div style={{ marginBottom: 16 }}>
          <h2 style={{
            fontSize: 14,
            fontWeight: 600,
            color: '#475569',
            fontFamily: "'DM Mono', monospace",
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: 16,
          }}>
            Accesos rápidos
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 14,
          }}>
            {tools.map((t) => (
              <Link
                key={t.path}
                to={t.path}
                style={{
                  background: '#1a1a24',
                  border: '1px solid #1e1e2e',
                  borderRadius: 10,
                  padding: '18px 20px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  transition: 'all 0.15s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = t.color
                  e.currentTarget.style.background = `rgba(${hexToRgb(t.color)}, 0.06)`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#1e1e2e'
                  e.currentTarget.style.background = '#1a1a24'
                }}
              >
                <div style={{
                  fontSize: 22,
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: `rgba(${hexToRgb(t.color)}, 0.1)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {t.icon}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#f8fafc' }}>
                    {t.label}
                  </div>
                  <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>
                    {t.desc}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return '255,255,255'
  return `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`
}
