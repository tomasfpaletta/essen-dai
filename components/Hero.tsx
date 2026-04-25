"use client";
import { useEffect, useState } from "react";
import { Cliente } from "@/config/cliente";

export default function Hero() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  const waHref = `${Cliente.whatsapp.link}?text=${encodeURIComponent(Cliente.whatsapp.mensajeDefecto)}`;

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden" style={{ background: "#080F0E" }}>

      {/* ── Gradient blobs ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {/* Teal blob - top right */}
        <div className="absolute rounded-full"
          style={{
            width: 700, height: 700, top: "-15%", right: "-10%",
            background: "radial-gradient(circle, rgba(88,163,157,0.35) 0%, transparent 70%)",
            filter: "blur(60px)"
          }} />
        {/* Lila blob - bottom left */}
        <div className="absolute rounded-full"
          style={{
            width: 500, height: 500, bottom: "0%", left: "-5%",
            background: "radial-gradient(circle, rgba(187,158,197,0.28) 0%, transparent 70%)",
            filter: "blur(70px)"
          }} />
        {/* Teal mid blob */}
        <div className="absolute rounded-full"
          style={{
            width: 400, height: 400, top: "40%", left: "30%",
            background: "radial-gradient(circle, rgba(89,188,175,0.12) 0%, transparent 70%)",
            filter: "blur(80px)"
          }} />
        {/* Warm accent - top center */}
        <div className="absolute rounded-full"
          style={{
            width: 300, height: 300, top: "10%", left: "40%",
            background: "radial-gradient(circle, rgba(187,158,197,0.15) 0%, transparent 70%)",
            filter: "blur(50px)"
          }} />
      </div>

      {/* ── Noise grain overlay ── */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "200px"
        }} />

      {/* ── Main content — centrado ── */}
      <div className={`relative z-10 text-center px-6 sm:px-12 max-w-5xl mx-auto transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>

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
          {Cliente.hero.descripcion.split('\n').map((line, i, arr) => (
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
        <div className="flex items-center justify-center gap-3 sm:gap-6 mt-16 flex-wrap">
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