import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { password } = await req.json()

  // Acepta ADMIN_PASSWORD o ADMIN_TOKEN (el mismo valor sirve para ambos)
  const validPassword = process.env.ADMIN_PASSWORD || process.env.ADMIN_TOKEN

  if (!validPassword) {
    console.error('[admin/login] Falta ADMIN_PASSWORD o ADMIN_TOKEN en las variables de entorno')
    return NextResponse.json({ error: 'Panel no configurado. Contactá al desarrollador.' }, { status: 500 })
  }

  if (!password || password !== validPassword) {
    console.error('[admin/login] Fallo —', {
      passwordLen: password?.length,
      validPasswordLen: validPassword?.length,
      match: password === validPassword,
    })
    await new Promise(r => setTimeout(r, 600))
    return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 })
  }

  // El token de cookie es ADMIN_TOKEN (o el mismo password si no está separado)
  const cookieToken = process.env.ADMIN_TOKEN || validPassword

  const res = NextResponse.json({ ok: true })
  res.cookies.set('admin_token', cookieToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 días
    path: '/',
  })
  return res
}
