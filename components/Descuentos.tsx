"use client";
import Image from "next/image";
import { descuentos, descuentosConfig, type Descuento } from "@/config/descuentos";

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function BancoCard({ d }: { d: Descuento }) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden flex flex-col gap-5 p-6 text-white group transition-transform hover:-translate-y-1 hover:shadow-2xl"
      style={{
        background: `linear-gradient(145deg, ${d.color} 0%, ${d.color}DD 100%)`,
        boxShadow: `0 8px 32px ${hexToRgba(d.color, 0.35)}`,
      }}
    >
      {/* Shine on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%)" }} />

      {/* Decorative circles */}
      <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-black/10 pointer-events-none" />

      {/* Logo */}
      <div className="relative z-10">
        {d.logo ? (
          <div className="bg-white rounded-xl shadow-md w-32 h-10 flex items-center justify-center px-3 py-1.5">
            <Image
              src={d.logo}
              alt={d.banco}
              width={110}
              height={32}
              className="max-h-7 max-w-full w-auto object-contain"
            />
          </div>
        ) : (
          <span className="text-xs font-bold uppercase tracking-widest opacity-70 bg-white/15 rounded-lg px-3 py-1.5">
            {d.banco}
          </span>
        )}
      </div>

      {/* Descuento */}
      <div className="relative z-10">
        <p className="font-heading text-5xl font-bold leading-none tracking-tight drop-shadow-sm">
          {d.descuento}
        </p>
        <p className="text-sm mt-2 opacity-80 font-medium">{d.condicion}</p>
      </div>

      {/* Footer */}
      <div className="relative z-10 flex items-center justify-between mt-auto pt-4 border-t border-white/15">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-white/70 animate-pulse" />
          <span className="text-xs opacity-60">Vigente · {descuentosConfig.vigencia}</span>
        </div>
        <span className="text-xs font-semibold opacity-50 uppercase tracking-wider">Essen</span>
      </div>
    </div>
  );
}

export default function Descuentos() {
  const activos = descuentos.filter(d => d.activo);
  if (!descuentosConfig.visible || activos.length === 0) return null;

  return (
    <section className="px-6 sm:px-12 lg:px-20 py-16 bg-fondo">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
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
          <div className="flex items-center gap-2 text-texto-light text-sm bg-teal/5 border border-teal/15 rounded-full px-4 py-1.5 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
            {descuentosConfig.vigencia}
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {activos.map(d => <BancoCard key={d.banco} d={d} />)}
        </div>

        <p className="text-xs text-texto-light mt-6 opacity-60">
          * Descuentos válidos al {descuentosConfig.vigencia}. Consultá condiciones con tu banco.
        </p>
      </div>
    </section>
  );
}
