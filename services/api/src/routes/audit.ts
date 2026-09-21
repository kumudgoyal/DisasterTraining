import { Router, Request, Response, NextFunction } from 'express';
import * as auditService from '../services/audit.service';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';

const router = Router();

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => 
  (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next);

router.use(authenticate);
router.use(requireRole('SUPER_ADMIN'));

router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const audits = await auditService.list();
  res.json(audits);
}));

router.get('/modules', asyncHandler(async (req: Request, res: Response) => {
  const modules = await auditService.getModules();
  res.json(modules);
}));

export default router;
