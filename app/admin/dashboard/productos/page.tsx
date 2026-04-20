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
  const [expandedId, setExpandedId]   = useState<string | null>(null)
  const [modifiedIds, setModifiedIds] = useState<string[]>([])
  const [hasChanges, setHasChanges]   = useState(false)
  const [submitting, setSubmitting]   = useState(false)
  const [status, setStatus]           = useState<'idle' | 'ok' | 'error'>('idle')
  const [errorMsg, setErrorMsg]       = useState('')

  // Filtros
  const [filterCategoria, setFilterCategoria]         = useState<string>('todos')
  const [filterColor, setFilterColor]                 = useState<string>('')
  const [filterCaracteristica, setFilterCaracteristica] = useState<string>('')
  const [filterTexto, setFilterTexto]                 = useState<string>('')

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

  function markModified(id: string) {
    setModifiedIds(prev => prev.includes(id) ? prev : [...prev, id])
  }

  function updateProduct(id: string, updates: Partial<ProductoEdit>) {
    setItems(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p))
    setHasChanges(true)
    markModified(id)
    setStatus('idle')
  }

  function updateVariante(productId: string, idx: number, updates: Partial<VarianteEdit>) {
    setItems(prev => prev.map(p => {
      if (p.id !== productId) return p
      const variantes = [...p.variantes]
      variantes[idx] = { ...variantes[idx], ...updates }
      return { ...p, variantes }
    }))
    setHasChanges(true)
    markModified(productId)
  }

  function removeVariante(productId: string, idx: number) {
    setItems(prev => prev.map(p => {
      if (p.id !== productId) return p
      const variantes = p.variantes.filter((_, i) => i !== idx)
      return { ...p, variantes }
    }))
    setHasChanges(true)
    markModified(productId)
  }

  function addVariante(productId: string) {
    setItems(prev => prev.map(p => {
      if (p.id !== productId) return p
      const [defaultColor, defaultHex] = Object.entries(HEX)[0]
      const newVariante: VarianteEdit = { color: defaultColor, hex: defaultHex, imagen: '' }
      return { ...p, variantes: [...p.variantes, newVariante] }
    }))
    setHasChanges(true)
    markModified(productId)
  }

  async function handleImageUpload(file: File, productId: string, varIdx: number) {
    const product  = items.find(p => p.id === productId)
    if (!product) return
    const variante = product.variantes[varIdx]
    const filename = `${productId}-${variante.color.toLowerCase().replace(/\s+/g, '-')}`

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

  function addProduct() {
    const id = `producto-${Date.now()}`
    const newProducto: ProductoEdit = {
      id,
      nombre: 'Nuevo producto',
      descripcion: 'Descripción del producto.',
      categoria: categorias.find(c => c.value !== 'todos')?.value as ProductoEdit['categoria'] ?? 'contemporanea',
      tags: [],
      variantes: [{ color: 'Negro', hex: '#1C1C1E', imagen: '' }],
      destacado: false,
      ofertaEspecial: false,
    }
    setItems(prev => [newProducto, ...prev])
    setExpandedId(id)
    markModified(id)
    setHasChanges(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function removeProduct(id: string) {
    if (!confirm('¿Eliminar este producto?')) return
    setItems(prev => prev.filter(p => p.id !== id))
    setModifiedIds(prev => prev.filter(mid => mid !== id))
    if (expandedId === id) setExpandedId(null)
    setHasChanges(true)
  }

  async function handlePublish() {
    setSubmitting(true)
    setStatus('idle')
    try {
      const res = await fetch('/api/admin/submit-pr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productos: cleanForStorage(items),
          hex: HEX,
          categorias,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus('ok')
        setModifiedIds([])
        localStorage.removeItem(STORAGE_KEY)
        setHasChanges(false)
      } else {
        setStatus('error')
        setErrorMsg(data.error || 'Error desconocido')
      }
    } catch {
      setStatus('error')
      setErrorMsg('Error de conexión. Intentá de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  // Colores únicos en todo el catálogo
  const allColors = Array.from(new Set(items.flatMap(p => p.variantes.map(v => v.color)))).sort()
  const allTags   = Array.from(new Set(items.flatMap(p => p.tags))).sort()

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

  const activeProduct = expandedId ? items.find(p => p.id === expandedId) : null

  return (
    // pb-20 deja espacio para la barra fija inferior cuando hay un producto abierto
    <div className={`space-y-5 ${activeProduct ? 'pb-20' : ''}`}>

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
        <div className="flex items-center gap-2 flex-shrink-0">
          {hasChanges && (
            <span className="text-xs bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full font-medium">
              Sin publicar
            </span>
          )}
          <button
            onClick={addProduct}
            className="flex items-center gap-1.5 bg-white border border-teal/30 text-teal font-semibold px-4 py-2.5 rounded-xl text-sm hover:bg-teal/5 transition-colors"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
            </svg>
            Nuevo producto
          </button>
          <button
            onClick={handlePublish}
            disabled={submitting || !hasChanges}
            className="flex items-center gap-2 bg-teal text-white font-semibold px-4 py-2.5 rounded-xl text-sm hover:bg-teal-dark transition-colors disabled:opacity-40"
          >
            {submitting
              ? <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83"/></svg>
              : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M5 12l5 5L20 7"/></svg>
            }
            {submitting ? 'Publicando…' : 'Publicar'}
          </button>
        </div>
      </div>

      {status === 'ok' && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 flex-shrink-0"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
          ¡Publicado! La web se actualiza en aproximadamente 30 segundos.
        </div>
      )}
      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{errorMsg}</div>
      )}

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
          <div>
            <label className="text-xs text-texto-light mb-1 block">Buscar</label>
            <input
              value={filterTexto}
              onChange={e => setFilterTexto(e.target.value)}
              placeholder="Nombre o descripción..."
              className="w-full px-3 py-2 text-sm rounded-xl border border-teal/20 focus:outline-none focus:border-teal bg-fondo text-texto"
            />
          </div>
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
        {filtered.map(p => {
          const isExpanded = expandedId === p.id
          const isModified = modifiedIds.includes(p.id) && !isExpanded

          return (
            <div
              key={p.id}
              className={`bg-white rounded-2xl overflow-hidden transition-all ${
                isExpanded
                  ? 'border-2 border-teal/40 shadow-md'
                  : isModified
                    ? 'border border-amber-300/60'
                    : 'border border-teal/10'
              }`}
            >
              {/* Encabezado del producto */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : p.id)}
                className={`w-full flex items-center gap-4 p-4 transition-colors text-left ${isExpanded ? 'bg-teal/5' : isModified ? 'bg-amber-50/50 hover:bg-amber-50' : 'hover:bg-fondo'}`}
              >
                {/* Thumbnail */}
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
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <p className="font-semibold text-texto text-sm leading-tight">{p.nombre}</p>
                    {isExpanded && (
                      <span className="text-xs bg-teal text-white px-2 py-0.5 rounded-full font-medium">
                        Editando
                      </span>
                    )}
                    {isModified && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-2.5 h-2.5">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zm-1.207 1.207L2 14.172V17h2.828l10.38-10.379-2.83-2.828z"/>
                        </svg>
                        Modificado
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-texto-light capitalize">{p.categoria}</span>
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
                  <svg viewBox="0 0 20 20" fill="currentColor" className={`w-4 h-4 text-texto-light transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </div>
              </button>

              {/* Panel de edición */}
              {isExpanded && (
                <div className="border-t-2 border-teal/30 bg-fondo/40">
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
                        { key: 'destacado',     label: 'Destacado'       },
                        { key: 'stockBajo',     label: 'Stock bajo'      },
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

                    {/* Variantes */}
                    <div>
                      <label className="text-xs font-medium text-texto-muted mb-3 block">
                        Colores y fotos disponibles
                      </label>
                      <div className="space-y-3">
                        {p.variantes.map((v, idx) => (
                          <div key={idx} className="flex gap-3 items-start bg-white rounded-xl p-3 border border-teal/10">
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

                            <div className="flex-1 grid grid-cols-1 gap-2">
                              <div>
                                <label className="text-xs text-texto-light mb-2 block">Color</label>
                                <div className="flex flex-wrap gap-2">
                                  {Object.entries(HEX).map(([name, hex]) => (
                                    <button
                                      key={name}
                                      type="button"
                                      title={name}
                                      onClick={() => updateVariante(p.id, idx, { color: name, hex })}
                                      className="flex flex-col items-center gap-1 px-1.5 py-1.5 rounded-xl border-2 transition-all"
                                      style={{
                                        borderColor: v.color === name ? hex : 'transparent',
                                        background: v.color === name ? `${hex}18` : 'transparent',
                                      }}
                                    >
                                      <span
                                        className="w-6 h-6 rounded-full block border border-black/10 shadow-sm"
                                        style={{ background: hex }}
                                      />
                                      <span className="text-[10px] text-texto-light leading-none whitespace-nowrap">{name}</span>
                                    </button>
                                  ))}
                                </div>
                                <p className="text-[10px] text-texto-light mt-1.5 font-mono">
                                  {v.color} · {v.hex}
                                </p>
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
          )
        })}
      </div>

      {/* ── Barra fija inferior — aparece cuando hay un producto abierto ── */}
      {activeProduct && (
        <div
          className="fixed bottom-0 left-0 right-0 lg:left-60 z-40 flex items-center justify-between gap-3 px-5 py-3 border-t border-teal/15 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]"
          style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)' }}
        >
          {/* Producto activo */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg overflow-hidden flex-shrink-0 border border-teal/20 bg-fondo">
              {activeProduct.variantes.find(v => v.imagen) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={activeProduct.variantes.find(v => v.imagen)!.imagen}
                  alt={activeProduct.nombre}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-teal/10">
                  <span className="text-teal font-bold text-[9px]">{activeProduct.nombre.slice(0, 2).toUpperCase()}</span>
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs text-texto-muted leading-none mb-0.5">Editando</p>
              <p className="text-sm font-semibold text-texto leading-none truncate">{activeProduct.nombre}</p>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => removeProduct(activeProduct.id)}
              className="flex items-center gap-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 text-xs font-semibold px-3 py-2 rounded-xl transition-colors border border-red-200/60"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              <span className="hidden sm:inline">Eliminar producto</span>
              <span className="sm:hidden">Eliminar</span>
            </button>
            <button
              onClick={handlePublish}
              disabled={submitting || !hasChanges}
              className="flex items-center gap-1.5 bg-teal text-white font-semibold px-4 py-2 rounded-xl text-xs hover:bg-teal-dark transition-colors disabled:opacity-40"
            >
              {submitting
                ? <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83"/></svg>
                : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><path d="M5 12l5 5L20 7"/></svg>
              }
              {submitting ? 'Publicando…' : 'Publicar cambios'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
