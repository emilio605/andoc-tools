import { useState } from 'react'
import Layout from '../components/Layout'

const OBJECTIVES = ['Ventas / Conversiones', 'Tráfico web', 'Fans / Seguidores', 'Awareness / Alcance']
const CHANNELS = ['Meta Ads (Facebook + Instagram)', 'Google Ads', 'TikTok Ads']

function buildSlides(form) {
  const budgetNum = parseInt(form.budget.replace(/\D/g, ''))
  const budgetFormatted = '$' + budgetNum.toLocaleString('es-CL')
  const now = new Date()
  const months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
  const monthYear = `${months[now.getMonth()]} ${now.getFullYear()}`
  const trafico = Math.round(budgetNum * 0.15)
  const convAdv = Math.round(budgetNum * 0.35)
  const convSim = Math.round(budgetNum * 0.28)
  const remarketing = budgetNum - trafico - convAdv - convSim
  const fmt = n => '$' + n.toLocaleString('es-CL')

  return [
    {
      id: 'portada', type: 'dark', title: 'Portada',
      content: { monthYear, clientName: form.clientName, businessType: form.businessType }
    },
    {
      id: 'agenda', type: 'light', title: 'Agenda',
      items: ['Resumen Plan de Medios', 'Meta Ads: Campañas y Públicos', 'Referencias de Anuncios', 'Próximos Pasos'],
      editable: true
    },
    {
      id: 'resumen-section', type: 'dark', title: 'Plan de Medios',
      subtitle: 'Resumen'
    },
    {
      id: 'resumen', type: 'light', title: 'Resumen',
      bullets: [
        `El Plan de Medios considera los canales de ${form.channels.join(' y ')}.`,
        `El presupuesto mensual es de ${budgetFormatted} CLP.`,
        `El foco de los anuncios estará en ${form.objective}.`,
        ...(form.products ? [`Productos/servicios principales: ${form.products}.`] : []),
        'En un principio, buscaremos testear los distintos tipos de campañas, públicos y anuncios.',
      ],
      stats: [
        { num: budgetNum >= 1000000 ? `$${(budgetNum/1000000).toFixed(1)}M` : `$${Math.round(budgetNum/1000)}K`, label: 'Presupuesto Mensual' },
        { num: '3', label: 'Campañas Meta Ads' },
        { num: '4', label: 'Públicos a testear' },
      ],
      editable: true
    },
    {
      id: 'campanas-section', type: 'dark', title: 'Campañas y Públicos',
      subtitle: 'Meta Ads'
    },
    {
      id: 'estructura', type: 'light', title: 'Estructura de campañas',
      bullets: [
        'Tendremos 3 campañas: Tráfico/Fans, Conversiones y Remarketing',
        `Se considera un presupuesto mensual de ${budgetFormatted} CLP`,
        'Vamos a testear 4 públicos en Meta Ads',
        `El foco estará en ${form.objective.toLowerCase()}`,
      ],
      editable: true
    },
    {
      id: 'trafico', type: 'campaign', title: 'Campaña de Tráfico / Fans',
      desc: 'Su objetivo es generar un mayor volumen de visitas al sitio web y nuevos seguidores.',
      audience: 'Tendremos 1 público: Advantage RM',
      ads: [
        'Reel de contenido / proceso del negocio',
        'Video testimonio de clientes',
        'Carrusel de productos best seller',
        'Reel educativo sobre el producto/servicio',
      ],
      kpi: 'Costo por visita al perfil / web',
      editable: true
    },
    {
      id: 'conversiones', type: 'campaign', title: 'Campaña de Conversiones',
      desc: `Su objetivo es generar ${form.objective.toLowerCase()} directamente.`,
      audience: 'Tendremos 2 públicos: Advantage RM + Similar 10%',
      ads: [
        'Carrusel productos best seller con precios',
        'Video testimonial con CTA de compra',
        'Imagen con promoción del mes',
        'Catálogo dinámico de productos',
        'Reel de unboxing / experiencia',
      ],
      kpi: 'Costo por venta (CPA)',
      editable: true
    },
    {
      id: 'remarketing', type: 'campaign', title: 'Campaña de Remarketing',
      desc: 'Recuperar a quienes visitaron la web o interactuaron pero no compraron.',
      audience: 'Tendremos 1 público: Visitantes web 30d + Interactuaron IG 60d',
      ads: [
        'Catálogo dinámico de productos abandonados',
        'Imagen/video con oferta exclusiva',
        'Carrusel de los productos más vendidos',
        'Testimonio + CTA de compra',
      ],
      kpi: 'ROAS / Costo por venta',
      editable: true
    },
    {
      id: 'publicos', type: 'table', title: 'Públicos Meta Ads',
      audiences: [
        { name: 'Advantage RM', desc: 'Público abierto. Meta optimiza la entrega con IA.' },
        { name: 'Similar 10%', desc: 'Similar a quienes ya compraron o convirtieron.' },
        { name: 'Interactuaron IG 60d', desc: 'Personalizado: interactuaron con Instagram.' },
        { name: 'Visitantes Web 30d', desc: 'Personalizado: visitaron la web en últimos 30 días.' },
      ],
      targeting: { age: form.targetAge, gender: form.targetGender, region: form.targetRegion }
    },
    {
      id: 'presupuesto', type: 'budget', title: 'Distribución y presupuesto',
      rows: [
        { campaign: 'Tráfico / Fans', audience: 'Advantage RM', type: 'Genérico + Marca', budget: fmt(trafico) },
        { campaign: 'Conversiones', audience: 'Advantage RM', type: 'Productos / Ventas', budget: fmt(convAdv) },
        { campaign: '', audience: 'Similar 10%', type: 'Productos / Ventas', budget: fmt(convSim) },
        { campaign: 'Remarketing', audience: 'Visitantes Web + IG', type: 'Catálogo / Ofertas', budget: fmt(remarketing) },
      ],
      total: fmt(budgetNum),
      editable: true
    },
    {
      id: 'refs-section', type: 'dark', title: 'Ideas para los Ads',
      subtitle: 'Referencias Gráficas'
    },
    {
      id: 'videos', type: 'cards', title: 'Videos sugeridos',
      cards: [
        { t: 'Video de contenido / proceso', d: 'Mostrar el detrás de escena del negocio. Formato vertical 9:16 para Reels. 15-30 seg.' },
        { t: 'Video testimonial', d: 'Cliente real hablando de la experiencia. Formato 1080x1080. 15-20 seg.' },
        { t: 'Reel educativo', d: 'Contenido de valor que genere awareness. Formato vertical 9:16.' },
        { t: 'Video unboxing', d: 'Experiencia de recibir el producto. Packaging, detalle. 1080x1080.' },
      ],
      editable: true
    },
    {
      id: 'graficas', type: 'cards', title: 'Gráficas sugeridas',
      cards: [
        { t: 'Carrusel de productos best seller', d: 'Fotos en fondo limpio con precios. Formato 1080x1080. Hasta 7 imágenes.' },
        { t: 'Imagen estática promocional', d: 'Promoción del mes con foto hero. Formato 1080x1080 y 1920x1080.' },
        { t: 'Carrusel de colección/packs', d: 'Cada slide muestra un producto diferente. CTA final de compra.' },
        { t: 'Gráfica de temporada', d: 'Para fechas especiales. Mostrar ofertas y productos estrella.' },
      ],
      editable: true
    },
    {
      id: 'pasos-section', type: 'dark', title: 'Pasos a seguir',
      subtitle: 'Próximos Pasos'
    },
    {
      id: 'pasos', type: 'light', title: 'Próximos Pasos',
      bullets: [
        'Aprobar o corregir presupuestos.',
        'Enviar gráficas y videos solicitados.',
        'Dar acceso a Meta Business Suite (Facebook e Instagram).',
        form.website ? `Dar acceso a ${form.website} (para instalar píxel de Meta).` : 'Dar acceso al sitio web (para instalar píxel de Meta).',
        'Dar acceso a Google Analytics (si existe).',
        'Confirmar productos prioritarios para las campañas.',
      ],
      editable: true
    },
    {
      id: 'cierre', type: 'dark', title: 'Cierre',
      content: { monthYear, clientName: form.clientName, businessType: form.businessType }
    },
  ]
}

