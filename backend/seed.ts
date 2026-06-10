// @ts-ignore: ignore missing Prisma client types if package is not installed yet
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
    await prisma.user.upsert({
        where: { email: 'admin@gmail.com' },
        create: {
            email: 'admin@gmail.com',
            name: 'Administrador',
            password: 'admin12345',
            role: 'ADMIN'
        },
        update: {}
    });

    console.log('Seed feita!');
    await prisma.$disconnect();
}

