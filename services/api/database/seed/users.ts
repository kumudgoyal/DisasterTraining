import { PrismaClient, Role } from '@prisma/client';
import * as argon2 from 'argon2';

export async function seedUsers(prisma: PrismaClient) {
  console.log('Seeding Users...');
  
  const defaultPassword = await argon2.hash('password123');

  const users = [
    {
      email: 'admin@disaster-training.gov.in',
      name: 'System Admin',
      role: Role.SUPER_ADMIN,
      passwordHash: defaultPassword,
    },
    {
      email: 'sdma@mh.gov.in',
      name: 'MH SDMA Admin',
      role: Role.SDMA,
      passwordHash: defaultPassword,
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: user,
      create: user,
    });
  }
}
