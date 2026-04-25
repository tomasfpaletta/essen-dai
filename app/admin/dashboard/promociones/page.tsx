'use client'
import { useState, useRef } from 'react'
import { promocionesBanner, promocionesItems, type PromoItem, type PromocionesConfig } from '@/config/promociones'

// ── Helpers ──────────────────────────────────────────────────────────────────
function uid() {
  return `promo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

const GRADIENT_DIRECTIONS = [
  { label: '↗ Diagonal', value: '135deg' },
  { label: '→ Horizontal', value: '90deg' },
  { label: '↓ Vertical', value: '180deg' },
  { label: '↙ Diagonal inv.', value: '225deg' },
]

// ── Subcomponents ─────────────────────────────────────────────────────────────
function ColorSwatch({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-7 h-7 rounded-lg border border-gray-200 flex-shrink-0 cursor-pointer"
        style={{ background: value }}
        onClick={() => (document.getElementById('__cp__' + value) as HTMLInputElement)?.click()}
      />
      <input
        id={'__cp__' + value}
        type="color"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="sr-only"
      />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono"
        placeholder="#000000"
      />
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
        {label}
      </label>
      {children}
    </div>
  )
}

function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal/50"
    />
  )
}

function Textarea({ value, onChange, rows = 3 }: { value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      rows={rows}
      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:border-teal/50"
    />
  )
}

// ── Image Uploader ────────────────────────────────────────────────────────────
function PromoImageUploader({
  itemId, value, onChange,
}: {
  itemId: string
  value: string
  onChange: (path: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [localPreview, setLocalPreview] = useState<string | null>(null)
  const [error, setError] = useState('')

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    // Preview inmediato con blob URL
    const blobUrl = URL.createObjectURL(file)
    setLocalPreview(blobUrl)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('filename', `promo-${itemId}-${file.name}`)
      form.append('folder', 'promociones')
      const res = await fetch('/api/admin/upload', { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al subir')
      onChange(data.path)
      setLocalPreview(null) // el valor real ya está en `value`
    } catch (err: unknown) {
      setLocalPreview(null)
      setError(err instanceof Error ? err.message : 'Error al subir imagen')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const displaySrc = localPreview ?? (value ? `${value}?t=${Date.now()}` : null)

  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Imagen</p>
      <div className="flex items-start gap-4">
        {/* Preview */}
        <div
          className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0 cursor-pointer hover:border-teal/40 transition-colors bg-gray-50"
          onClick={() => inputRef.current?.click()}
        >
          {displaySrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={displaySrc} alt="preview" className="w-full h-full object-cover" />
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-gray-300">
              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2 justify-center pt-1">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 bg-teal/10 text-teal font-semibold px-4 py-2 rounded-xl text-sm hover:bg-teal/20 transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83"/>
                </svg>
                Subiendo…
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                {value ? 'Cambiar imagen' : 'Subir imagen'}
              </>
            )}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="text-xs text-red-400 hover:text-red-600 text-left px-1 transition-colors"
            >
              Quitar imagen
            </button>
          )}
          <p className="text-xs text-gray-400">PNG, JPG o WebP · máx. recomendado 2MB</p>
        </div>
      </div>

      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  )
}

// ── Convierte primera página de un PDF a Blob JPEG (client-side) ─────────────
async function pdfFirstPageToBlob(file: File): Promise<Blob> {
  const pdfjsLib = await import('pdfjs-dist')
  // Worker desde CDN con versión exacta — evita configuración de webpack
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`

  const arrayBuffer = await file.arrayBuffer()
  const pdf  = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  const page = await pdf.getPage(1)

  const viewport = page.getViewport({ scale: 2.5 }) // alta resolución
  const canvas   = document.createElement('canvas')
  canvas.width   = viewport.width
  canvas.height  = viewport.height

  await page.render({
    canvasContext: canvas.getContext('2d') as CanvasRenderingContext2D,
    canvas,
    viewport,
  }).promise

  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      b => (b ? resolve(b) : reject(new Error('No se pudo convertir el PDF'))),
      'image/jpeg', 0.92
    )
  )
}