// ============ SLIDE PREVIEW COMPONENTS ============

function SlidePreviewDark({ slide, onUpdate }) {
  if (slide.id === 'portada' || slide.id === 'cierre') {
    return (
      <div style={{ background: '#1A1A1A', borderRadius: 8, padding: '32px 28px', aspectRatio: '16/9', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: '#D4A017' }} />
        <div style={{ fontSize: 12, color: '#D4A017', letterSpacing: '0.2em', marginBottom: 8 }}>{slide.content.monthYear}</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: '#fff', fontFamily: 'Georgia, serif' }}>{slide.content.clientName}</div>
        {slide.content.businessType && <div style={{ fontSize: 14, color: '#F5E6B8', fontStyle: 'italic', marginTop: 4 }}>{slide.content.businessType}</div>}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 28, background: '#D4A017', display: 'flex', alignItems: 'center', paddingLeft: 28 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#1A1A1A' }}>{slide.id === 'portada' ? 'Plan de Medios · ando creativo.cl' : 'ando creativo.cl'}</span>
        </div>
      </div>
    )
  }
  return (
    <div style={{ background: '#1A1A1A', borderRadius: 8, padding: '32px 28px', aspectRatio: '16/9', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: '#D4A017' }} />
      <div style={{ fontSize: 24, fontWeight: 700, color: '#fff', fontFamily: 'Georgia, serif' }}>{slide.title}</div>
      {slide.subtitle && <div style={{ fontSize: 14, color: '#D4A017', fontStyle: 'italic', marginTop: 4 }}>{slide.subtitle}</div>}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 28, background: '#D4A017' }} />
    </div>
  )
}

