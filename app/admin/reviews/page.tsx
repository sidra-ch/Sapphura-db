"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Check, X, ThumbsUp, ThumbsDown } from 'lucide-react';

const reviews = [
  { id: 1, product: 'Gold Crescent Necklace', customer: 'John Doe', rating: 5, comment: 'Absolutely beautiful! The quality is amazing.', date: '2024-01-15', status: 'Approved' },
  { id: 2, product: 'Diamond Bracelet', customer: 'Jane Smith', rating: 4, comment: 'Very nice but slightly expensive.', date: '2024-01-14', status: 'Approved' },
  { id: 3, product: 'Royal Embroidered Abaya', customer: 'Mike Johnson', rating: 5, comment: 'Love it! Perfect for Eid.', date: '2024-01-13', status: 'Pending' },
  { id: 4, product: 'Kashmiri Bangals', customer: 'Sarah Wilson', rating: 3, comment: 'Average quality, expected better.', date: '2024-01-12', status: 'Pending' },
  { id: 5, product: 'Elegant Earrings', customer: 'Ahmed Khan', rating: 5, comment: 'My wife loved them! Great service.', date: '2024-01-11', status: 'Approved' },
];

export default function ReviewsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a23]">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex items-start sm:items-center gap-4 mb-6 lg:mb-8">
          <Link href="/admin" className="p-2 bg-[#1a1a40] rounded-lg text-gold hover:bg-gold/20 transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Reviews</h1>
            <p className="text-white/50">Manage customer reviews</p>
          </div>
        </div>

        <div className="space-y-4">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-[#1a1a40] border border-gold/20 rounded-xl p-4 lg:p-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="text-gold font-bold">{review.product}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${review.status === 'Approved' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {review.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-gold fill-gold' : 'text-white/30'}`} />
                    ))}
                    <span className="text-white/50 text-sm">by {review.customer}</span>
                  </div>
                  <p className="text-white/70">&quot;{review.comment}&quot;</p>
                  <p className="text-white/30 text-sm mt-2">{review.date}</p>
                </div>
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  {review.status === 'Pending' && (
                    <>
                      <button className="w-full sm:w-auto flex items-center justify-center gap-1 px-3 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition">
                        <Check className="w-4 h-4" /> Approve
                      </button>
                      <button className="w-full sm:w-auto flex items-center justify-center gap-1 px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition">
                        <X className="w-4 h-4" /> Reject
                      </button>
                    </>
                  )}
                  <button className="p-2 text-white/50 hover:text-white transition"><ThumbsUp className="w-5 h-5" /></button>
                  <button className="p-2 text-white/50 hover:text-white transition"><ThumbsDown className="w-5 h-5" /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
