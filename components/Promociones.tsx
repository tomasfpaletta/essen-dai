"use client";
import { useState, useEffect } from "react";
import { promocionesBanner, promocionesItems } from "@/config/promociones";
import { Cliente } from "@/config/cliente";

// Devuelve si el contraste debe ser claro u oscuro según el fondo
function getTextContrast(hex: string): "light" | "dark" {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? "dark" : "light";
}

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export default function Promociones() {
  const config = promocionesBanner;
  const items = promocionesItems.filter((i) => i.activo);

  // Controla el índice del item destacado (cambia automáticamente)
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (items.length <= 1) return;
    const id = setInterval(() => setActive((a) => (a + 1) % items.length), 4000);
    return () => clearInterval(id);
  }, [items.length]);

  if (!config.visible || items.length === 0) return null;

  const activeItem = items[active];
  const waMsg = encodeURIComponent(
    `Hola Daisy! Vi la promo "${activeItem.titulo}" y me interesa saber más.`
  );

  return (
    <section
      id="promociones"
      className="relative overflow-hidden"
      style={{
        background: `linear-gradient(${config.gradienteDireccion}, ${config.gradienteDesde}, ${config.gradienteHasta})`,
      }}
    >
      {/* Subtle noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "200px",
        }}
      />

      {/* Decorative circle */}
      <div
        className="absolute -right-32 -top-32 w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none"
        style={{ background: config.gradienteHasta }}
      />
      <div
        className="absolute -left-20 bottom-0 w-[300px] h-[300px] rounded-full opacity-10 pointer-events-none"
        style={{ background: config.gradienteDesde }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* ── Left: Banner copy ── */}
          <div>
            <span
              className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 border"
              style={{
                background: hexToRgba("#FFFFFF", 0.12),
                borderColor: hexToRgba("#FFFFFF", 0.25),
                color: "#FFFFFF",
              }}
            >
              {config.badge}
            </span>

            <h2 className="font-heading text-white text-4xl sm:text-5xl leading-tight mb-2">
              {config.titulo}
            </h2>
            <p
              className="text-2xl sm:text-3xl font-bold mb-5"
              style={{ color: hexToRgba("#FFFFFF", 0.75) }}
            >
              {config.subtitulo}
            </p>
            <p
              className="text-base leading-relaxed mb-8 max-w-md"
              style={{ color: hexToRgba("#FFFFFF", 0.65) }}
            >
              {config.descripcion}
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href={`${Cliente.whatsapp.link}?text=${waMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-[#1A3330] font-bold px-6 py-3 rounded-xl text-sm hover:scale-105 transition-transform shadow-lg"
                style={{ color: config.gradienteDesde }}
              >
                Consultar por WhatsApp
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M11.99 2C6.477 2 2 6.477 2 12c0 1.99.583 3.842 1.591 5.393L2.046 22l4.726-1.515A9.96 9.96 0 0 0 11.99 22c5.523 0 10-4.477 10-10S17.513 2 11.99 2zm0 18c-1.71 0-3.3-.47-4.661-1.283l-3.265 1.046.997-3.181A7.942 7.942 0 0 1 4 12c0-4.411 3.589-8 7.99-8C16.41 4 20 7.589 20 12s-3.589 8-8.01 8z"/>
                </svg>
              </a>
              <a
                href={config.ctaLink}
                className="inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-xl text-sm border transition-all hover:bg-white/10"
                style={{ color: "white", borderColor: hexToRgba("#FFFFFF", 0.3) }}
              >
                {config.ctaTexto} →
              </a>
            </div>
          </div>

          {/* ── Right: Promo cards ── */}
          <div className="flex flex-col gap-4">
            {items.map((item, idx) => {
              const isActive = idx === active;
              const contrast = getTextContrast(item.colorFondo);
              const textCol = contrast === "light" ? "#FFFFFF" : "#1A1A1A";
              const subCol = contrast === "light"
                ? hexToRgba("#FFFFFF", 0.7)
                : hexToRgba("#000000", 0.55);

              return (
                <button
                  key={item.id}
                  onClick={() => setActive(idx)}
                  className="text-left rounded-2xl p-5 transition-all duration-300 border"
                  style={{
                    background: isActive
                      ? item.colorFondo
                      : hexToRgba(item.colorFondo, 0.25),
                    borderColor: isActive
                      ? hexToRgba(item.colorFondo, 0.0)
                      : hexToRgba("#FFFFFF", 0.15),
                    transform: isActive ? "scale(1.02)" : "scale(1)",
                    boxShadow: isActive
                      ? `0 8px 32px ${hexToRgba(item.colorFondo, 0.4)}`
                      : "none",
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <span
                        className="inline-block text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-2"
                        style={{
                          background: hexToRgba("#FFFFFF", isActive ? 0.2 : 0.1),
                          color: isActive ? textCol : "#FFFFFF",
                        }}
                      >
                        {item.badge}
                      </span>
                      <h3
                        className="font-heading text-lg leading-tight mb-1 transition-colors"
                        style={{ color: isActive ? textCol : "#FFFFFF" }}
                      >
                        {item.titulo}
                      </h3>
                      <p
                        className="text-sm leading-relaxed transition-colors"
                        style={{ color: isActive ? subCol : hexToRgba("#FFFFFF", 0.6) }}
                      >
                        {item.descripcion}
                      </p>
                    </div>

                    {/* Active indicator */}
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5 transition-all"
                      style={{
                        background: isActive ? (contrast === "light" ? "#FFFFFF" : item.colorFondo) : hexToRgba("#FFFFFF", 0.3),
                        boxShadow: isActive ? `0 0 8px ${hexToRgba("#FFFFFF", 0.6)}` : "none",
                      }}
                    />
                  </div>

                  {/* Progress bar when active */}
                  {isActive && (
                    <div
                      className="mt-4 h-0.5 rounded-full overflow-hidden"
                      style={{ background: hexToRgba("#FFFFFF", 0.2) }}
                    >
                      <div
                        className="h-full rounded-full animate-progress"
                        style={{ background: hexToRgba("#FFFFFF", 0.7) }}
                      />
                    </div>
                  )}
                </button>
              );
            })}

            {/* Pagination dots */}
            {items.length > 1 && (
              <div className="flex gap-2 justify-center mt-2">
                {items.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActive(idx)}
                    className="rounded-full transition-all"
                    style={{
                      width: idx === active ? 20 : 6,
                      height: 6,
                      background: idx === active
                        ? "rgba(255,255,255,0.9)"
                        : "rgba(255,255,255,0.3)",
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
