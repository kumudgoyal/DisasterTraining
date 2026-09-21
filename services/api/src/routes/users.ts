import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { validate } from '../middleware/validate';
import { auditAction } from '../middleware/audit';
import { parsePagination, createPaginatedResponse } from '../utils/pagination';
import { createUserSchema, updateUserSchema } from '@disaster/validation';

const router = Router();

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => 
  (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next);

router.use(authenticate);
router.use(requireRole('SUPER_ADMIN', 'NDMA_ADMIN'));

router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const { role, orgId, isActive, search } = req.query;
  const { skip, take, page, limit } = parsePagination(req.query);

  const where: any = {};
  if (role) where.role = String(role);
  if (orgId) where.organizationId = String(orgId);
  if (isActive !== undefined) where.isActive = isActive === 'true';
  if (search) {
    where.OR = [
      { name: { contains: String(search), mode: 'insensitive' } },
      { email: { contains: String(search), mode: 'insensitive' } }
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take,
      include: { organization: true }
    }),
    prisma.user.count({ where })
  ]);

  res.json(createPaginatedResponse(users, total, page, limit));
}));

router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.params.id },
    include: { organization: true }
  });
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  res.json(user);
}));

router.post('/', validate(createUserSchema), auditAction('CREATE', 'users'), asyncHandler(async (req: Request, res: Response) => {
  const user = await prisma.user.create({
    data: req.body
  });
  res.status(201).json(user);
}));

router.put('/:id', validate(updateUserSchema), auditAction('UPDATE', 'users'), asyncHandler(async (req: Request, res: Response) => {
  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: req.body
  });
  res.json(user);
}));

router.delete('/:id', auditAction('DELETE', 'users'), asyncHandler(async (req: Request, res: Response) => {
  await prisma.user.update({
    where: { id: req.params.id },
    data: { isActive: false }
  });
  res.status(204).send();
}));

export default router;
