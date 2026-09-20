import { PrismaClient } from '@prisma/client';
import { seedStates } from './states';
import { seedDistricts } from './districts';
import { seedOrganizations } from './organizations';
import { seedUsers } from './users';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  await seedStates(prisma);
  await seedDistricts(prisma);
  await seedOrganizations(prisma);
  await seedUsers(prisma);

  console.log('✅ Seeding completed.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
