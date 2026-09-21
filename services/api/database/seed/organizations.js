"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedOrganizations = seedOrganizations;
const client_1 = require("@prisma/client");
async function seedOrganizations(prisma) {
    console.log('Seeding Organizations...');
    const orgs = [
        { name: 'Maharashtra SDMA', type: client_1.OrgType.GOVERNMENT, state: 'Maharashtra' },
        { name: 'Gujarat SDMA', type: client_1.OrgType.GOVERNMENT, state: 'Gujarat' },
        { name: 'Red Cross India', type: client_1.OrgType.NGO, state: 'All' },
    ];
    for (const org of orgs) {
        await prisma.organization.upsert({
            where: { name: org.name },
            update: org,
            create: org,
        });
    }
}
