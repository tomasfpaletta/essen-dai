import Link from 'next/link'
import { Cliente } from '@/config/cliente'
import { productos } from '@/lib/products'

export default function DashboardHome() {
  const nombre = Cliente.nombre.split(' ')[0]
  const destacados = productos.filter(p => p.destacado).length
  const enOferta   = productos.filter(p => p.descuento).length

  return (
    <div className="space-y-6">
      {/* Bienvenida */}
      <div>
        <h1 className="text-2xl font-bold text-texto">
          ¡Hola, {nombre}! 👋
        </h1>
        <p className="text-texto-muted mt-1 text-sm">
          Desde acá podés editar tu web y enviar los cambios para revisión.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Productos',  value: productos.length, color: 'text-teal' },
          { label: 'Destacados', value: destacados,        color: 'text-teal' },
          { label: 'En oferta',  value: enOferta,          color: 'text-lila' },
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
          href="/admin/dashboard/cliente"
          className="bg-white rounded-2xl p-5 border border-teal/10 hover:border-teal/30 transition-colors group"
        >
          <div className="text-2xl mb-3">⚙️</div>
          <h3 className="font-semibold text-texto group-hover:text-teal transition-colors text-sm">
            Configuración del sitio
          </h3>
          <p className="text-texto-muted text-xs mt-1">
            Editá tu slogan, número de WhatsApp y redes.
          </p>
        </Link>

        <Link
          href="/admin/dashboard/productos"
          className="bg-white rounded-2xl p-5 border border-teal/10 hover:border-teal/30 transition-colors group"
        >
          <div className="text-2xl mb-3">📦</div>
          <h3 className="font-semibold text-texto group-hover:text-teal transition-colors text-sm">
            Catálogo de productos
          </h3>
          <p className="text-texto-muted text-xs mt-1">
            Editá nombres, descripciones y subí fotos.
          </p>
        </Link>
      </div>

      {/* Info */}
      <div className="bg-teal/5 border border-teal/15 rounded-2xl p-5">
        <p className="text-sm text-texto-muted leading-relaxed">
          💡 <strong className="text-texto">¿Cómo funciona?</strong> Hacé tus cambios en las
          secciones de arriba. Cuando estés lista, presioná{' '}
          <strong className="text-teal">"Enviar para revisión"</strong> y Tomas va a revisar
          y publicar los cambios en la web.
        </p>
      </div>
    </div>
  )
}
