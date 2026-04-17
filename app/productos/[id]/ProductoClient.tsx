"use client";
import { useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Cliente } from "@/config/cliente";
import { type Producto } from "@/lib/products";

interface Props {
  producto: Producto;
}

export default function ProductoClient({ producto }: Props) {
  const [selectedVariant, setSelectedVariant] = useState(0);
  const variant = producto.variantes[selectedVariant];

  function waLink() {
    const msg = `Hola Daisy! Me interesa el ${producto.nombre}${variant ? ` en color ${variant.color}` : ""}. Me podes dar el precio y disponibilidad?`;
    return `${Cliente.whatsapp.link}?text=${encodeURIComponent(msg)}`;
  }

  const emojiIcon =
    producto.categoria === "bazar"
      ? producto.id === "cafetera" ? "☕" : "🥄"
      : producto.categoria === "nuit"
      ? "🖤"
      : "🍳";

  return (
    <div className="min-h-screen bg-ink">
      {/* Header nav */}
      <div className="pt-24 pb-6 px-6 sm:px-12 lg:px-20 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="max-w-7xl mx-auto">
          <Link href="/#productos" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm">
            <ChevronLeft size={16} />
            Volver al catalogo
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-16">
        <div className="grid lg:grid-cols-2 gap-16">

          {/* LEFT — Product image */}
          <div>
            <div className="rounded-2xl overflow-hidden bg-ink-1 border aspect-square flex items-center justify-center relative"
              style={{ borderColor: "rgba(255,255,255,0.08)" }}>
              {/* Gold top accent */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-gold via-gold/50 to-transparent" />

              {/* Discount badge */}
              {producto.descuento && (
                <div className="absolute top-4 right-4 bg-coral text-white font-bold text-base px-3 py-1.5 rounded-full">
                  -{producto.descuento}%
                </div>
              )}

              {/* Badge */}
              {producto.badge && (
                <div className="absolute top-4 left-4 border border-gold/50 text-gold font-semibold text-sm px-3 py-1 rounded-full">
                  {producto.badge}
                </div>
              )}

              <span className="text-[120px] leading-none select-none">{emojiIcon}</span>
            </div>

            {/* Color selector */}
            {producto.variantes.length > 1 && (
              <div className="mt-6 bg-ink-1 rounded-2xl p-5 border" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                <p className="font-semibold text-white/60 text-sm mb-3">
                  Color: <span className="text-gold font-bold">{variant.color}</span>
                </p>
                <div className="flex gap-3">
                  {producto.variantes.map((v, i) => (
                    <button key={v.color} onClick={() => setSelectedVariant(i)}
                      title={v.color}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        selectedVariant === i ? "border-gold scale-110 shadow-md shadow-gold/30" : "border-transparent"
                      }`}
                      style={{ backgroundColor: v.hex }}>
                      <span className="sr-only">{v.color}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT — Product info */}
          <div className="space-y-6">
            {/* Category */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-white/30">Catalogo</span>
              <span className="text-white/20">/</span>
              <span className="capitalize text-gold font-medium">{producto.categoria}</span>
            </div>

            <div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                {producto.nombre}
              </h1>
              {producto.stockBajo && (
                <span className="inline-block mt-3 border border-amber-400/60 text-amber-400 text-xs font-semibold px-3 py-1 rounded-full">
                  Ultimas unidades disponibles
                </span>
              )}
            </div>

            <p className="text-white/50 text-lg leading-relaxed">{producto.descripcion}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {producto.tags.map(tag => (
                <span key={tag} className="border border-white/15 text-white/50 text-sm px-4 py-1.5 rounded-full">{tag}</span>
              ))}
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Garantia 2 anos" },
                { label: "Envio gratis" },
                { label: "100% original" },
              ].map((f, i) => (
                <div key={i} className="bg-ink-1 rounded-xl p-3 text-center border" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                  <span className="w-1.5 h-1.5 bg-gold rounded-full mx-auto block mb-2" />
                  <p className="text-xs font-semibold text-white/50">{f.label}</p>
                </div>
              ))}
            </div>

            {/* Price callout */}
            <div className="bg-ink-1 rounded-2xl p-6 border" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
              <p className="text-white/30 text-sm mb-1">Precio</p>
              <p className="text-3xl font-extrabold text-gold mb-1">Consultar</p>
              {producto.descuento && (
                <p className="text-coral text-sm font-bold">{producto.descuento}% de descuento aplicado</p>
              )}
              <p className="text-white/20 text-xs mt-2">Hasta 18 cuotas sin interes</p>
            </div>

            {/* CTA */}
            <a href={waLink()} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full bg-mint text-ink font-extrabold py-5 rounded-2xl hover:brightness-110 transition-all text-base shadow-xl shadow-mint/20">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.555 4.122 1.524 5.855L.057 23.215a.75.75 0 00.928.928l5.36-1.467A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.9 0-3.681-.523-5.205-1.432l-.372-.224-3.862 1.057 1.057-3.862-.224-.372A9.944 9.944 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
              Consultar precio por WhatsApp
            </a>
            <p className="text-center text-white/20 text-xs">Respuesta en minutos · Lunes a sabado 9 a 20hs</p>
          </div>
        </div>
      </div>
    </div>
  );
}
