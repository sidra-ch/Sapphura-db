"use client";

import React from 'react';
import { Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react';
import dynamic from 'next/dynamic';

const ContactMap = dynamic(() => import('../../components/ContactMap'), { 
  ssr: false,
  loading: () => <div className="h-[400px] bg-[#0a1535] rounded-2xl border border-gold/20 flex items-center justify-center"><span className="text-gold">Loading Map...</span></div>
});

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0B1C3F]">
      <div className="relative h-[300px] flex items-center justify-center bg-gradient-to-r from-[#0B1C3F] to-[#1a2d5a]">
        <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773004790/logo-1_gzmux1.png')] bg-cover bg-center opacity-10"></div>
        <h1 className="text-5xl font-bold text-gold relative z-10">Contact Us</h1>
      </div>
      
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold text-gold mb-6">Get In Touch</h2>
            <p className="text-white/80 text-lg mb-8">
              We would love to hear from you. Whether you have a question about our products, 
              need styling advice, or want to place a custom order, our team is here to help.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h3 className="text-gold font-bold">Phone / WhatsApp</h3>
                  <p className="text-white/70">+92 332 0924951</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h3 className="text-gold font-bold">Email</h3>
                  <p className="text-white/70">info@sapphura.com</p>
                  <p className="text-white/70">support@sapphura.com</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h3 className="text-gold font-bold">Address</h3>
                  <p className="text-white/70">Shop #35, Nadir Plaza</p>
                  <p className="text-white/70">5th Road Commercial Market</p>
                  <p className="text-white/70">D Block, Satellite Town</p>
                  <p className="text-white/70">Rawalpindi, Pakistan 46000</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h3 className="text-gold font-bold">Working Hours</h3>
                  <p className="text-white/70">Monday - Saturday: 10:00 AM - 9:00 PM</p>
                  <p className="text-white/70">Sunday: 12:00 PM - 6:00 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-gold font-bold">WhatsApp</h3>
                  <p className="text-white/70">+92 332 0924951</p>
                  <a 
                    href="https://wa.me/923320924951" 
                    target="_blank" 
                    rel="noopener"
                    className="inline-block mt-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                  >
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#0a1535] p-8 rounded-2xl border border-gold/20">
            <h2 className="text-2xl font-bold text-gold mb-6">Send Us a Message</h2>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 mb-2">First Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-[#0B1C3F] border border-gold/30 rounded-lg text-white focus:border-gold focus:outline-none"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-white/80 mb-2">Last Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-[#0B1C3F] border border-gold/30 rounded-lg text-white focus:border-gold focus:outline-none"
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div>
                <label className="block text-white/80 mb-2">Email</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-3 bg-[#0B1C3F] border border-gold/30 rounded-lg text-white focus:border-gold focus:outline-none"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-white/80 mb-2">Phone</label>
                <input 
                  type="tel" 
                  className="w-full px-4 py-3 bg-[#0B1C3F] border border-gold/30 rounded-lg text-white focus:border-gold focus:outline-none"
                  placeholder="+92 300 123 4567"
                />
              </div>
              <div>
                <label className="block text-white/80 mb-2">Subject</label>
                <select className="w-full px-4 py-3 bg-[#0B1C3F] border border-gold/30 rounded-lg text-white focus:border-gold focus:outline-none">
                  <option>General Inquiry</option>
                  <option>Product Question</option>
                  <option>Custom Order</option>
                  <option>Complaint</option>
                  <option>Partnership</option>
                </select>
              </div>
              <div>
                <label className="block text-white/80 mb-2">Message</label>
                <textarea 
                  rows={5}
                  className="w-full px-4 py-3 bg-[#0B1C3F] border border-gold/30 rounded-lg text-white focus:border-gold focus:outline-none resize-none"
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              <button 
                type="submit"
                className="w-full bg-gold text-[#0B1C3F] font-bold py-4 rounded-lg hover:bg-yellow-500 transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gold mb-8 text-center">Find Us</h2>
          <ContactMap />
        </div>
      </div>
    </div>
  );
}
