"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Eye, MousePointer } from 'lucide-react';

const stats = [
  { label: 'Total Revenue', value: '$45,230', change: '+12.5%', trend: 'up', icon: DollarSign },
  { label: 'Total Orders', value: '156', change: '+8.2%', trend: 'up', icon: ShoppingCart },
  { label: 'Total Customers', value: '89', change: '+15.3%', trend: 'up', icon: Users },
  { label: 'Page Views', value: '12,450', change: '+22.1%', trend: 'up', icon: Eye },
  { label: 'Conversion Rate', value: '3.2%', change: '-0.5%', trend: 'down', icon: MousePointer },
];

const monthlyData = [
  { month: 'Jul', sales: 12000 },
  { month: 'Aug', sales: 15000 },
  { month: 'Sep', sales: 18000 },
  { month: 'Oct', sales: 14000 },
  { month: 'Nov', sales: 22000 },
  { month: 'Dec', sales: 28000 },
  { month: 'Jan', sales: 35000 },
  { month: 'Feb', sales: 32000 },
];

export default function AnalyticsPage() {
  const maxSales = Math.max(...monthlyData.map(d => d.sales));

  return (
    <div className="min-h-screen bg-[#0a0a23]">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex items-start sm:items-center gap-4 mb-6 lg:mb-8">
          <Link href="/admin" className="p-2 bg-[#1a1a40] rounded-lg text-gold hover:bg-gold/20 transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Analytics</h1>
            <p className="text-white/50">Track your store performance</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#1a1a40] border border-gold/20 rounded-xl p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <Icon className="w-6 h-6 text-gold" />
                  <span className={`flex items-center gap-1 text-sm ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                    {stat.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {stat.change}
                  </span>
                </div>
                <p className="text-white font-bold text-xl">{stat.value}</p>
                <p className="text-white/50 text-sm">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="bg-[#1a1a40] border border-gold/20 rounded-xl p-4 lg:p-6 mb-8">
          <h2 className="text-xl font-bold text-gold mb-6">Sales Overview</h2>
          <div className="overflow-x-auto -mx-1 px-1">
            <div className="min-w-[560px]">
              <div className="flex items-end justify-between gap-2 h-64">
                {monthlyData.map((data, index) => (
                  <motion.div
                    key={data.month}
                    initial={{ height: 0 }}
                    animate={{ height: `${(data.sales / maxSales) * 100}%` }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="flex-1 bg-gradient-to-t from-gold/30 to-gold rounded-t-lg relative group"
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gold text-[#0a0a23] px-2 py-1 rounded text-xs font-bold opacity-0 group-hover:opacity-100 transition">
                      ${data.sales.toLocaleString()}
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="flex justify-between mt-2">
                {monthlyData.map(data => (
                  <span key={data.month} className="text-white/50 text-xs">{data.month}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#1a1a40] border border-gold/20 rounded-xl p-4 sm:p-6">
            <h2 className="text-xl font-bold text-gold mb-4">Top Selling Products</h2>
            <div className="space-y-3">
              {['Gold Crescent Necklace', 'Diamond Bracelet', 'Bridal Necklace Set', 'Royal Embroidered Abaya'].map((product, i) => (
                <div key={product} className="flex items-center justify-between p-2 bg-[#0a0a23] rounded-lg">
                  <span className="text-white truncate pr-3">{product}</span>
                  <span className="text-gold font-bold shrink-0">{45 - i * 10} sold</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#1a1a40] border border-gold/20 rounded-xl p-4 sm:p-6">
            <h2 className="text-xl font-bold text-gold mb-4">Traffic Sources</h2>
            <div className="space-y-3">
              {[
                { source: 'Direct', percent: 45 },
                { source: 'Social Media', percent: 30 },
                { source: 'Organic Search', percent: 15 },
                { source: 'Referral', percent: 10 },
              ].map((item) => (
                <div key={item.source}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white">{item.source}</span>
                    <span className="text-gold">{item.percent}%</span>
                  </div>
                  <div className="h-2 bg-[#0a0a23] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percent}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-gold"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
