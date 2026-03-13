"use client";
import React from "react";
import { BarChart2, ShoppingBag, Users, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const stats = [
  { label: "Total Sales", value: "$12,500", icon: <BarChart2 className="w-6 h-6 text-gold" /> },
  { label: "Orders", value: "320", icon: <ShoppingBag className="w-6 h-6 text-gold" /> },
  { label: "Customers", value: "180", icon: <Users className="w-6 h-6 text-gold" /> },
];

const actions = [
  { label: "Manage Products", href: "/admin/products", icon: <ShoppingBag className="w-5 h-5" /> },
  { label: "Manage Orders", href: "/admin/orders", icon: <BarChart2 className="w-5 h-5" /> },
  { label: "Manage Customers", href: "/admin/customers", icon: <Users className="w-5 h-5" /> },
  { label: "Settings", href: "/admin/settings", icon: <Settings className="w-5 h-5" /> },
];

export default function AdminDashboard() {
  return (
    <main className="min-h-screen bg-[#0a0a23] py-16 px-4 md:px-16">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gold drop-shadow-lg">Admin Dashboard</h1>
          <Button variant="destructive" size="sm" className="flex items-center gap-2">
            <LogOut className="w-5 h-5" /> Logout
          </Button>
        </div>
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-[#1a1a40] border border-gold rounded-xl p-8 shadow-lg flex flex-col items-center">
              {stat.icon}
              <div className="text-2xl font-bold text-gold mt-4 mb-2">{stat.value}</div>
              <div className="text-white/80 text-lg">{stat.label}</div>
            </div>
          ))}
        </section>
        <section>
          <h2 className="text-2xl font-semibold text-gold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {actions.map((action) => (
              <Link key={action.label} href={action.href}>
                <Button className="w-full bg-gold text-[#0a0a23] font-semibold py-6 rounded-xl shadow hover:bg-yellow-400 transition flex items-center gap-3 text-lg">
                  {action.icon} {action.label}
                </Button>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
