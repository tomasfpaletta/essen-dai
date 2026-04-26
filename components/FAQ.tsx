"use client";
import { useState } from "react";
import Link from "next/link";
import { faqItems, type FaqItem } from "@/config/faq";
import { cosasImportantesConfig } from "@/config/cosas-importantes";

export default function FAQ() {
  const [open, setOpen] = useState<string | null>(null);
  const cosasVisible = cosasImportantesConfig.visible;

  return (
    <section id="faq" className="py-24 bg-fondo px-6 sm:px-12 lg:px-20">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-teal mb-3">
            Preguntas frecuentes
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl text-texto mb-4">
            ¿Tenés dudas?{" "}
            <span className="text-teal">Las resolvemos</span>
          </h2>
          <p className="text-texto-muted text-sm max-w-md mx-auto">
            Todo lo que necesitás saber antes de comprar tus productos Essen.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqItems.map((item: FaqItem) => (
            <div key={item.id}
              className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                open === item.id ? "border-teal/30 shadow-sm shadow-teal/10" : "border-teal/10 hover:border-teal/25"
              }`}>
              <button onClick={() => setOpen(open === item.id ? null : item.id)}
                className="w-full flex items-center justify-between gap-4 text-left px-6 py-5">
                <span className={`font-semibold text-sm sm:text-base transition-colors ${
                  open === item.id ? "text-teal" : "text-texto"
                }`}>
                  {item.q}
                </span>
                <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                  open === item.id ? "bg-teal rotate-45" : "bg-teal/10"
                }`}>
                  <svg className={`w-3 h-3 ${open === item.id ? "text-white" : "text-teal"}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                </span>
              </button>
              {open === item.id && (
                <div className="px-6 pb-5 animate-fade-up">
                  <p className="text-texto-muted text-sm leading-relaxed">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── Banner Cosas importantes ── */}
        {cosasVisible && (
          <div className="mt-12 rounded-3xl overflow-hidden"
            style={{ background: "linear-gradient(135deg,#1A3330 0%,#0d2622 100%)" }}>
            <div className="flex flex-col sm:flex-row items-center gap-5 p-7">
              <div className="text-5xl flex-shrink-0">📋</div>
              <div className="flex-1 text-center sm:text-left">
                <p className="text-teal text-xs font-bold uppercase tracking-widest mb-1">Recursos</p>
                <h3 className="font-heading text-xl text-white mb-1.5">{cosasImportantesConfig.titulo}</h3>
                <p className="text-white/55 text-sm leading-relaxed">{cosasImportantesConfig.descripcion}</p>
              </div>
              <Link
                href="/cosas-importantes"
                className="flex-shrink-0 inline-flex items-center gap-2 bg-teal text-white font-bold px-5 py-3 rounded-xl text-sm hover:bg-teal/90 transition-colors shadow-lg shadow-teal/20"
              >
                Ver guías
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
