import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Cliente } from "@/config/cliente";
import { getProductoById, productos, type Producto } from "@/lib/products";
import ProductoClient from "./ProductoClient";

interface Props {
  params: { id: string };
}

export function generateStaticParams() {
  return productos.map(p => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const producto = getProductoById(params.id);
  if (!producto) return { title: "Producto no encontrado" };

  return {
    title: `${producto.nombre} | ${Cliente.marca}`,
    description: `${producto.descripcion} Consultá precio y disponibilidad con ${Cliente.nombre}, distribuidora oficial Essen en ${Cliente.ciudad}.`,
    openGraph: {
      title: `${producto.nombre} — ${Cliente.marca}`,
      description: producto.descripcion,
      url: `${Cliente.seo.baseUrl}/productos/${producto.id}`,
    },
  };
}

export default function ProductoPage({ params }: Props) {
  const producto = getProductoById(params.id);
  if (!producto) notFound();

  return <ProductoClient producto={producto} />;
}
