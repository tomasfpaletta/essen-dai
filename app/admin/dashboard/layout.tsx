'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

const NAV = [
  { href: '/admin/dashboard',          label: 'Inicio',          icon: '🏠' },
  { href: '/admin/dashboard/cliente',  label: 'Configuración',   icon: '⚙️' },
  { href: '/admin/dashboard/productos',label: 'Productos',       icon: '📦' },
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
    <div className="min-h-screen flex bg-fondo">
      {/* ── Sidebar ── */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-60 bg-white border-r border-teal/10
          flex flex-col transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:flex
        `}
      >
        {/* Header sidebar */}
        <div className="p-5 border-b border-teal/10 flex items-center gap-3">
          <div className="w-9 h-9 bg-teal rounded-xl flex items-center justify-center flex-shrink-0 text-white text-base">
            🍳
          </div>
          <div>
            <p className="font-bold text-texto text-sm leading-tight">Panel Admin</p>
            <p className="text-texto-muted text-xs">Master Essen</p>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                ${pathname === item.href
                  ? 'bg-teal/10 text-teal'
                  : 'text-texto-muted hover:bg-fondo hover:text-texto'}
              `}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-teal/10">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-texto-muted hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-50"
          >
            <span>🚪</span>
            {loggingOut ? 'Saliendo...' : 'Cerrar sesión'}
          </button>
        </div>
      </aside>

      {/* Overlay mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Contenido principal ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header mobile */}
        <header className="lg:hidden bg-white border-b border-teal/10 px-4 py-3 flex items-center gap-3 flex-shrink-0">
          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-lg hover:bg-fondo text-texto-muted text-lg leading-none"
          >
            ☰
          </button>
          <span className="font-semibold text-texto text-sm">Panel Admin</span>
        </header>

        <main className="flex-1 p-5 lg:p-8 max-w-4xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  )
}
