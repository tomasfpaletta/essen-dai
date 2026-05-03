'use client'
import { useState, useEffect, useRef } from 'react'
import { Cliente } from '@/config/cliente'
import { videos as initialVideos, type Video } from '@/config/videos'
import { testimonios as initialTestimonios, type Testimonio } from '@/config/testimonios'
import { faqItems as initialFaq, type FaqItem } from '@/config/faq'
import { writePendingSection, clearPendingSection, DRAFT_KEYS, PUBLISHED_EVENT } from '@/lib/admin-pending'

const STORAGE_KEY = DRAFT_KEYS.contenido

const initialHeroRaw = Cliente.hero as Record<string, unknown>

const FONT_OPTIONS = [
  { id: 'moderna',    label: 'Moderna',     heading: 'Fredoka One',        body: 'Plus Jakarta Sans' },
  { id: 'elegante',   label: 'Elegante',    heading: 'Playfair Display',   body: 'Lato' },
  { id: 'clasica',    label: 'Clásica',     heading: 'Cormorant Garamond', body: 'Lato' },
  { id: 'bold',       label: 'Impactante',  heading: 'Bebas Neue',         body: 'Inter' },
  { id: 'amigable',   label: 'Amigable',    heading: 'Nunito',             body: 'Nunito' },
  { id: 'manuscrita', label: 'Manuscrita',  heading: 'Dancing Script',     body: 'Plus Jakarta Sans' },
]

type HeroBadge = { linea1: string; linea2: string; icono: string }

type HeroData = {
  badge: string; titulo1: string; titulo2: string; subtitulo: string
  descripcion: string; cta1Texto: string; cta2Texto: string; stats: string[]
  imagen: string; imagenIzquierda: string; imagenesHero: string[]
  heroBadges: HeroBadge[]
}

type SumateData = {
  visible: boolean
  badge: string
  titulo: string
  descripcion: string
  beneficios: string[]
  ctaTexto: string
  imagenEquipo: string
  badgeNumero: string
  badgeTexto: string
}

// ── Helpers de UI ─────────────────────────────────────────────────────────────
function ChevronDown() {
  return <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-texto-light"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
}
function ChevronUp() {
  return <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-texto-light"><path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd"/></svg>
}

function Seccion({ title, badge, children, defaultOpen = false }: { title: string; badge?: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="bg-white rounded-2xl border border-teal/10 overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-5 hover:bg-fondo transition-colors text-left">
        <span className="font-semibold text-texto text-sm flex-1">{title}</span>
        {badge && <span className="text-xs bg-teal/10 text-teal px-2.5 py-0.5 rounded-full font-medium">{badge}</span>}
        {open ? <ChevronUp /> : <ChevronDown />}
      </button>
      {open && <div className="border-t border-teal/10 p-5 space-y-4 bg-fondo/30">{children}</div>}
    </div>
  )
}

function Field({ label, value, onChange, textarea, placeholder, hint }: {
  label: string; value: string; onChange: (v: string) => void
  textarea?: boolean; placeholder?: string; hint?: string
}) {
  const cls = 'w-full px-3 py-2 rounded-xl border border-teal/20 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/10 text-texto text-sm bg-white'
  return (
    <div>
      <label className="block text-xs font-medium text-texto mb-1.5">{label}</label>
      {textarea
        ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={`${cls} resize-y min-h-[72px]`} rows={3} />
        : <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={cls} />
      }
      {hint && <p className="text-xs text-texto-light mt-1">{hint}</p>}
    </div>
  )
}

// ── Extrae thumbnail de YouTube ───────────────────────────────────────────────
function toThumb(url: string): string | null {
  const short = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/)
  if (short) return `https://img.youtube.com/vi/${short[1]}/mqdefault.jpg`
  const long = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/)
  if (long) return `https://img.youtube.com/vi/${long[1]}/mqdefault.jpg`
  return null
}

function uid() {
  return `vid-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
}

function uidItem() {
  return `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
}

