import { PrismaClient, Role } from '../app/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const adapter = new PrismaPg({
	connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
	adapter,
});

const adminEmail = 'admin@gmail.com';
const userEmail = 'user@gmail.com';
const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'admin1234';
const userPassword = process.env.SEED_USER_PASSWORD ?? 'user1234';

async function main() {
	const [adminHash, userHash] = await Promise.all([bcrypt.hash(adminPassword, 10), bcrypt.hash(userPassword, 10)]);

	await prisma.user.upsert({
		where: { email: adminEmail },
		update: {
			name: 'Admin',
			password: adminHash,
			role: Role.ADMIN,
		},
		create: {
			name: 'Admin',
			email: adminEmail,
			password: adminHash,
			role: Role.ADMIN,
		},
	});

	await prisma.user.upsert({
		where: { email: userEmail },
		update: {
			name: 'User',
			password: userHash,
			role: Role.USER,
		},
		create: {
			name: 'User',
			email: userEmail,
			password: userHash,
			role: Role.USER,
		},
	});
}

main()
	.catch(async (error) => {
		process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
		process.exitCode = 1;
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
