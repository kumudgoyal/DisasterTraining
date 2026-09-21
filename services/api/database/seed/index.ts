import { 
  PrismaClient, 
  Role, 
  OrgType, 
  TrainingStatus, 
  Gender, 
  AttendanceStatus, 
  Severity, 
  AlertStatus, 
  NotificationType, 
  AuditAction 
} from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed process...');

  const passwordHash = await argon2.hash('Password123!');

  console.log('1. Clearing existing data (respecting foreign key constraints)...');
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.alert.deleteMany();
  await prisma.alertRule.deleteMany();
  await prisma.trainingMaterial.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.feedback.deleteMany();
  await prisma.impactAssessment.deleteMany();
  await prisma.postAssessment.deleteMany();
  await prisma.preAssessment.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.trainingParticipant.deleteMany();
  await prisma.participant.deleteMany();
  await prisma.trainingSession.deleteMany();
  await prisma.training.deleteMany();
  await prisma.trainingTopic.deleteMany();
  await prisma.trainingTheme.deleteMany();
  await prisma.trainingType.deleteMany();
  await prisma.district.deleteMany();
  await prisma.state.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  console.log('2. Creating Training Types...');
  const trainingTypeNames = [
    'Community-Based', 'Institutional', 'Specialized', 'Training of Trainers',
    'Awareness', 'Mock Drill', 'Capacity Building', 'Earthquake Response',
    'Flood Management', 'Fire Safety', 'First Aid', 'Search & Rescue'
  ];
  const trainingTypes = [];
  for (const name of trainingTypeNames) {
    const type = await prisma.trainingType.create({
      data: { name, description: `[SEED] ${name} training type` }
    });
    trainingTypes.push(type);
  }

  console.log('3. Creating Training Themes...');
  const themesData = [
    { name: 'Community Preparedness', colorCode: 'blue' },
    { name: 'Institutional Training', colorCode: 'green' },
    { name: 'Disaster Response', colorCode: 'red' },
    { name: 'Mitigation & Prevention', colorCode: 'orange' },
    { name: 'Capacity Building', colorCode: 'purple' }
  ];
  const trainingThemes = [];
  for (const t of themesData) {
    const theme = await prisma.trainingTheme.create({
      data: { name: t.name, colorCode: t.colorCode }
    });
    trainingThemes.push(theme);
  }

  console.log('4. Creating Training Topics...');
  const topicsData = [
    { name: 'Evacuation Planning', theme: 'Community Preparedness' },
    { name: 'Emergency Communication', theme: 'Institutional Training' },
    { name: 'Rapid Needs Assessment', theme: 'Disaster Response' },
    { name: 'Structural Safety', theme: 'Mitigation & Prevention' },
    { name: 'Volunteer Management', theme: 'Capacity Building' }
  ];
  for (const t of topicsData) {
    const theme = trainingThemes.find(th => th.name === t.theme);
    if (theme) {
      await prisma.trainingTopic.create({
        data: { name: t.name, themeId: theme.id, description: `[SEED] ${t.name} topic` }
      });
    }
  }

  console.log('5. Creating States...');
  const statesList = [
    { name: 'Andhra Pradesh', code: 'AP' }, { name: 'Arunachal Pradesh', code: 'AR' },
    { name: 'Assam', code: 'AS' }, { name: 'Bihar', code: 'BR' },
    { name: 'Chhattisgarh', code: 'CG' }, { name: 'Goa', code: 'GA' },
    { name: 'Gujarat', code: 'GJ' }, { name: 'Haryana', code: 'HR' },
    { name: 'Himachal Pradesh', code: 'HP' }, { name: 'Jharkhand', code: 'JH' },
    { name: 'Karnataka', code: 'KA' }, { name: 'Kerala', code: 'KL' },
    { name: 'Madhya Pradesh', code: 'MP' }, { name: 'Maharashtra', code: 'MH' },
    { name: 'Manipur', code: 'MN' }, { name: 'Meghalaya', code: 'ML' },
    { name: 'Mizoram', code: 'MZ' }, { name: 'Nagaland', code: 'NL' },
    { name: 'Odisha', code: 'OD' }, { name: 'Punjab', code: 'PB' },
    { name: 'Rajasthan', code: 'RJ' }, { name: 'Sikkim', code: 'SK' },
    { name: 'Tamil Nadu', code: 'TN' }, { name: 'Telangana', code: 'TS' },
    { name: 'Tripura', code: 'TR' }, { name: 'Uttar Pradesh', code: 'UP' },
    { name: 'Uttarakhand', code: 'UK' }, { name: 'West Bengal', code: 'WB' },
    { name: 'Delhi', code: 'DL' }, { name: 'Chandigarh', code: 'CH' },
    { name: 'Puducherry', code: 'PY' }, { name: 'Ladakh', code: 'LA' },
    { name: 'Jammu & Kashmir', code: 'JK' }, { name: 'Andaman & Nicobar', code: 'AN' },
    { name: 'Lakshadweep', code: 'LD' }, { name: 'Dadra & Nagar Haveli and Daman & Diu', code: 'DD' }
  ];
  
  const createdStates = [];
  for (const s of statesList) {
    const state = await prisma.state.create({ data: s });
    createdStates.push(state);
  }

  console.log('6. Creating Districts...');
  // 5-8 major districts for first 10 states with coordinates
  const districtData = [
    { stateCode: 'AP', name: 'Visakhapatnam', lat: 17.6868, lng: 83.2185 },
    { stateCode: 'AP', name: 'Vijayawada', lat: 16.5062, lng: 80.6480 },
    { stateCode: 'AP', name: 'Guntur', lat: 16.3067, lng: 80.4365 },
    { stateCode: 'AP', name: 'Nellore', lat: 14.4426, lng: 79.9865 },
    { stateCode: 'AP', name: 'Kurnool', lat: 15.8281, lng: 78.0373 },
    
    { stateCode: 'AR', name: 'Itanagar', lat: 27.0844, lng: 93.6053 },
    { stateCode: 'AR', name: 'Tawang', lat: 27.5855, lng: 91.8665 },
    { stateCode: 'AR', name: 'Ziro', lat: 27.5323, lng: 93.8182 },
    { stateCode: 'AR', name: 'Bomdila', lat: 27.2645, lng: 92.4159 },
    { stateCode: 'AR', name: 'Pasighat', lat: 28.0645, lng: 95.3283 },

    { stateCode: 'AS', name: 'Guwahati', lat: 26.1445, lng: 91.7362 },
    { stateCode: 'AS', name: 'Dibrugarh', lat: 27.4728, lng: 94.9120 },
    { stateCode: 'AS', name: 'Silchar', lat: 24.8333, lng: 92.7789 },
    { stateCode: 'AS', name: 'Jorhat', lat: 26.7509, lng: 94.2037 },
    { stateCode: 'AS', name: 'Nagaon', lat: 26.3480, lng: 92.6840 },

    { stateCode: 'BR', name: 'Patna', lat: 25.5941, lng: 85.1376 },
    { stateCode: 'BR', name: 'Gaya', lat: 24.7914, lng: 85.0002 },
    { stateCode: 'BR', name: 'Bhagalpur', lat: 25.2425, lng: 86.9842 },
    { stateCode: 'BR', name: 'Muzaffarpur', lat: 26.1209, lng: 85.3647 },
    { stateCode: 'BR', name: 'Purnia', lat: 25.7711, lng: 87.4740 },

    { stateCode: 'CG', name: 'Raipur', lat: 21.2514, lng: 81.6296 },
    { stateCode: 'CG', name: 'Bhilai', lat: 21.1938, lng: 81.3509 },
    { stateCode: 'CG', name: 'Bilaspur', lat: 22.0797, lng: 82.1391 },
    { stateCode: 'CG', name: 'Korba', lat: 22.3595, lng: 82.6824 },
    { stateCode: 'CG', name: 'Raigarh', lat: 21.8974, lng: 83.3950 },
    
    { stateCode: 'GA', name: 'Panaji', lat: 15.4909, lng: 73.8278 },
    { stateCode: 'GA', name: 'Margao', lat: 15.2736, lng: 73.9582 },
    { stateCode: 'GA', name: 'Vasco da Gama', lat: 15.3970, lng: 73.8122 },
    { stateCode: 'GA', name: 'Mapusa', lat: 15.5937, lng: 73.8105 },
    { stateCode: 'GA', name: 'Ponda', lat: 15.4014, lng: 74.0152 },
    
    { stateCode: 'GJ', name: 'Ahmedabad', lat: 23.0225, lng: 72.5714 },
    { stateCode: 'GJ', name: 'Surat', lat: 21.1702, lng: 72.8311 },
    { stateCode: 'GJ', name: 'Vadodara', lat: 22.3072, lng: 73.1812 },
    { stateCode: 'GJ', name: 'Rajkot', lat: 22.3039, lng: 70.8022 },
    { stateCode: 'GJ', name: 'Bhavnagar', lat: 21.7645, lng: 72.1519 },
    
    { stateCode: 'HR', name: 'Faridabad', lat: 28.4089, lng: 77.3178 },
    { stateCode: 'HR', name: 'Gurugram', lat: 28.4595, lng: 77.0266 },
    { stateCode: 'HR', name: 'Panipat', lat: 29.3909, lng: 76.9708 },
    { stateCode: 'HR', name: 'Ambala', lat: 30.3752, lng: 76.7821 },
    { stateCode: 'HR', name: 'Rohtak', lat: 28.8955, lng: 76.5892 },
    
    { stateCode: 'HP', name: 'Shimla', lat: 31.1048, lng: 77.1734 },
    { stateCode: 'HP', name: 'Manali', lat: 32.2396, lng: 77.1887 },
    { stateCode: 'HP', name: 'Dharamshala', lat: 32.2190, lng: 76.3234 },
    { stateCode: 'HP', name: 'Solan', lat: 30.9084, lng: 77.0999 },
    { stateCode: 'HP', name: 'Mandi', lat: 31.5892, lng: 76.9182 },
    
    { stateCode: 'JH', name: 'Ranchi', lat: 23.3441, lng: 85.3096 },
    { stateCode: 'JH', name: 'Dhanbad', lat: 23.7957, lng: 86.4304 },
    { stateCode: 'JH', name: 'Jamshedpur', lat: 22.8046, lng: 86.2029 },
    { stateCode: 'JH', name: 'Bokaro', lat: 23.7907, lng: 85.9922 },
    { stateCode: 'JH', name: 'Hazaribagh', lat: 23.9925, lng: 85.3637 },
    
    { stateCode: 'DL', name: 'New Delhi', lat: 28.6139, lng: 77.2090 },
    { stateCode: 'MH', name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
    { stateCode: 'KA', name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
  ];

  const createdDistricts = [];
  for (const d of districtData) {
    const state = createdStates.find(s => s.code === d.stateCode);
    if (state) {
      const dist = await prisma.district.create({
        data: { name: d.name, stateId: state.id }
      });
      // Raw SQL for spatial data
      await prisma.$executeRawUnsafe(`
        UPDATE districts 
        SET centroid = ST_SetSRID(ST_MakePoint($1, $2), 4326) 
        WHERE id = $3
      `, d.lng, d.lat, dist.id);
      
      createdDistricts.push({ ...dist, code: d.stateCode });
    }
  }

  console.log('7. Creating Organizations...');
  const orgs = [
    { name: '[SEED] NDMA Headquarters', type: OrgType.GOVERNMENT },
    { name: '[SEED] Maharashtra SDMA', type: OrgType.GOVERNMENT },
    { name: '[SEED] National Institute of Disaster Management', type: OrgType.GOVERNMENT },
    { name: '[SEED] Gujarat SDMA', type: OrgType.GOVERNMENT },
    { name: '[SEED] Tata Trust Disaster Program', type: OrgType.NGO },
    { name: '[SEED] Red Cross India', type: OrgType.NGO },
    { name: '[SEED] Bihar SDMA', type: OrgType.GOVERNMENT },
    { name: '[SEED] National Disaster Response Force', type: OrgType.GOVERNMENT },
  ];
  
  const createdOrgs = [];
  for (const o of orgs) {
    createdOrgs.push(await prisma.organization.create({ data: o }));
  }

  const findOrg = (name: string) => createdOrgs.find(o => o.name === name);

  console.log('8. Creating Users...');
  const users = [
    { name: 'Admin', email: 'admin@disaster-training.gov.in', role: Role.SUPER_ADMIN, orgId: findOrg('[SEED] NDMA Headquarters')?.id },
    { name: 'NDMA Admin', email: 'ndma@disaster-training.gov.in', role: Role.NDMA_ADMIN, orgId: findOrg('[SEED] NDMA Headquarters')?.id },
    { name: 'SDMA User', email: 'sdma.mh@gov.in', role: Role.SDMA, orgId: findOrg('[SEED] Maharashtra SDMA')?.id },
    { name: 'ATI User', email: 'ati@gov.in', role: Role.ATI, orgId: findOrg('[SEED] National Institute of Disaster Management')?.id },
    { name: 'NGO User', email: 'ngo@redcross.in', role: Role.NGO, orgId: findOrg('[SEED] Red Cross India')?.id },
    { name: 'Trainer', email: 'trainer@disaster-training.gov.in', role: Role.TRAINER, orgId: findOrg('[SEED] NDMA Headquarters')?.id },
    { name: 'Reviewer', email: 'reviewer@disaster-training.gov.in', role: Role.REVIEWER, orgId: findOrg('[SEED] NDMA Headquarters')?.id },
    { name: 'Data Entry', email: 'dataentry@disaster-training.gov.in', role: Role.DATA_ENTRY_OPERATOR, orgId: findOrg('[SEED] NDMA Headquarters')?.id },
    { name: 'Viewer', email: 'viewer@disaster-training.gov.in', role: Role.NDMA_VIEWER, orgId: findOrg('[SEED] NDMA Headquarters')?.id }
  ];

  const createdUsers = [];
  for (const u of users) {
    createdUsers.push(await prisma.user.create({
      data: {
        name: u.name,
        email: u.email,
        passwordHash,
        role: u.role,
        ...(u.orgId && { orgId: u.orgId })
      }
    }));
  }

  const creator = createdUsers.find(u => u.email === 'trainer@disaster-training.gov.in');
  const reviewer = createdUsers.find(u => u.email === 'reviewer@disaster-training.gov.in');

  console.log('9. Creating Trainings...');
  const trainingsData = [
    { 
      title: '[SEED] Community Preparedness Training', 
      status: TrainingStatus.COMPLETED, 
      city: 'Mumbai', 
      lat: 19.0760, lng: 72.8777,
      stateCode: 'MH'
    },
    { 
      title: '[SEED] Earthquake Response Workshop', 
      status: TrainingStatus.APPROVED, 
      city: 'New Delhi', 
      lat: 28.6139, lng: 77.2090,
      stateCode: 'DL'
    },
    { 
      title: '[SEED] Flood Management Training', 
      status: TrainingStatus.SUBMITTED, 
      city: 'Patna', 
      lat: 25.5941, lng: 85.1376,
      stateCode: 'BR'
    },
    { 
      title: '[SEED] Fire Safety Awareness', 
      status: TrainingStatus.DRAFT, 
      city: 'Ahmedabad', 
      lat: 23.0225, lng: 72.5714,
      stateCode: 'GJ'
    },
    { 
      title: '[SEED] First Aid Training', 
      status: TrainingStatus.IN_PROGRESS, 
      city: 'Bangalore', 
      lat: 12.9716, lng: 77.5946,
      stateCode: 'KA'
    }
  ];

  const createdTrainings = [];
  for (const t of trainingsData) {
    const district = createdDistricts.find(d => d.name === t.city) || createdDistricts[0];
    const state = createdStates.find(s => s.id === district.stateId) || createdStates[0];
    
    const training = await prisma.training.create({
      data: {
        title: t.title,
        description: `Description for ${t.title}`,
        typeId: trainingTypes[0].id,
        themeId: trainingThemes[0].id,
        orgId: createdOrgs[0].id,
        createdBy: creator!.id,
        reviewedBy: t.status === TrainingStatus.APPROVED || t.status === TrainingStatus.COMPLETED ? reviewer!.id : null,
        startDate: new Date(),
        endDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
        capacity: 50,
        status: t.status,
        stateId: state.id,
        districtId: district.id,
        venue: `${t.city} Center`
      }
    });

    await prisma.$executeRawUnsafe(`
      UPDATE trainings 
      SET location = ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography 
      WHERE id = $3::uuid
    `, t.lng, t.lat, training.id);
    
    createdTrainings.push(training);
  }

  console.log('10. Creating Participants & Junctions...');
  const completedTraining = createdTrainings.find(t => t.status === TrainingStatus.COMPLETED);
  const inProgressTraining = createdTrainings.find(t => t.status === TrainingStatus.IN_PROGRESS);
  
  if (completedTraining && inProgressTraining) {
    for (let i = 1; i <= 10; i++) {
      const participant = await prisma.participant.create({
        data: {
          name: `Participant ${i}`,
          email: `participant${i}@example.com`,
          gender: i % 2 === 0 ? Gender.FEMALE : Gender.MALE,
          age: 20 + i,
        }
      });

      // 11. Creating TrainingParticipant
      await prisma.trainingParticipant.create({
        data: {
          trainingId: completedTraining.id,
          participantId: participant.id
        }
      });
      await prisma.trainingParticipant.create({
        data: {
          trainingId: inProgressTraining.id,
          participantId: participant.id
        }
      });

      // 12. Creating Attendance
      await prisma.attendance.create({
        data: {
          trainingId: completedTraining.id,
          participantId: participant.id,
          attendanceDate: new Date(),
          status: AttendanceStatus.PRESENT,
          markedBy: creator!.id
        }
      });
      await prisma.attendance.create({
        data: {
          trainingId: inProgressTraining.id,
          participantId: participant.id,
          attendanceDate: new Date(),
          status: i % 3 === 0 ? AttendanceStatus.ABSENT : AttendanceStatus.PRESENT,
          markedBy: creator!.id
        }
      });

      // 13. Pre/Post Assessments for completed
      await prisma.preAssessment.create({
        data: {
          trainingId: completedTraining.id,
          participantId: participant.id,
          knowledgeScore: 40 + i * 2,
          preparednessScore: 50,
          confidenceScore: 45,
          overallScore: 45,
        }
      });

      await prisma.postAssessment.create({
        data: {
          trainingId: completedTraining.id,
          participantId: participant.id,
          knowledgeScore: 80 + i,
          preparednessScore: 85,
          confidenceScore: 90,
          overallScore: 85,
        }
      });

      // 15. Feedback
      await prisma.feedback.create({
        data: {
          trainingId: completedTraining.id,
          participantId: participant.id,
          overallRating: 5,
          contentRating: 4,
          trainerRating: 5,
          venueRating: 4,
        }
      });

      // 16. Certificate
      await prisma.certificate.create({
        data: {
          trainingId: completedTraining.id,
          participantId: participant.id,
          certificateNumber: `CERT-${completedTraining.id.substring(0,8)}-${participant.id.substring(0,8)}`,
          issuedBy: creator!.id
        }
      });
    }

    // 14. ImpactAssessment
    await prisma.impactAssessment.create({
      data: {
        trainingId: completedTraining.id,
        avgKnowledgeImprovement: 40.5,
        avgPreparednessImprovement: 35.0,
        avgConfidenceImprovement: 45.0,
        avgOverallImprovement: 40.0,
        impactScore: 85.0,
        participantsAssessed: 10
      }
    });
  }

  console.log('17. Creating Alert Rules...');
  const alertRules = [
    { name: 'LOW_ATTENDANCE', ruleType: 'ATTENDANCE', conditions: { threshold: 50 }, severity: Severity.HIGH },
    { name: 'COVERAGE_GAP', ruleType: 'COVERAGE', conditions: { type: 'gap' }, severity: Severity.MEDIUM },
    { name: 'MISSED_DEADLINE', ruleType: 'SCHEDULE', conditions: { daysOverdue: 2 }, severity: Severity.CRITICAL },
    { name: 'PENDING_APPROVAL', ruleType: 'WORKFLOW', conditions: { daysPending: 5 }, severity: Severity.LOW }
  ];

  const createdRules = [];
  for (const r of alertRules) {
    createdRules.push(await prisma.alertRule.create({ data: r }));
  }

  console.log('18. Creating Alerts...');
  await prisma.alert.create({
    data: {
      ruleId: createdRules[0].id,
      severity: Severity.HIGH,
      message: '[SEED] Low attendance detected for training',
      trainingId: inProgressTraining?.id,
      status: AlertStatus.OPEN
    }
  });

  console.log('19. Creating Notifications...');
  const adminUser = createdUsers.find(u => u.role === Role.SUPER_ADMIN);
  if (adminUser) {
    await prisma.notification.create({
      data: {
        userId: adminUser.id,
        title: 'System Seeded',
        message: 'The database has been seeded with demo data.',
        type: NotificationType.INFO
      }
    });
  }

  console.log('20. Creating Audit Logs...');
  if (adminUser) {
    await prisma.auditLog.create({
      data: {
        userId: adminUser.id,
        role: adminUser.role,
        action: AuditAction.LOGIN,
        module: 'AUTH',
        ipAddress: '127.0.0.1'
      }
    });
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
