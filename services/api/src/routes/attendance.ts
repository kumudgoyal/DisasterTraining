import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { authenticate } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';
import { validate } from '../middleware/validate';
import { recordAttendanceSchema } from '@disaster/validation';

const router = Router();

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => 
  (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next);

router.get('/training/:trainingId', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const { date } = req.query;
  const where: any = { trainingId: req.params.trainingId };
  if (date) {
    where.date = new Date(String(date));
  }
  
  const attendance = await prisma.attendance.findMany({
    where,
    include: { participant: true }
  });
  res.json(attendance);
}));

router.post('/training/:trainingId', authenticate, requirePermission('manage_attendance'), validate(recordAttendanceSchema), asyncHandler(async (req: Request, res: Response) => {
  const { date, records } = req.body;
  const trainingId = req.params.trainingId;
  const parsedDate = new Date(date);

  const results = await prisma.$transaction(
    records.map((r: any) => 
      prisma.attendance.upsert({
        where: {
          trainingId_participantId_date: {
            trainingId,
            participantId: r.participantId,
            date: parsedDate
          }
        },
        update: {
          status: r.status,
          remarks: r.remarks
        },
        create: {
          trainingId,
          participantId: r.participantId,
          date: parsedDate,
          status: r.status,
          remarks: r.remarks
        }
      })
    )
  );

  res.status(200).json(results);
}));

router.get('/training/:trainingId/summary', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const trainingId = req.params.trainingId;
  const summary = await prisma.attendance.groupBy({
    by: ['date', 'status'],
    where: { trainingId },
    _count: {
      status: true
    }
  });
  res.json(summary);
}));

export default router;
