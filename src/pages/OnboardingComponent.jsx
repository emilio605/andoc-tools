import { useState } from "react";

const phases = [
  {
    id: 1,
    label: "Primer Contacto",
    timing: "Día 1",
    color: "#F97316",
    tasks: [
      { id: "1a", text: "Agradecer la referencia al contacto que refirió", tool: "WhatsApp" },
      { id: "1b", text: "Hacer primer contacto con el prospecto por WhatsApp", tool: "WhatsApp" },
      { id: "1c", text: "Presentarse brevemente y mencionar quién los refirió", tool: "WhatsApp" },
      { id: "1d", text: "Agendar reunión de descubrimiento (video o presencial)", tool: "Calendar" },
    ],
  },
  {
    id: 2,
    label: "Reunión de Descubrimiento",
    timing: "Día 2–3",
    color: "#EAB308",
    tasks: [
      { id: "2a", text: "Preparar brief de preguntas antes de la reunión", tool: "Google Drive" },
      { id: "2b", text: "Realizar reunión: entender negocio, objetivos y presupuesto", tool: "Meet/Zoom" },
      { id: "2c", text: "Documentar puntos clave en Google Drive", tool: "Google Drive" },
      { id: "2d", text: "Enviar resumen post-reunión al prospecto por WhatsApp", tool: "WhatsApp" },
    ],
  },
  {
    id: 3,
    label: "Propuesta Comercial",
    timing: "Día 3–5",
    color: "#22C55E",
    tasks: [
      { id: "3a", text: "Crear propuesta personalizada en Google Drive", tool: "Google Drive" },
      { id: "3b", text: "Enviar propuesta por WhatsApp con contexto breve", tool: "WhatsApp" },
      { id: "3c", text: "Hacer seguimiento si no hay respuesta en 48 hrs", tool: "WhatsApp" },
      { id: "3d", text: "Resolver dudas y ajustar propuesta si es necesario", tool: "WhatsApp" },
    ],
  },
  {
    id: 4,
    label: "Cierre y Contrato",
    timing: "Día 5–7",
    color: "#3B82F6",
    tasks: [
      { id: "4a", text: "Enviar contrato / acuerdo de servicios para firma", tool: "Google Drive" },
      { id: "4b", text: "Confirmar recepción del pago inicial", tool: "Interno" },
      { id: "4c", text: "Crear carpeta del cliente en Google Drive", tool: "Google Drive" },
      { id: "4d", text: "Crear proyecto del cliente en ClickUp con tareas base", tool: "ClickUp" },
    ],
  },
  {
    id: 5,
    label: "Kickoff",
    timing: "Semana 2",
    color: "#A855F7",
    tasks: [
      { id: "5a", text: "Realizar reunión de kickoff con el cliente", tool: "Meet/Zoom" },
      { id: "5b", text: "Solicitar accesos: Meta Ads, Google Ads, Analytics, web", tool: "WhatsApp" },
      { id: "5c", text: "Crear grupo de WhatsApp con el cliente", tool: "WhatsApp" },
      { id: "5d", text: "Definir frecuencia y formato de reportes mensuales", tool: "ClickUp" },
      { id: "5e", text: "Compartir carpeta del cliente en Google Drive", tool: "Google Drive" },
    ],
  },
  {
    id: 6,
    label: "Primeras Acciones",
    timing: "Semana 2–3",
    color: "#EC4899",
    tasks: [
      { id: "6a", text: "Realizar auditoría inicial de cuentas y campañas", tool: "Google Drive" },
      { id: "6b", text: "Configurar píxeles, conversiones y seguimiento", tool: "Interno" },
      { id: "6c", text: "Lanzar primeras campañas o acciones acordadas", tool: "Interno" },
      { id: "6d", text: "Enviar primer reporte de avance al cliente", tool: "WhatsApp" },
    ],
  },
];

const toolColors = {
  WhatsApp: { bg: "#dcfce7", text: "#166534" },
  "Google Drive": { bg: "#dbeafe", text: "#1e40af" },
  ClickUp: { bg: "#ede9fe", text: "#6d28d9" },
  "Meet/Zoom": { bg: "#fef9c3", text: "#854d0e" },
  Calendar: { bg: "#fce7f3", text: "#9d174d" },
  Interno: { bg: "#f1f5f9", text: "#475569" },
};

