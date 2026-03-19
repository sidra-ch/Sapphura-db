import CategoryTicker from '../components/sections/CategoryTicker';
import InstagramGallery from '../components/sections/InstagramGallery';
import HeroCarousel from '../components/sections/HeroCarousel';
import FeaturedCollections from '../components/sections/FeaturedCollections';
import BestSellers from '../components/sections/BestSellers';
import RamadanOffers from '../components/sections/RamadanOffers';
import VideoBrandStory from '../components/sections/VideoBrandStory';
import ShopTheLook from '../components/sections/ShopTheLook';
import SimpleVideoSlider from '../components/sections/SimpleVideoSlider';
import FAQ from '../components/sections/FAQ';
import Newsletter from '../components/sections/Newsletter';
import Footer from '../components/layout/Footer';
import Testimonials from '../components/sections/Testimonials';
import BrandStory from '../components/sections/BrandStory';
import WhatsAppFloating from '../components/sections/WhatsAppFloating';

export default function HomePage() {
  return (
    <div className="bg-gradient-to-b from-[#0a0a23] to-[#1a1a40] min-h-screen text-white font-sans">
      <HeroCarousel />
      <CategoryTicker />
      <FeaturedCollections />
      <BestSellers />
      <RamadanOffers />
      <BrandStory />
      <VideoBrandStory />
      <ShopTheLook />
      <SimpleVideoSlider />
      <Testimonials />
      <InstagramGallery />
      <FAQ />
      <Newsletter />
      
      <Footer />
      <WhatsAppFloating />
    </div>
  );
}
