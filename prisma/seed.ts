// Seed script for Sapphura luxury e-commerce
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

// async function main() {
//   // Create categories
//   const categories = await prisma.category.createMany({
//     data: [
//       { name: 'Jewelry' },
//       { name: 'Abaya' },
//       { name: 'Accessories' },
//     ],
//     skipDuplicates: true,
//   });

//   // Create products
//   await prisma.product.createMany({
//     data: [
//       {
//         name: 'Gold Crescent Necklace',
//         description: 'Luxury gold necklace for Ramadan.',
//         price: 299,
//         imageUrl: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80',
//         categoryId: 1,
//       },
//       {
//         name: 'Navy Velvet Abaya',
//         description: 'Elegant navy abaya.',
//         price: 189,
//         imageUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=80',
//         categoryId: 2,
//       },
//     ],
//     skipDuplicates: true,
//   });
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
