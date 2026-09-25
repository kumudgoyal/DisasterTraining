import { Router, Request, Response, NextFunction } from 'express';
import { NotificationService } from '../services/notification.service';
import { authenticate } from '../middleware/auth';
import { parsePagination } from '../utils/pagination';

const router = Router();

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => 
  (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next);

router.use(authenticate);

router.get('/', asyncHandler(async (req: Request, res: Response) => {
  // @ts-ignore
  const notifications = await NotificationService.getUserNotifications(req.user.userId, req.query, parsePagination(req.query));
  res.json(notifications);
}));

router.get('/unread-count', asyncHandler(async (req: Request, res: Response) => {
  // @ts-ignore
  const count = await NotificationService.getUnreadCount(req.user.userId);
  res.json({ count });
}));

router.put('/:id/read', asyncHandler(async (req: Request, res: Response) => {
  const result = await NotificationService.markAsRead(req.params.id);
  res.json(result);
}));

router.put('/read-all', asyncHandler(async (req: Request, res: Response) => {
  // @ts-ignore
  await NotificationService.markAllAsRead(req.user.userId);
  res.json({ success: true });
}));

router.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
  await NotificationService.delete(req.params.id);
  res.status(204).send();
}));

export default router;
