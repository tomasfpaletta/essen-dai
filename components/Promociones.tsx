"use client";
import { useState } from "react";
import Image from "next/image";
import { promocionesBanner, promocionesItems } from "@/config/promociones";
import { Cliente } from "@/config/cliente";

// ── Lightbox para la imagen bancaria ─────────────────────────────────────────
function ImagenZoom({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
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
        className="relative max-w-sm w-full rounded-2xl overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
        style={{ maxHeight: "90vh" }}
      >
        <img
          src={src}
          alt={alt}
          style={{ width: "100%", height: "auto", maxHeight: "90vh", objectFit: "contain", display: "block" }}
        />
      </div>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function Promociones() {
  const config = promocionesBanner ?? null;
  const items = (promocionesItems ?? []).filter((i) => i.activo);
  const [zoom, setZoom] = useState(false);

  if (!config || !config.visible || items.length === 0) return null;

  const waMsg = (titulo: string) =>
    encodeURIComponent(`Hola Daisy! Vi la promo "${titulo}" y me interesa saber más.`);

  return (
    <>
      {zoom && (
        <ImagenZoom
          src="/images/bancos/promos.jpg"
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

          {/* Layout principal: imagen bancaria izq | promos der */}
          <div className="flex flex-col lg:flex-row gap-6 items-start">

            {/* ── Imagen bancaria — tall, zoomable ── */}
            <div className="w-full lg:w-auto lg:flex-shrink-0 lg:self-stretch flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-3">
                Beneficios bancarios
              </p>
              <div
                className="relative flex-1 rounded-2xl overflow-hidden cursor-zoom-in group"
                style={{
                  minHeight: 320,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.10)",
                }}
                onClick={() => setZoom(true)}
              >
                {/* Imagen */}
                <img
                  src="/images/bancos/promos.jpg"
                  alt="Promociones bancarias"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "top",
                    display: "block",
                    minHeight: 320,
                  }}
                  className="lg:absolute lg:inset-0"
                />

                {/* Overlay con hint de zoom */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-end justify-center pb-4 pointer-events-none">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                      <path d="M5 8a3 3 0 116 0A3 3 0 015 8z"/>
                      <path fillRule="evenodd" d="M8 14a6 6 0 100-12 6 6 0 000 12zm6.32-1.094l3.58 3.58a1 1 0 01-1.414 1.414l-3.58-3.58A8 8 0 1114.32 12.906z" clipRule="evenodd"/>
                    </svg>
                    Tocá para ampliar
                  </span>
                </div>
              </div>

              {/* Hint mobile */}
              <p className="text-white/30 text-xs text-center mt-2 lg:hidden">
                Tocá la imagen para ampliar
              </p>
            </div>

            {/* ── Promos de tiempo limitado ── */}
            <div className="flex-1 flex flex-col gap-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
                Tiempo limitado
              </p>

              {items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl overflow-hidden flex flex-row items-stretch"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.10)",
                  }}
                >
                  {/* Texto */}
                  <div className="flex flex-col justify-between p-5 flex-1 min-w-0">
                    <div>
                      <span
                        className="inline-block text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-2"
                        style={{ background: "rgba(255,255,255,0.10)", color: "#7ECFCA" }}
                      >
                        {item.badge}
                      </span>
                      <h3 className="font-heading text-white text-xl sm:text-2xl leading-snug mb-1">
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

                  {/* Imagen del producto */}
                  {item.imagen ? (
                    <div className="relative w-32 sm:w-40 flex-shrink-0 m-3 ml-0 rounded-xl overflow-hidden">
                      <Image
                        src={item.imagen}
                        alt={item.titulo}
                        fill
                        className="object-cover object-center"
                      />
                    </div>
                  ) : (
                    <div
                      className="w-32 sm:w-40 flex-shrink-0 m-3 ml-0 rounded-xl flex items-center justify-center"
                      style={{ background: "rgba(255,255,255,0.04)" }}
                    >
                      <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8 opacity-15">
                        <rect x="6" y="10" width="36" height="28" rx="4" stroke="white" strokeWidth="2"/>
                        <circle cx="18" cy="20" r="4" stroke="white" strokeWidth="2"/>
                        <path d="M6 34l10-10 8 8 6-7 12 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
