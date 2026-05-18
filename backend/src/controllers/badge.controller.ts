import { Request, Response, NextFunction } from 'express';
import { awardBadgeToStudent, getStudentBadges, createBadge, getAllBadges } from '../services/badge.service';
import { successResponse } from '../utils/responseFormat';
import { evaluateRulesForEvent } from '../services/badgeEngine';
import { BadgeRule } from '../models/BadgeRule';

export const postBadge = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.body;
    const badge = await createBadge(payload);
    res.status(201).json(successResponse(badge, 'Badge created'));
  } catch (e) {
    next(e);
  }
};

export const awardBadge = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rawStudentId = req.params.studentId;
    const studentId = Array.isArray(rawStudentId) ? rawStudentId[0] : String(rawStudentId || '');
    const { badgeKey, meta } = req.body;
    const sa = await awardBadgeToStudent(studentId, badgeKey, meta);
    res.status(200).json(successResponse(sa, 'Badge awarded'));
  } catch (e) {
    next(e);
  }
};

export const studentBadges = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rawStudentId = req.params.studentId;
    const studentId = Array.isArray(rawStudentId) ? rawStudentId[0] : String(rawStudentId || '');
    const badges = await getStudentBadges(studentId);
    res.status(200).json(successResponse(badges, 'Student badges'));
  } catch (e) {
    next(e);
  }
};

export const listBadges = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const badges = await getAllBadges();
    res.status(200).json(successResponse(badges, 'Badges list'));
  } catch (e) {
    next(e);
  }
};
export const evaluateEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = req.body;
    await evaluateRulesForEvent(event);
    res.status(200).json(successResponse(null, 'Event evaluated'));
  } catch (e) {
    next(e);
  }
};

export const createBadgeRule = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { key, badgeKey, description, conditions, active } = req.body;
    const rule = await BadgeRule.create({
      key,
      badgeKey,
      description,
      conditions,
      active: active !== false, // Default to true
    });
    res.status(201).json(successResponse(rule, 'Badge rule created'));
  } catch (e) {
    next(e);
  }
};

export const listBadgeRules = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const badgeKey = req.query.badgeKey as string | undefined;
    const query: any = badgeKey ? { badgeKey } : {};
    const rules = await BadgeRule.find(query).lean();
    res.status(200).json(successResponse(rules, 'Badge rules list'));
  } catch (e) {
    next(e);
  }
};

export const updateBadgeRule = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ruleId } = req.params;
    const updates = req.body;
    const rule = await BadgeRule.findByIdAndUpdate(ruleId, updates, { new: true });
    res.status(200).json(successResponse(rule, 'Badge rule updated'));
  } catch (e) {
    next(e);
  }
};

export const deleteBadgeRule = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ruleId } = req.params;
    await BadgeRule.findByIdAndDelete(ruleId);
    res.status(200).json(successResponse(null, 'Badge rule deleted'));
  } catch (e) {
    next(e);
  }
};
