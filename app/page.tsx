
import Navbar from "@/components/shared/navbar";
import HeroSection from "@/components/home/hero-section";
import FeaturesSection from "@/components/home/features-section";
import LatestEventsSection from "@/components/home/latest-events-section";
import PhotoGallerySection from "@/components/home/photo-gallery-section";
import NewsletterSection from "@/components/home/newsletter-section";
import Footer from "@/components/shared/footer";

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <HeroSection />
        <FeaturesSection />
        <LatestEventsSection />
        <PhotoGallerySection />
        <NewsletterSection />
      </main>

      <Footer></Footer>
    </>
  );
}
