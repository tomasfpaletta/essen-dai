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
  return {
    title: `${p.nombre} | ${Cliente.marca}`,
    description: p.descripcion,
    openGraph: {
      title: `${p.nombre} | ${Cliente.marca}`,
      description: p.descripcion,
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
