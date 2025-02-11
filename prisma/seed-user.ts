import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Check if there is already an admin user
  const existingAdmin = await prisma.user.findFirst({
    where: { role: 'admin' },
  })

  if (!existingAdmin) {
    // Create an admin user if it doesn't exist
    const hashedPassword = await bcrypt.hash('adminpassword', 10)

    await prisma.user.create({
      data: {
        email: 'admin@example.com',
        passwordHash: hashedPassword,
        role: 'admin', // Assign the "admin" role
        name: 'Admin User',
      }
    })

    console.log('Admin user created.')
  } else {
    console.log('Admin user already exists.')
  }

  // Check if there is already a regular user
  const existingUser = await prisma.user.findFirst({
    where: { role: 'user' },
  })

  if (!existingUser) {
    // Create a regular user if it doesn't exist
    const hashedPassword = await bcrypt.hash('userpassword', 10)

    await prisma.user.create({
      data: {
        email: 'user@example.com',
        passwordHash: hashedPassword,
        role: 'user', // Assign the "user" role
        name: 'Regular User',
      }
    })

    console.log('Regular user created.')
  } else {
    console.log('Regular user already exists.')
  }
}

main()
  .catch(e => {
    console.error(e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
