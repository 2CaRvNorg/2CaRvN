import { Router } from 'express';
import {
  getAllUsers,
  approveUser,
  getAllApplications,
  updateUserRole,
  updateApplicationStatus,
  getAnalytics,
  addteacher,
} from '../controllers/admin.controller';
import { requireAuth, requireRole } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { registerSchema } from '../validators/auth.validator';

const router = Router();


router.use(requireAuth);


router.get('/users', requireRole(['admin']), getAllUsers);


router.patch('/approve-user/:userId', requireRole(['admin']), approveUser);


router.get('/applications', requireRole(['admin', 'follow_up']), getAllApplications);

router.patch('/user-role/:userId', requireRole(['admin']), updateUserRole);

router.patch(
  '/application-status/:applicationId',
  requireRole(['admin', 'follow_up']),
  updateApplicationStatus
);

router.post('/add-teacher', requireRole(['admin']), validate(registerSchema), addteacher);

router.get('/analytics', requireRole(['admin', 'staff']), getAnalytics);

export default router;
