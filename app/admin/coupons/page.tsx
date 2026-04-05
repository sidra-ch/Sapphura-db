"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Edit, Trash2, Tag } from 'lucide-react';
import { formatCurrency } from '../../../lib/currency';

const coupons = [
  { id: 1, code: 'SARPURA10', discount: '10%', minOrder: 500, maxUses: 100, used: 45, validUntil: '2024-12-31', status: 'Active' },
  { id: 2, code: 'EID20', discount: '20%', minOrder: 1000, maxUses: 50, used: 32, validUntil: '2024-04-30', status: 'Active' },
  { id: 3, code: 'WELCOME15', discount: '15%', minOrder: 0, maxUses: 200, used: 180, validUntil: '2024-06-30', status: 'Active' },
  { id: 4, code: 'RAMADAN25', discount: '25%', minOrder: 2000, maxUses: 25, used: 25, validUntil: '2024-01-15', status: 'Expired' },
  { id: 5, code: 'FREESHIP', discount: 'Free Shipping', minOrder: 300, maxUses: 500, used: 234, validUntil: '2024-12-31', status: 'Active' },
];

export default function CouponsPage() {
  const [searchQuery] = useState('');

  const filteredCoupons = coupons.filter(c => c.code.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#0a0a23]">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 lg:mb-8">
          <div className="flex items-start sm:items-center gap-4">
            <Link href="/admin" className="p-2 bg-[#1a1a40] rounded-lg text-gold hover:bg-gold/20 transition">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Coupons</h1>
              <p className="text-white/50">Manage discount coupons</p>
            </div>
          </div>
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-gold text-[#0a0a23] rounded-lg font-semibold hover:bg-yellow-400 transition">
            <Plus className="w-5 h-5" /> Create Coupon
          </button>
        </div>

        <div className="grid gap-4">
          {filteredCoupons.map((coupon, index) => (
            <motion.div
              key={coupon.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-[#1a1a40] border border-gold/20 rounded-xl p-4 lg:p-6 hover:border-gold transition"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="p-3 bg-gold/20 rounded-lg">
                    <Tag className="w-6 h-6 text-gold" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-gold font-bold text-xl break-all">{coupon.code}</h3>
                      <span className={`px-2 py-1 rounded text-xs ${coupon.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                        {coupon.status}
                      </span>
                    </div>
                    <p className="text-white/50 text-sm">{coupon.discount} discount • Min order: {formatCurrency(coupon.minOrder)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto justify-between sm:justify-start">
                  <div className="text-center">
                    <p className="text-white font-bold">{coupon.used}/{coupon.maxUses}</p>
                    <p className="text-white/50 text-xs">Uses</p>
                  </div>
                  <div className="text-center hidden sm:block">
                    <p className="text-white/70 text-sm">{coupon.validUntil}</p>
                    <p className="text-white/50 text-xs">Valid until</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-gold hover:bg-gold/20 rounded-lg transition"><Edit className="w-5 h-5" /></button>
                    <button className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition"><Trash2 className="w-5 h-5" /></button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
