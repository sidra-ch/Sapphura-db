import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { hash } from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
	const hashedPassword = await hash(process.env.ADMIN_DEFAULT_PASSWORD || '123456', 10);

	await prisma.user.upsert({
		where: { email: process.env.ADMIN_DEFAULT_EMAIL || 'Sapphura@gmail.com' },
		update: {
			password: hashedPassword,
			name: process.env.ADMIN_DEFAULT_NAME || 'Admin User',
			phone: process.env.ADMIN_DEFAULT_PHONE || '+923001234567',
			role: 'admin',
		},
		create: {
			email: process.env.ADMIN_DEFAULT_EMAIL || 'Sapphura@gmail.com',
			password: hashedPassword,
			name: process.env.ADMIN_DEFAULT_NAME || 'Admin User',
			phone: process.env.ADMIN_DEFAULT_PHONE || '+923001234567',
			role: 'admin',
		},
	});

	console.log('Seed completed. Only admin bootstrap user ensured.');
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});