'use client'
import { useState } from 'react'
import { useWishlist } from '@/lib/wishlist-context'
import { Cliente } from '@/config/cliente'

export default function ListaInteres() {
  const { items, remove, clear } = useWishlist()
  const [open, setOpen] = useState(false)

  if (items.length === 0) return null

  function buildWaMessage() {
    const lineas = items.map(i =>
      `• ${i.producto.nombre}${i.variante.color ? ` (${i.variante.color})` : ''}`
    ).join('\n')
    return encodeURIComponent(
      `Hola Daisy! Me interesan estos productos Essen:\n${lineas}\n\n¿Me podés dar precios y disponibilidad?`
    )
  }

  return (
    <>
      {/* ── Botón flotante ── */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-[5.5rem] right-5 z-40 flex items-center gap-2 bg-teal text-white font-bold px-4 py-3 rounded-2xl shadow-lg shadow-teal/30 hover:bg-teal-dark transition-colors text-sm"
        style={{ backdropFilter: 'blur(8px)' }}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
        </svg>
        Mi lista
        <span className="ml-0.5 bg-white text-teal text-xs font-black w-5 h-5 rounded-full flex items-center justify-center leading-none">
          {items.length}
        </span>
      </button>

      {/* ── Panel deslizante ── */}
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />

          {/* Panel */}
          <div className="relative w-full max-w-sm bg-white h-full flex flex-col shadow-2xl">

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-teal/10">
              <div>
                <h2 className="font-heading text-texto text-lg leading-none">Mi lista de interés</h2>
                <p className="text-texto-muted text-xs mt-0.5">{items.length} producto{items.length !== 1 ? 's' : ''}</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-texto-muted hover:text-texto transition-colors p-1">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </button>
            </div>

            {/* Lista */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {items.map(({ producto: p, variante: v }) => (
                <div key={p.id} className="flex items-center gap-3 bg-fondo rounded-2xl p-3">
                  {/* Color swatch */}
                  <div
                    className="w-10 h-10 rounded-xl flex-shrink-0 border border-white/60 shadow-sm overflow-hidden"
                    style={{ background: v.imagen
                      ? undefined
                      : `radial-gradient(circle, ${v.hex}60, ${v.hex}20)` }}
                  >
                    {v.imagen && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={v.imagen} alt={v.color} className="w-full h-full object-cover" />
                    )}
                    {!v.imagen && (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="w-4 h-4 rounded-full border border-white/50" style={{ background: v.hex }} />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-texto text-sm leading-tight truncate">{p.nombre}</p>
                    {v.color && <p className="text-texto-muted text-xs mt-0.5">{v.color}</p>}
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => remove(p.id)}
                    className="p-1.5 rounded-lg text-texto-muted hover:text-red-400 hover:bg-red-50 transition-colors flex-shrink-0"
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-teal/10 space-y-3">
              <a
                href={`${Cliente.whatsapp.link}?text=${buildWaMessage()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 w-full text-white font-bold py-3.5 rounded-2xl transition-colors text-sm"
                style={{ background: '#25D366', boxShadow: '0 6px 20px rgba(37,211,102,0.25)' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#1da955')}
                onMouseLeave={e => (e.currentTarget.style.background = '#25D366')}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Consultar lista por WhatsApp
              </a>
              <button
                onClick={() => { clear(); setOpen(false) }}
                className="w-full text-xs text-texto-muted hover:text-red-400 transition-colors py-1"
              >
                Limpiar lista
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
