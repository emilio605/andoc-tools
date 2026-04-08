import { useState } from 'react'
import Layout from '../components/Layout'

const COLORS = {
  bg: '#1a1a24',
  card: '#12121a',
  border: '#1e1e2e',
  text: '#f8fafc',
  secondary: '#94a3b8',
  muted: '#475569',
  accent: '#F97316',
}

const PILAR_COLORS = {
  Temporada: '#8B5CF6',
  'Promoción': '#F97316',
  Producto: '#3B82F6',
  Branding: '#14B8A6',
  Comunidad: '#22C55E',
  Experiencia: '#EC4899',
}

const STATUS_STYLES = {
  Borrador: { bg: '#422006', color: '#FBBF24', dot: '#FBBF24' },
  Aprobado: { bg: '#052e16', color: '#4ADE80', dot: '#4ADE80' },
  Programado: { bg: '#0c1a3d', color: '#60A5FA', dot: '#60A5FA' },
  'En revisión': { bg: '#1c1917', color: '#FB923C', dot: '#FB923C' },
}

const GRADIENTS = [
  'linear-gradient(135deg, #7C3AED, #3B82F6)',
  'linear-gradient(135deg, #F59E0B, #EF4444)',
  'linear-gradient(135deg, #10B981, #3B82F6)',
  'linear-gradient(135deg, #EC4899, #8B5CF6)',
  'linear-gradient(135deg, #06B6D4, #7C3AED)',
  'linear-gradient(135deg, #F97316, #F59E0B)',
  'linear-gradient(135deg, #8B5CF6, #EC4899)',
  'linear-gradient(135deg, #3B82F6, #06B6D4)',
  'linear-gradient(135deg, #EF4444, #F97316)',
]

const BRANDS = [
  { id: 'mokka', name: 'MOKKA', desc: 'Café / Restaurant', networks: ['Instagram'], done: 9, total: 12, color: '#F97316', initial: 'M' },
  { id: 'central', name: 'Café Central', desc: 'Café', networks: ['Instagram', 'Facebook'], done: 12, total: 15, color: '#3B82F6', initial: 'C' },
  { id: 'dulce', name: 'Dulce Hogar', desc: 'Pastelería', networks: ['Instagram'], done: 6, total: 10, color: '#EC4899', initial: 'D' },
  { id: 'vegan', name: 'Vegan Lab', desc: 'Restaurant', networks: ['Instagram', 'TikTok'], done: 8, total: 12, color: '#22C55E', initial: 'V' },
]

const MOKKA_POSTS = [
  { id: 1, date: 'Vie 03/04', pilar: 'Temporada', title: 'Día del Mousse', caption: 'Hoy celebramos el Día del Mousse con nuestra receta especial de chocolate belga. ¡Ya lo probaste? Ven a disfrutarlo hoy con un 15% de descuento.', status: 'Programado', type: 'Post', day: 3 },
  { id: 2, date: 'Lun 06/04', pilar: 'Promoción', title: '20% dcto Banco de Chile', caption: 'Este lunes aprovecha un 20% de descuento pagando con Banco de Chile. Válido en toda nuestra carta.', status: 'Aprobado', type: 'Post', day: 6 },
  { id: 3, date: 'Jue 09/04', pilar: 'Producto', title: 'Nuevo Producto Asaí', caption: 'Llegó lo que esperabas: nuestro nuevo bowl de asaí con granola artesanal, banana y frutos del bosque.', status: 'Programado', type: 'Post', day: 9 },
  { id: 4, date: 'Lun 13/04', pilar: 'Branding', title: 'Mostrar espacio Mokka', caption: 'Cada rincón de Mokka está pensado para que disfrutes. Ven a conocer nuestro espacio.', status: 'Borrador', type: 'Post', day: 13 },
  { id: 5, date: 'Mié 15/04', pilar: 'Temporada', title: 'Día de la cocina chilena', caption: 'Celebremos el Día de la Cocina Chilena con sabores auténticos. Hoy menú especial con...', status: 'Borrador', type: 'Post', day: 15 },
  { id: 6, date: 'Sáb 18/04', pilar: 'Comunidad', title: 'Activación', caption: 'Este sábado ven a nuestra activación especial: taller de latte art gratuito para los primeros 20.', status: 'Programado', type: 'Post', day: 18 },
  { id: 7, date: 'Jue 23/04', pilar: 'Producto', title: 'Algo caliente', caption: 'Para días fríos, algo calentito. Descubre nuestras nuevas bebidas de temporada.', status: 'Borrador', type: 'Post', day: 23 },
  { id: 8, date: 'Sáb 25/04', pilar: 'Experiencia', title: 'Un día en Mokka', caption: 'Un día en Mokka: desde el primer espresso hasta el cierre. Acompáñanos.', status: 'Borrador', type: 'Reel', day: 25 },
  { id: 9, date: 'Mar 28/04', pilar: 'Producto', title: 'Carrusel nuevos productos', caption: 'Croissant Serrano, Croissant Salmón, Sandwich Milano, Triángulo Jamón Capresse.', status: 'Programado', type: 'Post', day: 28 },
]

const STORIES_DATA = [
  { id: 1, title: 'Promo Lunes', date: 'Lun 06/04', status: 'scheduled' },
  { id: 2, title: 'Behind Scenes', date: 'Mié 08/04', status: 'draft' },
  { id: 3, title: 'Nuevo Asaí', date: 'Jue 09/04', status: 'scheduled' },
  { id: 4, title: 'Encuesta', date: 'Vie 10/04', status: 'draft' },
  { id: 5, title: 'Espacio Mokka', date: 'Lun 13/04', status: 'draft' },
  { id: 6, title: 'Quiz Café', date: 'Mar 14/04', status: 'scheduled' },
  { id: 7, title: 'Countdown', date: 'Sáb 18/04', status: 'scheduled' },
]

