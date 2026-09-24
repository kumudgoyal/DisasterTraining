import { Router, Request, Response, NextFunction } from 'express';
import { ReportService } from '../services/report.service';
import { authenticate } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';
import { validate } from '../middleware/validate';
import { auditAction } from '../middleware/audit';
import { generateReportSchema } from '@disaster/validation';

const router = Router();

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => 
  (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next);

router.get('/', authenticate, requirePermission('view_reports'), asyncHandler(async (req: Request, res: Response) => {
  const reports = await ReportService.list();
  res.json(reports);
}));

router.post('/generate', authenticate, requirePermission('generate_reports'), validate(generateReportSchema), auditAction('CREATE', 'reports'), asyncHandler(async (req: Request, res: Response) => {
  const report = await ReportService.generate(req.body);
  res.status(201).json(report);
}));

router.get('/:id', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const report = await ReportService.getById(req.params.id);
  res.json(report);
}));

router.get('/:id/download', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const filePath = await ReportService.getFilePath(req.params.id);
  res.download(filePath);
}));

router.delete('/:id', authenticate, auditAction('DELETE', 'reports'), asyncHandler(async (req: Request, res: Response) => {
  await ReportService.delete(req.params.id);
  res.status(204).send();
}));

export default router;
