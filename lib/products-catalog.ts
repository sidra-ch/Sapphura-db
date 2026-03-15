import cloudinaryPoolsData from './cloudinary-pools.json';

type ProductCategory = 'Jewelry' | 'Abaya' | 'Accessories' | 'Clothing' | 'Makeup';

export interface CatalogProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  description: string;
  category: ProductCategory;
  categoryId: number;
  inStock: boolean;
  rating: number;
  reviews: number;
  images: string[];
}

type Pools = typeof cloudinaryPoolsData.pools;

const pools = cloudinaryPoolsData.pools as Pools;

const dedupe = (items: string[]) => [...new Set(items.filter(Boolean))];

const circularSlice = (items: string[], start: number, count: number): string[] => {
  if (!items.length || count <= 0) return [];
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    out.push(items[(start + i) % items.length]);
  }
  return out;
};

const imageSets = {
  suit: dedupe(pools.suit),
  bangals: dedupe(pools.bangals),
  neckles: dedupe(pools.neckles),
  earing: dedupe(pools.earing),
  summer: dedupe(pools.summer),
  wintercollection: dedupe(pools.wintercollection),
  wintercollection1: dedupe(pools.wintercollection1),
  clothes: dedupe([...pools.clothescollection, ...pools.clothesCollectionAlt]),
  accessories: dedupe(pools.accessories),
  makeup: dedupe(pools.makeup),
  bracelet: dedupe(pools.bracelet),
  newcollection: dedupe([...pools.newcollection, ...pools.newCollectionSingle]),
};

const buildProductImages = (slug: string): string[] => {
  switch (slug) {
    case 'gold-crescent-necklace':
      return dedupe([
        ...circularSlice(imageSets.neckles, 0, 9),
        ...circularSlice(imageSets.newcollection, 0, 6),
      ]);
    case 'bridal-necklace-set':
      return dedupe([
        ...circularSlice(imageSets.neckles, 3, 9),
        ...circularSlice(imageSets.newcollection, 4, 6),
      ]);
    case 'navy-velvet-abaya':
      return dedupe([
        ...circularSlice(imageSets.suit, 0, 18),
        ...circularSlice(imageSets.summer, 0, 4),
      ]);
    case 'silk-abaya-set':
      return dedupe([
        ...circularSlice(imageSets.suit, 18, 18),
        ...circularSlice(imageSets.summer, 4, 4),
      ]);
    case 'royal-abaya':
      return dedupe([
        ...circularSlice(imageSets.suit, 36, 18),
        ...circularSlice(imageSets.summer, 8, 4),
      ]);
    case 'party-wear-saree':
      return dedupe([
        ...circularSlice(imageSets.suit, 54, 18),
        ...circularSlice(imageSets.newcollection, 2, 4),
      ]);
    case 'summer-suit':
      return dedupe([
        ...circularSlice(imageSets.summer, 0, 20),
        ...circularSlice(imageSets.suit, 72, 8),
      ]);
    case 'winter-collection':
      return dedupe([
        ...circularSlice(imageSets.wintercollection, 0, 8),
        ...circularSlice(imageSets.wintercollection1, 0, 2),
        ...circularSlice(imageSets.clothes, 0, 6),
      ]);
    case 'kashmiri-shawl':
      return dedupe([
        ...circularSlice(imageSets.clothes, 0, 12),
        ...circularSlice(imageSets.wintercollection, 2, 6),
      ]);
    case 'kashmiri-bangals':
      return dedupe([...circularSlice(imageSets.bangals, 0, 15)]);
    case 'pearl-earrings':
      return dedupe([...circularSlice(imageSets.earing, 0, 12)]);
    case 'diamond-stud-earrings':
      return dedupe([...circularSlice(imageSets.earing, 4, 12)]);
    case 'gold-ring-set':
      return dedupe([
        ...circularSlice(imageSets.earing, 2, 8),
        ...circularSlice(imageSets.bangals, 2, 7),
      ]);
    case 'diamond-bracelet':
      return dedupe([
        ...circularSlice(imageSets.bracelet, 0, 3),
        ...circularSlice(imageSets.accessories, 0, 3),
        ...circularSlice(imageSets.newcollection, 0, 4),
      ]);
    case 'crystal-hair-band':
      return dedupe([
        ...circularSlice(imageSets.accessories, 0, 3),
        ...circularSlice(imageSets.newcollection, 0, 8),
      ]);
    case 'luxury-perfume':
      return dedupe([
        ...circularSlice(imageSets.makeup, 0, 3),
        ...circularSlice(imageSets.accessories, 0, 3),
        ...circularSlice(imageSets.newcollection, 0, 4),
      ]);
    default:
      return dedupe(circularSlice(imageSets.newcollection, 0, 6));
  }
};

