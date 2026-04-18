import { NextResponse } from 'next/server'
import { getFile, getMainSha, createBranch, updateFile, createPR } from '@/lib/github'
import { generateClienteTs, generateProductsTs } from '@/lib/generators'

export const maxDuration = 30

export async function POST(req: Request) {
  const { cliente, productos, hex, categorias, descripcion } = await req.json()

  if (!cliente && !productos) {
    return NextResponse.json({ error: 'No hay cambios para enviar' }, { status: 400 })
  }

  try {
    // Nombre de rama con timestamp
    const ts = new Date()
      .toISOString()
      .replace(/[:.]/g, '-')
      .slice(0, 19)
    const branchName = `admin/cambios-${ts}`

    // Crear rama desde main
    const mainSha = await getMainSha()
    await createBranch(branchName, mainSha)

    // Actualizar config/cliente.ts
    if (cliente) {
      const { sha } = await getFile('config/cliente.ts')
      const content = generateClienteTs(cliente)
      await updateFile(
        'config/cliente.ts',
        content,
        'admin: actualizar configuración del sitio',
        sha,
        branchName
      )
    }

    // Actualizar lib/products.ts
    if (productos) {
      const { sha } = await getFile('lib/products.ts')
      const content = generateProductsTs(hex, productos, categorias)
      await updateFile(
        'lib/products.ts',
        content,
        'admin: actualizar catálogo de productos',
        sha,
        branchName
      )
    }

    // Crear Pull Request
    const fecha = new Date().toLocaleDateString('es-AR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    })
    const prBody = `## ✏️ Cambios solicitados por el cliente

**Fecha:** ${fecha}

${descripcion ? `**Descripción:** ${descripcion}` : '_Sin descripción adicional._'}

---
*Creado automáticamente desde el panel de administración de Master Essen.*`

    const pr = await createPR(
      `📋 Cambios del cliente — ${fecha}`,
      prBody,
      branchName
    )

    return NextResponse.json({ ok: true, prUrl: pr.html_url, prNumber: pr.number })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    console.error('[submit-pr]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
