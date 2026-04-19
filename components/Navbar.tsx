"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Cliente } from "@/config/cliente";

const LINKS = [
  { href: "#productos",   label: "Productos" },
  { href: "#nosotros",    label: "Nosotros" },
  { href: "#testimonios", label: "Opiniones" },
  { href: "#contacto",    label: "Contacto" },
];

function IgIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
    </svg>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const waHref = `${Cliente.whatsapp.link}?text=${encodeURIComponent(Cliente.whatsapp.mensajeDefecto)}`;

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-auto transition-all duration-300`}>
      <div className={`flex items-center gap-5 px-4 py-2.5 rounded-full border transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-teal/20 shadow-lg shadow-teal/10"
          : "bg-white/80 backdrop-blur-sm border-teal/10 shadow-sm"
      }`}>

        {/* Logo */}
        <Link href="/" className="flex items-center flex-shrink-0">
          <Image
            src="/images/logo/isoLogoFondoBlanco.jpeg"
            alt="Master Essen"
            width={120}
            height={52}
            className="h-9 w-auto object-contain rounded-md"
            priority
          />
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-5">
          {LINKS.map(l => (
            <a key={l.href} href={l.href}
              className="text-texto-muted hover:text-teal text-sm font-medium transition-colors whitespace-nowrap">
              {l.label}
            </a>
          ))}
        </nav>

        <span className="hidden md:block w-px h-4 bg-teal/20" />

        {/* Instagram */}
        <a href={Cliente.instagram.url} target="_blank" rel="noopener noreferrer"
          className="text-texto-light hover:text-lila transition-colors flex-shrink-0"
          title={`@${Cliente.instagram.usuario}`}>
          <IgIcon />
        </a>

        {/* WhatsApp CTA */}
        <a href={waHref} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 bg-teal text-white font-bold text-xs px-4 py-2 rounded-full hover:bg-teal-dark transition-all whitespace-nowrap flex-shrink-0 shadow-sm">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.555 4.122 1.524 5.855L.057 23.215a.75.75 0 00.928.928l5.36-1.467A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.9 0-3.681-.523-5.205-1.432l-.372-.224-3.862 1.057 1.057-3.862-.224-.372A9.944 9.944 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
          </svg>
          Consultar
        </a>
      </div>
    </header>
  );
}
