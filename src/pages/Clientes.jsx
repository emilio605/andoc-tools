import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const emptyForm = {
  name: '',
  industry: '',
  contact_email: '',
  contact_phone: '',
  status: 'activo',
  notes: '',
}

export default function Clientes() {
  const { user } = useAuth()
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filterStatus, setFilterStatus] = useState('todos')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    fetchClients()
  }, [])

  async function fetchClients() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setClients(data || [])
    } catch (err) {
      setError('Error al cargar clientes: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  function openNew() {
    setForm(emptyForm)
    setEditingId(null)
    setFormError('')
    setShowModal(true)
  }

  function openEdit(client) {
    setForm({
      name: client.name || '',
      industry: client.industry || '',
      contact_email: client.contact_email || '',
      contact_phone: client.contact_phone || '',
      status: client.status || 'activo',
      notes: client.notes || '',
    })
    setEditingId(client.id)
    setFormError('')
    setShowModal(true)
  }

  async function handleSave() {
    if (!form.name.trim()) {
      setFormError('El nombre es obligatorio.')
      return
    }
    setSaving(true)
    setFormError('')
    try {
      if (editingId) {
        const { error } = await supabase
          .from('clients')
          .update({ ...form })
          .eq('id', editingId)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('clients')
          .insert([{ ...form, user_id: user?.id }])
        if (error) throw error
      }
      setShowModal(false)
      fetchClients()
    } catch (err) {
      setFormError('Error al guardar: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('¿Eliminar este cliente?')) return
    try {
      const { error } = await supabase.from('clients').delete().eq('id', id)
      if (error) throw error
      setClients(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      setError('Error al eliminar: ' + err.message)
    }
  }

  const filtered = filterStatus === 'todos'
    ? clients
    : clients.filter(c => c.status === filterStatus)

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
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 28,
        }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
              Clientes
            </h1>
            <p style={{ fontSize: 13, color: '#475569', marginTop: 4 }}>
              Gestiona tu base de clientes
            </p>
          </div>
          <button
            onClick={openNew}
            style={{
              background: '#F97316',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '10px 18px',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#ea6f0d'}
            onMouseLeave={e => e.currentTarget.style.background = '#F97316'}
          >
            + Nuevo Cliente
          </button>
        </div>

        {/* Filtros */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {['todos', 'activo', 'inactivo'].map(f => (
            <button
              key={f}
              onClick={() => setFilterStatus(f)}
              style={{
                background: filterStatus === f ? 'rgba(249,115,22,0.15)' : 'transparent',
                border: filterStatus === f ? '1px solid rgba(249,115,22,0.4)' : '1px solid #1e1e2e',
                color: filterStatus === f ? '#F97316' : '#475569',
                borderRadius: 6,
                padding: '6px 14px',
                fontSize: 13,
                fontWeight: filterStatus === f ? 600 : 400,
                cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                textTransform: 'capitalize',
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 8,
            padding: '10px 14px',
            fontSize: 13,
            color: '#ef4444',
            marginBottom: 16,
          }}>
            {error}
          </div>
        )}

        {/* Tabla */}
        <div style={{
          background: '#1a1a24',
          border: '1px solid #1e1e2e',
          borderRadius: 12,
          overflow: 'hidden',
        }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#475569', fontSize: 14 }}>
              Cargando clientes...
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 60, textAlign: 'center', color: '#334155', fontSize: 14 }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🏢</div>
              No hay clientes {filterStatus !== 'todos' ? `con estado "${filterStatus}"` : 'registrados'}.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1e1e2e' }}>
                  {['Nombre', 'Industria', 'Contacto', 'Estado', 'Fecha', 'Acciones'].map(h => (
                    <th key={h} style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontSize: 11,
                      fontFamily: "'DM Mono', monospace",
                      color: '#334155',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      fontWeight: 600,
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => (
                  <tr
                    key={c.id}
                    style={{
                      borderBottom: i < filtered.length - 1 ? '1px solid #1e1e2e' : 'none',
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 600, color: '#f8fafc' }}>
                      {c.name}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#94a3b8' }}>
                      {c.industry || '—'}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#94a3b8' }}>
                      <div>{c.contact_email || '—'}</div>
                      {c.contact_phone && (
                        <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{c.contact_phone}</div>
                      )}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        background: c.status === 'activo' ? 'rgba(34,197,94,0.1)' : 'rgba(100,116,139,0.1)',
                        border: `1px solid ${c.status === 'activo' ? 'rgba(34,197,94,0.3)' : 'rgba(100,116,139,0.3)'}`,
                        color: c.status === 'activo' ? '#22c55e' : '#64748b',
                        borderRadius: 999,
                        padding: '2px 10px',
                        fontSize: 11,
                        fontWeight: 600,
                        textTransform: 'capitalize',
                      }}>
                        {c.status || 'activo'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: '#475569' }}>
                      {c.created_at ? new Date(c.created_at).toLocaleDateString('es-CL') : '—'}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => openEdit(c)}
                          style={{
                            background: 'transparent',
                            border: '1px solid #1e1e2e',
                            borderRadius: 6,
                            padding: '4px 10px',
                            fontSize: 12,
                            color: '#94a3b8',
                            cursor: 'pointer',
                            fontFamily: "'DM Sans', sans-serif",
                          }}
                          onMouseEnter={e => e.currentTarget.style.borderColor = '#F97316'}
                          onMouseLeave={e => e.currentTarget.style.borderColor = '#1e1e2e'}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          style={{
                            background: 'transparent',
                            border: '1px solid #1e1e2e',
                            borderRadius: 6,
                            padding: '4px 10px',
                            fontSize: 12,
                            color: '#94a3b8',
                            cursor: 'pointer',
                            fontFamily: "'DM Sans', sans-serif",
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.borderColor = '#ef4444'
                            e.currentTarget.style.color = '#ef4444'
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.borderColor = '#1e1e2e'
                            e.currentTarget.style.color = '#94a3b8'
                          }}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: 20,
        }}
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false) }}
        >
          <div style={{
            background: '#1a1a24',
            border: '1px solid #1e1e2e',
            borderRadius: 14,
            padding: '28px 32px',
            width: '100%',
            maxWidth: 480,
            maxHeight: '90vh',
            overflowY: 'auto',
          }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 24px', color: '#f8fafc' }}>
              {editingId ? 'Editar Cliente' : 'Nuevo Cliente'}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { key: 'name', label: 'Nombre *', type: 'text', placeholder: 'Nombre del cliente' },
                { key: 'industry', label: 'Industria', type: 'text', placeholder: 'Ej: E-commerce, Retail...' },
                { key: 'contact_email', label: 'Email de contacto', type: 'email', placeholder: 'correo@empresa.com' },
                { key: 'contact_phone', label: 'Teléfono', type: 'text', placeholder: '+56 9 1234 5678' },
              ].map(field => (
                <div key={field.key}>
                  <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 5 }}>
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    value={form[field.key]}
                    onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    style={{
                      background: '#0f0f13',
                      border: '1px solid #1e1e2e',
                      borderRadius: 8,
                      padding: '10px 12px',
                      color: '#e2e8f0',
                      fontSize: 14,
                      width: '100%',
                      outline: 'none',
                      fontFamily: "'DM Sans', sans-serif",
                      boxSizing: 'border-box',
                    }}
                    onFocus={e => e.target.style.borderColor = '#F97316'}
                    onBlur={e => e.target.style.borderColor = '#1e1e2e'}
                  />
                </div>
              ))}

              <div>
                <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 5 }}>
                  Estado
                </label>
                <select
                  value={form.status}
                  onChange={e => setForm(prev => ({ ...prev, status: e.target.value }))}
                  style={{
                    background: '#0f0f13',
                    border: '1px solid #1e1e2e',
                    borderRadius: 8,
                    padding: '10px 12px',
                    color: '#e2e8f0',
                    fontSize: 14,
                    width: '100%',
                    outline: 'none',
                    fontFamily: "'DM Sans', sans-serif",
                    cursor: 'pointer',
                  }}
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 5 }}>
                  Notas
                </label>
                <textarea
                  value={form.notes}
                  onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Notas internas sobre el cliente..."
                  rows={3}
                  style={{
                    background: '#0f0f13',
                    border: '1px solid #1e1e2e',
                    borderRadius: 8,
                    padding: '10px 12px',
                    color: '#e2e8f0',
                    fontSize: 14,
                    width: '100%',
                    outline: 'none',
                    fontFamily: "'DM Sans', sans-serif",
                    resize: 'vertical',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => e.target.style.borderColor = '#F97316'}
                  onBlur={e => e.target.style.borderColor = '#1e1e2e'}
                />
              </div>
            </div>

            {formError && (
              <div style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: 8,
                padding: '8px 12px',
                fontSize: 13,
                color: '#ef4444',
                marginTop: 12,
              }}>
                {formError}
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  flex: 1,
                  background: saving ? '#7c3d1a' : '#F97316',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '11px',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: saving ? 'not-allowed' : 'pointer',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {saving ? 'Guardando...' : (editingId ? 'Guardar cambios' : 'Crear cliente')}
              </button>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: 'transparent',
                  border: '1px solid #1e1e2e',
                  borderRadius: 8,
                  padding: '11px 20px',
                  fontSize: 14,
                  color: '#94a3b8',
                  cursor: 'pointer',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
