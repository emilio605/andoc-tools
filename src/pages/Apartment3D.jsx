import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/* ─────────────────────────────────────────────
   Floor-plan constants (metres)
   ───────────────────────────────────────────── */
const RW  = 7.5   // room width  (X)
const RD  = 6.5   // room depth  (Z)
const RH  = 2.4   // ceiling height (Y)
const EW  = 1.2   // entrance notch width
const ED  = 1.8   // entrance notch depth
const WT  = 0.12  // wall thickness

/* Furniture from plan */
const RACK_W = 2.00, RACK_D = 0.40, RACK_H = 1.80
const SOFA_W = 1.30, SOFA_D = 0.80, SOFA_H = 0.85
const TABLE_W = 1.80, TABLE_D = 0.80, TABLE_H = 0.76
const BAR_W  = 0.80, BAR_D  = 1.50, BAR_H  = 1.10
const WIN_Z0 = 1.5, WIN_Z1 = 4.5   // ventanal on left wall (3 m span)
const WIN_Y0 = 0.85, WIN_Y1 = 2.25

/* Vertical furniture stack starts 1 m from left, against top wall */
const FX = 1.0
const RACK_Z  = WT                               // against top wall
const SOFA_Z  = RACK_Z  + RACK_D  + 0.70
const TABLE_Z = SOFA_Z  + SOFA_D  + 0.70

/* Barra bar: right-centre of room */
const BAR_X = 4.0, BAR_Z = 2.8

