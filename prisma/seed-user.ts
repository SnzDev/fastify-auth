import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const existingAdmin = await prisma.user.findFirst({
    where: { role: 'ADMIN' },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('adminpassword', 10);

    await prisma.user.create({
      data: {
        email: 'admin@example.com',
        passwordHash: hashedPassword,
        role: 'ADMIN',
        name: 'Admin User',
      },
    });

    console.log('Admin user created.');
  } else {
    console.log('Admin user already exists.');
  }

  const existingUser = await prisma.user.findFirst({
    where: { role: 'ADMIN' },
  });

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash('userpassword', 10);

    await prisma.user.create({
      data: {
        email: 'user@example.com',
        passwordHash: hashedPassword,
        role: 'USER',
        name: 'Regular User',
      },
    });

    console.log('Regular user created.');
  } else {
    console.log('Regular user already exists.');
  }
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