function SlidePreviewLight({ slide, onUpdate }) {
  return (
    <div style={{ background: '#fff', borderRadius: 8, padding: '24px 28px', aspectRatio: '16/9', position: 'relative', overflow: 'hidden', color: '#2D2D2D' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', background: '#D4A017' }} />
      <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'Georgia, serif', marginBottom: 12, marginLeft: 8 }}>{slide.title}</div>
      {slide.items && (
        <div style={{ marginLeft: 8 }}>
          {slide.items.map((item, i) => (
            <div key={i} style={{ fontSize: 12, marginBottom: 6, color: '#2D2D2D' }}>{i + 1}. {item}</div>
          ))}
        </div>
      )}
      {slide.bullets && (
        <div style={{ marginLeft: 8 }}>
          {slide.bullets.map((b, i) => (
            <div key={i} style={{ fontSize: 11, marginBottom: 4, paddingLeft: 12, position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0 }}>•</span>
              {slide.editable ? (
                <input
                  value={b}
                  onChange={e => {
                    const newBullets = [...slide.bullets]
                    newBullets[i] = e.target.value
                    onUpdate({ ...slide, bullets: newBullets })
                  }}
                  style={{ border: 'none', borderBottom: '1px solid #e5e7eb', fontSize: 11, width: '90%', padding: '2px 0', outline: 'none', color: '#2D2D2D', background: 'transparent' }}
                />
              ) : b}
            </div>
          ))}
        </div>
      )}
      {slide.stats && (
        <div style={{ display: 'flex', gap: 12, marginTop: 12, marginLeft: 8 }}>
          {slide.stats.map((s, i) => (
            <div key={i} style={{ background: '#FFF8E7', borderRadius: 6, padding: '8px 14px', textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#C68B00', fontFamily: 'Georgia, serif' }}>{s.num}</div>
              <div style={{ fontSize: 8, color: '#666' }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function SlidePreviewCampaign({ slide, onUpdate }) {
  return (
    <div style={{ background: '#fff', borderRadius: 8, padding: '20px 28px', aspectRatio: '16/9', position: 'relative', overflow: 'hidden', color: '#2D2D2D' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', background: '#D4A017' }} />
      <div style={{ marginLeft: 8 }}>
        <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'Georgia, serif', marginBottom: 4 }}>{slide.title}</div>
        <div style={{ fontSize: 10, color: '#666', fontStyle: 'italic', marginBottom: 8 }}>
          {slide.editable ? (
            <input value={slide.desc} onChange={e => onUpdate({ ...slide, desc: e.target.value })} style={{ border: 'none', borderBottom: '1px solid #e5e7eb', fontSize: 10, width: '95%', padding: '2px 0', outline: 'none', color: '#666', fontStyle: 'italic', background: 'transparent' }} />
          ) : slide.desc}
        </div>
        <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 6 }}>{slide.audience}</div>
        <div style={{ fontSize: 10, fontWeight: 600, marginBottom: 2 }}>Anuncios:</div>
        {slide.ads.map((ad, i) => (
          <div key={i} style={{ fontSize: 10, marginBottom: 2, paddingLeft: 14, position: 'relative' }}>
            <span style={{ position: 'absolute', left: 4 }}>•</span>
            {slide.editable ? (
              <input
                value={ad}
                onChange={e => {
                  const newAds = [...slide.ads]
                  newAds[i] = e.target.value
                  onUpdate({ ...slide, ads: newAds })
                }}
                style={{ border: 'none', borderBottom: '1px solid #e5e7eb', fontSize: 10, width: '88%', padding: '1px 0', outline: 'none', color: '#2D2D2D', background: 'transparent' }}
              />
            ) : ad}
          </div>
        ))}
        <div style={{ background: '#FFF8E7', borderRadius: 4, padding: '6px 12px', display: 'inline-block', marginTop: 8 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#C68B00' }}>KPI: </span>
          <span style={{ fontSize: 10, color: '#2D2D2D' }}>{slide.kpi}</span>
        </div>
      </div>
    </div>
  )
}

function SlidePreviewTable({ slide }) {
  const { audiences, targeting } = slide
  return (
    <div style={{ background: '#fff', borderRadius: 8, padding: '20px 24px', aspectRatio: '16/9', position: 'relative', overflow: 'hidden', color: '#2D2D2D' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', background: '#D4A017' }} />
      <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'Georgia, serif', marginBottom: 10, marginLeft: 8 }}>{slide.title}</div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 9 }}>
        <thead>
          <tr style={{ background: '#D4A017', color: '#fff' }}>
            <th style={{ padding: '4px 6px', textAlign: 'center' }}></th>
            {audiences.map((a, i) => <th key={i} style={{ padding: '4px 6px', textAlign: 'center', fontWeight: 700 }}>{a.name}</th>)}
          </tr>
        </thead>
        <tbody>
          {['EDAD', 'REGIÓN', 'SEXO'].map((label, ri) => (
            <tr key={ri} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '3px 6px', fontWeight: 700, background: '#FFF8E7' }}>{label}</td>
              {audiences.map((_, ci) => (
                <td key={ci} style={{ padding: '3px 6px', textAlign: 'center' }}>
                  {label === 'EDAD' ? targeting.age : label === 'REGIÓN' ? targeting.region : targeting.gender}
                </td>
              ))}
            </tr>
          ))}
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '3px 6px', fontWeight: 700, background: '#FFF8E7' }}>DESC.</td>
            {audiences.map((a, i) => <td key={i} style={{ padding: '3px 6px', textAlign: 'center', fontSize: 8, color: '#666' }}>{a.desc}</td>)}
          </tr>
        </tbody>
      </table>
    </div>
  )
}

function SlidePreviewBudget({ slide, onUpdate }) {
  return (
    <div style={{ background: '#fff', borderRadius: 8, padding: '20px 24px', aspectRatio: '16/9', position: 'relative', overflow: 'hidden', color: '#2D2D2D' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', background: '#D4A017' }} />
      <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'Georgia, serif', marginBottom: 10, marginLeft: 8 }}>{slide.title}</div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 9, marginLeft: 4 }}>
        <thead>
          <tr style={{ background: '#D4A017', color: '#fff' }}>
            {['Campaña', 'Público', 'Tipo', 'Presupuesto'].map(h => <th key={h} style={{ padding: '4px 6px', textAlign: 'center', fontWeight: 700 }}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {slide.rows.map((r, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '4px 6px', fontWeight: r.campaign ? 600 : 400 }}>{r.campaign}</td>
              <td style={{ padding: '4px 6px', textAlign: 'center' }}>{r.audience}</td>
              <td style={{ padding: '4px 6px', textAlign: 'center' }}>{r.type}</td>
              <td style={{ padding: '4px 6px', textAlign: 'center', fontWeight: 700, color: '#C68B00' }}>{r.budget}</td>
            </tr>
          ))}
          <tr style={{ background: '#F5E6B8' }}>
            <td colSpan={3} style={{ padding: '4px 6px', fontWeight: 700, textAlign: 'right' }}>TOTAL</td>
            <td style={{ padding: '4px 6px', textAlign: 'center', fontWeight: 700, color: '#C68B00', fontSize: 11 }}>{slide.total}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

function SlidePreviewCards({ slide, onUpdate }) {
  return (
    <div style={{ background: '#fff', borderRadius: 8, padding: '20px 28px', aspectRatio: '16/9', position: 'relative', overflow: 'hidden', color: '#2D2D2D' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', background: '#D4A017' }} />
      <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'Georgia, serif', marginBottom: 10, marginLeft: 8 }}>{slide.title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginLeft: 8 }}>
        {slide.cards.map((c, i) => (
          <div key={i} style={{ background: '#FFF8E7', borderRadius: 4, padding: '6px 10px', borderLeft: '3px solid #D4A017' }}>
            {slide.editable ? (
              <>
                <input value={c.t} onChange={e => { const nc = [...slide.cards]; nc[i] = { ...nc[i], t: e.target.value }; onUpdate({ ...slide, cards: nc }) }}
                  style={{ border: 'none', fontSize: 10, fontWeight: 700, width: '95%', padding: '1px 0', outline: 'none', color: '#2D2D2D', background: 'transparent' }} />
                <input value={c.d} onChange={e => { const nc = [...slide.cards]; nc[i] = { ...nc[i], d: e.target.value }; onUpdate({ ...slide, cards: nc }) }}
                  style={{ border: 'none', fontSize: 9, width: '95%', padding: '1px 0', outline: 'none', color: '#666', background: 'transparent' }} />
              </>
            ) : (
              <>
                <div style={{ fontSize: 10, fontWeight: 700 }}>{c.t}</div>
                <div style={{ fontSize: 9, color: '#666' }}>{c.d}</div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function SlidePreview({ slide, index, onUpdate }) {
  const renderSlide = () => {
    switch (slide.type) {
      case 'dark': return <SlidePreviewDark slide={slide} onUpdate={onUpdate} />
      case 'light': return <SlidePreviewLight slide={slide} onUpdate={onUpdate} />
      case 'campaign': return <SlidePreviewCampaign slide={slide} onUpdate={onUpdate} />
      case 'table': return <SlidePreviewTable slide={slide} />
      case 'budget': return <SlidePreviewBudget slide={slide} onUpdate={onUpdate} />
      case 'cards': return <SlidePreviewCards slide={slide} onUpdate={onUpdate} />
      default: return <SlidePreviewLight slide={slide} onUpdate={onUpdate} />
    }
  }

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 11, color: '#475569', fontFamily: "'DM Mono', monospace", marginBottom: 6 }}>
        Slide {index + 1} — {slide.title}
        {slide.editable && <span style={{ color: '#D4A017', marginLeft: 8, fontSize: 10 }}>✏️ editable</span>}
      </div>
      <div style={{ border: '1px solid #1e1e2e', borderRadius: 10, overflow: 'hidden', maxWidth: 560 }}>
        {renderSlide()}
      </div>
    </div>
  )
}

// ============ PPTX GENERATION FROM SLIDES DATA ============
async function generatePptx(slides, form) {
  const pptxgenjs = await import('https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/+esm')
  const pptxgen = pptxgenjs.default
  const pres = new pptxgen()
  pres.layout = 'LAYOUT_16x9'
  pres.author = 'Ando Creativo'
  pres.title = `Plan de Medios - ${form.clientName}`

  const DARK = '1A1A1A', GOLD = 'D4A017', GOLD_LIGHT = 'F5E6B8', CREAM = 'FFF8E7'
  const WHITE = 'FFFFFF', GRAY_TEXT = '666666', DARK_TEXT = '2D2D2D', HONEY = 'C68B00'
  const mkShadow = () => ({ type: 'outer', blur: 8, offset: 3, angle: 135, color: '000000', opacity: 0.12 })

  for (const slide of slides) {
    let s = pres.addSlide()

    if (slide.type === 'dark') {
      s.background = { color: DARK }
      s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: GOLD } })

      if (slide.id === 'portada' || slide.id === 'cierre') {
        s.addText(slide.content.monthYear, { x: 0.8, y: 1.2, w: 8.4, h: 0.5, fontSize: 16, fontFace: 'Georgia', color: GOLD, charSpacing: 6 })
        s.addText(slide.content.clientName, { x: 0.8, y: 1.8, w: 8.4, h: 1.4, fontSize: 52, fontFace: 'Georgia', color: WHITE, bold: true })
        if (slide.content.businessType) s.addText(slide.content.businessType, { x: 0.8, y: 3.1, w: 8.4, h: 0.6, fontSize: 22, fontFace: 'Calibri', color: GOLD_LIGHT, italic: true })
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.2, w: 10, h: 0.425, fill: { color: GOLD } })
        s.addText(slide.id === 'portada' ? 'Plan de Medios · ando creativo.cl' : 'ando creativo.cl', { x: 0.8, y: 5.22, w: 8.4, h: 0.4, fontSize: 12, fontFace: 'Calibri', color: DARK, bold: true })
      } else {
        s.addText(slide.title, { x: 0.8, y: 1.6, w: 8.4, h: 1.0, fontSize: 40, fontFace: 'Georgia', color: WHITE, bold: true })
        if (slide.subtitle) s.addText(slide.subtitle, { x: 0.8, y: 2.6, w: 8.4, h: 0.7, fontSize: 22, fontFace: 'Calibri', color: GOLD, italic: true })
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.2, w: 10, h: 0.425, fill: { color: GOLD } })
      }
    }

    if (slide.type === 'light' && slide.items) {
      s.background = { color: WHITE }
      s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.06, h: 5.625, fill: { color: GOLD } })
      s.addText('A G E N D A', { x: 0.8, y: 0.4, w: 8.4, h: 0.7, fontSize: 14, fontFace: 'Calibri', color: GOLD, charSpacing: 6, bold: true })
      s.addText('¿Qué veremos?', { x: 0.8, y: 1.0, w: 8.4, h: 0.7, fontSize: 32, fontFace: 'Georgia', color: DARK_TEXT, bold: true })
      s.addText(slide.items.map((item, i) => ({ text: `${i + 1}.  ${item}`, options: { breakLine: true, fontSize: 18, fontFace: 'Calibri', color: DARK_TEXT, lineSpacingMultiple: 1.8 } })), { x: 1.0, y: 2.0, w: 7, h: 3 })
    }

    if (slide.type === 'light' && slide.bullets) {
      s.background = { color: WHITE }
      s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.06, h: 5.625, fill: { color: GOLD } })
      s.addText(slide.title, { x: 0.8, y: 0.3, w: 8.4, h: 0.6, fontSize: 28, fontFace: 'Georgia', color: DARK_TEXT, bold: true })
      s.addText(slide.bullets.map(b => ({ text: b, options: { bullet: true, breakLine: true, fontSize: slide.stats ? 15 : 16, fontFace: 'Calibri', color: DARK_TEXT, paraSpaceAfter: slide.stats ? 10 : 12 } })), { x: 1.0, y: 1.2, w: 8, h: slide.stats ? 2.8 : 3.5 })
      if (slide.stats) {
        slide.stats.forEach((st, i) => {
          const xPos = 1.2 + i * 2.8
          s.addShape(pres.shapes.RECTANGLE, { x: xPos, y: 3.8, w: 2.2, h: 1.4, fill: { color: CREAM }, shadow: mkShadow() })
          s.addText(st.num, { x: xPos, y: 3.85, w: 2.2, h: 0.7, fontSize: 28, fontFace: 'Georgia', color: HONEY, bold: true, align: 'center', valign: 'middle' })
          s.addText(st.label, { x: xPos, y: 4.5, w: 2.2, h: 0.6, fontSize: 11, fontFace: 'Calibri', color: GRAY_TEXT, align: 'center', valign: 'top' })
        })
      }
    }

    if (slide.type === 'campaign') {
      s.background = { color: WHITE }
      s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.06, h: 5.625, fill: { color: GOLD } })
      s.addText(slide.title, { x: 0.8, y: 0.3, w: 8.4, h: 0.6, fontSize: 26, fontFace: 'Georgia', color: DARK_TEXT, bold: true })
      s.addText(slide.desc, { x: 0.8, y: 1.0, w: 8.2, h: 0.5, fontSize: 14, fontFace: 'Calibri', color: GRAY_TEXT, italic: true })
      s.addText(slide.audience, { x: 0.8, y: 1.7, w: 8.2, h: 0.4, fontSize: 15, fontFace: 'Calibri', color: DARK_TEXT, bold: true })
      s.addText([
        { text: 'Anuncios:', options: { bold: true, breakLine: true, fontSize: 15, fontFace: 'Calibri', color: DARK_TEXT } },
        ...slide.ads.map(t => ({ text: t, options: { bullet: true, indentLevel: 1, breakLine: true, fontSize: 14, fontFace: 'Calibri', color: DARK_TEXT, paraSpaceAfter: 4 } }))
      ], { x: 0.8, y: 2.2, w: 8, h: 2.2 })
      s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.4, w: 3.5, h: 0.8, fill: { color: CREAM }, shadow: mkShadow() })
      s.addText([
        { text: 'KPI: ', options: { bold: true, fontSize: 13, fontFace: 'Calibri', color: HONEY } },
        { text: slide.kpi, options: { fontSize: 13, fontFace: 'Calibri', color: DARK_TEXT } }
      ], { x: 0.9, y: 4.45, w: 3.3, h: 0.7, valign: 'middle' })
    }

    if (slide.type === 'table') {
      s.background = { color: WHITE }
      s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.06, h: 5.625, fill: { color: GOLD } })
      s.addText(slide.title, { x: 0.8, y: 0.2, w: 8.4, h: 0.6, fontSize: 26, fontFace: 'Georgia', color: DARK_TEXT, bold: true })
      const hdr = { fill: { color: GOLD }, color: WHITE, bold: true, fontSize: 10, fontFace: 'Calibri', align: 'center', valign: 'middle' }
      const cell = { fontSize: 10, fontFace: 'Calibri', color: DARK_TEXT, align: 'center', valign: 'middle' }
      const cellL = { ...cell, bold: true, fill: { color: CREAM } }
      const cellD = { fontSize: 9, fontFace: 'Calibri', color: GRAY_TEXT, align: 'center', valign: 'middle' }
      s.addTable([
        [{ text: '', options: hdr }, ...slide.audiences.map(a => ({ text: a.name, options: hdr }))],
        [{ text: 'EDAD', options: cellL }, ...slide.audiences.map(() => ({ text: slide.targeting.age, options: cell }))],
        [{ text: 'REGIÓN', options: cellL }, ...slide.audiences.map(() => ({ text: slide.targeting.region, options: cell }))],
        [{ text: 'SEXO', options: cellL }, ...slide.audiences.map(() => ({ text: slide.targeting.gender, options: cell }))],
        [{ text: 'INTERESES', options: cellL }, ...slide.audiences.map(() => ({ text: 'N/A', options: cell }))],
        [{ text: 'DESCRIPCIÓN', options: { ...cellD, bold: true, fill: { color: CREAM } } }, ...slide.audiences.map(a => ({ text: a.desc, options: cellD }))],
      ], { x: 0.4, y: 1.0, w: 9.2, colW: [1.4, ...slide.audiences.map(() => 1.95)], border: { pt: 0.5, color: 'CCCCCC' }, rowH: [0.5, 0.45, 0.45, 0.45, 0.45, 0.85] })
    }

    if (slide.type === 'budget') {
      s.background = { color: WHITE }
      s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.06, h: 5.625, fill: { color: GOLD } })
      s.addText(slide.title, { x: 0.8, y: 0.2, w: 8.4, h: 0.6, fontSize: 26, fontFace: 'Georgia', color: DARK_TEXT, bold: true })
      const hB = { fill: { color: GOLD }, color: WHITE, bold: true, fontSize: 10, fontFace: 'Calibri', align: 'center', valign: 'middle' }
      const cB = { fontSize: 10, fontFace: 'Calibri', color: DARK_TEXT, align: 'center', valign: 'middle' }
      const tS = { fontSize: 11, fontFace: 'Calibri', color: DARK_TEXT, bold: true, align: 'center', valign: 'middle', fill: { color: GOLD_LIGHT } }
      s.addTable([
        [{ text: 'CAMPAÑA', options: hB }, { text: 'Público', options: hB }, { text: 'Tipo', options: hB }, { text: 'Presupuesto', options: hB }],
        ...slide.rows.map(r => [
          { text: r.campaign, options: { ...cB, bold: !!r.campaign } },
          { text: r.audience, options: cB },
          { text: r.type, options: cB },
          { text: r.budget, options: { ...cB, bold: true, color: HONEY } },
        ]),
        [{ text: '', options: tS }, { text: '', options: tS }, { text: 'TOTAL', options: tS }, { text: slide.total, options: { ...tS, fontSize: 13, color: HONEY } }],
      ], { x: 0.8, y: 1.0, w: 8.4, colW: [1.8, 2.2, 2.2, 2.2], border: { pt: 0.5, color: 'CCCCCC' }, rowH: [0.4, ...slide.rows.map(() => 0.7), 0.4] })
    }

    if (slide.type === 'cards') {
      s.background = { color: WHITE }
      s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.06, h: 5.625, fill: { color: GOLD } })
      s.addText(slide.title, { x: 0.8, y: 0.3, w: 8.4, h: 0.6, fontSize: 26, fontFace: 'Georgia', color: DARK_TEXT, bold: true })
      slide.cards.forEach((c, i) => {
        const y = 1.1 + i * 1.05
        s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y, w: 8.4, h: 0.9, fill: { color: CREAM }, shadow: mkShadow() })
        s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y, w: 0.08, h: 0.9, fill: { color: GOLD } })
        s.addText(c.t, { x: 1.1, y: y + 0.05, w: 7.8, h: 0.35, fontSize: 14, fontFace: 'Calibri', color: DARK_TEXT, bold: true, margin: 0 })
        s.addText(c.d, { x: 1.1, y: y + 0.4, w: 7.8, h: 0.4, fontSize: 11, fontFace: 'Calibri', color: GRAY_TEXT, margin: 0 })
      })
    }
  }

  await pres.writeFile({ fileName: `Plan de Medios - ${form.clientName}.pptx` })
}

