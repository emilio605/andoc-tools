import { useState } from 'react'
import Layout from '../components/Layout'

const OBJECTIVES = ['Ventas / Conversiones', 'Tráfico web', 'Fans / Seguidores', 'Awareness / Alcance']
const CHANNELS = ['Meta Ads (Facebook + Instagram)', 'Google Ads', 'TikTok Ads']

export default function PlanMedios() {
  const [form, setForm] = useState({
    clientName: '',
    businessType: '',
    website: '',
    budget: '',
    objective: OBJECTIVES[0],
    channels: ['Meta Ads (Facebook + Instagram)'],
    targetAge: '25-55 años',
    targetGender: 'Hombres y Mujeres',
    targetRegion: 'Chile',
    products: '',
    notes: '',
  })
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)

  function update(field, value) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function toggleChannel(ch) {
    setForm(f => {
      const has = f.channels.includes(ch)
      return { ...f, channels: has ? f.channels.filter(c => c !== ch) : [...f.channels, ch] }
    })
  }

  function formatBudget(val) {
    const num = parseInt(val.replace(/\D/g, ''))
    if (isNaN(num)) return ''
    return '$' + num.toLocaleString('es-CL')
  }

  async function handleGenerate() {
    if (!form.clientName || !form.budget) return alert('Completa nombre y presupuesto')
    setGenerating(true)
    setGenerated(false)

    try {
      // Build PPTX client-side
      const pptxgenjs = await import('https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/+esm')
      const pptxgen = pptxgenjs.default

      const pres = new pptxgen()
      pres.layout = 'LAYOUT_16x9'
      pres.author = 'Ando Creativo'
      pres.title = `Plan de Medios - ${form.clientName}`

      const DARK = '1A1A1A'
      const GOLD = 'D4A017'
      const GOLD_LIGHT = 'F5E6B8'
      const CREAM = 'FFF8E7'
      const WHITE = 'FFFFFF'
      const GRAY_TEXT = '666666'
      const DARK_TEXT = '2D2D2D'
      const HONEY = 'C68B00'
      const mkShadow = () => ({ type: 'outer', blur: 8, offset: 3, angle: 135, color: '000000', opacity: 0.12 })

      const budgetNum = parseInt(form.budget.replace(/\D/g, ''))
      const budgetFormatted = '$' + budgetNum.toLocaleString('es-CL')
      const now = new Date()
      const months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
      const monthYear = `${months[now.getMonth()]} ${now.getFullYear()}`

      // Distribute budget
      const trafico = Math.round(budgetNum * 0.15)
      const convAdv = Math.round(budgetNum * 0.35)
      const convSim = Math.round(budgetNum * 0.28)
      const remarketing = budgetNum - trafico - convAdv - convSim

      // SLIDE 1: PORTADA
      let s = pres.addSlide()
      s.background = { color: DARK }
      s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: GOLD } })
      s.addText(monthYear, { x: 0.8, y: 1.2, w: 8.4, h: 0.5, fontSize: 16, fontFace: 'Georgia', color: GOLD, charSpacing: 6 })
      s.addText(form.clientName, { x: 0.8, y: 1.8, w: 8.4, h: 1.4, fontSize: 52, fontFace: 'Georgia', color: WHITE, bold: true })
      if (form.businessType) {
        s.addText(form.businessType, { x: 0.8, y: 3.1, w: 8.4, h: 0.6, fontSize: 22, fontFace: 'Calibri', color: GOLD_LIGHT, italic: true })
      }
      s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.2, w: 10, h: 0.425, fill: { color: GOLD } })
      s.addText('Plan de Medios · ando creativo.cl', { x: 0.8, y: 5.22, w: 8.4, h: 0.4, fontSize: 12, fontFace: 'Calibri', color: DARK, bold: true })

      // SLIDE 2: AGENDA
      s = pres.addSlide()
      s.background = { color: WHITE }
      s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.06, h: 5.625, fill: { color: GOLD } })
      s.addText('A G E N D A', { x: 0.8, y: 0.4, w: 8.4, h: 0.7, fontSize: 14, fontFace: 'Calibri', color: GOLD, charSpacing: 6, bold: true })
      s.addText('¿Qué veremos?', { x: 0.8, y: 1.0, w: 8.4, h: 0.7, fontSize: 32, fontFace: 'Georgia', color: DARK_TEXT, bold: true })
      const agendaItems = ['Resumen Plan de Medios', 'Meta Ads: Campañas y Públicos', 'Referencias de Anuncios', 'Próximos Pasos']
      s.addText(agendaItems.map((item, i) => ({
        text: `${i + 1}.  ${item}`,
        options: { breakLine: true, fontSize: 18, fontFace: 'Calibri', color: DARK_TEXT, lineSpacingMultiple: 1.8 }
      })), { x: 1.0, y: 2.0, w: 7, h: 3 })

      // SLIDE 3: SECTION RESUMEN
      s = pres.addSlide()
      s.background = { color: DARK }
      s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: GOLD } })
      s.addText('Plan de Medios', { x: 0.8, y: 1.6, w: 8.4, h: 1.0, fontSize: 40, fontFace: 'Georgia', color: WHITE, bold: true })
      s.addText('Resumen', { x: 0.8, y: 2.6, w: 8.4, h: 0.7, fontSize: 22, fontFace: 'Calibri', color: GOLD, italic: true })
      s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.2, w: 10, h: 0.425, fill: { color: GOLD } })

      // SLIDE 4: RESUMEN DETALLE
      s = pres.addSlide()
      s.background = { color: WHITE }
      s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.06, h: 5.625, fill: { color: GOLD } })
      s.addText('Resumen', { x: 0.8, y: 0.3, w: 8.4, h: 0.6, fontSize: 28, fontFace: 'Georgia', color: DARK_TEXT, bold: true })
      const resumenItems = [
        `El Plan de Medios considera los canales de ${form.channels.join(' y ')}.`,
        `El presupuesto mensual es de ${budgetFormatted} CLP.`,
        `El foco de los anuncios estará en ${form.objective}.`,
        form.products ? `Productos/servicios principales: ${form.products}.` : null,
        'En un principio, buscaremos testear los distintos tipos de campañas, públicos y anuncios.',
      ].filter(Boolean)
      s.addText(resumenItems.map(item => ({
        text: item,
        options: { bullet: true, breakLine: true, fontSize: 15, fontFace: 'Calibri', color: DARK_TEXT, paraSpaceAfter: 10 }
      })), { x: 1.0, y: 1.2, w: 8, h: 2.8 })

      const stats = [
        { num: budgetNum >= 1000000 ? `$${(budgetNum/1000000).toFixed(1)}M` : `$${Math.round(budgetNum/1000)}K`, label: 'Presupuesto\nMensual' },
        { num: '3', label: 'Campañas\nMeta Ads' },
        { num: '4', label: 'Públicos\na testear' },
      ]
      stats.forEach((st, i) => {
        const xPos = 1.2 + i * 2.8
        s.addShape(pres.shapes.RECTANGLE, { x: xPos, y: 3.8, w: 2.2, h: 1.4, fill: { color: CREAM }, shadow: mkShadow() })
        s.addText(st.num, { x: xPos, y: 3.85, w: 2.2, h: 0.7, fontSize: 28, fontFace: 'Georgia', color: HONEY, bold: true, align: 'center', valign: 'middle' })
        s.addText(st.label, { x: xPos, y: 4.5, w: 2.2, h: 0.6, fontSize: 11, fontFace: 'Calibri', color: GRAY_TEXT, align: 'center', valign: 'top' })
      })

      // SLIDE 5: SECTION CAMPAÑAS
      s = pres.addSlide()
      s.background = { color: DARK }
      s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: GOLD } })
      s.addText('Campañas y Públicos', { x: 0.8, y: 1.6, w: 8.4, h: 1.0, fontSize: 40, fontFace: 'Georgia', color: WHITE, bold: true })
      s.addText('Meta Ads', { x: 0.8, y: 2.6, w: 8.4, h: 0.7, fontSize: 22, fontFace: 'Calibri', color: GOLD, italic: true })
      s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.2, w: 10, h: 0.425, fill: { color: GOLD } })

      // SLIDE 6: OVERVIEW CAMPAÑAS
      s = pres.addSlide()
      s.background = { color: WHITE }
      s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.06, h: 5.625, fill: { color: GOLD } })
      s.addText('Estructura de campañas', { x: 0.8, y: 0.3, w: 8.4, h: 0.6, fontSize: 28, fontFace: 'Georgia', color: DARK_TEXT, bold: true })
      const overviewItems = [
        'Tendremos 3 campañas: Tráfico/Fans, Conversiones y Remarketing',
        `Se considera un presupuesto mensual de ${budgetFormatted} CLP`,
        'Vamos a testear 4 públicos en Meta Ads',
        `El foco estará en ${form.objective.toLowerCase()}`,
      ]
      s.addText(overviewItems.map(item => ({
        text: item, options: { bullet: true, breakLine: true, fontSize: 16, fontFace: 'Calibri', color: DARK_TEXT, paraSpaceAfter: 10 }
      })), { x: 1.0, y: 1.2, w: 8, h: 2.5 })

      // SLIDE 7: CAMPAÑA TRÁFICO
      s = pres.addSlide()
      s.background = { color: WHITE }
      s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.06, h: 5.625, fill: { color: GOLD } })
      s.addText('Campaña de Tráfico / Fans', { x: 0.8, y: 0.3, w: 8.4, h: 0.6, fontSize: 26, fontFace: 'Georgia', color: DARK_TEXT, bold: true })
      s.addText('Su objetivo es generar un mayor volumen de visitas al sitio web y nuevos seguidores.', { x: 0.8, y: 1.0, w: 8.2, h: 0.5, fontSize: 14, fontFace: 'Calibri', color: GRAY_TEXT, italic: true })
      s.addText('Tendremos 1 público: Advantage RM', { x: 0.8, y: 1.7, w: 8.2, h: 0.4, fontSize: 15, fontFace: 'Calibri', color: DARK_TEXT, bold: true })
      s.addText([
        { text: 'Anuncios:', options: { bold: true, breakLine: true, fontSize: 15, fontFace: 'Calibri', color: DARK_TEXT } },
        ...['Reel de contenido / proceso del negocio', 'Video testimonio de clientes', 'Carrusel de productos best seller', 'Reel educativo sobre el producto/servicio'].map(t => ({
          text: t, options: { bullet: true, indentLevel: 1, breakLine: true, fontSize: 14, fontFace: 'Calibri', color: DARK_TEXT, paraSpaceAfter: 4 }
        }))
      ], { x: 0.8, y: 2.2, w: 8, h: 2.2 })
      s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.4, w: 3.5, h: 0.8, fill: { color: CREAM }, shadow: mkShadow() })
      s.addText([
        { text: 'KPI: ', options: { bold: true, fontSize: 13, fontFace: 'Calibri', color: HONEY } },
        { text: 'Costo por visita al perfil / web', options: { fontSize: 13, fontFace: 'Calibri', color: DARK_TEXT } }
      ], { x: 0.9, y: 4.45, w: 3.3, h: 0.7, valign: 'middle' })

      // SLIDE 8: CAMPAÑA CONVERSIONES
      s = pres.addSlide()
      s.background = { color: WHITE }
      s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.06, h: 5.625, fill: { color: GOLD } })
      s.addText('Campaña de Conversiones', { x: 0.8, y: 0.3, w: 8.4, h: 0.6, fontSize: 26, fontFace: 'Georgia', color: DARK_TEXT, bold: true })
      s.addText(`Su objetivo es generar ${form.objective.toLowerCase()} directamente.`, { x: 0.8, y: 1.0, w: 8.2, h: 0.5, fontSize: 14, fontFace: 'Calibri', color: GRAY_TEXT, italic: true })
      s.addText('Tendremos 2 públicos: Advantage RM + Similar 10%', { x: 0.8, y: 1.7, w: 8.2, h: 0.4, fontSize: 15, fontFace: 'Calibri', color: DARK_TEXT, bold: true })
      s.addText([
        { text: 'Anuncios:', options: { bold: true, breakLine: true, fontSize: 15, fontFace: 'Calibri', color: DARK_TEXT } },
        ...['Carrusel productos best seller con precios', 'Video testimonial con CTA de compra', 'Imagen con promoción del mes', 'Catálogo dinámico de productos', 'Reel de unboxing / experiencia'].map(t => ({
          text: t, options: { bullet: true, indentLevel: 1, breakLine: true, fontSize: 14, fontFace: 'Calibri', color: DARK_TEXT, paraSpaceAfter: 4 }
        }))
      ], { x: 0.8, y: 2.2, w: 8, h: 2.2 })
      s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.5, w: 3.5, h: 0.8, fill: { color: CREAM }, shadow: mkShadow() })
      s.addText([
        { text: 'KPI: ', options: { bold: true, fontSize: 13, fontFace: 'Calibri', color: HONEY } },
        { text: 'Costo por venta (CPA)', options: { fontSize: 13, fontFace: 'Calibri', color: DARK_TEXT } }
      ], { x: 0.9, y: 4.55, w: 3.3, h: 0.7, valign: 'middle' })

      // SLIDE 9: REMARKETING
      s = pres.addSlide()
      s.background = { color: WHITE }
      s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.06, h: 5.625, fill: { color: GOLD } })
      s.addText('Campaña de Remarketing', { x: 0.8, y: 0.3, w: 8.4, h: 0.6, fontSize: 26, fontFace: 'Georgia', color: DARK_TEXT, bold: true })
      s.addText('Recuperar a quienes visitaron la web o interactuaron pero no compraron.', { x: 0.8, y: 1.0, w: 8.2, h: 0.5, fontSize: 14, fontFace: 'Calibri', color: GRAY_TEXT, italic: true })
      s.addText('Tendremos 1 público: Visitantes web 30d + Interactuaron IG 60d', { x: 0.8, y: 1.7, w: 8.2, h: 0.4, fontSize: 15, fontFace: 'Calibri', color: DARK_TEXT, bold: true })
      s.addText([
        { text: 'Anuncios:', options: { bold: true, breakLine: true, fontSize: 15, fontFace: 'Calibri', color: DARK_TEXT } },
        ...['Catálogo dinámico de productos abandonados', 'Imagen/video con oferta exclusiva', 'Carrusel de los productos más vendidos', 'Testimonio + CTA de compra'].map(t => ({
          text: t, options: { bullet: true, indentLevel: 1, breakLine: true, fontSize: 14, fontFace: 'Calibri', color: DARK_TEXT, paraSpaceAfter: 4 }
        }))
      ], { x: 0.8, y: 2.2, w: 8, h: 2.0 })
      s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.3, w: 3.5, h: 0.8, fill: { color: CREAM }, shadow: mkShadow() })
      s.addText([
        { text: 'KPI: ', options: { bold: true, fontSize: 13, fontFace: 'Calibri', color: HONEY } },
        { text: 'ROAS / Costo por venta', options: { fontSize: 13, fontFace: 'Calibri', color: DARK_TEXT } }
      ], { x: 0.9, y: 4.35, w: 3.3, h: 0.7, valign: 'middle' })

      // SLIDE 10: PÚBLICOS
      s = pres.addSlide()
      s.background = { color: WHITE }
      s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.06, h: 5.625, fill: { color: GOLD } })
      s.addText('Públicos Meta Ads', { x: 0.8, y: 0.2, w: 8.4, h: 0.6, fontSize: 26, fontFace: 'Georgia', color: DARK_TEXT, bold: true })
      const hdr = { fill: { color: GOLD }, color: WHITE, bold: true, fontSize: 10, fontFace: 'Calibri', align: 'center', valign: 'middle' }
      const cell = { fontSize: 10, fontFace: 'Calibri', color: DARK_TEXT, align: 'center', valign: 'middle' }
      const cellL = { ...cell, bold: true, fill: { color: CREAM } }
      const cellD = { fontSize: 9, fontFace: 'Calibri', color: GRAY_TEXT, align: 'center', valign: 'middle' }
      s.addTable([
        [{ text: '', options: hdr }, { text: 'Advantage RM', options: hdr }, { text: 'Similar 10%', options: hdr }, { text: 'Interactuaron\nIG 60 días', options: hdr }, { text: 'Visitantes\nWeb 30 días', options: hdr }],
        [{ text: 'EDAD', options: cellL }, { text: form.targetAge, options: cell }, { text: form.targetAge, options: cell }, { text: form.targetAge, options: cell }, { text: form.targetAge, options: cell }],
        [{ text: 'REGIÓN', options: cellL }, { text: form.targetRegion, options: cell }, { text: form.targetRegion, options: cell }, { text: form.targetRegion, options: cell }, { text: form.targetRegion, options: cell }],
        [{ text: 'SEXO', options: cellL }, { text: form.targetGender, options: cell }, { text: form.targetGender, options: cell }, { text: form.targetGender, options: cell }, { text: form.targetGender, options: cell }],
        [{ text: 'INTERESES', options: cellL }, { text: 'N/A', options: cell }, { text: 'N/A', options: cell }, { text: 'N/A', options: cell }, { text: 'N/A', options: cell }],
        [{ text: 'DESCRIPCIÓN', options: { ...cellD, bold: true, fill: { color: CREAM } } }, { text: 'Público abierto.\nMeta optimiza la\nentrega con IA.', options: cellD }, { text: 'Similar a quienes\nya compraron o\nconvirtieron.', options: cellD }, { text: 'Personalizado:\ninteractuaron con\nInstagram.', options: cellD }, { text: 'Personalizado:\nvisitaron la web\nen últimos 30 días.', options: cellD }],
      ], { x: 0.4, y: 1.0, w: 9.2, colW: [1.4, 1.95, 1.95, 1.95, 1.95], border: { pt: 0.5, color: 'CCCCCC' }, rowH: [0.5, 0.45, 0.45, 0.45, 0.45, 0.85] })

      // SLIDE 11: PRESUPUESTO
      s = pres.addSlide()
      s.background = { color: WHITE }
      s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.06, h: 5.625, fill: { color: GOLD } })
      s.addText('Distribución y presupuesto', { x: 0.8, y: 0.2, w: 8.4, h: 0.6, fontSize: 26, fontFace: 'Georgia', color: DARK_TEXT, bold: true })
      const hB = { fill: { color: GOLD }, color: WHITE, bold: true, fontSize: 10, fontFace: 'Calibri', align: 'center', valign: 'middle' }
      const cB = { fontSize: 10, fontFace: 'Calibri', color: DARK_TEXT, align: 'center', valign: 'middle' }
      const tS = { fontSize: 11, fontFace: 'Calibri', color: DARK_TEXT, bold: true, align: 'center', valign: 'middle', fill: { color: GOLD_LIGHT } }
      const fmt = n => '$' + n.toLocaleString('es-CL')
      s.addTable([
        [{ text: 'CAMPAÑA', options: hB }, { text: 'Público', options: hB }, { text: 'Tipo', options: hB }, { text: 'Presupuesto', options: hB }],
        [{ text: 'Tráfico / Fans', options: { ...cB, bold: true } }, { text: 'Advantage RM', options: cB }, { text: 'Genérico + Marca', options: cB }, { text: fmt(trafico), options: { ...cB, bold: true, color: HONEY } }],
        [{ text: 'Conversiones', options: { ...cB, bold: true } }, { text: 'Advantage RM', options: cB }, { text: 'Productos / Ventas', options: cB }, { text: fmt(convAdv), options: { ...cB, bold: true, color: HONEY } }],
        [{ text: '', options: cB }, { text: 'Similar 10%', options: cB }, { text: 'Productos / Ventas', options: cB }, { text: fmt(convSim), options: { ...cB, bold: true, color: HONEY } }],
        [{ text: 'Remarketing', options: { ...cB, bold: true } }, { text: 'Visitantes Web +\nInteractuaron IG', options: cB }, { text: 'Catálogo / Ofertas', options: cB }, { text: fmt(remarketing), options: { ...cB, bold: true, color: HONEY } }],
        [{ text: '', options: tS }, { text: '', options: tS }, { text: 'TOTAL', options: tS }, { text: fmt(budgetNum), options: { ...tS, fontSize: 13, color: HONEY } }],
      ], { x: 0.8, y: 1.0, w: 8.4, colW: [1.8, 2.2, 2.2, 2.2], border: { pt: 0.5, color: 'CCCCCC' }, rowH: [0.4, 0.6, 0.6, 0.6, 0.6, 0.4] })

      // SLIDE 12: SECTION REFERENCIAS
      s = pres.addSlide()
      s.background = { color: DARK }
      s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: GOLD } })
      s.addText('Ideas para los Ads', { x: 0.8, y: 1.6, w: 8.4, h: 1.0, fontSize: 40, fontFace: 'Georgia', color: WHITE, bold: true })
      s.addText('Referencias Gráficas', { x: 0.8, y: 2.6, w: 8.4, h: 0.7, fontSize: 22, fontFace: 'Calibri', color: GOLD, italic: true })
      s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.2, w: 10, h: 0.425, fill: { color: GOLD } })

      // SLIDE 13: VIDEOS
      s = pres.addSlide()
      s.background = { color: WHITE }
      s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.06, h: 5.625, fill: { color: GOLD } })
      s.addText('Videos sugeridos', { x: 0.8, y: 0.3, w: 8.4, h: 0.6, fontSize: 26, fontFace: 'Georgia', color: DARK_TEXT, bold: true })
      const vids = [
        { t: 'Video de contenido / proceso', d: 'Mostrar el detrás de escena del negocio. Formato vertical 9:16 para Reels. 15-30 seg.' },
        { t: 'Video testimonial', d: 'Cliente real hablando de la experiencia. Formato 1080x1080. 15-20 seg.' },
        { t: 'Reel educativo', d: 'Contenido de valor que genere awareness. Formato vertical 9:16.' },
        { t: 'Video unboxing', d: 'Experiencia de recibir el producto. Packaging, detalle. 1080x1080.' },
      ]
      vids.forEach((v, i) => {
        const y = 1.1 + i * 1.05
        s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y, w: 8.4, h: 0.9, fill: { color: CREAM }, shadow: mkShadow() })
        s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y, w: 0.08, h: 0.9, fill: { color: GOLD } })
        s.addText(v.t, { x: 1.1, y: y + 0.05, w: 7.8, h: 0.35, fontSize: 14, fontFace: 'Calibri', color: DARK_TEXT, bold: true, margin: 0 })
        s.addText(v.d, { x: 1.1, y: y + 0.4, w: 7.8, h: 0.4, fontSize: 11, fontFace: 'Calibri', color: GRAY_TEXT, margin: 0 })
      })

      // SLIDE 14: GRÁFICAS
      s = pres.addSlide()
      s.background = { color: WHITE }
      s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.06, h: 5.625, fill: { color: GOLD } })
      s.addText('Gráficas sugeridas', { x: 0.8, y: 0.3, w: 8.4, h: 0.6, fontSize: 26, fontFace: 'Georgia', color: DARK_TEXT, bold: true })
      const grafs = [
        { t: 'Carrusel de productos best seller', d: 'Fotos en fondo limpio con precios. Formato 1080x1080. Hasta 7 imágenes.' },
        { t: 'Imagen estática promocional', d: 'Promoción del mes con foto hero. Formato 1080x1080 y 1920x1080.' },
        { t: 'Carrusel de colección/packs', d: 'Cada slide muestra un producto diferente. CTA final de compra.' },
        { t: 'Gráfica de temporada', d: 'Para fechas especiales. Mostrar ofertas y productos estrella.' },
      ]
      grafs.forEach((g, i) => {
        const y = 1.1 + i * 1.05
        s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y, w: 8.4, h: 0.9, fill: { color: CREAM }, shadow: mkShadow() })
        s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y, w: 0.08, h: 0.9, fill: { color: GOLD } })
        s.addText(g.t, { x: 1.1, y: y + 0.05, w: 7.8, h: 0.35, fontSize: 14, fontFace: 'Calibri', color: DARK_TEXT, bold: true, margin: 0 })
        s.addText(g.d, { x: 1.1, y: y + 0.4, w: 7.8, h: 0.4, fontSize: 11, fontFace: 'Calibri', color: GRAY_TEXT, margin: 0 })
      })

      // SLIDE 15: SECTION PRÓXIMOS PASOS
      s = pres.addSlide()
      s.background = { color: DARK }
      s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: GOLD } })
      s.addText('Pasos a seguir', { x: 0.8, y: 1.6, w: 8.4, h: 1.0, fontSize: 40, fontFace: 'Georgia', color: WHITE, bold: true })
      s.addText('Próximos Pasos', { x: 0.8, y: 2.6, w: 8.4, h: 0.7, fontSize: 22, fontFace: 'Calibri', color: GOLD, italic: true })
      s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.2, w: 10, h: 0.425, fill: { color: GOLD } })

      // SLIDE 16: PASOS DETALLE
      s = pres.addSlide()
      s.background = { color: WHITE }
      s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.06, h: 5.625, fill: { color: GOLD } })
      s.addText('Próximos Pasos', { x: 0.8, y: 0.3, w: 8.4, h: 0.6, fontSize: 28, fontFace: 'Georgia', color: DARK_TEXT, bold: true })
      s.addText([
        'Aprobar o corregir presupuestos.',
        'Enviar gráficas y videos solicitados.',
        'Dar acceso a Meta Business Suite (Facebook e Instagram).',
        form.website ? `Dar acceso a ${form.website} (para instalar píxel de Meta).` : 'Dar acceso al sitio web (para instalar píxel de Meta).',
        'Dar acceso a Google Analytics (si existe).',
        'Confirmar productos prioritarios para las campañas.',
      ].map(t => ({
        text: t, options: { bullet: true, breakLine: true, fontSize: 16, fontFace: 'Calibri', color: DARK_TEXT, paraSpaceAfter: 12 }
      })), { x: 1.0, y: 1.2, w: 8, h: 3.5 })

      // SLIDE 17: CIERRE
      s = pres.addSlide()
      s.background = { color: DARK }
      s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: GOLD } })
      s.addText(monthYear, { x: 0.8, y: 1.2, w: 8.4, h: 0.5, fontSize: 16, fontFace: 'Georgia', color: GOLD, charSpacing: 6 })
      s.addText(form.clientName, { x: 0.8, y: 1.8, w: 8.4, h: 1.4, fontSize: 52, fontFace: 'Georgia', color: WHITE, bold: true })
      if (form.businessType) {
        s.addText(form.businessType, { x: 0.8, y: 3.1, w: 8.4, h: 0.6, fontSize: 22, fontFace: 'Calibri', color: GOLD_LIGHT, italic: true })
      }
      s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.2, w: 10, h: 0.425, fill: { color: GOLD } })
      s.addText('ando creativo.cl', { x: 0.8, y: 5.22, w: 8.4, h: 0.4, fontSize: 12, fontFace: 'Calibri', color: DARK, bold: true })

      // Download
      await pres.writeFile({ fileName: `Plan de Medios - ${form.clientName}.pptx` })
      setGenerated(true)
    } catch (err) {
      console.error(err)
      alert('Error al generar: ' + err.message)
    } finally {
      setGenerating(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 8,
    border: '1px solid #1e1e2e',
    background: '#1a1a24',
    color: '#e2e8f0',
    fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
    outline: 'none',
    boxSizing: 'border-box',
  }

  const labelStyle = {
    fontSize: 12,
    fontWeight: 600,
    color: '#94a3b8',
    marginBottom: 6,
    display: 'block',
    fontFamily: "'DM Mono', monospace",
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
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
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: '#F97316', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>
            Herramientas
          </div>
          <h1 style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>
            Plan de Medios
          </h1>
          <p style={{ fontSize: 14, color: '#475569', marginTop: 6 }}>
            Genera un plan de medios profesional en formato PPTX para tus clientes.
          </p>
        </div>

        {/* Form */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 20,
          maxWidth: 900,
        }}>
          {/* Client Name */}
          <div>
            <label style={labelStyle}>Nombre del cliente *</label>
            <input style={inputStyle} value={form.clientName} onChange={e => update('clientName', e.target.value)} placeholder="Ej: Kolmenares" />
          </div>

          {/* Business Type */}
          <div>
            <label style={labelStyle}>Tipo de negocio</label>
            <input style={inputStyle} value={form.businessType} onChange={e => update('businessType', e.target.value)} placeholder="Ej: Venta de miel premium" />
          </div>

          {/* Website */}
          <div>
            <label style={labelStyle}>Sitio web</label>
            <input style={inputStyle} value={form.website} onChange={e => update('website', e.target.value)} placeholder="Ej: kolmenares.cl" />
          </div>

          {/* Budget */}
          <div>
            <label style={labelStyle}>Presupuesto mensual (CLP) *</label>
            <input
              style={inputStyle}
              value={form.budget}
              onChange={e => update('budget', formatBudget(e.target.value))}
              placeholder="Ej: $700.000"
            />
          </div>

          {/* Objective */}
          <div>
            <label style={labelStyle}>Objetivo principal</label>
            <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.objective} onChange={e => update('objective', e.target.value)}>
              {OBJECTIVES.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          {/* Target Age */}
          <div>
            <label style={labelStyle}>Rango de edad</label>
            <input style={inputStyle} value={form.targetAge} onChange={e => update('targetAge', e.target.value)} placeholder="25-55 años" />
          </div>

          {/* Target Gender */}
          <div>
            <label style={labelStyle}>Sexo</label>
            <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.targetGender} onChange={e => update('targetGender', e.target.value)}>
              <option>Hombres y Mujeres</option>
              <option>Mujeres</option>
              <option>Hombres</option>
            </select>
          </div>

          {/* Target Region */}
          <div>
            <label style={labelStyle}>Región</label>
            <input style={inputStyle} value={form.targetRegion} onChange={e => update('targetRegion', e.target.value)} placeholder="Chile" />
          </div>

          {/* Products */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Productos / servicios principales</label>
            <input style={inputStyle} value={form.products} onChange={e => update('products', e.target.value)} placeholder="Ej: Miel de Ulmo, Quillay, Packs de regalo" />
          </div>

          {/* Notes */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Notas adicionales</label>
            <textarea
              style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }}
              value={form.notes}
              onChange={e => update('notes', e.target.value)}
              placeholder="Información extra para el plan..."
            />
          </div>

          {/* Channels */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Canales</label>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {CHANNELS.map(ch => (
                <label key={ch} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 16px', borderRadius: 8,
                  border: form.channels.includes(ch) ? '1px solid #F97316' : '1px solid #1e1e2e',
                  background: form.channels.includes(ch) ? 'rgba(249,115,22,0.1)' : '#1a1a24',
                  cursor: 'pointer', fontSize: 13, color: '#e2e8f0',
                }}>
                  <input
                    type="checkbox"
                    checked={form.channels.includes(ch)}
                    onChange={() => toggleChannel(ch)}
                    style={{ display: 'none' }}
                  />
                  <span style={{
                    width: 16, height: 16, borderRadius: 4,
                    border: form.channels.includes(ch) ? '2px solid #F97316' : '2px solid #475569',
                    background: form.channels.includes(ch) ? '#F97316' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, color: '#fff', flexShrink: 0,
                  }}>
                    {form.channels.includes(ch) && '✓'}
                  </span>
                  {ch}
                </label>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <div style={{ gridColumn: '1 / -1', marginTop: 8 }}>
            <button
              onClick={handleGenerate}
              disabled={generating}
              style={{
                padding: '14px 36px',
                borderRadius: 8,
                border: 'none',
                background: generating ? '#475569' : '#F97316',
                color: '#fff',
                fontSize: 15,
                fontWeight: 700,
                cursor: generating ? 'not-allowed' : 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                transition: 'all 0.15s',
              }}
            >
              {generating ? 'Generando...' : 'Generar Plan de Medios (.pptx)'}
            </button>
            {generated && (
              <span style={{ marginLeft: 16, color: '#22C55E', fontSize: 14 }}>
                ✓ Plan descargado exitosamente
              </span>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
