import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Sapphura',
  description: 'Learn more about Sapphura luxury ecommerce.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0B1C3F]">
      
      
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gold mb-6">Since 2025</h2>
            <p className="text-white/80 text-lg mb-6">
              Sapphura is a premier luxury fashion brand dedicated to bringing you the finest in jewelry, 
              clothing, and accessories. Founded with a vision to blend timeless elegance with contemporary 
              design, we curate pieces that make a statement.
            </p>
            <p className="text-white/80 text-lg mb-6">
              Our collection features exquisite jewelry, stunning abayas, designer dresses, and premium 
              makeup products. Each piece is carefully selected to ensure the highest quality and 
              craftsmanship that defines true luxury.
            </p>
            <div className="flex gap-8 mt-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-gold">10K+</div>
                <div className="text-white/60">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gold">500+</div>
                <div className="text-white/60">Products</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gold">50+</div>
                <div className="text-white/60">Collections</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden border-2 border-gold">
              <img 
                src="https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635065/logo-1_nsterf.png"
                alt="Sapphura Luxury" 
                className="w-full h-full object-contain bg-[#0B1C3F]"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-gold text-[#0B1C3F] p-6 rounded-xl">
              <div className="text-3xl font-bold">Since 2024</div>
              <div className="font-semibold">Excellence in Luxury</div>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-3xl font-bold text-gold mb-8 text-center">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#0a1535] p-8 rounded-2xl border border-gold/20">
              <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">💎</span>
              </div>
              <h3 className="text-xl font-bold text-gold mb-3">Quality First</h3>
              <p className="text-white/70">We source only the finest materials and work with skilled artisans to create pieces that last a lifetime.</p>
            </div>
            <div className="bg-[#0a1535] p-8 rounded-2xl border border-gold/20">
              <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">✨</span>
              </div>
              <h3 className="text-xl font-bold text-gold mb-3">Timeless Design</h3>
              <p className="text-white/70">Our designs transcend trends, offering you pieces that remain elegant season after season.</p>
            </div>
            <div className="bg-[#0a1535] p-8 rounded-2xl border border-gold/20">
              <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">❤️</span>
              </div>
              <h3 className="text-xl font-bold text-gold mb-3">Customer Delight</h3>
              <p className="text-white/70">Your satisfaction is our priority. We strive to provide an exceptional shopping experience.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
