'use client'
import { useState, useEffect } from 'react'
import { productos as initialProductos, HEX, categorias, type Producto, type Variante } from '@/lib/products'

// ── Tipos ────────────────────────────────────────────────────────────────────
type VarianteEdit = Variante & { preview?: string; uploading?: boolean }
type ProductoEdit = Omit<Producto, 'variantes'> & { variantes: VarianteEdit[] }

const STORAGE_KEY = 'admin_productos_draft'

// ── Helpers ───────────────────────────────────────────────────────────────────
function cleanForStorage(items: ProductoEdit[]) {
  return items.map(p => ({
    ...p,
    variantes: p.variantes.map(({ preview: _p, uploading: _u, ...v }) => v),
  }))
}

// ── Componentes auxiliares ────────────────────────────────────────────────────
function Tag({ text }: { text: string }) {
  return (
    <span className="bg-teal/8 border border-teal/20 text-teal-dark text-xs px-2 py-0.5 rounded-full">
      {text}
    </span>
  )
}

// ── Página principal ─────────────────────────────────────────────────────────
export default function ProductosPage() {
  const [items, setItems] = useState<ProductoEdit[]>(
    initialProductos.map(p => ({ ...p, variantes: p.variantes.map(v => ({ ...v })) }))
  )
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [description, setDescription] = useState('')
  const [result, setResult] = useState<{ ok: boolean; prUrl?: string; error?: string } | null>(null)

  // Cargar borrador
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try { setItems(JSON.parse(saved)); setHasChanges(true) } catch {}
    }
  }, [])

  // Auto-guardar
  useEffect(() => {
    if (hasChanges) localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanForStorage(items)))
  }, [items, hasChanges])

  function updateProduct(id: string, updates: Partial<ProductoEdit>) {
    setItems(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p))
    setHasChanges(true)
  }

  function updateVariante(productId: string, idx: number, updates: Partial<VarianteEdit>) {
    setItems(prev => prev.map(p => {
      if (p.id !== productId) return p
      const variantes = [...p.variantes]
      variantes[idx] = { ...variantes[idx], ...updates }
      return { ...p, variantes }
    }))
    setHasChanges(true)
  }

  async function handleImageUpload(file: File, productId: string, varIdx: number) {
    const product  = items.find(p => p.id === productId)
    if (!product) return
    const variante = product.variantes[varIdx]
    const filename = `${productId}-${variante.color.toLowerCase().replace(/\s+/g, '-')}`

    // Preview local inmediato
    const preview = URL.createObjectURL(file)
    updateVariante(productId, varIdx, { uploading: true, preview })

    const formData = new FormData()
    formData.append('file', file)
    formData.append('filename', filename)

    try {
      const res  = await fetch('/api/admin/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (res.ok) {
        updateVariante(productId, varIdx, { imagen: data.path, uploading: false })
      } else {
        alert(`Error al subir imagen: ${data.error}`)
        updateVariante(productId, varIdx, { uploading: false, preview: undefined })
      }
    } catch {
      alert('Error de conexión al subir la imagen')
      updateVariante(productId, varIdx, { uploading: false, preview: undefined })
    }
  }

  async function handleSubmit() {
    setSubmitting(true)
    setResult(null)
    try {
      const res = await fetch('/api/admin/submit-pr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productos: cleanForStorage(items),
          hex: HEX,
          categorias,
          descripcion: description,
        }),
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
          <h1 className="text-2xl font-bold text-texto">Productos</h1>
          <p className="text-texto-muted text-sm mt-1">{items.length} productos en el catálogo</p>
        </div>
        {hasChanges && (
          <span className="text-xs bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full font-medium flex-shrink-0">
            ● Sin enviar
          </span>
        )}
      </div>

      {/* Lista de productos */}
      <div className="space-y-3">
        {items.map(p => (
          <div key={p.id} className="bg-white rounded-2xl border border-teal/10 overflow-hidden">
            {/* Encabezado del producto */}
            <button
              onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}
              className="w-full flex items-center gap-4 p-4 hover:bg-fondo transition-colors text-left"
            >
              <div className="w-10 h-10 bg-fondo rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                {p.categoria === 'nuit' ? '🖤' : p.categoria === 'bazar' ? '☕' : '🍳'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-texto text-sm leading-tight">{p.nombre}</p>
                <p className="text-texto-muted text-xs truncate mt-0.5">{p.descripcion}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {p.destacado && (
                  <span className="hidden sm:block text-xs bg-teal/10 text-teal px-2 py-0.5 rounded-full">
                    Destacado
                  </span>
                )}
                {p.descuento && (
                  <span className="hidden sm:block text-xs bg-lila/10 text-lila-dark px-2 py-0.5 rounded-full">
                    -{p.descuento}%
                  </span>
                )}
                <span className="text-texto-light text-sm">{expandedId === p.id ? '▲' : '▼'}</span>
              </div>
            </button>

            {/* Panel de edición */}
            {expandedId === p.id && (
              <div className="border-t border-teal/10 p-5 bg-fondo/40 space-y-5">
                {/* Nombre y badge */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-texto-muted mb-1.5 block">Nombre</label>
                    <input
                      value={p.nombre}
                      onChange={e => updateProduct(p.id, { nombre: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-teal/20 focus:outline-none focus:border-teal bg-white text-texto"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-texto-muted mb-1.5 block">
                      Badge <span className="font-normal">(ej: "Más vendida")</span>
                    </label>
                    <input
                      value={p.badge || ''}
                      onChange={e => updateProduct(p.id, { badge: e.target.value || undefined })}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-teal/20 focus:outline-none focus:border-teal bg-white text-texto"
                      placeholder="Opcional"
                    />
                  </div>
                </div>

                {/* Descripción */}
                <div>
                  <label className="text-xs font-medium text-texto-muted mb-1.5 block">Descripción</label>
                  <textarea
                    value={p.descripcion}
                    onChange={e => updateProduct(p.id, { descripcion: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-teal/20 focus:outline-none focus:border-teal bg-white text-texto resize-none"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="text-xs font-medium text-texto-muted mb-1.5 block">
                    Tags <span className="font-normal">(separados por coma)</span>
                  </label>
                  <input
                    value={p.tags.join(', ')}
                    onChange={e => updateProduct(p.id, {
                      tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                    })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-teal/20 focus:outline-none focus:border-teal bg-white text-texto"
                    placeholder="2,1 lts, Todos los fuegos"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {p.tags.map(t => <Tag key={t} text={t} />)}
                  </div>
                </div>

                {/* Checkboxes + descuento */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { key: 'destacado',    label: 'Destacado'      },
                    { key: 'stockBajo',    label: 'Stock bajo'     },
                    { key: 'ofertaEspecial', label: 'Oferta especial' },
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!(p as Record<string, unknown>)[key]}
                        onChange={e => updateProduct(p.id, { [key]: e.target.checked || undefined })}
                        className="rounded border-teal/30 text-teal focus:ring-teal/20"
                      />
                      <span className="text-xs text-texto-muted">{label}</span>
                    </label>
                  ))}
                  <div>
                    <label className="text-xs text-texto-muted block mb-1">Descuento %</label>
                    <input
                      type="number" min="0" max="100"
                      value={p.descuento || ''}
                      onChange={e => updateProduct(p.id, {
                        descuento: e.target.value ? Number(e.target.value) : undefined
                      })}
                      className="w-full px-2 py-1.5 text-sm rounded-xl border border-teal/20 focus:outline-none focus:border-teal bg-white text-texto"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Imágenes por color */}
                <div>
                  <label className="text-xs font-medium text-texto-muted mb-3 block">
                    Fotos por color
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {p.variantes.map((v, idx) => (
                      <div key={v.color} className="flex flex-col items-center gap-2">
                        {/* Preview */}
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white border-2 border-teal/15 flex items-center justify-center">
                          {v.preview || v.imagen ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={v.preview || v.imagen}
                              alt={v.color}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <span className="text-2xl text-texto-light">📷</span>
                          )}
                          {v.uploading && (
                            <div className="absolute inset-0 bg-white/85 flex items-center justify-center">
                              <p className="text-xs text-teal font-medium">Subiendo...</p>
                            </div>
                          )}
                        </div>

                        {/* Color */}
                        <div className="flex items-center gap-1">
                          <span
                            className="w-3 h-3 rounded-full border border-white shadow-sm flex-shrink-0"
                            style={{ background: v.hex }}
                          />
                          <span className="text-xs text-texto-muted">{v.color}</span>
                        </div>

                        {/* Upload */}
                        <label className="cursor-pointer text-xs text-teal hover:text-teal-dark font-medium transition-colors">
                          {v.imagen ? 'Cambiar foto' : '+ Subir foto'}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={v.uploading}
                            onChange={e => {
                              const file = e.target.files?.[0]
                              if (file) handleImageUpload(file, p.id, idx)
                              e.target.value = ''
                            }}
                          />
                        </label>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-texto-light mt-3">
                    Las fotos se convierten automáticamente a .webp y se guardan al subirse.
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Enviar */}
      {hasChanges && (
        <div className="bg-white rounded-2xl border border-teal/20 p-5 space-y-4">
          <h3 className="font-semibold text-texto text-sm">Enviar cambios para revisión</h3>
          <div>
            <label className="text-xs font-medium text-texto mb-1.5 block">
              Descripción de los cambios (opcional)
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Ej: Actualicé la descripción del wok y subí fotos nuevas de la cacerola 24cm."
              className="w-full px-3 py-2 text-sm rounded-xl border border-teal/20 focus:outline-none focus:border-teal bg-fondo text-texto resize-none"
              rows={3}
            />
          </div>
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
