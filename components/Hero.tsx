"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Cliente } from "@/config/cliente";

// ── Ícono según clave ─────────────────────────────────────────────────────────
function BadgeIcon({ icono }: { icono: string }) {
  if (icono === "shield")
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
        <path d="M12 3L4 7v5c0 5.25 3.5 9.74 8 11 4.5-1.26 8-5.75 8-11V7l-8-4z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  if (icono === "users")
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  // truck
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
      <rect x="1" y="3" width="15" height="13" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 8h4l3 5v4h-7V8z" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  );
}

export default function Hero() {
  const [visible, setVisible] = useState(false);
  const [imgIdx, setImgIdx]   = useState(0);

  const imagenesHero = (Cliente.hero as Record<string, unknown>).imagenesHero as string[] | undefined ?? [];
  const imagenIzquierda = (Cliente.hero as Record<string, unknown>).imagenIzquierda as string | undefined ?? "";
  const heroBadges = (Cliente.hero as Record<string, unknown>).heroBadges as Array<{linea1:string;linea2:string;icono:string}> | undefined
    ?? [
      { linea1: "Certificada",  linea2: "Demostradora oficial", icono: "shield" },
      { linea1: "200+",         linea2: "Clientes felices",     icono: "users"  },
      { linea1: "Siempre",      linea2: "Envío gratis",         icono: "truck"  },
    ];

  const tieneImagenes = imagenesHero.length > 0;
  const tieneIzq      = !!imagenIzquierda;

  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  // Rotar imagen derecha cada 5 segundos
  useEffect(() => {
    if (!tieneImagenes || imagenesHero.length < 2) return;
    const id = setInterval(() => setImgIdx(i => (i + 1) % imagenesHero.length), 5000);
    return () => clearInterval(id);
  }, [tieneImagenes, imagenesHero.length]);

  const waHref = `${Cliente.whatsapp.link}?text=${encodeURIComponent(Cliente.whatsapp.mensajeDefecto)}`;
  const badge0 = heroBadges[0];
  const badge1 = heroBadges[1];
  const badge2 = heroBadges[2];

  return (
    <section
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      style={{ background: "#080F0E" }}
    >
      {/* ── Gradient blobs ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute rounded-full" style={{ width:700, height:700, top:"-15%", right:"-10%", background:"radial-gradient(circle,rgba(88,163,157,.35) 0%,transparent 70%)", filter:"blur(60px)" }} />
        <div className="absolute rounded-full" style={{ width:500, height:500, bottom:"0%", left:"-5%",  background:"radial-gradient(circle,rgba(187,158,197,.28) 0%,transparent 70%)", filter:"blur(70px)" }} />
        <div className="absolute rounded-full" style={{ width:400, height:400, top:"40%", left:"30%",   background:"radial-gradient(circle,rgba(89,188,175,.12) 0%,transparent 70%)", filter:"blur(80px)" }} />
        <div className="absolute rounded-full" style={{ width:300, height:300, top:"10%", left:"40%",   background:"radial-gradient(circle,rgba(187,158,197,.15) 0%,transparent 70%)", filter:"blur(50px)" }} />
      </div>

      {/* ── Noise grain ── */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize:"200px" }} />

      {/* ── Contenido principal ── */}
      <div className={`relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pt-24 pb-10 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>

        {/* Layout: columnas en desktop, centrado en mobile */}
        <div className={`flex flex-col items-center lg:grid lg:gap-8 lg:items-center ${(tieneIzq || tieneImagenes) ? "lg:grid-cols-[1fr_auto_1fr]" : "lg:grid-cols-1"}`}>

          {/* ── Columna izquierda: foto Dai ── */}
          {(tieneIzq || tieneImagenes) && (
            <div className="hidden lg:block relative">
              <div className="relative rounded-3xl overflow-hidden w-64 xl:w-72 aspect-[3/4] shadow-2xl shadow-black/40">
                {tieneIzq ? (
                  <Image src={imagenIzquierda} alt="Daisy Benítez" fill className="object-cover object-top" sizes="300px" priority />
                ) : (
                  /* Placeholder elegante si no hay imagen */
                  <div className="absolute inset-0 flex items-center justify-center"
                    style={{ background: "linear-gradient(145deg, rgba(88,163,157,.22) 0%, rgba(15,38,35,.96) 100%)" }}>
                    <svg viewBox="0 0 64 64" fill="none" className="w-20 h-20 opacity-20">
                      <circle cx="32" cy="22" r="10" stroke="rgba(88,163,157,1)" strokeWidth="1.5"/>
                      <path d="M10 54c0-12.15 9.85-22 22-22s22 9.85 22 22" stroke="rgba(88,163,157,1)" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                )}
                {/* Degradado inferior */}
                <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />
              </div>

              {/* Badge 1 — esquina superior izquierda */}
              {badge0 && (
                <div className="absolute -top-3 -left-4 bg-white rounded-2xl px-3.5 py-2.5 shadow-xl shadow-black/20 flex items-center gap-2.5 min-w-[160px]">
                  <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(88,163,157,.12)", color: "#58A39D" }}>
                    <BadgeIcon icono={badge0.icono} />
                  </span>
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium leading-none mb-0.5">{badge0.linea1}</p>
                    <p className="text-xs font-bold text-gray-800 leading-tight">{badge0.linea2}</p>
                  </div>
                </div>
              )}

              {/* Punto de color en imagen izq */}
              <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full border-4 border-[#080F0E]"
                style={{ background: "linear-gradient(135deg,#58A39D,#BB9EC5)" }} />
            </div>
          )}

          {/* ── Centro: texto del hero ── */}
          <div className="text-center max-w-xl xl:max-w-2xl w-full">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8 border"
              style={{ background: "rgba(88,163,157,0.1)", borderColor: "rgba(88,163,157,0.25)" }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#58A39D" }} />
              <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#58A39D" }}>
                {Cliente.hero.badge}
              </span>
            </div>

            {/* Headline */}
            <h1 className="display-hero leading-none mb-2" style={{ color: "#ffffff" }}>
              {Cliente.hero.titulo1}
            </h1>
            <h1 className="display-hero leading-none mb-4" style={{ color: "#58A39D" }}>
              {Cliente.hero.titulo2}
            </h1>
            <h2 className="font-heading text-2xl sm:text-3xl mb-8 leading-tight" style={{ color: "#BB9EC5" }}>
              {Cliente.hero.subtitulo}
            </h2>

            <p className="text-base sm:text-lg max-w-lg mx-auto mb-10 font-light leading-relaxed" style={{ color: "rgba(255,255,255,0.72)" }}>
              {Cliente.hero.descripcion.split("\n").map((line, i, arr) => (
                <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
              ))}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="#productos"
                className="font-bold px-8 py-4 rounded-full text-sm tracking-wide transition-all hover:scale-105"
                style={{ background: "#58A39D", color: "#fff", boxShadow: "0 0 30px rgba(88,163,157,0.4)" }}>
                {Cliente.hero.cta1Texto}
              </a>
              <a href={waHref} target="_blank" rel="noopener noreferrer"
                className="font-semibold px-8 py-4 rounded-full text-sm transition-all hover:scale-105 border"
                style={{ borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.75)", background: "rgba(255,255,255,0.05)" }}>
                {Cliente.hero.cta2Texto}
              </a>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-3 sm:gap-6 mt-12 flex-wrap">
              {Cliente.hero.stats.map((stat, i) => (
                <span key={i} className="flex items-center gap-3 sm:gap-6">
                  <span className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.65)" }}>{stat}</span>
                  {i < Cliente.hero.stats.length - 1 && (
                    <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: "rgba(187,158,197,0.4)" }} />
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* ── Columna derecha: imágenes rotantes ── */}
          {(tieneIzq || tieneImagenes) && (
            <div className="hidden lg:block relative">
              <div className="relative rounded-3xl overflow-hidden w-64 xl:w-72 aspect-[3/4] shadow-2xl shadow-black/40">
                {tieneImagenes ? (
                  <>
                    {imagenesHero.map((src, i) => (
                      <Image
                        key={src}
                        src={src}
                        alt={`Essen Dai ${i + 1}`}
                        fill
                        className={`object-cover object-top transition-opacity duration-700 ${i === imgIdx ? "opacity-100" : "opacity-0"}`}
                        sizes="300px"
                        priority={i === 0}
                      />
                    ))}
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center"
                    style={{ background: "linear-gradient(145deg, rgba(187,158,197,.2) 0%, rgba(15,38,35,.96) 100%)" }}>
                    <svg viewBox="0 0 64 64" fill="none" className="w-20 h-20 opacity-20">
                      <circle cx="32" cy="22" r="10" stroke="rgba(187,158,197,1)" strokeWidth="1.5"/>
                      <path d="M10 54c0-12.15 9.85-22 22-22s22 9.85 22 22" stroke="rgba(187,158,197,1)" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                )}
                {/* Degradado inferior */}
                <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />

                {/* Dots indicadores de la rotación */}
                {tieneImagenes && imagenesHero.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {imagenesHero.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setImgIdx(i)}
                        className={`rounded-full transition-all ${i === imgIdx ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/40"}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Badge 2 — esquina superior derecha */}
              {badge1 && (
                <div className="absolute -top-3 -right-4 bg-white rounded-2xl px-3.5 py-2.5 shadow-xl shadow-black/20 flex items-center gap-2.5 min-w-[160px]">
                  <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(187,158,197,.15)", color: "#BB9EC5" }}>
                    <BadgeIcon icono={badge1.icono} />
                  </span>
                  <div>
                    <p className="text-base font-black text-gray-800 leading-none">{badge1.linea1}</p>
                    <p className="text-[10px] text-gray-400 font-medium">{badge1.linea2}</p>
                  </div>
                </div>
              )}

              {/* Badge 3 — esquina inferior derecha (oscuro) */}
              {badge2 && (
                <div className="absolute -bottom-4 -right-4 rounded-2xl px-4 py-3 shadow-xl shadow-black/30 flex items-center gap-3"
                  style={{ background: "#1A3330", border: "1px solid rgba(88,163,157,.2)" }}>
                  <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(88,163,157,.2)", color: "#58A39D" }}>
                    <BadgeIcon icono={badge2.icono} />
                  </span>
                  <div>
                    <p className="text-[10px] text-white/50 font-medium leading-none mb-0.5">{badge2.linea1}</p>
                    <p className="text-sm font-bold text-white leading-tight">{badge2.linea2}</p>
                  </div>
                </div>
              )}

              {/* Punto de color en imagen der */}
              <div className="absolute -bottom-2 -left-2 w-12 h-12 rounded-full border-4 border-[#080F0E]"
                style={{ background: "linear-gradient(135deg,#BB9EC5,#58A39D)" }} />
            </div>
          )}
        </div>
      </div>

      {/* ── Scroll hint ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4" style={{ color: "rgba(255,255,255,0.2)" }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {/* ── Diagonal bottom cut ── */}
      <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
        style={{ background: "linear-gradient(to bottom right, transparent 49.5%, #F4FAF8 50%)" }} />
    </section>
  );
}
