import { Router } from 'express';
import { requireAuth, requireRole } from '../middlewares/auth';
import { postBadge, awardBadge, studentBadges, listBadges, evaluateEvent, createBadgeRule, listBadgeRules, updateBadgeRule, deleteBadgeRule } from '../controllers/badge.controller';

const router = Router();

router.use(requireAuth);

// Only admin can create new badge definitions
router.post('/', requireRole(['admin']), postBadge);
router.get('/', listBadges);
router.get('/:studentId', studentBadges);
// Badges should be awarded automatically via rules; keep manual awarding admin-only (exceptions)
router.post('/:studentId/award', requireRole(['admin']), awardBadge);
// Allow admin to trigger evaluation (useful for testing/manual triggers)
router.post('/evaluate', requireRole(['admin']), evaluateEvent);

// Badge Rules endpoints (admin-only)
router.post('/rules', requireRole(['admin']), createBadgeRule);
router.get('/rules', requireRole(['admin']), listBadgeRules);
router.patch('/rules/:ruleId', requireRole(['admin']), updateBadgeRule);
router.delete('/rules/:ruleId', requireRole(['admin']), deleteBadgeRule);

export default router;
