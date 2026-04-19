import Link from 'next/link'
import { Cliente } from '@/config/cliente'
import { productos } from '@/lib/products'
import { descuentos } from '@/config/descuentos'

export default function DashboardHome() {
  const nombre = Cliente.nombre.split(' ')[0]
  const destacados = productos.filter(p => p.destacado).length
  const enOferta   = productos.filter(p => p.descuento).length
  const descActivos = descuentos.filter(d => d.activo).length

  return (
    <div className="space-y-6">
      {/* Bienvenida */}
      <div>
        <h1 className="text-2xl font-bold text-texto">
          Hola, {nombre}
        </h1>
        <p className="text-texto-muted mt-1 text-sm">
          Desde acá podés editar tu web y enviar los cambios para revisión.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Productos',   value: productos.length, color: 'text-teal'     },
          { label: 'Destacados',  value: destacados,        color: 'text-teal'     },
          { label: 'En oferta',   value: enOferta,          color: 'text-lila'     },
          { label: 'Descuentos',  value: descActivos,       color: 'text-teal'     },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 border border-teal/10 text-center">
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-texto-muted text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Accesos rápidos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/admin/dashboard/contenido"
          className="bg-white rounded-2xl p-5 border border-teal/10 hover:border-teal/30 transition-colors group"
        >
          <div className="w-9 h-9 bg-teal/10 rounded-xl flex items-center justify-center mb-3">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-teal">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zm-1.207 1.207L2 14.172V17h2.828l10.38-10.379-2.83-2.828z" />
            </svg>
          </div>
          <h3 className="font-semibold text-texto group-hover:text-teal transition-colors text-sm">
            Contenido de la web
          </h3>
          <p className="text-texto-muted text-xs mt-1">
            Editá los textos de la portada y secciones.
          </p>
        </Link>

        <Link
          href="/admin/dashboard/productos"
          className="bg-white rounded-2xl p-5 border border-teal/10 hover:border-teal/30 transition-colors group"
        >
          <div className="w-9 h-9 bg-teal/10 rounded-xl flex items-center justify-center mb-3">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-teal">
              <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"/>
              <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd"/>
            </svg>
          </div>
          <h3 className="font-semibold text-texto group-hover:text-teal transition-colors text-sm">
            Catálogo de productos
          </h3>
          <p className="text-texto-muted text-xs mt-1">
            Editá nombres, descripciones y subí fotos.
          </p>
        </Link>

        <Link
          href="/admin/dashboard/descuentos"
          className="bg-white rounded-2xl p-5 border border-teal/10 hover:border-teal/30 transition-colors group"
        >
          <div className="w-9 h-9 bg-teal/10 rounded-xl flex items-center justify-center mb-3">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-teal">
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"/>
              <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd"/>
            </svg>
          </div>
          <h3 className="font-semibold text-texto group-hover:text-teal transition-colors text-sm">
            Descuentos bancarios
          </h3>
          <p className="text-texto-muted text-xs mt-1">
            Actualizá las promociones vigentes por banco.
          </p>
        </Link>

        <Link
          href="/admin/dashboard/cliente"
          className="bg-white rounded-2xl p-5 border border-teal/10 hover:border-teal/30 transition-colors group"
        >
          <div className="w-9 h-9 bg-teal/10 rounded-xl flex items-center justify-center mb-3">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-teal">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
            </svg>
          </div>
          <h3 className="font-semibold text-texto group-hover:text-teal transition-colors text-sm">
            Configuración del sitio
          </h3>
          <p className="text-texto-muted text-xs mt-1">
            Editá tu slogan, WhatsApp y redes sociales.
          </p>
        </Link>
      </div>

      {/* Info */}
      <div className="bg-teal/5 border border-teal/15 rounded-2xl p-5 flex gap-4">
        <div className="flex-shrink-0 mt-0.5">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-teal">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
          </svg>
        </div>
        <p className="text-sm text-texto-muted leading-relaxed">
          <strong className="text-texto">¿Cómo funciona?</strong>{' '}
          Hacé tus cambios en cualquiera de las secciones. Cuando estés lista,
          presioná <strong className="text-teal">"Enviar para revisión"</strong> y Tomas
          va a revisar y publicar los cambios en la web.
        </p>
      </div>
    </div>
  )
}
