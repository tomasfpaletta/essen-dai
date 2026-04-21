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
    "id": "vid-1776788012035-4vmv",
    "titulo": "prueba video",
    "descripcion": "prueba video!!",
    "url": "https://youtube.com/shorts/UbjsdTfxOqc",
    "activo": true
  }
];
