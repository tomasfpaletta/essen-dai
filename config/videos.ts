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
    "id": "vid-1776788342613-fbw7",
    "titulo": "prueba 2",
    "descripcion": "prueba2",
    "url": "https://youtube.com/shorts/g9M_gr1KOl8",
    "activo": true
  },
  {
    "id": "vid-1776788012035-4vmv",
    "titulo": "prueba video",
    "descripcion": "prueba video!!",
    "url": "https://youtube.com/shorts/UbjsdTfxOqc",
    "activo": true
  }
];
