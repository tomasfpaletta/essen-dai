'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Cliente } from '@/config/cliente'
import { productos } from '@/lib/products'
import { promocionesItems } from '@/config/promociones'

type Commit = { sha: string; fullSha: string; message: string; date: string }

const SECCIONES = [
  { href: '/panel-dai/dashboard/contenido',          icon: 'M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zm-1.207 1.207L2 14.172V17h2.828l10.38-10.379-2.83-2.828z',           title: 'Contenido de la web',    desc: 'Textos del hero, botones y estilo de letra.', preview: '/' },
  { href: '/panel-dai/dashboard/productos',          icon: 'M4 3a2 2 0 100 4h12a2 2 0 100-4H4zM3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z',        title: 'Catálogo de productos',  desc: 'Agregá, editá y subí fotos de tus productos.', preview: '/#productos' },
  { href: '/panel-dai/dashboard/promociones',        icon: 'M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z', title: 'Promociones',            desc: 'Ofertas de tiempo limitado y beneficios bancarios.', preview: '/#promociones' },
  { href: '/panel-dai/dashboard/cosas-importantes',  icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4', title: 'Cosas importantes',       desc: 'Guías, consejos y recursos para tus clientas.', preview: '/cosas-importantes' },
  { href: '/panel-dai/dashboard/cliente',            icon: 'M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z', title: 'Configuración del sitio', desc: 'WhatsApp, Instagram, slogan y datos del negocio.', preview: '/' },
]

export default function DashboardHome() {
  const nombre = Cliente.nombre.split(' ')[0]
  const destacados   = productos.filter(p => p.destacado).length
  const enOferta     = productos.filter(p => p.descuento).length
  const promoActivas = (promocionesItems ?? []).filter(p => p.activo).length

  const [commits, setCommits]       = useState<Commit[]>([])
  const [rolling, setRolling]       = useState(false)
  const [rollMsg, setRollMsg]       = useState('')
  const [rollError, setRollError]   = useState('')

  useEffect(() => {
    fetch('/api/admin/rollback')
      .then(r => r.json())
      .then(d => { if (d.commits) setCommits(d.commits) })
      .catch(() => {})
  }, [])

  async function handleRollback() {
    if (!confirm('¿Revertir el último cambio publicado? Se restaurarán los archivos de configuración al estado anterior.')) return
    setRolling(true); setRollMsg(''); setRollError('')
    try {
      const res  = await fetch('/api/admin/rollback', { method: 'POST' })
      const data = await res.json()
      if (res.ok) {
        setRollMsg(`✓ ${data.message}`)
        // Refrescar commits
        const r = await fetch('/api/admin/rollback')
        const d = await r.json()
        if (d.commits) setCommits(d.commits)
      } else {
        setRollError(data.error || 'Error al revertir')
      }
    } catch { setRollError('Error de conexión') }
    finally { setRolling(false) }
  }

  function timeAgo(dateStr: string) {
    const diff = (Date.now() - new Date(dateStr).getTime()) / 1000
    if (diff < 60)   return 'hace un momento'
    if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`
    if (diff < 86400) return `hace ${Math.floor(diff / 3600)} h`
    return `hace ${Math.floor(diff / 86400)} días`
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-texto">Hola, {nombre} 👋</h1>
          <p className="text-texto-muted mt-1 text-sm">Los cambios que publicás se ven en la web en menos de 1 minuto.</p>
        </div>
        <a href="/" target="_blank" rel="noopener noreferrer"
          className="flex-shrink-0 inline-flex items-center gap-2 text-xs font-semibold text-teal border border-teal/30 px-4 py-2 rounded-xl hover:bg-teal/5 transition-colors">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/>
          </svg>
          Ver mi web
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Productos',   value: productos.length, color: 'text-teal' },
          { label: 'Destacados',  value: destacados,       color: 'text-teal' },
          { label: 'En oferta',   value: enOferta,         color: 'text-lila' },
          { label: 'Promociones', value: promoActivas,     color: 'text-teal' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 border border-teal/10 text-center">
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-texto-muted text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Secciones */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-texto-muted mb-3">Secciones</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SECCIONES.map(s => (
            <Link key={s.href} href={s.href}
              className="bg-white rounded-2xl p-5 border border-teal/10 hover:border-teal/40 hover:shadow-sm transition-all group flex items-start gap-4">
              <div className="w-9 h-9 bg-teal/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-teal/20 transition-colors">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-teal">
                  <path fillRule="evenodd" d={s.icon} clipRule="evenodd"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-texto group-hover:text-teal transition-colors text-sm">{s.title}</h3>
                <p className="text-texto-muted text-xs mt-0.5 leading-snug">{s.desc}</p>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-texto-light opacity-0 group-hover:opacity-100 transition-opacity">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                </svg>
                <a href={s.preview} target="_blank" rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="text-[10px] text-teal/60 hover:text-teal transition-colors opacity-0 group-hover:opacity-100">
                  previsualizar ↗
                </a>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Historial + Rollback */}
      <div className="bg-white rounded-2xl border border-teal/10 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-texto text-sm">Últimos cambios publicados</h2>
          <button onClick={handleRollback} disabled={rolling || commits.length < 2}
            className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40">
            {rolling
              ? <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83"/></svg>
              : <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
                </svg>
            }
            {rolling ? 'Revirtiendo…' : 'Deshacer último'}
          </button>
        </div>

        {rollMsg && <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-3 py-2 text-xs mb-3">{rollMsg}</div>}
        {rollError && <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-3 py-2 text-xs mb-3">{rollError}</div>}

        <div className="space-y-1">
          {commits.length === 0 && <p className="text-xs text-texto-muted">Cargando historial…</p>}
          {commits.slice(0, 5).map((c, i) => (
            <div key={c.sha} className={`flex items-start gap-3 py-2 ${i < commits.length - 1 ? 'border-b border-gray-50' : ''}`}>
              <span className="font-mono text-[10px] text-texto-light bg-gray-50 px-1.5 py-0.5 rounded mt-0.5 flex-shrink-0">{c.sha}</span>
              <p className="text-xs text-texto flex-1 leading-snug">{c.message}</p>
              <span className="text-[10px] text-texto-light flex-shrink-0">{timeAgo(c.date)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="bg-teal/5 border border-teal/15 rounded-2xl p-4 flex gap-3">
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-teal flex-shrink-0 mt-0.5">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
        </svg>
        <p className="text-sm text-texto-muted leading-relaxed">
          Presioná <strong className="text-teal">"Publicar cambios"</strong> en cada sección para actualizar la web. Si algo sale mal, usá <strong className="text-red-500">"Deshacer último"</strong> para volver al estado anterior.
        </p>
      </div>
    </div>
  )
}