function createScene(canvas) {
  /* ── Renderer ──────────────────────────────── */
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
  renderer.setSize(canvas.clientWidth, canvas.clientHeight)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.1

  /* ── Scene ─────────────────────────────────── */
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xbdd9f2)
  scene.fog = new THREE.FogExp2(0xbdd9f2, 0.028)

  /* ── Camera ────────────────────────────────── */
  const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 120)
  camera.position.set(10, 9, 15)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.target.set(RW / 2, 0.8, RD / 2)
  controls.enableDamping = true
  controls.dampingFactor = 0.07
  controls.minDistance = 3
  controls.maxDistance = 28
  controls.maxPolarAngle = Math.PI / 2.05

  /* ── Lighting ──────────────────────────────── */
  scene.add(new THREE.AmbientLight(0xfff8f0, 0.75))

  const sun = new THREE.DirectionalLight(0xfff5e0, 1.5)
  sun.position.set(-6, 14, 6)
  sun.castShadow = true
  sun.shadow.mapSize.setScalar(2048)
  Object.assign(sun.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16, near: 0.5, far: 50 })
  scene.add(sun)

  const fill = new THREE.DirectionalLight(0xc8e8ff, 0.5)
  fill.position.set(12, 8, -4)
  scene.add(fill)

  /* Warm point light inside room */
  const room_light = new THREE.PointLight(0xfff0cc, 1.2, 12)
  room_light.position.set(RW / 2, RH - 0.3, RD / 2)
  room_light.castShadow = true
  scene.add(room_light)

  /* ── Materials ─────────────────────────────── */
  const M = {
    floor:  new THREE.MeshStandardMaterial({ color: 0xC4A97A, roughness: 0.8 }),
    wall:   new THREE.MeshStandardMaterial({ color: 0xF2EDE6, roughness: 0.9 }),
    ceil:   new THREE.MeshStandardMaterial({ color: 0xFAF9F6, roughness: 0.95 }),
    glass:  new THREE.MeshStandardMaterial({ color: 0x9DD5F5, transparent: true, opacity: 0.22, roughness: 0.05, metalness: 0.1 }),
    frame:  new THREE.MeshStandardMaterial({ color: 0xD0C2A8, roughness: 0.6 }),
    rack:   new THREE.MeshStandardMaterial({ color: 0x5C400E, roughness: 0.7 }),
    sofa:   new THREE.MeshStandardMaterial({ color: 0x2E6DB4, roughness: 0.85 }),
    table:  new THREE.MeshStandardMaterial({ color: 0xA0622A, roughness: 0.65 }),
    bar:    new THREE.MeshStandardMaterial({ color: 0x4A2512, roughness: 0.6 }),
    outside:new THREE.MeshStandardMaterial({ color: 0x8ab87a, roughness: 1.0 }),
    skirting: new THREE.MeshStandardMaterial({ color: 0xE5DDD2, roughness: 0.7 }),
  }

  /* ── Helpers ───────────────────────────────── */
  function box(w, h, d, mat, x, y, z) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat)
    m.position.set(x, y, z)
    m.castShadow = true
    m.receiveShadow = true
    scene.add(m)
    return m
  }

  /* ── Ground (outside) ──────────────────────── */
  box(60, 0.08, 60, M.outside, 0, -0.04, 0)

  /* ── Floor ─────────────────────────────────── */
  box(RW, 0.07, RD, M.floor, RW / 2, -0.035, RD / 2)

  /* ── Ceiling ───────────────────────────────── */
  box(RW, 0.07, RD, M.ceil, RW / 2, RH + 0.035, RD / 2)

  /* ── Walls (L-shaped room) ─────────────────── */
  // Left wall (X=0), full depth
  box(WT, RH, RD, M.wall, WT / 2, RH / 2, RD / 2)

  // Back wall (Z=RD), full width
  box(RW, RH, WT, M.wall, RW / 2, RH / 2, RD + WT / 2)

  // Top wall: left section (X=0 → X=RW-EW)
  box(RW - EW, RH, WT, M.wall, (RW - EW) / 2, RH / 2, -WT / 2)

  // Step wall at X=RW-EW (from Z=0 to Z=ED) — inner face of entrance notch
  box(WT, RH, ED, M.wall, RW - EW - WT / 2, RH / 2, ED / 2)

  // Step floor (horizontal wall at Z=ED between X=RW-EW and X=RW)
  box(EW + WT, RH, WT, M.wall, RW - EW / 2, RH / 2, ED + WT / 2)

  // Right wall: from Z=ED to Z=RD
  box(WT, RH, RD - ED, M.wall, RW + WT / 2, RH / 2, ED + (RD - ED) / 2)

  /* ── Skirting board strip ──────────────────── */
  const sk = 0.08, st = 0.01
  box(WT, sk, RD, M.skirting, WT + st / 2, sk / 2, RD / 2)         // left wall inner
  box(RW, sk, WT, M.skirting, RW / 2, sk / 2, RD - st / 2)          // back wall inner

  /* ── VENTANAL (window on left wall) ───────── */
  const winW = WIN_Z1 - WIN_Z0
  const winH = WIN_Y1 - WIN_Y0
  const fW = 0.06
  // Glass
  box(0.04, winH, winW, M.glass, 0.08, (WIN_Y0 + WIN_Y1) / 2, (WIN_Z0 + WIN_Z1) / 2)
  // Frame
  box(fW, fW, winW + fW * 2, M.frame, 0.06, WIN_Y1 + fW / 2, (WIN_Z0 + WIN_Z1) / 2) // top
  box(fW, fW, winW + fW * 2, M.frame, 0.06, WIN_Y0 - fW / 2, (WIN_Z0 + WIN_Z1) / 2) // bottom
  box(fW, winH + fW * 2, fW, M.frame, 0.06, (WIN_Y0 + WIN_Y1) / 2, WIN_Z0 - fW / 2) // left
  box(fW, winH + fW * 2, fW, M.frame, 0.06, (WIN_Y0 + WIN_Y1) / 2, WIN_Z1 + fW / 2) // right
  // Mid divider
  box(fW, winH, fW, M.frame, 0.06, (WIN_Y0 + WIN_Y1) / 2, (WIN_Z0 + WIN_Z1) / 2)

  /* ── RACK (2.00 × 0.40 m) ─────────────────── */
  const rackCX = FX + RACK_W / 2
  const rackCZ = RACK_Z + RACK_D / 2
  box(RACK_W, RACK_H, RACK_D, M.rack, rackCX, RACK_H / 2, rackCZ)
  // Shelf lines
  for (let i = 1; i <= 3; i++) {
    const sh = new THREE.Mesh(
      new THREE.BoxGeometry(RACK_W, 0.03, RACK_D + 0.01),
      new THREE.MeshStandardMaterial({ color: 0x3a2500 })
    )
    sh.position.set(rackCX, (RACK_H / 4) * i, rackCZ)
    scene.add(sh)
  }

  /* ── SILLÓN (1.30 × 0.80 m) ───────────────── */
  const sofaCX = FX + SOFA_W / 2
  const sofaCZ = SOFA_Z + SOFA_D / 2
  // Base
  box(SOFA_W, SOFA_H * 0.55, SOFA_D, M.sofa, sofaCX, SOFA_H * 0.275, sofaCZ)
  // Back rest
  box(SOFA_W, SOFA_H * 0.5, 0.18, M.sofa, sofaCX, SOFA_H * 0.55 + SOFA_H * 0.25, SOFA_Z + 0.09)
  // Armrests
  box(0.12, SOFA_H * 0.65, SOFA_D, M.sofa, FX + 0.06, SOFA_H * 0.325, sofaCZ)
  box(0.12, SOFA_H * 0.65, SOFA_D, M.sofa, FX + SOFA_W - 0.06, SOFA_H * 0.325, sofaCZ)
  // Cushion highlight
  box(SOFA_W - 0.18, 0.06, SOFA_D - 0.22, new THREE.MeshStandardMaterial({ color: 0x5a9bd5, roughness: 0.9 }),
    sofaCX, SOFA_H * 0.55 + 0.03, sofaCZ + 0.05)

  /* ── MESA (1.80 × 0.80 m) ─────────────────── */
  const tableCX = FX + TABLE_W / 2
  const tableCZ = TABLE_Z + TABLE_D / 2
  // Tabletop
  box(TABLE_W, 0.06, TABLE_D, M.table, tableCX, TABLE_H, tableCZ)
  // Legs
  const legMat = new THREE.MeshStandardMaterial({ color: 0x7a4820, roughness: 0.6 })
  const legH = TABLE_H - 0.06
  const off = 0.08
  ;[
    [FX + off, tableCZ - TABLE_D / 2 + off],
    [FX + TABLE_W - off, tableCZ - TABLE_D / 2 + off],
    [FX + off, tableCZ + TABLE_D / 2 - off],
    [FX + TABLE_W - off, tableCZ + TABLE_D / 2 - off],
  ].forEach(([lx, lz]) => box(0.06, legH, 0.06, legMat, lx, legH / 2, lz))

  /* ── BARRA BAR (0.80 × 1.50 m) ────────────── */
  // Counter body
  box(BAR_W, BAR_H, BAR_D, M.bar, BAR_X + BAR_W / 2, BAR_H / 2, BAR_Z + BAR_D / 2)
  // Countertop overhang
  box(BAR_W + 0.1, 0.05, BAR_D + 0.08, new THREE.MeshStandardMaterial({ color: 0x2a1208 }),
    BAR_X + BAR_W / 2, BAR_H + 0.025, BAR_Z + BAR_D / 2)

  /* ── Floating labels ───────────────────────── */
  const labels = [
    { text: 'RACK\n2,00 × 0,40 m', x: rackCX,              y: RACK_H + 0.35,  z: rackCZ },
    { text: 'SILLÓN\n1,30 × 0,80 m', x: sofaCX,            y: SOFA_H + 0.35,  z: sofaCZ },
    { text: 'MESA\n1,80 × 0,80 m',   x: tableCX,           y: TABLE_H + 0.35, z: tableCZ },
    { text: 'BARRA BAR\n0,80 × 1,50 m', x: BAR_X + BAR_W / 2, y: BAR_H + 0.35, z: BAR_Z + BAR_D / 2 },
    { text: 'VENTANAL\n3,00 m',       x: 0.6,               y: 2.0,            z: (WIN_Z0 + WIN_Z1) / 2 },
    { text: 'ENTRADA',                x: RW - EW / 2,       y: RH - 0.3,       z: ED / 2 },
  ]

  labels.forEach(({ text, x, y, z }) => {
    const lines = text.split('\n')
    const cw = 320, ch = lines.length > 1 ? 80 : 56
    const cnv = document.createElement('canvas')
    cnv.width = cw; cnv.height = ch
    const ctx = cnv.getContext('2d')
    ctx.fillStyle = 'rgba(255,255,255,0.88)'
    ctx.beginPath()
    ctx.roundRect(3, 3, cw - 6, ch - 6, 10)
    ctx.fill()
    ctx.fillStyle = '#1a1a1a'
    ctx.textAlign = 'center'
    if (lines.length === 1) {
      ctx.font = 'bold 28px sans-serif'
      ctx.fillText(lines[0], cw / 2, ch / 2 + 9)
    } else {
      ctx.font = 'bold 26px sans-serif'
      ctx.fillText(lines[0], cw / 2, 30)
      ctx.font = '20px sans-serif'
      ctx.fillStyle = '#555'
      ctx.fillText(lines[1], cw / 2, 58)
    }
    const tex = new THREE.CanvasTexture(cnv)
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }))
    sprite.position.set(x, y, z)
    sprite.scale.set(1.4, ch / cw * 1.4, 1)
    scene.add(sprite)
  })

  /* ── Dimension lines (dashed) ──────────────── */
  function dimLine(from, to, color = 0x444444) {
    const pts = [new THREE.Vector3(...from), new THREE.Vector3(...to)]
    const geo = new THREE.BufferGeometry().setFromPoints(pts)
    const mat = new THREE.LineDashedMaterial({ color, dashSize: 0.1, gapSize: 0.06 })
    const line = new THREE.Line(geo, mat)
    line.computeLineDistances()
    scene.add(line)
  }
  // Window span indicator
  dimLine([0.25, (WIN_Y0 + WIN_Y1) / 2, WIN_Z0], [0.25, (WIN_Y0 + WIN_Y1) / 2, WIN_Z1], 0x2277cc)

  /* ── Animation loop ────────────────────────── */
  let animId
  const clock = new THREE.Clock()

  function animate() {
    animId = requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
  }
  animate()

  /* ── Resize ────────────────────────────────── */
  function onResize() {
    const w = canvas.clientWidth, h = canvas.clientHeight
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h, false)
  }
  const ro = new ResizeObserver(onResize)
  ro.observe(canvas)

  return () => {
    cancelAnimationFrame(animId)
    ro.disconnect()
    renderer.dispose()
  }
}

