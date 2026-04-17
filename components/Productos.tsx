"use client";
import { useState } from "react";
import { Cliente } from "@/config/cliente";
import { productos, categorias, type Categoria, type Producto } from "@/lib/products";

function waLink(p: Producto) {
  const msg = `Hola Daisy! Me interesa el ${p.nombre}. Me podes dar el precio y disponibilidad?`;
  return `${Cliente.whatsapp.link}?text=${encodeURIComponent(msg)}`;
}

function BentoCard({ p, size = "normal" }: { p: Producto; size?: "large" | "normal" | "small" }) {
  const isLarge = size === "large";

  return (
    <a href={waLink(p)} target="_blank" rel="noopener noreferrer"
      className={`bento-card group relative flex flex-col bg-fondo-card border border-teal/15 overflow-hidden rounded-2xl h-full ${isLarge ? "md:flex-row" : ""}`}>

      {/* Teal accent line top */}
      <div className="h-[3px] w-full bg-gradient-to-r from-teal via-aqua to-lila flex-shrink-0" />

      {/* Badges */}
      {p.badge && (
        <span className="absolute top-4 right-4 bg-teal text-white text-xs font-bold px-2.5 py-1 rounded-full z-10 shadow-sm">
          {p.badge}
        </span>
      )}
      {p.descuento && !p.badge && (
        <span className="absolute top-4 right-4 bg-lila text-white text-xs font-bold px-2.5 py-1 rounded-full z-10">
          -{p.descuento}%
        </span>
      )}
      {p.stockBajo && !p.badge && !p.descuento && (
        <span className="absolute top-4 right-4 border border-teal/40 text-teal text-xs font-semibold px-2.5 py-1 rounded-full z-10">
          Últimas unidades
        </span>
      )}

      {/* Image area */}
      <div className={`bg-fondo flex items-center justify-center text-6xl ${isLarge ? "md:w-2/5 min-h-[200px]" : "aspect-square"}`}>
        {p.categoria === "nuit" ? "🖤" : p.categoria === "bazar" ? (p.id === "cafetera" ? "☕" : "🥄") : "🍳"}
      </div>

      {/* Content */}
      <div className={`p-5 flex flex-col gap-3 flex-1 ${isLarge ? "justify-center" : ""}`}>
        <div>
          <p className="text-teal text-xs font-semibold uppercase tracking-widest mb-1">{p.categoria}</p>
          <h3 className={`font-heading text-texto group-hover:text-teal transition-colors ${isLarge ? "text-2xl" : "text-base"}`}>
            {p.nombre}
          </h3>
          {isLarge && <p className="text-texto-muted text-sm mt-2 line-clamp-2">{p.descripcion}</p>}
        </div>

        {/* Color dots */}
        {p.variantes.length > 1 && (
          <div className="flex gap-1.5">
            {p.variantes.map(v => (
              <span key={v.color} title={v.color}
                className="w-3.5 h-3.5 rounded-full border border-white shadow-sm flex-shrink-0"
                style={{ background: v.hex }} />
            ))}
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {p.tags.map(tag => (
            <span key={tag} className="bg-teal/8 border border-teal/20 text-teal-dark text-xs px-2 py-0.5 rounded-full">{tag}</span>
          ))}
        </div>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-teal/10">
          <span className="text-texto-light text-xs">Precio a consultar</span>
          <span className="text-teal text-sm font-semibold group-hover:translate-x-1 transition-transform inline-block">
            Consultar →
          </span>
        </div>
      </div>
    </a>
  );
}

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
          {/* Filter pills */}
          <div className="flex flex-wrap gap-2">
            {categorias.map(c => (
              <button key={c.value} onClick={() => setCat(c.value)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  cat === c.value
                    ? "bg-teal border-teal text-white shadow-sm"
                    : "border-teal/25 text-texto-muted hover:border-teal/50 hover:text-teal"
                }`}>
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bento grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-texto-light">
            <p className="text-lg font-heading text-teal">Próximos productos disponibles.</p>
            <p className="text-sm mt-2">Consultá por WhatsApp para ver disponibilidad.</p>
          </div>
        ) : (
          <div className="grid grid-cols-6 gap-4">
            {filtered.map((p, i) => {
              let colSpan = "col-span-6 sm:col-span-3 md:col-span-2";
              let sz: "large" | "normal" | "small" = "normal";
              if (i === 0) { colSpan = "col-span-6 md:col-span-4"; sz = "large"; }
              else if (i === 1 || i === 2) { colSpan = "col-span-6 sm:col-span-3 md:col-span-2"; }
              return (
                <div key={p.id} className={colSpan}>
                  <BentoCard p={p} size={sz} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
