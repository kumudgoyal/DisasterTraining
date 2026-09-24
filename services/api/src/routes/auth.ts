import { Router, Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { validate } from '../middleware/validate';
import { auditAction } from '../middleware/audit';
import { loginSchema, registerSchema, changePasswordSchema } from '@disaster/validation';

const router = Router();

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => 
  (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next);

router.post('/login', validate(loginSchema), asyncHandler(async (req: Request, res: Response) => {
  const result = await AuthService.login(req.body.email, req.body.password);
  res.json(result);
}));

router.post('/register', authenticate, requireRole('SUPER_ADMIN', 'NDMA_ADMIN'), validate(registerSchema), auditAction('CREATE', 'users'), asyncHandler(async (req: Request, res: Response) => {
  const result = await AuthService.register(req.body);
  res.status(201).json(result);
}));

router.post('/refresh', asyncHandler(async (req: Request, res: Response) => {
  const result = await AuthService.refreshToken(req.body.refreshToken);
  res.json(result);
}));

router.get('/me', authenticate, asyncHandler(async (req: Request, res: Response) => {
  // @ts-ignore
  const result = await AuthService.getProfile(req.user.userId);
  res.json(result);
}));

router.put('/me', authenticate, asyncHandler(async (req: Request, res: Response) => {
  // @ts-ignore
  const result = await AuthService.updateProfile(req.user.userId, req.body);
  res.json(result);
}));

router.post('/change-password', authenticate, validate(changePasswordSchema), asyncHandler(async (req: Request, res: Response) => {
  // @ts-ignore
  await AuthService.changePassword(req.user.userId, req.body.currentPassword, req.body.newPassword);
  res.json({ success: true, message: 'Password changed successfully' });
}));

router.post('/logout', authenticate, asyncHandler(async (req: Request, res: Response) => {
  res.json({ success: true, message: 'Logged out successfully' });
}));

export default router;
