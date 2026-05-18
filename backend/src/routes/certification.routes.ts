import { Router } from 'express';
import { requireAuth, requireRole } from '../middlewares/auth';
import { createCertificate, verifyCertificate } from '../controllers/certification.controller';

const router = Router();

// issue/assign certificate (admin/teacher)
router.post('/', requireAuth, requireRole(['admin','teacher']), createCertificate);

// public verification route
router.get('/verify/:certificateId', verifyCertificate);

export default router;
