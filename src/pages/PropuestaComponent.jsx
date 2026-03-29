import { useState } from "react";

const UF_HOY = 39841.72;
const IVA = 0.19;

const fmtUF = (uf) => `${Number(uf) % 1 === 0 ? Number(uf) : Number(uf).toFixed(1)} UF`;
const fmtCLP = (uf) => {
  const total = Math.round((Number(uf) * UF_HOY * (1 + IVA)) / 1000) * 1000;
  return "$" + total.toLocaleString("es-CL");
};

const DEFAULT_SERVICES = [
  {
    id: "paid_media", name: "Paid Media", icon: "⚡", color: "#F97316",
    desc: "Gestión y optimización de campañas en Meta Ads y Google Ads.",
    includes: ["Auditoría inicial de cuentas", "Estrategia de campañas basada en datos", "Gestión mensual de pauta", "Optimización de audiencias y creatividades", "Reporte mensual de resultados"],
    plans: [
      { name: "Starter", uf: 15, desc: "1 canal · hasta $500k en pauta" },
      { name: "Growth",  uf: 30, desc: "2 canales · hasta $1.5M en pauta" },
      { name: "Scale",   uf: 45, desc: "Multi-canal · pauta ilimitada" },
    ],
  },
  {
    id: "contenido", name: "Creación de Contenido", icon: "🎨", color: "#EAB308",
    desc: "Contenido visual y copy alineado a tu marca y objetivos.",
    includes: ["Calendario de contenido mensual", "Diseño de piezas para redes sociales", "Copywriting para publicaciones y anuncios", "Adaptación de formatos por plataforma", "Banco de contenido editable"],
    plans: [
      { name: "Básico",   uf: 8,  desc: "12 piezas / mes" },
      { name: "Estándar", uf: 10, desc: "25 piezas / mes + reels" },
      { name: "Premium",  uf: 15, desc: "Contenido ilimitado + video" },
    ],
  },
  {
    id: "auditoria", name: "Auditoría de Anuncios", icon: "🔍", color: "#22C55E",
    desc: "Diagnóstico de por qué tus anuncios no rinden como deberían.",
    includes: ["Revisión completa de estructura de campañas", "Análisis de audiencias y presupuesto", "Identificación de fugas de inversión", "Benchmarks del rubro", "Plan de acción priorizado"],
    plans: [
      { name: "Simple",   uf: 4, desc: "1 plataforma · entrega en 5 días" },
      { name: "Completa", uf: 7, desc: "Multi-plataforma · entrega en 7 días" },
    ],
  },
  {
    id: "web", name: "Desarrollo Web", icon: "🌐", color: "#3B82F6",
    desc: "Sitios web rápidos, claros y optimizados para generar resultados.",
    includes: ["Diseño UX/UI personalizado", "Desarrollo en WordPress o Shopify", "Optimización de velocidad y SEO técnico", "Integración con píxeles y analytics", "Capacitación para gestión autónoma"],
    plans: [
      { name: "Landing Page",      uf: 12, desc: "1 página · entrega en 10 días" },
      { name: "Sitio Corporativo", uf: 22, desc: "Hasta 6 páginas · entrega en 20 días" },
      { name: "Ecommerce",         uf: 38, desc: "Tienda online completa · Shopify" },
    ],
  },
  {
    id: "emailing", name: "Campañas de Emailing", icon: "📧", color: "#A855F7",
    desc: "Emails estratégicos que fortalecen la relación con tu audiencia y convierten.",
    includes: ["Diseño de flujos de automatización", "Segmentación de base de datos", "Diseño y redacción de emails", "Configuración en plataforma (Klaviyo / Mailchimp)", "Reporte de apertura, clics y conversiones"],
    plans: [
      { name: "Starter", uf: 5,  desc: "2 campañas / mes · hasta 5k contactos" },
      { name: "Growth",  uf: 9,  desc: "4 campañas + 1 flujo automático" },
      { name: "Pro",     uf: 14, desc: "Campañas ilimitadas + automatizaciones" },
    ],
  },
];

const DEFAULT_SETTING = { uf: 12 };

const formatDate = (d) => {
  if (!d) return "—";
  const [y, m, day] = d.split("-");
  const months = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
  return `${parseInt(day)} de ${months[parseInt(m) - 1]} de ${y}`;
};

