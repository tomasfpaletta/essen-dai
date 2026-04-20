'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import React from 'react'

const NAV = [
  { href: '/admin/dashboard',             label: 'Inicio',        icon: 'M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h4a1 1 0 001-1v-3h2v3a1 1 0 001 1h4a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z' },
  { href: '/admin/dashboard/contenido',   label: 'Contenido web', icon: 'M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zm-1.207 1.207L2 14.172V17h2.828l10.38-10.379-2.83-2.828z' },
  { href: '/admin/dashboard/productos',   label: 'Productos',     icon: 'M4 3a2 2 0 100 4h12a2 2 0 100-4H4z M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8z' },
  { href: '/admin/dashboard/descuentos',  label: 'Descuentos',    icon: 'M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9z' },
  { href: '/admin/dashboard/promociones', label: 'Promociones',   icon: 'M9 11H3v5a2 2 0 002 2h4v-7zm2 7h4a2 2 0 002-2v-5h-6v7z' },
  { href: '/admin/dashboard/cliente',     label: 'Configuración', icon: 'M10 13a3 3 0 100-6 3 3 0 000 6z' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router   = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)
  const [open, setOpen] = useState(false)

  async function handleLogout() {
    setLoggingOut(true)
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin')
  }

  return (
    <>
      <style>{`
        .admin-nav-link { color: rgba(255,255,255,0.55); }
        .admin-nav-link:hover { background: rgba(255,255,255,0.07) !important; color: rgba(255,255,255,0.9) !important; }
        .admin-nav-link.active { background: rgba(88,163,157,0.22) !important; color: #7ECFCA !important; }
        .admin-logout:hover { background: rgba(239,68,68,0.15) !important; color: #FCA5A5 !important; }
        .admin-logout { color: rgba(255,255,255,0.4); }
      `}</style>

      <div className="min-h-screen flex" style={{ background: '#EEF2F0' }}>
        {/* ── Sidebar ── */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-60 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:flex ${open ? 'translate-x-0' : '-translate-x-full'}`}
          style={{ background: '#1B3530' }}
        >
          {/* Logo */}
          <div className="p-4 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="bg-white rounded-xl p-2 inline-block">
              <Image
                src="/images/logo/isoLogoFondoBlanco.jpeg"
                alt="Master Essen"
                width={120}
                height={50}
                className="h-8 w-auto object-contain"
                priority
              />
            </div>
            <p className="text-xs mt-2.5 pl-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Panel de administración
            </p>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-3 space-y-0.5">
            {NAV.map(item => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`admin-nav-link${isActive ? ' active' : ''} flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all`}
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 flex-shrink-0" style={{ opacity: isActive ? 1 : 0.65 }}>
                    <path fillRule="evenodd" d={item.icon} clipRule="evenodd" />
                  </svg>
                  {item.label}
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#7ECFCA' }} />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Ver web + Logout */}
          <div className="p-3 space-y-1" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{ color: 'rgba(126,207,202,0.8)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(88,163,157,0.15)'; (e.currentTarget as HTMLAnchorElement).style.color = '#7ECFCA' }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = ''; (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(126,207,202,0.8)' }}
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 flex-shrink-0">
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/>
              </svg>
              Ver mi web
            </a>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="admin-logout w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"/>
              </svg>
              {loggingOut ? 'Saliendo...' : 'Cerrar sesión'}
            </button>
          </div>
        </aside>

        {/* Overlay mobile */}
        {open && (
          <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setOpen(false)} />
        )}

        {/* Contenido */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header mobile */}
          <header
            className="lg:hidden px-4 py-3 flex items-center gap-3 flex-shrink-0"
            style={{ background: '#1B3530', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
          >
            <button
              onClick={() => setOpen(!open)}
              className="p-2 rounded-lg"
              style={{ color: 'rgba(255,255,255,0.6)' }}
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
              </svg>
            </button>
            <span className="font-semibold text-sm" style={{ color: 'rgba(255,255,255,0.85)' }}>Panel Admin</span>
          </header>

          <main className="flex-1 p-5 lg:p-8 max-w-4xl mx-auto w-full">
            {children}
          </main>
        </div>
      </div>
    </>
  )
}
