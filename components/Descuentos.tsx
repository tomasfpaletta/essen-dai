"use client";
import { descuentos, descuentosConfig, type Descuento } from "@/config/descuentos";

function BancoCard({ d }: { d: Descuento }) {
  return (
    <div
      className="relative rounded-2xl p-6 flex flex-col gap-4 overflow-hidden text-white"
      style={{ background: `linear-gradient(135deg, ${d.color} 0%, ${d.color}CC 100%)` }}
    >
      {/* Círculo decorativo de fondo */}
      <div
        className="absolute -top-6 -right-6 w-28 h-28 rounded-full opacity-20"
        style={{ background: "white" }}
      />
      <div
        className="absolute -bottom-8 -left-4 w-20 h-20 rounded-full opacity-10"
        style={{ background: "white" }}
      />

      {/* Banco */}
      <p className="text-xs font-semibold uppercase tracking-widest opacity-80 relative z-10">
        {d.banco}
      </p>

      {/* Descuento — el protagonista */}
      <p className="font-heading text-4xl font-bold leading-none relative z-10">
        {d.descuento}
      </p>

      {/* Condición */}
      <p className="text-sm opacity-75 relative z-10">{d.condicion}</p>

      {/* Vigente */}
      <div className="flex items-center gap-2 mt-auto relative z-10">
        <span className="w-2 h-2 rounded-full bg-white/70 animate-pulse" />
        <span className="text-xs opacity-70">Vigente · {descuentosConfig.vigencia}</span>
      </div>
    </div>
  );
}

export default function Descuentos() {
  const activos = descuentos.filter(d => d.activo);
  if (!descuentosConfig.visible || activos.length === 0) return null;

  return (
    <section className="px-6 sm:px-12 lg:px-20 py-12 bg-fondo">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-teal/10 border border-teal/20 rounded-full px-3 py-1 mb-3">
              <span className="text-sm">💳</span>
              <span className="text-teal-dark text-xs font-semibold uppercase tracking-widest">Beneficios bancarios</span>
            </div>
            <h3 className="font-heading text-texto text-2xl">{descuentosConfig.subtitulo}</h3>
          </div>
          <p className="text-texto-light text-sm">{descuentosConfig.vigencia}</p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {activos.map(d => <BancoCard key={d.banco} d={d} />)}
        </div>

        <p className="text-xs text-texto-light mt-5">
          * Descuentos válidos al {descuentosConfig.vigencia}. Consultá condiciones con tu banco.
        </p>
      </div>
    </section>
  );
}
