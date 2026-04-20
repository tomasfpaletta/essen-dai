"use client";
import { useState } from "react";
import Link from "next/link";
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 text-white/70 hover:text-white text-3xl leading-none z-10"
        onClick={onClose}
      >
        ✕
      </button>
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden bg-white shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} style={{ width: "100%", height: "auto", maxHeight: "85vh", objectFit: "contain", display: "block" }} />
      </div>
    </div>
  );
}

// ── Hex → rgba ────────────────────────────────────────────────────────────────
function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ── Card de producto ──────────────────────────────────────────────────────────
function ProductoCard({ p }: { p: Producto }) {
  // Solo mostrar variantes que tienen foto cargada
  const variantesConFoto = p.variantes.filter(v => !!v.imagen);
  const [varIdx, setVarIdx] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const variante = variantesConFoto[varIdx] ?? p.variantes[0];
  const tieneImagen = !!variante.imagen;

  const bgFrom = hexToRgba(variante.hex, 0.10);
  const bgTo   = hexToRgba(variante.hex, 0.38);

  return (
    <>
      {lightbox && tieneImagen && (
        <Lightbox
          src={variante.imagen}
          alt={`${p.nombre} — ${variante.color}`}
          onClose={() => setLightbox(false)}
        />
      )}

      <div className="rounded-2xl overflow-hidden flex flex-col group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-black/6 bg-white">

        {/* ── IMAGEN — cuadrada 1:1, object-cover normaliza cualquier tamaño ── */}
        <div
          className={`relative overflow-hidden ${tieneImagen ? "cursor-zoom-in" : ""}`}
          style={{
            background: `radial-gradient(ellipse at 55% 45%, ${bgTo} 0%, ${bgFrom} 100%)`,
            paddingBottom: "100%", // 1:1 — siempre cuadrada
          }}
          onClick={() => tieneImagen && setLightbox(true)}
        >
          <div className="absolute inset-0">
            {tieneImagen ? (
              <Image
                src={variante.imagen}
                alt={`${p.nombre} — ${variante.color}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2" style={{ color: variante.hex }}>
                <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12 opacity-25">
                  <rect x="6" y="10" width="36" height="28" rx="4" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="18" cy="22" r="4" stroke="currentColor" strokeWidth="2"/>
                  <path d="M6 34l10-10 8 8 6-7 12 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-xs font-medium opacity-30">Foto próximamente</span>
              </div>
            )}
          </div>

          {/* Badges — pueden convivir ambos */}
          <div className="absolute top-2.5 right-2.5 z-10 flex flex-col items-end gap-1">
            {p.badge && (
              <span
                className="text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm"
                style={{ background: hexToRgba(variante.hex, 0.92), backdropFilter: "blur(4px)" }}
              >
                {p.badge}
              </span>
            )}
            {p.descuento && (
              <span className="bg-lila text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                -{p.descuento}%
              </span>
            )}
          </div>

          {/* Lupa centrada al hacer hover */}
          {tieneImagen && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="bg-black/30 backdrop-blur-sm rounded-full p-3">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-white">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* ── TEXTO — compacto ── */}
        <div className="px-4 pt-3 pb-4 flex flex-col gap-2">

          {/* Dots de color — solo variantes con foto */}
          <div className="flex items-center gap-1.5">
            {variantesConFoto.map((v, i) => (
              <button
                key={v.color}
                onClick={() => setVarIdx(i)}
                title={v.color}
                className="rounded-full flex-shrink-0 transition-all duration-150"
                style={{
                  width: 10, height: 10,
                  background: v.hex,
                  boxShadow: i === varIdx
                    ? `0 0 0 1.5px white, 0 0 0 2.5px ${v.hex}`
                    : "none",
                  opacity: i === varIdx ? 1 : 0.3,
                  transform: i === varIdx ? "scale(1.2)" : "scale(1)",
                }}
              />
            ))}
          </div>

          {/* Nombre */}
          <h3 className="font-semibold text-texto text-sm leading-tight">{p.nombre}</h3>

          {/* Descripción — 1 sola línea */}
          <p className="text-texto-muted text-xs leading-snug line-clamp-1">{p.descripcion}</p>

          {/* CTAs */}
          <div className="flex items-center gap-3 pt-0.5">
            <a
              href={waLink(p, variante)}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-xs px-4 py-1.5 rounded-full text-white transition-opacity hover:opacity-85 flex-shrink-0"
              style={{ background: variante.hex }}
            >
              Consultar
            </a>
            <Link
              href={`/productos/${p.id}`}
              className="text-xs font-medium transition-opacity hover:opacity-60"
              style={{ color: variante.hex }}
            >
              Ver detalles ›
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Sección principal ─────────────────────────────────────────────────────────
export default function Productos() {
  const [cat, setCat] = useState<Categoria>("todos");
  const filtered = (cat === "todos" ? productos : productos.filter(p => p.categoria === cat))
    .filter(p => p.variantes.some(v => !!v.imagen));

  return (
    <section id="productos" className="py-24 bg-fondo px-6 sm:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map(p => (
              <ProductoCard key={p.id} p={p} />
            ))}
          </div>
        )}

        {/* CTA catálogo completo */}
        <div className="text-center mt-10">
          <a
            href={`${Cliente.whatsapp.link}?text=${encodeURIComponent("Hola! Quería ver el catálogo completo de productos Essen.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal text-sm font-semibold hover:text-teal-dark transition-colors"
          >
            Ver catálogo completo por WhatsApp →
          </a>
        </div>
      </div>
    </section>
  );
}
