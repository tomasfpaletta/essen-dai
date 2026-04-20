"use client";
import { useState } from "react";
import Image from "next/image";
import { Cliente } from "@/config/cliente";
import { productos, categorias, type Categoria, type Producto, type Variante } from "@/lib/products";

// ── WhatsApp link ─────────────────────────────────────────────────────────────
function waLink(p: Producto, v: Variante) {
  const msg = `Hola! Me interesa la/el ${p.nombre} en color ${v.color}. ¿Me podés dar precio y disponibilidad?`;
  return `${Cliente.whatsapp.link}?text=${encodeURIComponent(msg)}`;
}

// ── Lightbox ──────────────────────────────────────────────────────────────────
function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
      <button className="absolute top-4 right-4 text-white/70 hover:text-white text-3xl leading-none" onClick={onClose}>✕</button>
      <div className="relative w-full max-w-lg max-h-[80vh] aspect-auto rounded-2xl overflow-hidden bg-white flex items-center justify-center" onClick={e => e.stopPropagation()} style={{ height: 'min(80vh, 512px)' }}>
        <Image src={src} alt={alt} fill className="object-contain" />
      </div>
    </div>
  );
}

// ── Hex → rgba helper ─────────────────────────────────────────────────────────
function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ── Card de producto — fiel al estilo Apple ───────────────────────────────────
function ProductoCard({ p }: { p: Producto }) {
  const [varIdx, setVarIdx] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const variante = p.variantes[varIdx];
  const tieneImagen = !!variante.imagen;

  const bgFrom = hexToRgba(variante.hex, 0.15);
  const bgMid  = hexToRgba(variante.hex, 0.28);
  const bgTo   = hexToRgba(variante.hex, 0.45);

  return (
    <>
      {lightbox && tieneImagen && (
        <Lightbox src={variante.imagen} alt={`${p.nombre} — ${variante.color}`} onClose={() => setLightbox(false)} />
      )}

      <div className="rounded-3xl overflow-hidden flex flex-col group hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 border border-black/5 bg-white">

        {/* ── ZONA IMAGEN — gradiente llena todo el ancho sin padding ── */}
        <div
          className={`relative overflow-hidden flex-shrink-0 ${tieneImagen ? "cursor-zoom-in" : ""}`}
          style={{
            background: `radial-gradient(ellipse at 60% 40%, ${bgTo} 0%, ${bgMid} 40%, ${bgFrom} 100%)`,
            paddingBottom: "75%", // aspect 4:3 — imagen ocupa el 75% del ancho
            position: "relative",
          }}
          onClick={() => tieneImagen && setLightbox(true)}
        >
          <div className="absolute inset-0">
            {tieneImagen ? (
              <Image
                src={variante.imagen}
                alt={`${p.nombre} — ${variante.color}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <svg viewBox="0 0 64 64" fill="none" className="w-16 h-16 opacity-30" style={{ color: variante.hex }}>
                  <rect x="8" y="14" width="48" height="36" rx="6" stroke="currentColor" strokeWidth="2.5"/>
                  <circle cx="24" cy="28" r="5" stroke="currentColor" strokeWidth="2.5"/>
                  <path d="M8 44l14-14 10 10 8-10 16 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-xs font-medium opacity-40" style={{ color: variante.hex }}>Foto próximamente</span>
              </div>
            )}
          </div>

          {/* Badge arriba a la derecha */}
          {(p.badge || p.descuento) && (
            <div className="absolute top-3 right-3 z-10">
              {p.badge
                ? <span className="text-white text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: hexToRgba(variante.hex, 0.85), backdropFilter: "blur(6px)" }}>{p.badge}</span>
                : <span className="bg-lila text-white text-xs font-bold px-2.5 py-1 rounded-full">-{p.descuento}%</span>
              }
            </div>
          )}
        </div>

        {/* ── ZONA BLANCA — dots + info + CTAs ── */}
        <div className="flex flex-col flex-1 px-5 pt-4 pb-6 text-center">

          {/* Dots de color — exactamente como Apple */}
          <div className="flex items-center justify-center gap-2 mb-4 min-h-[20px]">
            {p.variantes.map((v, i) => (
              <button
                key={v.color}
                onClick={() => setVarIdx(i)}
                title={v.color}
                className="rounded-full flex-shrink-0 transition-all duration-200"
                style={{
                  width: 12, height: 12,
                  background: v.hex,
                  boxShadow: i === varIdx
                    ? `0 0 0 1.5px white, 0 0 0 3px ${v.hex}`
                    : "none",
                  opacity: i === varIdx ? 1 : 0.35,
                  transform: i === varIdx ? "scale(1.1)" : "scale(1)",
                }}
              />
            ))}
          </div>

          {/* Badge "Nuevo" opcional */}
          {p.ofertaEspecial && (
            <p className="text-xs font-semibold mb-1" style={{ color: variante.hex }}>Oferta especial</p>
          )}

          {/* Nombre del producto — bold y prominente */}
          <h3 className="font-heading text-texto text-xl leading-snug mb-1">{p.nombre}</h3>

          {/* Tagline corta — como Apple usa 1-2 líneas */}
          <p className="text-texto-muted text-sm leading-snug line-clamp-2 mb-5">{p.descripcion}</p>

          {/* CTAs — botón relleno + link texto (exactamente Apple) */}
          <div className="mt-auto flex items-center justify-center gap-4 flex-wrap">
            <a
              href={waLink(p, variante)}
              target="_blank" rel="noopener noreferrer"
              className="font-semibold text-sm px-5 py-2 rounded-full transition-all hover:opacity-90 text-white"
              style={{ background: variante.hex }}
            >
              Consultar
            </a>
            <a
              href="#productos"
              className="text-sm font-medium transition-colors hover:opacity-70"
              style={{ color: variante.hex }}
            >
              Ver detalles &rsaquo;
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Sección principal ─────────────────────────────────────────────────────────
export default function Productos() {
  const [cat, setCat] = useState<Categoria>("todos");
  const filtered = cat === "todos" ? productos : productos.filter(p => p.categoria === cat);

  return (
    <section id="productos" className="py-28 bg-fondo px-6 sm:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <p className="text-teal text-xs font-semibold uppercase tracking-[0.2em] mb-3">Catálogo</p>
            <h2 className="display-hero text-texto leading-none">
              Conocé la<br /><span className="text-teal">familia.</span>
            </h2>
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap gap-2">
            {categorias.map(c => (
              <button
                key={c.value}
                onClick={() => setCat(c.value)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  cat === c.value
                    ? "bg-teal border-teal text-white shadow-sm shadow-teal/25"
                    : "border-teal/25 text-texto-muted hover:border-teal/50 hover:text-teal bg-white"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grilla */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-texto-light">
            <p className="text-lg font-heading text-teal">Próximos productos disponibles.</p>
            <p className="text-sm mt-2">Consultá por WhatsApp para ver disponibilidad.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(p => (
              <ProductoCard key={p.id} p={p} />
            ))}
          </div>
        )}

        {/* Link ver todo */}
        <div className="text-center mt-12">
          <a href={`${Cliente.whatsapp.link}?text=${encodeURIComponent("Hola! Quería ver el catálogo completo de productos Essen.")}`}
            target="_blank" rel="noopener noreferrer"
            className="text-teal text-sm font-semibold hover:text-teal-dark transition-colors">
            Ver catálogo completo por WhatsApp →
          </a>
        </div>
      </div>
    </section>
  );
}
