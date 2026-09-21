import { Router, Request, Response, NextFunction } from 'express';
import * as gisService from '../services/gis.service';
import { authenticate } from '../middleware/auth';

const router = Router();

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => 
  (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next);

router.use(authenticate);

router.get('/trainings', asyncHandler(async (req: Request, res: Response) => {
  const markers = await gisService.getTrainingMarkers(req.query);
  res.json(markers);
}));

router.get('/heatmap', asyncHandler(async (req: Request, res: Response) => {
  const data = await gisService.getHeatmapData(req.query);
  res.json(data);
}));

router.get('/coverage', asyncHandler(async (req: Request, res: Response) => {
  const level = req.query.level as string;
  const coverage = await gisService.getCoverage(level, req.query);
  res.json(coverage);
}));

router.get('/nearby', asyncHandler(async (req: Request, res: Response) => {
  const lat = parseFloat(req.query.lat as string);
  const lng = parseFloat(req.query.lng as string);
  const radius = parseFloat(req.query.radius as string);
  const nearby = await gisService.getNearbyTrainings(lat, lng, radius, req.query);
  res.json(nearby);
}));

export default router;
