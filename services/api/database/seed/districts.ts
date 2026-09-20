import { PrismaClient } from '@prisma/client';

export async function seedDistricts(prisma: PrismaClient) {
  console.log('Seeding Districts...');
  
  const districts = [
    { id: 1, name: 'Mumbai', stateId: 1 },
    { id: 2, name: 'Pune', stateId: 1 },
    { id: 3, name: 'Ahmedabad', stateId: 2 },
    { id: 4, name: 'Surat', stateId: 2 },
    { id: 5, name: 'Bengaluru', stateId: 3 },
  ];

  for (const district of districts) {
    // Basic insert without centroid for now, spatial queries will be added later
    await prisma.district.upsert({
      where: { id: district.id },
      update: { name: district.name, stateId: district.stateId },
      create: { id: district.id, name: district.name, stateId: district.stateId },
    });
  }
}
