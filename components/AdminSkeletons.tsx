"use client";

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export function CardSkeleton() {
  return (
    <div className="bg-[#1a1a40] border border-gold/20 rounded-xl p-4 md:p-6">
      <Skeleton height={24} width="60%" baseColor="#1a1a40" highlightColor="#2a2a50" />
      <Skeleton height={40} width="40%" baseColor="#1a1a40" highlightColor="#2a2a50" className="mt-2" />
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-gold/10">
      <Skeleton height={40} width={60} baseColor="#1a1a40" highlightColor="#2a2a50" />
      <Skeleton height={20} width="30%" baseColor="#1a1a40" highlightColor="#2a2a50" />
      <Skeleton height={20} width="20%" baseColor="#1a1a40" highlightColor="#2a2a50" />
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-[#1a1a40] border border-gold/20 rounded-xl overflow-hidden">
      <Skeleton height={160} baseColor="#1a1a40" highlightColor="#2a2a50" />
      <div className="p-4">
        <Skeleton height={16} width="40%" baseColor="#1a1a40" highlightColor="#2a2a50" />
        <Skeleton height={20} width="70%" baseColor="#1a1a40" highlightColor="#2a2a50" className="mt-2" />
        <Skeleton height={24} width="30%" baseColor="#1a1a40" highlightColor="#2a2a50" className="mt-2" />
      </div>
    </div>
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="bg-[#1a1a40] border border-gold/20 rounded-xl p-4 md:p-6">
      <div className="flex justify-between">
        <Skeleton height={40} width={40} baseColor="#1a1a40" highlightColor="#2a2a50" borderRadius="8px" />
        <Skeleton height={16} width={50} baseColor="#1a1a40" highlightColor="#2a2a50" />
      </div>
      <Skeleton height={32} width="50%" baseColor="#1a1a40" highlightColor="#2a2a50" className="mt-4" />
      <Skeleton height={16} width="30%" baseColor="#1a1a40" highlightColor="#2a2a50" className="mt-2" />
    </div>
  );
}

export function OrderCardSkeleton() {
  return (
    <div className="bg-[#1a1a40] border border-gold/20 rounded-xl p-4 md:p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <Skeleton height={24} width={100} baseColor="#1a1a40" highlightColor="#2a2a50" />
          <Skeleton height={16} width={150} baseColor="#1a1a40" highlightColor="#2a2a50" className="mt-2" />
        </div>
        <Skeleton height={28} width={80} baseColor="#1a1a40" highlightColor="#2a2a50" borderRadius="14px" />
      </div>
      <div className="flex justify-between">
        <Skeleton height={16} width={60} baseColor="#1a1a40" highlightColor="#2a2a50" />
        <Skeleton height={20} width={60} baseColor="#1a1a40" highlightColor="#2a2a50" />
      </div>
    </div>
  );
}