export default function OnboardingAndoc() {
  const [checked, setChecked] = useState({});
  const [activePhase, setActivePhase] = useState(1);
  const [notes, setNotes] = useState({});
  const [clientName, setClientName] = useState("");

  const totalTasks = phases.reduce((acc, p) => acc + p.tasks.length, 0);
  const completedTasks = Object.values(checked).filter(Boolean).length;
  const progress = Math.round((completedTasks / totalTasks) * 100);

  const toggle = (id) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  const phaseProgress = (phase) => {
    const done = phase.tasks.filter((t) => checked[t.id]).length;
    return { done, total: phase.tasks.length };
  };

  const currentPhase = phases.find((p) => p.id === activePhase);

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "#0f0f13", minHeight: "100vh", color: "#e2e8f0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #1a1a24; } ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
        .task-row:hover { background: #1e1e2e !important; }
        .phase-btn:hover { opacity: 0.9; transform: translateY(-1px); }
        .phase-btn { transition: all 0.15s ease; cursor: pointer; }
        .check-box { transition: all 0.2s ease; cursor: pointer; }
        .check-box:hover { transform: scale(1.1); }
        textarea:focus { outline: 2px solid #F97316; border-color: transparent !important; }
        input:focus { outline: 2px solid #F97316; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.25s ease; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
      `}</style>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1a1a24 0%, #0f0f13 100%)", borderBottom: "1px solid #1e1e2e", padding: "28px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#F97316", boxShadow: "0 0 8px #F97316" }} />
                <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: "#F97316", letterSpacing: "0.12em", textTransform: "uppercase" }}>Andoc Creativo — SOP</span>
              </div>
              <h1 style={{ fontSize: 26, fontWeight: 700, color: "#f8fafc", letterSpacing: "-0.02em" }}>Onboarding de Cliente Nuevo</h1>
              <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>Clientes por referido · ClickUp · WhatsApp · Google Drive</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 36, fontWeight: 700, color: progress === 100 ? "#22C55E" : "#F97316", letterSpacing: "-0.03em" }}>{progress}%</div>
              <div style={{ fontSize: 12, color: "#64748b" }}>{completedTasks}/{totalTasks} tareas</div>
            </div>
          </div>

          {/* Client name input */}
          <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12, color: "#64748b", whiteSpace: "nowrap" }}>Cliente:</span>
            <input
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Nombre del cliente..."
              style={{ background: "#1a1a24", border: "1px solid #2a2a3a", borderRadius: 6, padding: "6px 12px", fontSize: 13, color: "#e2e8f0", width: 220, fontFamily: "inherit" }}
            />
          </div>

          {/* Progress bar */}
          <div style={{ marginTop: 16, background: "#1a1a24", borderRadius: 100, height: 6, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: progress === 100 ? "#22C55E" : "linear-gradient(90deg, #F97316, #EAB308)", borderRadius: 100, transition: "width 0.4s ease" }} />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 32px", display: "flex", gap: 24 }}>

        {/* Sidebar phases */}
        <div style={{ width: 200, flexShrink: 0 }}>
          <div style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: "#475569", letterSpacing: "0.1em", marginBottom: 12, textTransform: "uppercase" }}>Fases</div>
          {phases.map((phase) => {
            const { done, total } = phaseProgress(phase);
            const isActive = activePhase === phase.id;
            const allDone = done === total;
            return (
              <div
                key={phase.id}
                className="phase-btn"
                onClick={() => setActivePhase(phase.id)}
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  marginBottom: 4,
                  background: isActive ? "#1e1e2e" : "transparent",
                  border: isActive ? `1px solid ${phase.color}33` : "1px solid transparent",
                  cursor: "pointer",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                    background: allDone ? phase.color : isActive ? `${phase.color}22` : "#1a1a24",
                    border: `2px solid ${allDone ? phase.color : isActive ? phase.color : "#2a2a3a"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 9, color: allDone ? "#fff" : phase.color, fontWeight: 700,
                  }}>
                    {allDone ? "✓" : phase.id}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: isActive ? 600 : 400, color: isActive ? "#f8fafc" : "#94a3b8", lineHeight: 1.2 }}>{phase.label}</div>
                    <div style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>{done}/{total} · {phase.timing}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main content */}
        <div style={{ flex: 1 }} className="fade-in" key={activePhase}>
          {/* Phase header */}
          <div style={{ background: "#1a1a24", borderRadius: 12, padding: "20px 24px", marginBottom: 16, border: `1px solid ${currentPhase.color}22` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: currentPhase.color, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>
                  Fase {currentPhase.id} · {currentPhase.timing}
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: "#f8fafc" }}>{currentPhase.label}</h2>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: currentPhase.color }}>
                  {phaseProgress(currentPhase).done}/{phaseProgress(currentPhase).total}
                </div>
                <div style={{ fontSize: 11, color: "#64748b" }}>completadas</div>
              </div>
            </div>
            <div style={{ marginTop: 12, background: "#0f0f13", borderRadius: 100, height: 4 }}>
              <div style={{
                height: "100%",
                width: `${(phaseProgress(currentPhase).done / phaseProgress(currentPhase).total) * 100}%`,
                background: currentPhase.color,
                borderRadius: 100,
                transition: "width 0.3s ease"
              }} />
            </div>
          </div>

          {/* Tasks */}
          <div style={{ background: "#1a1a24", borderRadius: 12, border: "1px solid #1e1e2e", overflow: "hidden", marginBottom: 16 }}>
            {currentPhase.tasks.map((task, i) => {
              const isDone = checked[task.id];
              const tool = toolColors[task.tool] || toolColors["Interno"];
              return (
                <div
                  key={task.id}
                  className="task-row"
                  onClick={() => toggle(task.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 14,
                    padding: "14px 20px",
                    borderBottom: i < currentPhase.tasks.length - 1 ? "1px solid #0f0f13" : "none",
                    cursor: "pointer",
                    background: isDone ? "#0f1a0f" : "transparent",
                    transition: "background 0.2s",
                  }}
                >
                  <div
                    className="check-box"
                    style={{
                      width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                      background: isDone ? currentPhase.color : "transparent",
                      border: `2px solid ${isDone ? currentPhase.color : "#2a2a3a"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#fff", fontSize: 12, fontWeight: 700,
                    }}
                  >
                    {isDone && "✓"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{
                      fontSize: 13.5, color: isDone ? "#64748b" : "#e2e8f0",
                      textDecoration: isDone ? "line-through" : "none",
                      transition: "all 0.2s",
                    }}>
                      {task.text}
                    </span>
                  </div>
                  <div style={{
                    fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 4,
                    background: tool.bg, color: tool.text, whiteSpace: "nowrap", flexShrink: 0,
                  }}>
                    {task.tool}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Notes */}
          <div style={{ background: "#1a1a24", borderRadius: 12, border: "1px solid #1e1e2e", padding: "16px 20px" }}>
            <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
              Notas — {currentPhase.label}
            </div>
            <textarea
              value={notes[activePhase] || ""}
              onChange={(e) => setNotes((prev) => ({ ...prev, [activePhase]: e.target.value }))}
              placeholder="Agrega notas específicas de este cliente para esta fase..."
              rows={4}
              style={{
                width: "100%", background: "#0f0f13", border: "1px solid #2a2a3a",
                borderRadius: 8, padding: "10px 14px", fontSize: 13,
                color: "#e2e8f0", fontFamily: "inherit", resize: "vertical", lineHeight: 1.6,
              }}
            />
          </div>

          {/* Navigation */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
            <button
              onClick={() => setActivePhase((p) => Math.max(1, p - 1))}
              disabled={activePhase === 1}
              style={{
                padding: "9px 18px", borderRadius: 8, fontSize: 13, fontWeight: 500,
                background: activePhase === 1 ? "#1a1a24" : "#1e1e2e",
                color: activePhase === 1 ? "#2a2a3a" : "#94a3b8",
                border: "1px solid #2a2a3a", cursor: activePhase === 1 ? "default" : "pointer",
                fontFamily: "inherit",
              }}
            >
              ← Fase anterior
            </button>
            <button
              onClick={() => setActivePhase((p) => Math.min(phases.length, p + 1))}
              disabled={activePhase === phases.length}
              style={{
                padding: "9px 18px", borderRadius: 8, fontSize: 13, fontWeight: 500,
                background: activePhase === phases.length ? "#1a1a24" : currentPhase.color,
                color: activePhase === phases.length ? "#2a2a3a" : "#fff",
                border: "none", cursor: activePhase === phases.length ? "default" : "pointer",
                fontFamily: "inherit", fontWeight: 600,
              }}
            >
              Siguiente fase →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
