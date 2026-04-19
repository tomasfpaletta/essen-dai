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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 text-white/70 hover:text-white text-3xl leading-none"
        onClick={onClose}
      >
        ✕
      </button>
      <div
        className="relative w-full max-w-lg aspect-square rounded-2xl overflow-hidden bg-white"
        onClick={e => e.stopPropagation()}
      >
        <Image src={src} alt={alt} fill className="object-contain p-6" />
      </div>
    </div>
  );
}

// ── Placeholder cuando no hay imagen ─────────────────────────────────────────
function ImagenPlaceholder() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-teal/5 to-lila/5">
      <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12 text-teal/20">
        <rect x="4" y="8" width="40" height="32" rx="4" stroke="currentColor" strokeWidth="2"/>
        <circle cx="17" cy="20" r="4" stroke="currentColor" strokeWidth="2"/>
        <path d="M4 36l10-10 8 8 8-10 14 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span className="text-xs text-teal/30 font-medium">Sin foto</span>
    </div>
  );
}

// ── Card de producto ──────────────────────────────────────────────────────────
function ProductoCard({ p }: { p: Producto }) {
  const [varIdx, setVarIdx] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const variante = p.variantes[varIdx];
  const tieneImagen = !!variante.imagen;

  return (
    <>
      {lightbox && tieneImagen && (
        <Lightbox
          src={variante.imagen}
          alt={`${p.nombre} — ${variante.color}`}
          onClose={() => setLightbox(false)}
        />
      )}

      <div className="bg-white rounded-2xl border border-teal/15 overflow-hidden flex flex-col group hover:shadow-xl hover:shadow-teal/10 hover:-translate-y-0.5 transition-all duration-300">

        {/* Imagen */}
        <div
          className={`relative w-full bg-white ${tieneImagen ? "cursor-zoom-in" : ""}`}
          style={{ paddingBottom: "100%" }}
          onClick={() => tieneImagen && setLightbox(true)}
        >
          {/* Badge */}
          {p.badge && (
            <span className="absolute top-3 right-3 bg-teal text-white text-xs font-bold px-2.5 py-1 rounded-full z-10 shadow-sm">
              {p.badge}
            </span>
          )}
          {!p.badge && p.descuento && (
            <span className="absolute top-3 right-3 bg-lila text-white text-xs font-bold px-2.5 py-1 rounded-full z-10">
              -{p.descuento}%
            </span>
          )}
          {!p.badge && !p.descuento && p.stockBajo && (
            <span className="absolute top-3 right-3 border border-teal/40 text-teal text-xs font-semibold px-2.5 py-1 rounded-full z-10 bg-white">
              Últimas unidades
            </span>
          )}

          <div className="absolute inset-0">
            {tieneImagen ? (
              <Image
                src={variante.imagen}
                alt={`${p.nombre} — ${variante.color}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <ImagenPlaceholder />
            )}
          </div>
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col gap-3 flex-1">
          {/* Categoría + nombre */}
          <div>
            <p className="text-teal text-xs font-semibold uppercase tracking-widest mb-1">{p.categoria}</p>
            <h3 className="font-heading text-texto text-lg leading-tight">{p.nombre}</h3>
            <p className="text-texto-muted text-xs mt-1 line-clamp-2">{p.descripcion}</p>
          </div>

          {/* Selector de color */}
          {p.variantes.length > 1 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-texto-light">Color:</span>
              {p.variantes.map((v, i) => (
                <button
                  key={v.color}
                  onClick={() => setVarIdx(i)}
                  title={v.color}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${
                    i === varIdx
                      ? "border-texto scale-110 shadow-sm"
                      : "border-white hover:scale-105"
                  }`}
                  style={{ background: v.hex }}
                />
              ))}
              <span className="text-xs text-texto-muted ml-1">{variante.color}</span>
            </div>
          )}

          {/* Tags */}
          {p.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {p.tags.map(tag => (
                <span
                  key={tag}
                  className="bg-teal/8 border border-teal/20 text-teal-dark text-xs px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="mt-auto pt-3 border-t border-teal/10 flex items-center justify-between">
            <span className="text-texto-light text-xs">Precio a consultar</span>
            <a
              href={waLink(p, variante)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-teal hover:bg-teal-dark text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors"
            >
              Consultar →
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
    <section id="productos" className="py-24 bg-white px-6 sm:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-teal text-xs font-semibold uppercase tracking-[0.2em] mb-3">Catálogo</p>
            <h2 className="display-hero text-texto leading-none">
              Nuestros<br /><span className="text-teal">favoritos.</span>
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
                    ? "bg-teal border-teal text-white shadow-sm"
                    : "border-teal/25 text-texto-muted hover:border-teal/50 hover:text-teal"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grilla uniforme */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-texto-light">
            <p className="text-lg font-heading text-teal">Próximos productos disponibles.</p>
            <p className="text-sm mt-2">Consultá por WhatsApp para ver disponibilidad.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(p => (
              <ProductoCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
