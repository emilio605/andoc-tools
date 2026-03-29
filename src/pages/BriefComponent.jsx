import { useState } from "react";

const sections = [
  {
    id: "negocio",
    label: "El Negocio",
    icon: "🏢",
    color: "#F97316",
    fields: [
      { id: "nombre", label: "Nombre del negocio", type: "text", placeholder: "Ej: Lust Clothing" },
      { id: "rubro", label: "Rubro / industria", type: "text", placeholder: "Ej: Moda, Ecommerce, Servicios..." },
      { id: "descripcion", label: "¿Qué venden / qué hacen?", type: "textarea", placeholder: "Descripción breve del negocio..." },
      { id: "diferenciador", label: "¿Qué los diferencia de la competencia?", type: "textarea", placeholder: "Propuesta de valor única..." },
      { id: "ticket", label: "Ticket promedio de venta", type: "text", placeholder: "Ej: $50.000 CLP" },
      { id: "facturacion", label: "Facturación mensual aproximada", type: "text", placeholder: "Ej: $5M–$10M CLP" },
    ],
  },
  {
    id: "objetivo",
    label: "Objetivos y Desafíos",
    icon: "🎯",
    color: "#EAB308",
    fields: [
      { id: "objetivo_principal", label: "¿Cuál es el objetivo principal?", type: "select", options: ["Aumentar ventas", "Reducir costo de adquisición", "Escalar facturación", "Ganar visibilidad de marca", "Otro"] },
      { id: "meta_3meses", label: "¿Qué quieren lograr en 3 meses?", type: "textarea", placeholder: "Meta concreta y medible..." },
      { id: "problema_actual", label: "¿Cuál es el mayor problema actual?", type: "textarea", placeholder: "Ej: No sabemos por qué bajaron las ventas..." },
      { id: "intentos_previos", label: "¿Han trabajado con otra agencia antes?", type: "select", options: ["No, es primera vez", "Sí, con buena experiencia", "Sí, con mala experiencia"] },
      { id: "que_no_funciono", label: "¿Qué no funcionó anteriormente?", type: "textarea", placeholder: "Si aplica..." },
    ],
  },
  {
    id: "audiencia",
    label: "Audiencia y Mercado",
    icon: "👥",
    color: "#22C55E",
    fields: [
      { id: "cliente_ideal", label: "¿Quién es su cliente ideal?", type: "textarea", placeholder: "Edad, género, intereses, ubicación..." },
      { id: "donde_compran", label: "¿Dónde compran/interactúan sus clientes?", type: "textarea", placeholder: "Ej: Instagram, Google, tienda física..." },
      { id: "competidores", label: "Principales competidores", type: "textarea", placeholder: "Nombres o URLs..." },
      { id: "mercado", label: "¿Venden solo en Chile o también al extranjero?", type: "select", options: ["Solo Chile", "Chile + Latinoamérica", "Internacional"] },
    ],
  },
  {
    id: "marketing",
    label: "Marketing Actual",
    icon: "📣",
    color: "#3B82F6",
    fields: [
      { id: "canales_activos", label: "Canales de marketing activos", type: "textarea", placeholder: "Ej: Meta Ads, Google Ads, email, orgánico..." },
      { id: "presupuesto_actual", label: "Inversión mensual actual en pauta", type: "text", placeholder: "Ej: $300.000 CLP" },
      { id: "herramientas", label: "Herramientas que usan (CRM, Analytics, etc.)", type: "textarea", placeholder: "Ej: GA4, Klaviyo, Shopify..." },
      { id: "contenido", label: "¿Tienen producción de contenido propia?", type: "select", options: ["Sí, equipo interno", "Sí, freelance externo", "No, lo necesitamos", "Parcialmente"] },
      { id: "resultados_actuales", label: "¿Qué métricas conocen de sus campañas actuales?", type: "textarea", placeholder: "ROAS, CPA, CTR, conversiones..." },
    ],
  },
  {
    id: "presupuesto",
    label: "Presupuesto y Decisión",
    icon: "💰",
    color: "#A855F7",
    fields: [
      { id: "presupuesto_agencia", label: "Presupuesto disponible para agencia (mensual)", type: "select", options: ["$200k–$500k CLP", "$500k–$1M CLP", "$1M–$2M CLP", "$2M+ CLP", "Por definir"] },
      { id: "presupuesto_pauta", label: "Presupuesto disponible para pauta (mensual)", type: "text", placeholder: "Ej: $500.000 CLP" },
      { id: "decision", label: "¿Quién toma la decisión de contratar?", type: "select", options: ["Yo solo", "Con socio/a", "Con directorio", "Otro"] },
      { id: "urgencia", label: "¿Cuándo quieren comenzar?", type: "select", options: ["Esta semana", "Este mes", "Próximo mes", "Sin fecha definida"] },
      { id: "dudas", label: "¿Tienen alguna duda o preocupación antes de decidir?", type: "textarea", placeholder: "Objeciones, preguntas pendientes..." },
    ],
  },
  {
    id: "notas",
    label: "Notas Internas",
    icon: "📝",
    color: "#EC4899",
    fields: [
      { id: "primera_impresion", label: "Primera impresión del cliente", type: "textarea", placeholder: "Actitud, claridad, nivel de urgencia..." },
      { id: "fit", label: "¿Es un buen fit para Andoc?", type: "select", options: ["Sí, claramente", "Probablemente sí", "Dudoso", "No es nuestro perfil"] },
      { id: "prioridad", label: "Prioridad de seguimiento", type: "select", options: ["Alta — cerrar esta semana", "Media — seguimiento en 2–3 días", "Baja — lead frío"] },
      { id: "siguiente_paso", label: "Siguiente paso acordado", type: "textarea", placeholder: "Ej: Enviar propuesta el jueves..." },
      { id: "ejecutivo", label: "Responsable de la cuenta", type: "text", placeholder: "Nombre del ejecutivo..." },
    ],
  },
];