// ============ MAIN COMPONENT ============
export default function PlanMedios() {
  const [form, setForm] = useState({
    clientName: '', businessType: '', website: '', budget: '',
    objective: OBJECTIVES[0], channels: ['Meta Ads (Facebook + Instagram)'],
    targetAge: '25-55 años', targetGender: 'Hombres y Mujeres', targetRegion: 'Chile',
    products: '', notes: '',
  })
  const [slides, setSlides] = useState(null)
  const [generating, setGenerating] = useState(false)

  function update(field, value) { setForm(f => ({ ...f, [field]: value })) }
  function toggleChannel(ch) {
    setForm(f => ({ ...f, channels: f.channels.includes(ch) ? f.channels.filter(c => c !== ch) : [...f.channels, ch] }))
  }
  function formatBudget(val) {
    const num = parseInt(val.replace(/\D/g, ''))
    return isNaN(num) ? '' : '$' + num.toLocaleString('es-CL')
  }

  function handlePreview() {
    if (!form.clientName || !form.budget) return alert('Completa nombre y presupuesto')
    setSlides(buildSlides(form))
  }

  function updateSlide(index, newSlide) {
    setSlides(prev => prev.map((s, i) => i === index ? newSlide : s))
  }

  async function handleDownload() {
    setGenerating(true)
    try {
      await generatePptx(slides, form)
    } catch (err) {
      alert('Error: ' + err.message)
    } finally {
      setGenerating(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: 8,
    border: '1px solid #1e1e2e', background: '#1a1a24', color: '#e2e8f0',
    fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box',
  }
  const labelStyle = {
    fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6, display: 'block',
    fontFamily: "'DM Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.05em',
  }

  return (
    <Layout>
      <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: '#0f0f13', minHeight: '100vh', color: '#e2e8f0', padding: '36px 40px' }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: '#F97316', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>Herramientas</div>
          <h1 style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>Plan de Medios</h1>
          <p style={{ fontSize: 14, color: '#475569', marginTop: 6 }}>Genera un plan de medios profesional. Previsualiza y edita antes de descargar.</p>
        </div>

        {!slides ? (
          /* ====== FORM ====== */
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, maxWidth: 900 }}>
            <div>
              <label style={labelStyle}>Nombre del cliente *</label>
              <input style={inputStyle} value={form.clientName} onChange={e => update('clientName', e.target.value)} placeholder="Ej: Kolmenares" />
            </div>
            <div>
              <label style={labelStyle}>Tipo de negocio</label>
              <input style={inputStyle} value={form.businessType} onChange={e => update('businessType', e.target.value)} placeholder="Ej: Venta de miel premium" />
            </div>
            <div>
              <label style={labelStyle}>Sitio web</label>
              <input style={inputStyle} value={form.website} onChange={e => update('website', e.target.value)} placeholder="Ej: kolmenares.cl" />
            </div>
            <div>
              <label style={labelStyle}>Presupuesto mensual (CLP) *</label>
              <input style={inputStyle} value={form.budget} onChange={e => update('budget', formatBudget(e.target.value))} placeholder="Ej: $700.000" />
            </div>
            <div>
              <label style={labelStyle}>Objetivo principal</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.objective} onChange={e => update('objective', e.target.value)}>
                {OBJECTIVES.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Rango de edad</label>
              <input style={inputStyle} value={form.targetAge} onChange={e => update('targetAge', e.target.value)} placeholder="25-55 años" />
            </div>
            <div>
              <label style={labelStyle}>Sexo</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.targetGender} onChange={e => update('targetGender', e.target.value)}>
                <option>Hombres y Mujeres</option><option>Mujeres</option><option>Hombres</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Región</label>
              <input style={inputStyle} value={form.targetRegion} onChange={e => update('targetRegion', e.target.value)} placeholder="Chile" />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Productos / servicios principales</label>
              <input style={inputStyle} value={form.products} onChange={e => update('products', e.target.value)} placeholder="Ej: Miel de Ulmo, Quillay, Packs de regalo" />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Notas adicionales</label>
              <textarea style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} value={form.notes} onChange={e => update('notes', e.target.value)} placeholder="Información extra para el plan..." />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Canales</label>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {CHANNELS.map(ch => (
                  <label key={ch} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 8, border: form.channels.includes(ch) ? '1px solid #F97316' : '1px solid #1e1e2e', background: form.channels.includes(ch) ? 'rgba(249,115,22,0.1)' : '#1a1a24', cursor: 'pointer', fontSize: 13, color: '#e2e8f0' }}>
                    <input type="checkbox" checked={form.channels.includes(ch)} onChange={() => toggleChannel(ch)} style={{ display: 'none' }} />
                    <span style={{ width: 16, height: 16, borderRadius: 4, border: form.channels.includes(ch) ? '2px solid #F97316' : '2px solid #475569', background: form.channels.includes(ch) ? '#F97316' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#fff', flexShrink: 0 }}>
                      {form.channels.includes(ch) && '✓'}
                    </span>
                    {ch}
                  </label>
                ))}
              </div>
            </div>
            <div style={{ gridColumn: '1 / -1', marginTop: 8 }}>
              <button onClick={handlePreview} style={{ padding: '14px 36px', borderRadius: 8, border: 'none', background: '#F97316', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                Vista previa del Plan
              </button>
            </div>
          </div>
        ) : (
          /* ====== PREVIEW ====== */
          <div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 28, alignItems: 'center', flexWrap: 'wrap' }}>
              <button onClick={handleDownload} disabled={generating} style={{ padding: '12px 28px', borderRadius: 8, border: 'none', background: generating ? '#475569' : '#22C55E', color: '#fff', fontSize: 14, fontWeight: 700, cursor: generating ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                {generating ? 'Generando...' : 'Descargar PPTX'}
              </button>
              <button onClick={() => setSlides(null)} style={{ padding: '12px 28px', borderRadius: 8, border: '1px solid #1e1e2e', background: 'transparent', color: '#94a3b8', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                Volver al formulario
              </button>
              <span style={{ fontSize: 12, color: '#475569' }}>
                Haz clic en los campos editables para modificar el contenido antes de descargar.
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 1200 }}>
              {slides.map((slide, i) => (
                <SlidePreview key={slide.id} slide={slide} index={i} onUpdate={newSlide => updateSlide(i, newSlide)} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
