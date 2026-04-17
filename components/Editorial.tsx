import { Cliente } from "@/config/cliente";

const STATS = [
  { n: "200+", label: "familias equipadas" },
  { n: "30",   label: "años de la marca Essen" },
  { n: "2",    label: "años de garantía oficial" },
  { n: "100%", label: "productos originales" },
];

const MARQUEE_ITEMS = ["ESSEN", "CALIDAD", "GARANTÍA", "CABA", "ARGENTINA", "ORIGINAL", "ESSEN", "CALIDAD", "GARANTÍA", "CABA", "ARGENTINA", "ORIGINAL"];

export default function Editorial() {
  return (
    <section id="nosotros" className="bg-fondo border-y border-teal/10">
      {/* Stats row */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-20">
        <p className="text-teal text-xs font-semibold uppercase tracking-[0.2em] mb-12">¿Por qué Essen?</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x divide-teal/10">
          {STATS.map(s => (
            <div key={s.n} className="md:px-10 first:pl-0">
              <div className="display-number text-teal mb-1">{s.n}</div>
              <div className="h-px bg-lila w-8 mb-3" />
              <p className="text-texto-muted text-sm font-light leading-tight">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Marquee */}
      <div className="overflow-hidden border-t border-teal/8 py-5 bg-teal/5">
        <div className="flex whitespace-nowrap animate-marquee-slow">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="text-4xl font-heading text-teal/15 mx-8 tracking-wide select-none">{item}</span>
          ))}
        </div>
      </div>

      {/* Daisy bio */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 pb-20 pt-14">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <h3 className="font-heading text-3xl text-texto mb-4">
              Soy <span className="text-teal">Daisy Benítez.</span>
            </h3>
            <p className="text-texto-muted leading-relaxed text-base mb-4">
              Soy distribuidora oficial de Essen en Buenos Aires. Llevo años ayudando a familias a elegir los productos perfectos para su cocina, con atención personalizada y honesta.
            </p>
            <p className="text-texto-muted leading-relaxed text-base mb-6">
              Cada producto que ofrezco es 100% original, con garantía oficial y enviado directamente a tu puerta desde CABA.
            </p>
            <a href={Cliente.instagram.url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-texto-light hover:text-lila text-sm transition-colors group">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
              </svg>
              @{Cliente.instagram.usuario}
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>
          <div className="space-y-3">
            {[
              "Entrega a todo Argentina con Andreani",
              "Pago en cuotas sin interés",
              "Asesoramiento personalizado por WhatsApp",
              "Garantía oficial de 2 años en todos los productos",
              "Stock permanente disponible",
            ].map(item => (
              <div key={item} className="flex items-start gap-3 group">
                <span className="w-5 h-5 rounded-full bg-teal/15 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-teal/25 transition-colors">
                  <span className="w-1.5 h-1.5 bg-teal rounded-full" />
                </span>
                <span className="text-texto-muted text-sm leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
