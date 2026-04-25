// ─────────────────────────────────────────────────────────────────────────────
//  VIDEOS — Carrusel de videos en la landing
//  Última actualización: panel de administración
// ─────────────────────────────────────────────────────────────────────────────

export type Video = {
  id: string
  titulo: string
  descripcion: string
  url: string
  activo: boolean
}

export const videos: Video[] = [];