export default function BriefDescubrimiento() {
  const [activeSection, setActiveSection] = useState("negocio");
  const [values, setValues] = useState({});
  const [clientName, setClientName] = useState("");
  const [reunionDate, setReunionDate] = useState("");

  const current = sections.find((s) => s.id === activeSection);

  const setValue = (id, val) => setValues((prev) => ({ ...prev, [id]: val }));

  const sectionComplete = (section) =>
    section.fields.filter((f) => values[f.id] && values[f.id].trim() !== "").length;

  const totalFields = sections.reduce((a, s) => a + s.fields.length, 0);
  const totalFilled = Object.values(values).filter((v) => v && v.trim() !== "").length;
  const progress = Math.round((totalFilled / totalFields) * 100);

  const exportText = () => {
    let text = `BRIEF DE DESCUBRIMIENTO — ANDOC CREATIVO\n`;
    text += `Cliente: ${clientName || "—"}\nFecha reunión: ${reunionDate || "—"}\n\n`;
    sections.forEach((s) => {
      text += `\n${"─".repeat(40)}\n${s.label.toUpperCase()}\n${"─".repeat(40)}\n`;
      s.fields.forEach((f) => {
        text += `\n${f.label}:\n${values[f.id] || "—"}\n`;
      });
    });
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Brief_${clientName || "Cliente"}_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
  };

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "#0f0f13", minHeight: "100vh", color: "#e2e8f0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #1a1a24; } ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
        textarea, input, select { font-family: 'DM Sans', sans-serif; }
        textarea:focus, input:focus, select:focus { outline: 2px solid var(--accent, #F97316); outline-offset: 1px; }
        .sec-btn:hover { background: #1e1e2e !important; }
        .sec-btn { transition: all 0.15s; cursor: pointer; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.2s ease; }
        .export-btn:hover { opacity: 0.85; transform: translateY(-1px); }
        .export-btn { transition: all 0.15s; }
        .nav-btn:hover { opacity: 0.85; }
        .nav-btn { transition: opacity 0.15s; cursor: pointer; }
      `}</style>

      {/* Header */}
      <div style={{ background: "#1a1a24", borderBottom: "1px solid #1e1e2e", padding: "24px 32px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#EAB308", boxShadow: "0 0 8px #EAB308" }} />
                <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: "#EAB308", letterSpacing: "0.12em", textTransform: "uppercase" }}>Andoc Creativo — Fase 2</span>
              </div>
              <h1 style={{ fontSize: 24, fontWeight: 700, color: "#f8fafc", letterSpacing: "-0.02em" }}>Brief de Descubrimiento</h1>
              <p style={{ fontSize: 13, color: "#64748b", marginTop: 3 }}>Reunión inicial · Clientes por referido</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 30, fontWeight: 700, color: progress >= 80 ? "#22C55E" : "#EAB308", letterSpacing: "-0.03em" }}>{progress}%</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>{totalFilled}/{totalFields} campos</div>
              </div>
              <button
                className="export-btn"
                onClick={exportText}
                style={{ padding: "10px 16px", borderRadius: 8, background: "#EAB308", color: "#0f0f13", border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer", letterSpacing: "0.02em" }}
              >
                ↓ Exportar
              </button>
            </div>
          </div>

          {/* Client + date */}
          <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, color: "#64748b" }}>Cliente:</span>
              <input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Nombre del cliente..." style={{ background: "#0f0f13", border: "1px solid #2a2a3a", borderRadius: 6, padding: "5px 10px", fontSize: 13, color: "#e2e8f0", width: 200 }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, color: "#64748b" }}>Fecha reunión:</span>
              <input type="date" value={reunionDate} onChange={(e) => setReunionDate(e.target.value)} style={{ background: "#0f0f13", border: "1px solid #2a2a3a", borderRadius: 6, padding: "5px 10px", fontSize: 13, color: "#e2e8f0" }} />
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ marginTop: 14, background: "#0f0f13", borderRadius: 100, height: 5 }}>
            <div style={{ height: "100%", width: `${progress}%`, background: progress >= 80 ? "#22C55E" : "linear-gradient(90deg, #EAB308, #F97316)", borderRadius: 100, transition: "width 0.4s ease" }} />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "24px 32px", display: "flex", gap: 24 }}>

        {/* Sidebar */}
        <div style={{ width: 190, flexShrink: 0 }}>
          <div style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: "#475569", letterSpacing: "0.1em", marginBottom: 10, textTransform: "uppercase" }}>Secciones</div>
          {sections.map((sec) => {
            const filled = sectionComplete(sec);
            const isActive = activeSection === sec.id;
            const allDone = filled === sec.fields.length;
            return (
              <div key={sec.id} className="sec-btn" onClick={() => setActiveSection(sec.id)}
                style={{ padding: "10px 12px", borderRadius: 8, marginBottom: 4, background: isActive ? "#1e1e2e" : "transparent", border: isActive ? `1px solid ${sec.color}33` : "1px solid transparent" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14 }}>{sec.icon}</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: isActive ? 600 : 400, color: isActive ? "#f8fafc" : "#94a3b8", lineHeight: 1.2 }}>{sec.label}</div>
                    <div style={{ fontSize: 10, color: allDone ? sec.color : "#475569", marginTop: 2 }}>{filled}/{sec.fields.length} completados</div>
                  </div>
                </div>
                <div style={{ marginTop: 6, background: "#0f0f13", borderRadius: 100, height: 2 }}>
                  <div style={{ height: "100%", width: `${(filled / sec.fields.length) * 100}%`, background: sec.color, borderRadius: 100, transition: "width 0.3s" }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Form */}
        <div style={{ flex: 1 }} className="fade-in" key={activeSection}>
          <div style={{ background: "#1a1a24", borderRadius: 12, border: `1px solid ${current.color}22`, padding: "20px 24px", marginBottom: 16 }}>
            <div style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: current.color, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>{current.icon} Sección</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#f8fafc" }}>{current.label}</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {current.fields.map((field) => (
              <div key={field.id} style={{ background: "#1a1a24", borderRadius: 10, padding: "16px 20px", border: "1px solid #1e1e2e" }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#94a3b8", marginBottom: 8, letterSpacing: "0.01em" }}>{field.label}</label>
                {field.type === "textarea" ? (
                  <textarea
                    value={values[field.id] || ""}
                    onChange={(e) => setValue(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    rows={3}
                    style={{ width: "100%", background: "#0f0f13", border: "1px solid #2a2a3a", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#e2e8f0", resize: "vertical", lineHeight: 1.6 }}
                  />
                ) : field.type === "select" ? (
                  <select
                    value={values[field.id] || ""}
                    onChange={(e) => setValue(field.id, e.target.value)}
                    style={{ width: "100%", background: "#0f0f13", border: "1px solid #2a2a3a", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: values[field.id] ? "#e2e8f0" : "#475569" }}
                  >
                    <option value="">Selecciona una opción...</option>
                    {field.options.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={values[field.id] || ""}
                    onChange={(e) => setValue(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    style={{ width: "100%", background: "#0f0f13", border: "1px solid #2a2a3a", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#e2e8f0" }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
            <button className="nav-btn" onClick={() => { const idx = sections.findIndex(s => s.id === activeSection); if (idx > 0) setActiveSection(sections[idx - 1].id); }}
              disabled={sections[0].id === activeSection}
              style={{ padding: "9px 18px", borderRadius: 8, fontSize: 13, fontWeight: 500, background: sections[0].id === activeSection ? "#1a1a24" : "#1e1e2e", color: sections[0].id === activeSection ? "#2a2a3a" : "#94a3b8", border: "1px solid #2a2a3a", cursor: sections[0].id === activeSection ? "default" : "pointer" }}>
              ← Anterior
            </button>
            {sections[sections.length - 1].id !== activeSection ? (
              <button className="nav-btn" onClick={() => { const idx = sections.findIndex(s => s.id === activeSection); setActiveSection(sections[idx + 1].id); }}
                style={{ padding: "9px 18px", borderRadius: 8, fontSize: 13, fontWeight: 700, background: current.color, color: "#fff", border: "none", cursor: "pointer" }}>
                Siguiente →
              </button>
            ) : (
              <button className="export-btn nav-btn" onClick={exportText}
                style={{ padding: "9px 18px", borderRadius: 8, fontSize: 13, fontWeight: 700, background: "#22C55E", color: "#fff", border: "none", cursor: "pointer" }}>
                ✓ Exportar Brief
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
