"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../../components/auth/AuthContext';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Package, ShoppingCart, Users, Tag, Star, 
  Settings, BarChart3, TrendingUp, DollarSign, Box,
  ChevronRight, LogOut, Menu, X, Eye, Search
} from 'lucide-react';
import Link from 'next/link';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
  { id: 'orders', label: 'Orders', icon: ShoppingCart, href: '/admin/orders' },
  { id: 'products', label: 'Products', icon: Package, href: '/admin/products' },
  { id: 'categories', label: 'Categories', icon: Box, href: '/admin/categories' },
  { id: 'customers', label: 'Customers', icon: Users, href: '/admin/customers' },
  { id: 'coupons', label: 'Coupons', icon: Tag, href: '/admin/coupons' },
  { id: 'reviews', label: 'Reviews', icon: Star, href: '/admin/reviews' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, href: '/admin/analytics' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/admin/settings' },
];

const stats = [
  { label: 'Total Sales', value: '$12,450', change: '+12%', icon: DollarSign, color: 'text-green-400', trend: 'up' },
  { label: 'Total Orders', value: '156', change: '+8%', icon: ShoppingCart, color: 'text-blue-400', trend: 'up' },
  { label: 'Customers', value: '89', change: '+15%', icon: Users, color: 'text-purple-400', trend: 'up' },
  { label: 'Revenue', value: '$8,230', change: '+22%', icon: TrendingUp, color: 'text-gold', trend: 'up' },
];

const recentOrders = [
  { id: 'ORD-001', customer: 'John Doe', total: 599, status: 'Delivered', date: '2024-01-15', items: 3 },
  { id: 'ORD-002', customer: 'Jane Smith', total: 299, status: 'Shipped', date: '2024-01-14', items: 1 },
  { id: 'ORD-003', customer: 'Mike Johnson', total: 449, status: 'Processing', date: '2024-01-13', items: 2 },
  { id: 'ORD-004', customer: 'Sarah Wilson', total: 799, status: 'Pending', date: '2024-01-12', items: 4 },
  { id: 'ORD-005', customer: 'Ahmed Khan', total: 199, status: 'Delivered', date: '2024-01-11', items: 1 },
];