const productBase = [
  {
    id: '1',
    slug: 'gold-crescent-necklace',
    name: 'Gold Crescent Necklace',
    price: 299,
    description: 'Elegant gold necklace featuring a beautiful crescent design. Perfect for special occasions and formal events. Made with premium quality gold and intricate craftsmanship.',
    category: 'Jewelry' as ProductCategory,
    categoryId: 1,
    inStock: true,
    rating: 4.8,
    reviews: 124,
  },
  {
    id: '2',
    slug: 'navy-velvet-abaya',
    name: 'Navy Velvet Abaya',
    price: 189,
    description: 'Luxurious navy velvet abaya with elegant stitching. Perfect for Ramadan and special occasions. Comfortable fabric with premium finish.',
    category: 'Abaya' as ProductCategory,
    categoryId: 2,
    inStock: true,
    rating: 4.7,
    reviews: 89,
  },
  {
    id: '3',
    slug: 'diamond-bracelet',
    name: 'Diamond Bracelet',
    price: 399,
    description: 'Stunning diamond bracelet with premium finish. Perfect for weddings and special events.',
    category: 'Jewelry' as ProductCategory,
    categoryId: 1,
    inStock: true,
    rating: 4.9,
    reviews: 156,
  },
  {
    id: '4',
    slug: 'kashmiri-bangals',
    name: 'Kashmiri Bangals',
    price: 249,
    description: 'Authentic Kashmiri bangles with traditional handcrafted designs. Each piece is unique and made by skilled artisans.',
    category: 'Jewelry' as ProductCategory,
    categoryId: 1,
    inStock: true,
    rating: 4.8,
    reviews: 203,
  },
  {
    id: '5',
    slug: 'pearl-earrings',
    name: 'Pearl Earrings',
    price: 149,
    description: 'Classic pearl earrings with intricate traditional designs. A timeless piece that adds elegance to any outfit.',
    category: 'Jewelry' as ProductCategory,
    categoryId: 1,
    inStock: true,
    rating: 4.7,
    reviews: 156,
  },
  {
    id: '6',
    slug: 'silk-abaya-set',
    name: 'Silk Abaya Set',
    price: 279,
    description: 'Premium silk abaya with matching scarf. Elegant design perfect for special occasions.',
    category: 'Abaya' as ProductCategory,
    categoryId: 2,
    inStock: true,
    rating: 4.9,
    reviews: 78,
  },
  {
    id: '7',
    slug: 'crystal-hair-band',
    name: 'Crystal Hair Band',
    price: 89,
    description: 'Beautiful crystal hair band for elegant look. Perfect for parties and special occasions.',
    category: 'Accessories' as ProductCategory,
    categoryId: 3,
    inStock: true,
    rating: 4.5,
    reviews: 45,
  },
  {
    id: '8',
    slug: 'luxury-perfume',
    name: 'Luxury Perfume',
    price: 199,
    description: 'Exquisite long-lasting fragrance. A signature scent for the elegant woman.',
    category: 'Makeup' as ProductCategory,
    categoryId: 5,
    inStock: true,
    rating: 4.6,
    reviews: 234,
  },
  {
    id: '9',
    slug: 'gold-ring-set',
    name: 'Gold Ring Set',
    price: 179,
    description: 'Elegant gold ring set with traditional designs. Perfect for weddings and special occasions.',
    category: 'Jewelry' as ProductCategory,
    categoryId: 1,
    inStock: true,
    rating: 4.6,
    reviews: 92,
  },
  {
    id: '10',
    slug: 'summer-suit',
    name: 'Summer Suit',
    price: 199,
    description: 'Light and breathable summer suit perfect for hot weather. Available in multiple colors with comfortable fit.',
    category: 'Clothing' as ProductCategory,
    categoryId: 4,
    inStock: true,
    rating: 4.5,
    reviews: 91,
  },
  {
    id: '11',
    slug: 'winter-collection',
    name: 'Winter Collection',
    price: 299,
    description: 'Elegant winter collection with premium quality materials. Perfect for the cold season.',
    category: 'Clothing' as ProductCategory,
    categoryId: 4,
    inStock: true,
    rating: 4.9,
    reviews: 45,
  },
  {
    id: '12',
    slug: 'bridal-necklace-set',
    name: 'Bridal Necklace Set',
    price: 599,
    description: 'Stunning bridal necklace set with intricate designs. Perfect for your special day.',
    category: 'Jewelry' as ProductCategory,
    categoryId: 1,
    inStock: true,
    rating: 5.0,
    reviews: 34,
  },
  {
    id: '13',
    slug: 'royal-abaya',
    name: 'Royal Embroidered Abaya',
    price: 249,
    description: 'Royal embroidered abaya with beautiful patterns. Perfect for special occasions.',
    category: 'Abaya' as ProductCategory,
    categoryId: 2,
    inStock: true,
    rating: 4.9,
    reviews: 56,
  },
  {
    id: '14',
    slug: 'diamond-stud-earrings',
    name: 'Diamond Stud Earrings',
    price: 349,
    description: 'Classic diamond stud earrings. Timeless elegance for any occasion.',
    category: 'Jewelry' as ProductCategory,
    categoryId: 1,
    inStock: true,
    rating: 4.8,
    reviews: 112,
  },
  {
    id: '15',
    slug: 'kashmiri-shawl',
    name: 'Kashmiri Shawl',
    price: 199,
    description: 'Authentic Kashmiri pashmina shawl. Luxurious warmth and elegance.',
    category: 'Clothing' as ProductCategory,
    categoryId: 4,
    inStock: true,
    rating: 4.7,
    reviews: 67,
  },
  {
    id: '16',
    slug: 'party-wear-saree',
    name: 'Party Wear Saree',
    price: 289,
    description: 'Elegant party wear saree. Perfect for celebrations and special events.',
    category: 'Clothing' as ProductCategory,
    categoryId: 4,
    inStock: true,
    rating: 4.8,
    reviews: 89,
  },
];

export const PRODUCT_CATALOG: CatalogProduct[] = productBase.map((product) => ({
  ...product,
  images: buildProductImages(product.slug),
}));

export const PRODUCT_BY_SLUG: Record<string, CatalogProduct> = PRODUCT_CATALOG.reduce((acc, product) => {
  acc[product.slug] = product;
  return acc;
}, {} as Record<string, CatalogProduct>);
