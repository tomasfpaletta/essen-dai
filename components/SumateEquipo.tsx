"use client";
import { useState } from "react";
import { Cliente } from "@/config/cliente";

const BENEFICIOS = [
  "Ingresos reales sin horarios fijos",
  "Kit de inicio y capacitación gratuita",
  "Respaldo de una marca con 30 años de historia",
  "Comunidad de vendedoras en todo el país",
];

export default function SumateEquipo() {
  const [nombre, setNombre] = useState("");
  const [motivo, setMotivo] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim() || !motivo.trim()) return;
    const texto = encodeURIComponent(
      `Hola Daisy! Me gustaría sumarme a tu equipo de ventas Essen.\n\nNombre: ${nombre.trim()}\nPor qué quiero unirme: ${motivo.trim()}\n\nQuedo a disposición, muchas gracias!`
    );
    window.open(`${Cliente.whatsapp.link}?text=${texto}`, "_blank");
  }

  return (
    <section id="equipo" className="py-24 bg-teal overflow-hidden relative section-angle-both">
      {/* Diagonal dashes decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        {[
          { top: "10%", left: "5%",  w: 60, h: 11, rot: -40 },
          { top: "30%", left: "2%",  w: 40, h: 10, rot: -40 },
          { top: "65%", left: "6%",  w: 55, h: 11, rot: -40 },
          { top: "85%", left: "3%",  w: 45, h: 10, rot: -40 },
          { top: "15%", left: "88%", w: 65, h: 12, rot: -40 },
          { top: "40%", left: "92%", w: 50, h: 10, rot: -40 },
          { top: "70%", left: "85%", w: 70, h: 12, rot: -40 },
        ].map((d, i) => (
          <span key={i} className="absolute rounded-full bg-white/10" style={{
            top: d.top, left: d.left, width: d.w, height: d.h,
            transform: `rotate(${d.rot}deg)`,
          }} />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <div>
            <span className="inline-block bg-white/15 text-white text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
              Oportunidad
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl text-white leading-tight mb-8">
              ¿Querés vender<br />Essen?
            </h2>
            <div className="space-y-4">
              {BENEFICIOS.map(b => (
                <div key={b} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-white rounded-full" />
                  </span>
                  <span className="text-white/80 text-base leading-relaxed">{b}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Form */}
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-teal-dark/20">
            <h3 className="font-heading text-xl text-texto mb-1">Sumate al equipo</h3>
            <p className="text-texto-muted text-sm mb-6">Completá el formulario y te contactamos</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-texto-light text-xs uppercase tracking-widest block mb-2">Tu nombre</label>
                <input type="text" value={nombre} onChange={e => setNombre(e.target.value)}
                  placeholder="Nombre completo"
                  className="w-full bg-fondo border border-teal/20 rounded-xl px-4 py-3 text-texto placeholder-texto-light text-sm focus:outline-none focus:border-teal/50 transition-colors" />
              </div>
              <div>
                <label className="text-texto-light text-xs uppercase tracking-widest block mb-2">¿Por qué te interesa?</label>
                <textarea value={motivo} onChange={e => setMotivo(e.target.value)}
                  placeholder="Contame brevemente..."
                  rows={4}
                  className="w-full bg-fondo border border-teal/20 rounded-xl px-4 py-3 text-texto placeholder-texto-light text-sm resize-none focus:outline-none focus:border-teal/50 transition-colors" />
              </div>
              <button type="submit"
                className="w-full bg-teal text-white font-bold py-4 rounded-xl hover:bg-teal-dark transition-all text-sm tracking-wide shadow-sm">
                Enviar por WhatsApp →
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
