import { Suspense } from 'react';
import Header from '../components/layout/Header';
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
import SkeletonCollectionsGrid from '../components/SkeletonCollectionsGrid';
import { generateMetadata } from './seo-metadata';

export const metadata = generateMetadata;

function HeroSkeleton() {
  return (
    <div className="relative h-[60vh] md:h-[70vh] lg:h-[80vh] bg-[#0a0a23] animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a23]/80 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a23] to-transparent z-10" />
      <div className="absolute bottom-20 left-4 md:left-12 z-20 space-y-4">
        <div className="h-12 w-64 md:w-96 bg-[#1a1a40] rounded-lg" />
        <div className="h-6 w-48 md:w-64 bg-[#1a1a40]/50 rounded-lg" />
        <div className="flex gap-3 mt-6">
          <div className="h-12 w-32 bg-gold/30 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

function SectionSkeleton({ height = "h-64" }: { height?: string }) {
  return (
    <div className={`${height} bg-[#0a0a23] animate-pulse flex items-center justify-center`}>
      <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="bg-gradient-to-b from-[#0a0a23] to-[#1a1a40] min-h-screen text-white font-sans">
      <Header />
      
      <Suspense fallback={<HeroSkeleton />}>
        <HeroCarousel />
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton height="h-16" />}>
        <CategoryTicker />
      </Suspense>
      
      <Suspense fallback={<SkeletonCollectionsGrid />}>
        <FeaturedCollections />
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton height="h-96" />}>
        <BestSellers />
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton height="h-80" />}>
        <RamadanOffers />
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton height="h-64" />}>
        <BrandStory />
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton height="h-64" />}>
        <VideoBrandStory />
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton height="h-80" />}>
        <ShopTheLook />
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton height="h-64" />}>
        <SimpleVideoSlider />
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton height="h-64" />}>
        <Testimonials />
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton height="h-64" />}>
        <InstagramGallery />
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton height="h-64" />}>
        <FAQ />
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton height="h-32" />}>
        <Newsletter />
      </Suspense>
      
      <Footer />
      <WhatsAppFloating />
    </div>
  );
}
