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
  neckles: dedupe([
    'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635069/neckles-1_rbhzgd.jpg',
    'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635070/neckles-2_ifgegk.jpg',
    'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635074/newcollection-1_w3fvox.jpg',
    'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635075/newcollection-2_y84q01.jpg',
  ]),
  earing: dedupe([
    'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635055/earing-1_iobl42.jpg',
    'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635059/earing-4_umxjjo.jpg',
    'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635077/newcollection-3_tacjvs.jpg',
    'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635078/newcollection-4_ijlsmi.jpg',
  ]),
  bangals: dedupe([
    'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635036/bangals-1_d4pzeq.jpg',
    'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635038/bangals-5_fd7gek.jpg',
    'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635078/newcollection-4_ijlsmi.jpg',
    'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635080/newcollection-5_u8sk9n.jpg',
  ]),
  bracelet: dedupe([
    'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635043/bracelet-1_eb7gcf.jpg',
    'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635077/newcollection-3_tacjvs.jpg',
    'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635080/newcollection-5_u8sk9n.jpg',
    'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635075/newcollection-2_y84q01.jpg',
  ]),
  suit: dedupe([
    'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635113/suit-20_rquv3r.jpg',
    'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635129/suit-30_gdgbdt.jpg',
    'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635130/suit-31_nnxefy.jpg',
    'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635132/suit-32_gmhzyl.jpg',
    'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635133/suit-33_oy1nkf.jpg',
  ]),
  summer: dedupe([
    'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635140/summer-2_bykcf3.jpg',
    'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635512/summer-3_pfcsvr.jpg',
    'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635512/summer-4_ga77ea.jpg',
    'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635513/summer-5_r3pptq.jpg',
  ]),
  newcollection: dedupe([
    'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635074/newcollection-1_w3fvox.jpg',
    'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635075/newcollection-2_y84q01.jpg',
    'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635077/newcollection-3_tacjvs.jpg',
    'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635078/newcollection-4_ijlsmi.jpg',
    'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635080/newcollection-5_u8sk9n.jpg',
    'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635081/newcollection-6_ogng4l.jpg',
  ]),
};

const buildProductImages = (slug: string): string[] => {
  switch (slug) {
    case 'gold-crescent-necklace':
      return dedupe([
        ...circularSlice(imageSets.neckles, 0, 4),
        ...circularSlice(imageSets.newcollection, 0, 2),
      ]);
    case 'bridal-necklace-set':
      return dedupe([
        ...circularSlice(imageSets.neckles, 1, 4),
        ...circularSlice(imageSets.newcollection, 2, 3),
      ]);
    case 'navy-velvet-abaya':
      return dedupe([
        ...circularSlice(imageSets.suit, 0, 4),
        ...circularSlice(imageSets.summer, 0, 2),
      ]);
    case 'silk-abaya-set':
      return dedupe([
        ...circularSlice(imageSets.suit, 1, 4),
        ...circularSlice(imageSets.newcollection, 3, 2),
      ]);
    case 'royal-abaya':
      return dedupe([
        ...circularSlice(imageSets.suit, 2, 4),
        ...circularSlice(imageSets.summer, 1, 2),
      ]);
    case 'party-wear-saree':
      return dedupe([
        ...circularSlice(imageSets.suit, 3, 4),
        ...circularSlice(imageSets.newcollection, 1, 2),
      ]);
    case 'summer-suit':
      return dedupe([
        ...circularSlice(imageSets.summer, 0, 4),
        ...circularSlice(imageSets.suit, 0, 2),
      ]);
    case 'winter-collection':
      return dedupe([
        ...circularSlice(imageSets.suit, 1, 4),
        ...circularSlice(imageSets.summer, 2, 2),
      ]);
    case 'kashmiri-shawl':
      return dedupe([
        ...circularSlice(imageSets.suit, 0, 3),
        ...circularSlice(imageSets.summer, 1, 2),
      ]);
    case 'kashmiri-bangals':
      return dedupe([...circularSlice(imageSets.bangals, 0, 4)]);
    case 'pearl-earrings':
      return dedupe([...circularSlice(imageSets.earing, 0, 4)]);
    case 'diamond-stud-earrings':
      return dedupe([...circularSlice(imageSets.earing, 1, 4)]);
    case 'gold-ring-set':
      return dedupe([
        ...circularSlice(imageSets.earing, 2, 3),
        ...circularSlice(imageSets.bangals, 1, 3),
      ]);
    case 'diamond-bracelet':
      return dedupe([
        ...circularSlice(imageSets.bracelet, 0, 4),
        ...circularSlice(imageSets.newcollection, 2, 2),
      ]);
    case 'crystal-hair-band':
      return dedupe([
        ...circularSlice(imageSets.newcollection, 0, 4),
        ...circularSlice(imageSets.bracelet, 1, 2),
      ]);
    case 'luxury-perfume':
      return dedupe([
        ...circularSlice(imageSets.newcollection, 2, 4),
        ...circularSlice(imageSets.summer, 0, 2),
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

export const PRODUCT_BY_ID: Record<string, CatalogProduct> = PRODUCT_CATALOG.reduce((acc, product) => {
  acc[String(product.id)] = product;
  return acc;
}, {} as Record<string, CatalogProduct>);
