import Link from "next/link";
import { Cliente } from "@/config/cliente";

export default function Footer() {
  const year = new Date().getFullYear();
  const waHref = `${Cliente.whatsapp.link}?text=${encodeURIComponent(Cliente.whatsapp.mensajeDefecto)}`;

  return (
    <footer className="bg-texto border-t border-white/5 px-6 sm:px-12 lg:px-20 py-10">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-teal flex items-center justify-center">
            <span className="font-heading text-white text-xs">ED</span>
          </div>
          <span className="font-heading text-white/60 text-sm tracking-wide">Essen Dai</span>
        </Link>
        <p className="text-white/25 text-xs text-center">
          &copy; {year} {Cliente.nombre} · Distribuidora Essen Argentina
        </p>
        <div className="flex items-center gap-4 text-white/30 text-xs">
          <a href={Cliente.instagram.url} target="_blank" rel="noopener noreferrer"
            className="hover:text-teal transition-colors">Instagram</a>
          <a href={waHref} target="_blank" rel="noopener noreferrer"
            className="hover:text-teal transition-colors">WhatsApp</a>
        </div>
      </div>
    </footer>
  );
}
