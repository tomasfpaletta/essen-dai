"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Cliente } from "@/config/cliente";

export default function WAPopup() {
  const [visible, setVisible] = useState(false);
  const waHref = `${Cliente.whatsapp.link}?text=${encodeURIComponent("Hola Daisy! Estoy mirando los productos y queria consultar.")}`;

  useEffect(() => {
    if (localStorage.getItem("dai_popup_dismissed")) return;
    const t = setTimeout(() => setVisible(true), Cliente.popupDelay * 1000);
    return () => clearTimeout(t);
  }, []);

  function dismiss() {
    setVisible(false);
    localStorage.setItem("dai_popup_dismissed", "1");
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-24 right-6 z-50 w-80 animate-fade-up">
      <div className="bg-white border border-teal/20 rounded-2xl p-5 shadow-2xl shadow-teal/20">
        <button onClick={dismiss} className="absolute top-3 right-3 text-texto-light hover:text-texto transition-colors">
          <X size={16} />
        </button>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-teal flex items-center justify-center flex-shrink-0">
            <span className="font-heading text-white text-sm">D</span>
          </div>
          <div>
            <p className="text-texto font-semibold text-sm">Daisy Benítez</p>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-teal rounded-full" />
              <span className="text-teal text-xs font-medium">En línea</span>
            </div>
          </div>
        </div>
        <p className="text-texto-muted text-sm leading-relaxed mb-4">
          ¡Hola! Puedo ayudarte a elegir el producto Essen ideal. Escribime cuando quieras.
        </p>
        <a href={waHref} target="_blank" rel="noopener noreferrer" onClick={dismiss}
          className="block w-full bg-teal text-white font-bold text-sm text-center py-3 rounded-xl hover:bg-teal-dark transition-all">
          Iniciar conversación
        </a>
      </div>
    </div>
  );
}
