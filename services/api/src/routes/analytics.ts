import { Router, Request, Response, NextFunction } from 'express';
import * as analyticsService from '../services/analytics.service';
import { authenticate } from '../middleware/auth';

const router = Router();

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => 
  (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next);

router.use(authenticate);

router.get('/dashboard', asyncHandler(async (req: Request, res: Response) => {
  const stats = await analyticsService.getDashboardStats(req.query);
  res.json(stats);
}));

router.get('/trends', asyncHandler(async (req: Request, res: Response) => {
  const trends = await analyticsService.getTrainingTrends(req.query);
  res.json(trends);
}));

router.get('/categories', asyncHandler(async (req: Request, res: Response) => {
  const categories = await analyticsService.getCategoryDistribution(req.query);
  res.json(categories);
}));

router.get('/coverage/states', asyncHandler(async (req: Request, res: Response) => {
  const coverage = await analyticsService.getStateCoverage(req.query);
  res.json(coverage);
}));

router.get('/coverage/districts', asyncHandler(async (req: Request, res: Response) => {
  const coverage = await analyticsService.getDistrictCoverage(req.query);
  res.json(coverage);
}));

router.get('/impact', asyncHandler(async (req: Request, res: Response) => {
  const impact = await analyticsService.getImpactMetrics(req.query);
  res.json(impact);
}));

export default router;
