import { useState, useEffect, useRef } from 'react'
import Layout from '../components/Layout'

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
               'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

function clp(n) {
  const s = n < 0 ? '-' : ''
  return s + '$' + Math.round(Math.abs(n)).toLocaleString('es-CL')
}

let globalRowId = 0

const DEFAULT_ROWS = [
  { id: ++globalRowId, cargo: 'Emilio', pago: '300000', colB: false, colC: false },
  { id: ++globalRowId, cargo: 'Javier', pago: '300000', colB: true, colC: false },
  { id: ++globalRowId, cargo: 'Rise', pago: '600000', colB: false, colC: false },
  { id: ++globalRowId, cargo: 'Diseño', pago: '200000', colB: false, colC: true },
  { id: ++globalRowId, cargo: 'CM', pago: '300000', colB: true, colC: false },
]

export default function FlujoCaja() {
  const now = new Date()
  const [tasaB, setTasaB] = useState('16')
  const [tasaC, setTasaC] = useState('20')
  const [tasaHon, setTasaHon] = useState('17')
  const [selMes, setSelMes] = useState(now.getMonth())
  const [selAnio, setSelAnio] = useState(now.getFullYear())
  const [nota, setNota] = useState('')
  const [ingresos, setIngresos] = useState('1900000')
  const [rows, setRows] = useState(DEFAULT_ROWS)
  const [hist, setHist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('flujo_cl_v2') || '[]') }
    catch { return [] }
  })
  const [activeTab, setActiveTab] = useState('tabla')
  const [tooltip, setTooltip] = useState(null)
  const chartRef = useRef(null)

  // Calculos derivados
  const tb = parseFloat(tasaB) / 100 || 0
  const tc = parseFloat(tasaC) / 100 || 0
  const ing = parseFloat(ingresos) || 0
  let tBase = 0, tIva = 0, tExtra = 0
  rows.forEach(r => {
    const p = parseFloat(r.pago) || 0
    tBase += p
    tIva += r.colB ? p * tb : 0
    tExtra += r.colC ? p * tc : 0
  })
  const totalEgr = tBase + tIva + tExtra
  const saldoAnt = hist.length > 0 ? hist[hist.length - 1].acum : 0
  const saldoMes = ing - totalEgr
  const saldoAcum = saldoAnt + saldoMes

  function addRow() {
    globalRowId++
    setRows(prev => [...prev, { id: globalRowId, cargo: '', pago: '', colB: false, colC: false }])
  }

  function removeRow(id) {
    setRows(prev => prev.filter(r => r.id !== id))
  }

  function updateRow(id, field, val) {
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: val } : r))
  }

  function limpiar() {
    if (!window.confirm('¿Limpiar el mes actual?')) return
    setIngresos('')
    setRows([])
  }

  function guardarMes() {
    const mes = parseInt(selMes)
    const anio = parseInt(selAnio) || now.getFullYear()
    const notaStr = nota.trim()

    let newHist = [...hist]
    const existe = newHist.find(h => h.mes === mes && h.anio === anio)
    if (existe && !window.confirm(`Ya tienes ${MESES[mes]} ${anio} guardado. ¿Reemplazar?`)) return
    if (existe) newHist = newHist.filter(h => !(h.mes === mes && h.anio === anio))

    const saldoAntActual = newHist.length > 0 ? newHist[newHist.length - 1].acum : 0
    const acum = saldoAntActual + saldoMes
    newHist.push({
      id: Date.now(), mes, anio, nota: notaStr, ing, tBase, tIva, tExtra,
      egr: totalEgr, saldoMes, saldoAnt: saldoAntActual, acum
    })
    newHist.sort((a, b) => a.anio !== b.anio ? a.anio - b.anio : a.mes - b.mes)
    let acc = 0
    newHist.forEach(h => { h.saldoAnt = acc; h.acum = acc + h.saldoMes; acc = h.acum })

    localStorage.setItem('flujo_cl_v2', JSON.stringify(newHist))
    setHist(newHist)

    // avanzar al siguiente mes
    const nextMes = (mes + 1) % 12
    const nextAnio = mes === 11 ? anio + 1 : anio
    setSelMes(nextMes)
    setSelAnio(nextAnio)
  }

  function delHist(id) {
    if (!window.confirm('¿Eliminar este mes del historial?')) return
    let newHist = hist.filter(h => h.id !== id)
    let acc = 0
    newHist.forEach(h => { h.saldoAnt = acc; h.acum = acc + h.saldoMes; acc = h.acum })
    localStorage.setItem('flujo_cl_v2', JSON.stringify(newHist))
    setHist(newHist)
  }

  // KPIs globales
  const sIng = hist.reduce((a, h) => a + h.ing, 0)
  const sEgr = hist.reduce((a, h) => a + h.egr, 0)
  const lastAcum = hist.length > 0 ? hist[hist.length - 1].acum : 0

  // Estilos base
  const cardStyle = {
    background: '#1a1a24',
    border: '1px solid #1e1e2e',
    borderRadius: 12,
    padding: '20px 24px',
    marginBottom: 16,
  }
  const cardTitleStyle = {
    fontSize: 11,
    fontWeight: 700,
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: 14,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontFamily: "'DM Mono', monospace",
  }
  const inputStyle = {
    background: '#0f0f13',
    border: '1px solid #1e1e2e',
    borderRadius: 6,
    padding: '8px 12px',
    color: '#f1f5f9',
    fontSize: 14,
    outline: 'none',
    fontFamily: "'DM Sans', sans-serif",
  }
  const smallInputStyle = { ...inputStyle, width: 80, textAlign: 'right', fontSize: 13 }

  return (
    <Layout>
      <div style={{
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        background: '#0f0f13',
        minHeight: '100vh',
        color: '#e2e8f0',
        padding: '36px 40px',
      }}>
        <div style={{ maxWidth: 900 }}>
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
              💰 Flujo de Caja
            </h1>
            <p style={{ fontSize: 13, color: '#475569', marginTop: 6 }}>
              Calcula ingresos, egresos, IVA y saldo mes a mes · Chile
            </p>
          </div>

          {/* Tasas */}
          <div style={cardStyle}>
            <div style={cardTitleStyle}>⚙️ Configuración de tasas</div>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-end' }}>
              {[
                { label: 'IVA — col B (%)', val: tasaB, set: setTasaB },
                { label: 'Recargo — col C (%)', val: tasaC, set: setTasaC },
                { label: 'Ret. honorarios (%)', val: tasaHon, set: setTasaHon },
              ].map(({ label, val, set }) => (
                <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={{ fontSize: 11, color: '#475569' }}>{label}</label>
                  <input
                    type="number" value={val} onChange={e => set(e.target.value)}
                    min="0" max="100" step="0.01"
                    style={smallInputStyle}
                    onFocus={e => e.target.style.borderColor = '#6366f1'}
                    onBlur={e => e.target.style.borderColor = '#1e1e2e'}
                  />
                </div>
              ))}
            </div>
            <p style={{ fontSize: 11, color: '#334155', marginTop: 10 }}>
              Las tasas son configurables. Ajústalas según corresponda.
            </p>
          </div>

          {/* Mes */}
          <div style={cardStyle}>
            <div style={cardTitleStyle}>📅 Mes a ingresar</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <select
                  value={selMes}
                  onChange={e => setSelMes(parseInt(e.target.value))}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  {MESES.map((m, i) => <option key={i} value={i}>{m}</option>)}
                </select>
                <input
                  type="number" value={selAnio} onChange={e => setSelAnio(e.target.value)}
                  min="2020" max="2099"
                  style={{ ...inputStyle, width: 76 }}
                />
                <input
                  type="text" value={nota} onChange={e => setNota(e.target.value)}
                  placeholder="Nota opcional"
                  style={{ ...inputStyle, width: 150 }}
                />
              </div>
              <div style={{
                background: '#0f0f13',
                border: '1px solid #6366f1',
                borderRadius: 6,
                padding: '5px 14px',
                fontSize: 13,
                color: '#818cf8',
                fontWeight: 600,
              }}>
                {MESES[selMes]} {selAnio}
              </div>
            </div>
          </div>

          {/* Ingresos */}
          <div style={cardStyle}>
            <div style={cardTitleStyle}>📥 Ingresos</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, color: '#94a3b8' }}>Total ingresos del mes</span>
              <input
                type="number" value={ingresos} onChange={e => setIngresos(e.target.value)}
                placeholder="0" min="0" step="1"
                style={{
                  ...inputStyle,
                  color: '#22c55e',
                  fontSize: 22,
                  fontWeight: 800,
                  width: 200,
                  textAlign: 'right',
                }}
                onFocus={e => e.target.style.borderColor = '#22c55e'}
                onBlur={e => e.target.style.borderColor = '#1e1e2e'}
              />
            </div>
          </div>

          {/* Egresos */}
          <div style={cardStyle}>
            <div style={{ ...cardTitleStyle, justifyContent: 'space-between' }}>
              <span>📤 Egresos</span>
              <span style={{ fontSize: 10, color: '#334155', textTransform: 'none', letterSpacing: 0, fontWeight: 400 }}>
                ✓ Col B = IVA ({tasaB}%) &nbsp;·&nbsp; ✓ Col C = Recargo ({tasaC}%)
              </span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr>
                    {[
                      { label: 'Cargo / Descripción', align: 'left', minW: 130 },
                      { label: 'Pago base', align: 'right', minW: 110 },
                      { label: `IVA\n${tasaB}%`, align: 'center', minW: 50 },
                      { label: `Recargo\n${tasaC}%`, align: 'center', minW: 60 },
                      { label: 'Monto IVA', align: 'right', minW: 90 },
                      { label: 'Monto extra', align: 'right', minW: 90 },
                      { label: 'Total', align: 'right', minW: 100 },
                      { label: '', align: 'center', minW: 32 },
                    ].map((h, i) => (
                      <th key={i} style={{
                        padding: '8px 8px',
                        textAlign: h.align,
                        fontSize: 10,
                        color: '#334155',
                        fontFamily: "'DM Mono', monospace",
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        borderBottom: '1px solid #1e1e2e',
                        whiteSpace: 'pre',
                        minWidth: h.minW,
                        fontWeight: 600,
                      }}>
                        {h.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ padding: '24px', textAlign: 'center', color: '#334155', fontSize: 13 }}>
                        ➕ Haz clic en "Agregar egreso" para comenzar
                      </td>
                    </tr>
                  ) : rows.map(r => {
                    const p = parseFloat(r.pago) || 0
                    const mB = r.colB ? p * tb : 0
                    const mC = r.colC ? p * tc : 0
                    const tot = p + mB + mC
                    return (
                      <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                        <td style={{ padding: '6px 6px' }}>
                          <input
                            type="text" value={r.cargo}
                            onChange={e => updateRow(r.id, 'cargo', e.target.value)}
                            placeholder="Cargo o descripción"
                            style={{ ...inputStyle, width: '100%', minWidth: 120, fontSize: 13, padding: '6px 8px' }}
                          />
                        </td>
                        <td style={{ padding: '6px 6px' }}>
                          <input
                            type="number" value={r.pago}
                            onChange={e => updateRow(r.id, 'pago', e.target.value)}
                            placeholder="0" min="0" step="1"
                            style={{ ...inputStyle, width: 110, textAlign: 'right', fontSize: 13, padding: '6px 8px' }}
                          />
                        </td>
                        <td style={{ padding: '6px 6px', textAlign: 'center' }}>
                          <input
                            type="checkbox" checked={r.colB}
                            onChange={e => updateRow(r.id, 'colB', e.target.checked)}
                            style={{ width: 15, height: 15, cursor: 'pointer', accentColor: '#6366f1' }}
                          />
                        </td>
                        <td style={{ padding: '6px 6px', textAlign: 'center' }}>
                          <input
                            type="checkbox" checked={r.colC}
                            onChange={e => updateRow(r.id, 'colC', e.target.checked)}
                            style={{ width: 15, height: 15, cursor: 'pointer', accentColor: '#6366f1' }}
                          />
                        </td>
                        <td style={{ padding: '6px 6px', textAlign: 'right', fontSize: 12, color: '#94a3b8' }}>
                          {mB > 0 ? clp(mB) : '—'}
                        </td>
                        <td style={{ padding: '6px 6px', textAlign: 'right', fontSize: 12, color: '#94a3b8' }}>
                          {mC > 0 ? clp(mC) : '—'}
                        </td>
                        <td style={{ padding: '6px 6px', textAlign: 'right', fontWeight: 700, fontSize: 13, color: '#f1f5f9' }}>
                          {clp(tot)}
                        </td>
                        <td style={{ padding: '6px 6px', textAlign: 'center' }}>
                          <button
                            onClick={() => removeRow(r.id)}
                            style={{
                              background: 'none', border: 'none', color: '#334155',
                              fontSize: 14, cursor: 'pointer', padding: '2px 6px', borderRadius: 4,
                            }}
                            onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                            onMouseLeave={e => e.currentTarget.style.color = '#334155'}
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <button
              onClick={addRow}
              style={{
                background: 'none',
                border: '1px dashed #1e1e2e',
                color: '#334155',
                borderRadius: 6,
                padding: '8px 16px',
                fontSize: 12,
                cursor: 'pointer',
                marginTop: 10,
                width: '100%',
                transition: 'all 0.2s',
                fontFamily: "'DM Sans', sans-serif",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.color = '#818cf8' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e1e2e'; e.currentTarget.style.color = '#334155' }}
            >
              ＋ Agregar egreso
            </button>
          </div>

          {/* Resumen */}
          <div style={cardStyle}>
            <div style={cardTitleStyle}>📊 Resumen del mes</div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
              {[
                { label: 'Total ingresos', val: clp(ing), color: '#22c55e' },
                { label: 'Total egresos', val: clp(totalEgr), color: '#ef4444' },
                { label: `IVA en egresos (col B)`, val: clp(tIva), color: '#eab308' },
                { label: `Recargo adicional (col C)`, val: clp(tExtra), color: '#a78bfa' },
              ].map(b => (
                <div key={b.label} style={{
                  background: '#0f0f13',
                  border: '1px solid #1e1e2e',
                  borderRadius: 8,
                  padding: '12px 14px',
                }}>
                  <div style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4, fontFamily: "'DM Mono', monospace" }}>
                    {b.label}
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: b.color }}>{b.val}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
              <div style={{
                background: 'linear-gradient(135deg,#1a2f4e,#1e2d45)',
                border: '1px solid #3b82f6',
                borderRadius: 10,
                padding: '14px 18px',
              }}>
                <div style={{ fontSize: 10, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4, fontFamily: "'DM Mono', monospace" }}>
                  Saldo del mes
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: saldoMes >= 0 ? '#22c55e' : '#ef4444', lineHeight: 1.1 }}>
                  {clp(saldoMes)}
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
                  {ing > 0 ? (saldoMes / ing * 100).toFixed(1) + '% de los ingresos' : ''}
                </div>
              </div>
              <div style={{
                background: 'linear-gradient(135deg,#1a3040,#1a2d38)',
                border: '1px solid #0d9488',
                borderRadius: 10,
                padding: '14px 18px',
              }}>
                <div style={{ fontSize: 10, color: '#2dd4bf', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4, fontFamily: "'DM Mono', monospace" }}>
                  Saldo acumulado
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: saldoAcum >= 0 ? '#2dd4bf' : '#ef4444', lineHeight: 1.1 }}>
                  {clp(saldoAcum)}
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
                  Saldo anterior: {clp(saldoAnt)}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button
                onClick={guardarMes}
                style={{
                  flex: 1, minWidth: 150,
                  padding: '11px 16px',
                  background: 'linear-gradient(135deg,#059669,#10b981)',
                  color: '#fff', border: 'none', borderRadius: 8,
                  fontSize: 14, fontWeight: 700, cursor: 'pointer',
                  fontFamily: "'DM Sans', sans-serif",
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                💾 Guardar mes en historial
              </button>
              <button
                onClick={limpiar}
                style={{
                  padding: '10px 18px',
                  background: 'none', border: '1px solid #1e1e2e',
                  color: '#64748b', borderRadius: 8, fontSize: 13, cursor: 'pointer',
                  fontFamily: "'DM Sans', sans-serif",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#64748b'; e.currentTarget.style.color = '#e2e8f0' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e1e2e'; e.currentTarget.style.color = '#64748b' }}
              >
                Limpiar
              </button>
            </div>
          </div>

          {/* Historial */}
          {hist.length > 0 && (
            <>
              {/* KPIs globales */}
              <div style={cardStyle}>
                <div style={cardTitleStyle}>📈 Resumen global acumulado</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                  {[
                    { label: 'Total ingresos', val: clp(sIng), color: '#22c55e' },
                    { label: 'Total egresos', val: clp(sEgr), color: '#ef4444' },
                    { label: 'Saldo acumulado', val: clp(lastAcum), color: lastAcum >= 0 ? '#22c55e' : '#ef4444' },
                  ].map(k => (
                    <div key={k.label} style={{
                      background: '#0f0f13', border: '1px solid #1e1e2e', borderRadius: 8, padding: '12px 14px',
                    }}>
                      <div style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4, fontFamily: "'DM Mono', monospace" }}>
                        {k.label}
                      </div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: k.color }}>{k.val}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detalle mes a mes */}
              <div style={cardStyle}>
                <div style={cardTitleStyle}>📆 Detalle mes a mes</div>

                {/* Tabs */}
                <div style={{ display: 'flex', borderBottom: '1px solid #1e1e2e', marginBottom: 16 }}>
                  {['tabla', 'grafica'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      style={{
                        padding: '8px 16px',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeTab === tab ? '2px solid #6366f1' : '2px solid transparent',
                        color: activeTab === tab ? '#818cf8' : '#475569',
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                        marginBottom: -1,
                        fontFamily: "'DM Sans', sans-serif",
                        textTransform: 'capitalize',
                      }}
                    >
                      {tab === 'tabla' ? 'Tabla' : 'Gráfica'}
                    </button>
                  ))}
                </div>

                {/* Tabla historial */}
                {activeTab === 'tabla' && (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, whiteSpace: 'nowrap' }}>
                      <thead>
                        <tr>
                          {['Mes', 'Ingresos', 'Egresos base', 'IVA (B)', 'Extra (C)', 'Total egresos', 'Saldo ant.', 'Saldo mes', 'Acumulado', ''].map((h, i) => (
                            <th key={i} style={{
                              background: '#0f0f13',
                              color: '#334155', fontSize: 10,
                              textTransform: 'uppercase', letterSpacing: '0.05em',
                              padding: '8px 10px', textAlign: i === 0 ? 'left' : 'right',
                              borderBottom: '1px solid #1e1e2e',
                              fontFamily: "'DM Mono', monospace",
                            }}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {hist.map(h => (
                          <tr key={h.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                            <td style={{ padding: '8px 10px', color: '#cbd5e1', fontWeight: 600 }}>
                              {MESES[h.mes]} {h.anio}
                              {h.nota && <span style={{
                                background: '#1a1a24', border: '1px solid #1e1e2e',
                                borderRadius: 999, padding: '1px 7px', fontSize: 10,
                                color: '#475569', marginLeft: 6,
                              }}>{h.nota}</span>}
                            </td>
                            <td style={{ padding: '8px 10px', textAlign: 'right', color: '#22c55e' }}>{clp(h.ing)}</td>
                            <td style={{ padding: '8px 10px', textAlign: 'right', color: '#e2e8f0' }}>{clp(h.tBase)}</td>
                            <td style={{ padding: '8px 10px', textAlign: 'right', color: '#eab308' }}>{clp(h.tIva)}</td>
                            <td style={{ padding: '8px 10px', textAlign: 'right', color: '#a78bfa' }}>{clp(h.tExtra)}</td>
                            <td style={{ padding: '8px 10px', textAlign: 'right', color: '#ef4444' }}>{clp(h.egr)}</td>
                            <td style={{ padding: '8px 10px', textAlign: 'right', color: '#94a3b8' }}>{clp(h.saldoAnt)}</td>
                            <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700, color: h.saldoMes >= 0 ? '#22c55e' : '#ef4444' }}>{clp(h.saldoMes)}</td>
                            <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 800, color: h.acum >= 0 ? '#2dd4bf' : '#ef4444' }}>{clp(h.acum)}</td>
                            <td style={{ padding: '8px 10px', textAlign: 'right' }}>
                              <button
                                onClick={() => delHist(h.id)}
                                style={{ background: 'none', border: 'none', color: '#334155', fontSize: 12, cursor: 'pointer', padding: '2px 6px' }}
                                onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                                onMouseLeave={e => e.currentTarget.style.color = '#334155'}
                              >✕</button>
                            </td>
                          </tr>
                        ))}
                        {/* Footer */}
                        <tr style={{ borderTop: '2px solid #1e1e2e', background: '#0f0f13' }}>
                          <td style={{ padding: '10px', fontWeight: 800, color: '#f1f5f9' }}>TOTAL</td>
                          <td style={{ padding: '10px', textAlign: 'right', fontWeight: 800, color: '#22c55e' }}>{clp(sIng)}</td>
                          <td style={{ padding: '10px', textAlign: 'right', fontWeight: 800 }}>{clp(hist.reduce((a, h) => a + h.tBase, 0))}</td>
                          <td style={{ padding: '10px', textAlign: 'right', fontWeight: 800, color: '#eab308' }}>{clp(hist.reduce((a, h) => a + h.tIva, 0))}</td>
                          <td style={{ padding: '10px', textAlign: 'right', fontWeight: 800, color: '#a78bfa' }}>{clp(hist.reduce((a, h) => a + h.tExtra, 0))}</td>
                          <td style={{ padding: '10px', textAlign: 'right', fontWeight: 800, color: '#ef4444' }}>{clp(sEgr)}</td>
                          <td style={{ padding: '10px', textAlign: 'right' }}>—</td>
                          <td style={{ padding: '10px', textAlign: 'right', fontWeight: 800, color: (sIng - sEgr) >= 0 ? '#22c55e' : '#ef4444' }}>{clp(sIng - sEgr)}</td>
                          <td style={{ padding: '10px', textAlign: 'right', fontWeight: 800, color: lastAcum >= 0 ? '#2dd4bf' : '#ef4444' }}>{clp(lastAcum)}</td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Gráfica */}
                {activeTab === 'grafica' && (
                  <div>
                    {hist.length < 2 ? (
                      <div style={{ textAlign: 'center', color: '#334155', padding: '40px 16px', fontSize: 13 }}>
                        <div style={{ fontSize: 28, marginBottom: 8 }}>📈</div>
                        Agrega al menos 2 meses para ver la gráfica.
                      </div>
                    ) : (
                      <ChartSVG hist={hist} />
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  )
}

function ChartSVG({ hist }) {
  const W = 800, H = 270, P = { t: 20, r: 20, b: 42, l: 95 }
  const cW = W - P.l - P.r, cH = H - P.t - P.b
  const saldos = hist.map(h => h.saldoMes)
  const acums = hist.map(h => h.acum)
  const all = [...saldos, ...acums]
  const minV = Math.min(0, ...all), maxV = Math.max(0, ...all)
  const range = maxV - minV || 1
  const yS = v => P.t + cH - ((v - minV) / range) * cH
  const y0 = yS(0)
  const xP = i => P.l + (i + 0.5) * (cW / hist.length)
  const bW = Math.max(8, Math.min(42, cW / hist.length - 10))

  const gridLines = []
  for (let i = 0; i <= 4; i++) {
    const v = minV + (range / 4) * i
    const y = yS(v)
    const abs = Math.abs(Math.round(v))
    const lbl = (v < 0 ? '-' : '') + '$' + (abs >= 1000000 ? (abs / 1000000).toFixed(1) + 'M' : abs >= 1000 ? (abs / 1000).toFixed(0) + 'K' : abs.toLocaleString('es-CL'))
    gridLines.push({ v, y, lbl })
  }

  const pts = hist.map((_, i) => `${xP(i)},${yS(acums[i])}`).join(' ')

  return (
    <div>
      <p style={{ fontSize: 11, color: '#475569', marginBottom: 8 }}>
        Barras = saldo del mes &nbsp;·&nbsp; Línea = saldo acumulado
      </p>
      <div style={{ position: 'relative', overflowX: 'auto' }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block' }}>
          {gridLines.map((g, i) => (
            <g key={i}>
              <line x1={P.l} y1={g.y} x2={W - P.r} y2={g.y} stroke="#1e3a55" strokeWidth="1" />
              <text x={P.l - 6} y={g.y + 4} textAnchor="end" fontSize="10" fill="#334155">{g.lbl}</text>
            </g>
          ))}
          <line x1={P.l} y1={y0} x2={W - P.r} y2={y0} stroke="#334155" strokeWidth="1.5" />
          {hist.map((h, i) => {
            const yTop = h.saldoMes >= 0 ? yS(h.saldoMes) : y0
            const hh = Math.max(Math.abs(yS(h.saldoMes) - y0), 2)
            const col = h.saldoMes >= 0 ? '#22c55e' : '#ef4444'
            return (
              <rect
                key={h.id}
                x={xP(i) - bW / 2} y={yTop} width={bW} height={hh}
                fill={col} rx="3" opacity="0.85"
                style={{ cursor: 'pointer' }}
              />
            )
          })}
          <polyline points={pts} fill="none" stroke="#2dd4bf" strokeWidth="2.5" strokeLinejoin="round" />
          {hist.map((_, i) => (
            <circle key={i} cx={xP(i)} cy={yS(acums[i])} r="4" fill="#2dd4bf" stroke="#0f172a" strokeWidth="2" />
          ))}
          {hist.map((h, i) => (
            <g key={`label-${i}`}>
              <text x={xP(i)} y={H - P.b + 15} textAnchor="middle" fontSize="10" fill="#475569">
                {MESES[h.mes].slice(0, 3)}
              </text>
              <text x={xP(i)} y={H - P.b + 26} textAnchor="middle" fontSize="9" fill="#334155">
                {String(h.anio).slice(2)}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 10 }}>
        {[
          { label: 'Saldo positivo', type: 'dot', color: '#22c55e' },
          { label: 'Saldo negativo', type: 'dot', color: '#ef4444' },
          { label: 'Acumulado', type: 'line', color: '#2dd4bf' },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#94a3b8' }}>
            {l.type === 'dot'
              ? <div style={{ width: 10, height: 10, borderRadius: '50%', background: l.color }} />
              : <div style={{ width: 24, height: 3, borderRadius: 2, background: l.color }} />
            }
            {l.label}
          </div>
        ))}
      </div>
    </div>
  )
}
