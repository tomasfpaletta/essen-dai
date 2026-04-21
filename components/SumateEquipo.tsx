"use client";
import Image from "next/image";
import { Cliente } from "@/config/cliente";

export default function SumateEquipo() {
  const cfg = (Cliente as Record<string, unknown>).sumateEquipo as {
    visible: boolean
    badge: string
    titulo: string
    descripcion: string
    beneficios: string[]
    ctaTexto: string
    imagenEquipo: string
    badgeNumero: string
    badgeTexto: string
  } | undefined;

  if (!cfg || cfg.visible === false) return null;

  const waTexto = encodeURIComponent(
    `Hola Daisy! Me gustaría sumarme a tu equipo de ventas Essen. ¿Me podés contar más?`
  );

  return (
    <section id="equipo" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── Imagen ── */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden aspect-[4/5] w-full max-w-md mx-auto lg:mx-0 shadow-2xl shadow-teal/20">
              {cfg.imagenEquipo ? (
                <Image
                  src={cfg.imagenEquipo}
                  alt="Emprendedora Essen"
                  fill
                  className="object-cover object-top"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-teal/20 to-teal-dark/40 flex items-center justify-center">
                  <div className="text-center text-white/60 p-8">
                    <svg viewBox="0 0 64 64" fill="none" className="w-16 h-16 mx-auto mb-3 opacity-40">
                      <circle cx="32" cy="22" r="10" stroke="currentColor" strokeWidth="2"/>
                      <path d="M10 54c0-12.15 9.85-22 22-22s22 9.85 22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <p className="text-sm font-medium">Foto del equipo</p>
                    <p className="text-xs mt-1 opacity-70">Subí una imagen desde el admin</p>
                  </div>
                </div>
              )}
            </div>

            {/* Badge flotante */}
            <div className="absolute -bottom-4 -right-4 lg:bottom-6 lg:-right-6 bg-teal text-white rounded-2xl px-5 py-3 shadow-xl shadow-teal/30">
              <p className="text-2xl font-black leading-none">{cfg.badgeNumero}</p>
              <p className="text-xs font-semibold opacity-80 mt-0.5">{cfg.badgeTexto}</p>
            </div>
          </div>

          {/* ── Texto ── */}
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-teal mb-4">
              {cfg.badge}
            </span>
            <h2 className="font-heading text-texto text-3xl sm:text-4xl lg:text-5xl leading-tight mb-5">
              {cfg.titulo}
            </h2>
            <p className="text-texto-muted text-base leading-relaxed mb-8">
              {cfg.descripcion}
            </p>

            {/* Beneficios */}
            <ul className="space-y-3 mb-10">
              {cfg.beneficios.map((b: string) => (
                <li key={b} className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-teal/15 flex items-center justify-center">
                    <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
                      <path d="M2 6l3 3 5-5" stroke="#58A39D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <span className="text-texto-muted text-sm">{b}</span>
                </li>
              ))}
            </ul>

            <a
              href={`${Cliente.whatsapp.link}?text=${waTexto}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-teal text-white font-bold px-7 py-4 rounded-xl hover:bg-teal-dark transition-colors shadow-lg shadow-teal/25 text-sm"
            >
              {cfg.ctaTexto}
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
