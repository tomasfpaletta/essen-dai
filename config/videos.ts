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
    "id": "vid-1777130341739-lkvy",
    "titulo": "1",
    "descripcion": "test",
    "url": "https://youtube.com/shorts/g9M_gr1KOl8",
    "activo": true
  },
  {
    "id": "vid-1777130358547-0pbl",
    "titulo": "2",
    "descripcion": "test",
    "url": "https://youtube.com/shorts/HX9tYgttL9I",
    "activo": true
  }
];
