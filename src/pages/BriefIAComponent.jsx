import { useState } from "react";

const FIELDS = [
  { id: "nombre", section: "🏢 El Negocio", label: "Nombre del negocio" },
  { id: "rubro", section: "🏢 El Negocio", label: "Rubro / industria" },
  { id: "descripcion", section: "🏢 El Negocio", label: "¿Qué venden / qué hacen?" },
  { id: "diferenciador", section: "🏢 El Negocio", label: "¿Qué los diferencia de la competencia?" },
  { id: "ticket", section: "🏢 El Negocio", label: "Ticket promedio de venta" },
  { id: "facturacion", section: "🏢 El Negocio", label: "Facturación mensual aproximada" },
  { id: "objetivo_principal", section: "🎯 Objetivos", label: "Objetivo principal" },
  { id: "meta_3meses", section: "🎯 Objetivos", label: "¿Qué quieren lograr en 3 meses?" },
  { id: "problema_actual", section: "🎯 Objetivos", label: "Mayor problema actual" },
  { id: "experiencia_agencia", section: "🎯 Objetivos", label: "Experiencia previa con agencias" },
  { id: "cliente_ideal", section: "👥 Audiencia", label: "Cliente ideal" },
  { id: "donde_compran", section: "👥 Audiencia", label: "Dónde compran / interactúan" },
  { id: "competidores", section: "👥 Audiencia", label: "Principales competidores" },
  { id: "mercado", section: "👥 Audiencia", label: "Alcance de mercado" },
  { id: "canales_activos", section: "📣 Marketing Actual", label: "Canales de marketing activos" },
  { id: "presupuesto_actual", section: "📣 Marketing Actual", label: "Inversión mensual actual en pauta" },
  { id: "herramientas", section: "📣 Marketing Actual", label: "Herramientas que usan" },
  { id: "resultados_actuales", section: "📣 Marketing Actual", label: "Métricas conocidas de campañas actuales" },
  { id: "presupuesto_agencia", section: "💰 Presupuesto", label: "Presupuesto disponible para agencia" },
  { id: "presupuesto_pauta", section: "💰 Presupuesto", label: "Presupuesto disponible para pauta" },
  { id: "decision", section: "💰 Presupuesto", label: "¿Quién toma la decisión?" },
  { id: "urgencia", section: "💰 Presupuesto", label: "¿Cuándo quieren comenzar?" },
  { id: "fit", section: "📝 Notas Internas", label: "¿Es un buen fit para Andoc?" },
  { id: "prioridad", section: "📝 Notas Internas", label: "Prioridad de seguimiento" },
  { id: "siguiente_paso", section: "📝 Notas Internas", label: "Siguiente paso acordado" },
];

const SECTIONS = [...new Set(FIELDS.map(f => f.section))];

const SECTION_COLORS = {
  "🏢 El Negocio": "#F97316",
  "🎯 Objetivos": "#EAB308",
  "👥 Audiencia": "#22C55E",
  "📣 Marketing Actual": "#3B82F6",
  "💰 Presupuesto": "#A855F7",
  "📝 Notas Internas": "#EC4899",
};

