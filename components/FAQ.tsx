"use client";
import { useState } from "react";

const QS = [
  { q: "¿Hacen envíos a todo el país?", a: "Sí, enviamos a todo Argentina con Andreani. El envío es gratis y llega directamente a tu domicilio en 3 a 5 días hábiles." },
  { q: "¿Cuáles son los medios de pago?", a: "Aceptamos transferencia bancaria, tarjeta de crédito con hasta 18 cuotas sin interés a través de Mercado Pago, débito y efectivo. Consultá por el banco que uses." },
  { q: "¿Los productos tienen garantía?", a: "Sí. Todos los productos Essen cuentan con garantía oficial de 2 años contra defectos de fabricación." },
  { q: "¿Son compatibles con cocinas de inducción?", a: "La mayoría de los productos Essen son aptos para todos los tipos de cocina: gas, eléctrica, vitrocerámica e inducción." },
  { q: "¿Cómo hago un pedido?", a: "Escribime por WhatsApp, te paso precios y disponibilidad, acordamos el pago y coordino el envío. Todo directo, sin intermediarios." },
  { q: "¿Puedo ver los productos antes de comprar?", a: "Podés ver fotos y consultar dudas por WhatsApp o Instagram. También organizo demostraciones en CABA si lo necesitás." },
  { q: "¿Cuánto tardan en llegar los pedidos?", a: "En CABA el envío suele llegar en 1-2 días hábiles. Para el interior del país, entre 3 y 7 días hábiles dependiendo la zona." },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

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
          {QS.map((item, i) => (
            <div key={i}
              className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                open === i ? "border-teal/30 shadow-sm shadow-teal/10" : "border-teal/10 hover:border-teal/25"
              }`}>
              <button onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 text-left px-6 py-5">
                <span className={`font-semibold text-sm sm:text-base transition-colors ${
                  open === i ? "text-teal" : "text-texto"
                }`}>
                  {item.q}
                </span>
                <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                  open === i ? "bg-teal rotate-45" : "bg-teal/10"
                }`}>
                  <svg className={`w-3 h-3 ${open === i ? "text-white" : "text-teal"}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                </span>
              </button>
              {open === i && (
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