const topProducts = [
  { id: 1, name: 'Gold Crescent Necklace', sold: 45, revenue: 13455, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=100&h=100&fit=crop' },
  { id: 2, name: 'Diamond Bracelet', sold: 38, revenue: 15162, image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=100&h=100&fit=crop' },
  { id: 3, name: 'Bridal Necklace Set', sold: 25, revenue: 14975, image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=100&h=100&fit=crop' },
  { id: 4, name: 'Royal Embroidered Abaya', sold: 32, revenue: 7968, image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=100&h=100&fit=crop' },
];

export default function AdminPage() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      window.location.href = '/store/login';
    }
  }, [user]);

  if (!user || user.role !== 'admin') {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-500/20 text-green-400';
      case 'Shipped': return 'bg-blue-500/20 text-blue-400';
      case 'Processing': return 'bg-yellow-500/20 text-yellow-400';
      case 'Pending': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a23] flex">
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0B1A2F] border-r border-gold/20 flex flex-col transform transition-transform duration-300 ease-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-4 lg:p-6 border-b border-gold/20 flex items-center justify-between">
          <Link href="/admin" className="focus:outline-none">
            <h1 className="text-xl lg:text-2xl font-bold text-gold hover:text-yellow-300 transition-colors">SAPPURA</h1>
            <p className="text-white/50 text-xs">Admin Panel</p>
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-2 lg:p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                className="flex items-center gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg transition-all duration-150 text-white/70 hover:bg-gold/10 hover:text-gold"
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-2 lg:p-4 border-t border-gold/20">
          <button
            onClick={() => { logout(); window.location.href = '/'; }}
            className="w-full flex items-center gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors text-sm lg:text-base"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="truncate">Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <header className="lg:hidden flex items-center justify-between p-4 bg-[#0B1A2F] border-b border-gold/20">
          <button onClick={() => setSidebarOpen(true)} className="text-gold p-2 hover:bg-gold/10 rounded-lg transition-colors">
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-gold">Admin</h1>
          <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center text-[#0a0a23] font-bold text-sm">
            {user.name?.charAt(0) || 'A'}
          </div>
        </header>

        <div className="p-4 lg:p-8">
          <header className="hidden lg:flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-white">Dashboard</h2>
              <p className="text-white/50">Welcome back, {user.name || 'Admin'}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-[#1a1a40] border border-gold/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-gold transition-colors"
                />
              </div>
              <span className="text-white/70 text-sm">Last login: Today</span>
              <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center text-[#0a0a23] font-bold">
                {user.name?.charAt(0) || 'A'}
              </div>
            </div>
          </header>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                    className="bg-[#1a1a40] border border-gold/20 rounded-xl p-3 lg:p-6 hover:border-gold/50 transition-colors cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-2 lg:mb-4">
                      <div className={`p-2 lg:p-3 rounded-lg bg-gold/10 ${stat.color}`}>
                        <Icon className="w-4 h-4 lg:w-6 lg:h-6" />
                      </div>
                      <span className="text-green-400 text-xs lg:text-sm flex items-center gap-1">
                        {stat.change}
                        <TrendingUp className="w-3 h-3" />
                      </span>
                    </div>
                    <h3 className="text-lg lg:text-2xl font-bold text-white mb-1">{stat.value}</h3>
                    <p className="text-white/50 text-xs lg:text-sm">{stat.label}</p>
                  </motion.div>
                );
              })}
            </div>

            <div className="bg-[#1a1a40] border border-gold/20 rounded-xl p-3 lg:p-6 mb-6 lg:mb-8 overflow-hidden">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 lg:mb-6">
                <h3 className="text-lg lg:text-xl font-bold text-gold">Recent Orders</h3>
                <Link 
                  href="/admin/orders"
                  className="text-gold hover:text-yellow-300 text-xs lg:text-sm flex items-center gap-1 transition-colors"
                >
                  View All <ChevronRight className="w-3 h-3 lg:w-4 lg:h-4" />
                </Link>
              </div>

              <div className="overflow-x-auto -mx-3 lg:mx-0 px-3 lg:px-0">
                <table className="w-full min-w-[500px] lg:min-w-0">
                  <thead>
                    <tr className="border-b border-gold/20">
                      <th className="text-left py-2 lg:py-3 px-2 lg:px-4 text-white/70 font-medium text-xs lg:text-sm">Order ID</th>
                      <th className="text-left py-2 lg:py-3 px-2 lg:px-4 text-white/70 font-medium text-xs lg:text-sm">Customer</th>
                      <th className="text-left py-2 lg:py-3 px-2 lg:px-4 text-white/70 font-medium text-xs lg:text-sm hidden sm:table-cell">Date</th>
                      <th className="text-left py-2 lg:py-3 px-2 lg:px-4 text-white/70 font-medium text-xs lg:text-sm">Status</th>
                      <th className="text-right py-2 lg:py-3 px-2 lg:px-4 text-white/70 font-medium text-xs lg:text-sm">Total</th>
                      <th className="text-right py-2 lg:py-3 px-2 lg:px-4 text-white/70 font-medium text-xs lg:text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <motion.tr 
                        key={order.id} 
                        className="border-b border-gold/10 hover:bg-gold/5 cursor-pointer transition-colors"
                        whileHover={{ backgroundColor: 'rgba(212, 175, 55, 0.1)' }}
                      >
                        <td className="py-2 lg:py-3 px-2 lg:px-4 text-gold font-medium text-xs lg:text-sm">{order.id}</td>
                        <td className="py-2 lg:py-3 px-2 lg:px-4 text-white text-xs lg:text-sm">{order.customer}</td>
                        <td className="py-2 lg:py-3 px-2 lg:px-4 text-white/70 text-xs lg:text-sm hidden sm:table-cell">{order.date}</td>
                        <td className="py-2 lg:py-3 px-2 lg:px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-2 lg:py-3 px-2 lg:px-4 text-white font-bold text-right text-xs lg:text-sm">${order.total}</td>
                        <td className="py-2 lg:py-3 px-2 lg:px-4 text-right">
                          <Link href="/admin/orders" className="p-1 text-gold hover:text-yellow-300 transition-colors inline-block">
                            <Eye className="w-4 h-4" />
                          </Link>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-[#1a1a40] border border-gold/20 rounded-xl p-3 lg:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 lg:mb-6">
                <h3 className="text-lg lg:text-xl font-bold text-gold">Top Products</h3>
                <Link 
                  href="/admin/products"
                  className="text-gold hover:text-yellow-300 text-xs lg:text-sm flex items-center gap-1 transition-colors"
                >
                  View All <ChevronRight className="w-3 h-3 lg:w-4 lg:h-4" />
                </Link>
              </div>

              <div className="space-y-3">
                {topProducts.map((product, index) => (
                  <motion.div 
                    key={product.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                    className="flex items-center gap-4 p-3 bg-[#0a0a23] rounded-xl hover:bg-[#0d0d30] transition-colors cursor-pointer"
                  >
                    <img src={product.image} alt={product.name} className="w-12 h-12 lg:w-16 lg:h-16 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-gold font-medium text-sm lg:text-base truncate">{product.name}</h4>
                      <p className="text-white/50 text-xs lg:text-sm">{product.sold} sold</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold text-sm lg:text-lg">${product.revenue.toLocaleString()}</p>
                      <p className="text-white/50 text-xs">Revenue</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
