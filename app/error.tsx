'use client'
import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[GlobalError]', error)
  }, [error])

  return (
    <html>
      <body style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#F4FAF8', fontFamily:'sans-serif', padding:'2rem' }}>
        <div style={{ maxWidth:'500px', width:'100%', background:'white', borderRadius:'16px', padding:'2rem', boxShadow:'0 4px 24px rgba(0,0,0,0.08)' }}>
          <h2 style={{ color:'#1A3330', fontWeight:700, marginBottom:'0.5rem' }}>Error en la aplicación</h2>
          <pre style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:'8px', padding:'1rem', fontSize:'12px', color:'#B91C1C', overflow:'auto', whiteSpace:'pre-wrap', wordBreak:'break-all' }}>
            {error.message}
            {error.digest ? `\nDigest: ${error.digest}` : ''}
          </pre>
          <button onClick={reset} style={{ marginTop:'1rem', background:'#58A39D', color:'white', border:'none', borderRadius:'10px', padding:'0.6rem 1.5rem', fontWeight:600, cursor:'pointer' }}>
            Reintentar
          </button>
        </div>
      </body>
    </html>
  )
}
