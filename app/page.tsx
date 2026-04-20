import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Productos from "@/components/Productos";
import Promociones from "@/components/Promociones";
import Editorial from "@/components/Editorial";
import SumateEquipo from "@/components/SumateEquipo";
import FAQ from "@/components/FAQ";
import Contacto from "@/components/Contacto";
import Footer from "@/components/Footer";
import FloatingWA from "@/components/FloatingWA";
import WAPopup from "@/components/WAPopup";

export default function Home() {
  return (
    <main className="bg-fondo">
      <Navbar />
      <Hero />
      <Promociones />
      <Productos />
      <Editorial />
      <SumateEquipo />
      <FAQ />
      <Contacto />
      <Footer />
      <FloatingWA />
      <WAPopup />
    </main>
  );
}
