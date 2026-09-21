import { Router, Request, Response, NextFunction } from 'express';
import * as trainingService from '../services/training.service';
import { authenticate } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';
import { validate } from '../middleware/validate';
import { auditAction } from '../middleware/audit';
import { createTrainingSchema, updateTrainingSchema } from '@disaster/validation';

const router = Router();

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => 
  (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next);

router.get('/', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const result = await trainingService.list(req.query);
  res.json(result);
}));

router.get('/:id', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const result = await trainingService.getById(req.params.id);
  res.json(result);
}));

router.post('/', authenticate, requirePermission('manage_trainings'), validate(createTrainingSchema), auditAction('CREATE', 'trainings'), asyncHandler(async (req: Request, res: Response) => {
  const result = await trainingService.create(req.body);
  res.status(201).json(result);
}));

router.put('/:id', authenticate, requirePermission('manage_trainings'), validate(updateTrainingSchema), auditAction('UPDATE', 'trainings'), asyncHandler(async (req: Request, res: Response) => {
  const result = await trainingService.update(req.params.id, req.body);
  res.json(result);
}));

router.post('/:id/submit', authenticate, auditAction('UPDATE', 'trainings'), asyncHandler(async (req: Request, res: Response) => {
  const result = await trainingService.submit(req.params.id);
  res.json(result);
}));

router.post('/:id/review', authenticate, requirePermission('approve_training'), auditAction('UPDATE', 'trainings'), asyncHandler(async (req: Request, res: Response) => {
  const { action, comments } = req.body;
  const result = await trainingService.review(req.params.id, action, comments);
  res.json(result);
}));

router.post('/:id/complete', authenticate, auditAction('UPDATE', 'trainings'), asyncHandler(async (req: Request, res: Response) => {
  const result = await trainingService.complete(req.params.id);
  res.json(result);
}));

router.delete('/:id', authenticate, auditAction('DELETE', 'trainings'), asyncHandler(async (req: Request, res: Response) => {
  await trainingService.delete(req.params.id);
  res.status(204).send();
}));

export default router;
