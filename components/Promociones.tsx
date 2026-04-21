"use client";
import { useState } from "react";
import Image from "next/image";
import { promocionesBanner, promocionesItems } from "@/config/promociones";
import { Cliente } from "@/config/cliente";

// ── Lightbox ──────────────────────────────────────────────────────────────────
function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 text-white/70 hover:text-white text-3xl leading-none z-10"
        onClick={onClose}
      >
        ✕
      </button>
      <div
        className="rounded-2xl overflow-hidden shadow-2xl"
        style={{ maxWidth: 480, width: "100%", maxHeight: "92vh" }}
        onClick={e => e.stopPropagation()}
      >
        <img
          src={src}
          alt={alt}
          style={{ width: "100%", height: "auto", maxHeight: "92vh", objectFit: "contain", display: "block" }}
        />
      </div>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function Promociones() {
  const config = promocionesBanner ?? null;
  const hoy = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
  const items = (promocionesItems ?? []).filter((i) =>
    i.activo && (!i.fechaFin || i.fechaFin >= hoy)
  );
  const [zoom, setZoom] = useState(false);

  if (!config || !config.visible || items.length === 0) return null;

  const waMsg = (titulo: string) =>
    encodeURIComponent(`Hola Daisy! Vi la promo "${titulo}" y me interesa saber más.`);

  return (
    <>
      {zoom && (
        <Lightbox
          src="/images/bancos/promos.webp"
          alt="Promociones bancarias"
          onClose={() => setZoom(false)}
        />
      )}

      <section
        id="promociones"
        className="py-20"
        style={{
          background: `linear-gradient(${config.gradienteDireccion}, ${config.gradienteDesde}, ${config.gradienteHasta})`,
        }}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">

          {/* Header */}
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-teal mb-3">
              {config.badge}
            </span>
            <h2 className="font-heading text-white text-4xl sm:text-5xl">
              {config.titulo}
            </h2>
            {config.subtitulo && (
              <p className="text-white/60 mt-3 text-base max-w-xl mx-auto">
                {config.subtitulo}
              </p>
            )}
          </div>

          {/* Cuerpo: imagen bancaria izq + cards der */}
          <div className="flex flex-col lg:flex-row gap-6 items-start">

            {/* ── Imagen bancaria ── */}
            <div className="w-full lg:w-80 xl:w-96 flex-shrink-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-3">
                Beneficios bancarios
              </p>

              {/* Contenedor imagen — click para zoom */}
              <div
                className="relative rounded-2xl overflow-hidden cursor-zoom-in group"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.10)",
                }}
                onClick={() => setZoom(true)}
              >
                <img
                  src="/images/bancos/promos.webp"
                  alt="Promociones bancarias"
                  style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                    objectFit: "cover",
                  }}
                />

                {/* Overlay hint zoom */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-end justify-center pb-4">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
                    </svg>
                    Ampliar
                  </span>
                </div>
              </div>

              <p className="text-white/30 text-xs text-center mt-2 lg:hidden">
                Tocá para ampliar
              </p>
            </div>

            {/* ── Cards de tiempo limitado ── */}
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-3">
                Tiempo limitado
              </p>

              <div className="flex flex-col gap-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl overflow-hidden"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.10)",
                    }}
                  >
                    <div className="flex flex-row items-stretch">

                      {/* Imagen del producto — ocupa ~40% del card */}
                      {item.imagen ? (
                        <div
                          className="relative flex-shrink-0"
                          style={{ width: 240, minHeight: 210 }}
                        >
                          <Image
                            src={item.imagen}
                            alt={item.titulo}
                            fill
                            className="object-cover object-center"
                            sizes="240px"
                          />
                        </div>
                      ) : (
                        <div
                          className="flex-shrink-0 flex flex-col items-center justify-center gap-2"
                          style={{
                            width: 160,
                            minHeight: 210,
                            background: "rgba(255,255,255,0.04)",
                          }}
                        >
                          <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10 opacity-20">
                            <rect x="6" y="10" width="36" height="28" rx="4" stroke="white" strokeWidth="2"/>
                            <circle cx="18" cy="20" r="4" stroke="white" strokeWidth="2"/>
                            <path d="M6 34l10-10 8 8 6-7 12 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span className="text-white/30 text-xs">Sin imagen</span>
                        </div>
                      )}

                      {/* Texto */}
                      <div className="flex flex-col justify-between p-5 flex-1 min-w-0">
                        <div>
                          <span
                            className="inline-block text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-2"
                            style={{ background: "rgba(255,255,255,0.10)", color: "#7ECFCA" }}
                          >
                            {item.badge}
                          </span>
                          <h3 className="font-heading text-white text-xl sm:text-2xl leading-snug mb-1.5">
                            {item.titulo}
                          </h3>
                          <p className="text-white/55 text-sm leading-relaxed">
                            {item.descripcion}
                          </p>
                        </div>
                        <div className="mt-4">
                          <a
                            href={`${Cliente.whatsapp.link}?text=${waMsg(item.titulo)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-white/90 transition-colors"
                            style={{ color: config.gradienteDesde }}
                          >
                            {config.ctaTexto}
                          </a>
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
