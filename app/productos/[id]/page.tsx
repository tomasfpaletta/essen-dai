import { notFound } from 'next/navigation'
import { getProductoById, productos } from '@/lib/products'
import { Cliente } from '@/config/cliente'
import DetalleInteractivo from './DetalleInteractivo'

export async function generateStaticParams() {
  return productos.map((p) => ({ id: p.id }))
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const p = getProductoById(params.id)
  if (!p) return {}
  const base = Cliente.seo.baseUrl
  // Imagen OG: primera variante con foto, si no la OG general del sitio
  const primeraFoto = p.variantes.find(v => v.imagen)?.imagen
  const ogImage = primeraFoto
    ? `${base}${primeraFoto}`
    : `${base}${Cliente.seo.ogImage}`
  return {
    title: `${p.nombre} | ${Cliente.marca}`,
    description: p.descripcion,
    openGraph: {
      title: `${p.nombre} | ${Cliente.marca}`,
      description: p.descripcion,
      url: `${base}/productos/${p.id}`,
      siteName: Cliente.marca,
      locale: 'es_AR',
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 630, alt: p.nombre }],
    },
  }
}

export default function ProductoDetallePage({ params }: { params: { id: string } }) {
  const p = getProductoById(params.id)
  if (!p) notFound()

  const relacionados = productos
    .filter(r => r.categoria === p.categoria && r.id !== p.id)
    .slice(0, 4)

  return (
    <DetalleInteractivo
      producto={p}
      relacionados={relacionados}
      cliente={JSON.parse(JSON.stringify(Cliente))}
    />
  )
}
