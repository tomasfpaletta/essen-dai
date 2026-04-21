"use client";
import { useState } from "react";
import { faqItems, type FaqItem } from "@/config/faq";

export default function FAQ() {
  const [open, setOpen] = useState<string | null>(null);

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
      </div>
    </section>
  );
}
