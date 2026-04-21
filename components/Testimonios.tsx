import { Cliente } from "@/config/cliente";
import { testimonios, type Testimonio } from "@/config/testimonios";

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: n }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-amber-400">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
  );
}

export default function Testimonios() {
  const waHref = `${Cliente.whatsapp.link}?text=${encodeURIComponent("Hola Daisy! Quiero saber más sobre los productos Essen.")}`;
  const activos = testimonios.filter((t: Testimonio) => t.texto.trim() !== '');

  if (activos.length === 0) return null;

  return (
    <section id="testimonios" className="py-16 bg-white px-6 sm:px-12 lg:px-20">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-teal text-xs font-semibold uppercase tracking-[0.2em] mb-2">Opiniones</p>
          <h2 className="font-heading text-texto text-2xl sm:text-3xl">
            Lo que dicen las clientas
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {activos.map((t: Testimonio) => (
            <div
              key={t.id}
              className="bg-fondo rounded-2xl border border-teal/10 p-5 flex flex-col gap-3"
            >
              <Stars n={t.estrellas} />
              <p className="text-texto text-sm leading-relaxed flex-1">
                &ldquo;{t.texto}&rdquo;
              </p>
              <div className="border-t border-teal/10 pt-3">
                <p className="text-texto font-semibold text-xs">{t.nombre}</p>
                <p className="text-texto-muted text-[11px]">{t.lugar}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal text-sm font-semibold hover:text-teal-dark transition-colors"
          >
            ¿Tenés dudas? Hablá con Daisy →
          </a>
        </div>
      </div>
    </section>
  );
}
