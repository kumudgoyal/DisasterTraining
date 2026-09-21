import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { validate } from '../middleware/validate';
import { auditAction } from '../middleware/audit';
import { parsePagination, createPaginatedResponse } from '../utils/pagination';
import { createOrganizationSchema, updateOrganizationSchema } from '@disaster/validation';

const router = Router();

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => 
  (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next);

router.get('/', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const { type, state, search, isActive } = req.query;
  const { skip, take, page, limit } = parsePagination(req.query);

  const where: any = {};
  if (type) where.type = String(type);
  if (state) where.stateId = String(state);
  if (isActive !== undefined) where.isActive = isActive === 'true';
  if (search) {
    where.name = { contains: String(search), mode: 'insensitive' };
  }

  const [organizations, total] = await Promise.all([
    prisma.organization.findMany({
      where,
      skip,
      take
    }),
    prisma.organization.count({ where })
  ]);

  res.json(createPaginatedResponse(organizations, total, page, limit));
}));

router.get('/:id', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const organization = await prisma.organization.findUnique({
    where: { id: req.params.id },
    include: {
      _count: {
        select: { users: true, trainings: true }
      }
    }
  });
  if (!organization) {
    res.status(404).json({ error: 'Organization not found' });
    return;
  }
  res.json(organization);
}));

router.post('/', authenticate, requireRole('SUPER_ADMIN', 'NDMA_ADMIN'), validate(createOrganizationSchema), auditAction('CREATE', 'organizations'), asyncHandler(async (req: Request, res: Response) => {
  const organization = await prisma.organization.create({
    data: req.body
  });
  res.status(201).json(organization);
}));

router.put('/:id', authenticate, requireRole('SUPER_ADMIN', 'NDMA_ADMIN'), validate(updateOrganizationSchema), auditAction('UPDATE', 'organizations'), asyncHandler(async (req: Request, res: Response) => {
  const organization = await prisma.organization.update({
    where: { id: req.params.id },
    data: req.body
  });
  res.json(organization);
}));

router.delete('/:id', authenticate, requireRole('SUPER_ADMIN', 'NDMA_ADMIN'), auditAction('DELETE', 'organizations'), asyncHandler(async (req: Request, res: Response) => {
  await prisma.organization.update({
    where: { id: req.params.id },
    data: { isActive: false }
  });
  res.status(204).send();
}));

export default router;
