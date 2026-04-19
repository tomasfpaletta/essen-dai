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
      <div className="relative w-full max-w-lg aspect-square rounded-2xl overflow-hidden bg-white" onClick={e => e.stopPropagation()}>
        <Image src={src} alt={alt} fill className="object-contain p-6" />
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

// ── Card de producto — estilo Apple ───────────────────────────────────────────
function ProductoCard({ p }: { p: Producto }) {
  const [varIdx, setVarIdx] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const variante = p.variantes[varIdx];
  const tieneImagen = !!variante.imagen;

  // Fondo degradé derivado del color de la variante
  const bgFrom = hexToRgba(variante.hex, 0.18);
  const bgTo   = hexToRgba(variante.hex, 0.38);

  return (
    <>
      {lightbox && tieneImagen && (
        <Lightbox src={variante.imagen} alt={`${p.nombre} — ${variante.color}`} onClose={() => setLightbox(false)} />
      )}

      <div className="bg-white rounded-3xl overflow-hidden flex flex-col group hover:shadow-2xl hover:-translate-y-1 transition-all duration-400 border border-black/5">

        {/* ── Imagen sobre fondo degradé del color ── */}
        <div
          className={`relative aspect-square overflow-hidden ${tieneImagen ? "cursor-zoom-in" : ""}`}
          style={{ background: `linear-gradient(145deg, ${bgFrom} 0%, ${bgTo} 100%)` }}
          onClick={() => tieneImagen && setLightbox(true)}
        >
          {/* Badge */}
          {p.badge && (
            <span className="absolute top-4 left-4 text-white text-xs font-bold px-3 py-1 rounded-full z-10"
              style={{ background: hexToRgba(variante.hex, 0.8), backdropFilter: "blur(8px)" }}>
              {p.badge}
            </span>
          )}
          {!p.badge && p.descuento && (
            <span className="absolute top-4 left-4 bg-lila text-white text-xs font-bold px-3 py-1 rounded-full z-10">
              -{p.descuento}%
            </span>
          )}

          {tieneImagen ? (
            <Image
              src={variante.imagen}
              alt={`${p.nombre} — ${variante.color}`}
              fill
              className="object-contain p-8 transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            // Placeholder elegante cuando no hay foto
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
                style={{ background: hexToRgba(variante.hex, 0.2) }}>
                <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" style={{ color: variante.hex }}>
                  <rect x="6" y="10" width="36" height="28" rx="4" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="18" cy="22" r="4" stroke="currentColor" strokeWidth="2"/>
                  <path d="M6 34l10-10 8 8 6-8 12 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-xs font-medium" style={{ color: hexToRgba(variante.hex, 0.6) }}>Foto próximamente</span>
            </div>
          )}
        </div>

        {/* ── Dots de color — estilo Apple ── */}
        {p.variantes.length > 1 && (
          <div className="flex items-center justify-center gap-2.5 pt-4 pb-1">
            {p.variantes.map((v, i) => (
              <button
                key={v.color}
                onClick={() => setVarIdx(i)}
                title={v.color}
                className="rounded-full transition-all duration-200 flex-shrink-0"
                style={{
                  width: i === varIdx ? 12 : 10,
                  height: i === varIdx ? 12 : 10,
                  background: v.hex,
                  boxShadow: i === varIdx ? `0 0 0 2px white, 0 0 0 3.5px ${v.hex}` : "none",
                  opacity: i === varIdx ? 1 : 0.45,
                }}
              />
            ))}
          </div>
        )}
        {p.variantes.length === 1 && <div className="pt-4" />}

        {/* ── Texto centrado — estilo Apple ── */}
        <div className="px-6 pb-7 text-center flex flex-col flex-1">
          {/* Categoría */}
          <p className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: variante.hex }}>
            {p.categoria}
          </p>

          {/* Nombre */}
          <h3 className="font-heading text-texto text-xl leading-tight mb-2">{p.nombre}</h3>

          {/* Descripción */}
          <p className="text-texto-muted text-sm leading-relaxed line-clamp-2 mb-4">{p.descripcion}</p>

          {/* Tags */}
          {p.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 justify-center mb-4">
              {p.tags.map(tag => (
                <span key={tag} className="text-xs px-2.5 py-0.5 rounded-full border"
                  style={{ color: variante.hex, borderColor: hexToRgba(variante.hex, 0.3), background: hexToRgba(variante.hex, 0.06) }}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="mt-auto flex items-center justify-center gap-4">
            <a
              href={waLink(p, variante)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white font-bold text-sm px-6 py-2.5 rounded-full transition-all hover:scale-105"
              style={{ background: variante.hex, boxShadow: `0 4px 14px ${hexToRgba(variante.hex, 0.35)}` }}
            >
              Consultar precio →
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
