import { Cliente } from "@/config/cliente";

const STATS = [
  { n: "200+", label: "familias equipadas" },
  { n: "30",   label: "años de la marca Essen" },
  { n: "2",    label: "años de garantía oficial" },
  { n: "100%", label: "productos originales" },
];

const BULLETS = [
  "Entrega a todo Argentina con Andreani",
  "Pago en cuotas sin interés",
  "Asesoramiento personalizado por WhatsApp",
  "Garantía oficial de 2 años en todos los productos",
  "Stock permanente disponible",
];

const MARQUEE_ITEMS = ["ESSEN", "CALIDAD", "GARANTÍA", "CABA", "ARGENTINA", "ORIGINAL", "ESSEN", "CALIDAD", "GARANTÍA", "CABA", "ARGENTINA", "ORIGINAL"];

export default function Editorial() {
  return (
    <section id="nosotros" className="bg-[#1A3330] overflow-hidden section-angle-both">

      {/* ── Stats row ── */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 pt-24 pb-16">
        <p className="text-teal/60 text-xs font-semibold uppercase tracking-[0.2em] mb-12">¿Por qué Essen?</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x divide-white/10">
          {STATS.map(s => (
            <div key={s.n} className="md:px-10 first:pl-0">
              <div className="display-number text-teal mb-2">{s.n}</div>
              <div className="h-px bg-lila/50 w-8 mb-3" />
              <p className="text-white/50 text-sm font-light leading-tight">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Marquee ── */}
      <div className="overflow-hidden border-t border-white/5 py-5 bg-white/3">
        <div className="flex whitespace-nowrap animate-marquee-slow">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="text-4xl font-heading text-white/8 mx-8 tracking-wide select-none">{item}</span>
          ))}
        </div>
      </div>

      {/* ── Carta de presentación ── */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 pt-16 pb-24">
        <div className="grid lg:grid-cols-5 gap-8 items-stretch">

          {/* Tarjeta izquierda */}
          <div className="lg:col-span-2">
            <div
              className="relative rounded-3xl overflow-hidden h-full min-h-[340px] flex flex-col justify-end border border-white/8"
              style={{ background: 'linear-gradient(145deg, rgba(88,163,157,0.18) 0%, rgba(15,38,35,0.95) 100%)' }}
            >
              {/* Fondo decorativo */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-60"
                  style={{ background: 'radial-gradient(circle, rgba(88,163,157,0.15) 0%, transparent 70%)', transform: 'translate(25%, -25%)' }} />
                <div className="absolute bottom-0 left-0 w-36 h-36 rounded-full opacity-40"
                  style={{ background: 'radial-gradient(circle, rgba(187,158,197,0.10) 0%, transparent 70%)', transform: 'translate(-25%, 25%)' }} />
              </div>

              {/* Placeholder foto */}
              <div className="absolute inset-0 flex items-start justify-center pt-10">
                <div className="w-28 h-28 rounded-full border-2 border-teal/25 flex items-center justify-center"
                  style={{ background: 'rgba(88,163,157,0.10)' }}>
                  <svg viewBox="0 0 64 64" fill="none" className="w-14 h-14">
                    <circle cx="32" cy="22" r="10" stroke="rgba(88,163,157,0.45)" strokeWidth="1.5"/>
                    <path d="M10 54c0-12.15 9.85-22 22-22s22 9.85 22 22" stroke="rgba(88,163,157,0.45)" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>

              {/* Contenido inferior */}
              <div className="relative z-10 p-7 pt-44">
                <span className="inline-block bg-teal/15 border border-teal/25 text-teal text-[11px] font-semibold px-3 py-1 rounded-full mb-4 tracking-widest uppercase">
                  Distribuidora Oficial
                </span>
                <h3 className="font-heading text-white text-4xl leading-none mb-1">
                  Daisy
                </h3>
                <h3 className="font-heading text-teal text-4xl leading-none mb-3">
                  Benítez.
                </h3>
                <p className="text-white/35 text-xs mb-5 tracking-wide">Buenos Aires · Argentina</p>

                <a href={Cliente.instagram.url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-white/40 hover:text-teal text-xs transition-colors group">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <circle cx="12" cy="12" r="4"/>
                    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
                  </svg>
                  @{Cliente.instagram.usuario}
                  <span className="group-hover:translate-x-0.5 transition-transform opacity-0 group-hover:opacity-100">→</span>
                </a>
              </div>

              {/* Acento lateral */}
              <div className="absolute top-8 bottom-8 left-0 w-0.5 rounded-r"
                style={{ background: 'linear-gradient(to bottom, transparent, rgba(88,163,157,0.6), transparent)' }} />
            </div>
          </div>

          {/* Columna derecha */}
          <div className="lg:col-span-3 flex flex-col justify-center gap-7">

            <div>
              <p className="text-teal/60 text-[11px] font-semibold uppercase tracking-[0.2em] mb-4">Mi historia</p>
              <p className="text-white/70 text-base leading-relaxed mb-3">
                Soy distribuidora oficial de Essen en Buenos Aires. Llevo años ayudando a familias a elegir los productos perfectos para su cocina, con atención personalizada y honesta.
              </p>
              <p className="text-white/50 text-sm leading-relaxed">
                Cada producto que ofrezco es 100% original, con garantía oficial y enviado directamente a tu puerta desde CABA.
              </p>
            </div>

            {/* Bullets */}
            <div className="grid sm:grid-cols-2 gap-2">
              {BULLETS.map(item => (
                <div key={item} className="flex items-start gap-3 group">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-teal/25 transition-colors"
                    style={{ background: 'rgba(88,163,157,0.15)' }}>
                    <span className="w-1.5 h-1.5 bg-teal rounded-full" />
                  </span>
                  <span className="text-white/50 text-sm leading-snug group-hover:text-white/70 transition-colors">{item}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <a
              href={`${Cliente.whatsapp.link}?text=${encodeURIComponent("Hola Daisy! Quiero conocer más sobre los productos Essen.")}`}
              target="_blank" rel="noopener noreferrer"
              className="self-start inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all hover:scale-[1.02] active:scale-95"
              style={{ background: 'rgba(88,163,157,0.12)', border: '1px solid rgba(88,163,157,0.25)', color: 'rgba(126,207,202,0.9)' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.8 }}>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Consultame por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
