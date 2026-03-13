import Header from '../components/Header';
import CategoryTicker from '../components/CategoryTicker';
import InstagramGallery from '../components/InstagramGallery';
import HeroCarousel from '../components/HeroCarousel';
import FeaturedCollections from '../components/FeaturedCollections';
import BestSellers from '../components/BestSellers';
import RamadanOffers from '../components/RamadanOffers';
import VideoBrandStory from '../components/VideoBrandStory';
import ShopTheLook from '../components/ShopTheLook';
import SimpleVideoSlider from '../components/SimpleVideoSlider';
import FAQ from '../components/FAQ';
import Newsletter from '../components/Newsletter';
import WhatsAppContact from '../components/WhatsAppContact';
import Footer from '../components/Footer';
import WhatsAppFloating from '../components/WhatsAppFloating';
import { generateMetadata } from './seo-metadata';

export const metadata = generateMetadata();
export default function HomePage() {
  return (
    <div className="bg-gradient-to-b from-[#0a0a23] to-[#1a1a40] min-h-screen text-white font-sans">
      <Header />
      <HeroCarousel />
      {/* Scrolling Category Strip */}
      <CategoryTicker />
      {/* Cloudinary Products from sapphura/products */}
      <FeaturedCollections />
      <BestSellers />
      {/* Cloudinary Ramadan Offers from sapphura/products */}
      <RamadanOffers />
      <VideoBrandStory />
      {/* Cloudinary Shop The Look from sapphura/products */}
      <ShopTheLook />
      {/* Cloudinary Instagram Gallery from sapphura/videos */}
      <SimpleVideoSlider />
      <InstagramGallery />
      {/* Cloudinary FAQ, Newsletter, WhatsAppContact */}
      <FAQ />
      <Newsletter />
      <WhatsAppContact />
      <Footer />
      <WhatsAppFloating />
    </div>
  );
}
