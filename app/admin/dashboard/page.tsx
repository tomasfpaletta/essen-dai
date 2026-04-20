import Link from 'next/link'
import { Cliente } from '@/config/cliente'
import { productos } from '@/lib/products'
import { promocionesItems } from '@/config/promociones'

export default function DashboardHome() {
  const nombre = Cliente.nombre.split(' ')[0]
  const destacados  = productos.filter(p => p.destacado).length
  const enOferta    = productos.filter(p => p.descuento).length
  const promoActivas = (promocionesItems ?? []).filter(p => p.activo).length

  const SECCIONES = [
    {
      href: '/admin/dashboard/contenido',
      icon: 'M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zm-1.207 1.207L2 14.172V17h2.828l10.38-10.379-2.83-2.828z',
      title: 'Contenido de la web',
      desc: 'Textos del hero, botones y estilo de letra.',
    },
    {
      href: '/admin/dashboard/productos',
      icon: 'M4 3a2 2 0 100 4h12a2 2 0 100-4H4zM3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z',
      title: 'Catálogo de productos',
      desc: 'Agregá, editá y subí fotos de tus productos.',
    },
    {
      href: '/admin/dashboard/promociones',
      icon: 'M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z',
      title: 'Promociones',
      desc: 'Ofertas de tiempo limitado y beneficios bancarios.',
    },
    {
      href: '/admin/dashboard/descuentos',
      icon: 'M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z',
      title: 'Descuentos bancarios',
      desc: 'Gestioná los bancos y cuotas activos.',
    },
    {
      href: '/admin/dashboard/cliente',
      icon: 'M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z',
      title: 'Configuración del sitio',
      desc: 'WhatsApp, Instagram, slogan y datos del negocio.',
    },
  ]

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-texto">Hola, {nombre} 👋</h1>
          <p className="text-texto-muted mt-1 text-sm">
            Desde acá editás tu web. Los cambios se publican al instante.
          </p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 inline-flex items-center gap-2 text-xs font-semibold text-teal border border-teal/30 px-4 py-2 rounded-xl hover:bg-teal/5 transition-colors"
        >
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

      {/* Accesos rápidos */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-texto-muted mb-3">Secciones</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SECCIONES.map(s => (
            <Link
              key={s.href}
              href={s.href}
              className="bg-white rounded-2xl p-5 border border-teal/10 hover:border-teal/40 hover:shadow-sm transition-all group flex items-start gap-4"
            >
              <div className="w-9 h-9 bg-teal/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-teal/20 transition-colors">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-teal">
                  <path fillRule="evenodd" d={s.icon} clipRule="evenodd" />
                </svg>
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-texto group-hover:text-teal transition-colors text-sm">{s.title}</h3>
                <p className="text-texto-muted text-xs mt-0.5 leading-snug">{s.desc}</p>
              </div>
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-texto-light flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
              </svg>
            </Link>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="bg-teal/5 border border-teal/15 rounded-2xl p-5 flex gap-3">
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-teal flex-shrink-0 mt-0.5">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
        </svg>
        <div className="text-sm text-texto-muted leading-relaxed space-y-1">
          <p><strong className="text-texto">¿Cómo funciona?</strong> Entrá a cualquier sección, hacé tus cambios y presioná <strong className="text-teal">"Publicar cambios"</strong>. La web se actualiza sola en menos de 1 minuto.</p>
          <p>Si necesitás ayuda, escribile a Tomas por WhatsApp.</p>
        </div>
      </div>

    </div>
  )
}
