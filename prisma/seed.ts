import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { hash } from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
	// Create categories
	await prisma.category.createMany({
		data: [
			{ name: 'Jewelry' },
			{ name: 'Abaya' },
			{ name: 'Accessories' },
			{ name: 'Clothing' },
			{ name: 'Makeup' },
		],
		skipDuplicates: true,
	});

	// Create demo users (password: 123456)
	const hashedPassword = await hash('123456', 10);

	await prisma.user.createMany({
		data: [
			{
				email: 'admin@sapphura.com',
				password: hashedPassword,
				name: 'Admin User',
				phone: '+923001234567',
				role: 'admin',
			},
			{
				email: 'manager@sapphura.com',
				password: hashedPassword,
				name: 'Manager User',
				phone: '+923001234568',
				role: 'manager',
			},
			{
				email: 'customer@sapphura.com',
				password: hashedPassword,
				name: 'Demo Customer',
				phone: '+923001234569',
				role: 'customer',
			},
		],
		skipDuplicates: true,
	});

	// Create products with new schema
	await prisma.product.createMany({
		data: [
			{
				name: 'Gold Crescent Necklace',
				slug: 'gold-crescent-necklace',
				description: 'Luxury gold necklace for Ramadan.',
				price: 299,
				images: '["/neckles-1.jpeg","/neckles-2.jpeg"]',
				stock: 50,
				status: 'active',
				isFeatured: true,
				categoryId: 1,
			},
			{
				name: 'Navy Velvet Abaya',
				slug: 'navy-velvet-abaya',
				description: 'Elegant navy abaya.',
				price: 189,
				images: '["/suit-31.jpeg"]',
				stock: 30,
				status: 'active',
				categoryId: 2,
			},
			{
				name: 'Diamond Bracelet',
				slug: 'diamond-bracelet',
				description: 'Stunning diamond bracelet.',
				price: 399,
				images: '["/bracelet-1.jpeg"]',
				stock: 25,
				status: 'active',
				isFeatured: true,
				categoryId: 3,
			},
			{
				name: 'Kashmiri Bangals',
				slug: 'kashmiri-bangals',
				description: 'Authentic Kashmiri bangles.',
				price: 249,
				images: '["/bangals-1.jpeg"]',
				stock: 40,
				status: 'active',
				categoryId: 1,
			},
		],
		skipDuplicates: true,
	});

	console.log('Seed completed!');
	console.log('Demo accounts created:');
	console.log('  Admin: admin@sapphura.com / 123456');
	console.log('  Manager: manager@sapphura.com / 123456');
	console.log('  Customer: customer@sapphura.com / 123456');
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});