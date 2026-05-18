import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import applicationRoutes from './application.routes';
import adminRoutes from './admin.routes';
import contentRoutes from './content.routes';
import examRoutes from './exam.routes';
import badgesRoutes from './badges.routes';
import certificationRoutes from './certification.routes';
import teacherRoutes from './teacher.routes';
import gamesRoutes from './games.routes';

const router = Router();

// Lightweight debug middleware for content routes to log origin and cookies
const contentDebug = (req: any, res: any, next: any) => {
	try {
		console.debug('[DEBUG][CONTENT ROUTE] Method:', req.method, 'Path:', req.path, 'Origin:', req.headers.origin, 'Cookies:', Object.keys(req.cookies || {}).join(', '));
	} catch (e) {
		// ignore
	}
	next();
};

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/user/games', gamesRoutes);
router.use('/application', applicationRoutes);
router.use('/admin', adminRoutes);
router.use('/content', contentDebug, contentRoutes);
router.use('/exams', examRoutes);
router.use('/badges', badgesRoutes);
router.use('/certifications', certificationRoutes);
router.use('/teacher', teacherRoutes);

export default router;
