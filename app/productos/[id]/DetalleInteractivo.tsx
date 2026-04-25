'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import { type Producto } from '@/lib/products'
import { type ClienteType } from '@/config/cliente'

type Props = {
  producto: Producto
  relacionados: Producto[]
  cliente: ClienteType
}

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <button className="absolute top-5 right-5 text-white/70 hover:text-white text-3xl leading-none z-10" onClick={onClose}>✕</button>
      <div className="max-w-2xl w-full" onClick={e => e.stopPropagation()}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} style={{ width: '100%', height: 'auto', maxHeight: '90vh', objectFit: 'contain', borderRadius: 16, display: 'block' }} />
      </div>
    </div>
  )
}

export default function DetalleInteractivo({ producto: p, relacionados, cliente }: Props) {
  const variantesConFoto = p.variantes.filter(v => !!v.imagen)
  const [varIdx, setVarIdx]     = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const variante = variantesConFoto[varIdx] ?? p.variantes[0]
  const tieneImagen = !!variante.imagen

  const bgFrom = hexToRgba(variante.hex, 0.10)
  const bgTo   = hexToRgba(variante.hex, 0.38)

  function waHref(color: string) {
    const msg = `Hola Daisy! Me interesa ${p.nombre} en color ${color}. ¿Me podés dar precio y disponibilidad?`
    return `${cliente.whatsapp.link}?text=${encodeURIComponent(msg)}`
  }

  const accentBg2    = hexToRgba(variante.hex, 0.13)
  const accentBorder = hexToRgba(variante.hex, 0.22)

  return (
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(160deg, ${hexToRgba(variante.hex, 0.11)} 0%, #f4f7f6 38%, #f4f7f6 100%)`,
      }}
    >
      <Navbar />

      {lightbox && tieneImagen && (
        <Lightbox
          src={variante.imagen}
          alt={`${p.nombre} — ${variante.color}`}
          onClose={() => setLightbox(false)}
        />
      )}

      {/* Franja de color superior (acento del producto) */}
      <div
        className="absolute top-0 left-0 right-0 h-1.5 z-20"
        style={{ background: `linear-gradient(90deg, ${variante.hex}, ${hexToRgba(variante.hex, 0.4)})` }}
      />

      <div className="max-w-6xl mx-auto px-6 pt-28 pb-20">

        {/* Back */}
        <Link
          href="/#productos"
          className="inline-flex items-center gap-1.5 text-xs text-texto-muted hover:text-teal transition-colors mb-10"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
          </svg>
          Volver al catálogo
        </Link>

        {/* ── Layout principal ── */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* ── Columna izquierda: imagen ── */}
          <div className="space-y-3">

            {/* Imagen principal */}
            <div
              className={`relative rounded-3xl overflow-hidden aspect-square w-full ${tieneImagen ? 'cursor-zoom-in' : ''}`}
              style={{ background: `radial-gradient(ellipse at 55% 45%, ${bgTo} 0%, ${bgFrom} 100%)` }}
              onClick={() => tieneImagen && setLightbox(true)}
            >
              {tieneImagen ? (
                <Image
                  src={variante.imagen}
                  alt={`${p.nombre} — ${variante.color}`}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-[1.02]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center gap-3 select-none"
                  style={{ color: variante.hex }}
                >
                  <svg viewBox="0 0 64 64" fill="none" className="w-20 h-20 opacity-20">
                    <rect x="8" y="14" width="48" height="36" rx="6" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="24" cy="28" r="5" stroke="currentColor" strokeWidth="2"/>
                    <path d="M8 44l14-14 10 10 8-10 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-sm font-medium opacity-30">Foto próximamente</span>
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                {p.badge && (
                  <span
                    className="text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm"
                    style={{ background: hexToRgba(variante.hex, 0.90), backdropFilter: 'blur(4px)' }}
                  >
                    {p.badge}
                  </span>
                )}
                {p.descuento && (
                  <span className="bg-lila text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    -{p.descuento}% OFF
                  </span>
                )}
              </div>

              {/* Lupa */}
              {tieneImagen && (
                <div className="absolute bottom-4 right-4 bg-black/30 backdrop-blur-sm text-white rounded-full p-2 opacity-60 hover:opacity-100 transition-opacity">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
                  </svg>
                </div>
              )}
            </div>

            {/* Miniaturas de colores */}
            {variantesConFoto.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {variantesConFoto.map((v, i) => (
                  <button
                    key={v.color}
                    onClick={() => setVarIdx(i)}
                    title={v.color}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      i === varIdx ? 'border-teal shadow-md scale-105' : 'border-transparent hover:border-teal/40'
                    }`}
                    style={{ background: `radial-gradient(ellipse, ${hexToRgba(v.hex, 0.4)}, ${hexToRgba(v.hex, 0.12)})` }}
                  >
                    <Image src={v.imagen} alt={v.color} fill className="object-cover" sizes="64px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Columna derecha: info ── */}
          <div
            className="space-y-6 lg:sticky lg:top-28 rounded-3xl p-6 sm:p-8 border"
            style={{ background: hexToRgba(variante.hex, 0.04), borderColor: accentBorder }}
          >

            {/* Categoría + título */}
            <div>
              <p className="text-xs font-semibold text-teal uppercase tracking-widest mb-2 capitalize">
                {p.categoria}
              </p>
              <h1 className="font-heading text-3xl sm:text-4xl text-texto leading-tight">{p.nombre}</h1>
              <p className="text-texto-muted mt-3 leading-relaxed text-sm sm:text-base">{p.descripcion}</p>
            </div>

            {/* Tags / specs */}
            {p.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {p.tags.map(tag => (
                  <span key={tag} className="text-xs bg-teal/10 text-teal font-medium px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <hr style={{ borderColor: accentBorder }} />

            {/* Selector de color */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-texto-muted mb-3">
                Color: <span className="text-texto normal-case font-bold">{variante.color}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {variantesConFoto.map((v, i) => (
                  <button
                    key={v.color}
                    onClick={() => setVarIdx(i)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all ${
                      i === varIdx
                        ? 'shadow-sm'
                        : 'text-texto-muted hover:text-texto'
                    }`}
                    style={i === varIdx
                      ? { borderColor: variante.hex, background: hexToRgba(variante.hex, 0.10), color: variante.hex }
                      : { borderColor: accentBorder, background: hexToRgba(variante.hex, 0.04) }
                    }
                  >
                    <span className="w-3.5 h-3.5 rounded-full flex-shrink-0 border border-black/10" style={{ background: v.hex }} />
                    {v.color}
                  </button>
                ))}
              </div>
            </div>

            <hr style={{ borderColor: accentBorder }} />

            {/* Trust signals */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { emoji: '🛡️', label: 'Garantía oficial' },
                { emoji: '📦', label: 'Envío a todo el país' },
                { emoji: '✅', label: 'Producto original' },
              ].map(s => (
                <div
                  key={s.label}
                  className="rounded-xl p-3 text-center border"
                  style={{ background: accentBg2, borderColor: accentBorder }}
                >
                  <p className="text-xl mb-1">{s.emoji}</p>
                  <p className="text-[11px] text-texto-muted leading-snug font-medium">{s.label}</p>
                </div>
              ))}
            </div>

            {/* CTA principal */}
            <a
              href={waHref(variante.color)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 w-full text-white font-bold py-4 rounded-2xl transition-colors text-sm"
              style={{ background: '#25D366', boxShadow: '0 8px 24px rgba(37,211,102,0.25)' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#1da955')}
              onMouseLeave={e => (e.currentTarget.style.background = '#25D366')}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Consultar — {variante.color}
            </a>

            <p className="text-center text-xs text-texto-muted">
              ¿Dudas sobre el color o el tamaño?{' '}
              <a href={waHref('el color que prefiera')} target="_blank" rel="noopener noreferrer" className="text-teal hover:underline font-medium">
                Escribile a Daisy →
              </a>
            </p>
          </div>
        </div>

        {/* ── Productos relacionados ── */}
        {relacionados.length > 0 && (
          <div className="mt-24">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-texto-muted mb-1">De la misma línea</p>
              <h2 className="font-heading text-2xl text-texto">También te puede interesar</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {relacionados.map(r => {
                const rv = r.variantes[0]
                const rfrom = hexToRgba(rv.hex, 0.10)
                const rto   = hexToRgba(rv.hex, 0.35)
                const rImg  = r.variantes.find(v => v.imagen)
                return (
                  <Link
                    key={r.id}
                    href={`/productos/${r.id}`}
                    className="group bg-white rounded-2xl overflow-hidden border border-teal/10 hover:border-teal/35 hover:shadow-md transition-all"
                  >
                    {/* Imagen */}
                    <div
                      className="relative aspect-square"
                      style={{ background: `radial-gradient(ellipse at 55% 45%, ${rto} 0%, ${rfrom} 100%)` }}
                    >
                      {rImg ? (
                        <Image
                          src={rImg.imagen}
                          alt={r.nombre}
                          fill
                          className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
                          sizes="(max-width: 640px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center" style={{ color: rv.hex }}>
                          <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10 opacity-20">
                            <rect x="6" y="10" width="36" height="28" rx="4" stroke="currentColor" strokeWidth="2"/>
                            <circle cx="18" cy="22" r="4" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                        </div>
                      )}
                      {/* Dots de colores */}
                      <div className="absolute bottom-2 left-2 flex gap-1">
                        {r.variantes.slice(0, 3).map(v => (
                          <span key={v.color} className="w-2.5 h-2.5 rounded-full border border-white/70 shadow-sm" style={{ background: v.hex }} />
                        ))}
                        {r.variantes.length > 3 && (
                          <span className="text-[9px] text-white bg-black/30 rounded-full px-1 leading-[10px] mt-0.5">+{r.variantes.length - 3}</span>
                        )}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-3">
                      <p className="font-semibold text-texto text-sm leading-tight group-hover:text-teal transition-colors">{r.nombre}</p>
                      <p className="text-texto-muted text-xs mt-0.5 line-clamp-1">{r.descripcion}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
