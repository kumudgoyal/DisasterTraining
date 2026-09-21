import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { authenticate } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';
import { validate } from '../middleware/validate';
import { auditAction } from '../middleware/audit';
import { parsePagination, createPaginatedResponse } from '../utils/pagination';
import { createParticipantSchema } from '@disaster/validation';

const router = Router();

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => 
  (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next);

router.get('/training/:trainingId', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const { skip, take, page, limit } = parsePagination(req.query);
  const trainingId = req.params.trainingId;

  const [participants, total] = await Promise.all([
    prisma.trainingParticipant.findMany({
      where: { trainingId },
      skip,
      take,
      include: { participant: true }
    }),
    prisma.trainingParticipant.count({ where: { trainingId } })
  ]);

  res.json(createPaginatedResponse(participants.map(tp => tp.participant), total, page, limit));
}));

router.get('/:id', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const participant = await prisma.participant.findUnique({
    where: { id: req.params.id }
  });
  if (!participant) {
    res.status(404).json({ error: 'Participant not found' });
    return;
  }
  res.json(participant);
}));

router.post('/training/:trainingId', authenticate, requirePermission('manage_participants'), validate(createParticipantSchema), auditAction('CREATE', 'participants'), asyncHandler(async (req: Request, res: Response) => {
  const trainingId = req.params.trainingId;
  const participant = await prisma.$transaction(async (tx) => {
    let part = await tx.participant.findUnique({
      where: { email: req.body.email }
    });
    if (!part) {
      part = await tx.participant.create({
        data: req.body
      });
    }
    await tx.trainingParticipant.create({
      data: {
        trainingId,
        participantId: part.id
      }
    });
    return part;
  });
  res.status(201).json(participant);
}));

router.put('/:id', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const participant = await prisma.participant.update({
    where: { id: req.params.id },
    data: req.body
  });
  res.json(participant);
}));

router.delete('/:id', authenticate, asyncHandler(async (req: Request, res: Response) => {
  await prisma.participant.delete({
    where: { id: req.params.id }
  });
  res.status(204).send();
}));

export default router;
