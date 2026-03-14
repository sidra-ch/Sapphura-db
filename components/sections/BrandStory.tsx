"use client";

import { motion } from 'framer-motion';
import { Sparkles, Crown, Heart, Award } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'Premium Quality',
    description: 'Each piece is crafted with the finest materials and meticulous attention to detail.'
  },
  {
    icon: Crown,
    title: 'Luxury Design',
    description: 'Our designs blend traditional elegance with modern sophistication.'
  },
  {
    icon: Heart,
    title: 'Customer First',
    description: 'We prioritize your satisfaction with exceptional service and support.'
  },
  {
    icon: Award,
    title: 'Authentic Craftsmanship',
    description: 'Years of expertise in creating beautiful jewelry and fashion pieces.'
  }
];

export default function BrandStory() {
  return (
    <section className="py-20 bg-[#0a0a23] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-40 h-40 border border-gold rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 border border-gold rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 border border-gold rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gold mb-4">Behind the Brilliance</h2>
          <p className="text-white/60 text-lg max-w-3xl mx-auto">
            The story of SAPPURA is one of passion, craftsmanship, and the pursuit of beauty
          </p>
        </motion.div>

        {/* Main Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-gold mb-6">Our Journey</h3>
            <div className="space-y-4 text-white/70">
              <p>
                Founded with a vision to bring luxury jewelry and fashion to every woman, 
                SAPPURA has grown from a small boutique to a trusted name in the industry.
              </p>
              <p>
                We believe that every woman deserves to feel special and confident. 
                Our collections are designed to enhance your natural beauty and celebrate 
                your unique style.
              </p>
              <p>
                From traditional Pakistani jewelry to contemporary fashion, we offer a 
                curated selection that caters to diverse tastes and occasions.
              </p>
              <p className="text-gold font-semibold">
                "Elegance is not standing out, but being remembered." - SAPPURA
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img 
                  src="/neckles-2.jpeg" 
                  alt="Jewelry" 
                  className="rounded-xl border-2 border-gold/30"
                />
                <img 
                  src="/suit-30.jpeg" 
                  alt="Fashion" 
                  className="rounded-xl border-2 border-gold/30"
                />
              </div>
              <div className="space-y-4 pt-8">
                <img 
                  src="/bracelet-1.jpeg" 
                  alt="Accessories" 
                  className="rounded-xl border-2 border-gold/30"
                />
                <img 
                  src="/making-1.jpeg" 
                  alt="Craft" 
                  className="rounded-xl border-2 border-gold/30"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#1a1a40] border border-gold/20 rounded-xl p-6 text-center hover:border-gold transition group"
              >
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gold/20 transition">
                  <Icon className="w-8 h-8 text-gold" />
                </div>
                <h4 className="text-gold font-bold mb-2">{feature.title}</h4>
                <p className="text-white/60 text-sm">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <button className="px-8 py-4 bg-gold text-[#0a0a23] rounded-full font-bold hover:bg-yellow-400 transition">
            Explore Our Collection
          </button>
        </motion.div>
      </div>
    </section>
  );
}