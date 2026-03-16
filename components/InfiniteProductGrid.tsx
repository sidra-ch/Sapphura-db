"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { CldImage } from 'next-cloudinary';
import { cloudinaryUrl } from '@/lib/cloudinary';

interface Product {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
}

const InfiniteProductGrid = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const loader = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const res = await fetch(`/api/products?page=${page}`);
      const data = await res.json();
      setProducts((prev) => [...prev, ...data.products]);
      setLoading(false);
    };
    fetchProducts();
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );
    const currentLoader = loader.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }
    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {products.map((product: any) => (
        <div key={product.id} className="border p-2">
          <Image
            src={cloudinaryUrl(product.imageUrl, { width: 400, format: 'webp' })}
            alt={product.name}
            width={400}
            height={400}
            placeholder="blur"
            blurDataURL="/placeholder.png"
            className="rounded mb-2"
            sizes="(max-width: 768px) 100vw, 33vw"
            loading="lazy"
          />
          <div className="font-semibold">{product.name}</div>
        </div>
      ))}
      <div ref={loader}>{loading && 'Loading...'}</div>
    </div>
  );
};

export default InfiniteProductGrid;
