import { Router } from 'express';
import { requireAuth, requireRole } from '../middlewares/auth';
import { getStudents, getTeacherStats } from '../controllers/user.controller';

const router = Router();

// Apply auth middleware to all routes
router.use(requireAuth);

// Get students for teachers/staff to award badges
router.get('/students', requireRole(['teacher', 'staff', 'admin']), getStudents);

// Dashboard stats for teachers/staff
router.get('/stats', requireRole(['teacher', 'staff', 'admin']), getTeacherStats);

export default router;