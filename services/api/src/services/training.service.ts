import { prisma } from '../config/database';
import { notFound, badRequest } from '../utils/errors';
import { NotificationService } from './notification.service';
import { Prisma } from '@prisma/client';
import { createPaginatedResponse } from '../utils/pagination';

const STATUS_TRANSITIONS: Record<string, string[]> = {
  DRAFT: ['SUBMITTED', 'CANCELLED'],
  SUBMITTED: ['UNDER_REVIEW', 'REJECTED', 'DRAFT'],
  UNDER_REVIEW: ['APPROVED', 'REJECTED'],
  APPROVED: ['SCHEDULED', 'IN_PROGRESS', 'CANCELLED'],
  REJECTED: ['DRAFT'],
  SCHEDULED: ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: ['DRAFT'],
};

export class TrainingService {
  static async list(filters: any, pagination: any, sort: any) {
    const where: any = {};
    if (filters.status) where.status = filters.status;
    if (filters.typeId) where.typeId = filters.typeId;
    if (filters.themeId) where.themeId = filters.themeId;
    if (filters.orgId) where.orgId = filters.orgId;
    if (filters.stateId) where.stateId = filters.stateId;
    if (filters.districtId) where.districtId = filters.districtId;
    
    if (filters.startDate) {
      where.startDate = { ...where.startDate, gte: new Date(filters.startDate) };
    }
    if (filters.endDate) {
      where.startDate = { ...where.startDate, lte: new Date(filters.endDate) };
    }
    
    if (filters.search) {
      where.title = { contains: filters.search, mode: 'insensitive' };
    }

    const orderBy = sort ? { [sort.field]: sort.order } : { createdAt: 'desc' };

    const total = await prisma.training.count({ where });
    
    const data = await prisma.training.findMany({
      where,
      skip: pagination.skip,
      take: pagination.limit,
      orderBy,
      include: {
        organization: true,
        state: true,
        district: true,
        creator: { select: { id: true, name: true, email: true } },
        type: true,
        theme: true,
        _count: {
          select: { participants: true },
        },
      },
    });

    return createPaginatedResponse(data, total, pagination.page, pagination.limit);
  }

  static async getById(id: string) {
    const training = await prisma.training.findUnique({
      where: { id },
      include: {
        sessions: true,
        participants: { include: { participant: true } },
        attendance: true,
        preAssessments: true,
        postAssessments: true,
        impactAssessment: true,
        feedback: true,
        certificates: true,
        materials: true,
        creator: { select: { id: true, name: true, email: true } },
        reviewer: { select: { id: true, name: true, email: true } },
        organization: true,
        state: true,
        district: true,
        type: true,
        theme: true,
      },
    });

    if (!training) {
      throw notFound('Training not found');
    }

    return training;
  }

  static async create(userId: string, data: any) {
    const { lat, lng, ...trainingData } = data;

    const training = await prisma.training.create({
      data: {
        ...trainingData,
        createdBy: userId,
        status: 'DRAFT',
      },
    });

    if (lat !== undefined && lng !== undefined) {
      await prisma.$executeRawUnsafe(
        `UPDATE trainings SET location = ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography WHERE id = $3`,
        lng, lat, training.id
      );
    }

    return this.getById(training.id);
  }

  static async update(id: string, userId: string, data: any) {
    const existing = await prisma.training.findUnique({ where: { id } });
    if (!existing) throw notFound('Training not found');

    const { lat, lng, ...trainingData } = data;

    const updated = await prisma.training.update({
      where: { id },
      data: trainingData,
    });

    if (lat !== undefined && lng !== undefined) {
      await prisma.$executeRawUnsafe(
        `UPDATE trainings SET location = ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography WHERE id = $3`,
        lng, lat, id
      );
    }

    return this.getById(id);
  }

  static async submit(id: string, userId: string) {
    const training = await prisma.training.findUnique({ where: { id } });
    if (!training) throw notFound('Training not found');
    
    if (training.status !== 'DRAFT') {
      throw badRequest('Training must be in DRAFT status to submit');
    }

    const updated = await prisma.training.update({
      where: { id },
      data: {
        status: 'SUBMITTED',
        submittedAt: new Date(),
      },
    });

    await NotificationService.createForRole(
      'REVIEWER',
      'Training Submitted for Review',
      `Training "${training.title}" has been submitted for review.`,
      'INFO',
      id,
      'TRAINING'
    );

    return updated;
  }

  static async review(id: string, reviewerId: string, action: 'approve' | 'reject', comments?: string) {
    const training = await prisma.training.findUnique({ where: { id } });
    if (!training) throw notFound('Training not found');

    if (!['SUBMITTED', 'UNDER_REVIEW'].includes(training.status)) {
      throw badRequest('Training is not in a reviewable state');
    }

    const newStatus = action === 'approve' ? 'APPROVED' : 'REJECTED';

    const updated = await prisma.training.update({
      where: { id },
      data: {
        status: newStatus,
        reviewedBy: reviewerId,
        reviewedAt: new Date(),
        reviewerComments: comments,
      },
    });

    await NotificationService.create(
      training.createdBy,
      `Training ${newStatus}`,
      `Your training "${training.title}" has been ${newStatus.toLowerCase()}.`,
      'INFO',
      id,
      'TRAINING'
    );

    return updated;
  }

  static async complete(id: string, userId: string) {
    const training = await prisma.training.findUnique({ 
      where: { id },
      include: {
        preAssessments: true,
        postAssessments: true,
      }
    });

    if (!training) throw notFound('Training not found');

    if (!['APPROVED', 'SCHEDULED', 'IN_PROGRESS'].includes(training.status)) {
      throw badRequest('Training cannot be marked completed from its current state');
    }

    const updated = await prisma.training.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    });

    // Calculate Impact Assessment
    const preMap = new Map(training.preAssessments.map((p: any) => [p.participantId, p]));
    const paired = training.postAssessments.map((post: any) => {
      return { post, pre: preMap.get(post.participantId) };
    }).filter((p: any) => p.pre);

    if (paired.length > 0) {
      let knImp = 0, prImp = 0, cnImp = 0, ovImp = 0;
      paired.forEach(({pre, post}) => {
        knImp += (post.knowledgeScore - pre!.knowledgeScore);
        prImp += (post.preparednessScore - pre!.preparednessScore);
        cnImp += (post.confidenceScore - pre!.confidenceScore);
        ovImp += (post.overallScore - pre!.overallScore);
      });
      const n = paired.length;
      await prisma.impactAssessment.upsert({
        where: { trainingId: id },
        create: {
          trainingId: id,
          avgKnowledgeImprovement: knImp / n,
          avgPreparednessImprovement: prImp / n,
          avgConfidenceImprovement: cnImp / n,
          avgOverallImprovement: ovImp / n,
          impactScore: (ovImp / n),
          participantsAssessed: n,
        },
        update: {
          avgKnowledgeImprovement: knImp / n,
          avgPreparednessImprovement: prImp / n,
          avgConfidenceImprovement: cnImp / n,
          avgOverallImprovement: ovImp / n,
          impactScore: (ovImp / n),
          participantsAssessed: n,
        }
      });
    }

    return updated;
  }

  static async delete(id: string, userId: string) {
    const training = await prisma.training.findUnique({ where: { id } });
    if (!training) throw notFound('Training not found');
    if (training.status !== 'DRAFT') {
      throw badRequest('Only DRAFT trainings can be deleted');
    }

    await prisma.training.delete({ where: { id } });
  }

  static getStatusTransitions(currentStatus: string) {
    return STATUS_TRANSITIONS[currentStatus] || [];
  }
}
