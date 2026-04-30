import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // En desarrollo local no se requiere autenticación
  if (process.env.NODE_ENV === 'development') return NextResponse.next()

  const token = request.cookies.get('admin_token')?.value
  const validToken = process.env.ADMIN_TOKEN || process.env.ADMIN_PASSWORD
  const isAuth = !!(token && validToken && token === validToken)

  // Siempre permitir la API de login
  if (pathname === '/api/admin/login') return NextResponse.next()

  // Proteger todas las demás rutas de la API admin
  if (pathname.startsWith('/api/admin/')) {
    if (!isAuth) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    return NextResponse.next()
  }

  // Si ya está logueado y va al login, redirigir al dashboard
  if (pathname === '/admin') {
    if (isAuth) return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    return NextResponse.next()
  }

  // Proteger todas las rutas del dashboard
  if (pathname.startsWith('/admin/')) {
    if (!isAuth) return NextResponse.redirect(new URL('/admin', request.url))
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/api/admin/:path*'],
}
