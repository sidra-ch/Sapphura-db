"use client";
import React from "react";
import { User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function UserLoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0a0a23]">
      <div className="bg-[#1a1a40] border border-gold rounded-xl p-10 shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-gold mb-8 flex items-center gap-3">
          <User className="w-7 h-7 text-gold" /> User Login
        </h1>
        <form className="space-y-6">
          <div>
            <label className="block text-gold mb-2">Email</label>
            <input type="email" className="w-full px-4 py-3 rounded-lg bg-[#0a0a23] border border-gold text-white focus:outline-none focus:border-yellow-400" placeholder="user@example.com" />
          </div>
          <div>
            <label className="block text-gold mb-2">Password</label>
            <input type="password" className="w-full px-4 py-3 rounded-lg bg-[#0a0a23] border border-gold text-white focus:outline-none focus:border-yellow-400" placeholder="••••••••" />
          </div>
          <Button className="w-full bg-gold text-[#0a0a23] font-semibold py-3 rounded-lg shadow hover:bg-yellow-400 transition mt-4">
            Login
          </Button>
        </form>
        <div className="mt-6 text-center">
          <Link href="/register">
            <span className="text-gold hover:text-yellow-300 transition">Create Account</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
