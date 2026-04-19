import { NextResponse } from 'next/server'
import { getFile, getMainSha, createBranch, updateFile, createPR } from '@/lib/github'
import { generateClienteTs, generateProductsTs, generateDescuentosTs } from '@/lib/generators'

export const maxDuration = 30

export async function POST(req: Request) {
  const { cliente, productos, hex, categorias, descuentos, descripcion } = await req.json()

  if (!cliente && !productos && !descuentos) {
    return NextResponse.json({ error: 'No hay cambios para enviar' }, { status: 400 })
  }

  try {
    const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
    const branchName = `admin/cambios-${ts}`

    const mainSha = await getMainSha()
    await createBranch(branchName, mainSha)

    if (cliente) {
      const { sha } = await getFile('config/cliente.ts')
      await updateFile('config/cliente.ts', generateClienteTs(cliente),
        'admin: actualizar configuración del sitio', sha, branchName)
    }

    if (productos) {
      const { sha } = await getFile('lib/products.ts')
      await updateFile('lib/products.ts', generateProductsTs(hex, productos, categorias),
        'admin: actualizar catálogo de productos', sha, branchName)
    }

    if (descuentos) {
      const { sha } = await getFile('config/descuentos.ts')
      await updateFile('config/descuentos.ts', generateDescuentosTs(descuentos),
        'admin: actualizar descuentos bancarios', sha, branchName)
    }

    const fecha = new Date().toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })
    const pr = await createPR(
      `📋 Cambios del cliente — ${fecha}`,
      `## ✏️ Cambios solicitados\n\n**Fecha:** ${fecha}\n\n${descripcion ? `**Descripción:** ${descripcion}` : '_Sin descripción._'}\n\n---\n*Creado desde el panel de administración.*`,
      branchName
    )

    return NextResponse.json({ ok: true, prUrl: pr.html_url, prNumber: pr.number })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    console.error('[submit-pr]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