// Inline UF editor
function UFEditor({ value, onChange, color = "#F97316" }) {
  const [editing, setEditing] = useState(false);
  const [tmp, setTmp] = useState(String(value));
  if (editing) return (
    <input
      autoFocus
      value={tmp}
      onChange={e => setTmp(e.target.value)}
      onBlur={() => { const n = parseFloat(tmp); if (!isNaN(n) && n > 0) onChange(n); setEditing(false); }}
      onKeyDown={e => { if (e.key === "Enter") { const n = parseFloat(tmp); if (!isNaN(n) && n > 0) onChange(n); setEditing(false); } }}
      style={{ width: 60, background: "transparent", border: `1px solid ${color}`, borderRadius: 4, padding: "2px 6px", fontSize: "inherit", fontWeight: "inherit", color: "inherit", fontFamily: "inherit", textAlign: "center" }}
    />
  );
  return (
    <span onClick={() => { setTmp(String(value)); setEditing(true); }}
      title="Click para editar"
      style={{ cursor: "text", borderBottom: `1px dashed ${color}55`, paddingBottom: 1 }}>
      {fmtUF(value)}
    </span>
  );
}

export default function PropuestaAndoc() {
  const [step, setStep] = useState(0);
  const [clientName, setClientName] = useState("");
  const [clientBiz, setClientBiz] = useState("");
  const [executiveName, setExecutiveName] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");
  const [selected, setSelected] = useState({});
  const [includeSetting, setIncludeSetting] = useState(true);

  // Editable prices state
  const [services, setServices] = useState(DEFAULT_SERVICES.map(s => ({ ...s, plans: s.plans.map(p => ({ ...p })) })));
  const [settingUF, setSettingUF] = useState(DEFAULT_SETTING.uf);

  const updatePlanUF = (svcId, planIdx, val) => {
    setServices(prev => prev.map(s => s.id !== svcId ? s : {
      ...s, plans: s.plans.map((p, i) => i !== planIdx ? p : { ...p, uf: val })
    }));
  };

  const togglePlan = (svcId, planIdx) => {
    setSelected(prev => {
      if (prev[svcId] === planIdx) { const n = { ...prev }; delete n[svcId]; return n; }
      return { ...prev, [svcId]: planIdx };
    });
  };

  const selectedServices = services.filter(s => selected[s.id] !== undefined);
  const totalMensualUF = selectedServices.reduce((acc, s) => acc + Number(s.plans[selected[s.id]].uf), 0);
  const totalMensualConIVA = +(totalMensualUF * (1 + IVA)).toFixed(1);

  return (
    <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif", background: "#0f0f13", minHeight: "100vh", color: "#e2e8f0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #1a1a24; } ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
        textarea, input { font-family: 'DM Sans', sans-serif; }
        textarea:focus, input:focus { outline: 2px solid #F97316; outline-offset: 1px; }
        .plan-card { transition: all 0.15s ease; cursor: pointer; }
        .plan-card:hover { transform: translateY(-2px); }
        .btn { transition: opacity 0.15s; cursor: pointer; font-family: inherit; }
        .btn:hover { opacity: 0.85; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .fade-in { animation: fadeIn 0.25s ease; }
        .edit-hint { opacity: 0; transition: opacity 0.15s; }
        .plan-card:hover .edit-hint { opacity: 1; }
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .print-doc { background: white !important; color: #111 !important; border: none !important; border-radius: 0 !important; }
        }
      `}</style>

      {/* Header */}
      <div className="no-print" style={{ background: "#1a1a24", borderBottom: "1px solid #1e1e2e", padding: "18px 28px" }}>
        <div style={{ maxWidth: 920, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#F97316", boxShadow: "0 0 8px #F97316" }} />
              <span style={{ fontSize: 11, fontFamily: "'DM Mono',monospace", color: "#F97316", letterSpacing: "0.12em", textTransform: "uppercase" }}>Andoc Creativo — Propuesta Comercial</span>
            </div>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: "#f8fafc" }}>Generador de Propuesta · UF + IVA · Precios editables</h1>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {["Datos", "Servicios", "Vista Previa"].map((s, i) => (
              <div key={i} onClick={() => { if (i <= step) setStep(i); }}
                style={{ padding: "6px 14px", borderRadius: 6, fontSize: 12, fontWeight: step === i ? 700 : 400, background: step === i ? "#F97316" : "#1e1e2e", color: step === i ? "#fff" : "#64748b", cursor: i <= step ? "pointer" : "default" }}>
                {i + 1}. {s}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 920, margin: "0 auto", padding: "28px" }}>

        {/* STEP 0 — Datos */}
        {step === 0 && (
          <div className="fade-in">
            <div style={{ background: "#1a1a24", borderRadius: 14, border: "1px solid #1e1e2e", padding: "28px 32px", marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontFamily: "'DM Mono',monospace", color: "#F97316", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 18 }}>Paso 1 — Datos del cliente</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[
                  { label: "Nombre del cliente / empresa", val: clientName, set: setClientName, placeholder: "Ej: Lust Clothing" },
                  { label: "Rubro o descripción breve", val: clientBiz, set: setClientBiz, placeholder: "Ej: Tienda de ropa femenina online" },
                  { label: "Ejecutivo responsable", val: executiveName, set: setExecutiveName, placeholder: "Tu nombre" },
                  { label: "Fecha de la propuesta", val: date, set: setDate, type: "date" },
                ].map(({ label, val, set, placeholder, type }) => (
                  <div key={label}>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>
                    <input type={type || "text"} value={val} onChange={e => set(e.target.value)} placeholder={placeholder}
                      style={{ width: "100%", background: "#0f0f13", border: "1px solid #2a2a3a", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#e2e8f0" }} />
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16 }}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Notas adicionales (opcional)</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Ej: Cliente llegó por referido de Camellia. Urgencia de comenzar en abril..." rows={3}
                  style={{ width: "100%", background: "#0f0f13", border: "1px solid #2a2a3a", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#e2e8f0", resize: "vertical" }} />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button className="btn" onClick={() => setStep(1)}
                style={{ padding: "11px 24px", borderRadius: 8, background: "#F97316", color: "#fff", border: "none", fontSize: 14, fontWeight: 700 }}>
                Elegir servicios →
              </button>
            </div>
          </div>
        )}

        {/* STEP 1 — Servicios */}
        {step === 1 && (
          <div className="fade-in">
            <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ fontSize: 11, fontFamily: "'DM Mono',monospace", color: "#EAB308", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 2 }}>Paso 2 — Selecciona servicios y planes</div>
                <p style={{ fontSize: 13, color: "#64748b" }}>Precios en UF + IVA · <span style={{ color: "#EAB308" }}>✏️ Haz click en cualquier UF para editarla</span></p>
              </div>
              {selectedServices.length > 0 && (
                <div style={{ background: "#1a1a24", border: "1px solid #F9731633", borderRadius: 10, padding: "10px 18px", textAlign: "right" }}>
                  {includeSetting && <div style={{ fontSize: 10, color: "#475569", marginBottom: 4, paddingBottom: 4, borderBottom: "1px solid #1e1e2e" }}>Setting inicial: {fmtUF(settingUF)} + IVA · pago único</div>}
                  <div style={{ fontSize: 11, color: "#64748b", marginBottom: 1 }}>Mensual recurrente</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#F97316" }}>{fmtUF(totalMensualUF)} <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 400 }}>+ IVA</span></div>
                  <div style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>{fmtUF(totalMensualConIVA)} c/IVA · ≈ {fmtCLP(totalMensualUF)} CLP</div>
                </div>
              )}
            </div>

            {/* Setting Inicial */}
            <div style={{ background: "#1a1a24", borderRadius: 12, border: includeSetting ? "1px solid #EC489955" : "1px solid #1e1e2e", padding: "20px 24px", marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 20 }}>⚙️</span>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: "#f8fafc" }}>Setting Inicial</span>
                      <span style={{ fontSize: 10, background: "#EC489922", color: "#EC4899", border: "1px solid #EC489944", padding: "2px 8px", borderRadius: 100, fontWeight: 700 }}>PAGO ÚNICO</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 2, maxWidth: 420 }}>Configuración de píxeles, accesos y todo lo necesario para comenzar a trabajar. Se cobra una sola vez al inicio.</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#f8fafc" }}>
                      <UFEditor value={settingUF} onChange={setSettingUF} color="#EC4899" /> <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 400 }}>+ IVA</span>
                    </div>
                    <div style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>≈ {fmtCLP(settingUF)} CLP c/IVA · una vez</div>
                  </div>
                  <div onClick={() => setIncludeSetting(!includeSetting)}
                    style={{ width: 44, height: 24, borderRadius: 100, background: includeSetting ? "#EC4899" : "#2a2a3a", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
                    <div style={{ position: "absolute", top: 3, left: includeSetting ? 23 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {["Configuración de píxel Meta y Google Tag", "Solicitud y gestión de accesos", "Auditoría técnica de cuentas", "Configuración de conversiones y seguimiento", "Revisión de activos digitales del cliente"].map((inc, i) => (
                  <span key={i} style={{ fontSize: 11, background: "#0f0f13", color: "#94a3b8", padding: "3px 8px", borderRadius: 4, border: "1px solid #2a2a3a" }}>✓ {inc}</span>
                ))}
              </div>
            </div>

            {/* Servicios mensuales */}
            {services.map((svc) => (
              <div key={svc.id} style={{ background: "#1a1a24", borderRadius: 12, border: selected[svc.id] !== undefined ? `1px solid ${svc.color}55` : "1px solid #1e1e2e", padding: "20px 24px", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: 20 }}>{svc.icon}</span>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#f8fafc" }}>{svc.name}</div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>{svc.desc}</div>
                  </div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
                  {svc.includes.map((inc, i) => (
                    <span key={i} style={{ fontSize: 11, background: "#0f0f13", color: "#94a3b8", padding: "3px 8px", borderRadius: 4, border: "1px solid #2a2a3a" }}>✓ {inc}</span>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {svc.plans.map((plan, idx) => {
                    const isActive = selected[svc.id] === idx;
                    return (
                      <div key={idx} className="plan-card" onClick={() => togglePlan(svc.id, idx)}
                        style={{ flex: "1 1 130px", padding: "14px 16px", borderRadius: 10, background: isActive ? `${svc.color}15` : "#0f0f13", border: `2px solid ${isActive ? svc.color : "#2a2a3a"}`, position: "relative" }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: isActive ? svc.color : "#64748b", marginBottom: 4 }}>{plan.name}</div>
                        {/* Precio editable */}
                        <div style={{ fontSize: 20, fontWeight: 800, color: isActive ? "#f8fafc" : "#475569" }}
                          onClick={e => e.stopPropagation()}>
                          <UFEditor value={plan.uf} onChange={val => updatePlanUF(svc.id, idx, val)} color={svc.color} />
                        </div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: isActive ? svc.color : "#475569", marginTop: 1 }}>+ IVA / mes</div>
                        <div style={{ fontSize: 10, color: "#334155", marginTop: 5 }}>≈ {fmtCLP(plan.uf)} CLP c/IVA</div>
                        <div style={{ fontSize: 10, color: "#334155", marginTop: 1 }}>{plan.desc}</div>
                        {isActive && <div style={{ fontSize: 10, color: svc.color, fontWeight: 700, marginTop: 6 }}>✓ Seleccionado</div>}
                        <div className="edit-hint" style={{ position: "absolute", top: 8, right: 10, fontSize: 9, color: svc.color }}>✏️ editar UF</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
              <button className="btn" onClick={() => setStep(0)}
                style={{ padding: "10px 20px", borderRadius: 8, background: "#1e1e2e", color: "#94a3b8", border: "1px solid #2a2a3a", fontSize: 13 }}>
                ← Atrás
              </button>
              <button className="btn" onClick={() => setStep(2)} disabled={selectedServices.length === 0 && !includeSetting}
                style={{ padding: "11px 24px", borderRadius: 8, background: selectedServices.length === 0 && !includeSetting ? "#1e1e2e" : "#F97316", color: selectedServices.length === 0 && !includeSetting ? "#475569" : "#fff", border: "none", fontSize: 14, fontWeight: 700, cursor: selectedServices.length === 0 && !includeSetting ? "default" : "pointer" }}>
                Ver propuesta →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 — Vista previa */}
        {step === 2 && (
          <div className="fade-in">
            <div className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
              <div style={{ fontSize: 11, fontFamily: "'DM Mono',monospace", color: "#22C55E", letterSpacing: "0.1em", textTransform: "uppercase" }}>Paso 3 — Propuesta lista para enviar</div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn" onClick={() => setStep(1)}
                  style={{ padding: "9px 16px", borderRadius: 8, background: "#1e1e2e", color: "#94a3b8", border: "1px solid #2a2a3a", fontSize: 12 }}>← Editar</button>
                <button className="btn" onClick={() => window.print()}
                  style={{ padding: "9px 18px", borderRadius: 8, background: "#22C55E", color: "#fff", border: "none", fontSize: 13, fontWeight: 700 }}>🖨 Exportar PDF</button>
              </div>
            </div>

            <div className="print-doc" style={{ background: "#1a1a24", borderRadius: 16, border: "1px solid #1e1e2e", overflow: "hidden" }}>
              {/* Cover */}
              <div style={{ background: "linear-gradient(135deg, #0f0f13 0%, #1a0f24 100%)", padding: "48px 48px 36px", borderBottom: "1px solid #1e1e2e", position: "relative" }}>
                <div style={{ position: "absolute", top: 0, right: 0, width: 280, height: 280, background: "radial-gradient(circle, #F9731618 0%, transparent 70%)", pointerEvents: "none" }} />
                <div style={{ fontSize: 11, fontFamily: "'DM Mono',monospace", color: "#F97316", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 18 }}>Andoc Creativo · Performance Marketing</div>
                <h1 style={{ fontSize: 34, fontWeight: 800, color: "#f8fafc", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 6 }}>Propuesta<br />Comercial</h1>
                <p style={{ fontSize: 15, color: "#94a3b8", marginBottom: 28 }}>Preparada para <span style={{ color: "#f8fafc", fontWeight: 600 }}>{clientName || "—"}</span></p>
                <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
                  {[["Cliente", clientName || "—"], ["Rubro", clientBiz || "—"], ["Fecha", formatDate(date)], ["Ejecutivo", executiveName || "—"]].map(([label, val]) => (
                    <div key={label}>
                      <div style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>{label}</div>
                      <div style={{ fontSize: 13, color: "#e2e8f0", fontWeight: 500 }}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ padding: "36px 48px" }}>
                <div style={{ fontSize: 11, fontFamily: "'DM Mono',monospace", color: "#64748b", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>Servicios y valores</div>

                {/* Setting Inicial */}
                {includeSetting && (
                  <div style={{ marginBottom: 22, paddingBottom: 22, borderBottom: "1px solid #1e1e2e" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: 8, background: "#EC489918", border: "1px solid #EC489944", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⚙️</div>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 15, fontWeight: 700, color: "#f8fafc" }}>Setting Inicial</span>
                            <span style={{ fontSize: 10, background: "#EC489922", color: "#EC4899", border: "1px solid #EC489944", padding: "2px 8px", borderRadius: 100, fontWeight: 700 }}>PAGO ÚNICO</span>
                          </div>
                          <div style={{ fontSize: 11, color: "#EC4899", fontWeight: 600, marginTop: 2 }}>Configuración inicial completa · pago único al inicio</div>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 22, fontWeight: 800, color: "#f8fafc" }}>{fmtUF(settingUF)} <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 400 }}>+ IVA</span></div>
                        <div style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>≈ {fmtCLP(settingUF)} CLP c/IVA · solo una vez</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {["Configuración de píxel Meta y Google Tag", "Solicitud y gestión de accesos", "Auditoría técnica de cuentas", "Configuración de conversiones y seguimiento", "Revisión de activos digitales del cliente"].map((inc, i) => (
                        <span key={i} style={{ fontSize: 11, background: "#0f0f13", color: "#94a3b8", padding: "3px 8px", borderRadius: 4, border: "1px solid #2a2a3a" }}>✓ {inc}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Servicios mensuales */}
                {selectedServices.map((svc) => {
                  const plan = svc.plans[selected[svc.id]];
                  return (
                    <div key={svc.id} style={{ marginBottom: 22, paddingBottom: 22, borderBottom: "1px solid #1e1e2e" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 34, height: 34, borderRadius: 8, background: `${svc.color}18`, border: `1px solid ${svc.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{svc.icon}</div>
                          <div>
                            <div style={{ fontSize: 15, fontWeight: 700, color: "#f8fafc" }}>{svc.name}</div>
                            <div style={{ fontSize: 11, color: svc.color, fontWeight: 600 }}>Plan {plan.name} · {plan.desc}</div>
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 22, fontWeight: 800, color: "#f8fafc" }}>{fmtUF(plan.uf)} <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 400 }}>+ IVA</span></div>
                          <div style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>≈ {fmtCLP(plan.uf)} CLP c/IVA · mensual · ref. UF ${UF_HOY.toLocaleString("es-CL")}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                        {svc.includes.map((inc, i) => (
                          <span key={i} style={{ fontSize: 11, background: "#0f0f13", color: "#94a3b8", padding: "3px 8px", borderRadius: 4, border: "1px solid #2a2a3a" }}>✓ {inc}</span>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {/* Resumen inversión */}
                <div style={{ background: "#0f0f13", borderRadius: 12, padding: "20px 24px", border: "1px solid #F9731633", marginBottom: 12 }}>
                  {includeSetting && (
                    <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 12, marginBottom: 12, borderBottom: "1px solid #1e1e2e" }}>
                      <div>
                        <div style={{ fontSize: 12, color: "#94a3b8" }}>Setting Inicial <span style={{ fontSize: 10, color: "#EC4899", fontWeight: 700 }}>· pago único</span></div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "#EC4899" }}>{fmtUF(settingUF)} + IVA</div>
                        <div style={{ fontSize: 10, color: "#475569" }}>≈ {fmtCLP(settingUF)} CLP c/IVA</div>
                      </div>
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 4 }}>Inversión mensual recurrente</div>
                      <div style={{ fontSize: 11, color: "#475569" }}>Valores en UF · Factura electrónica incluida</div>
                      <div style={{ fontSize: 11, color: "#334155", marginTop: 2 }}>UF ref.: ${UF_HOY.toLocaleString("es-CL")} CLP ({formatDate(date)})</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 26, fontWeight: 800, color: "#F97316" }}>{fmtUF(totalMensualUF)} + IVA</div>
                      <div style={{ fontSize: 13, color: "#94a3b8" }}>{fmtUF(totalMensualConIVA)} total c/IVA</div>
                      <div style={{ fontSize: 10, color: "#475569", marginTop: 1 }}>≈ {fmtCLP(totalMensualUF)} CLP c/IVA</div>
                    </div>
                  </div>
                </div>

                {/* Nota legal */}
                <div style={{ padding: "10px 14px", borderRadius: 8, background: "#0f0f13", border: "1px solid #2a2a3a", marginBottom: notes ? 12 : 24 }}>
                  <p style={{ fontSize: 11, color: "#475569", lineHeight: 1.6 }}>
                    Valores en <strong style={{ color: "#64748b" }}>UF neta + IVA (19%)</strong>. El monto en pesos se calcula según la UF vigente al día de emisión de la factura electrónica. Los valores CLP indicados son de referencia y pueden variar según la UF del mes en curso.
                  </p>
                </div>

                {notes && (
                  <div style={{ background: "#0f0f13", borderRadius: 10, padding: "14px 18px", border: "1px solid #2a2a3a", marginBottom: 24 }}>
                    <div style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Notas adicionales</div>
                    <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>{notes}</p>
                  </div>
                )}

                {/* Proceso */}
                <div style={{ paddingTop: 24, borderTop: "1px solid #1e1e2e" }}>
                  <div style={{ fontSize: 11, fontFamily: "'DM Mono',monospace", color: "#64748b", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>Nuestro proceso</div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {["Auditar", "Planificar", "Implementar", "Optimizar", "Resultados"].map((s, i) => (
                      <div key={i} style={{ flex: "1 1 100px", background: "#0f0f13", borderRadius: 8, padding: "12px 14px", border: "1px solid #1e1e2e", textAlign: "center" }}>
                        <div style={{ fontSize: 10, color: "#F97316", fontFamily: "'DM Mono',monospace", marginBottom: 4 }}>0{i + 1}</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{s}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div style={{ marginTop: 24, textAlign: "center", padding: "22px", background: "linear-gradient(135deg, #F9731611, #A855F711)", borderRadius: 12, border: "1px solid #F9731622" }}>
                  <p style={{ fontSize: 15, color: "#f8fafc", fontWeight: 600, marginBottom: 4 }}>¿Listo para escalar tu facturación?</p>
                  <p style={{ fontSize: 12, color: "#64748b" }}>andocreativo.cl · hola@andocreativo.cl</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