// ── Página principal ──────────────────────────────────────────────────────────
export default function ContenidoPage() {
  const currentFuente = (Cliente as Record<string, unknown>).fuente as string || 'moderna'
  const currentSumate = (Cliente as Record<string, unknown>).sumateEquipo as SumateData | undefined

  const [hero, setHero] = useState<HeroData>({
    ...Cliente.hero,
    stats: [...Cliente.hero.stats],
    imagen: (initialHeroRaw.imagen as string) ?? '',
    imagenIzquierda: (initialHeroRaw.imagenIzquierda as string) ?? '',
    imagenesHero: (initialHeroRaw.imagenesHero as string[]) ?? [],
    heroBadges: (initialHeroRaw.heroBadges as HeroBadge[]) ?? [
      { linea1: 'Certificada', linea2: 'Demostradora oficial', icono: 'shield' },
      { linea1: '200+',        linea2: 'Clientes felices',     icono: 'users'  },
      { linea1: 'Siempre',     linea2: 'Envío gratis',         icono: 'truck'  },
    ],
  })
  const [fuente, setFuente] = useState(currentFuente)
  const [sumate, setSumate] = useState<SumateData>(currentSumate ?? {
    visible: true,
    badge: 'Oportunidad Essen',
    titulo: 'Transformá tu pasión en un negocio próspero',
    descripcion: 'Unite a nuestra comunidad de emprendedoras.',
    beneficios: ['Sin inversión inicial obligatoria'],
    ctaTexto: 'Quiero ser emprendedora',
    imagenEquipo: '',
    badgeNumero: '30+',
    badgeTexto: 'años de marca',
  })
  const [testimoniosList, setTestimoniosList] = useState<Testimonio[]>(
    initialTestimonios.map(t => ({ ...t }))
  )
  const [faqList, setFaqList] = useState<FaqItem[]>(
    initialFaq.map(f => ({ ...f }))
  )
  const [videosList, setVideosList] = useState<Video[]>(initialVideos.map(v => ({ ...v })))
  const [newVideoUrl, setNewVideoUrl] = useState('')
  const [newVideoTitulo, setNewVideoTitulo] = useState('')
  const [newVideoDesc, setNewVideoDesc] = useState('')
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null)

  // Tracking por sección — solo se publica lo que realmente cambió
  const [dirtyCliente, setDirtyCliente] = useState(false)
  const [dirtyVideos,  setDirtyVideos]  = useState(false)
  const [dirtyTestimonios, setDirtyTestimonios] = useState(false)
  const [dirtyFaq, setDirtyFaq] = useState(false)
  const hasChanges = dirtyCliente || dirtyVideos || dirtyTestimonios || dirtyFaq


  // Imágenes del Hero
  const heroIzqRef      = useRef<HTMLInputElement>(null)
  const heroRotanteRef  = useRef<HTMLInputElement>(null)
  const [heroIzqUploading, setHeroIzqUploading]         = useState(false)
  const [heroRotanteUploading, setHeroRotanteUploading] = useState(false)

  // Imagen Sumate al Equipo
  const sumateImgRef = useRef<HTMLInputElement>(null)
  const [sumateImgUploading, setSumateImgUploading] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const d = JSON.parse(saved)
        if (d.hero)        { setHero(prev => ({ ...prev, ...d.hero, stats: Array.isArray(d.hero.stats) ? d.hero.stats : prev.stats })); setDirtyCliente(true) }
        if (d.fuente)      { setFuente(d.fuente); setDirtyCliente(true) }
        if (d.sumate)      { setSumate(prev => ({ ...prev, ...d.sumate })); setDirtyCliente(true) }
        if (d.videos)      { setVideosList(d.videos); setDirtyVideos(true) }
        if (d.testimonios) { setTestimoniosList(d.testimonios); setDirtyTestimonios(true) }
        if (d.faq)         { setFaqList(d.faq); setDirtyFaq(true) }
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [])

  // Guarda borrador local (restauración al recargar) y payload global pendiente
  useEffect(() => {
    if (!hasChanges) return
    const draft: Record<string, unknown> = {}
    const pending: Record<string, unknown> = {}
    if (dirtyCliente) {
      draft.hero = hero; draft.fuente = fuente; draft.sumate = sumate
      pending.cliente = {
        ...Cliente, hero, fuente, sumateEquipo: sumate,
        editorial: (Cliente as Record<string, unknown>).editorial,
        whatsapp: { ...Cliente.whatsapp }, instagram: { ...Cliente.instagram },
        seo: { ...Cliente.seo, keywords: [...Cliente.seo.keywords] },
        colores: { ...Cliente.colores }, coordenadas: { ...Cliente.coordenadas },
        imagenes: { ...Cliente.imagenes }, stats: [...hero.stats],
      }
    }
    if (dirtyVideos)      { draft.videos = videosList;           pending.videos = videosList }
    if (dirtyTestimonios) { draft.testimonios = testimoniosList; pending.testimonios = testimoniosList }
    if (dirtyFaq)         { draft.faq = faqList;                 pending.faq = faqList }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
    writePendingSection('contenido', pending)
  }, [hero, fuente, sumate, videosList, testimoniosList, faqList,
      dirtyCliente, dirtyVideos, dirtyTestimonios, dirtyFaq, hasChanges])

  // Limpia estado al publicar desde el PublishBar global
  useEffect(() => {
    function onPublished() {
      setDirtyCliente(false); setDirtyVideos(false)
      setDirtyTestimonios(false); setDirtyFaq(false)
    }
    window.addEventListener(PUBLISHED_EVENT, onPublished)
    return () => window.removeEventListener(PUBLISHED_EVENT, onPublished)
  }, [])

  function markCliente() { setDirtyCliente(true) }
  function markVideos()  { setDirtyVideos(true) }
  function markTestimonios() { setDirtyTestimonios(true) }
  function markFaq()     { setDirtyFaq(true) }

  function setHeroField(key: keyof HeroData, value: string) {
    setHero(prev => ({ ...prev, [key]: value })); markCliente()
  }
  function setStat(idx: number, v: string) {
    setHero(prev => { const s = [...prev.stats]; s[idx] = v; return { ...prev, stats: s } }); markCliente()
  }
  function addStat() { setHero(prev => ({ ...prev, stats: [...prev.stats, 'Nueva estadística'] })); markCliente() }
  function removeStat(idx: number) { setHero(prev => ({ ...prev, stats: prev.stats.filter((_, i) => i !== idx) })); markCliente() }

  function patchSumate(key: keyof SumateData, val: unknown) {
    setSumate(prev => ({ ...prev, [key]: val })); markCliente()
  }
  function patchBeneficio(idx: number, val: string) {
    setSumate(prev => { const b = [...prev.beneficios]; b[idx] = val; return { ...prev, beneficios: b } }); markCliente()
  }
  function addBeneficio() {
    setSumate(prev => ({ ...prev, beneficios: [...prev.beneficios, 'Nuevo beneficio'] })); markCliente()
  }
  function removeBeneficio(idx: number) {
    setSumate(prev => ({ ...prev, beneficios: prev.beneficios.filter((_, i) => i !== idx) })); markCliente()
  }

  // Testimonios helpers
  function patchTestimonio(id: string, key: keyof Testimonio, val: string | number) {
    setTestimoniosList(prev => prev.map(t => t.id === id ? { ...t, [key]: val } : t)); markTestimonios()
  }
  function addTestimonio() {
    setTestimoniosList(prev => [...prev, { id: uidItem(), nombre: '', lugar: '', texto: '', estrellas: 5 }]); markTestimonios()
  }
  function removeTestimonio(id: string) {
    const t = testimoniosList.find(x => x.id === id)
    const label = t?.nombre ? `el testimonio de "${t.nombre}"` : 'este testimonio'
    if (!confirm(`¿Eliminar ${label}? Esta acción no se puede deshacer.`)) return
    setTestimoniosList(prev => prev.filter(t => t.id !== id)); markTestimonios()
  }

  // FAQ helpers
  function patchFaq(id: string, key: 'q' | 'a', val: string) {
    setFaqList(prev => prev.map(f => f.id === id ? { ...f, [key]: val } : f)); markFaq()
  }
  function addFaq() {
    setFaqList(prev => [...prev, { id: uidItem(), q: '', a: '' }]); markFaq()
  }
  function removeFaq(id: string) {
    const f = faqList.find(x => x.id === id)
    const label = f?.q ? `"${f.q.slice(0, 50)}${f.q.length > 50 ? '…' : ''}"` : 'esta pregunta'
    if (!confirm(`¿Eliminar ${label}? Esta acción no se puede deshacer.`)) return
    setFaqList(prev => prev.filter(f => f.id !== id)); markFaq()
  }
  function moveFaq(id: string, dir: -1 | 1) {
    setFaqList(prev => {
      const idx = prev.findIndex(f => f.id === id)
      if (idx < 0) return prev
      const next = idx + dir
      if (next < 0 || next >= prev.length) return prev
      const arr = [...prev];
      [arr[idx], arr[next]] = [arr[next], arr[idx]]
      return arr
    }); markFaq()
  }

  // Badges del hero
  function patchBadge(idx: number, k: keyof HeroBadge, v: string) {
    setHero(prev => {
      const badges = [...prev.heroBadges]
      badges[idx] = { ...badges[idx], [k]: v }
      return { ...prev, heroBadges: badges }
    }); markCliente()
  }

  async function uploadHeroIzq(file: File) {
    setHeroIzqUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('filename', 'hero-izquierda')
      fd.append('folder', 'hero')
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setHero(prev => ({ ...prev, imagenIzquierda: data.path })); markCliente()
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Error al subir imagen')
    } finally { setHeroIzqUploading(false) }
  }

  async function uploadHeroRotante(file: File) {
    setHeroRotanteUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('filename', `hero-rotante-${Date.now()}`)
      fd.append('folder', 'hero')
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setHero(prev => ({ ...prev, imagenesHero: [...prev.imagenesHero, data.path] })); markCliente()
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Error al subir imagen')
    } finally { setHeroRotanteUploading(false) }
  }

  function removeHeroRotante(idx: number) {
    setHero(prev => ({ ...prev, imagenesHero: prev.imagenesHero.filter((_, i) => i !== idx) })); markCliente()
  }

  async function uploadSumateImg(file: File) {
    setSumateImgUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('filename', 'equipo')
      fd.append('folder', 'equipo')
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      patchSumate('imagenEquipo', data.path)
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Error al subir imagen')
    } finally {
      setSumateImgUploading(false)
    }
  }

  // Videos
  function addVideo() {
    const url = newVideoUrl.trim()
    if (!url) return
    const newV: Video = {
      id: uid(),
      titulo: newVideoTitulo.trim(),
      descripcion: newVideoDesc.trim(),
      url,
      activo: true,
    }
    setVideosList(prev => [...prev, newV])
    setNewVideoUrl(''); setNewVideoTitulo(''); setNewVideoDesc('')
    markVideos()
  }
  function removeVideo(id: string) {
    const v = videosList.find(x => x.id === id)
    const label = v?.titulo ? `"${v.titulo}"` : 'este video'
    if (!confirm(`¿Eliminar ${label}? Esta acción no se puede deshacer.`)) return
    setVideosList(prev => prev.filter(v => v.id !== id)); markVideos()
  }
  function toggleVideo(id: string) {
    setVideosList(prev => prev.map(v => v.id === id ? { ...v, activo: !v.activo } : v)); markVideos()
  }
  function patchVideo(id: string, key: keyof Video, val: string | boolean) {
    setVideosList(prev => prev.map(v => v.id === id ? { ...v, [key]: val } : v)); markVideos()
  }
  function moveVideo(id: string, dir: -1 | 1) {
    setVideosList(prev => {
      const idx = prev.findIndex(v => v.id === id)
      if (idx < 0) return prev
      const next = idx + dir
      if (next < 0 || next >= prev.length) return prev
      const arr = [...prev];
      [arr[idx], arr[next]] = [arr[next], arr[idx]]
      return arr
    }); markVideos()
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-texto">Contenido de la web</h1>
          <p className="text-texto-muted text-sm mt-1">Textos, estilo, videos y sección de equipo.</p>
        </div>
        {hasChanges && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => {
                if (!confirm('¿Revertir todos los cambios? Perderás las modificaciones sin publicar.')) return
                clearPendingSection('contenido')
                setHero({
                  ...Cliente.hero,
                  stats: [...Cliente.hero.stats],
                  imagen: (initialHeroRaw.imagen as string) ?? '',
                  imagenIzquierda: (initialHeroRaw.imagenIzquierda as string) ?? '',
                  imagenesHero: (initialHeroRaw.imagenesHero as string[]) ?? [],
                  heroBadges: (initialHeroRaw.heroBadges as HeroBadge[]) ?? [],
                })
                setFuente(currentFuente)
                setSumate(currentSumate ?? {
                  visible: true, badge: '', titulo: '', descripcion: '',
                  beneficios: [], ctaTexto: '', imagenEquipo: '', badgeNumero: '', badgeTexto: '',
                })
                setVideosList(initialVideos.map(v => ({ ...v })))
                setTestimoniosList(initialTestimonios.map(t => ({ ...t })))
                setFaqList(initialFaq.map(f => ({ ...f })))
                setDirtyCliente(false); setDirtyVideos(false)
                setDirtyTestimonios(false); setDirtyFaq(false)
              }}
              className="text-xs text-red-400 hover:text-red-600 hover:bg-red-50 border border-red-200 px-3 py-1.5 rounded-full font-medium transition-colors"
            >
              Revertir cambios
            </button>
            <span className="text-xs bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full font-medium">Sin publicar</span>
          </div>
        )}
      </div>

      {/* ── Fuente ── */}
      <Seccion title="Estilo de letra" defaultOpen>
        <p className="text-xs text-texto-muted">El cambio afecta títulos y textos en todo el sitio.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {FONT_OPTIONS.map(opt => (
            <button
              key={opt.id}
              onClick={() => { setFuente(opt.id); markCliente() }}
              className={`relative rounded-2xl border-2 p-4 text-left transition-all hover:border-teal/50 ${fuente === opt.id ? 'border-teal bg-teal/5' : 'border-gray-100 bg-white'}`}
            >
              {fuente === opt.id && (
                <span className="absolute top-2 right-2 w-4 h-4 bg-teal rounded-full flex items-center justify-center">
                  <svg viewBox="0 0 12 12" fill="white" className="w-2.5 h-2.5"><path d="M2 6l3 3 5-5"/></svg>
                </span>
              )}
              <div className="text-2xl font-bold text-texto mb-1 leading-none" style={{ fontFamily: opt.heading }}>Aa</div>
              <p className="text-xs font-semibold text-texto">{opt.label}</p>
              <p className="text-[10px] text-texto-light mt-0.5">{opt.heading}</p>
            </button>
          ))}
        </div>
      </Seccion>

      {/* ── Hero ── */}
      <Seccion title="Hero — Portada principal">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Texto del badge" value={hero.badge} onChange={v => setHeroField('badge', v)} placeholder="Distribuidora Oficial · CABA" />
          <Field label="Subtítulo" value={hero.subtitulo} onChange={v => setHeroField('subtitulo', v)} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Título línea 1 (blanco)" value={hero.titulo1} onChange={v => setHeroField('titulo1', v)} placeholder="COCINÁS" />
          <Field label="Título línea 2 (teal)" value={hero.titulo2} onChange={v => setHeroField('titulo2', v)} placeholder="MEJOR." />
        </div>
        <Field label="Descripción" value={hero.descripcion} onChange={v => setHeroField('descripcion', v)} textarea />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Botón principal" value={hero.cta1Texto} onChange={v => setHeroField('cta1Texto', v)} />
          <Field label="Botón secundario (WhatsApp)" value={hero.cta2Texto} onChange={v => setHeroField('cta2Texto', v)} />
        </div>
      </Seccion>

      {/* ── Stats ── */}
      <Seccion title="Estadísticas del hero">
        <div className="space-y-2">
          {hero.stats.map((stat, i) => (
            <div key={i} className="flex gap-2">
              <input value={stat} onChange={e => setStat(i, e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border border-teal/20 focus:outline-none focus:border-teal text-texto text-sm bg-white" />
              <button onClick={() => removeStat(i)}
                className="px-3 py-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors text-sm">✕</button>
            </div>
          ))}
        </div>
        <button onClick={addStat} className="text-xs text-teal hover:text-teal-dark font-medium">+ Agregar estadística</button>
      </Seccion>

      {/* ── Imágenes del Hero ── */}
      <Seccion title="Fotos del Hero — Imágenes de Daisy">
        <p className="text-xs text-texto-muted -mt-1">Foto fija (izquierda) y galería rotante (derecha) que se muestran a los costados del texto principal en desktop.</p>

        {/* Foto izquierda — fija */}
        <div>
          <label className="block text-xs font-semibold text-texto mb-2">📸 Foto izquierda (fija)</label>
          <div className="flex items-start gap-4">
            <div
              className="w-24 h-32 rounded-xl border-2 border-dashed border-teal/20 overflow-hidden flex-shrink-0 cursor-pointer hover:border-teal/40 transition-colors bg-fondo flex items-center justify-center relative"
              onClick={() => heroIzqRef.current?.click()}
            >
              {hero.imagenIzquierda
                ? <img src={hero.imagenIzquierda} alt="hero izq" className="w-full h-full object-cover" /> // eslint-disable-line @next/next/no-img-element
                : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-gray-300"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8"/></svg>
              }
              {heroIzqUploading && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                  <svg className="animate-spin w-5 h-5 text-teal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4m0 12v4"/></svg>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2 pt-1">
              <button onClick={() => heroIzqRef.current?.click()} disabled={heroIzqUploading}
                className="text-xs text-teal border border-teal/30 font-semibold px-4 py-2 rounded-xl hover:bg-teal/5 transition-colors disabled:opacity-50">
                {hero.imagenIzquierda ? 'Cambiar foto' : 'Subir foto'}
              </button>
              {hero.imagenIzquierda && (
                <button onClick={() => { setHero(prev => ({ ...prev, imagenIzquierda: '' })); markCliente() }}
                  className="text-xs text-red-400 hover:text-red-600 transition-colors">Quitar foto</button>
              )}
              <p className="text-xs text-texto-muted">Recomendado: formato 3:4 o similar</p>
            </div>
          </div>
          <input ref={heroIzqRef} type="file" accept="image/*" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) uploadHeroIzq(f); e.target.value = '' }} />
        </div>

        {/* Fotos rotantes — derecha */}
        <div>
          <label className="block text-xs font-semibold text-texto mb-2">🔄 Fotos rotantes (derecha)</label>
          <div className="flex flex-wrap gap-3 mb-3">
            {hero.imagenesHero.map((src, i) => (
              <div key={src} className="relative w-20 h-28 rounded-xl overflow-hidden border border-teal/15 flex-shrink-0 group">
                <img src={src} alt={`hero ${i+1}`} className="w-full h-full object-cover" /> {/* eslint-disable-line @next/next/no-img-element */}
                <button
                  onClick={() => removeHeroRotante(i)}
                  className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >✕</button>
                <span className="absolute bottom-1 left-1 text-[10px] text-white bg-black/50 rounded px-1">{i+1}</span>
              </div>
            ))}
            <button
              onClick={() => heroRotanteRef.current?.click()}
              disabled={heroRotanteUploading}
              className="w-20 h-28 rounded-xl border-2 border-dashed border-teal/20 hover:border-teal/40 flex flex-col items-center justify-center gap-1 text-texto-muted hover:text-teal transition-colors flex-shrink-0 text-xs font-medium"
            >
              {heroRotanteUploading
                ? <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4m0 12v4"/></svg>
                : <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg><span>Agregar</span></>
              }
            </button>
          </div>
          <input ref={heroRotanteRef} type="file" accept="image/*" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) uploadHeroRotante(f); e.target.value = '' }} />
          <p className="text-xs text-texto-muted">Las fotos rotan automáticamente cada 5 segundos. Podés agregar varias.</p>
        </div>

        {/* Badges del hero */}
        <div>
          <label className="block text-xs font-semibold text-texto mb-2">🏷️ Badges flotantes (3 tarjetitas)</label>
          <div className="space-y-3">
            {(['shield','users','truck'] as const).map((icono, i) => {
              const labels = ['Badge izquierdo (Certificada)', 'Badge derecho superior (clientes)', 'Badge derecho inferior (envío)']
              const badge = hero.heroBadges[i] ?? { linea1: '', linea2: '', icono }
              return (
                <div key={icono} className="flex gap-3 items-center">
                  <span className="text-xs text-texto-muted w-40 flex-shrink-0">{labels[i]}</span>
                  <input value={badge.linea1} onChange={e => patchBadge(i, 'linea1', e.target.value)}
                    placeholder="Línea 1"
                    className="flex-1 px-3 py-1.5 rounded-xl border border-teal/20 focus:outline-none focus:border-teal text-sm bg-white text-texto" />
                  <input value={badge.linea2} onChange={e => patchBadge(i, 'linea2', e.target.value)}
                    placeholder="Línea 2"
                    className="flex-1 px-3 py-1.5 rounded-xl border border-teal/20 focus:outline-none focus:border-teal text-sm bg-white text-texto" />
                </div>
              )
            })}
          </div>
        </div>
      </Seccion>

      {/* ── Videos ── */}
      <Seccion title="Videos" badge={`${videosList.filter(v => v.activo).length} activos`}>
        <p className="text-xs text-texto-muted -mt-1">
          Pegá el link de YouTube de cada video. Se muestran en un carrusel en la landing.
        </p>

        {/* Lista existente */}
        {videosList.length > 0 && (
          <div className="space-y-2">
            {videosList.map((v, idx) => {
              const thumb = toThumb(v.url)
              const isEditing = editingVideoId === v.id
              return (
                <div key={v.id} className="border border-gray-100 rounded-xl overflow-hidden">
                  {/* Fila */}
                  <div className="flex items-center gap-3 px-4 py-3">
                    {/* Thumbnail */}
                    <div className="w-16 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-fondo border border-teal/10">
                      {thumb
                        ? <img src={thumb} alt={v.titulo} className="w-full h-full object-cover" /> // eslint-disable-line @next/next/no-img-element
                        : <div className="w-full h-full flex items-center justify-center"><svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-teal/30"><path d="M8 5v14l11-7z"/></svg></div>
                      }
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-texto truncate">{v.titulo || 'Sin título'}</p>
                      <p className="text-xs text-texto-muted truncate">{v.url}</p>
                    </div>

                    {/* Toggle activo */}
                    <button
                      onClick={() => toggleVideo(v.id)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0 ${v.activo ? 'bg-teal' : 'bg-gray-200'}`}
                    >
                      <span
                        className="inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform"
                        style={{ transform: `translateX(${v.activo ? '18px' : '2px'})` }}
                      />
                    </button>

                    {/* Mover */}
                    <div className="flex gap-0.5 flex-shrink-0">
                      <button onClick={() => moveVideo(v.id, -1)} disabled={idx === 0}
                        className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 text-texto-muted">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15"/></svg>
                      </button>
                      <button onClick={() => moveVideo(v.id, 1)} disabled={idx === videosList.length - 1}
                        className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 text-texto-muted">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                      </button>
                    </div>

                    {/* Editar */}
                    <button onClick={() => setEditingVideoId(isEditing ? null : v.id)}
                      className="p-1.5 rounded-lg hover:bg-teal/10 text-teal-dark/50 hover:text-teal transition-colors flex-shrink-0">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>

                    {/* Eliminar */}
                    <button onClick={() => removeVideo(v.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 text-texto-muted transition-colors flex-shrink-0">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6m4-6v6"/><path d="M9 6V4h6v2"/></svg>
                    </button>
                  </div>

                  {/* Panel de edición */}
                  {isEditing && (
                    <div className="border-t border-gray-100 bg-gray-50/50 p-4 space-y-3">
                      <div>
                        <label className="text-xs font-medium text-texto-muted mb-1 block">URL de YouTube</label>
                        <input value={v.url} onChange={e => patchVideo(v.id, 'url', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-teal/20 focus:outline-none focus:border-teal text-sm bg-white text-texto"
                          placeholder="https://youtube.com/watch?v=..." />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-texto-muted mb-1 block">Título</label>
                        <input value={v.titulo} onChange={e => patchVideo(v.id, 'titulo', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-teal/20 focus:outline-none focus:border-teal text-sm bg-white text-texto" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-texto-muted mb-1 block">Descripción</label>
                        <textarea value={v.descripcion} onChange={e => patchVideo(v.id, 'descripcion', e.target.value)} rows={2}
                          className="w-full px-3 py-2 rounded-xl border border-teal/20 focus:outline-none focus:border-teal text-sm bg-white text-texto resize-none" />
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Agregar nuevo video */}
        <div className="bg-white rounded-xl border border-teal/15 p-4 space-y-3">
          <p className="text-xs font-semibold text-texto-muted uppercase tracking-widest">Agregar video</p>
          <div>
            <label className="text-xs font-medium text-texto-muted mb-1 block">Link de YouTube *</label>
            <input
              value={newVideoUrl}
              onChange={e => setNewVideoUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=... o https://youtu.be/..."
              className="w-full px-3 py-2 rounded-xl border border-teal/20 focus:outline-none focus:border-teal text-sm bg-fondo text-texto"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-texto-muted mb-1 block">Título (opcional)</label>
              <input value={newVideoTitulo} onChange={e => setNewVideoTitulo(e.target.value)}
                placeholder="Ej: Cómo usar tu cacerola Essen"
                className="w-full px-3 py-2 rounded-xl border border-teal/20 focus:outline-none focus:border-teal text-sm bg-fondo text-texto" />
            </div>
            <div>
              <label className="text-xs font-medium text-texto-muted mb-1 block">Descripción (opcional)</label>
              <input value={newVideoDesc} onChange={e => setNewVideoDesc(e.target.value)}
                placeholder="Breve descripción..."
                className="w-full px-3 py-2 rounded-xl border border-teal/20 focus:outline-none focus:border-teal text-sm bg-fondo text-texto" />
            </div>
          </div>
          <button
            onClick={addVideo}
            disabled={!newVideoUrl.trim()}
            className="flex items-center gap-2 bg-teal/10 text-teal font-semibold px-4 py-2 rounded-xl text-sm hover:bg-teal/20 transition-colors disabled:opacity-40"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Agregar video
          </button>
        </div>
      </Seccion>

      {/* ── Testimonios ── */}
      <Seccion title="Testimonios" badge={`${testimoniosList.length} opiniones`}>
        <p className="text-xs text-texto-muted -mt-1">Opiniones de clientas que se muestran en la landing.</p>
        <div className="space-y-4">
          {testimoniosList.map((t, idx) => (
            <div key={t.id} className="bg-white rounded-xl border border-teal/10 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-texto-muted uppercase tracking-widest">Testimonio {idx + 1}</p>
                <button onClick={() => removeTestimonio(t.id)}
                  className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 text-texto-muted transition-colors">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6m4-6v6"/><path d="M9 6V4h6v2"/></svg>
                </button>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-texto-muted mb-1 block">Nombre</label>
                  <input value={t.nombre} onChange={e => patchTestimonio(t.id, 'nombre', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-teal/20 focus:outline-none focus:border-teal text-sm bg-fondo text-texto" placeholder="María L." />
                </div>
                <div>
                  <label className="text-xs font-medium text-texto-muted mb-1 block">Lugar</label>
                  <input value={t.lugar} onChange={e => patchTestimonio(t.id, 'lugar', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-teal/20 focus:outline-none focus:border-teal text-sm bg-fondo text-texto" placeholder="Palermo, CABA" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-texto-muted mb-1 block">Opinión</label>
                <textarea value={t.texto} onChange={e => patchTestimonio(t.id, 'texto', e.target.value)} rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-teal/20 focus:outline-none focus:border-teal text-sm bg-fondo text-texto resize-none" />
              </div>
              <div>
                <label className="text-xs font-medium text-texto-muted mb-1 block">Estrellas</label>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(n => (
                    <button key={n} onClick={() => patchTestimonio(t.id, 'estrellas', n)}
                      className={`w-7 h-7 rounded-lg text-sm transition-colors ${n <= t.estrellas ? 'text-amber-400 bg-amber-50' : 'text-gray-300 bg-gray-50'}`}>
                      ★
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <button onClick={addTestimonio}
          className="flex items-center gap-2 bg-teal/10 text-teal font-semibold px-4 py-2 rounded-xl text-sm hover:bg-teal/20 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Agregar testimonio
        </button>
      </Seccion>

      {/* ── FAQ ── */}
      <Seccion title="Preguntas frecuentes" badge={`${faqList.length} preguntas`}>
        <div className="space-y-3">
          {faqList.map((f, idx) => (
            <div key={f.id} className="bg-white rounded-xl border border-teal/10 p-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold text-texto-muted uppercase tracking-widest">Pregunta {idx + 1}</p>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => moveFaq(f.id, -1)} disabled={idx === 0}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 text-texto-muted">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15"/></svg>
                  </button>
                  <button onClick={() => moveFaq(f.id, 1)} disabled={idx === faqList.length - 1}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 text-texto-muted">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                  </button>
                  <button onClick={() => removeFaq(f.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 text-texto-muted transition-colors ml-1">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6m4-6v6"/><path d="M9 6V4h6v2"/></svg>
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-texto-muted mb-1 block">Pregunta</label>
                <input value={f.q} onChange={e => patchFaq(f.id, 'q', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-teal/20 focus:outline-none focus:border-teal text-sm bg-fondo text-texto" />
              </div>
              <div>
                <label className="text-xs font-medium text-texto-muted mb-1 block">Respuesta</label>
                <textarea value={f.a} onChange={e => patchFaq(f.id, 'a', e.target.value)} rows={3}
                  className="w-full px-3 py-2 rounded-xl border border-teal/20 focus:outline-none focus:border-teal text-sm bg-fondo text-texto resize-y" />
              </div>
            </div>
          ))}
        </div>
        <button onClick={addFaq}
          className="flex items-center gap-2 bg-teal/10 text-teal font-semibold px-4 py-2 rounded-xl text-sm hover:bg-teal/20 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Agregar pregunta
        </button>
      </Seccion>

      {/* ── Sumate al equipo ── */}
      <Seccion title="Sumate al equipo">
        <div className="flex items-center justify-between">
          <p className="text-xs text-texto-muted">Sección visible en la landing</p>
          <button
            onClick={() => patchSumate('visible', !sumate.visible)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${sumate.visible ? 'bg-teal' : 'bg-gray-200'}`}
          >
            <span className="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform"
              style={{ transform: `translateX(${sumate.visible ? '24px' : '4px'})` }} />
          </button>
        </div>

        {!sumate.visible && (
          <p className="text-xs bg-amber-50 border border-amber-200 text-amber-700 rounded-xl px-3 py-2">
            La sección está <strong>oculta</strong> en el sitio.
          </p>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Badge" value={sumate.badge} onChange={v => patchSumate('badge', v)} placeholder="Oportunidad Essen" />
          <Field label="Número del badge flotante" value={sumate.badgeNumero} onChange={v => patchSumate('badgeNumero', v)} placeholder="30+" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Texto del badge flotante" value={sumate.badgeTexto} onChange={v => patchSumate('badgeTexto', v)} placeholder="años de marca" />
          <Field label="Texto del botón CTA" value={sumate.ctaTexto} onChange={v => patchSumate('ctaTexto', v)} />
        </div>
        <Field label="Título" value={sumate.titulo} onChange={v => patchSumate('titulo', v)} />
        <Field label="Descripción" value={sumate.descripcion} onChange={v => patchSumate('descripcion', v)} textarea />

        {/* Beneficios */}
        <div>
          <label className="block text-xs font-medium text-texto mb-2">Beneficios</label>
          <div className="space-y-2">
            {sumate.beneficios.map((b, i) => (
              <div key={i} className="flex gap-2">
                <input value={b} onChange={e => patchBeneficio(i, e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-teal/20 focus:outline-none focus:border-teal text-sm bg-white text-texto" />
                <button onClick={() => removeBeneficio(i)}
                  className="px-3 py-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors text-sm">✕</button>
              </div>
            ))}
          </div>
          <button onClick={addBeneficio} className="text-xs text-teal hover:text-teal-dark font-medium mt-2">+ Agregar beneficio</button>
        </div>

        {/* Imagen del equipo */}
        <div>
          <label className="block text-xs font-medium text-texto mb-2">Foto del equipo</label>
          <div className="flex items-start gap-4">
            <div
              className="w-24 h-32 rounded-xl border-2 border-dashed border-teal/20 overflow-hidden flex-shrink-0 cursor-pointer hover:border-teal/40 transition-colors bg-fondo flex items-center justify-center"
              onClick={() => sumateImgRef.current?.click()}
            >
              {sumate.imagenEquipo
                ? <img src={sumate.imagenEquipo} alt="equipo" className="w-full h-full object-cover" /> // eslint-disable-line @next/next/no-img-element
                : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-gray-300"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8"/></svg>
              }
              {sumateImgUploading && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                  <svg className="animate-spin w-5 h-5 text-teal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4m0 12v4"/></svg>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2 pt-1">
              <button onClick={() => sumateImgRef.current?.click()} disabled={sumateImgUploading}
                className="text-xs text-teal border border-teal/30 font-semibold px-4 py-2 rounded-xl hover:bg-teal/5 transition-colors disabled:opacity-50">
                {sumate.imagenEquipo ? 'Cambiar foto' : 'Subir foto'}
              </button>
              {sumate.imagenEquipo && (
                <button onClick={() => patchSumate('imagenEquipo', '')} className="text-xs text-red-400 hover:text-red-600 transition-colors">Quitar foto</button>
              )}
              <p className="text-xs text-texto-muted">Recomendado: formato 4:5 o vertical</p>
            </div>
          </div>
          <input ref={sumateImgRef} type="file" accept="image/*" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) uploadSumateImg(f); e.target.value = '' }} />
        </div>
      </Seccion>
    </div>
  )
}
