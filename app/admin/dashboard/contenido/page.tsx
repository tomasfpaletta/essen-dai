'use client'
import { useState, useEffect } from 'react'
import { Cliente } from '@/config/cliente'

const STORAGE_KEY = 'admin_contenido_draft'

type HeroData = {
  badge: string
  titulo1: string
  titulo2: string
  subtitulo: string
  descripcion: string
  cta1Texto: string
  cta2Texto: string
  stats: string[]
}

// ── Collapsible Section ───────────────────────────────────────────────────────
function ChevronDown() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-texto-light">
      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
    </svg>
  )
}
function ChevronUp() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-texto-light">
      <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd"/>
    </svg>
  )
}

function Seccion({
  title, children, defaultOpen = false,
}: {
  title: string; children: React.ReactNode; defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="bg-white rounded-2xl border border-teal/10 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-5 hover:bg-fondo transition-colors text-left"
      >
        <span className="font-semibold text-texto text-sm flex-1">{title}</span>
        {open ? <ChevronUp /> : <ChevronDown />}
      </button>
      {open && (
        <div className="border-t border-teal/10 p-5 space-y-4 bg-fondo/30">
          {children}
        </div>
      )}
    </div>
  )
}

function Field({
  label, value, onChange, textarea, placeholder, hint,
}: {
  label: string; value: string; onChange: (v: string) => void
  textarea?: boolean; placeholder?: string; hint?: string
}) {
  const cls = 'w-full px-3 py-2 rounded-xl border border-teal/20 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/10 text-texto text-sm bg-white'
  return (
    <div>
      <label className="block text-xs font-medium text-texto mb-1.5">{label}</label>
      {textarea
        ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
            className={`${cls} resize-y min-h-[72px]`} rows={3} />
        : <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
            className={cls} />
      }
      {hint && <p className="text-xs text-texto-light mt-1">{hint}</p>}
    </div>
  )
}

