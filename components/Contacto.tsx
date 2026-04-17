import { Cliente } from "@/config/cliente";

function IgIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
    </svg>
  );
}

export default function Contacto() {
  const waHref = `${Cliente.whatsapp.link}?text=${encodeURIComponent(Cliente.whatsapp.mensajeDefecto)}`;

  return (
    <section id="contacto" className="py-28 bg-white px-6 sm:px-12 lg:px-20 border-t border-teal/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <div>
            <p className="text-teal text-xs font-semibold uppercase tracking-[0.2em] mb-4">Contacto</p>
            <h2 className="font-heading text-5xl sm:text-6xl text-texto leading-none mb-6">
              Hable<span className="text-teal">mos.</span>
            </h2>
            <p className="text-texto-muted text-base leading-relaxed max-w-md">
              ¿Tenés alguna duda? ¿Querés saber el precio de un producto? Escribime directamente y te respondo en minutos.
            </p>
          </div>

          {/* Right — actions */}
          <div className="space-y-4">
            <a href={waHref} target="_blank" rel="noopener noreferrer"
              className="group flex items-center justify-between w-full bg-teal/8 hover:bg-teal text-teal hover:text-white border border-teal/25 hover:border-teal px-8 py-6 rounded-2xl transition-all">
              <div>
                <p className="font-bold text-lg">WhatsApp</p>
                <p className="text-sm opacity-70">{Cliente.whatsapp.display}</p>
              </div>
              <span className="text-2xl group-hover:translate-x-2 transition-transform">→</span>
            </a>

            <a href={Cliente.instagram.url} target="_blank" rel="noopener noreferrer"
              className="group flex items-center justify-between w-full bg-lila/8 hover:bg-lila/15 border border-lila/20 hover:border-lila/40 px-8 py-6 rounded-2xl transition-all">
              <div className="flex items-center gap-3">
                <span className="text-lila"><IgIcon size={20} /></span>
                <div>
                  <p className="font-bold text-texto text-lg">Instagram</p>
                  <p className="text-texto-muted text-sm">@{Cliente.instagram.usuario}</p>
                </div>
              </div>
              <span className="text-texto-light text-2xl group-hover:translate-x-2 transition-transform group-hover:text-lila">→</span>
            </a>

            <div className="flex items-center gap-3 px-8 py-5 rounded-2xl bg-fondo border border-teal/10">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-texto-light flex-shrink-0">
                <path d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7z"/>
                <circle cx="12" cy="9" r="2.5"/>
              </svg>
              <div>
                <p className="text-texto font-medium text-sm">{Cliente.ciudad}</p>
                <p className="text-texto-light text-xs">Lunes a sábado · 9 a 20 hs</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
