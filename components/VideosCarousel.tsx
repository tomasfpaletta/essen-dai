"use client";
import { useState, useCallback } from "react";
import { videos, type Video } from "@/config/videos";

// ── Extraer ID de YouTube (soporta todos los formatos) ───────────────────────
function extractYouTubeId(raw: string): string | null {
  // youtu.be/ID
  const short = raw.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (short) return short[1];
  // watch?v=ID  o  &v=ID
  const watch = raw.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watch) return watch[1];
  // /shorts/ID
  const shorts = raw.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shorts) return shorts[1];
  // /embed/ID (ya es embed)
  const embed = raw.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embed) return embed[1];
  // m.youtube.com/watch?v=ID
  const mobile = raw.match(/m\.youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/);
  if (mobile) return mobile[1];
  return null;
}

function toEmbedUrl(raw: string): string {
  const id = extractYouTubeId(raw);
  if (id) return `https://www.youtube.com/embed/${id}?rel=0`;
  return raw;
}

function toThumb(raw: string): string | null {
  const id = extractYouTubeId(raw);
  if (id) return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
  return null;
}

function toWatchUrl(raw: string): string {
  const id = extractYouTubeId(raw);
  if (id) return `https://www.youtube.com/watch?v=${id}`;
  return raw;
}

// ── Reproductor con click-to-play (evita iframe en blanco) ───────────────────
function VideoPlayer({ video }: { video: Video }) {
  const [playing, setPlaying] = useState(false);
  const thumb = toThumb(video.url);
  const embedUrl = toEmbedUrl(video.url);
  const watchUrl = toWatchUrl(video.url);
  const hasId = !!extractYouTubeId(video.url);

  const play = useCallback(() => setPlaying(true), []);

  if (playing) {
    return (
      <iframe
        src={`${embedUrl}&autoplay=1`}
        title={video.titulo}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    );
  }

  return (
    <>
      {/* Thumbnail o fondo degradado */}
      {thumb ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={thumb} alt={video.titulo} className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-teal/20 to-teal-dark/40" />
      )}

      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Botón play */}
      <button
        onClick={play}
        className="absolute inset-0 flex items-center justify-center group"
        aria-label="Reproducir video"
      >
        <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-white transition-all duration-200">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-teal ml-1">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
      </button>

      {/* Si no es un video de YouTube válido, mostrar link externo */}
      {!hasId && (
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-3 right-3 text-xs bg-black/60 text-white px-3 py-1.5 rounded-full hover:bg-black/80 transition-colors"
        >
          Abrir en YouTube →
        </a>
      )}
    </>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function VideosCarousel() {
  const activos: Video[] = videos.filter(v => v.activo);
  const [idx, setIdx] = useState(0);

  // Estado vacío — maqueta
  if (activos.length === 0) {
    return (
      <section className="py-20 bg-white px-6 sm:px-12 lg:px-20">
        <div className="max-w-5xl mx-auto">
          <p className="text-teal text-xs font-semibold uppercase tracking-[0.2em] mb-3">Videos</p>
          <h2 className="font-heading text-texto text-3xl sm:text-4xl mb-10">Conocé más sobre Essen</h2>

          {/* Maqueta vacía */}
          <div className="max-w-2xl mx-auto">
            <div
              className="rounded-2xl border-2 border-dashed border-teal/20 bg-fondo flex flex-col items-center justify-center gap-5 py-20 px-8 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-teal/10 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-teal">
                  <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M10 8.5l6 3.5-6 3.5V8.5z" fill="currentColor"/>
                </svg>
              </div>
              <div>
                <p className="font-semibold text-texto text-base">Videos próximamente</p>
                <p className="text-texto-muted text-sm mt-1.5 max-w-xs mx-auto leading-snug">
                  Los videos se agregan desde el panel de administración en la sección "Contenido web".
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const current = activos[idx];
  const prev = () => setIdx((idx - 1 + activos.length) % activos.length);
  const next = () => setIdx((idx + 1) % activos.length);

  return (
    <section className="py-20 bg-white px-6 sm:px-12 lg:px-20">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-teal text-xs font-semibold uppercase tracking-[0.2em] mb-2">Videos</p>
            <h2 className="font-heading text-texto text-3xl sm:text-4xl">Conocé más sobre Essen</h2>
          </div>
          {activos.length > 1 && (
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={prev}
                className="w-9 h-9 rounded-full border border-teal/25 text-teal hover:bg-teal/5 flex items-center justify-center transition-colors">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
              </button>
              <button onClick={next}
                className="w-9 h-9 rounded-full border border-teal/25 text-teal hover:bg-teal/5 flex items-center justify-center transition-colors">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Layout: video + sidebar miniatura */}
        <div className={`grid gap-5 ${activos.length > 1 ? 'lg:grid-cols-[1fr_200px]' : ''}`}>

          {/* Video principal */}
          <div className="flex flex-col gap-4">
            <div className="relative rounded-2xl overflow-hidden shadow-lg shadow-black/10 bg-black"
              style={{ aspectRatio: '16/9' }}>
              <VideoPlayer key={current.id} video={current} />
            </div>

            {/* Título y descripción */}
            {(current.titulo || current.descripcion) && (
              <div>
                {current.titulo && (
                  <h3 className="font-semibold text-texto text-lg leading-snug">{current.titulo}</h3>
                )}
                {current.descripcion && (
                  <p className="text-texto-muted text-sm mt-1 leading-relaxed">{current.descripcion}</p>
                )}
              </div>
            )}
          </div>

          {/* Sidebar de miniaturas — solo si hay más de 1 video */}
          {activos.length > 1 && (
            <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
              {activos.map((v, i) => {
                const thumb = toThumb(v.url);
                return (
                  <button
                    key={v.id}
                    onClick={() => setIdx(i)}
                    className={`flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all w-36 lg:w-auto ${
                      i === idx ? 'border-teal shadow-sm shadow-teal/20' : 'border-transparent hover:border-teal/30'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-video bg-fondo">
                      {thumb ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={thumb} alt={v.titulo} className="w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-teal/10">
                          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-teal/50">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      )}
                      {/* Play overlay */}
                      <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${i === idx ? 'opacity-0' : 'opacity-100'}`}
                        style={{ background: 'rgba(0,0,0,0.25)' }}>
                        <div className="w-7 h-7 rounded-full bg-white/90 flex items-center justify-center">
                          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 text-texto ml-0.5">
                            <path d="M6 4l7 4-7 4V4z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                    {v.titulo && (
                      <p className="text-xs font-medium text-texto text-left px-2 py-1.5 line-clamp-2 bg-white">{v.titulo}</p>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Dots — solo mobile cuando hay múltiples */}
        {activos.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6 lg:hidden">
            {activos.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className="rounded-full transition-all"
                style={{
                  width: i === idx ? 20 : 8,
                  height: 8,
                  background: '#58A39D',
                  opacity: i === idx ? 1 : 0.3,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
