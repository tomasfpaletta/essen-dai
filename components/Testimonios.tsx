const REVIEWS = [
  { name: "Laura M.",    city: "Palermo, CABA",     text: "Compre la cacerola de 24cm y es increible. Se calienta parejo y no se pega nada. Daisy me ayudo a elegir el tamaño correcto.", stars: 5 },
  { name: "Carlos R.",   city: "Rosario, Santa Fe", text: "Recibi todo en 3 dias. El packaging perfecto y los productos tal cual se muestran. Muy conforme con la atencion.", stars: 5 },
  { name: "Patricia G.", city: "Córdoba Capital",   text: "Tenia dudas sobre que modelo elegir. Daisy me explico todo con paciencia. Termine comprando el flip y lo uso todos los dias.", stars: 5 },
  { name: "Marcela T.",  city: "Mendoza",           text: "Los mejores utensilios que tuve. La sarten de 24cm es perfecta para hacer tortillas. Super recomendable.", stars: 5 },
  { name: "Diego F.",    city: "La Plata, BA",      text: "Excelente atencion de Daisy. Me oriento bien sobre los productos y el envio fue rapido. Volvere a comprar.", stars: 5 },
  { name: "Romina A.",   city: "Tucumán",           text: "La cafetera es una maravilla. El cafe sale perfecto cada mañana. Y el precio con cuotas muy conveniente.", stars: 5 },
  { name: "Pablo S.",    city: "Mar del Plata",     text: "Me regalo la cacerola de 18cm a mi señora y quedo encantada. Ahora ya compramos el wok tambien. Calidad premium.", stars: 5 },
  { name: "Valeria C.",  city: "Salta",             text: "Primera vez que compro Essen y no sera la ultima. Calidad increible y Daisy siempre disponible para consultas.", stars: 5 },
  { name: "Hernan B.",   city: "Santa Fe",          text: "El set de utensilios es impecable. Material solido, facil de limpiar. Lo recomiendo a cualquiera.", stars: 5 },
  { name: "Monica P.",   city: "Neuquén",           text: "Daisy conoce muy bien cada producto. Me guio perfecto y el envio llego intacto. Muy profesional.", stars: 5 },
  { name: "Gustavo L.",  city: "Entre Ríos",        text: "La cuadrada Essen es espectacular para carnes. Me ahorre el aceite y los resultados son increibles.", stars: 5 },
  { name: "Silvana R.",  city: "Chaco",             text: "Excelente. Compre para mi mama y ella quedo super feliz. Los productos son de primera calidad.", stars: 5 },
];

// Accent colors from the brand palette
const ACCENTS = ["#58A39D", "#89BCAF", "#BB9EC5", "#58A39D"];

function TestimonioCard({ r, idx }: { r: typeof REVIEWS[0]; idx: number }) {
  const accent = ACCENTS[idx % ACCENTS.length];
  return (
    <div className="w-72 flex-shrink-0 bg-white rounded-2xl p-6 border border-teal/10 mx-3 shadow-sm whitespace-normal"
      style={{ borderLeftColor: accent, borderLeftWidth: "3px" }}>
      <div className="flex gap-0.5 mb-3">
        {[...Array(r.stars)].map((_, i) => (
          <span key={i} style={{ color: accent }} className="text-sm">★</span>
        ))}
      </div>
      <p className="text-texto-muted text-sm leading-relaxed italic mb-4">&ldquo;{r.text}&rdquo;</p>
      <div>
        <p className="text-texto font-semibold text-sm">{r.name}</p>
        <p className="text-texto-light text-xs">{r.city}</p>
      </div>
    </div>
  );
}

export default function Testimonios() {
  const row1 = REVIEWS.slice(0, 6);
  const row2 = REVIEWS.slice(6, 12);

  return (
    <section id="testimonios" className="py-24 bg-white overflow-hidden">
      {/* Header */}
      <div className="px-6 sm:px-12 lg:px-20 mb-12">
        <p className="text-teal text-xs font-semibold uppercase tracking-[0.2em] mb-3">Opiniones</p>
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <h2 className="display-hero text-texto leading-none">
            LO QUE<br /><span className="text-teal">DICEN.</span>
          </h2>
          <p className="text-texto-light text-sm sm:mb-3 sm:ml-4">★★★★★ 4.9 · 150+ opiniones</p>
        </div>
      </div>

      {/* Row 1 — scrolls left */}
      <div className="flex whitespace-nowrap animate-marquee mb-4" style={{ animationDuration: "50s" }}>
        {[...row1, ...row1].map((r, i) => (
          <TestimonioCard key={i} r={r} idx={i} />
        ))}
      </div>

      {/* Row 2 — scrolls right */}
      <div className="flex whitespace-nowrap" style={{ animation: "marquee 65s linear infinite reverse" }}>
        {[...row2, ...row2].map((r, i) => (
          <TestimonioCard key={i} r={r} idx={i + 1} />
        ))}
      </div>
    </section>
  );
}
