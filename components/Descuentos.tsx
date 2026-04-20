"use client";
import { descuentos, descuentosConfig, type Descuento } from "@/config/descuentos";

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/** Luminancia relativa → si el color es muy claro, usar texto oscuro */
function isDark(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return 0.299 * r + 0.587 * g + 0.114 * b < 0.65;
}

function BancoCard({ d }: { d: Descuento }) {
  const dark = isDark(d.color);
  const textColor = dark ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.85)";
  const mutedColor = dark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.45)";
  const borderColor = dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)";

  return (
    <div
      className="relative rounded-2xl overflow-hidden flex flex-col gap-3 p-4 group transition-all duration-200 hover:-translate-y-1"
      style={{
        background: `linear-gradient(140deg, ${d.color} 0%, ${d.color}CC 100%)`,
        boxShadow: `0 4px 20px ${hexToRgba(d.color, 0.3)}`,
      }}
    >
      {/* Shine on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 55%)" }}
      />
      {/* Orb decorativo */}
      <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.08)" }} />

      {/* Nombre del banco — pill estilizado */}
      <div className="relative z-10">
        <span
          className="inline-block text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg"
          style={{
            background: dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.08)",
            color: textColor,
            letterSpacing: "0.08em",
          }}
        >
          {d.banco}
        </span>
      </div>

      {/* Beneficio — protagonista */}
      <div className="relative z-10 flex-1">
        <p
          className="font-heading font-bold leading-none"
          style={{ fontSize: "clamp(1.4rem, 3vw, 1.8rem)", color: textColor }}
        >
          {d.descuento}
        </p>
        <p className="text-xs mt-1.5 font-medium" style={{ color: mutedColor }}>
          {d.condicion}
        </p>
      </div>

      {/* Footer */}
      <div
        className="relative z-10 flex items-center justify-between pt-3"
        style={{ borderTop: `1px solid ${borderColor}` }}
      >
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: dark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.3)" }} />
          <span className="text-[10px] font-medium" style={{ color: mutedColor }}>
            Vigente · {descuentosConfig.vigencia}
          </span>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: mutedColor }}>Essen</span>
      </div>
    </div>
  );
}

export default function Descuentos() {
  const activos = descuentos.filter(d => d.activo);
  if (!descuentosConfig.visible || activos.length === 0) return null;

  return (
    <section className="px-6 sm:px-12 lg:px-20 py-14 bg-fondo">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-teal/10 border border-teal/20 rounded-full px-3 py-1 mb-3">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-teal">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"/>
                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd"/>
              </svg>
              <span className="text-teal-dark text-xs font-semibold uppercase tracking-widest">Beneficios bancarios</span>
            </div>
            <h3 className="font-heading text-texto text-2xl sm:text-3xl">{descuentosConfig.subtitulo}</h3>
          </div>
          <div className="flex items-center gap-2 text-texto-light text-sm bg-teal/5 border border-teal/15 rounded-full px-4 py-1.5 self-start sm:self-auto flex-shrink-0">
            <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
            {descuentosConfig.vigencia}
          </div>
        </div>

        {/* Cards — auto-fit: 4 desktop, 2-3 tablet, 1 mobile */}
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}
        >
          {activos.map(d => <BancoCard key={d.banco} d={d} />)}
        </div>

        <p className="text-xs text-texto-light mt-5 opacity-50">
          * Descuentos válidos al {descuentosConfig.vigencia}. Consultá condiciones con tu banco.
        </p>
      </div>
    </section>
  );
}
