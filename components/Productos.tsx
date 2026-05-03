"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Cliente } from "@/config/cliente";
import { productos, categorias, type Categoria, type Producto, type Variante } from "@/lib/products";
import { useWishlist } from "@/lib/wishlist-context";

const PREVIEW_COUNT = 10;

// ── WhatsApp link ─────────────────────────────────────────────────────────────
function waLink(p: Producto, v: Variante) {
  const msg = `Hola! Me interesa la/el ${p.nombre} en color ${v.color}. ¿Me podés dar precio y disponibilidad?`;
  return `${Cliente.whatsapp.link}?text=${encodeURIComponent(msg)}`;
}

// ── Lightbox ──────────────────────────────────────────────────────────────────
function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
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
  const variantesConFoto = p.variantes.filter(v => !!v.imagen);
  const [varIdx, setVarIdx] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const variante = variantesConFoto[varIdx] ?? p.variantes[0];
  const { toggle, has } = useWishlist();
  const enLista = has(p.id);
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

        <div
          className={`relative overflow-hidden ${tieneImagen ? "cursor-zoom-in" : ""}`}
          style={{
            background: `radial-gradient(ellipse at 55% 45%, ${bgTo} 0%, ${bgFrom} 100%)`,
            paddingBottom: "100%",
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
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
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

        <div className="px-4 pt-3 pb-4 flex flex-col gap-2">
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

          <h3 className="font-semibold text-texto text-sm leading-tight">{p.nombre}</h3>
          <p className="text-texto-muted text-xs leading-snug line-clamp-1">{p.descripcion}</p>

          <div className="flex items-center gap-2 pt-0.5">
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
              className="text-xs font-medium transition-opacity hover:opacity-60 flex-1"
              style={{ color: variante.hex }}
            >
              Ver detalles ›
            </Link>
            <button
              onClick={e => { e.stopPropagation(); toggle(p, variante) }}
              title={enLista ? "Quitar de la lista" : "Agregar a mi lista"}
              className={`flex-shrink-0 p-1 rounded-full transition-colors ${
                enLista ? 'text-teal' : 'text-texto-muted hover:text-teal'
              }`}
            >
              <svg viewBox="0 0 24 24" fill={enLista ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Drawer: catálogo completo ─────────────────────────────────────────────────
function CatalogoDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [cat, setCat] = useState<Categoria>("todos");
  const [busqueda, setBusqueda] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Bloquear scroll del body cuando el drawer está abierto
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      scrollRef.current?.scrollTo(0, 0);
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Cerrar con Escape
  useEffect(() => {
    if (!open) return;
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [open, onClose]);

  const filtered = (cat === "todos" ? productos : productos.filter(p => p.categoria === cat))
    .filter(p => p.variantes.some(v => !!v.imagen))
    .filter(p => {
      if (!busqueda.trim()) return true;
      const q = busqueda.toLowerCase();
      return (
        p.nombre.toLowerCase().includes(q) ||
        p.descripcion.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q)) ||
        p.categoria.toLowerCase().includes(q)
      );
    });

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed inset-x-0 bottom-0 z-[60] flex flex-col transition-transform duration-500 ease-out ${open ? "translate-y-0" : "translate-y-full"}`}
        style={{ height: "92dvh", borderRadius: "20px 20px 0 0", background: "#F3F7F5" }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 flex-shrink-0 border-b border-teal/10">
          <div>
            <h2 className="font-bold text-texto text-lg leading-tight">Catálogo completo</h2>
            <p className="text-xs text-texto-muted mt-0.5">{filtered.length} producto{filtered.length !== 1 ? "s" : ""}</p>
          </div>

          {/* Buscador */}
          <div className="relative mx-4 flex-1 max-w-xs hidden sm:block">
            <svg viewBox="0 0 20 20" fill="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-texto-muted pointer-events-none">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
            </svg>
            <input
              type="text"
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              placeholder="Buscar…"
              className="w-full pl-9 pr-4 py-2 rounded-full border border-teal/20 bg-white text-sm text-texto placeholder-texto-muted focus:outline-none focus:border-teal transition-colors"
            />
            {busqueda && (
              <button onClick={() => setBusqueda("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-texto-muted hover:text-texto">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="flex-shrink-0 p-2 rounded-xl hover:bg-teal/10 text-texto-muted hover:text-texto transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Buscador mobile */}
        <div className="sm:hidden px-5 pt-3 flex-shrink-0">
          <div className="relative">
            <svg viewBox="0 0 20 20" fill="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-texto-muted pointer-events-none">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
            </svg>
            <input
              type="text"
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              placeholder="Buscar productos…"
              className="w-full pl-9 pr-4 py-2 rounded-full border border-teal/20 bg-white text-sm text-texto placeholder-texto-muted focus:outline-none focus:border-teal transition-colors"
            />
            {busqueda && (
              <button onClick={() => setBusqueda("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-texto-muted hover:text-texto">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Filtros de categoría */}
        <div className="flex gap-2 px-5 py-3 flex-shrink-0 overflow-x-auto scrollbar-none">
          {categorias.map(c => (
            <button
              key={c.value}
              onClick={() => setCat(c.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border whitespace-nowrap transition-all flex-shrink-0 ${
                cat === c.value
                  ? "bg-teal border-teal text-white shadow-sm shadow-teal/25"
                  : "border-teal/25 text-texto-muted hover:border-teal/50 hover:text-teal bg-white"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Grilla scrolleable */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 pb-8">
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-texto-light">
              {busqueda ? (
                <>
                  <p className="text-lg font-heading text-teal">Sin resultados para &ldquo;{busqueda}&rdquo;</p>
                  <button onClick={() => setBusqueda("")} className="text-sm mt-2 text-teal hover:underline">Limpiar búsqueda</button>
                </>
              ) : (
                <p className="text-lg font-heading text-teal">No hay productos en esta categoría.</p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filtered.map(p => (
                <ProductoCard key={p.id} p={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ── Sección principal ─────────────────────────────────────────────────────────
export default function Productos() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Mostrar primero los destacados, luego el resto, hasta PREVIEW_COUNT
  const preview = [
    ...productos.filter(p => p.destacado && p.variantes.some(v => !!v.imagen)),
    ...productos.filter(p => !p.destacado && p.variantes.some(v => !!v.imagen)),
  ].slice(0, PREVIEW_COUNT);

  return (
    <>
      <section id="productos" className="py-24 bg-fondo px-6 sm:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-teal text-xs font-semibold uppercase tracking-[0.2em] mb-3">Catálogo</p>
              <h2 className="display-hero text-texto leading-none">
                Conocé la<br /><span className="text-teal">familia.</span>
              </h2>
            </div>
            <p className="text-texto-muted text-sm max-w-xs md:text-right">
              Productos Essen originales con garantía oficial. Consultá por WhatsApp para precios y disponibilidad.
            </p>
          </div>

          {/* Grilla preview */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {preview.map(p => (
              <ProductoCard key={p.id} p={p} />
            ))}
          </div>

          {/* CTA Ver todos */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <button
              onClick={() => setDrawerOpen(true)}
              className="inline-flex items-center gap-2.5 font-bold px-8 py-4 rounded-full text-sm tracking-wide transition-all hover:scale-105 hover:shadow-lg hover:shadow-teal/20"
              style={{ background: "#58A39D", color: "#fff", boxShadow: "0 0 24px rgba(88,163,157,0.3)" }}
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
              </svg>
              Ver todos los productos
            </button>
            <a
              href={`${Cliente.whatsapp.link}?text=${encodeURIComponent("Hola! Quería ver el catálogo completo de productos Essen.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal text-sm font-semibold hover:underline transition-colors"
            >
              Ver catálogo por WhatsApp →
            </a>
          </div>
        </div>
      </section>

      <CatalogoDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
