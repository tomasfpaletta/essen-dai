import Link from "next/link";
import Image from "next/image";
import { Cliente } from "@/config/cliente";

export default function Footer() {
  const year = new Date().getFullYear();
  const waHref = `${Cliente.whatsapp.link}?text=${encodeURIComponent(Cliente.whatsapp.mensajeDefecto)}`;

  return (
    <footer className="bg-texto border-t border-white/5 px-6 sm:px-12 lg:px-20 py-10">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo/isoLogoCeleste.jpeg"
            alt="Master Essen"
            width={120}
            height={52}
            className="h-8 w-auto object-contain rounded-md opacity-90 hover:opacity-100 transition-opacity"
          />
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
