"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { promocionesBanner, promocionesItems } from "@/config/promociones";
import { Cliente } from "@/config/cliente";

export default function Promociones() {
  const config = promocionesBanner ?? null;
  const items = (promocionesItems ?? []).filter((i) => i.activo);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!config || !config.visible || items.length === 0) return null;

  const waMsg = (titulo: string) =>
    encodeURIComponent(`Hola Daisy! Vi la promo "${titulo}" y me interesa saber más.`);

  return (
    <section
      id="promociones"
      className="py-20"
      style={{ background: `linear-gradient(${config.gradienteDireccion}, ${config.gradienteDesde}, ${config.gradienteHasta})` }}
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
            <p className="text-white/60 mt-3 text-base max-w-xl mx-auto">{config.subtitulo}</p>
          )}
        </div>

        {/* Grid de cards */}
        <div className={`grid gap-5 ${items.length === 1 ? "grid-cols-1 max-w-2xl mx-auto" : "grid-cols-1 md:grid-cols-2"}`}>
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
              <div className="flex flex-col justify-between p-6 flex-1 min-w-0">
                <div>
                  <span
                    className="inline-block text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3"
                    style={{ background: "rgba(255,255,255,0.12)", color: "#7ECFCA" }}
                  >
                    {item.badge}
                  </span>
                  <h3 className="font-heading text-white text-2xl sm:text-3xl leading-snug mb-2">
                    {item.titulo}
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    {item.descripcion}
                  </p>
                </div>
                <div className="mt-5">
                  <a
                    href={`${Cliente.whatsapp.link}?text=${waMsg(item.titulo)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-white/90 transition-colors"
                    style={{ color: config.gradienteDesde }}
                  >
                    {config.ctaTexto}
                  </a>
                </div>
              </div>

              {/* Imagen */}
              {item.imagen ? (
                <div className="relative w-40 sm:w-52 flex-shrink-0 m-3 ml-0 rounded-xl overflow-hidden">
                  <Image
                    src={item.imagen}
                    alt={item.titulo}
                    fill
                    className="object-cover object-center"
                  />
                </div>
              ) : (
                <div
                  className="w-40 sm:w-52 flex-shrink-0 m-3 ml-0 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.04)" }}
                >
                  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10 opacity-20">
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
    </section>
  );
}
