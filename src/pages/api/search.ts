import Fuse from 'fuse.js';
import type { NextApiRequest, NextApiResponse } from 'next';

// Mock product data (replace with DB fetch)
const products = [
  { id: '1', name: 'Luxury Necklace', category: 'Jewelry', tags: ['necklace', 'gold'], description: 'Elegant gold necklace.', price: 4999, image: 'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1/sapphura/products/neckles-1.jpeg' },
  { id: '2', name: 'Abaya Dress', category: 'Clothes', tags: ['abaya', 'dress'], description: 'Premium abaya dress.', price: 2999, image: 'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1/sapphura/products/abaya-1.jpeg' },
  { id: '3', name: 'Bangle Bliss', category: 'Jewelry', tags: ['bangle', 'gold'], description: 'Luxury gold bangle.', price: 1999, image: 'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1/sapphura/products/bangals-1.jpeg' },
  { id: '4', name: 'Emerald Earrings', category: 'Jewelry', tags: ['earring', 'emerald'], description: 'Emerald stud earrings.', price: 2499, image: 'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1/sapphura/products/earring-1.jpeg' },
];

const fuse = new Fuse(products, {
  keys: ['name', 'category', 'tags', 'description'],
  threshold: 0.3,
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req.query;
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ products: [] });
  }
  const results = fuse.search(query).map(r => r.item);
  res.status(200).json({ products: results });
}
