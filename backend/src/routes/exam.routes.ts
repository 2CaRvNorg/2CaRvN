import { Router } from 'express';
import { createExam, getExams, submitExam, getExamById, getExamSubmissionsByExamId } from '../controllers/exam.controller';
import { requireAuth, requireRole, requireAccessLevel } from '../middlewares/auth';
import { examLimiter } from '../middlewares/rateLimiter';
import { validate } from '../middlewares/validate';
import { createExamSchema, submitExamSchema } from '../validators/exam.validator';

const router = Router();

// GET /api/v1/exams/debug-exams - Public for debugging
router.get('/debug-exams', getExams);

// All other exam routes require a valid JWT
router.use(requireAuth);

/**
 * GET /api/v1/exams/:examId
 * Fetch single exam details (questions without correct answers)
 */
router.get('/:examId', requireAccessLevel(['subscribed']), getExamById);

/**
 * GET /api/v1/exams/:examId/submissions
 * teacher and admins can view all submissions for an exam
 */
router.get('/:examId/submissions', requireRole(['admin', 'teacher', 'staff']), getExamSubmissionsByExamId);

/**
 * POST /api/v1/exams
 * teacher and admins can create new exams
 */
router.post(
  '/',
  requireRole(['admin', 'teacher', 'staff']),
  validate(createExamSchema),
  createExam
);

/**
 * POST /api/v1/exams/:examId/submit
 * Subscribed users only — submit exam answers
 * Rate limited: max 5 submissions per hour per IP
 * Server-side scoring — client cannot influence result
 */
router.post(
  '/:examId/submit',
  requireAccessLevel(['subscribed']),
  examLimiter,
  validate(submitExamSchema),
  submitExam
);

export default router;