// ── Uploader imagen bancaria — acepta imagen O PDF ────────────────────────────
function BancosImageUploader() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [phase, setPhase]     = useState<'idle' | 'converting' | 'uploading' | 'done'>('idle')
  const [uploadOk, setUploadOk] = useState(false)
  const [error, setError]     = useState('')
  const [preview, setPreview] = useState('/images/bancos/promos.webp')

  const busy = phase === 'converting' || phase === 'uploading'

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    setUploadOk(false)

    try {
      let uploadFile: File = file

      if (file.type === 'application/pdf') {
        // ── PDF: renderizar página 1 en el browser ──
        setPhase('converting')
        const blob = await pdfFirstPageToBlob(file)
        uploadFile  = new File([blob], 'promos.jpg', { type: 'image/jpeg' })
        setPreview(URL.createObjectURL(blob))
      } else {
        // ── Imagen: preview inmediato ──
        setPreview(URL.createObjectURL(file))
      }

      // ── Subir al servidor ──
      setPhase('uploading')
      const form = new FormData()
      form.append('file', uploadFile)
      form.append('filename', 'promos')
      form.append('folder', 'bancos')
      const res  = await fetch('/api/admin/upload', { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al subir')

      setUploadOk(true)
      setPhase('done')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al procesar el archivo')
      setPreview('/images/bancos/promos.webp')
      setPhase('idle')
    } finally {
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const btnLabel =
    phase === 'converting' ? 'Convirtiendo PDF…' :
    phase === 'uploading'  ? 'Subiendo…' :
    'Subir imagen o PDF'

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="font-bold text-texto">Imagen de beneficios bancarios</h2>
          <p className="text-texto-muted text-xs mt-1">
            Se actualiza 1–2 veces por mes. Podés subir una foto <strong>o directamente el PDF</strong> del banco.
          </p>
        </div>
        <span className="text-xs bg-teal/10 text-teal px-2.5 py-1 rounded-full font-medium flex-shrink-0">
          Se publica al instante
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-5 items-start">
        {/* Preview */}
        <div
          className="relative rounded-xl overflow-hidden border border-gray-100 cursor-pointer hover:border-teal/40 transition-colors flex-shrink-0 group"
          style={{ width: 160, height: 220 }}
          onClick={() => !busy && inputRef.current?.click()}
        >
          <img
            src={preview.startsWith('blob:') ? preview : `${preview}?t=${Date.now()}`}
            alt="Imagen bancaria actual"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }}
            onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
          {/* Spinner durante conversión/upload */}
          {busy && (
            <div className="absolute inset-0 bg-white/75 flex flex-col items-center justify-center gap-2 backdrop-blur-sm">
              <svg className="animate-spin w-6 h-6 text-teal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83"/>
              </svg>
              <p className="text-xs text-teal font-medium text-center px-2">
                {phase === 'converting' ? 'Convirtiendo PDF…' : 'Subiendo…'}
              </p>
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors flex items-end justify-center pb-3">
            {!busy && (
              <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-white text-xs px-3 py-1 rounded-full">
                Cambiar
              </span>
            )}
          </div>
        </div>

        {/* Controles */}
        <div className="flex flex-col gap-3 pt-1 flex-1">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="inline-flex items-center gap-2 bg-teal/10 text-teal font-semibold px-5 py-3 rounded-xl text-sm hover:bg-teal/20 transition-colors disabled:opacity-50 w-full sm:w-auto"
          >
            {busy ? (
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            )}
            {btnLabel}
          </button>

          {uploadOk && (
            <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 text-sm">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 flex-shrink-0">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              ¡Imagen actualizada! Ya se ve en la web.
            </div>
          )}
          {error && <p className="text-xs text-red-500">{error}</p>}

          <div className="bg-teal/5 border border-teal/15 rounded-xl p-3 space-y-1">
            <p className="text-xs font-semibold text-teal mb-1">Formatos aceptados</p>
            <p className="text-xs text-texto-muted flex items-center gap-1.5">
              <span className="inline-block w-5 h-5 bg-red-100 text-red-600 rounded text-[10px] font-bold flex items-center justify-center">PDF</span>
              PDF — se convierte a imagen automáticamente
            </p>
            <p className="text-xs text-texto-muted flex items-center gap-1.5">
              <span className="inline-block w-5 h-5 bg-blue-100 text-blue-600 rounded text-[10px] font-bold flex items-center justify-center">IMG</span>
              JPG, PNG o WebP — se sube directamente
            </p>
          </div>
        </div>
      </div>

      {/* Input acepta imágenes Y PDFs */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function PromocionesPage() {
  const [banner, setBanner] = useState<PromocionesConfig>({ ...promocionesBanner })
  const [items, setItems] = useState<PromoItem[]>(promocionesItems.map(i => ({ ...i })))
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [hasChanges, setHasChanges] = useState(false)
  const [dirtyIds, setDirtyIds] = useState<Set<string>>(new Set())

  function markChanged(id?: string) {
    setHasChanges(true)
    setSaved(false)
    if (id) setDirtyIds(prev => new Set(prev).add(id))
  }

  // Banner helpers
  function patchBanner(key: keyof PromocionesConfig, val: string | boolean) {
    setBanner(b => ({ ...b, [key]: val })); markChanged()
  }

  // Items helpers
  function patchItem(id: string, key: keyof PromoItem, val: string | boolean) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, [key]: val } : i)); markChanged(id)
  }

  function addItem() {
    const newItem: PromoItem = {
      id: uid(),
      titulo: 'Nueva promoción',
      descripcion: 'Descripción de la promoción.',
      badge: 'Nuevo',
      colorFondo: '#58A39D',
      colorTexto: '#FFFFFF',
      imagen: '',
      activo: true,
    }
    setItems(prev => [...prev, newItem])
    setEditingId(newItem.id)
    markChanged(newItem.id)
  }

  function removeItem(id: string) {
    const it = items.find(i => i.id === id)
    const label = it?.titulo ? `"${it.titulo}"` : 'esta promoción'
    if (!confirm(`¿Eliminar ${label}? Esta acción no se puede deshacer.`)) return
    setItems(prev => prev.filter(i => i.id !== id))
    if (editingId === id) setEditingId(null)
    markChanged()
  }

  function moveItem(id: string, dir: -1 | 1) {
    setItems(prev => {
      const idx = prev.findIndex(i => i.id === id)
      if (idx < 0) return prev
      const next = idx + dir
      if (next < 0 || next >= prev.length) return prev
      const arr = [...prev]
      ;[arr[idx], arr[next]] = [arr[next], arr[idx]]
      return arr
    }); markChanged()
  }

  // Save
  async function handleSave() {
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      const res = await fetch('/api/admin/submit-pr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promociones: { banner, items },
          descripcion: 'Actualización de la sección de Promociones / Ediciones limitadas.',
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al guardar')
      setSaved(true)
      setHasChanges(false)
      setDirtyIds(new Set())
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error desconocido')
    } finally {
      setSaving(false)
    }
  }

  const editingItem = editingId ? items.find(i => i.id === editingId) : null

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-texto">Promociones</h1>
          <p className="text-texto-muted text-sm mt-1">
            Ediciones limitadas, ofertas y banners especiales.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {hasChanges && (
            <span className="text-xs bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full font-medium">Sin publicar</span>
          )}
        <button
          onClick={handleSave}
          disabled={saving || !hasChanges}
          className="flex items-center gap-2 bg-teal text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-teal-dark transition-colors disabled:opacity-40 flex-shrink-0"
        >
          {saving ? (
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83"/></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
          )}
          {saving ? 'Publicando…' : 'Publicar cambios'}
        </button>
        </div>
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
          ¡Publicado! Vercel desplegará los cambios en ~30 segundos.
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>
      )}

      {/* ── Sección: Imagen beneficios bancarios ── */}
      <BancosImageUploader />

      {/* ── Sección: Configuración del banner ── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-texto">Banner principal</h2>
          {/* Toggle visible */}
          <button
            onClick={() => patchBanner('visible', !banner.visible)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${banner.visible ? 'bg-teal' : 'bg-gray-200'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${banner.visible ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>

        {!banner.visible && (
          <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
            La sección de Promociones está <strong>oculta</strong> en el sitio.
          </p>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Badge">
            <Input value={banner.badge} onChange={v => patchBanner('badge', v)} placeholder="Tiempo limitado" />
          </Field>
          <Field label="Título">
            <Input value={banner.titulo} onChange={v => patchBanner('titulo', v)} placeholder="Colección Invierno" />
          </Field>
          <Field label="Subtítulo">
            <Input value={banner.subtitulo} onChange={v => patchBanner('subtitulo', v)} placeholder="Hasta 30% OFF…" />
          </Field>
          <Field label="Descripción">
            <Textarea value={banner.descripcion} onChange={v => patchBanner('descripcion', v)} rows={2} />
          </Field>
          <Field label="Texto del CTA">
            <Input value={banner.ctaTexto} onChange={v => patchBanner('ctaTexto', v)} placeholder="Ver ofertas" />
          </Field>
          <Field label="Link del CTA">
            <Input value={banner.ctaLink} onChange={v => patchBanner('ctaLink', v)} placeholder="#productos" />
          </Field>
        </div>

        {/* Gradiente */}
        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">Gradiente del fondo</p>
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Color inicio">
              <ColorSwatch value={banner.gradienteDesde} onChange={v => patchBanner('gradienteDesde', v)} />
            </Field>
            <Field label="Color final">
              <ColorSwatch value={banner.gradienteHasta} onChange={v => patchBanner('gradienteHasta', v)} />
            </Field>
            <Field label="Dirección">
              <select
                value={banner.gradienteDireccion}
                onChange={e => patchBanner('gradienteDireccion', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal/50"
              >
                {GRADIENT_DIRECTIONS.map(d => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </Field>
          </div>
          {/* Preview */}
          <div
            className="mt-3 h-10 rounded-xl border border-white/20"
            style={{
              background: `linear-gradient(${banner.gradienteDireccion}, ${banner.gradienteDesde}, ${banner.gradienteHasta})`,
            }}
          />
        </div>
      </div>

      {/* ── Sección: Items de promo ── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-texto">Items de la sección</h2>
          <button
            onClick={addItem}
            className="flex items-center gap-2 bg-teal/10 text-teal font-semibold px-4 py-2 rounded-xl text-sm hover:bg-teal/20 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Agregar
          </button>
        </div>

        {items.length === 0 && (
          <p className="text-sm text-texto-muted text-center py-8">
            No hay items. Agregá uno con el botón de arriba.
          </p>
        )}

        {/* List */}
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div key={item.id} className="border border-gray-100 rounded-xl overflow-hidden">
              {/* Row header */}
              <div
                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setEditingId(editingId === item.id ? null : item.id)}
              >
                {/* Color swatch */}
                <div
                  className="w-5 h-5 rounded-md flex-shrink-0 border border-white/20 shadow-sm"
                  style={{ background: item.colorFondo }}
                />

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold text-texto truncate">{item.titulo}</p>
                    {dirtyIds.has(item.id) && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" title="Sin publicar" />
                    )}
                  </div>
                  <p className="text-xs text-texto-muted truncate">{item.badge}</p>
                </div>

                {/* Active toggle */}
                <button
                  onClick={e => { e.stopPropagation(); patchItem(item.id, 'activo', !item.activo) }}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0 ${item.activo ? 'bg-teal' : 'bg-gray-200'}`}
                >
                  <span
                    className="inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform"
                    style={{ transform: `translateX(${item.activo ? '18px' : '2px'})` }}
                  />
                </button>

                {/* Move up/down */}
                <div className="flex gap-0.5 flex-shrink-0">
                  <button
                    onClick={e => { e.stopPropagation(); moveItem(item.id, -1) }}
                    disabled={idx === 0}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 text-texto-muted"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15"/></svg>
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); moveItem(item.id, 1) }}
                    disabled={idx === items.length - 1}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 text-texto-muted"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                  </button>
                </div>

                {/* Delete */}
                <button
                  onClick={e => { e.stopPropagation(); removeItem(item.id) }}
                  className="p-1 rounded hover:bg-red-50 hover:text-red-500 text-texto-muted transition-colors flex-shrink-0"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6m4-6v6"/><path d="M9 6V4h6v2"/></svg>
                </button>

                {/* Expand chevron */}
                <svg
                  className={`flex-shrink-0 text-gray-400 transition-transform ${editingId === item.id ? 'rotate-180' : ''}`}
                  width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                >
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>

              {/* Editor expandido */}
              {editingId === item.id && editingItem && (
                <div className="border-t border-gray-100 bg-gray-50/50 p-4 grid sm:grid-cols-2 gap-4">
                  <Field label="Título">
                    <Input value={item.titulo} onChange={v => patchItem(item.id, 'titulo', v)} />
                  </Field>
                  <Field label="Badge">
                    <Input value={item.badge} onChange={v => patchItem(item.id, 'badge', v)} />
                  </Field>
                  <Field label="Descripción">
                    <Textarea value={item.descripcion} onChange={v => patchItem(item.id, 'descripcion', v)} rows={2} />
                  </Field>
                  <Field label="Vence el (opcional)">
                    <div className="flex gap-2 items-center">
                      <input
                        type="date"
                        value={item.fechaFin || ''}
                        onChange={e => patchItem(item.id, 'fechaFin', e.target.value)}
                        className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-teal/50"
                      />
                      {item.fechaFin && (
                        <button
                          onClick={() => patchItem(item.id, 'fechaFin', '')}
                          className="text-xs text-gray-400 hover:text-red-400 transition-colors px-2 py-2"
                        >
                          Quitar
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">La promo se ocultará automáticamente después de esta fecha.</p>
                  </Field>
                  <div className="space-y-4">
                    <Field label="Color de fondo">
                      <ColorSwatch value={item.colorFondo} onChange={v => patchItem(item.id, 'colorFondo', v)} />
                    </Field>
                    <Field label="Color de texto">
                      <ColorSwatch value={item.colorTexto} onChange={v => patchItem(item.id, 'colorTexto', v)} />
                    </Field>
                  </div>
                  {/* Mini preview */}
                  {/* Imagen */}
                  <div className="sm:col-span-2">
                    <PromoImageUploader
                      itemId={item.id}
                      value={item.imagen}
                      onChange={v => patchItem(item.id, 'imagen', v)}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Vista previa</p>
                    <div
                      className="rounded-xl p-4 border border-white/20"
                      style={{ background: item.colorFondo }}
                    >
                      <span
                        className="inline-block text-xs font-bold px-2 py-0.5 rounded-full mb-2"
                        style={{ background: 'rgba(255,255,255,0.2)', color: item.colorTexto }}
                      >
                        {item.badge}
                      </span>
                      <p className="font-heading text-base" style={{ color: item.colorTexto }}>{item.titulo}</p>
                      <p className="text-sm mt-0.5" style={{ color: item.colorTexto, opacity: 0.7 }}>{item.descripcion}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
