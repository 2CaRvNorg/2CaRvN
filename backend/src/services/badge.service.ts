import { Badge } from '../models/Badge';
import { BadgeRule } from '../models/BadgeRule';
import { StudentAchievement } from '../models/StudentAchievement';
import { logger } from '../utils/logger';

export async function awardBadgeToStudent(studentId: string, badgeKey: string, meta?: any) {
  // find badge
  const badge = await Badge.findOne({ key: badgeKey });
  if (!badge) throw new Error('Badge not found');

  const sa = await StudentAchievement.findOneAndUpdate(
    { studentId },
    {
      $addToSet: { badges: { badgeKey, awardedAt: new Date(), meta } },
      $setOnInsert: { xp: 0 },
    },
    { upsert: true, new: true }
  );

  logger.info(`Awarded badge ${badgeKey} to student ${studentId}`);
  return sa;
}

export async function getStudentBadges(studentId: string) {
  const sa = await StudentAchievement.findOne({ studentId }).lean();
  return sa?.badges || [];
}

export async function createBadge(payload: any) {
  const b = await Badge.create(payload);
  return b;
}

export async function getAllBadges() {
  return Badge.find().lean();
}
