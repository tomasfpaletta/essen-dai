'use client'
import { useState, useEffect } from 'react'
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
  seo: { baseUrl: string; titulo: string; descripcion: string }
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
    },
    popupDelay: Cliente.popupDelay,
    colores:    { ...Cliente.colores },
  })

  const [hasChanges, setHasChanges]   = useState(false)
  const [submitting, setSubmitting]   = useState(false)
  const [description, setDescription] = useState('')
  const [result, setResult]           = useState<{ ok: boolean; prUrl?: string; error?: string } | null>(null)

  // Cargar borrador de localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try { setForm(JSON.parse(saved)); setHasChanges(true) } catch {}
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
  }

  async function handleSubmit() {
    setSubmitting(true)
    setResult(null)
    try {
      const clienteData = {
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
          baseUrl:     form.seo.baseUrl,
          titulo:      form.seo.titulo,
          descripcion: form.seo.descripcion,
          keywords:    [...Cliente.seo.keywords],
          ogImage:     Cliente.seo.ogImage,
        },
        popupDelay: form.popupDelay,
        colores:    form.colores,
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
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-texto">Configuración del sitio</h1>
          <p className="text-texto-muted text-sm mt-1">Datos de contacto y textos principales.</p>
        </div>
        {hasChanges && (
          <span className="text-xs bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full font-medium flex-shrink-0">
            ● Sin enviar
          </span>
        )}
      </div>

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

      {/* Enviar */}
      {hasChanges && (
        <div className="bg-white rounded-2xl border border-teal/20 p-5 space-y-4">
          <h3 className="font-semibold text-texto text-sm">Enviar cambios para revisión</h3>
          <Field
            label="Descripción de los cambios (opcional)"
            value={description}
            onChange={setDescription}
            textarea
            placeholder="Ej: Cambié el número de WhatsApp y actualicé el slogan."
          />
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-teal hover:bg-teal-dark text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50 w-full sm:w-auto"
          >
            {submitting ? '⏳ Enviando...' : '🚀 Enviar para revisión'}
          </button>
        </div>
      )}

      {/* Resultado */}
      {result && (
        <div className={`rounded-2xl p-5 ${result.ok ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          {result.ok ? (
            <>
              <p className="font-semibold text-green-700 text-sm">✅ ¡Cambios enviados!</p>
              <p className="text-green-600 text-xs mt-1">Tomas los va a revisar y publicar pronto.</p>
              {result.prUrl && (
                <a href={result.prUrl} target="_blank" rel="noopener noreferrer"
                  className="text-teal text-xs underline mt-2 inline-block">
                  Ver solicitud en GitHub →
                </a>
              )}
            </>
          ) : (
            <p className="text-red-600 text-sm">❌ {result.error}</p>
          )}
        </div>
      )}
    </div>
  )
}
