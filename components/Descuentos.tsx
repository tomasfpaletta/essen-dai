"use client";
import { useRef, useState } from "react";
import { descuentos, descuentosConfig, type Descuento } from "@/config/descuentos";

// Extrae el número de porcentaje del string, si existe
function extractPct(s: string) {
  const m = s.match(/(\d+)\s*%/);
  return m ? m[1] : null;
}

function BancoCard({ d, active }: { d: Descuento; active: boolean }) {
  const pct = extractPct(d.descuento);
  const esCuotas = !pct;

  return (
    <div
      className={`flex-shrink-0 w-72 sm:w-80 bg-white rounded-2xl overflow-hidden border transition-all duration-200 select-none ${active ? "border-gray-200 shadow-lg" : "border-gray-100 shadow-sm opacity-80"
        }`}
    >
      {/* Cuerpo */}
      <div className="p-5 flex items-start gap-4">
        {/* Círculo de descuento */}
        <div
          className="flex-shrink-0 w-20 h-20 rounded-full flex flex-col items-center justify-center text-white shadow-md"
          style={{ background: `radial-gradient(circle at 35% 35%, ${d.color}EE, ${d.color})` }}
        >
          {pct ? (
            <>
              <span className="text-2xl font-black leading-none">{pct}%</span>
              <span className="text-[9px] font-bold uppercase tracking-wider opacity-80 mt-0.5">de ahorro</span>
            </>
          ) : (
            <>
              <span className="text-[11px] font-black leading-tight text-center px-1">{d.descuento}</span>
            </>
          )}
        </div>

        {/* Info banco */}
        <div className="flex-1 min-w-0 pt-1">
          <p className="font-bold text-gray-800 text-base leading-tight">{d.banco}</p>
          {d.detalle && (
            <p className="text-gray-500 text-xs mt-1.5 leading-snug">{d.detalle}</p>
          )}
        </div>
      </div>

      {/* Banner condición */}
      {d.condicion && (
        <div
          className="px-5 py-2.5 text-white text-xs font-semibold leading-snug"
          style={{ background: d.color }}
        >
          {d.condicion}
        </div>
      )}
    </div>
  );
}

export default function Descuentos() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);

  const activos = descuentos.filter(d => d.activo);
  if (!descuentosConfig.visible || activos.length === 0) return null;

  function scrollTo(idx: number) {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.children[idx] as HTMLElement;
    if (!card) return;
    el.scrollTo({ left: card.offsetLeft - 16, behavior: "smooth" });
    setCurrent(idx);
  }

  function prev() { scrollTo(Math.max(0, current - 1)); }
  function next() { scrollTo(Math.min(activos.length - 1, current + 1)); }

  // Todos los bancos para el strip de cuotas
  const todosBancos = descuentosConfig.cuotasBancos;

  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-heading text-texto text-2xl sm:text-3xl font-bold">
            {descuentosConfig.subtitulo}
          </h3>
          {/* Flechas */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={prev}
              disabled={current === 0}
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-colors disabled:opacity-30"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={next}
              disabled={current === activos.length - 1}
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-colors disabled:opacity-30"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Carrusel */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-2 scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          onScroll={e => {
            const el = e.currentTarget;
            const cards = Array.from(el.children) as HTMLElement[];
            let closest = 0;
            let minDist = Infinity;
            cards.forEach((c, i) => {
              const dist = Math.abs(c.offsetLeft - el.scrollLeft - 16);
              if (dist < minDist) { minDist = dist; closest = i; }
            });
            setCurrent(closest);
          }}
        >
          {activos.map((d, i) => (
            <BancoCard key={d.banco} d={d} active={i === current} />
          ))}
        </div>

        {/* Puntos de paginación */}
        <div className="flex items-center gap-1.5 mt-4">
          {activos.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`rounded-full transition-all duration-200 ${i === current
                  ? "w-5 h-2 bg-teal"
                  : "w-2 h-2 bg-gray-200 hover:bg-gray-300"
                }`}
            />
          ))}
        </div>

        {/* Strip de cuotas */}
        <div className="mt-8 bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 flex flex-wrap items-center gap-x-6 gap-y-3">
          <p className="text-texto font-bold text-base flex-shrink-0">
            {descuentosConfig.cuotasTexto}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {todosBancos.map(banco => {
              const d = descuentos.find(x => x.banco === banco);
              return (
                <span
                  key={banco}
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg"
                  style={{
                    background: d ? `${d.color}18` : "#f3f4f6",
                    color: d ? d.color : "#6b7280",
                  }}
                >
                  {banco}
                </span>
              );
            })}
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-4">
          * Descuentos válidos en {descuentosConfig.vigencia}. Consultá condiciones con tu banco.
        </p>
      </div>
    </section>
  );
}
