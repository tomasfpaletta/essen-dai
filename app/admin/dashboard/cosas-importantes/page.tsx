'use client'
import { useState, useEffect } from 'react'
import {
  cosasImportantes as initialSecciones,
  cosasImportantesConfig as initialConfig,
  type SeccionImportante,
  type CosaItem,
  type CosasImportantesConfig,
} from '@/config/cosas-importantes'
import { writePendingSection, DRAFT_KEYS, PUBLISHED_EVENT } from '@/lib/admin-pending'

const STORAGE_KEY = DRAFT_KEYS.cosasImportantes

const TIPOS: { id: CosaItem['tipo']; label: string; emoji: string }[] = [
  { id: 'consejo', label: 'Consejo',  emoji: '✅' },
  { id: 'texto',   label: 'Texto',    emoji: '📝' },
  { id: 'video',   label: 'Video',    emoji: '▶️' },
]

function uid() { return `ci-${Date.now()}-${Math.random().toString(36).slice(2,6)}` }

export default function CosasImportantesAdminPage() {
  const [config, setConfig]       = useState<CosasImportantesConfig>({ ...initialConfig })
  const [secciones, setSecciones] = useState<SeccionImportante[]>(initialSecciones.map(s => ({ ...s, items: s.items.map(i => ({ ...i })) })))
  const [hasChanges, setHasChanges] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(secciones[0]?.id ?? null)

  // Restaurar borrador
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const d = JSON.parse(saved)
        if (d.config)    setConfig(d.config)
        if (d.secciones) setSecciones(d.secciones)
        setHasChanges(true)
      } catch {}
    }
  }, [])

  // Auto-guardar
  useEffect(() => {
    if (!hasChanges) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ config, secciones }))
    writePendingSection('cosasImportantes', { cosasImportantes: { config, secciones } })
  }, [config, secciones, hasChanges])

  // Limpiar al publicar
  useEffect(() => {
    function onPublished() { setHasChanges(false) }
    window.addEventListener(PUBLISHED_EVENT, onPublished)
    return () => window.removeEventListener(PUBLISHED_EVENT, onPublished)
  }, [])

  function mark() { setHasChanges(true) }

  // ── Config general ──────────────────────────────────────────────────────────
  function patchConfig(k: keyof CosasImportantesConfig, v: string | boolean) {
    setConfig(prev => ({ ...prev, [k]: v })); mark()
  }

  // ── Secciones ──────────────────────────────────────────────────────────────
  function addSeccion() {
    const s: SeccionImportante = {
      id: uid(), titulo: 'Nueva sección', descripcion: '', emoji: '📌', items: [], activo: true,
    }
    setSecciones(prev => [...prev, s])
    setExpandedId(s.id)
    mark()
  }
  function removeSeccion(id: string) {
    if (!confirm('¿Eliminar esta sección? No se puede deshacer.')) return
    setSecciones(prev => prev.filter(s => s.id !== id))
    mark()
  }
  function patchSeccion(id: string, k: keyof SeccionImportante, v: unknown) {
    setSecciones(prev => prev.map(s => s.id === id ? { ...s, [k]: v } : s)); mark()
  }
  function moveSeccion(id: string, dir: -1 | 1) {
    setSecciones(prev => {
      const idx = prev.findIndex(s => s.id === id)
      const next = idx + dir
      if (next < 0 || next >= prev.length) return prev
      const arr = [...prev];[arr[idx], arr[next]] = [arr[next], arr[idx]]; return arr
    }); mark()
  }

  // ── Items dentro de cada sección ──────────────────────────────────────────
  function addItem(secId: string) {
    const item: CosaItem = { id: uid(), tipo: 'consejo', titulo: '', contenido: '' }
    setSecciones(prev => prev.map(s => s.id === secId ? { ...s, items: [...s.items, item] } : s)); mark()
  }
  function removeItem(secId: string, itemId: string) {
    setSecciones(prev => prev.map(s =>
      s.id === secId ? { ...s, items: s.items.filter(i => i.id !== itemId) } : s
    )); mark()
  }
  function patchItem(secId: string, itemId: string, k: keyof CosaItem, v: unknown) {
    setSecciones(prev => prev.map(s =>
      s.id === secId
        ? { ...s, items: s.items.map(i => i.id === itemId ? { ...i, [k]: v } : i) }
        : s
    )); mark()
  }
  function moveItem(secId: string, itemId: string, dir: -1 | 1) {
    setSecciones(prev => prev.map(s => {
      if (s.id !== secId) return s
      const idx = s.items.findIndex(i => i.id === itemId)
      const next = idx + dir
      if (next < 0 || next >= s.items.length) return s
      const arr = [...s.items];[arr[idx], arr[next]] = [arr[next], arr[idx]]
      return { ...s, items: arr }
    })); mark()
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-texto">Cosas importantes</h1>
          <p className="text-texto-muted text-sm mt-1">Guías, consejos y recursos que Daisy comparte con sus clientas.</p>
        </div>
        {hasChanges && (
          <span className="text-xs bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full font-medium flex-shrink-0">Sin publicar</span>
        )}
      </div>

      {/* Configuración general */}
      <div className="bg-white rounded-2xl border border-teal/10 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-texto text-sm">Configuración general</h2>
          <button
            onClick={() => patchConfig('visible', !config.visible)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${config.visible ? 'bg-teal' : 'bg-gray-200'}`}
          >
            <span className="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform"
              style={{ transform: `translateX(${config.visible ? '24px' : '4px'})` }} />
          </button>
        </div>
        <p className="text-xs text-texto-muted">{config.visible ? 'La sección es visible en el sitio.' : 'La sección está oculta.'}</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-texto mb-1.5">Título de la página</label>
            <input value={config.titulo} onChange={e => patchConfig('titulo', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-teal/20 focus:outline-none focus:border-teal text-sm bg-fondo text-texto" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-texto mb-1.5">Descripción</label>
          <textarea value={config.descripcion} onChange={e => patchConfig('descripcion', e.target.value)} rows={2}
            className="w-full px-3 py-2 rounded-xl border border-teal/20 focus:outline-none focus:border-teal text-sm bg-fondo text-texto resize-none" />
        </div>
      </div>

      {/* Secciones */}
      <div className="space-y-3">
        {secciones.map((sec, sIdx) => (
          <div key={sec.id} className={`bg-white rounded-2xl border overflow-hidden transition-opacity ${sec.activo ? 'border-teal/10' : 'border-gray-200 opacity-60'}`}>
            {/* Cabecera */}
            <div className="flex items-center gap-3 p-4">
              <button onClick={() => setExpandedId(expandedId === sec.id ? null : sec.id)}
                className="flex-1 flex items-center gap-3 text-left min-w-0">
                <span className="text-xl flex-shrink-0">{sec.emoji || '📌'}</span>
                <div className="min-w-0">
                  <p className="font-semibold text-texto text-sm truncate">{sec.titulo || 'Sin título'}</p>
                  <p className="text-texto-muted text-xs">{sec.items.length} elemento{sec.items.length !== 1 ? 's' : ''}</p>
                </div>
              </button>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {/* Toggle activo */}
                <button onClick={() => patchSeccion(sec.id, 'activo', !sec.activo)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${sec.activo ? 'bg-teal' : 'bg-gray-200'}`}>
                  <span className="inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform"
                    style={{ transform: `translateX(${sec.activo ? '18px' : '2px'})` }} />
                </button>
                {/* Mover */}
                <button onClick={() => moveSeccion(sec.id, -1)} disabled={sIdx === 0}
                  className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 text-texto-muted">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15"/></svg>
                </button>
                <button onClick={() => moveSeccion(sec.id, 1)} disabled={sIdx === secciones.length - 1}
                  className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 text-texto-muted">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                </button>
                {/* Eliminar */}
                <button onClick={() => removeSeccion(sec.id)}
                  className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 text-texto-muted transition-colors">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6m4-6v6"/><path d="M9 6V4h6v2"/></svg>
                </button>
              </div>
            </div>

            {/* Panel expandido */}
            {expandedId === sec.id && (
              <div className="border-t border-teal/10 p-5 bg-fondo/30 space-y-5">
                {/* Campos de la sección */}
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-texto mb-1.5">Emoji</label>
                    <input value={sec.emoji ?? ''} onChange={e => patchSeccion(sec.id, 'emoji', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-teal/20 focus:outline-none focus:border-teal text-sm bg-white text-texto text-center text-xl"
                      placeholder="📌" maxLength={2} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-texto mb-1.5">Título de la sección</label>
                    <input value={sec.titulo} onChange={e => patchSeccion(sec.id, 'titulo', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-teal/20 focus:outline-none focus:border-teal text-sm bg-white text-texto" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-texto mb-1.5">Descripción de la sección (opcional)</label>
                  <input value={sec.descripcion ?? ''} onChange={e => patchSeccion(sec.id, 'descripcion', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-teal/20 focus:outline-none focus:border-teal text-sm bg-white text-texto" />
                </div>

                {/* Items */}
                <div>
                  <p className="text-xs font-semibold text-texto-muted uppercase tracking-widest mb-3">Elementos</p>
                  <div className="space-y-3">
                    {sec.items.map((item, iIdx) => (
                      <div key={item.id} className="bg-white rounded-xl border border-teal/10 p-4 space-y-3">
                        <div className="flex items-center justify-between gap-3">
                          {/* Tipo */}
                          <div className="flex gap-1.5 flex-wrap">
                            {TIPOS.map(t => (
                              <button key={t.id} onClick={() => patchItem(sec.id, item.id, 'tipo', t.id)}
                                className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${item.tipo === t.id ? 'bg-teal text-white' : 'bg-gray-100 text-texto-muted hover:bg-teal/10'}`}>
                                {t.emoji} {t.label}
                              </button>
                            ))}
                          </div>
                          <div className="flex gap-0.5 flex-shrink-0">
                            <button onClick={() => moveItem(sec.id, item.id, -1)} disabled={iIdx === 0}
                              className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 text-texto-muted">
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15"/></svg>
                            </button>
                            <button onClick={() => moveItem(sec.id, item.id, 1)} disabled={iIdx === sec.items.length - 1}
                              className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 text-texto-muted">
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                            </button>
                            <button onClick={() => removeItem(sec.id, item.id)}
                              className="p-1 rounded hover:bg-red-50 hover:text-red-500 text-texto-muted ml-0.5">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
                            </button>
                          </div>
                        </div>

                        {/* Título del item (opcional para texto) */}
                        {item.tipo !== 'texto' && (
                          <div>
                            <label className="block text-xs font-medium text-texto-muted mb-1">
                              {item.tipo === 'video' ? 'Título del video (opcional)' : 'Título del consejo (opcional)'}
                            </label>
                            <input value={item.titulo ?? ''} onChange={e => patchItem(sec.id, item.id, 'titulo', e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg border border-teal/15 focus:outline-none focus:border-teal text-sm bg-fondo text-texto" />
                          </div>
                        )}

                        {/* Contenido */}
                        <div>
                          <label className="block text-xs font-medium text-texto-muted mb-1">
                            {item.tipo === 'video' ? 'URL de YouTube' : 'Contenido'}
                          </label>
                          {item.tipo === 'video' ? (
                            <input value={item.contenido} onChange={e => patchItem(sec.id, item.id, 'contenido', e.target.value)}
                              placeholder="https://youtube.com/watch?v=..."
                              className="w-full px-3 py-1.5 rounded-lg border border-teal/15 focus:outline-none focus:border-teal text-sm bg-fondo text-texto" />
                          ) : (
                            <textarea value={item.contenido} onChange={e => patchItem(sec.id, item.id, 'contenido', e.target.value)} rows={2}
                              placeholder={item.tipo === 'consejo' ? 'Describí el consejo...' : 'Escribí el texto...'}
                              className="w-full px-3 py-1.5 rounded-lg border border-teal/15 focus:outline-none focus:border-teal text-sm bg-fondo text-texto resize-y" />
                          )}
                        </div>
                      </div>
                    ))}

                    <button onClick={() => addItem(sec.id)}
                      className="w-full border border-dashed border-teal/25 hover:border-teal/50 rounded-xl py-3 text-sm text-texto-muted hover:text-teal transition-colors font-medium">
                      + Agregar elemento
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Agregar sección */}
      <button onClick={addSeccion}
        className="w-full border-2 border-dashed border-teal/20 hover:border-teal/40 rounded-2xl py-4 text-sm text-texto-muted hover:text-teal transition-colors font-medium">
        + Agregar sección
      </button>
    </div>
  )
}
