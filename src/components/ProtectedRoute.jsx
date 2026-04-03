import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, requiredRoles = ['admin', 'editor', 'viewer'] }) {
  const { user, role, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#0f0f13',
        color: '#94a3b8',
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 14,
      }}>
        Cargando...
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (role && !requiredRoles.includes(role)) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#0f0f13',
        color: '#e2e8f0',
        fontFamily: "'DM Sans', sans-serif",
        gap: 12,
      }}>
        <div style={{ fontSize: 48 }}>🔒</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#f8fafc' }}>Acceso restringido</h2>
        <p style={{ color: '#94a3b8', fontSize: 14 }}>
          No tienes permisos para ver esta sección.
        </p>
      </div>
    )
  }

  return children
}
