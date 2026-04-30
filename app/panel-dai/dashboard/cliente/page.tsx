'use client'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Cliente } from '@/config/cliente'

// ── Tipos ────────────────────────────────────────────────────────────────────
type FormState = {
  nombre: string
  marca: string
  slogan: string
  descripcionCorta: string
  ciudad: string
  provincia: string
  pais: string
  coordenadas: { lat: number; lng: number }
  whatsapp: { numero: string; display: string; mensajeDefecto: string }
  instagram: { usuario: string; url: string }
  seo: { baseUrl: string; titulo: string; descripcion: string; ogImage: string }
  popupDelay: number
  colores: { primary: string; secondary: string; accent: string; dark: string }
}

const STORAGE_KEY = 'admin_cliente_draft'

// ── Componentes auxiliares ────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-teal/10 p-5 space-y-4">
      <h2 className="font-semibold text-texto text-sm border-b border-teal/10 pb-3">{title}</h2>
      {children}
    </div>
  )
}

function Field({
  label, value, onChange, textarea, placeholder, hint, type = 'text',
}: {
  label: string
  value: string | number
  onChange: (v: string) => void
  textarea?: boolean
  placeholder?: string
  hint?: string
  type?: string
}) {
  const cls =
    'w-full px-3 py-2 rounded-xl border border-teal/20 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/10 text-texto text-sm bg-fondo'
  return (
    <div>
      <label className="block text-xs font-medium text-texto mb-1.5">{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${cls} resize-y min-h-[72px]`}
          rows={3}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={cls}
        />
      )}
      {hint && <p className="text-xs text-texto-light mt-1">{hint}</p>}
    </div>
  )
}

// ── Página principal ─────────────────────────────────────────────────────────
export default function ClientePage() {
  const [form, setForm] = useState<FormState>({
    nombre:           Cliente.nombre,
    marca:            Cliente.marca,
    slogan:           Cliente.slogan,
    descripcionCorta: Cliente.descripcionCorta,
    ciudad:           Cliente.ciudad,
    provincia:        Cliente.provincia,
    pais:             Cliente.pais,
    coordenadas:      { ...Cliente.coordenadas },
    whatsapp: {
      numero:          Cliente.whatsapp.numero,
      display:         Cliente.whatsapp.display,
      mensajeDefecto:  Cliente.whatsapp.mensajeDefecto,
    },
    instagram: { ...Cliente.instagram },
    seo: {
      baseUrl:     Cliente.seo.baseUrl,
      titulo:      Cliente.seo.titulo,
      descripcion: Cliente.seo.descripcion,
      ogImage:     Cliente.seo.ogImage,
    },
    popupDelay: Cliente.popupDelay,
    colores:    { ...Cliente.colores },
  })

  const [hasChanges, setHasChanges] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [status, setStatus]         = useState<'idle' | 'ok' | 'error'>('idle')
  const [statusMsg, setStatusMsg]   = useState('')

  // OG Image
  const ogInputRef               = useRef<HTMLInputElement>(null)
  const [ogUploading, setOgUploading] = useState(false)
  const [ogError, setOgError]         = useState('')

  // Cargar borrador de localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const d = JSON.parse(saved)
        setForm(prev => ({ ...prev, ...d }))
        setHasChanges(true)
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [])

  // Guardar borrador automáticamente
  useEffect(() => {
    if (hasChanges) localStorage.setItem(STORAGE_KEY, JSON.stringify(form))
  }, [form, hasChanges])

  function set(path: string, value: unknown) {
    setForm(prev => {
      const next = structuredClone(prev) as Record<string, unknown>
      const keys = path.split('.')
      let obj = next
      for (let i = 0; i < keys.length - 1; i++) obj = (obj[keys[i]] as Record<string, unknown>)
      obj[keys[keys.length - 1]] = value
      return next as FormState
    })
    setHasChanges(true)
    setStatus('idle')
  }

  async function handleOgUpload(file: File) {
    setOgUploading(true)
    setOgError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('filename', 'og')
      fd.append('folder', 'og')
      const res  = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al subir imagen')
      set('seo.ogImage', data.path)
    } catch (e: unknown) {
      setOgError(e instanceof Error ? e.message : 'Error al subir imagen')
    } finally {
      setOgUploading(false)
    }
  }

  async function handlePublish() {
    setPublishing(true)
    setStatus('idle')
    try {
      const clienteData = {
        // Preserve all existing fields not in the form
        ...JSON.parse(JSON.stringify(Cliente)),
        // Override with form values
        nombre:           form.nombre,
        marca:            form.marca,
        slogan:           form.slogan,
        descripcionCorta: form.descripcionCorta,
        ciudad:           form.ciudad,
        provincia:        form.provincia,
        pais:             form.pais,
        coordenadas:      form.coordenadas,
        whatsapp: {
          ...form.whatsapp,
          link: `https://wa.me/${form.whatsapp.numero}`,
        },
        instagram: {
          usuario: form.instagram.usuario,
          url: `https://www.instagram.com/${form.instagram.usuario}`,
        },
        seo: {
          ...Cliente.seo,
          baseUrl:     form.seo.baseUrl,
          titulo:      form.seo.titulo,
          descripcion: form.seo.descripcion,
          ogImage:     form.seo.ogImage,
        },
        popupDelay: form.popupDelay,
        colores:    form.colores,
      }

      const res = await fetch('/api/admin/submit-pr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cliente: clienteData }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus('ok')
        setStatusMsg('¡Configuración publicada! Los cambios se verán en la web en ~1 minuto.')
        localStorage.removeItem(STORAGE_KEY)
        setHasChanges(false)
      } else {
        setStatus('error')
        setStatusMsg(data.error || 'Error al publicar')
      }
    } catch {
      setStatus('error')
      setStatusMsg('Error de conexión. Intentá de nuevo.')
    } finally {
      setPublishing(false)
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-texto">Configuración del sitio</h1>
          <p className="text-texto-muted text-sm mt-1">Datos de contacto, textos e imagen de redes.</p>
        </div>
        <button
          onClick={handlePublish}
          disabled={publishing || !hasChanges}
          className="flex-shrink-0 flex items-center gap-2 bg-teal hover:bg-teal-dark text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-40"
        >
          {publishing
            ? <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83"/></svg> Publicando…</>
            : <><svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd"/></svg> Publicar cambios</>
          }
        </button>
      </div>

      {/* Feedback */}
      {status === 'ok' && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">
          ✓ {statusMsg}
        </div>
      )}
      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
          {statusMsg}
        </div>
      )}

      {/* Identidad */}
      <Section title="Identidad">
        <Field label="Nombre completo" value={form.nombre} onChange={v => set('nombre', v)} />
        <Field label="Marca (nombre corto)" value={form.marca} onChange={v => set('marca', v)} />
        <Field label="Slogan" value={form.slogan} onChange={v => set('slogan', v)} placeholder="Cocinás mejor. Vivís mejor." />
        <Field label="Descripción corta" value={form.descripcionCorta} onChange={v => set('descripcionCorta', v)} textarea />
      </Section>

      {/* WhatsApp */}
      <Section title="WhatsApp">
        <Field
          label="Número completo (sin + ni espacios)"
          value={form.whatsapp.numero}
          onChange={v => set('whatsapp.numero', v)}
          placeholder="5491168607050"
          hint="Ejemplo: 5491168607050 (54 = Argentina, 9 = celular, luego el número)"
        />
        <Field
          label="Número visible en la web"
          value={form.whatsapp.display}
          onChange={v => set('whatsapp.display', v)}
          placeholder="+54 9 11 6860-7050"
        />
        <Field
          label="Mensaje predeterminado al contactar"
          value={form.whatsapp.mensajeDefecto}
          onChange={v => set('whatsapp.mensajeDefecto', v)}
          textarea
        />
      </Section>

      {/* Instagram */}
      <Section title="Instagram">
        <Field
          label="Usuario (sin @)"
          value={form.instagram.usuario}
          onChange={v => set('instagram.usuario', v)}
          placeholder="master_essen"
        />
        <p className="text-xs text-texto-muted">
          URL generada: <span className="text-teal">instagram.com/{form.instagram.usuario}</span>
        </p>
      </Section>

      {/* SEO */}
      <Section title="SEO — texto para Google">
        <Field
          label="Título de la página"
          value={form.seo.titulo}
          onChange={v => set('seo.titulo', v)}
        />
        <Field
          label="Descripción (idealmente 150–160 caracteres)"
          value={form.seo.descripcion}
          onChange={v => set('seo.descripcion', v)}
          textarea
        />
        <p className={`text-xs ${form.seo.descripcion.length > 160 ? 'text-red-400' : 'text-texto-light'}`}>
          {form.seo.descripcion.length} / 160 caracteres
        </p>
      </Section>

      {/* OG Image */}
      <Section title="Imagen para redes sociales (OG Image)">
        <p className="text-xs text-texto-muted -mt-1">
          Esta imagen aparece cuando alguien comparte tu web en WhatsApp, Facebook o Instagram. Ideal: 1200×630 px.
        </p>

        {/* Preview */}
        <div className="flex items-start gap-4">
          <div className="relative w-48 h-24 rounded-xl overflow-hidden bg-gray-50 border border-teal/15 flex-shrink-0">
            {form.seo.ogImage ? (
              <Image
                src={form.seo.ogImage}
                alt="OG Image preview"
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-gray-300">
                  <rect x="3" y="3" width="18" height="18" rx="3"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <path d="M21 15l-5-5L5 21"/>
                </svg>
                <span className="text-[10px] text-gray-400">Sin imagen</span>
              </div>
            )}
            {ogUploading && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                <svg className="animate-spin w-5 h-5 text-teal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4m0 12v4"/></svg>
              </div>
            )}
          </div>

          <div className="flex-1 space-y-2">
            <input
              ref={ogInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => {
                const f = e.target.files?.[0]
                if (f) handleOgUpload(f)
                e.target.value = ''
              }}
            />
            <button
              onClick={() => ogInputRef.current?.click()}
              disabled={ogUploading}
              className="flex items-center gap-2 text-xs font-semibold text-teal border border-teal/30 px-4 py-2 rounded-xl hover:bg-teal/5 transition-colors disabled:opacity-50"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd"/>
              </svg>
              {ogUploading ? 'Subiendo...' : 'Subir imagen'}
            </button>
            {form.seo.ogImage && (
              <p className="text-[11px] text-texto-light font-mono break-all">{form.seo.ogImage}</p>
            )}
            {ogError && (
              <p className="text-xs text-red-500">{ogError}</p>
            )}
          </div>
        </div>
      </Section>
    </div>
  )
}
