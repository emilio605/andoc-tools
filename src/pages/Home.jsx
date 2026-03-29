import { Link } from 'react-router-dom';

const tools = [
  {
    path: '/onboarding',
    title: 'Onboarding SOP',
    icon: '📋',
    description: 'Guía paso a paso para el onboarding de clientes nuevos. 6 fases con tareas, notas y progreso.',
    color: '#F97316',
  },
  {
    path: '/brief',
    title: 'Brief de Descubrimiento',
    icon: '📝',
    description: 'Formulario completo para recopilar información del cliente en la reunión de descubrimiento.',
    color: '#EAB308',
  },
  {
    path: '/brief-ia',
    title: 'Brief IA (Auto-Completar)',
    icon: '✨',
    description: 'Pega la transcripción de la reunión y Claude completa automáticamente todos los campos.',
    color: '#A855F7',
  },
  {
    path: '/propuesta',
    title: 'Propuesta Comercial',
    icon: '💼',
    description: 'Generador de propuestas con servicios editables, precios en UF, IVA y vista previa.',
    color: '#3B82F6',
  },
];

export default function Home() {
  return (
    <div style={{
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      background: '#0f0f13',
      minHeight: '100vh',
      color: '#e2e8f0',
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a24 0%, #0f0f13 100%)',
        borderBottom: '1px solid #1e1e2e',
        padding: '60px 40px',
        textAlign: 'center',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          marginBottom: 16,
        }}>
          <div style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: '#F97316',
            boxShadow: '0 0 12px #F97316',
          }} />
          <span style={{
            fontSize: 12,
            fontFamily: "'DM Mono', monospace",
            color: '#F97316',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}>
            Andoc Creativo
          </span>
        </div>
        <h1 style={{
          fontSize: 48,
          fontWeight: 700,
          letterSpacing: '-0.03em',
          marginBottom: 12,
        }}>
          Herramientas Operacionales
        </h1>
        <p style={{
          fontSize: 16,
          color: '#94a3b8',
          maxWidth: 600,
          margin: '0 auto',
        }}>
          Panel integrado para gestionar onboarding, briefs y propuestas comerciales.
        </p>
      </div>

      {/* Tools Grid */}
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '60px 40px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 24,
      }}>
        {tools.map((tool) => (
          <Link
            key={tool.path}
            to={tool.path}
            style={{
              background: '#1a1a24',
              border: `1px solid #1e1e2e`,
              borderRadius: 12,
              padding: 28,
              textDecoration: 'none',
              transition: 'all 0.25s ease',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              hover: {
                borderColor: tool.color,
                transform: 'translateY(-4px)',
              },
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = tool.color;
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = `0 12px 32px ${tool.color}22`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#1e1e2e';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{
              fontSize: 32,
              marginBottom: 8,
            }}>
              {tool.icon}
            </div>
            <div>
              <div style={{
                fontSize: 11,
                fontFamily: "'DM Mono', monospace",
                color: tool.color,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: 6,
              }}>
                Herramienta
              </div>
              <h2 style={{
                fontSize: 18,
                fontWeight: 700,
                color: '#f8fafc',
                marginBottom: 10,
              }}>
                {tool.title}
              </h2>
              <p style={{
                fontSize: 14,
                color: '#94a3b8',
                lineHeight: 1.6,
              }}>
                {tool.description}
              </p>
            </div>
            <div style={{
              marginTop: 'auto',
              paddingTop: 16,
              borderTop: `1px solid #1e1e2e`,
              fontSize: 13,
              color: tool.color,
              fontWeight: 600,
            }}>
              Abrir →
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
