import { PrismaClient } from '@prisma/client';

export async function seedStates(prisma: PrismaClient) {
  console.log('Seeding States...');
  
  const states = [
    { id: 1, name: 'Maharashtra', code: 'MH' },
    { id: 2, name: 'Gujarat', code: 'GJ' },
    { id: 3, name: 'Karnataka', code: 'KA' },
  ];

  for (const state of states) {
    await prisma.state.upsert({
      where: { id: state.id },
      update: state,
      create: state,
    });
  }
}
