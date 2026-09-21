import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createAssessmentSchema } from '@disaster/validation';

const router = Router();

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => 
  (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next);

router.get('/training/:trainingId/pre', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const assessments = await prisma.assessment.findMany({
    where: { trainingId: req.params.trainingId, type: 'PRE' }
  });
  res.json(assessments);
}));

router.post('/training/:trainingId/pre', authenticate, validate(createAssessmentSchema), asyncHandler(async (req: Request, res: Response) => {
  const assessment = await prisma.assessment.create({
    data: {
      ...req.body,
      trainingId: req.params.trainingId,
      type: 'PRE'
    }
  });
  res.status(201).json(assessment);
}));

router.get('/training/:trainingId/post', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const assessments = await prisma.assessment.findMany({
    where: { trainingId: req.params.trainingId, type: 'POST' }
  });
  res.json(assessments);
}));

router.post('/training/:trainingId/post', authenticate, validate(createAssessmentSchema), asyncHandler(async (req: Request, res: Response) => {
  const assessment = await prisma.assessment.create({
    data: {
      ...req.body,
      trainingId: req.params.trainingId,
      type: 'POST'
    }
  });
  res.status(201).json(assessment);
}));

router.get('/training/:trainingId/impact', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const impact = await prisma.impactAssessment.findUnique({
    where: { trainingId: req.params.trainingId }
  });
  if (!impact) {
    res.status(404).json({ error: 'Impact assessment not found' });
    return;
  }
  res.json(impact);
}));

router.post('/training/:trainingId/impact/calculate', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const trainingId = req.params.trainingId;
  const preAssessments = await prisma.assessment.findMany({ where: { trainingId, type: 'PRE' } });
  const postAssessments = await prisma.assessment.findMany({ where: { trainingId, type: 'POST' } });

  // Basic calculation logic placeholder
  const avgPre = preAssessments.reduce((acc, curr) => acc + (curr.score || 0), 0) / (preAssessments.length || 1);
  const avgPost = postAssessments.reduce((acc, curr) => acc + (curr.score || 0), 0) / (postAssessments.length || 1);

  const impact = await prisma.impactAssessment.upsert({
    where: { trainingId },
    update: { preScoreAverage: avgPre, postScoreAverage: avgPost, improvement: avgPost - avgPre },
    create: { trainingId, preScoreAverage: avgPre, postScoreAverage: avgPost, improvement: avgPost - avgPre }
  });

  res.json(impact);
}));

export default router;
