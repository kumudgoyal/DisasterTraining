import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';

const router = Router();

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => 
  (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next);

router.get('/states', asyncHandler(async (req: Request, res: Response) => {
  const states = await prisma.state.findMany({
    orderBy: { name: 'asc' }
  });
  res.json(states);
}));

router.get('/states/:stateId/districts', asyncHandler(async (req: Request, res: Response) => {
  const districts = await prisma.district.findMany({
    where: { stateId: req.params.stateId },
    orderBy: { name: 'asc' }
  });
  res.json(districts);
}));

router.get('/training-types', asyncHandler(async (req: Request, res: Response) => {
  const types = await prisma.trainingType.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' }
  });
  res.json(types);
}));

router.get('/training-themes', asyncHandler(async (req: Request, res: Response) => {
  const themes = await prisma.trainingTheme.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' }
  });
  res.json(themes);
}));

export default router;
