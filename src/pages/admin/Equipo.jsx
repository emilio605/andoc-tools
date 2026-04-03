import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import { supabase } from '../../lib/supabase'

const ROLES = [
  {
    id: 'admin',
    label: 'Admin',
    color: '#F97316',
    desc: 'Acceso total. Puede gestionar usuarios, configuración y todas las herramientas.',
  },
  {
    id: 'editor',
    label: 'Editor',
    color: '#3B82F6',
    desc: 'Puede usar herramientas y gestionar clientes, pero no administrar usuarios.',
  },
  {
    id: 'viewer',
    label: 'Viewer',
    color: '#22C55E',
    desc: 'Solo puede ver y usar las herramientas. Sin permisos de edición en clientes.',
  },
]

export default function Equipo() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('editor')
  const [inviting, setInviting] = useState(false)
  const [inviteMsg, setInviteMsg] = useState('')
  const [inviteError, setInviteError] = useState('')

  useEffect(() => {
    fetchMembers()
  }, [])

  async function fetchMembers() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setMembers(data || [])
    } catch (err) {
      setError('Error al cargar el equipo: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdateRole(userId, newRole) {
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ role: newRole })
        .eq('user_id', userId)
      if (error) throw error
      setMembers(prev => prev.map(m => m.user_id === userId ? { ...m, role: newRole } : m))
    } catch (err) {
      setError('Error al actualizar rol: ' + err.message)
    }
  }

  async function handleInvite(e) {
    e.preventDefault()
    if (!inviteEmail.trim()) return
    setInviting(true)
    setInviteMsg('')
    setInviteError('')
    try {
      // Nota: inviteUserByEmail requiere service_role key (no disponible en frontend)
      // Mostramos instrucciones manuales como alternativa segura
      setInviteMsg(`Para invitar a ${inviteEmail} con rol "${inviteRole}":\n1. Ve al panel de Supabase → Authentication → Users\n2. Haz clic en "Invite user" e ingresa el email\n3. Después agrega el registro manualmente en la tabla user_roles con user_id, role="${inviteRole}"`)
    } catch (err) {
      setInviteError('Error: ' + err.message)
    } finally {
      setInviting(false)
    }
  }

  const inputStyle = {
    background: '#0f0f13',
    border: '1px solid #1e1e2e',
    borderRadius: 8,
    padding: '10px 12px',
    color: '#e2e8f0',
    fontSize: 14,
    outline: 'none',
    fontFamily: "'DM Sans', sans-serif",
  }

  return (
    <Layout>
      <div style={{
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        background: '#0f0f13',
        minHeight: '100vh',
        color: '#e2e8f0',
        padding: '36px 40px',
      }}>
        <div style={{ maxWidth: 800 }}>
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
              Equipo & Accesos
            </h1>
            <p style={{ fontSize: 13, color: '#475569', marginTop: 4 }}>
              Gestión de miembros y roles del equipo
            </p>
          </div>

          {/* Roles */}
          <div style={{
            background: '#1a1a24',
            border: '1px solid #1e1e2e',
            borderRadius: 12,
            padding: '20px 24px',
            marginBottom: 24,
          }}>
            <div style={{
              fontSize: 11, fontWeight: 700, color: '#475569',
              textTransform: 'uppercase', letterSpacing: '0.08em',
              marginBottom: 14, fontFamily: "'DM Mono', monospace",
            }}>
              Descripción de roles
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {ROLES.map(r => (
                <div key={r.id} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 12,
                  padding: '12px 14px',
                  background: '#0f0f13',
                  border: '1px solid #1e1e2e',
                  borderRadius: 8,
                }}>
                  <span style={{
                    background: `rgba(${hexToRgb(r.color)}, 0.15)`,
                    border: `1px solid rgba(${hexToRgb(r.color)}, 0.3)`,
                    color: r.color,
                    borderRadius: 999,
                    padding: '2px 10px',
                    fontSize: 11,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}>
                    {r.label}
                  </span>
                  <span style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.5 }}>
                    {r.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Lista de miembros */}
          <div style={{
            background: '#1a1a24',
            border: '1px solid #1e1e2e',
            borderRadius: 12,
            overflow: 'hidden',
            marginBottom: 24,
          }}>
            <div style={{
              padding: '16px 24px',
              borderBottom: '1px solid #1e1e2e',
              fontSize: 11, fontWeight: 700, color: '#475569',
              textTransform: 'uppercase', letterSpacing: '0.08em',
              fontFamily: "'DM Mono', monospace",
            }}>
              Miembros del equipo
            </div>

            {error && (
              <div style={{ padding: '12px 24px', color: '#ef4444', fontSize: 13 }}>{error}</div>
            )}

            {loading ? (
              <div style={{ padding: 40, textAlign: 'center', color: '#475569', fontSize: 14 }}>
                Cargando equipo...
              </div>
            ) : members.length === 0 ? (
              <div style={{ padding: '40px 24px', textAlign: 'center', color: '#334155', fontSize: 13 }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>👥</div>
                No hay miembros registrados en la tabla user_roles.
              </div>
            ) : (
              <div>
                {members.map((m, i) => {
                  const roleInfo = ROLES.find(r => r.id === m.role) || ROLES[2]
                  return (
                    <div
                      key={m.id || i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '14px 24px',
                        borderBottom: i < members.length - 1 ? '1px solid #1e1e2e' : 'none',
                        gap: 16,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: '50%',
                          background: `rgba(${hexToRgb(roleInfo.color)}, 0.15)`,
                          border: `1px solid rgba(${hexToRgb(roleInfo.color)}, 0.3)`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 13, color: roleInfo.color, fontWeight: 700,
                        }}>
                          {(m.email || m.user_id || '?')[0].toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: '#f8fafc' }}>
                            {m.email || m.user_id}
                          </div>
                          <div style={{ fontSize: 11, color: '#475569', marginTop: 1 }}>
                            Registrado: {m.created_at ? new Date(m.created_at).toLocaleDateString('es-CL') : '—'}
                          </div>
                        </div>
                      </div>

                      <select
                        value={m.role || 'viewer'}
                        onChange={e => handleUpdateRole(m.user_id, e.target.value)}
                        style={{
                          ...inputStyle,
                          padding: '6px 10px',
                          fontSize: 13,
                          cursor: 'pointer',
                          color: roleInfo.color,
                          borderColor: `rgba(${hexToRgb(roleInfo.color)}, 0.3)`,
                        }}
                      >
                        {ROLES.map(r => (
                          <option key={r.id} value={r.id}>{r.label}</option>
                        ))}
                      </select>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Invitar */}
          <div style={{
            background: '#1a1a24',
            border: '1px solid #1e1e2e',
            borderRadius: 12,
            padding: '20px 24px',
          }}>
            <div style={{
              fontSize: 11, fontWeight: 700, color: '#475569',
              textTransform: 'uppercase', letterSpacing: '0.08em',
              marginBottom: 16, fontFamily: "'DM Mono', monospace",
            }}>
              Invitar nuevo miembro
            </div>
            <form onSubmit={handleInvite} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 5 }}>
                    Email del nuevo miembro
                  </label>
                  <input
                    type="email" value={inviteEmail}
                    onChange={e => setInviteEmail(e.target.value)}
                    placeholder="correo@empresa.com"
                    required
                    style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }}
                    onFocus={e => e.target.style.borderColor = '#F97316'}
                    onBlur={e => e.target.style.borderColor = '#1e1e2e'}
                  />
                </div>
                <div style={{ minWidth: 140 }}>
                  <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 5 }}>
                    Rol
                  </label>
                  <select
                    value={inviteRole}
                    onChange={e => setInviteRole(e.target.value)}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                  >
                    {ROLES.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={inviting}
                style={{
                  background: inviting ? '#7c3d1a' : '#F97316',
                  color: '#fff', border: 'none', borderRadius: 8,
                  padding: '10px 20px', fontSize: 14, fontWeight: 700,
                  cursor: inviting ? 'not-allowed' : 'pointer',
                  fontFamily: "'DM Sans', sans-serif",
                  alignSelf: 'flex-start',
                }}
              >
                {inviting ? 'Generando instrucciones...' : 'Ver instrucciones de invitación'}
              </button>

              {inviteMsg && (
                <div style={{
                  background: 'rgba(34,197,94,0.08)',
                  border: '1px solid rgba(34,197,94,0.25)',
                  borderRadius: 8, padding: '12px 14px',
                  fontSize: 13, color: '#94a3b8',
                  whiteSpace: 'pre-wrap', lineHeight: 1.7,
                }}>
                  <div style={{ fontWeight: 600, color: '#22c55e', marginBottom: 6 }}>
                    Instrucciones para invitar:
                  </div>
                  {inviteMsg}
                </div>
              )}

              {inviteError && (
                <div style={{
                  background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: 8, padding: '10px 12px', fontSize: 13, color: '#ef4444',
                }}>
                  {inviteError}
                </div>
              )}
            </form>
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
