"use client";
import { useEffect, useState } from "react";
import { Cliente } from "@/config/cliente";

/* Diagonal dashes like the brand manual cover */
function Dashes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden>
      {/* Teal dashes */}
      {[
        { top: "8%",  left: "72%",  w: 80,  h: 14, rot: -40, color: "#58A39D" },
        { top: "14%", left: "84%",  w: 55,  h: 12, rot: -40, color: "#58A39D" },
        { top: "22%", left: "91%",  w: 70,  h: 12, rot: -40, color: "#58A39D" },
        { top: "35%", left: "78%",  w: 48,  h: 10, rot: -40, color: "#89BCAF" },
        { top: "48%", left: "88%",  w: 62,  h: 12, rot: -40, color: "#58A39D" },
        { top: "62%", left: "75%",  w: 45,  h: 10, rot: -40, color: "#89BCAF" },
        { top: "72%", left: "86%",  w: 75,  h: 13, rot: -40, color: "#58A39D" },
        { top: "82%", left: "79%",  w: 50,  h: 11, rot: -40, color: "#89BCAF" },
        /* Left side */
        { top: "15%", left: "1%",   w: 60,  h: 12, rot: -40, color: "#BB9EC5" },
        { top: "28%", left: "4%",   w: 40,  h: 10, rot: -40, color: "#89BCAF" },
        { top: "55%", left: "0%",   w: 70,  h: 12, rot: -40, color: "#BB9EC5" },
        { top: "70%", left: "3%",   w: 45,  h: 10, rot: -40, color: "#58A39D" },
        { top: "85%", left: "1%",   w: 55,  h: 11, rot: -40, color: "#89BCAF" },
      ].map((d, i) => (
        <span key={i} className="absolute rounded-full" style={{
          top: d.top, left: d.left,
          width: d.w, height: d.h,
          background: d.color,
          opacity: 0.13,
          transform: `rotate(${d.rot}deg)`,
        }} />
      ))}
    </div>
  );
}

export default function Hero() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);

  const waHref = `${Cliente.whatsapp.link}?text=${encodeURIComponent(Cliente.whatsapp.mensajeDefecto)}`;

  return (
    <section className="relative min-h-screen bg-fondo flex flex-col justify-center overflow-hidden px-6 sm:px-12 lg:px-20 pt-24 pb-16">
      <Dashes />

      {/* Soft blob behind headline */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-teal/8 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-lila/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Rotating badge */}
      <div className="absolute bottom-20 right-10 lg:right-24 w-28 h-28 hidden md:flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="absolute w-full h-full animate-spin" style={{ animationDuration: "20s" }}>
          <defs>
            <path id="circle-path" d="M 50,50 m -30,0 a 30,30 0 1,1 60,0 a 30,30 0 1,1 -60,0" />
          </defs>
          <text style={{ fontSize: "9px", letterSpacing: "2px", fill: "#58A39D", opacity: 0.5 }}>
            <textPath href="#circle-path">ESSEN DAI · BUENOS AIRES · 2025 · </textPath>
          </text>
        </svg>
        <div className="w-12 h-12 rounded-full bg-teal flex items-center justify-center shadow-lg shadow-teal/30">
          <span className="font-heading text-white text-sm">ED</span>
        </div>
      </div>

      {/* Main content */}
      <div className={`max-w-4xl relative z-10 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-teal/10 border border-teal/20 rounded-full px-4 py-1.5 mb-8">
          <span className="w-1.5 h-1.5 bg-teal rounded-full" />
          <span className="text-teal-dark text-xs font-semibold tracking-widest uppercase">Distribuidora Oficial · CABA</span>
        </div>

        {/* Headline */}
        <h1 className="display-hero text-texto mb-3 leading-none">
          COCINÁS
        </h1>
        <h1 className="display-hero text-teal mb-3 leading-none">
          MEJOR.
        </h1>
        <h2 className="font-heading text-lila text-3xl sm:text-4xl mb-8 leading-tight">
          Vivís mejor.
        </h2>

        <p className="text-texto-muted text-lg max-w-md mb-10 font-light leading-relaxed">
          Productos Essen originales con entrega a todo Argentina.<br />
          Atención de Daisy, directa y sin intermediarios.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap gap-4">
          <a href="#productos"
            className="bg-teal text-white font-bold px-8 py-4 rounded-full hover:bg-teal-dark transition-all text-sm tracking-wide shadow-md shadow-teal/25">
            Ver productos
          </a>
          <a href={waHref} target="_blank" rel="noopener noreferrer"
            className="border-2 border-teal/40 text-teal font-semibold px-8 py-4 rounded-full hover:border-teal hover:bg-teal/5 transition-all text-sm">
            Hablar con Daisy
          </a>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mt-14 text-texto-light text-sm flex-wrap">
          <span>150+ clientes</span>
          <span className="w-1 h-1 bg-lila rounded-full" />
          <span>5 años vendiendo Essen</span>
          <span className="w-1 h-1 bg-lila rounded-full" />
          <span>Envío gratis a todo el país</span>
          <span className="w-1 h-1 bg-lila rounded-full" />
          <span>2 años de garantía oficial</span>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-texto-light text-xs animate-bounce">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </section>
  );
}
