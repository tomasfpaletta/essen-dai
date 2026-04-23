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

export const videos: Video[] = [
  {
    "id": "vid-1776974480555-qdt4",
    "titulo": "video test",
    "descripcion": "test",
    "url": "https://youtube.com/shorts/5xfvedg4_y0",
    "activo": true
  },
  {
    "id": "vid-1776974498012-in0e",
    "titulo": "test2",
    "descripcion": "test2",
    "url": "https://youtube.com/shorts/UbjsdTfxOqc",
    "activo": true
  }
];
