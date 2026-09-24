import { Router, Request, Response, NextFunction } from 'express';
import { IntegrationService } from '../services/integration.service';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { auditAction } from '../middleware/audit';

const router = Router();

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => 
  (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next);

router.get('/sources', authenticate, requireRole('SUPER_ADMIN', 'NDMA_ADMIN'), asyncHandler(async (req: Request, res: Response) => {
  const sources = await IntegrationService.listSources();
  res.json(sources);
}));

router.post('/sources', authenticate, requireRole('SUPER_ADMIN'), auditAction('CREATE', 'integrations'), asyncHandler(async (req: Request, res: Response) => {
  // @ts-ignore
  const source = await IntegrationService.createSource(req.body);
  res.status(201).json(source);
}));

router.put('/sources/:id', authenticate, requireRole('SUPER_ADMIN'), asyncHandler(async (req: Request, res: Response) => {
  // @ts-ignore
  const source = await IntegrationService.updateSource(req.params.id, req.body);
  res.json(source);
}));

router.post('/sources/:id/sync', authenticate, requireRole('SUPER_ADMIN', 'NDMA_ADMIN'), asyncHandler(async (req: Request, res: Response) => {
  // @ts-ignore
  const result = await IntegrationService.triggerSync(req.params.id);
  res.json(result);
}));

router.get('/sources/:id/logs', authenticate, asyncHandler(async (req: Request, res: Response) => {
  // @ts-ignore
  const logs = await IntegrationService.getSyncLogs(req.params.id);
  res.json(logs);
}));

router.post('/api-keys', authenticate, requireRole('SUPER_ADMIN'), asyncHandler(async (req: Request, res: Response) => {
  // @ts-ignore
  const key = await IntegrationService.createApiKey(req.body);
  res.status(201).json(key);
}));

router.get('/api-keys', authenticate, requireRole('SUPER_ADMIN', 'NDMA_ADMIN'), asyncHandler(async (req: Request, res: Response) => {
  // @ts-ignore
  const keys = await IntegrationService.listApiKeys();
  res.json(keys);
}));

router.delete('/api-keys/:id', authenticate, requireRole('SUPER_ADMIN'), asyncHandler(async (req: Request, res: Response) => {
  // @ts-ignore
  await IntegrationService.revokeApiKey(req.params.id);
  res.status(204).send();
}));

export default router;
