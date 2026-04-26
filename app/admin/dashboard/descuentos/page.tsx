'use client'
import { useState, useEffect } from 'react'
import { descuentos as initialDescuentos, descuentosConfig as initialConfig, type Descuento } from '@/config/descuentos'
import { writePendingSection, clearPendingSection, DRAFT_KEYS, PUBLISHED_EVENT } from '@/lib/admin-pending'

const STORAGE_KEY = DRAFT_KEYS.descuentos

type Config = {
  visible: boolean
  titulo: string
  subtitulo: string
  vigencia: string
}

export default function DescuentosPage() {
  const [items, setItems] = useState<Descuento[]>(initialDescuentos.map(d => ({ ...d })))
  const [config, setConfig] = useState<Config>({ ...initialConfig })
  const [hasChanges, setHasChanges] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  // Cargar borrador
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed.items) setItems(parsed.items)
        if (parsed.config) setConfig(parsed.config)
        setHasChanges(true)
      } catch {}
    }
  }, [])

  // Auto-guardar borrador + pending global
  useEffect(() => {
    if (!hasChanges) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, config }))
    writePendingSection('descuentos', { descuentos: { descuentos: items, config } })
  }, [items, config, hasChanges])

  // Limpiar al publicar desde el PublishBar global
  useEffect(() => {
    function onPublished() { setHasChanges(false) }
    window.addEventListener(PUBLISHED_EVENT, onPublished)
    return () => window.removeEventListener(PUBLISHED_EVENT, onPublished)
  }, [])

  function updateItem(idx: number, updates: Partial<Descuento>) {
    setItems(prev => prev.map((d, i) => i === idx ? { ...d, ...updates } : d))
    setHasChanges(true)
  }

  function updateConfig(updates: Partial<Config>) {
    setConfig(prev => ({ ...prev, ...updates }))
    setHasChanges(true)
  }

  function removeItem(idx: number) {
    setItems(prev => prev.filter((_, i) => i !== idx))
    setHasChanges(true)
  }

  function addItem() {
    setItems(prev => [...prev, {
      banco: 'Nuevo banco',
      logo: '',
      descuento: '10% OFF',
      detalle: '',
      condicion: 'Todos los días',
      color: '#58A39D',
      activo: true,
    }])
    setHasChanges(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-texto">Descuentos bancarios</h1>
          <p className="text-texto-muted text-sm mt-1">
            Gestioná las promociones y beneficios por banco que se muestran en la web
          </p>
        </div>
        {hasChanges && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => {
                if (!confirm('¿Revertir todos los cambios? Perderás las modificaciones sin publicar.')) return
                clearPendingSection('descuentos')
                setItems(initialDescuentos.map(d => ({ ...d })))
                setConfig({ ...initialConfig })
                setHasChanges(false)
              }}
              className="text-xs text-red-400 hover:text-red-600 hover:bg-red-50 border border-red-200 px-3 py-1.5 rounded-full font-medium transition-colors"
            >
              Revertir cambios
            </button>
            <span className="text-xs bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full font-medium">
              Sin publicar
            </span>
          </div>
        )}
      </div>

      {/* Configuración general */}
      <div className="bg-white rounded-2xl border border-teal/10 p-5 space-y-4">
        <h2 className="font-semibold text-texto text-sm">Configuración general</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-texto-muted mb-1.5 block">Subtítulo de la sección</label>
            <input
              value={config.subtitulo}
              onChange={e => updateConfig({ subtitulo: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-xl border border-teal/20 focus:outline-none focus:border-teal bg-fondo text-texto"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-texto-muted mb-1.5 block">Vigencia</label>
            <input
              value={config.vigencia}
              onChange={e => updateConfig({ vigencia: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-xl border border-teal/20 focus:outline-none focus:border-teal bg-fondo text-texto"
              placeholder="Ej: Abril 2026"
            />
          </div>
        </div>
        <label className="flex items-center gap-3 cursor-pointer">
          <div
            onClick={() => updateConfig({ visible: !config.visible })}
            className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${config.visible ? 'bg-teal' : 'bg-gray-200'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${config.visible ? 'translate-x-5' : 'translate-x-0'}`} />
          </div>
          <span className="text-sm text-texto-muted">
            {config.visible ? 'Sección visible en la web' : 'Sección oculta en la web'}
          </span>
        </label>
      </div>

      {/* Tarjetas */}
      <div className="space-y-3">
        {items.map((d, idx) => (
          <div
            key={idx}
            className={`bg-white rounded-2xl border overflow-hidden transition-opacity ${d.activo ? 'border-teal/10' : 'border-gray-200 opacity-60'}`}
          >
            {/* Encabezado de la tarjeta */}
            <div className="flex items-center gap-3 p-4">
              {/* Preview del color */}
              <div
                className="w-3 h-10 rounded-full flex-shrink-0"
                style={{ background: d.color }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-texto text-sm">{d.banco || 'Sin nombre'}</p>
                <p className="text-texto-muted text-xs truncate">{d.descuento} — {d.condicion}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Toggle activo */}
                <div
                  onClick={() => updateItem(idx, { activo: !d.activo })}
                  className={`relative w-8 h-4 rounded-full transition-colors cursor-pointer ${d.activo ? 'bg-teal' : 'bg-gray-200'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${d.activo ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
                <span className="text-xs text-texto-light">{d.activo ? 'Activo' : 'Oculto'}</span>
              </div>
            </div>

            {/* Campos de edición */}
            <div className="border-t border-teal/10 p-4 bg-fondo/40 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-texto-muted mb-1.5 block">Nombre del banco</label>
                <input
                  value={d.banco}
                  onChange={e => updateItem(idx, { banco: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-teal/20 focus:outline-none focus:border-teal bg-white text-texto"
                  placeholder="Banco Nación"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-texto-muted mb-1.5 block">Beneficio principal</label>
                <input
                  value={d.descuento}
                  onChange={e => updateItem(idx, { descuento: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-teal/20 focus:outline-none focus:border-teal bg-white text-texto"
                  placeholder="20% OFF"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-texto-muted mb-1.5 block">Detalle</label>
                <input
                  value={(d as Descuento & { detalle?: string }).detalle ?? ''}
                  onChange={e => updateItem(idx, { detalle: e.target.value } as Partial<Descuento>)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-teal/20 focus:outline-none focus:border-teal bg-white text-texto"
                  placeholder="Con tarjetas de Crédito y Débito"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-texto-muted mb-1.5 block">Condición (banner inferior de la card)</label>
                <input
                  value={d.condicion}
                  onChange={e => updateItem(idx, { condicion: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-teal/20 focus:outline-none focus:border-teal bg-white text-texto"
                  placeholder="Martes y miércoles · Tope $5.000 de reintegro"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-texto-muted mb-1.5 block">Color del banco</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={d.color}
                    onChange={e => updateItem(idx, { color: e.target.value })}
                    className="w-10 h-10 rounded-xl border border-teal/20 cursor-pointer p-1 bg-white flex-shrink-0"
                  />
                  <input
                    value={d.color}
                    onChange={e => updateItem(idx, { color: e.target.value })}
                    className="flex-1 px-3 py-2 text-sm rounded-xl border border-teal/20 focus:outline-none focus:border-teal bg-white text-texto font-mono"
                    placeholder="#003087"
                  />
                </div>
              </div>
              <div className="sm:col-span-2 flex justify-end">
                <button
                  onClick={() => removeItem(idx)}
                  className="text-xs text-red-400 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Eliminar tarjeta
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Agregar banco */}
      <button
        onClick={addItem}
        className="w-full border-2 border-dashed border-teal/20 hover:border-teal/40 rounded-2xl py-4 text-sm text-texto-muted hover:text-teal transition-colors font-medium"
      >
        + Agregar banco
      </button>
    </div>
  )
}
