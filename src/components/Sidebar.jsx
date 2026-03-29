import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/onboarding', label: 'Onboarding', icon: '📋' },
  { path: '/brief', label: 'Brief Descubrimiento', icon: '📝' },
  { path: '/brief-ia', label: 'Brief IA', icon: '✨' },
  { path: '/propuesta', label: 'Propuesta Comercial', icon: '💼' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div style={{
      width: 220,
      flexShrink: 0,
      background: '#1a1a24',
      borderRight: '1px solid #1e1e2e',
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
      height: '100vh',
      overflow: 'auto',
      position: 'sticky',
      top: 0,
    }}>
      {/* Logo */}
      <div style={{
        padding: '12px 0',
        borderBottom: '1px solid #1e1e2e',
      }}>
        <div style={{
          fontSize: 14,
          fontWeight: 700,
          fontStyle: 'italic',
          color: '#F97316',
          letterSpacing: '0.02em',
        }}>
          ando creativo.cl
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                padding: '10px 12px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? '#f8fafc' : '#94a3b8',
                background: isActive ? '#1e1e2e' : 'transparent',
                border: isActive ? '1px solid #F97316' : '1px solid transparent',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.15s ease',
                cursor: 'pointer',
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{
        marginTop: 'auto',
        paddingTop: 16,
        borderTop: '1px solid #1e1e2e',
        fontSize: 11,
        color: '#475569',
        letterSpacing: '0.05em',
      }}>
        Andoc Creativo
      </div>
    </div>
  );
}
