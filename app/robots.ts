import { MetadataRoute } from "next";
import { Cliente } from "@/config/cliente";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${Cliente.seo.baseUrl}/sitemap.xml`,
  };
}