// ── Página principal ──────────────────────────────────────────────────────────
export default function ContenidoPage() {
  const [hero, setHero] = useState<HeroData>({ ...Cliente.hero, stats: [...Cliente.hero.stats] })
  const [hasChanges, setHasChanges] = useState(false)
  const [submitting, setSubmitting]   = useState(false)
  const [description, setDescription] = useState('')
  const [result, setResult]           = useState<{ ok: boolean; prUrl?: string; error?: string } | null>(null)

  // Cargar borrador
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try { setHero(JSON.parse(saved)); setHasChanges(true) } catch {}
    }
  }, [])

  // Auto-guardar
  useEffect(() => {
    if (hasChanges) localStorage.setItem(STORAGE_KEY, JSON.stringify(hero))
  }, [hero, hasChanges])

  function setHeroField(key: keyof HeroData, value: string) {
    setHero(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  function setStat(idx: number, value: string) {
    setHero(prev => {
      const stats = [...prev.stats]
      stats[idx] = value
      return { ...prev, stats }
    })
    setHasChanges(true)
  }

  function addStat() {
    setHero(prev => ({ ...prev, stats: [...prev.stats, 'Nueva estadística'] }))
    setHasChanges(true)
  }

  function removeStat(idx: number) {
    setHero(prev => ({ ...prev, stats: prev.stats.filter((_, i) => i !== idx) }))
    setHasChanges(true)
  }

  async function handleSubmit() {
    setSubmitting(true)
    setResult(null)
    try {
      // Armamos el cliente completo con el hero actualizado
      const clienteData = {
        nombre:           Cliente.nombre,
        marca:            Cliente.marca,
        slogan:           Cliente.slogan,
        descripcionCorta: Cliente.descripcionCorta,
        ciudad:           Cliente.ciudad,
        provincia:        Cliente.provincia,
        pais:             Cliente.pais,
        coordenadas:      { ...Cliente.coordenadas },
        whatsapp:         { ...Cliente.whatsapp },
        instagram:        { ...Cliente.instagram },
        seo:              { ...Cliente.seo },
        popupDelay:       Cliente.popupDelay,
        colores:          { ...Cliente.colores },
        hero,
      }

      const res = await fetch('/api/admin/submit-pr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cliente: clienteData, descripcion: description }),
      })
      const data = await res.json()
      if (res.ok) {
        setResult({ ok: true, prUrl: data.prUrl })
        localStorage.removeItem(STORAGE_KEY)
        setHasChanges(false)
      } else {
        setResult({ ok: false, error: data.error })
      }
    } catch {
      setResult({ ok: false, error: 'Error de conexión. Intentá de nuevo.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-texto">Contenido de la web</h1>
          <p className="text-texto-muted text-sm mt-1">Editá los textos de cada sección. Tocá para desplegar.</p>
        </div>
        {hasChanges && (
          <span className="text-xs bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full font-medium flex-shrink-0">
            Sin enviar
          </span>
        )}
      </div>

      {/* ── Hero ── */}
      <Seccion title="Hero — Portada principal" defaultOpen>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Texto del badge" value={hero.badge} onChange={v => setHeroField('badge', v)}
            placeholder="Distribuidora Oficial · CABA" />
          <Field label="Subtítulo (fuente especial)" value={hero.subtitulo} onChange={v => setHeroField('subtitulo', v)}
            placeholder="Vivís mejor." />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Título línea 1 (grande, oscuro)" value={hero.titulo1} onChange={v => setHeroField('titulo1', v)}
            placeholder="COCINÁS" />
          <Field label="Título línea 2 (grande, teal)" value={hero.titulo2} onChange={v => setHeroField('titulo2', v)}
            placeholder="MEJOR." />
        </div>
        <Field label="Descripción" value={hero.descripcion} onChange={v => setHeroField('descripcion', v)}
          textarea placeholder="Texto debajo del título..." />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label='Botón principal (va a "#productos")' value={hero.cta1Texto} onChange={v => setHeroField('cta1Texto', v)}
            placeholder="Ver productos" />
          <Field label="Botón secundario (va a WhatsApp)" value={hero.cta2Texto} onChange={v => setHeroField('cta2Texto', v)}
            placeholder="Hablar con Daisy" />
        </div>
      </Seccion>

      {/* ── Stats ── */}
      <Seccion title="Estadísticas — Debajo de los botones">
        <p className="text-xs text-texto-muted">Estos textos aparecen en la fila de estadísticas del hero.</p>
        <div className="space-y-2">
          {hero.stats.map((stat, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={stat}
                onChange={e => setStat(i, e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border border-teal/20 focus:outline-none focus:border-teal text-texto text-sm bg-white"
              />
              <button
                onClick={() => removeStat(i)}
                className="px-3 py-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors text-sm"
                title="Eliminar"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addStat}
          className="text-xs text-teal hover:text-teal-dark font-medium transition-colors"
        >
          + Agregar estadística
        </button>
      </Seccion>

      {/* ── Enviar ── */}
      {hasChanges && (
        <div className="bg-white rounded-2xl border border-teal/20 p-5 space-y-4">
          <h3 className="font-semibold text-texto text-sm">Enviar cambios para revisión</h3>
          <Field
            label="Descripción de los cambios (opcional)"
            value={description}
            onChange={setDescription}
            textarea
            placeholder="Ej: Actualicé el título del hero y agregué una estadística nueva."
          />
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-teal hover:bg-teal-dark text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50 w-full sm:w-auto"
          >
            {submitting ? 'Enviando...' : 'Enviar para revisión'}
          </button>
        </div>
      )}

      {/* Resultado */}
      {result && (
        <div className={`rounded-2xl p-5 ${result.ok ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          {result.ok ? (
            <>
              <p className="font-semibold text-green-700 text-sm">Cambios enviados correctamente</p>
              <p className="text-green-600 text-xs mt-1">Tomas los va a revisar y publicar pronto.</p>
              {result.prUrl && (
                <a href={result.prUrl} target="_blank" rel="noopener noreferrer"
                  className="text-teal text-xs underline mt-2 inline-block">
                  Ver solicitud en GitHub →
                </a>
              )}
            </>
          ) : (
            <p className="text-red-600 text-sm">{result.error}</p>
          )}
        </div>
      )}
    </div>
  )
}