export default function BriefAutoComplete() {
  const [transcript, setTranscript] = useState("");
  const [clientName, setClientName] = useState("");
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [activeSection, setActiveSection] = useState(SECTIONS[0]);
  const [editingField, setEditingField] = useState(null);

  const filledCount = Object.values(values).filter(v => v && v.trim() !== "").length;
  const progress = Math.round((filledCount / FIELDS.length) * 100);

  const runExtraction = async () => {
    if (!transcript.trim()) return;
    setLoading(true);
    setError("");
    setDone(false);

    const fieldList = FIELDS.map(f => `- "${f.id}": ${f.label}`).join("\n");

    const prompt = `Eres un asistente experto en ventas B2B para una agencia de marketing digital llamada Andoc Creativo.

A continuación tienes la transcripción de una reunión de descubrimiento con un prospecto. Tu tarea es extraer información y completar los campos del brief.

TRANSCRIPCIÓN:
"""
${transcript}
"""

CAMPOS A COMPLETAR:
${fieldList}

INSTRUCCIONES:
- Responde ÚNICAMENTE con un objeto JSON válido, sin texto adicional, sin markdown, sin bloques de código.
- Usa las claves exactas indicadas arriba.
- Si no encuentras información clara para un campo, usa "" (string vacío).
- Sé conciso pero informativo. Máximo 2-3 oraciones por campo.
- Para campos de presupuesto, extrae números o rangos si se mencionan.
- Para "fit" usa: "Sí, claramente", "Probablemente sí", "Dudoso", o "No es nuestro perfil".
- Para "prioridad" usa: "Alta — cerrar esta semana", "Media — seguimiento en 2–3 días", o "Baja — lead frío".
- Infiere el "siguiente_paso" si se menciona algún acuerdo o compromiso al final.

JSON:`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await response.json();
      const text = data.content?.find(b => b.type === "text")?.text || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setValues(parsed);
      setDone(true);
    } catch (err) {
      setError("No se pudo procesar la transcripción. Verifica que sea texto claro e intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const exportText = () => {
    let text = `BRIEF DE DESCUBRIMIENTO — ANDOC CREATIVO\n`;
    text += `Cliente: ${clientName || "—"}\nFecha: ${new Date().toLocaleDateString("es-CL")}\n\n`;
    SECTIONS.forEach(sec => {
      text += `\n${"─".repeat(40)}\n${sec}\n${"─".repeat(40)}\n`;
      FIELDS.filter(f => f.section === sec).forEach(f => {
        text += `\n${f.label}:\n${values[f.id] || "—"}\n`;
      });
    });
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Brief_${clientName || "Cliente"}_${new Date().toISOString().slice(0,10)}.txt`;
    a.click();
  };

  const currentFields = FIELDS.filter(f => f.section === activeSection);
  const color = SECTION_COLORS[activeSection];

  return (
    <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif", background: "#0f0f13", minHeight: "100vh", color: "#e2e8f0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #1a1a24; } ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
        textarea, input { font-family: 'DM Sans', sans-serif; }
        textarea:focus, input:focus { outline: 2px solid #F97316; outline-offset: 1px; }
        .sec-btn:hover { background: #1e1e2e !important; }
        .sec-btn { transition: all 0.15s; cursor: pointer; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        .fade-in { animation: fadeIn 0.2s ease; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { animation: spin 0.8s linear infinite; display: inline-block; }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
        .pulse { animation: pulse 1.5s ease infinite; }
        .field-row:hover .edit-btn { opacity: 1 !important; }
      `}</style>

      {/* Header */}
      <div style={{ background: "#1a1a24", borderBottom: "1px solid #1e1e2e", padding: "22px 28px" }}>
        <div style={{ maxWidth: 920, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#A855F7", boxShadow: "0 0 8px #A855F7" }} />
                <span style={{ fontSize: 11, fontFamily: "'DM Mono',monospace", color: "#A855F7", letterSpacing: "0.12em", textTransform: "uppercase" }}>Andoc Creativo — IA</span>
              </div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: "#f8fafc", letterSpacing: "-0.02em" }}>Brief Automático desde Transcripción</h1>
              <p style={{ fontSize: 13, color: "#64748b", marginTop: 3 }}>Pega la transcripción de la reunión → Claude completa el brief</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {done && (
                <>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 28, fontWeight: 700, color: progress >= 80 ? "#22C55E" : "#A855F7" }}>{progress}%</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>{filledCount}/{FIELDS.length} campos</div>
                  </div>
                  <button onClick={exportText} style={{ padding: "9px 14px", borderRadius: 8, background: "#A855F7", color: "#fff", border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>↓ Exportar</button>
                </>
              )}
            </div>
          </div>

          {done && (
            <div style={{ marginTop: 12, background: "#0f0f13", borderRadius: 100, height: 4 }}>
              <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg,#A855F7,#3B82F6)", borderRadius: 100, transition: "width 0.5s ease" }} />
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 920, margin: "0 auto", padding: "24px 28px" }}>
        {/* Input panel */}
        {!done ? (
          <div className="fade-in">
            <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 12, color: "#64748b" }}>Cliente:</span>
                <input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Nombre del cliente..." style={{ background: "#1a1a24", border: "1px solid #2a2a3a", borderRadius: 6, padding: "6px 10px", fontSize: 13, color: "#e2e8f0", width: 200 }} />
              </div>
            </div>

            <div style={{ background: "#1a1a24", borderRadius: 12, border: "1px solid #1e1e2e", padding: "20px 24px", marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontFamily: "'DM Mono',monospace", color: "#64748b", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
                Transcripción de la reunión
              </div>
              <textarea
                value={transcript}
                onChange={e => setTranscript(e.target.value)}
                placeholder={`Pega aquí la transcripción de Fathom, Fireflies, tl;dv u Otter...\n\nEjemplo:\nEmilio: Hola, cuéntame un poco sobre tu negocio.\nCliente: Somos una tienda de ropa femenina, llevamos 3 años vendiendo online principalmente en Instagram...\n...`}
                rows={14}
                style={{ width: "100%", background: "#0f0f13", border: "1px solid #2a2a3a", borderRadius: 8, padding: "12px 16px", fontSize: 13, color: "#e2e8f0", resize: "vertical", lineHeight: 1.7 }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                <span style={{ fontSize: 12, color: "#475569" }}>{transcript.length > 0 ? `${transcript.split(" ").length} palabras` : "Sin texto aún"}</span>
                <button
                  onClick={runExtraction}
                  disabled={!transcript.trim() || loading}
                  style={{
                    padding: "10px 24px", borderRadius: 8, fontSize: 14, fontWeight: 700,
                    background: !transcript.trim() || loading ? "#1e1e2e" : "linear-gradient(135deg,#A855F7,#3B82F6)",
                    color: !transcript.trim() || loading ? "#475569" : "#fff",
                    border: "none", cursor: !transcript.trim() || loading ? "default" : "pointer",
                    display: "flex", alignItems: "center", gap: 8,
                  }}
                >
                  {loading ? (
                    <><span className="spinner">⟳</span> Analizando...</>
                  ) : (
                    <>✨ Completar Brief con IA</>
                  )}
                </button>
              </div>
            </div>

            {loading && (
              <div style={{ background: "#1a1a24", borderRadius: 10, padding: "16px 20px", border: "1px solid #A855F733", textAlign: "center" }}>
                <div className="pulse" style={{ fontSize: 13, color: "#A855F7" }}>Claude está leyendo la transcripción y completando los {FIELDS.length} campos del brief...</div>
              </div>
            )}

            {error && (
              <div style={{ background: "#1a0f0f", borderRadius: 10, padding: "14px 18px", border: "1px solid #ef444433", color: "#f87171", fontSize: 13 }}>
                ⚠️ {error}
              </div>
            )}
          </div>
        ) : (
          /* Results panel */
          <div className="fade-in" style={{ display: "flex", gap: 22 }}>
            {/* Sidebar */}
            <div style={{ width: 190, flexShrink: 0 }}>
              <div style={{ fontSize: 10, fontFamily: "'DM Mono',monospace", color: "#475569", letterSpacing: "0.1em", marginBottom: 10, textTransform: "uppercase" }}>Secciones</div>
              {SECTIONS.map(sec => {
                const secFields = FIELDS.filter(f => f.section === sec);
                const filled = secFields.filter(f => values[f.id] && values[f.id].trim() !== "").length;
                const isActive = activeSection === sec;
                const c = SECTION_COLORS[sec];
                return (
                  <div key={sec} className="sec-btn" onClick={() => setActiveSection(sec)}
                    style={{ padding: "10px 12px", borderRadius: 8, marginBottom: 4, background: isActive ? "#1e1e2e" : "transparent", border: isActive ? `1px solid ${c}33` : "1px solid transparent" }}>
                    <div style={{ fontSize: 12, fontWeight: isActive ? 600 : 400, color: isActive ? "#f8fafc" : "#94a3b8" }}>{sec}</div>
                    <div style={{ marginTop: 5, background: "#0f0f13", borderRadius: 100, height: 2 }}>
                      <div style={{ height: "100%", width: `${(filled / secFields.length) * 100}%`, background: c, borderRadius: 100, transition: "width 0.3s" }} />
                    </div>
                    <div style={{ fontSize: 10, color: filled === secFields.length ? c : "#475569", marginTop: 3 }}>{filled}/{secFields.length}</div>
                  </div>
                );
              })}

              <div style={{ marginTop: 16 }}>
                <button onClick={() => { setDone(false); setValues({}); setTranscript(""); }}
                  style={{ width: "100%", padding: "8px", borderRadius: 8, background: "transparent", border: "1px solid #2a2a3a", color: "#64748b", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
                  ← Nueva transcripción
                </button>
              </div>
            </div>

            {/* Fields */}
            <div style={{ flex: 1 }} key={activeSection}>
              <div style={{ background: "#1a1a24", borderRadius: 12, border: `1px solid ${color}22`, padding: "16px 20px", marginBottom: 14 }}>
                <div style={{ fontSize: 10, fontFamily: "'DM Mono',monospace", color: color, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 2 }}>Completado por IA · Editable</div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: "#f8fafc" }}>{activeSection}</h2>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {currentFields.map(field => {
                  const val = values[field.id] || "";
                  const isEmpty = !val.trim();
                  const isEditing = editingField === field.id;
                  return (
                    <div key={field.id} className="field-row"
                      style={{ background: "#1a1a24", borderRadius: 10, padding: "14px 18px", border: isEmpty ? "1px solid #2a2a3a" : `1px solid ${color}22`, position: "relative" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{field.label}</div>
                        <button className="edit-btn"
                          onClick={() => setEditingField(isEditing ? null : field.id)}
                          style={{ opacity: 0, fontSize: 11, color: color, background: "transparent", border: "none", cursor: "pointer", padding: "0 4px", transition: "opacity 0.15s", flexShrink: 0 }}>
                          {isEditing ? "✓ Listo" : "✏️ Editar"}
                        </button>
                      </div>
                      {isEditing ? (
                        <textarea
                          autoFocus
                          value={val}
                          onChange={e => setValues(prev => ({ ...prev, [field.id]: e.target.value }))}
                          rows={3}
                          style={{ width: "100%", background: "#0f0f13", border: `1px solid ${color}`, borderRadius: 6, padding: "8px 12px", fontSize: 13, color: "#e2e8f0", resize: "vertical", lineHeight: 1.6 }}
                        />
                      ) : (
                        <div style={{ fontSize: 13, color: isEmpty ? "#334155" : "#e2e8f0", lineHeight: 1.65, fontStyle: isEmpty ? "italic" : "normal" }}>
                          {isEmpty ? "No se encontró esta información en la transcripción" : val}
                        </div>
                      )}
                      {!isEmpty && !isEditing && (
                        <div style={{ position: "absolute", top: 10, right: 40, width: 6, height: 6, borderRadius: "50%", background: color }} />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Export CTA */}
              <div style={{ marginTop: 16, background: "#1a1a24", borderRadius: 10, padding: "14px 18px", border: "1px solid #1e1e2e", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 13, color: "#64748b" }}>{filledCount} de {FIELDS.length} campos completados automáticamente</div>
                <button onClick={exportText}
                  style={{ padding: "9px 18px", borderRadius: 8, background: color, color: "#fff", border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                  ↓ Exportar Brief
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
