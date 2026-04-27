'use client'
import { useState, useEffect, useCallback } from 'react'
import { PENDING_KEY, clearAllPending, PUBLISHED_EVENT } from '@/lib/admin-pending'

const SECTION_LABELS: Record<string, string> = {
  contenido:        'Contenido web',
  productos:        'Productos',
  promociones:      'Promociones',
  cosasImportantes: 'Cosas importantes',
}

export default function PublishBar() {
  const [sections, setSections] = useState<string[]>([])
  const [publishing, setPublishing] = useState(false)
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const refresh = useCallback(() => {
    try {
      const raw = localStorage.getItem(PENDING_KEY)
      if (!raw) { setSections([]); return }
      const data = JSON.parse(raw)
      setSections((data._sections as string[]) ?? [])
    } catch { setSections([]) }
  }, [])

  useEffect(() => {
    refresh()
    const id = setInterval(refresh, 800)
    return () => clearInterval(id)
  }, [refresh])

  async function publishAll() {
    const raw = localStorage.getItem(PENDING_KEY)
    if (!raw) return
    let data: Record<string, unknown>
    try { data = JSON.parse(raw) } catch { return }

    setPublishing(true); setStatus('idle')

    // Eliminar meta-campo antes de enviar al API
    const { _sections: _, ...payload } = data

    try {
      const res = await fetch('/api/admin/submit-pr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Error al publicar')

      clearAllPending()
      setSections([])
      setStatus('ok')
      // Notifica a las páginas montadas para que limpien su estado dirty
      window.dispatchEvent(new CustomEvent(PUBLISHED_EVENT))
      setTimeout(() => setStatus('idle'), 5000)
    } catch (e) {
      setStatus('error')
      setErrorMsg(e instanceof Error ? e.message : 'Error desconocido')
    } finally {
      setPublishing(false)
    }
  }

  if (sections.length === 0 && status === 'idle') return null

  return (
    <div className="fixed bottom-20 right-6 z-50 flex flex-col items-end gap-2.5 pointer-events-none">

      {/* Toast éxito */}
      {status === 'ok' && (
        <div className="pointer-events-auto bg-green-50 border border-green-200 text-green-800 rounded-2xl px-4 py-3 text-sm flex items-center gap-2 shadow-lg">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 flex-shrink-0">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
          </svg>
          ¡Publicado! Los cambios estarán visibles en ~30s.
        </div>
      )}

      {/* Toast error */}
      {status === 'error' && (
        <div className="pointer-events-auto bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3 text-sm shadow-lg max-w-xs flex items-start gap-2">
          <span className="flex-1 text-xs leading-relaxed">{errorMsg}</span>
          <button onClick={() => setStatus('idle')} className="text-red-400 hover:text-red-600 flex-shrink-0 mt-0.5">✕</button>
        </div>
      )}

      {/* Panel del botón */}
      <div className="pointer-events-auto bg-white rounded-2xl shadow-xl shadow-black/15 border border-gray-100 overflow-hidden min-w-[210px]">

        {/* Secciones pendientes */}
        {sections.length > 0 && (
          <div className="px-3 pt-3 pb-2 flex flex-wrap gap-1.5">
            {sections.map(s => (
              <span key={s} className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                {SECTION_LABELS[s] ?? s}
              </span>
            ))}
          </div>
        )}

        <div className="p-2.5 pt-2">
          <button
            onClick={publishAll}
            disabled={publishing || sections.length === 0}
            className="w-full flex items-center justify-center gap-2 bg-teal text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-teal-dark transition-colors disabled:opacity-40"
          >
            {publishing ? (
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path d="M5 12l5 5L20 7"/>
              </svg>
            )}
            {publishing ? 'Publicando…' : 'Publicar cambios'}
          </button>
        </div>
      </div>
    </div>
  )
}
