import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createSessionSchema } from '@disaster/validation';

const router = Router();

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => 
  (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next);

router.get('/training/:trainingId', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const sessions = await prisma.session.findMany({
    where: { trainingId: req.params.trainingId }
  });
  res.json(sessions);
}));

router.post('/training/:trainingId', authenticate, validate(createSessionSchema), asyncHandler(async (req: Request, res: Response) => {
  const session = await prisma.session.create({
    data: {
      ...req.body,
      trainingId: req.params.trainingId
    }
  });
  res.status(201).json(session);
}));

router.put('/:id', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const session = await prisma.session.update({
    where: { id: req.params.id },
    data: req.body
  });
  res.json(session);
}));

router.delete('/:id', authenticate, asyncHandler(async (req: Request, res: Response) => {
  await prisma.session.delete({
    where: { id: req.params.id }
  });
  res.status(204).send();
}));

export default router;
