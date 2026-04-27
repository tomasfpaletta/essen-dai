"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Cliente } from "@/config/cliente";

const LINKS = [
  { href: "/#productos",   label: "Productos" },
  { href: "/#nosotros",    label: "Nosotros" },
  { href: "/#equipo",      label: "Sumate" },
  { href: "/#contacto",    label: "Contacto" },
];

function IgIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <linearGradient id="ig-nav" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#FCAF45"/>
          <stop offset="35%"  stopColor="#FD1D1D"/>
          <stop offset="70%"  stopColor="#E1306C"/>
          <stop offset="100%" stopColor="#833AB4"/>
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="url(#ig-nav)"/>
      <circle cx="12" cy="12" r="4" stroke="url(#ig-nav)"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="url(#ig-nav)" stroke="none"/>
    </svg>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const waHref = `${Cliente.whatsapp.link}?text=${encodeURIComponent(Cliente.whatsapp.mensajeDefecto)}`;

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Cerrar menú al hacer scroll
  useEffect(() => {
    if (menuOpen) {
      const fn = () => setMenuOpen(false);
      window.addEventListener("scroll", fn, { passive: true, once: true });
    }
  }, [menuOpen]);

  function handleLinkClick() {
    setMenuOpen(false);
  }

  return (
    <>
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-auto transition-all duration-300">
        <div
          className="flex items-center gap-3 sm:gap-5 px-3 sm:px-4 py-2 rounded-full border transition-all duration-500"
          style={scrolled ? {
            background: "rgba(255,255,255,0.96)",
            borderColor: "rgba(88,163,157,0.2)",
            boxShadow: "0 4px 30px rgba(88,163,157,0.12)",
            backdropFilter: "blur(16px)",
          } : {
            background: "rgba(8,15,14,0.55)",
            borderColor: "rgba(88,163,157,0.25)",
            boxShadow: "0 4px 30px rgba(0,0,0,0.3)",
            backdropFilter: "blur(16px)",
          }}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src={scrolled
                ? "/images/logo/isoLogoFondoBlanco.jpeg"
                : "/images/logo/isoLogoCeleste.jpeg"}
              alt="Master Essen"
              width={120}
              height={52}
              className="h-8 w-auto object-contain rounded-md transition-all duration-300"
              priority
            />
          </Link>

          {/* Nav links — desktop */}
          <nav className="hidden md:flex items-center gap-5">
            {LINKS.map(l => (
              <a key={l.href} href={l.href}
                className="text-sm font-medium transition-colors whitespace-nowrap"
                style={{ color: scrolled ? "rgba(26,51,48,0.6)" : "rgba(255,255,255,0.55)" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#58A39D")}
                onMouseLeave={e => (e.currentTarget.style.color = scrolled ? "rgba(26,51,48,0.6)" : "rgba(255,255,255,0.55)")}
              >
                {l.label}
              </a>
            ))}
          </nav>

          <span className="hidden md:block w-px h-4" style={{ background: scrolled ? "rgba(88,163,157,0.2)" : "rgba(255,255,255,0.15)" }} />

          {/* Instagram */}
          <a href={Cliente.instagram.url} target="_blank" rel="noopener noreferrer"
            className="flex-shrink-0 p-1.5 rounded-lg transition-all hover:scale-110"
            title={`@${Cliente.instagram.usuario}`}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = scrolled ? "rgba(131,58,180,0.08)" : "rgba(255,255,255,0.1)" }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "" }}
          >
            <IgIcon />
          </a>

          {/* WhatsApp CTA — desktop */}
          <a href={waHref} target="_blank" rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-white font-bold text-xs px-4 py-2 rounded-full transition-all whitespace-nowrap flex-shrink-0"
            style={{ background: "#58A39D", boxShadow: scrolled ? "none" : "0 0 16px rgba(88,163,157,0.4)" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#1A3330")}
            onMouseLeave={e => (e.currentTarget.style.background = "#58A39D")}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 flex-shrink-0">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.555 4.122 1.524 5.855L.057 23.215a.75.75 0 00.928.928l5.36-1.467A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.9 0-3.681-.523-5.205-1.432l-.372-.224-3.862 1.057 1.057-3.862-.224-.372A9.944 9.944 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            </svg>
            Consultar
          </a>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="flex md:hidden items-center justify-center w-8 h-8 rounded-lg transition-colors flex-shrink-0"
            style={{ color: scrolled ? "rgba(26,51,48,0.7)" : "rgba(255,255,255,0.75)" }}
            aria-label="Menú"
          >
            {menuOpen ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-5 h-5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-5 h-5">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* ── Menú mobile desplegable ── */}
      {menuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 md:hidden"
            style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
            onClick={() => setMenuOpen(false)}
          />

          {/* Panel */}
          <div
            className="fixed top-[4.5rem] left-1/2 -translate-x-1/2 z-50 md:hidden w-[min(340px,90vw)] rounded-2xl overflow-hidden shadow-2xl shadow-black/30"
            style={{ background: "rgba(8,15,14,0.97)", border: "1px solid rgba(88,163,157,0.2)" }}
          >
            <nav className="flex flex-col p-2 gap-1">
              {LINKS.map(l => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(88,163,157,0.12)"; (e.currentTarget as HTMLAnchorElement).style.color = "#58A39D" }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = ""; (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.7)" }}
                >
                  {l.label}
                </a>
              ))}
            </nav>

            <div className="px-3 pb-3 pt-1" style={{ borderTop: "1px solid rgba(88,163,157,0.1)" }}>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleLinkClick}
                className="flex items-center justify-center gap-2 w-full text-white font-bold text-sm py-3 rounded-xl transition-all"
                style={{ background: "#58A39D" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#1A3330")}
                onMouseLeave={e => (e.currentTarget.style.background = "#58A39D")}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.555 4.122 1.524 5.855L.057 23.215a.75.75 0 00.928.928l5.36-1.467A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.9 0-3.681-.523-5.205-1.432l-.372-.224-3.862 1.057 1.057-3.862-.224-.372A9.944 9.944 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                </svg>
                Consultar por WhatsApp
              </a>
            </div>
          </div>
        </>
      )}
    </>
  );
}
