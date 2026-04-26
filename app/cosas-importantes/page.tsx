import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cosasImportantes, cosasImportantesConfig } from "@/config/cosas-importantes";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cosas importantes — Essen Dai",
  description: "Guías, consejos y recursos sobre el cuidado y uso de tus productos Essen.",
};

// Extrae el ID de YouTube de una URL
function getYouTubeId(url: string): string | null {
  const short = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (short) return short[1];
  const long = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (long) return long[1];
  return null;
}

export default function CosasImportantesPage() {
  if (!cosasImportantesConfig.visible) return null;

  const secciones = cosasImportantes.filter(s => s.activo);

  return (
    <div className="min-h-screen bg-fondo">
      <Navbar />

      {/* ── Hero de sección ── */}
      <div
        className="relative pt-32 pb-16 px-6 text-center overflow-hidden"
        style={{ background: "linear-gradient(160deg,#1A3330 0%,#0d2622 100%)" }}
      >
        {/* Blob decorativo */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute rounded-full" style={{ width:500,height:500,top:"-20%",right:"-10%",background:"radial-gradient(circle,rgba(88,163,157,.25) 0%,transparent 70%)",filter:"blur(60px)" }}/>
          <div className="absolute rounded-full" style={{ width:400,height:400,bottom:"-20%",left:"-5%",background:"radial-gradient(circle,rgba(187,158,197,.18) 0%,transparent 70%)",filter:"blur(60px)" }}/>
        </div>

        <div className="relative max-w-2xl mx-auto">
          <Link
            href="/#faq"
            className="inline-flex items-center gap-1.5 text-teal/60 hover:text-teal text-xs mb-6 transition-colors"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
            </svg>
            Volver
          </Link>
          <p className="text-teal text-xs font-bold uppercase tracking-widest mb-3">Recursos</p>
          <h1 className="font-heading text-4xl sm:text-5xl text-white mb-4">
            {cosasImportantesConfig.titulo}
          </h1>
          <p className="text-white/60 text-base leading-relaxed max-w-lg mx-auto">
            {cosasImportantesConfig.descripcion}
          </p>
        </div>
      </div>

      {/* ── Índice rápido ── */}
      {secciones.length > 1 && (
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {secciones.map(s => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="inline-flex items-center gap-1.5 bg-white text-texto-muted border border-teal/15 hover:border-teal/40 hover:text-teal px-4 py-2 rounded-full text-sm font-medium transition-all"
              >
                {s.emoji && <span>{s.emoji}</span>}
                {s.titulo}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* ── Secciones ── */}
      <div className="max-w-4xl mx-auto px-6 pb-24 space-y-16">
        {secciones.map(seccion => (
          <div key={seccion.id} id={seccion.id} className="scroll-mt-24">
            {/* Cabecera de sección */}
            <div className="mb-8 flex items-start gap-4">
              {seccion.emoji && (
                <span className="text-3xl flex-shrink-0 mt-1">{seccion.emoji}</span>
              )}
              <div>
                <h2 className="font-heading text-2xl sm:text-3xl text-texto">{seccion.titulo}</h2>
                {seccion.descripcion && (
                  <p className="text-texto-muted mt-1 text-sm leading-relaxed">{seccion.descripcion}</p>
                )}
              </div>
            </div>

            {/* Items de la sección */}
            <div className="space-y-4">
              {seccion.items.map(item => {
                if (item.tipo === 'video') {
                  const ytId = getYouTubeId(item.contenido);
                  return (
                    <div key={item.id} className="bg-white rounded-2xl border border-teal/10 overflow-hidden">
                      {item.titulo && (
                        <div className="px-5 py-3 border-b border-teal/10">
                          <p className="font-semibold text-texto text-sm">{item.titulo}</p>
                        </div>
                      )}
                      {ytId ? (
                        <div className="relative aspect-video">
                          <iframe
                            src={`https://www.youtube.com/embed/${ytId}`}
                            title={item.titulo ?? "Video Essen"}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="absolute inset-0 w-full h-full"
                          />
                        </div>
                      ) : (
                        <div className="p-5">
                          <a href={item.contenido} target="_blank" rel="noopener noreferrer"
                            className="text-teal hover:underline text-sm break-all">
                            {item.contenido}
                          </a>
                        </div>
                      )}
                    </div>
                  );
                }

                if (item.tipo === 'consejo') {
                  return (
                    <div key={item.id} className="bg-white rounded-2xl border border-teal/10 p-5 flex gap-4">
                      <span className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: "rgba(88,163,157,.12)" }}>
                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" style={{ color: "#58A39D" }}>
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                      </span>
                      <div>
                        {item.titulo && <p className="font-semibold text-texto text-sm mb-1">{item.titulo}</p>}
                        <p className="text-texto-muted text-sm leading-relaxed">{item.contenido}</p>
                      </div>
                    </div>
                  );
                }

                // tipo === 'texto'
                return (
                  <div key={item.id} className="bg-white rounded-2xl border border-teal/10 p-5">
                    {item.titulo && <p className="font-semibold text-texto text-sm mb-2">{item.titulo}</p>}
                    <p className="text-texto-muted text-sm leading-relaxed">{item.contenido}</p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {secciones.length === 0 && (
          <div className="text-center py-20 text-texto-muted">
            <p className="text-4xl mb-4">📋</p>
            <p className="font-semibold text-texto mb-1">Contenido próximamente</p>
            <p className="text-sm">Daisy está preparando el material.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
