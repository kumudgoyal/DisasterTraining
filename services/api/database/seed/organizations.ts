import { PrismaClient, OrgType } from '@prisma/client';

export async function seedOrganizations(prisma: PrismaClient) {
  console.log('Seeding Organizations...');
  
  const orgs = [
    { name: 'Maharashtra SDMA', type: OrgType.GOVERNMENT, state: 'Maharashtra' },
    { name: 'Gujarat SDMA', type: OrgType.GOVERNMENT, state: 'Gujarat' },
    { name: 'Red Cross India', type: OrgType.NGO, state: 'All' },
  ];

  for (const org of orgs) {
    await prisma.organization.upsert({
      where: { name: org.name },
      update: org,
      create: org,
    });
  }
}
