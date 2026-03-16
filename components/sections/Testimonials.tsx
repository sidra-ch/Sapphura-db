"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, ThumbsUp, ShoppingBag } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Ayesha Khan',
    location: 'Lahore, Pakistan',
    rating: 5,
    comment: 'Absolutely stunning jewelry! The quality exceeded my expectations. Fast delivery and beautiful packaging. Will definitely shop again!',
    image: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635069/neckles-1_rbhzgd.jpg',
    verified: true,
    date: 'January 2024'
  },
  {
    id: 2,
    name: 'Fatima Abdullah',
    location: 'Dubai, UAE',
    rating: 5,
    comment: 'The best online shopping experience. Products are exactly as shown, and the gold quality is exceptional. Highly recommended!',
    image: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635055/earing-1_iobl42.jpg',
    verified: true,
    date: 'January 2024'
  },
  {
    id: 3,
    name: 'Sara Ahmed',
    location: 'Karachi, Pakistan',
    rating: 4,
    comment: 'Great customer service and beautiful collection. The abaya quality is premium. Will order more soon!',
    image: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635130/suit-31_nnxefy.jpg',
    verified: true,
    date: 'December 2023'
  },
  {
    id: 4,
    name: 'Mariam Hussain',
    location: 'London, UK',
    rating: 5,
    comment: 'Living abroad, I was skeptical about online jewelry shopping. But Sappura delivered perfectly to the UK. Love my necklace!',
    image: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635043/bracelet-1_eb7gcf.jpg',
    verified: true,
    date: 'December 2023'
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-12 bg-gradient-to-b from-[#0a0a23] to-[#1a1a40]">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gold mb-4">What Our Customers Say</h2>
          <p className="text-white/60 text-lg">Real reviews from real customers</p>
        </motion.div>

        {/* Main Testimonial Card */}
        <div className="relative max-w-4xl mx-auto">
          <motion.div
            key={testimonials[currentIndex].id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="bg-[#1a1a40] border-2 border-gold rounded-2xl p-8 md:p-12 relative"
          >
            <Quote className="absolute top-6 left-6 w-16 h-16 text-gold/20" />
            
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gold flex-shrink-0">
                <img 
                  src={testimonials[currentIndex].image} 
                  alt={testimonials[currentIndex].name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635069/neckles-1_rbhzgd.jpg';
                  }}
                />
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${i < testimonials[currentIndex].rating ? 'text-gold fill-gold' : 'text-white/30'}`} 
                    />
                  ))}
                </div>
                
                <p className="text-white/80 text-lg mb-6 italic">&quot;{testimonials[currentIndex].comment}&quot;</p>
                
                <div>
                  <h4 className="text-gold font-bold text-lg">
                    {testimonials[currentIndex].name}
                    {testimonials[currentIndex].verified && (
                      <span className="ml-2 text-green-400 text-sm">✓ Verified</span>
                    )}
                  </h4>
                  <p className="text-white/50 text-sm">{testimonials[currentIndex].location}</p>
                  <p className="text-white/30 text-xs mt-1">{testimonials[currentIndex].date}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Navigation */}
          <div className="flex justify-center gap-4 mt-8">
            <button 
              onClick={prevTestimonial}
              className="w-12 h-12 rounded-full border border-gold text-gold hover:bg-gold hover:text-[#0a0a23] transition flex items-center justify-center"
            >
              ←
            </button>
            <div className="flex items-center gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-3 h-3 rounded-full transition ${idx === currentIndex ? 'bg-gold' : 'bg-white/30'}`}
                />
              ))}
            </div>
            <button 
              onClick={nextTestimonial}
              className="w-12 h-12 rounded-full border border-gold text-gold hover:bg-gold hover:text-[#0a0a23] transition flex items-center justify-center"
            >
              →
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-gold">500+</div>
            <div className="text-white/60">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gold">4.9</div>
            <div className="text-white/60">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <ThumbsUp className="w-6 h-6 text-gold" />
              <span className="text-3xl font-bold text-gold">98%</span>
            </div>
            <div className="text-white/60">Recommended</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <ShoppingBag className="w-6 h-6 text-gold" />
              <span className="text-3xl font-bold text-gold">1000+</span>
            </div>
            <div className="text-white/60">Orders</div>
          </div>
        </div>
      </div>
    </section>
  );
}