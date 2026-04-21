import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WishlistSection from "@/components/WishlistSection";
import Promociones from "@/components/Promociones";
import Editorial from "@/components/Editorial";
import Testimonios from "@/components/Testimonios";
import SumateEquipo from "@/components/SumateEquipo";
import VideosCarousel from "@/components/VideosCarousel";
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
      <WishlistSection />
      <Editorial />
      <VideosCarousel />
      <Testimonios />
      <SumateEquipo />
      <FAQ />
      <Contacto />
      <Footer />
      <FloatingWA />
      <WAPopup />
    </main>
  );
}
