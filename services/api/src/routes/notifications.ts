import { Router, Request, Response, NextFunction } from 'express';
import * as notificationService from '../services/notification.service';
import { authenticate } from '../middleware/auth';

const router = Router();

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => 
  (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next);

router.use(authenticate);

router.get('/', asyncHandler(async (req: Request, res: Response) => {
  // @ts-ignore
  const notifications = await notificationService.getUserNotifications(req.user.userId, req.query);
  res.json(notifications);
}));

router.get('/unread-count', asyncHandler(async (req: Request, res: Response) => {
  // @ts-ignore
  const count = await notificationService.getUnreadCount(req.user.userId);
  res.json({ count });
}));

router.put('/:id/read', asyncHandler(async (req: Request, res: Response) => {
  const result = await notificationService.markAsRead(req.params.id);
  res.json(result);
}));

router.put('/read-all', asyncHandler(async (req: Request, res: Response) => {
  // @ts-ignore
  await notificationService.markAllAsRead(req.user.userId);
  res.json({ success: true });
}));

router.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
  await notificationService.delete(req.params.id);
  res.status(204).send();
}));

export default router;
