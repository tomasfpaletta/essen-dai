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

  // Filtros
  const [filterCategoria, setFilterCategoria] = useState<string>('todos')
  const [filterColor, setFilterColor] = useState<string>('')
  const [filterCaracteristica, setFilterCaracteristica] = useState<string>('')
  const [filterTexto, setFilterTexto] = useState<string>('')

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

  function removeVariante(productId: string, idx: number) {
    setItems(prev => prev.map(p => {
      if (p.id !== productId) return p
      const variantes = p.variantes.filter((_, i) => i !== idx)
      return { ...p, variantes }
    }))
    setHasChanges(true)
  }

  function addVariante(productId: string) {
    setItems(prev => prev.map(p => {
      if (p.id !== productId) return p
      const newVariante: VarianteEdit = { color: 'Nuevo', hex: '#CCCCCC', imagen: '' }
      return { ...p, variantes: [...p.variantes, newVariante] }
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
        setResult({ ok: true })
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

  // Colores únicos en todo el catálogo
  const allColors = Array.from(new Set(items.flatMap(p => p.variantes.map(v => v.color)))).sort()

  // Características únicas (tags)
  const allTags = Array.from(new Set(items.flatMap(p => p.tags))).sort()

  // Items filtrados
  const filtered = items.filter(p => {
    if (filterCategoria !== 'todos' && p.categoria !== filterCategoria) return false
    if (filterColor && !p.variantes.some(v => v.color.toLowerCase().includes(filterColor.toLowerCase()))) return false
    if (filterCaracteristica && !p.tags.some(t => t.toLowerCase().includes(filterCaracteristica.toLowerCase()))) return false
    if (filterTexto && !p.nombre.toLowerCase().includes(filterTexto.toLowerCase()) && !p.descripcion.toLowerCase().includes(filterTexto.toLowerCase())) return false
    return true
  })

  const activeFilters = [
    filterCategoria !== 'todos' && filterCategoria,
    filterColor,
    filterCaracteristica,
    filterTexto,
  ].filter(Boolean).length

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-texto">Productos</h1>
          <p className="text-texto-muted text-sm mt-1">
            {filtered.length === items.length
              ? `${items.length} productos en el catálogo`
              : `${filtered.length} de ${items.length} productos`}
          </p>
        </div>
        {hasChanges && (
          <span className="text-xs bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full font-medium flex-shrink-0">
            Sin enviar
          </span>
        )}
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-2xl border border-teal/10 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-texto-muted uppercase tracking-wide">Filtrar productos</p>
          {activeFilters > 0 && (
            <button
              onClick={() => { setFilterCategoria('todos'); setFilterColor(''); setFilterCaracteristica(''); setFilterTexto('') }}
              className="text-xs text-teal hover:text-teal-dark transition-colors"
            >
              Limpiar filtros ({activeFilters})
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Búsqueda por texto */}
          <div>
            <label className="text-xs text-texto-light mb-1 block">Buscar</label>
            <input
              value={filterTexto}
              onChange={e => setFilterTexto(e.target.value)}
              placeholder="Nombre o descripción..."
              className="w-full px-3 py-2 text-sm rounded-xl border border-teal/20 focus:outline-none focus:border-teal bg-fondo text-texto"
            />
          </div>
          {/* Categoría */}
          <div>
            <label className="text-xs text-texto-light mb-1 block">Categoría</label>
            <select
              value={filterCategoria}
              onChange={e => setFilterCategoria(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-teal/20 focus:outline-none focus:border-teal bg-fondo text-texto"
            >
              {categorias.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          {/* Color */}
          <div>
            <label className="text-xs text-texto-light mb-1 block">Color disponible</label>
            <select
              value={filterColor}
              onChange={e => setFilterColor(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-teal/20 focus:outline-none focus:border-teal bg-fondo text-texto"
            >
              <option value="">Todos los colores</option>
              {allColors.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          {/* Característica / tag */}
          <div>
            <label className="text-xs text-texto-light mb-1 block">Característica</label>
            <select
              value={filterCaracteristica}
              onChange={e => setFilterCaracteristica(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-teal/20 focus:outline-none focus:border-teal bg-fondo text-texto"
            >
              <option value="">Todas</option>
              {allTags.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lista de productos */}
      <div className="space-y-3">
        {filtered.map(p => (
          <div key={p.id} className="bg-white rounded-2xl border border-teal/10 overflow-hidden">
            {/* Encabezado del producto */}
            <button
              onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}
              className={`w-full flex items-center gap-4 p-4 transition-colors text-left ${expandedId === p.id ? 'bg-teal/5' : 'hover:bg-fondo'}`}
            >
              {/* Thumbnail de la primera variante con imagen, o iniciales */}
              <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-teal/15 bg-fondo">
                {p.variantes.find(v => v.imagen) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.variantes.find(v => v.imagen)!.imagen}
                    alt={p.nombre}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-teal/10">
                    <span className="text-teal font-bold text-sm">{p.nombre.slice(0, 2).toUpperCase()}</span>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-semibold text-texto text-sm leading-tight">{p.nombre}</p>
                  {expandedId === p.id && (
                    <span className="text-xs bg-teal text-white px-2 py-0.5 rounded-full font-medium">
                      Editando
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-texto-light capitalize">{p.categoria}</span>
                  {/* Dots de colores disponibles */}
                  <div className="flex gap-1">
                    {p.variantes.slice(0, 4).map(v => (
                      <span key={v.color} className="w-2.5 h-2.5 rounded-full border border-white shadow-sm" style={{ background: v.hex }} title={v.color} />
                    ))}
                    {p.variantes.length > 4 && <span className="text-xs text-texto-light">+{p.variantes.length - 4}</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {p.destacado && (
                  <span className="hidden sm:block text-xs bg-teal/10 text-teal px-2 py-0.5 rounded-full">
                    Destacado
                  </span>
                )}
                {p.descuento && (
                  <span className="hidden sm:block text-xs bg-lila/10 text-lila px-2 py-0.5 rounded-full">
                    -{p.descuento}%
                  </span>
                )}
                <svg viewBox="0 0 20 20" fill="currentColor" className={`w-4 h-4 text-texto-light transition-transform ${expandedId === p.id ? 'rotate-180' : ''}`}>
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </div>
            </button>

            {/* Panel de edición */}
            {expandedId === p.id && (
              <div className="border-t-2 border-teal/30 bg-fondo/40">
                {/* Header del editor */}
                <div className="px-5 py-3 bg-teal/5 border-b border-teal/10 flex items-center gap-2">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-teal">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zm-1.207 1.207L2 14.172V17h2.828l10.38-10.379-2.83-2.828z"/>
                  </svg>
                  <p className="text-xs font-semibold text-teal">Editando: <span className="text-texto">{p.nombre}</span></p>
                </div>
              <div className="p-5 space-y-5">
                {/* Nombre, badge y categoría */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-medium text-texto-muted mb-1.5 block">Nombre</label>
                    <input
                      value={p.nombre}
                      onChange={e => updateProduct(p.id, { nombre: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-teal/20 focus:outline-none focus:border-teal bg-white text-texto"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-texto-muted mb-1.5 block">Categoría</label>
                    <select
                      value={p.categoria}
                      onChange={e => updateProduct(p.id, { categoria: e.target.value as Producto['categoria'] })}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-teal/20 focus:outline-none focus:border-teal bg-white text-texto"
                    >
                      {categorias.filter(c => c.value !== 'todos').map(c => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
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

                {/* Variantes / colores */}
                <div>
                  <label className="text-xs font-medium text-texto-muted mb-3 block">
                    Colores y fotos disponibles
                  </label>
                  <div className="space-y-3">
                    {p.variantes.map((v, idx) => (
                      <div key={idx} className="flex gap-3 items-start bg-white rounded-xl p-3 border border-teal/10">
                        {/* Preview imagen */}
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-fondo border border-teal/15 flex items-center justify-center flex-shrink-0">
                          {v.preview || v.imagen ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={v.preview || v.imagen} alt={v.color} className="w-full h-full object-contain" />
                          ) : (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-texto-light">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 19.5h18M3.75 4.5h16.5M5.25 4.5v15M18.75 4.5v15" />
                            </svg>
                          )}
                          {v.uploading && (
                            <div className="absolute inset-0 bg-white/85 flex items-center justify-center">
                              <p className="text-xs text-teal font-medium">...</p>
                            </div>
                          )}
                        </div>

                        {/* Datos del color */}
                        <div className="flex-1 grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-texto-light mb-1 block">Nombre del color</label>
                            <input
                              value={v.color}
                              onChange={e => updateVariante(p.id, idx, { color: e.target.value })}
                              className="w-full px-2 py-1.5 text-xs rounded-lg border border-teal/20 focus:outline-none focus:border-teal bg-fondo text-texto"
                              placeholder="Rosa"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-texto-light mb-1 block">Color (hex)</label>
                            <div className="flex gap-1.5">
                              <input
                                type="color"
                                value={v.hex}
                                onChange={e => updateVariante(p.id, idx, { hex: e.target.value })}
                                className="w-8 h-8 rounded-lg border border-teal/20 cursor-pointer p-0.5 bg-white"
                              />
                              <input
                                value={v.hex}
                                onChange={e => updateVariante(p.id, idx, { hex: e.target.value })}
                                className="flex-1 px-2 py-1.5 text-xs rounded-lg border border-teal/20 focus:outline-none focus:border-teal bg-fondo text-texto font-mono"
                                placeholder="#FFB6C1"
                              />
                            </div>
                          </div>
                          <div className="col-span-2">
                            <label className="cursor-pointer text-xs text-teal hover:text-teal-dark font-medium transition-colors">
                              {v.imagen ? 'Cambiar foto' : 'Subir foto'}
                              <input type="file" accept="image/*" className="hidden" disabled={v.uploading}
                                onChange={e => {
                                  const file = e.target.files?.[0]
                                  if (file) handleImageUpload(file, p.id, idx)
                                  e.target.value = ''
                                }} />
                            </label>
                            {v.imagen && <span className="text-xs text-texto-light ml-2">{v.imagen.split('/').pop()}</span>}
                          </div>
                        </div>

                        {/* Eliminar variante */}
                        <button
                          onClick={() => removeVariante(p.id, idx)}
                          className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors flex-shrink-0 text-xs"
                          title="Eliminar color"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => addVariante(p.id)}
                    className="mt-3 text-xs text-teal hover:text-teal-dark font-medium transition-colors"
                  >
                    + Agregar color
                  </button>
                  <p className="text-xs text-texto-light mt-2">
                    Las fotos se convierten a .webp automáticamente al subirse.
                  </p>
                </div>
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
            {submitting ? 'Enviando...' : 'Enviar para revisión'}
          </button>
        </div>
      )}

      {/* Resultado */}
      {result && (
        <div className={`rounded-2xl p-5 ${result.ok ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          {result.ok ? (
            <>
              <p className="font-semibold text-green-700 text-sm">¡Publicado correctamente!</p>
              <p className="text-green-600 text-xs mt-1">Vercel desplegará los cambios en aproximadamente 30 segundos.</p>
            </>
          ) : (
            <p className="text-red-600 text-sm">{result.error}</p>
          )}
        </div>
      )}
    </div>
  )
}
