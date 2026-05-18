import { BadgeRule } from '../models/BadgeRule';
import { awardBadgeToStudent } from './badge.service';
import { logger } from '../utils/logger';

// Very small rule engine: rules stored in DB with simple conditions
// conditions example: { type: 'exam', minScore: 80 }

export async function evaluateRulesForEvent(event: any) {
  // event: { type: 'exam', studentId, score, courseId, streak }
  try {
    const rules = await BadgeRule.find({ active: true }).lean();

    for (const rule of rules) {
      const cond = rule.conditions || {};
      let matches = true;

      if (cond.type && cond.type !== event.type) matches = false;
      if (cond.minScore && (event.score ?? 0) < cond.minScore) matches = false;
      if (cond.streak && (event.streak ?? 0) < cond.streak) matches = false;

      if (matches) {
        // award badge
        try {
          await awardBadgeToStudent(event.studentId, rule.badgeKey, { event });
          logger.info(`Rule ${rule.key} matched event for student ${event.studentId}`);
        } catch (e) {
          logger.warn('Failed to award badge from rule', e);
        }
      }
    }
  } catch (e) {
    logger.error('Badge engine failed', e);
  }
}

export default evaluateRulesForEvent;