export default function Apartment3D() {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return
    const dispose = createScene(canvasRef.current)
    return dispose
  }, [])

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', background: '#0d1117' }}>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />

      {/* HUD */}
      <div style={{
        position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)',
        background: 'rgba(0,0,0,0.6)', color: '#fff',
        fontFamily: 'system-ui, sans-serif', fontSize: 13,
        padding: '7px 18px', borderRadius: 20, pointerEvents: 'none',
        letterSpacing: '0.3px', whiteSpace: 'nowrap',
      }}>
        🏠 Departamento 3D — Arrastrar: rotar &nbsp;|&nbsp; Scroll: zoom &nbsp;|&nbsp; Clic derecho: desplazar
      </div>

      {/* Legend */}
      <div style={{
        position: 'absolute', bottom: 20, left: 20,
        background: 'rgba(0,0,0,0.65)', color: '#fff',
        fontFamily: 'system-ui, sans-serif', fontSize: 12,
        padding: '12px 16px', borderRadius: 12, lineHeight: 1.9,
      }}>
        {[
          { color: '#5C400E', label: 'RACK — 2,00 × 0,40 m' },
          { color: '#2E6DB4', label: 'SILLÓN — 1,30 × 0,80 m' },
          { color: '#A0622A', label: 'MESA — 1,80 × 0,80 m' },
          { color: '#4A2512', label: 'BARRA BAR — 0,80 × 1,50 m' },
          { color: '#9DD5F5', label: 'VENTANAL — 3,00 m' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: color, flexShrink: 0, display: 'inline-block' }} />
            {label}
          </div>
        ))}
        <div style={{ marginTop: 8, opacity: 0.6, fontSize: 11 }}>
          Altura de techo: 2,40 m &nbsp;|&nbsp; Planta: ~7,5 × 6,5 m
        </div>
      </div>
    </div>
  )
}
