// ─────────────────────────────────────────────────────────────────────────────
//  Admin Pending — almacena los cambios pendientes en localStorage
//  hasta que el usuario presione "Publicar cambios" en el PublishBar global.
//  Así todos los commits van en secuencia dentro de una sola llamada API,
//  evitando los conflictos de SHA (error 409) de GitHub.
// ─────────────────────────────────────────────────────────────────────────────

export const PENDING_KEY = 'admin_pending'

/** Claves de borrador por sección (para restauración al recargar) */
export const DRAFT_KEYS: Record<string, string> = {
  contenido:        'admin_contenido_draft',
  productos:        'admin_productos_draft',
  descuentos:       'admin_descuentos_draft',
  promociones:      'admin_promociones_draft',
  cosasImportantes: 'admin_cosas_importantes_draft',
}

/**
 * Agrega / actualiza la sección `section` en el payload pendiente global.
 * `data` son los campos que se van a fusionar con el objeto existente.
 */
export function writePendingSection(section: string, data: Record<string, unknown>) {
  try {
    const raw = localStorage.getItem(PENDING_KEY)
    const existing: Record<string, unknown> = raw ? JSON.parse(raw) : { _sections: [] }
    const sections = Array.from(new Set([...((existing._sections as string[]) ?? []), section]))
    localStorage.setItem(PENDING_KEY, JSON.stringify({ ...existing, ...data, _sections: sections }))
  } catch {
    localStorage.setItem(PENDING_KEY, JSON.stringify({ _sections: [section], ...data }))
  }
}

/** Limpia todo después de un publish exitoso */
export function clearAllPending() {
  localStorage.removeItem(PENDING_KEY)
  Object.values(DRAFT_KEYS).forEach(k => localStorage.removeItem(k))
}

/** Claves de payload que cada sección escribe en PENDING_KEY */
const SECTION_PAYLOAD_KEYS: Record<string, string[]> = {
  contenido:        ['cliente', 'videos', 'testimonios', 'faq'],
  productos:        ['productos', 'hex', 'categorias'],
  descuentos:       ['descuentos'],
  promociones:      ['promociones'],
  cosasImportantes: ['cosasImportantes'],
}

/**
 * Revierte una sección específica: elimina su borrador local
 * y la quita del payload pendiente global.
 */
export function clearPendingSection(section: string) {
  // Borrar draft de esa sección
  const draftKey = DRAFT_KEYS[section]
  if (draftKey) localStorage.removeItem(draftKey)

  // Quitar del pending global
  try {
    const raw = localStorage.getItem(PENDING_KEY)
    if (!raw) return
    const data = JSON.parse(raw) as Record<string, unknown>
    const sections = ((data._sections as string[]) ?? []).filter(s => s !== section)
    // Eliminar las claves de payload de esa sección
    ;(SECTION_PAYLOAD_KEYS[section] ?? []).forEach(k => delete data[k])
    data._sections = sections
    if (sections.length === 0) {
      localStorage.removeItem(PENDING_KEY)
    } else {
      localStorage.setItem(PENDING_KEY, JSON.stringify(data))
    }
  } catch {
    localStorage.removeItem(PENDING_KEY)
  }
}

/** Evento que dispara el PublishBar al terminar correctamente */
export const PUBLISHED_EVENT = 'admin-published'
