"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { promocionesBanner, promocionesItems } from "@/config/promociones";
import { Cliente } from "@/config/cliente";

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function getTextContrast(hex: string): "light" | "dark" {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.55 ? "dark" : "light";
}

export default function Promociones() {
  const config = promocionesBanner;
  const items = promocionesItems.filter((i) => i.activo);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const id = setInterval(() => setActive((a) => (a + 1) % items.length), 5000);
    return () => clearInterval(id);
  }, [items.length]);

  if (!config.visible || items.length === 0) return null;

  const activeItem = items[active];
  const contrast = getTextContrast(activeItem.colorFondo);
  const waMsg = encodeURIComponent(
    `Hola Daisy! Vi la promo "${activeItem.titulo}" y me interesa saber más.`
  );

  return (
    <section
      id="promociones"
      className="relative overflow-hidden py-20"
      style={{
        background: `linear-gradient(${config.gradienteDireccion}, ${config.gradienteDesde}, ${config.gradienteHasta})`,
      }}
    >
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-3xl opacity-20"
          style={{ background: config.gradienteHasta }} />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full blur-3xl opacity-15"
          style={{ background: config.gradienteDesde }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-3xl opacity-5 bg-white" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">

        {/* ── Section label ── */}
        <div className="flex items-center gap-3 mb-10">
          <span className="inline-flex items-center gap-2 border rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white"
            style={{ borderColor: hexToRgba("#FFFFFF", 0.25), background: hexToRgba("#FFFFFF", 0.1) }}>
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            {config.badge}
          </span>
        </div>

        <div className="grid lg:grid-cols-5 gap-6 items-stretch">

          {/* ── Featured card (active item) ── */}
          <div className="lg:col-span-3">
            <div
              key={activeItem.id}
              className="relative rounded-3xl overflow-hidden h-full min-h-[340px] flex flex-col justify-between p-8 transition-all duration-500"
              style={{
                background: activeItem.colorFondo,
                boxShadow: `0 32px 64px ${hexToRgba(activeItem.colorFondo, 0.5)}`,
              }}
            >
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-3xl"
                style={{ boxShadow: `inset 0 1px 0 ${hexToRgba("#FFFFFF", 0.2)}` }} />

              {/* Image — fondo decorativo si hay imagen */}
              {activeItem.imagen && (
                <div className="absolute inset-0 pointer-events-none">
                  <Image
                    src={activeItem.imagen}
                    alt={activeItem.titulo}
                    fill
                    className="object-cover object-center opacity-20"
                  />
                  <div className="absolute inset-0"
                    style={{ background: `linear-gradient(135deg, ${activeItem.colorFondo}FF 40%, ${activeItem.colorFondo}80 100%)` }} />
                </div>
              )}

              {/* Decorative circles */}
              <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-10 bg-white pointer-events-none" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full opacity-10 bg-white pointer-events-none" />

              {/* Content */}
              <div className="relative z-10">
                <span
                  className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
                  style={{
                    background: hexToRgba("#FFFFFF", 0.2),
                    color: contrast === "light" ? "#FFFFFF" : "#1A1A1A",
                  }}
                >
                  {activeItem.badge}
                </span>
                <h3
                  className="font-heading text-3xl sm:text-4xl leading-tight mb-3"
                  style={{ color: contrast === "light" ? "#FFFFFF" : "#1A1A1A" }}
                >
                  {activeItem.titulo}
                </h3>
                <p
                  className="text-base leading-relaxed max-w-sm"
                  style={{ color: contrast === "light" ? hexToRgba("#FFFFFF", 0.75) : hexToRgba("#000000", 0.6) }}
                >
                  {activeItem.descripcion}
                </p>
              </div>

              <div className="relative z-10 flex flex-wrap gap-3 mt-8">
                <a
                  href={`${Cliente.whatsapp.link}?text=${waMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white font-bold px-5 py-2.5 rounded-xl text-sm hover:scale-105 transition-transform shadow-lg"
                  style={{ color: activeItem.colorFondo }}
                >
                  Consultar →
                </a>
                <a
                  href={config.ctaLink}
                  className="inline-flex items-center gap-2 font-semibold px-5 py-2.5 rounded-xl text-sm border transition-all hover:bg-white/10"
                  style={{
                    color: contrast === "light" ? "white" : "#1A1A1A",
                    borderColor: hexToRgba(contrast === "light" ? "#FFFFFF" : "#000000", 0.3),
                  }}
                >
                  {config.ctaTexto}
                </a>
              </div>
            </div>
          </div>

          {/* ── Right: banner copy + item list ── */}
          <div className="lg:col-span-2 flex flex-col justify-between gap-6">

            {/* Copy */}
            <div>
              <h2 className="font-heading text-white text-3xl sm:text-4xl leading-tight mb-2">
                {config.titulo}
              </h2>
              <p className="font-bold text-xl mb-3" style={{ color: hexToRgba("#FFFFFF", 0.7) }}>
                {config.subtitulo}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: hexToRgba("#FFFFFF", 0.55) }}>
                {config.descripcion}
              </p>
            </div>

            {/* Item selector list */}
            <div className="flex flex-col gap-2">
              {items.map((item, idx) => {
                const isActive = idx === active;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActive(idx)}
                    className="text-left rounded-2xl px-4 py-3 transition-all duration-300 flex items-center gap-3"
                    style={{
                      background: isActive ? hexToRgba("#FFFFFF", 0.15) : hexToRgba("#FFFFFF", 0.05),
                      borderLeft: `3px solid ${isActive ? "#FFFFFF" : hexToRgba("#FFFFFF", 0.2)}`,
                    }}
                  >
                    {/* Color dot */}
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0 border-2 border-white/30"
                      style={{ background: item.colorFondo }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{item.titulo}</p>
                      <p className="text-xs truncate" style={{ color: hexToRgba("#FFFFFF", 0.5) }}>
                        {item.badge}
                      </p>
                    </div>
                    {isActive && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0 animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Progress dots */}
            {items.length > 1 && (
              <div className="flex gap-2">
                {items.map((_, idx) => (
                  <button key={idx} onClick={() => setActive(idx)}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: idx === active ? 24 : 6,
                      height: 6,
                      background: idx === active ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.25)",
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
