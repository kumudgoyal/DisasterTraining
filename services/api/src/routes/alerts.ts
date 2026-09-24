import { Router, Request, Response, NextFunction } from 'express';
import { AlertService } from '../services/alert.service';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { auditAction } from '../middleware/audit';

const router = Router();

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => 
  (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next);

router.get('/', authenticate, requireRole('SUPER_ADMIN', 'NDMA_ADMIN', 'REVIEWER'), asyncHandler(async (req: Request, res: Response) => {
  const alerts = await AlertService.list();
  res.json(alerts);
}));

router.get('/summary', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const summary = await AlertService.getSummary();
  res.json(summary);
}));

router.post('/:id/resolve', authenticate, requireRole('SUPER_ADMIN', 'NDMA_ADMIN'), auditAction('UPDATE', 'alerts'), asyncHandler(async (req: Request, res: Response) => {
  const alert = await AlertService.resolve(req.params.id);
  res.json(alert);
}));

export default router;