const NETWORK_ICONS = {
  Instagram: '\u{1F4F7}',
  Facebook: '\u{1F310}',
  TikTok: '\u{1F3B5}',
}

const TABS = ['Marcas', 'Contenido', 'Calendario', 'Stories', 'Preview']

export default function FeedFlow() {
  const [activeTab, setActiveTab] = useState('Marcas')
  const [selectedBrand, setSelectedBrand] = useState(null)
  const [selectedPost, setSelectedPost] = useState(null)
  const [composerOpen, setComposerOpen] = useState(false)
  const [contentFilter, setContentFilter] = useState('Todos')
  const [hoveredTab, setHoveredTab] = useState(null)
  const [hoveredCard, setHoveredCard] = useState(null)
  const [hoveredPost, setHoveredPost] = useState(null)
  const [hoveredBtn, setHoveredBtn] = useState(null)
  const [composerData, setComposerData] = useState({
    caption: '',
    formato: 'Post',
    estado: 'Borrador',
    fecha: '',
    hora: '',
    etiquetas: [],
  })
  const [uploadedImage, setUploadedImage] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [postImages, setPostImages] = useState({}) // { postId: dataUrl }

  const handleImageFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      setUploadedImage(e.target.result)
      if (selectedPost) {
        setPostImages(prev => ({ ...prev, [selectedPost.id]: e.target.result }))
      }
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    handleImageFile(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  const handleFileSelect = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => handleImageFile(e.target.files[0])
    input.click()
  }

  const openComposer = (post = null) => {
    if (post) {
      setSelectedPost(post)
      setUploadedImage(postImages[post.id] || null)
      setComposerData({
        caption: post.caption,
        formato: post.type,
        estado: post.status,
        fecha: '',
        hora: '',
        etiquetas: [post.pilar],
      })
    } else {
      setSelectedPost(null)
      setUploadedImage(null)
      setComposerData({ caption: '', formato: 'Post', estado: 'Borrador', fecha: '', hora: '', etiquetas: [] })
    }
    setComposerOpen(true)
  }

  const toggleEtiqueta = (tag) => {
    setComposerData(prev => ({
      ...prev,
      etiquetas: prev.etiquetas.includes(tag)
        ? prev.etiquetas.filter(t => t !== tag)
        : [...prev.etiquetas, tag]
    }))
  }

  const handleBrandClick = (brand) => {
    setSelectedBrand(brand)
    setActiveTab('Contenido')
  }

  const filteredPosts = contentFilter === 'Todos'
    ? MOKKA_POSTS
    : contentFilter === 'Posts'
      ? MOKKA_POSTS.filter(p => p.type === 'Post')
      : contentFilter === 'Reels'
        ? MOKKA_POSTS.filter(p => p.type === 'Reel')
        : contentFilter === 'Stories'
          ? []
          : MOKKA_POSTS

  // Calendar helpers for April 2026
  const calStartDay = 2 // April 1, 2026 is Wednesday (0=Mon, 2=Wed)
  const calDays = 30
  const prevMonthDays = [30, 31]

  const renderMarcas = () => (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: COLORS.text, margin: 0, fontFamily: 'DM Sans, sans-serif' }}>FeedFlow</h1>
        <p style={{ color: COLORS.secondary, margin: '4px 0 0', fontSize: 15, fontFamily: 'DM Sans, sans-serif' }}>Gestiona el contenido de tus marcas</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
        {BRANDS.map((brand, i) => {
          const pct = Math.round((brand.done / brand.total) * 100)
          const isHovered = hoveredCard === brand.id
          return (
            <div
              key={brand.id}
              onClick={() => handleBrandClick(brand)}
              onMouseEnter={() => setHoveredCard(brand.id)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                background: COLORS.card,
                border: `1px solid ${isHovered ? brand.color : COLORS.border}`,
                borderRadius: 14,
                padding: 24,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                transform: isHovered ? 'translateY(-2px)' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: brand.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, fontWeight: 700, color: '#fff', fontFamily: 'DM Sans, sans-serif',
                }}>
                  {brand.initial}
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 600, color: COLORS.text, fontFamily: 'DM Sans, sans-serif' }}>{brand.name}</div>
                  <div style={{ fontSize: 13, color: COLORS.secondary, fontFamily: 'DM Sans, sans-serif' }}>{brand.desc}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
                {brand.networks.map(n => (
                  <span key={n} style={{
                    background: '#1e1e2e', borderRadius: 20, padding: '4px 12px',
                    fontSize: 12, color: COLORS.secondary, fontFamily: 'DM Sans, sans-serif',
                    display: 'flex', alignItems: 'center', gap: 4,
                  }}>
                    {NETWORK_ICONS[n]} {n}
                  </span>
                ))}
              </div>
              <div style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: COLORS.muted, fontFamily: 'DM Sans, sans-serif' }}>Progreso</span>
                  <span style={{ fontSize: 12, color: COLORS.secondary, fontFamily: 'DM Mono, monospace' }}>{brand.done}/{brand.total} posts</span>
                </div>
                <div style={{ height: 6, background: '#1e1e2e', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: COLORS.accent, borderRadius: 3, transition: 'width 0.3s ease' }} />
                </div>
              </div>
              <button
                style={{
                  marginTop: 12, width: '100%', padding: '10px 0',
                  background: 'transparent', border: `1px solid ${brand.color}`,
                  borderRadius: 8, color: brand.color, fontSize: 14, fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                  transition: 'all 0.2s ease',
                  ...(isHovered ? { background: brand.color, color: '#fff' } : {}),
                }}
              >
                Ver contenido
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )

  const renderContenido = () => {
    const brand = selectedBrand || BRANDS[0]
    const filterTabs = ['Todos', 'Posts', 'Stories', 'Reels']
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <button
            onClick={() => { setActiveTab('Marcas'); setSelectedBrand(null) }}
            onMouseEnter={() => setHoveredBtn('back')}
            onMouseLeave={() => setHoveredBtn(null)}
            style={{
              background: 'none', border: 'none', color: COLORS.text, fontSize: 22, cursor: 'pointer',
              padding: '4px 8px', borderRadius: 8,
              transition: 'background 0.15s',
              ...(hoveredBtn === 'back' ? { background: '#1e1e2e' } : {}),
            }}
          >
            &#8592;
          </button>
          <div>
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: COLORS.text, fontFamily: 'DM Sans, sans-serif' }}>{brand.name}</h2>
            <p style={{ margin: 0, fontSize: 13, color: COLORS.secondary, fontFamily: 'DM Sans, sans-serif' }}>{brand.desc}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {filterTabs.map(tab => (
            <button
              key={tab}
              onClick={() => setContentFilter(tab)}
              style={{
                padding: '8px 20px', borderRadius: 20, border: 'none',
                background: contentFilter === tab ? COLORS.accent : '#1e1e2e',
                color: contentFilter === tab ? '#fff' : COLORS.secondary,
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif', transition: 'all 0.15s',
              }}
            >
              {tab}
            </button>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {filteredPosts.map((post, i) => {
            const isHovered = hoveredPost === post.id
            const st = STATUS_STYLES[post.status]
            const pilarColor = PILAR_COLORS[post.pilar]
            return (
              <div
                key={post.id}
                onClick={() => openComposer(post)}
                onMouseEnter={() => setHoveredPost(post.id)}
                onMouseLeave={() => setHoveredPost(null)}
                style={{
                  background: COLORS.card,
                  border: `1px solid ${isHovered ? COLORS.accent : COLORS.border}`,
                  borderRadius: 12,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  transform: isHovered ? 'translateY(-2px)' : 'none',
                }}
              >
                <div style={{
                  height: 160, background: postImages[post.id] ? `url(${postImages[post.id]}) center/cover no-repeat` : GRADIENTS[i % GRADIENTS.length],
                  position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end',
                  padding: 10,
                }}>
                  <span style={{
                    background: 'rgba(0,0,0,0.5)', borderRadius: 6, padding: '3px 10px',
                    fontSize: 11, color: '#fff', fontWeight: 600, fontFamily: 'DM Sans, sans-serif',
                    backdropFilter: 'blur(4px)',
                  }}>
                    {post.type}
                  </span>
                </div>
                <div style={{ padding: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: COLORS.muted, fontFamily: 'DM Mono, monospace' }}>{post.date}</span>
                    <span style={{
                      background: st.bg, color: st.color, padding: '3px 10px',
                      borderRadius: 20, fontSize: 11, fontWeight: 600, fontFamily: 'DM Sans, sans-serif',
                    }}>
                      {post.status}
                    </span>
                  </div>
                  <p style={{
                    color: COLORS.text, fontSize: 13, lineHeight: 1.5, margin: '0 0 10px',
                    fontFamily: 'DM Sans, sans-serif',
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>
                    {post.caption}
                  </p>
                  <span style={{
                    background: pilarColor + '22', color: pilarColor,
                    padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                    fontFamily: 'DM Sans, sans-serif',
                  }}>
                    {post.pilar}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
        {/* Floating + button */}
        <button
          onClick={() => openComposer()}
          onMouseEnter={() => setHoveredBtn('fab')}
          onMouseLeave={() => setHoveredBtn(null)}
          style={{
            position: 'fixed', bottom: 32, right: 32,
            width: 56, height: 56, borderRadius: '50%',
            background: COLORS.accent, border: 'none',
            color: '#fff', fontSize: 28, fontWeight: 300,
            cursor: 'pointer', boxShadow: '0 4px 20px rgba(249,115,22,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'transform 0.2s ease',
            transform: hoveredBtn === 'fab' ? 'scale(1.1)' : 'scale(1)',
            zIndex: 50,
          }}
        >
          +
        </button>
      </div>
    )
  }

  const renderCalendario = () => {
    const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
    const cells = []

    // Previous month filler
    for (let i = 0; i < calStartDay; i++) {
      cells.push({ day: prevMonthDays[i], current: false, posts: [] })
    }
    // Current month
    for (let d = 1; d <= calDays; d++) {
      const dayPosts = MOKKA_POSTS.filter(p => p.day === d)
      cells.push({ day: d, current: true, posts: dayPosts })
    }
    // Fill remaining
    const remaining = 7 - (cells.length % 7)
    if (remaining < 7) {
      for (let i = 1; i <= remaining; i++) {
        cells.push({ day: i, current: false, posts: [] })
      }
    }

    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <button
            onMouseEnter={() => setHoveredBtn('calL')}
            onMouseLeave={() => setHoveredBtn(null)}
            style={{
              background: hoveredBtn === 'calL' ? '#1e1e2e' : 'none', border: 'none',
              color: COLORS.text, fontSize: 20, cursor: 'pointer', padding: '6px 12px', borderRadius: 8,
              transition: 'background 0.15s',
            }}
          >
            &#8592;
          </button>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: COLORS.text, fontFamily: 'DM Sans, sans-serif' }}>Abril 2026</h2>
          <button
            onMouseEnter={() => setHoveredBtn('calR')}
            onMouseLeave={() => setHoveredBtn(null)}
            style={{
              background: hoveredBtn === 'calR' ? '#1e1e2e' : 'none', border: 'none',
              color: COLORS.text, fontSize: 20, cursor: 'pointer', padding: '6px 12px', borderRadius: 8,
              transition: 'background 0.15s',
            }}
          >
            &#8594;
          </button>
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1,
          background: COLORS.border, borderRadius: 12, overflow: 'hidden', border: `1px solid ${COLORS.border}`,
        }}>
          {dayNames.map(d => (
            <div key={d} style={{
              padding: '12px 8px', textAlign: 'center', fontSize: 12, fontWeight: 600,
              color: COLORS.muted, background: COLORS.card, fontFamily: 'DM Sans, sans-serif',
            }}>
              {d}
            </div>
          ))}
          {cells.map((cell, i) => {
            const isToday = cell.current && cell.day === 7
            return (
              <div key={i} style={{
                background: COLORS.card, padding: 8, minHeight: 90, position: 'relative',
                borderLeft: isToday ? `2px solid ${COLORS.accent}` : 'none',
                borderRight: isToday ? `2px solid ${COLORS.accent}` : 'none',
                borderTop: isToday ? `2px solid ${COLORS.accent}` : 'none',
                borderBottom: isToday ? `2px solid ${COLORS.accent}` : 'none',
              }}>
                <div style={{
                  fontSize: 13, fontWeight: isToday ? 700 : 400, fontFamily: 'DM Mono, monospace',
                  color: !cell.current ? COLORS.muted : isToday ? COLORS.accent : COLORS.secondary,
                  marginBottom: 6,
                }}>
                  {cell.day}
                </div>
                {cell.posts.map(post => {
                  const dotColor = STATUS_STYLES[post.status]?.dot || COLORS.muted
                  return (
                    <div key={post.id} style={{
                      display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4,
                      cursor: 'pointer',
                    }} onClick={() => openComposer(post)}>
                      <div style={{
                        width: 6, height: 6, borderRadius: '50%', background: dotColor, flexShrink: 0,
                      }} />
                      <span style={{
                        fontSize: 10, color: COLORS.text, fontFamily: 'DM Sans, sans-serif',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>
                        {post.title}
                      </span>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderStories = () => (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: COLORS.text, fontFamily: 'DM Sans, sans-serif' }}>Stories</h2>
        <p style={{ margin: '4px 0 0', fontSize: 14, color: COLORS.secondary, fontFamily: 'DM Sans, sans-serif' }}>Planifica y organiza las stories de tus marcas</p>
      </div>
      <div style={{
        display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 16,
        scrollbarWidth: 'thin', scrollbarColor: `${COLORS.muted} transparent`,
      }}>
        {STORIES_DATA.map((story, i) => {
          const isDraft = story.status === 'draft'
          return (
            <div key={story.id} style={{ flexShrink: 0, textAlign: 'center' }}>
              <div
                onMouseEnter={() => setHoveredCard('story-' + story.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  width: 140, height: 249, borderRadius: 16,
                  background: GRADIENTS[i % GRADIENTS.length],
                  position: 'relative', cursor: 'pointer',
                  border: hoveredCard === 'story-' + story.id ? `2px solid ${COLORS.accent}` : '2px solid transparent',
                  transition: 'border 0.2s ease, transform 0.2s ease',
                  transform: hoveredCard === 'story-' + story.id ? 'translateY(-4px)' : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <span style={{
                  color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: 600,
                  fontFamily: 'DM Sans, sans-serif', textAlign: 'center', padding: '0 12px',
                }}>
                  {story.title}
                </span>
                <div style={{
                  position: 'absolute', top: 10, right: 10,
                  width: 10, height: 10, borderRadius: '50%',
                  background: isDraft ? COLORS.accent : '#60A5FA',
                  border: '2px solid rgba(0,0,0,0.3)',
                }} />
              </div>
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 12, color: COLORS.muted, fontFamily: 'DM Mono, monospace' }}>{story.date}</div>
                <div style={{ fontSize: 13, color: COLORS.text, fontWeight: 500, fontFamily: 'DM Sans, sans-serif', marginTop: 2 }}>{story.title}</div>
              </div>
            </div>
          )
        })}
        {/* Add new story card */}
        <div style={{ flexShrink: 0, textAlign: 'center' }}>
          <div
            onMouseEnter={() => setHoveredCard('story-add')}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              width: 140, height: 249, borderRadius: 16,
              border: `2px dashed ${hoveredCard === 'story-add' ? COLORS.accent : COLORS.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.2s ease',
              background: hoveredCard === 'story-add' ? 'rgba(249,115,22,0.05)' : 'transparent',
            }}
          >
            <span style={{ fontSize: 36, color: hoveredCard === 'story-add' ? COLORS.accent : COLORS.muted, transition: 'color 0.2s' }}>+</span>
          </div>
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 13, color: COLORS.muted, fontFamily: 'DM Sans, sans-serif' }}>Nueva story</div>
          </div>
        </div>
      </div>
      <p style={{ marginTop: 20, fontSize: 13, color: COLORS.muted, fontFamily: 'DM Sans, sans-serif', fontStyle: 'italic' }}>
        Arrastra y suelta para reordenar las stories
      </p>
    </div>
  )

  const [previewPost, setPreviewPost] = useState(null)
  const [showPlanned, setShowPlanned] = useState(true)
  const [hoveredPreviewPost, setHoveredPreviewPost] = useState(null)

  // Existing published posts (simulated current feed)
  const EXISTING_POSTS = [
    { id: 'e1', caption: 'Nuestro espresso de especialidad, directo a tu taza. ☕', date: 'Mar 25/03', isExisting: true, likes: 234, comments: 18 },
    { id: 'e2', caption: 'Nuevo horario: ahora abrimos a las 7:30 AM. ¡Los esperamos temprano! 🌅', date: 'Sáb 22/03', isExisting: true, likes: 187, comments: 32 },
    { id: 'e3', caption: 'Torta de chocolate belga, hecha con amor cada mañana. 🍫', date: 'Mié 19/03', isExisting: true, likes: 312, comments: 45 },
    { id: 'e4', caption: 'Feliz mes de la mujer. Hoy todas las bebidas con un 20% OFF 💜', date: 'Sáb 08/03', isExisting: true, likes: 456, comments: 67 },
    { id: 'e5', caption: 'Latte art level: master. ¿Qué diseño quieres hoy? ✨', date: 'Lun 03/03', isExisting: true, likes: 198, comments: 22 },
    { id: 'e6', caption: 'Viernes de croissants recién horneados 🥐', date: 'Vie 28/02', isExisting: true, likes: 267, comments: 38 },
  ]

  const EXISTING_GRADIENTS = [
    'linear-gradient(135deg, #2D1B69, #1a1a2e)',
    'linear-gradient(135deg, #1a3a2a, #0d1b2a)',
    'linear-gradient(135deg, #3d1f00, #1a0a00)',
    'linear-gradient(135deg, #2a0845, #1a1a2e)',
    'linear-gradient(135deg, #1a2a3d, #0a1628)',
    'linear-gradient(135deg, #3d2b00, #1a1500)',
  ]

  const renderPreview = () => {
    const brand = selectedBrand || BRANDS[0]
    const plannedPosts = MOKKA_POSTS.map(p => ({ ...p, isExisting: false }))
    const allPosts = showPlanned ? [...plannedPosts, ...EXISTING_POSTS] : [...EXISTING_POSTS]
    const totalPosts = 48 + (showPlanned ? plannedPosts.length : 0) // simulated total

    // Instagram post detail modal
    const renderPostDetail = () => {
      if (!previewPost) return null
      const isNew = !previewPost.isExisting
      const img = isNew ? postImages[previewPost.id] : null
      const gradient = isNew
        ? GRADIENTS[(previewPost.id - 1) % GRADIENTS.length]
        : EXISTING_GRADIENTS[EXISTING_POSTS.findIndex(p => p.id === previewPost.id) % EXISTING_GRADIENTS.length]
      return (
        <div
          onClick={() => setPreviewPost(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1001, backdropFilter: 'blur(6px)',
          }}
        >
          <div onClick={e => e.stopPropagation()} style={{
            background: '#fff', borderRadius: 12, maxWidth: 500, width: '95%',
            overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
          }}>
            {/* IG Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px' }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'linear-gradient(135deg, #F58529, #DD2A7B, #8134AF)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 13, fontWeight: 700,
              }}>{brand.initial}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#262626' }}>{brand.name.toLowerCase().replace(/\s/g, '')}</div>
              </div>
              {isNew && (
                <span style={{
                  marginLeft: 8, background: '#F97316', color: '#fff', fontSize: 10,
                  fontWeight: 700, padding: '2px 8px', borderRadius: 10,
                }}>NUEVO</span>
              )}
              <div style={{ marginLeft: 'auto', color: '#262626', fontSize: 18, cursor: 'pointer' }}>⋯</div>
            </div>
            {/* Image */}
            <div style={{
              width: '100%', aspectRatio: '1',
              background: img ? `url(${img}) center/cover` : gradient,
            }} />
            {/* Actions */}
            <div style={{ padding: '10px 14px', display: 'flex', gap: 16, alignItems: 'center' }}>
              <span style={{ fontSize: 22, cursor: 'pointer' }}>♡</span>
              <span style={{ fontSize: 20, cursor: 'pointer' }}>💬</span>
              <span style={{ fontSize: 20, cursor: 'pointer' }}>↗</span>
              <span style={{ marginLeft: 'auto', fontSize: 20, cursor: 'pointer' }}>🔖</span>
            </div>
            {/* Likes */}
            <div style={{ padding: '0 14px', fontSize: 13, fontWeight: 700, color: '#262626' }}>
              {previewPost.likes || '—'} Me gusta
            </div>
            {/* Caption */}
            <div style={{ padding: '6px 14px 14px', fontSize: 13, color: '#262626', lineHeight: 1.5 }}>
              <span style={{ fontWeight: 700, marginRight: 6 }}>{brand.name.toLowerCase().replace(/\s/g, '')}</span>
              {previewPost.caption}
            </div>
            {/* Date + Status */}
            <div style={{ padding: '0 14px 14px', fontSize: 10, color: '#8e8e8e', textTransform: 'uppercase' }}>
              {previewPost.date} {previewPost.status ? `• ${previewPost.status}` : ''}
            </div>
          </div>
        </div>
      )
    }

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: COLORS.text, margin: 0, fontFamily: 'DM Sans, sans-serif' }}>Preview del Feed</h2>
            <p style={{ color: COLORS.secondary, margin: '4px 0 0', fontSize: 14, fontFamily: 'DM Sans, sans-serif' }}>
              Posts actuales + programados de abril
            </p>
          </div>
          {/* Toggle */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            background: COLORS.card, border: `1px solid ${COLORS.border}`,
            borderRadius: 10, padding: '8px 16px',
          }}>
            <span style={{ fontSize: 13, color: COLORS.secondary, fontFamily: 'DM Sans, sans-serif' }}>Mostrar programados</span>
            <div
              onClick={() => setShowPlanned(!showPlanned)}
              style={{
                width: 44, height: 24, borderRadius: 12, cursor: 'pointer',
                background: showPlanned ? COLORS.accent : COLORS.border,
                position: 'relative', transition: 'background 0.2s',
              }}
            >
              <div style={{
                width: 18, height: 18, borderRadius: '50%', background: '#fff',
                position: 'absolute', top: 3,
                left: showPlanned ? 23 : 3,
                transition: 'left 0.2s',
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
              }} />
            </div>
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#8e8e8e' }} />
            <span style={{ fontSize: 12, color: COLORS.secondary, fontFamily: 'DM Sans, sans-serif' }}>Publicado ({EXISTING_POSTS.length})</span>
          </div>
          {showPlanned && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS.accent }} />
              <span style={{ fontSize: 12, color: COLORS.secondary, fontFamily: 'DM Sans, sans-serif' }}>Programado abril ({MOKKA_POSTS.length})</span>
            </div>
          )}
        </div>

        {/* Instagram Phone Frame */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{
            width: 380, background: '#fff', borderRadius: 24,
            border: '3px solid #333', overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          }}>
            {/* Status bar */}
            <div style={{
              height: 28, background: '#fff', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 12, fontWeight: 600, color: '#000',
            }}>9:41</div>

            {/* IG Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '6px 16px 10px', borderBottom: '1px solid #efefef',
            }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: '#262626', fontFamily: 'DM Sans, sans-serif' }}>
                {brand.name.toLowerCase().replace(/\s/g, '')}
              </span>
              <div style={{ display: 'flex', gap: 16 }}>
                <span style={{ fontSize: 18 }}>♡</span>
                <span style={{ fontSize: 18 }}>💬</span>
              </div>
            </div>

            {/* Stories row */}
            <div style={{
              display: 'flex', gap: 12, padding: '12px 16px', overflowX: 'auto',
              borderBottom: '1px solid #efefef',
            }}>
              <div style={{ textAlign: 'center', flexShrink: 0 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #F58529, #DD2A7B, #8134AF)',
                  padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{
                    width: 50, height: 50, borderRadius: '50%', background: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18, fontWeight: 700, color: COLORS.accent,
                  }}>{brand.initial}</div>
                </div>
                <div style={{ fontSize: 10, color: '#262626', marginTop: 4 }}>Tu historia</div>
              </div>
              {STORIES_DATA.slice(0, 4).map((s, i) => (
                <div key={s.id} style={{ textAlign: 'center', flexShrink: 0 }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #F58529, #DD2A7B, #8134AF)',
                    padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <div style={{ width: 50, height: 50, borderRadius: '50%', background: GRADIENTS[(i + 3) % GRADIENTS.length] }} />
                  </div>
                  <div style={{ fontSize: 10, color: '#262626', marginTop: 4, maxWidth: 56, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.title}</div>
                </div>
              ))}
            </div>

            {/* Profile Section */}
            <div style={{ padding: '16px 16px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 12 }}>
                <div style={{
                  width: 72, height: 72, borderRadius: '50%', flexShrink: 0,
                  background: `linear-gradient(135deg, ${brand.color}, ${brand.color}88)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 28, fontWeight: 700, color: '#fff',
                }}>{brand.initial}</div>
                <div style={{ display: 'flex', gap: 20, flex: 1, justifyContent: 'center' }}>
                  {[{ n: totalPosts, l: 'Posts' }, { n: '2.4K', l: 'Seguidores' }, { n: '186', l: 'Siguiendo' }].map((s, i) => (
                    <div key={i} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: '#262626' }}>{s.n}</div>
                      <div style={{ fontSize: 12, color: '#8e8e8e' }}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 4 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#262626' }}>{brand.name}</div>
                <div style={{ fontSize: 13, color: '#8e8e8e' }}>{brand.desc}</div>
                <div style={{ fontSize: 13, color: '#262626', marginTop: 2 }}>☕ El mejor café de especialidad ✨</div>
              </div>
              <button style={{
                width: '100%', padding: '6px 0', border: '1px solid #dbdbdb',
                borderRadius: 8, background: '#fafafa', fontSize: 13,
                fontWeight: 600, color: '#262626', cursor: 'pointer', marginTop: 8, marginBottom: 12,
              }}>Editar perfil</button>
            </div>

            {/* Tab bar */}
            <div style={{ display: 'flex', borderBottom: '1px solid #efefef' }}>
              <div style={{ flex: 1, textAlign: 'center', padding: '10px 0', borderBottom: '2px solid #262626', fontSize: 16 }}>▦</div>
              <div style={{ flex: 1, textAlign: 'center', padding: '10px 0', color: '#8e8e8e', fontSize: 16 }}>▶</div>
              <div style={{ flex: 1, textAlign: 'center', padding: '10px 0', color: '#8e8e8e', fontSize: 16 }}>📌</div>
            </div>

            {/* Feed Grid 3x3 - Planned first, then existing */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2,
            }}>
              {allPosts.map((post, i) => {
                const isNew = !post.isExisting
                const img = isNew ? postImages[post.id] : null
                const gradient = isNew
                  ? GRADIENTS[(post.id - 1) % GRADIENTS.length]
                  : EXISTING_GRADIENTS[EXISTING_POSTS.findIndex(p => p.id === post.id) % EXISTING_GRADIENTS.length]
                const isHov = hoveredPreviewPost === (post.id + (isNew ? '' : '_e'))
                return (
                  <div
                    key={post.id + (isNew ? '' : '_e')}
                    onClick={() => setPreviewPost(post)}
                    onMouseEnter={() => setHoveredPreviewPost(post.id + (isNew ? '' : '_e'))}
                    onMouseLeave={() => setHoveredPreviewPost(null)}
                    style={{
                      aspectRatio: '1', cursor: 'pointer',
                      background: img ? `url(${img}) center/cover` : gradient,
                      position: 'relative', overflow: 'hidden',
                    }}
                  >
                    {/* New post indicator */}
                    {isNew && (
                      <div style={{
                        position: 'absolute', top: 4, left: 4, zIndex: 2,
                        width: 8, height: 8, borderRadius: '50%',
                        background: COLORS.accent, border: '1.5px solid #fff',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                      }} />
                    )}
                    {/* Hover overlay */}
                    {isHov && (
                      <div style={{
                        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        gap: 8,
                      }}>
                        <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>♡ {post.likes || '—'}</span>
                        <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>💬 {post.comments || '—'}</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {renderPostDetail()}
      </div>
    )
  }

  const renderComposer = () => {
    if (!composerOpen) return null
    const post = selectedPost
    return (
      <div
        onClick={() => setComposerOpen(false)}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, backdropFilter: 'blur(4px)',
          animation: 'fadeIn 0.2s ease',
        }}
      >
        <div
          onClick={e => e.stopPropagation()}
          style={{
            background: COLORS.bg, border: `1px solid ${COLORS.border}`,
            borderRadius: 16, maxWidth: 800, width: '95%', maxHeight: '90vh',
            overflow: 'auto', position: 'relative',
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '20px 24px', borderBottom: `1px solid ${COLORS.border}`,
          }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: COLORS.text, fontFamily: 'DM Sans, sans-serif' }}>
              {post ? post.title : 'Nuevo post'}
            </h3>
            <button
              onClick={() => setComposerOpen(false)}
              onMouseEnter={() => setHoveredBtn('closeX')}
              onMouseLeave={() => setHoveredBtn(null)}
              style={{
                background: hoveredBtn === 'closeX' ? '#1e1e2e' : 'none',
                border: 'none', color: COLORS.secondary, fontSize: 22, cursor: 'pointer',
                width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.15s',
              }}
            >
              &#10005;
            </button>
          </div>
          {/* Body - two columns */}
          <div style={{ display: 'flex', gap: 0 }}>
            {/* LEFT - Image Upload */}
            <div style={{
              flex: 1, padding: 24, borderRight: `1px solid ${COLORS.border}`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300,
            }}>
              <div
                onClick={handleFileSelect}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                style={{
                  width: '100%', height: 280, borderRadius: 12,
                  border: uploadedImage ? 'none' : `2px dashed ${isDragging ? COLORS.accent : COLORS.border}`,
                  background: uploadedImage ? 'transparent' : (isDragging ? 'rgba(249,115,22,0.08)' : (post ? GRADIENTS[(post.id - 1) % GRADIENTS.length] : 'transparent')),
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
                  cursor: 'pointer', transition: 'all 0.2s ease', overflow: 'hidden', position: 'relative',
                }}
              >
                {uploadedImage ? (
                  <img src={uploadedImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }} />
                ) : (
                  <>
                    <span style={{ fontSize: 36, color: isDragging ? COLORS.accent : 'rgba(255,255,255,0.5)' }}>📷</span>
                    <span style={{ color: isDragging ? COLORS.accent : 'rgba(255,255,255,0.6)', fontSize: 14, fontFamily: 'DM Sans, sans-serif', textAlign: 'center', padding: '0 20px' }}>
                      {isDragging ? 'Suelta la imagen aquí' : 'Arrastra una imagen o haz clic para subir'}
                    </span>
                  </>
                )}
              </div>
              {uploadedImage && (
                <button
                  onClick={(e) => { e.stopPropagation(); setUploadedImage(null); if (selectedPost) setPostImages(prev => { const n = {...prev}; delete n[selectedPost.id]; return n }) }}
                  style={{
                    marginTop: 12, background: 'transparent', border: `1px solid ${COLORS.border}`,
                    borderRadius: 8, padding: '6px 16px', color: COLORS.secondary, fontSize: 12,
                    fontFamily: 'DM Sans, sans-serif', cursor: 'pointer', transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.color = COLORS.secondary }}
                >
                  Eliminar imagen
                </button>
              )}
            </div>
            {/* RIGHT */}
            <div style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Caption */}
              <div>
                <label style={{ display: 'block', fontSize: 12, color: COLORS.muted, fontFamily: 'DM Sans, sans-serif', marginBottom: 6, fontWeight: 600 }}>
                  Texto / Copy
                </label>
                <textarea
                  value={composerData.caption}
                  onChange={e => setComposerData(p => ({ ...p, caption: e.target.value }))}
                  style={{
                    width: '100%', minHeight: 100, background: COLORS.card,
                    border: `1px solid ${COLORS.border}`, borderRadius: 10,
                    color: COLORS.text, padding: 12, fontSize: 13, fontFamily: 'DM Sans, sans-serif',
                    resize: 'vertical', outline: 'none', boxSizing: 'border-box',
                  }}
                  maxLength={2200}
                />
                <div style={{ textAlign: 'right', fontSize: 11, color: COLORS.muted, fontFamily: 'DM Mono, monospace', marginTop: 4 }}>
                  {composerData.caption.length}/2,200
                </div>
              </div>
              {/* Formato + Estado */}
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 12, color: COLORS.muted, fontFamily: 'DM Sans, sans-serif', marginBottom: 6, fontWeight: 600 }}>Formato</label>
                  <select
                    value={composerData.formato}
                    onChange={e => setComposerData(p => ({ ...p, formato: e.target.value }))}
                    style={{
                      width: '100%', padding: '10px 12px', background: COLORS.card,
                      border: `1px solid ${COLORS.border}`, borderRadius: 8,
                      color: COLORS.text, fontSize: 13, fontFamily: 'DM Sans, sans-serif',
                      outline: 'none', cursor: 'pointer', appearance: 'auto',
                    }}
                  >
                    <option value="Post">Post</option>
                    <option value="Story">Story</option>
                    <option value="Reel">Reel</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 12, color: COLORS.muted, fontFamily: 'DM Sans, sans-serif', marginBottom: 6, fontWeight: 600 }}>Estado</label>
                  <select
                    value={composerData.estado}
                    onChange={e => setComposerData(p => ({ ...p, estado: e.target.value }))}
                    style={{
                      width: '100%', padding: '10px 12px', background: COLORS.card,
                      border: `1px solid ${COLORS.border}`, borderRadius: 8,
                      color: COLORS.text, fontSize: 13, fontFamily: 'DM Sans, sans-serif',
                      outline: 'none', cursor: 'pointer', appearance: 'auto',
                    }}
                  >
                    <option value="Borrador">Borrador</option>
                    <option value="En revisión">En revisión</option>
                    <option value="Aprobado">Aprobado</option>
                    <option value="Programado">Programado</option>
                  </select>
                </div>
              </div>
              {/* Fecha + Hora */}
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 12, color: COLORS.muted, fontFamily: 'DM Sans, sans-serif', marginBottom: 6, fontWeight: 600 }}>Fecha</label>
                  <input
                    type="date"
                    value={composerData.fecha}
                    onChange={e => setComposerData(p => ({ ...p, fecha: e.target.value }))}
                    style={{
                      width: '100%', padding: '10px 12px', background: COLORS.card,
                      border: `1px solid ${COLORS.border}`, borderRadius: 8,
                      color: COLORS.text, fontSize: 13, fontFamily: 'DM Sans, sans-serif',
                      outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 12, color: COLORS.muted, fontFamily: 'DM Sans, sans-serif', marginBottom: 6, fontWeight: 600 }}>Hora</label>
                  <input
                    type="time"
                    value={composerData.hora}
                    onChange={e => setComposerData(p => ({ ...p, hora: e.target.value }))}
                    style={{
                      width: '100%', padding: '10px 12px', background: COLORS.card,
                      border: `1px solid ${COLORS.border}`, borderRadius: 8,
                      color: COLORS.text, fontSize: 13, fontFamily: 'DM Sans, sans-serif',
                      outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>
              {/* Etiquetas */}
              <div>
                <label style={{ display: 'block', fontSize: 12, color: COLORS.muted, fontFamily: 'DM Sans, sans-serif', marginBottom: 8, fontWeight: 600 }}>Etiquetas</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {Object.keys(PILAR_COLORS).map(tag => {
                    const active = composerData.etiquetas.includes(tag)
                    return (
                      <button
                        key={tag}
                        onClick={() => toggleEtiqueta(tag)}
                        style={{
                          padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                          fontFamily: 'DM Sans, sans-serif', cursor: 'pointer',
                          border: active ? 'none' : `1px solid ${COLORS.border}`,
                          background: active ? COLORS.accent : 'transparent',
                          color: active ? '#fff' : COLORS.secondary,
                          transition: 'all 0.15s',
                        }}
                      >
                        {tag}
                      </button>
                    )
                  })}
                </div>
              </div>
              {/* Comentarios */}
              <div>
                <label style={{ display: 'block', fontSize: 12, color: COLORS.muted, fontFamily: 'DM Sans, sans-serif', marginBottom: 10, fontWeight: 600 }}>Comentarios</label>
                {[
                  { name: 'Carla L.', text: 'Me gusta el copy, pero cambiemos la foto por una más cálida.', time: 'Hace 2 horas', color: '#EC4899' },
                  { name: 'Emilio L.', text: 'Listo, actualizo la imagen hoy.', time: 'Hace 1 hora', color: '#3B82F6' },
                ].map((c, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', background: c.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0,
                      fontFamily: 'DM Sans, sans-serif',
                    }}>
                      {c.name[0]}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, fontFamily: 'DM Sans, sans-serif' }}>{c.name}</span>
                        <span style={{ fontSize: 11, color: COLORS.muted, fontFamily: 'DM Sans, sans-serif' }}>{c.time}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: 13, color: COLORS.secondary, lineHeight: 1.4, fontFamily: 'DM Sans, sans-serif' }}>{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Footer */}
          <div style={{
            display: 'flex', justifyContent: 'flex-end', gap: 12,
            padding: '16px 24px', borderTop: `1px solid ${COLORS.border}`,
          }}>
            <button
              onMouseEnter={() => setHoveredBtn('saveDraft')}
              onMouseLeave={() => setHoveredBtn(null)}
              style={{
                padding: '10px 24px', borderRadius: 10,
                border: `1px solid ${COLORS.border}`,
                background: hoveredBtn === 'saveDraft' ? '#1e1e2e' : 'transparent',
                color: COLORS.text, fontSize: 14, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                transition: 'background 0.15s',
              }}
            >
              Guardar borrador
            </button>
            <button
              onMouseEnter={() => setHoveredBtn('sendReview')}
              onMouseLeave={() => setHoveredBtn(null)}
              style={{
                padding: '10px 24px', borderRadius: 10, border: 'none',
                background: hoveredBtn === 'sendReview' ? '#ea6c0e' : COLORS.accent,
                color: '#fff', fontSize: 14, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                transition: 'background 0.15s',
              }}
            >
              Enviar a revisión
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Layout>
      <div style={{ padding: '24px 32px', minHeight: '100vh', fontFamily: 'DM Sans, sans-serif' }}>
        {/* Tab navigation */}
        <div style={{
          display: 'flex', gap: 4, marginBottom: 32,
          background: COLORS.card, borderRadius: 12, padding: 4,
          border: `1px solid ${COLORS.border}`, width: 'fit-content',
        }}>
          {TABS.map(tab => {
            const isActive = activeTab === tab
            const isHov = hoveredTab === tab
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                onMouseEnter={() => setHoveredTab(tab)}
                onMouseLeave={() => setHoveredTab(null)}
                style={{
                  padding: '10px 24px', borderRadius: 8, border: 'none',
                  background: isActive ? COLORS.accent : isHov ? '#1e1e2e' : 'transparent',
                  color: isActive ? '#fff' : isHov ? COLORS.text : COLORS.secondary,
                  fontSize: 14, fontWeight: 600, cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab}
              </button>
            )
          })}
        </div>

        {activeTab === 'Marcas' && renderMarcas()}
        {activeTab === 'Contenido' && renderContenido()}
        {activeTab === 'Calendario' && renderCalendario()}
        {activeTab === 'Stories' && renderStories()}
        {activeTab === 'Preview' && renderPreview()}

        {renderComposer()}
      </div>
    </Layout>
  )
}
