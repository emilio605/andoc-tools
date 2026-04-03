import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navSections = [
  {
    items: [
      { path: '/dashboard', label: 'Dashboard', icon: '📊' },
      { path: '/clientes', label: 'Clientes', icon: '🏢', roles: ['admin', 'editor'] },
    ]
  },
  {
    title: 'HERRAMIENTAS',
    items: [
      { path: '/onboarding', label: 'Onboarding', icon: '📋' },
      { path: '/brief', label: 'Brief Descubrimiento', icon: '📝' },
      { path: '/brief-ia', label: 'Brief IA', icon: '✨' },
      { path: '/propuesta', label: 'Propuesta Comercial', icon: '💼' },
      { path: '/flujo-caja', label: 'Flujo de Caja', icon: '💰' },
      { path: '/auditoria', label: 'Auditoría Shopify', icon: '🛍' },
      { path: '/ads', label: 'Ads Reporter', icon: '📊' },
    ]
  },
  {
    title: 'ADMIN',
    roles: ['admin'],
    items: [
      { path: '/admin/equipo', label: 'Equipo & Accesos', icon: '👥', roles: ['admin'] },
      { path: '/admin/config', label: 'Configuración', icon: '⚙️', roles: ['admin'] },
    ]
  },
]

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, role, logout } = useAuth()

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  function canSee(itemRoles) {
    if (!itemRoles) return true
    if (!role) return false
    return itemRoles.includes(role)
  }

  return (
    <div style={{
      width: 230,
      flexShrink: 0,
      background: '#1a1a24',
      borderRight: '1px solid #1e1e2e',
      padding: '20px 14px',
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
      height: '100vh',
      overflow: 'auto',
      position: 'sticky',
      top: 0,
    }}>
      {/* Logo */}
      <div style={{
        padding: '8px 4px 20px',
        borderBottom: '1px solid #1e1e2e',
        marginBottom: 16,
      }}>
        <div style={{
          fontSize: 15,
          fontWeight: 700,
          fontStyle: 'italic',
          color: '#F97316',
          letterSpacing: '0.02em',
        }}>
          ando creativo.cl
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
        {navSections.map((section, si) => {
          // filtrar sección entera por role si tiene roles
          if (section.roles && !canSee(section.roles)) return null

          const visibleItems = section.items.filter(item => canSee(item.roles))
          if (!visibleItems.length) return null

          return (
            <div key={si} style={{ marginBottom: 8 }}>
              {section.title && (
                <div style={{
                  fontSize: 10,
                  fontFamily: "'DM Mono', monospace",
                  color: '#334155',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  padding: '12px 8px 6px',
                  borderTop: si > 0 ? '1px solid #1e1e2e' : 'none',
                  marginTop: si > 0 ? 4 : 0,
                }}>
                  {section.title}
                </div>
              )}
              {visibleItems.map((item) => {
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    style={{
                      padding: '9px 10px',
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? '#f8fafc' : '#94a3b8',
                      background: isActive ? 'rgba(249,115,22,0.12)' : 'transparent',
                      border: isActive ? '1px solid rgba(249,115,22,0.3)' : '1px solid transparent',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      transition: 'all 0.15s ease',
                      cursor: 'pointer',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={e => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                        e.currentTarget.style.color = '#e2e8f0'
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.color = '#94a3b8'
                      }
                    }}
                  >
                    <span style={{ fontSize: 14 }}>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          )
        })}
      </nav>

      {/* User footer */}
      <div style={{
        paddingTop: 16,
        borderTop: '1px solid #1e1e2e',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: 'rgba(249,115,22,0.2)',
            border: '1px solid rgba(249,115,22,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            color: '#F97316',
            fontWeight: 700,
            flexShrink: 0,
          }}>
            {user?.email?.[0]?.toUpperCase() || '?'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{
              fontSize: 11,
              color: '#e2e8f0',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 150,
            }}>
              {user?.email || '—'}
            </div>
            <div style={{
              fontSize: 10,
              color: '#475569',
              fontFamily: "'DM Mono', monospace",
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}>
              {role || 'viewer'}
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: 'transparent',
            border: '1px solid #1e1e2e',
            borderRadius: 6,
            padding: '6px 10px',
            fontSize: 12,
            color: '#475569',
            cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif",
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#ef4444'
            e.currentTarget.style.color = '#ef4444'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = '#1e1e2e'
            e.currentTarget.style.color = '#475569'
          }}
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}
