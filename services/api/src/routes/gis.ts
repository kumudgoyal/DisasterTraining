import { Router, Request, Response, NextFunction } from 'express';
import { GisService } from '../services/gis.service';
import { authenticate } from '../middleware/auth';

const router = Router();

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => 
  (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next);

router.use(authenticate);

router.get('/trainings', asyncHandler(async (req: Request, res: Response) => {
  const markers = await GisService.getTrainingMarkers(req.query);
  res.json(markers);
}));

router.get('/heatmap', asyncHandler(async (req: Request, res: Response) => {
  const data = await GisService.getHeatmapData(req.query);
  res.json(data);
}));

router.get('/coverage', asyncHandler(async (req: Request, res: Response) => {
  const level = req.query.level as string;
  const coverage = await GisService.getCoverage(level, req.query);
  res.json(coverage);
}));

router.get('/nearby', asyncHandler(async (req: Request, res: Response) => {
  const lat = parseFloat(req.query.lat as string);
  const lng = parseFloat(req.query.lng as string);
  const radius = parseFloat(req.query.radius as string);
  const nearby = await GisService.getNearbyTrainings(lat, lng, radius, req.query);
  res.json(nearby);
}));

export default router;
