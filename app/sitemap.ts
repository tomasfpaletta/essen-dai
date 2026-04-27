import { MetadataRoute } from "next";
import { Cliente } from "@/config/cliente";
import { productos } from "@/lib/products";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = Cliente.seo.baseUrl;
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/cosas-importantes`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    ...productos.map(p => ({
      url: `${base}/productos/${p.id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
