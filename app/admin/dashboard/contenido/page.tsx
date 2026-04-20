'use client'
import { useState, useEffect } from 'react'
import { Cliente } from '@/config/cliente'

const STORAGE_KEY = 'admin_contenido_draft'

const FONT_OPTIONS = [
  { id: 'moderna',    label: 'Moderna',     heading: 'Fredoka One',        body: 'Plus Jakarta Sans', preview: 'Ff' },
  { id: 'elegante',   label: 'Elegante',    heading: 'Playfair Display',   body: 'Lato',              preview: 'Ff' },
  { id: 'clasica',    label: 'Clásica',     heading: 'Cormorant Garamond', body: 'Lato',              preview: 'Ff' },
  { id: 'bold',       label: 'Impactante',  heading: 'Bebas Neue',         body: 'Inter',             preview: 'FF' },
  { id: 'amigable',   label: 'Amigable',    heading: 'Nunito',             body: 'Nunito',            preview: 'Ff' },
  { id: 'manuscrita', label: 'Manuscrita',  heading: 'Dancing Script',     body: 'Plus Jakarta Sans', preview: 'Ff' },
]

type HeroData = {
  badge: string; titulo1: string; titulo2: string; subtitulo: string
  descripcion: string; cta1Texto: string; cta2Texto: string; stats: string[]
}

function ChevronDown() {
  return <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-texto-light"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
}
function ChevronUp() {
  return <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-texto-light"><path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd"/></svg>
}

function Seccion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="bg-white rounded-2xl border border-teal/10 overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-5 hover:bg-fondo transition-colors text-left">
        <span className="font-semibold text-texto text-sm flex-1">{title}</span>
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

export default function ContenidoPage() {
  const currentFuente = (Cliente as Record<string, unknown>).fuente as string || 'moderna'
  const [hero, setHero] = useState<HeroData>({ ...Cliente.hero, stats: [...Cliente.hero.stats] })
  const [fuente, setFuente] = useState(currentFuente)
  const [hasChanges, setHasChanges] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try { const d = JSON.parse(saved); setHero(d.hero); setFuente(d.fuente ?? currentFuente); setHasChanges(true) } catch {}
    }
  }, [currentFuente])

  useEffect(() => {
    if (hasChanges) localStorage.setItem(STORAGE_KEY, JSON.stringify({ hero, fuente }))
  }, [hero, fuente, hasChanges])

  function setHeroField(key: keyof HeroData, value: string) {
    setHero(prev => ({ ...prev, [key]: value })); setHasChanges(true)
  }
  function setStat(idx: number, value: string) {
    setHero(prev => { const stats = [...prev.stats]; stats[idx] = value; return { ...prev, stats } }); setHasChanges(true)
  }
  function addStat() { setHero(prev => ({ ...prev, stats: [...prev.stats, 'Nueva estadística'] })); setHasChanges(true) }
  function removeStat(idx: number) { setHero(prev => ({ ...prev, stats: prev.stats.filter((_, i) => i !== idx) })); setHasChanges(true) }

  async function handlePublish() {
    setPublishing(true); setStatus('idle')
    try {
      const clienteData = {
        ...Cliente,
        hero,
        fuente,
        // Quitar "as const" readonly para poder serializar
        whatsapp: { ...Cliente.whatsapp },
        instagram: { ...Cliente.instagram },
        seo: { ...Cliente.seo, keywords: [...Cliente.seo.keywords] },
        colores: { ...Cliente.colores },
        coordenadas: { ...Cliente.coordenadas },
        imagenes: { ...Cliente.imagenes },
        stats: [...hero.stats],
      }
      const res = await fetch('/api/admin/submit-pr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cliente: clienteData }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus('ok'); setHasChanges(false); localStorage.removeItem(STORAGE_KEY)
      } else {
        setStatus('error'); setErrorMsg(data.error || 'Error desconocido')
      }
    } catch {
      setStatus('error'); setErrorMsg('Error de conexión')
    } finally {
      setPublishing(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-texto">Contenido de la web</h1>
          <p className="text-texto-muted text-sm mt-1">Editá los textos y el estilo. Los cambios se publican al instante.</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {hasChanges && (
            <span className="text-xs bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full font-medium">
              Sin publicar
            </span>
          )}
          <button
            onClick={handlePublish}
            disabled={publishing || !hasChanges}
            className="flex items-center gap-2 bg-teal text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-teal-dark transition-colors disabled:opacity-40"
          >
            {publishing ? (
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83"/></svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M5 12l5 5L20 7"/></svg>
            )}
            {publishing ? 'Publicando…' : 'Publicar cambios'}
          </button>
        </div>
      </div>

      {status === 'ok' && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 flex-shrink-0"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
          ¡Publicado! Vercel desplegará los cambios en aproximadamente 30 segundos.
        </div>
      )}
      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{errorMsg}</div>
      )}

      {/* ── Fuente ── */}
      <Seccion title="Estilo de letra" defaultOpen>
        <p className="text-xs text-texto-muted">Elegí la familia tipográfica de la web. El cambio afecta títulos y textos en todo el sitio.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {FONT_OPTIONS.map(opt => (
            <button
              key={opt.id}
              onClick={() => { setFuente(opt.id); setHasChanges(true) }}
              className={`relative rounded-2xl border-2 p-4 text-left transition-all hover:border-teal/50 ${fuente === opt.id ? 'border-teal bg-teal/5' : 'border-gray-100 bg-white'}`}
            >
              {fuente === opt.id && (
                <span className="absolute top-2 right-2 w-4 h-4 bg-teal rounded-full flex items-center justify-center">
                  <svg viewBox="0 0 12 12" fill="white" className="w-2.5 h-2.5"><path d="M2 6l3 3 5-5"/></svg>
                </span>
              )}
              {/* Preview */}
              <div className="text-2xl font-bold text-texto mb-1 leading-none"
                style={{ fontFamily: opt.heading }}>
                Aa
              </div>
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
          <Field label="Subtítulo" value={hero.subtitulo} onChange={v => setHeroField('subtitulo', v)} placeholder="Vivís mejor." />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Título línea 1 (blanco)" value={hero.titulo1} onChange={v => setHeroField('titulo1', v)} placeholder="COCINÁS" />
          <Field label="Título línea 2 (teal)" value={hero.titulo2} onChange={v => setHeroField('titulo2', v)} placeholder="MEJOR." />
        </div>
        <Field label="Descripción" value={hero.descripcion} onChange={v => setHeroField('descripcion', v)} textarea placeholder="Texto debajo del título..." />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label='Botón principal (va a productos)' value={hero.cta1Texto} onChange={v => setHeroField('cta1Texto', v)} placeholder="Ver productos" />
          <Field label="Botón secundario (WhatsApp)" value={hero.cta2Texto} onChange={v => setHeroField('cta2Texto', v)} placeholder="Hablar con Daisy" />
        </div>
      </Seccion>

      {/* ── Stats ── */}
      <Seccion title="Estadísticas — Debajo de los botones">
        <p className="text-xs text-texto-muted">Aparecen en la fila de estadísticas del hero.</p>
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
        <button onClick={addStat} className="text-xs text-teal hover:text-teal-dark font-medium transition-colors">+ Agregar estadística</button>
      </Seccion>
    </div>
  )
}
