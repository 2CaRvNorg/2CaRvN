import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { User } from '../models/User';
import { successResponse, errorResponse } from '../utils/responseFormat';
import { logger } from '../utils/logger';

// ──────────────────────────────────────────────────────
// GET /user/profile
// Requires: requireAuth proxy
// ──────────────────────────────────────────────────────
export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    // ✅ FIX: Validate ObjectId before query
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json(errorResponse('Invalid user ID'));
      return;
    }

    const user = await User.findById(userId)
      .select('-password -__v -isDeleted -deletedAt')
      .lean(); // Returns plain JS object for speed

    if (!user || user.isDeleted) {
      res.status(404).json(errorResponse('User not found or deactivated'));
      return;
    }

    res.status(200).json(successResponse(user, 'Profile fetched successfully'));
  } catch (error) {
    logger.error('Error fetching profile:', error);
    next(error);
  }
};

// ──────────────────────────────────────────────────────
// PATCH /user/update
// Requires: requireAuth proxy + Zod validate(updateProfileSchema)
// Users can ONLY update their own name — role/email/accessLevel are immutable here
// ──────────────────────────────────────────────────────
export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    // ✅ FIX: Validate ObjectId before query
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json(errorResponse('Invalid user ID'));
      return;
    }

    // Only allowed fields (Zod schema already strips everything else)
    const { name } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          ...(name && { name }),
          updatedBy: userId,
        },
      },
      {
        new: true,           // Return updated document
        runValidators: true, // Run mongoose schema validators
        select: '-password -__v -isDeleted -deletedAt',
      }
    );

    if (!user || user.isDeleted) {
      res.status(404).json(errorResponse('User not found or deactivated'));
      return;
    }

    res.status(200).json(successResponse(user, 'Profile updated successfully'));
  } catch (error) {
    logger.error('Error updating profile:', error);
    next(error);
  }
};

// ──────────────────────────────────────────────────────
// GET /user/stats
// Requires: requireAuth
// ──────────────────────────────────────────────────────
export const getUserStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    // In a real app, you would query ExamSubmissions, Logins, etc.
    // For now, we'll return structured live data based on the user's role and status.
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json(errorResponse('User not found'));
      return;
    }

    // Simulated but dynamic data
    const stats = {
      weeklyActivity: [45, 70, 55, 90, 65, 80, 95], // Could be login counts
      skillDistribution: [
        { label: 'Coding', value: 85, color: 'bg-blue-500' },
        { label: 'Design', value: 62, color: 'bg-pink-500' },
        { label: 'Logic', value: 94, color: 'bg-[#D4AF37]' }
      ],
      insights: {
        message: user.role === 'premium' 
          ? "Your score in **Logic Games** increased by 15% this week. Focus on **Data Structures** next to maintain your rank!"
          : "Apply for a cohort to unlock personalized skill tracking and performance insights!",
        trendingUp: true,
        rank: user.role === 'premium' ? "#42" : "Unranked"
      },
      points: 2340,
      streak: "12d"
    };

    res.status(200).json(successResponse(stats, 'User stats fetched successfully'));
  } catch (error) {
    logger.error('Error fetching user stats:', error);
    next(error);
  }
};

// ──────────────────────────────────────────────────────
// GET /teacher/students
// Requires: requireAuth + requireRole(['teacher', 'staff', 'admin'])
// ──────────────────────────────────────────────────────
export const getStudents = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { search, role } = req.query;

    const query: any = { isDeleted: { $ne: true } };
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const students = await User.find(query)
      .select('name email role accessLevel enrolledTrack createdAt')
      .sort({ createdAt: -1 })
      .limit(50); // Limit for performance

    res.status(200).json(successResponse(students, 'Students fetched successfully'));
  } catch (error) {
    logger.error('Error fetching students:', error);
    next(error);
  }
};

// ──────────────────────────────────────────────────────
// GET /teacher/stats
// Requires: requireAuth + requireRole(['teacher', 'staff', 'admin'])
// ──────────────────────────────────────────────────────
export const getTeacherStats = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const baseQuery: any = { isDeleted: { $ne: true } };

    // "Students" for dashboard purposes includes student + premium roles
    const totalStudents = await User.countDocuments({
      ...baseQuery,
      role: { $in: ['student', 'premium'] },
    });

    res.status(200).json(successResponse({ totalStudents }, 'Teacher stats fetched successfully'));
  } catch (error) {
    logger.error('Error fetching teacher stats:', error);
    next(error);
  }
};
