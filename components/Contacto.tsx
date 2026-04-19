import { Cliente } from "@/config/cliente";

function IgIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
    </svg>
  );
}

export default function Contacto() {
  const waHref = `${Cliente.whatsapp.link}?text=${encodeURIComponent(Cliente.whatsapp.mensajeDefecto)}`;

  return (
    <section id="contacto" className="bg-gradient-to-b from-[#1A3330] to-[#0F2320] px-6 sm:px-12 lg:px-20 py-28 section-angle-top">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <div>
            <p className="text-teal/60 text-xs font-semibold uppercase tracking-[0.2em] mb-4">Contacto</p>
            <h2 className="font-heading text-5xl sm:text-6xl text-white leading-none mb-6">
              Hable<span className="text-teal">mos.</span>
            </h2>
            <p className="text-white/50 text-base leading-relaxed max-w-md">
              ¿Tenés alguna duda? ¿Querés saber el precio de un producto? Escribime directamente y te respondo en minutos.
            </p>
          </div>

          {/* Right — actions */}
          <div className="space-y-4">
            <a href={waHref} target="_blank" rel="noopener noreferrer"
              className="group flex items-center justify-between w-full bg-teal/15 hover:bg-teal border border-teal/30 hover:border-teal px-8 py-6 rounded-2xl transition-all">
              <div>
                <p className="font-bold text-lg text-white">WhatsApp</p>
                <p className="text-white/50 text-sm">{Cliente.whatsapp.display}</p>
              </div>
              <span className="text-white/60 group-hover:text-white text-2xl group-hover:translate-x-2 transition-all">→</span>
            </a>

            <a href={Cliente.instagram.url} target="_blank" rel="noopener noreferrer"
              className="group flex items-center justify-between w-full bg-lila/10 hover:bg-lila/20 border border-lila/20 hover:border-lila/50 px-8 py-6 rounded-2xl transition-all">
              <div className="flex items-center gap-3">
                <span className="text-lila/80 group-hover:text-lila transition-colors"><IgIcon size={20} /></span>
                <div>
                  <p className="font-bold text-white text-lg">Instagram</p>
                  <p className="text-white/40 text-sm">@{Cliente.instagram.usuario}</p>
                </div>
              </div>
              <span className="text-white/40 text-2xl group-hover:translate-x-2 group-hover:text-lila transition-all">→</span>
            </a>

            <div className="flex items-center gap-3 px-8 py-5 rounded-2xl bg-white/5 border border-white/10">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-white/30 flex-shrink-0">
                <path d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7z"/>
                <circle cx="12" cy="9" r="2.5"/>
              </svg>
              <div>
                <p className="text-white/70 font-medium text-sm">{Cliente.ciudad}</p>
                <p className="text-white/30 text-xs">Lunes a sábado · 9 a 20 hs</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
