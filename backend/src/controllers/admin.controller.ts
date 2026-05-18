import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { Application } from '../models/Application';
import { successResponse, errorResponse } from '../utils/responseFormat';
import { logger } from '../utils/logger';
import { sendOtpEmail } from '../utils/email'; // If needed for notification
import mongoose from 'mongoose';

// GET /admin/users
export const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const skip = (page - 1) * limit;

    const roleFilter = req.query.role as string | undefined;
    const accessFilter = req.query.accessLevel as string | undefined;
    const searchQuery = req.query.search as string | undefined;

    const query: any = { isDeleted: false };

    if (roleFilter && ['student', 'admin', 'staff', 'follow_up', 'premium'].includes(roleFilter)) {
      query.role = roleFilter;
    }

    if (accessFilter && ['public', 'registered', 'subscribed'].includes(accessFilter)) {
      query.accessLevel = accessFilter;
    }

    if (searchQuery) {
      const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const safe = escapeRegex(searchQuery.slice(0, 100));
      query.$or = [
        { name: { $regex: safe, $options: 'i' } },
        { email: { $regex: safe, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password -__v')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      User.countDocuments(query),
    ]);

    res.status(200).json(
      successResponse(
        {
          data: users,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        },
        'Users fetched successfully'
      )
    );
  } catch (error) {
    logger.error('Error fetching users:', error);
    next(error);
  }
};

// APPROVE USER
export const approveUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.params['userId'] as string;
    const adminId = req.user?.userId as string;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json(errorResponse('Invalid user ID format'));
      return;
    }

    const user = await User.findById(userId);
    if (!user || user.isDeleted) {
      res.status(404).json(errorResponse('User not found'));
      return;
    }

    if (user.accessLevel === 'subscribed') {
      res.status(409).json(errorResponse('User already subscribed'));
      return;
    }

    const application = await Application.findOne({
      user_id: userId,
      isDeleted: false,
      status: { $in: ['pending', 'follow_up'] },
    });

    if (!application) {
      res.status(404).json(errorResponse('No pending application found'));
      return;
    }

    const [updatedApplication, updatedUser] = await Promise.all([
      Application.findByIdAndUpdate(
        application._id,
        { $set: { status: 'approved', reviewedBy: adminId } },
        { new: true }
      ),
      User.findOneAndUpdate(
        { _id: userId, isDeleted: false },
        { 
          $set: { 
            accessLevel: 'subscribed', 
            role: 'premium', 
            enrolledTrack: application.course, // Transfer track
            updatedBy: adminId 
          } 
        },
        { new: true, select: '-password -__v' }
      ),
    ]);

    res.status(200).json(
      successResponse(
        {
          user: updatedUser,
          application: { status: updatedApplication?.status },
        },
        'User approved successfully'
      )
    );
  } catch (error) {
    logger.error('Error approving user:', error);
    next(error);
  }
};

// GET APPLICATIONS
export const getAllApplications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const status = req.query.status as string | undefined;

    const validStatuses = ['pending', 'follow_up', 'approved', 'rejected'];

    const query: any = { isDeleted: false };
    if (status && validStatuses.includes(status)) {
      query.status = status;
    }

    const applications = await Application.find(query).lean();

    res.status(200).json(successResponse(applications, 'Applications fetched'));
  } catch (error) {
    next(error);
  }
};

// UPDATE USER ROLE
export const updateUserRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.params['userId'] as string;
    const { role } = req.body;
    const adminId = req.user?.userId as string;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json(errorResponse('Invalid user ID format'));
      return;
    }

    // ✅ FIX: Prevent self-role change (security + consistency)
    if (userId === adminId) {
      res.status(403).json(errorResponse('Cannot change your own role'));
      return;
    }

    const validRoles = ['student', 'admin', 'teacher', 'staff', 'follow_up', 'premium'];

    if (!validRoles.includes(role)) {
      res.status(400).json(errorResponse('Invalid role'));
      return;
    }

    const user = await User.findOneAndUpdate(
      { _id: userId, isDeleted: false },
      { $set: { role, updatedBy: adminId } },
      { new: true, select: '-password -__v' }
    );

    if (!user) {
      res.status(404).json(errorResponse('User not found or deleted'));
      return;
    }

    res.status(200).json(successResponse(user, 'Role updated'));
  } catch (error) {
    next(error);
  }
};

// ADD teacher
export const addteacher = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    const adminId = req.user?.userId;

    // Check if user already exists
    const existingUser = await User.findOne({ email, isDeleted: false });
    if (existingUser) {
      res.status(409).json(errorResponse('A user with this email already exists'));
      return;
    }

    const teacher = await User.create({
      name,
      email,
      password,
      role: 'staff',
      accessLevel: 'subscribed', // teachers should have full access
      createdBy: adminId
    });

    logger.info(`New teacher added: ${email} by admin ${adminId}`);

    res.status(201).json(
      successResponse(
        {
          id: teacher._id,
          name: teacher.name,
          email: teacher.email,
          role: teacher.role,
        },
        'teacher added successfully'
      )
    );
  } catch (error) {
    logger.error('Error adding teacher:', error);
    next(error);
  }
};

// UPDATE APPLICATION STATUS (TRANSACTION FIX)
export const updateApplicationStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const session = await mongoose.startSession();

  try {
    const applicationId = req.params['applicationId'] as string;
    const { status, notes } = req.body;
    const reviewerId = req.user?.userId as string;

    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      res.status(400).json(errorResponse('Invalid application ID format'));
      return;
    }

    const validStatuses = ['pending', 'follow_up', 'approved', 'rejected'];

    if (!validStatuses.includes(status)) {
      res.status(400).json(errorResponse('Invalid status'));
      return;
    }

    session.startTransaction();

    const application = await Application.findByIdAndUpdate(
      applicationId,
      {
        $set: {
          status,
          notes: notes || undefined,
          reviewedBy: reviewerId,
        },
      },
      { new: true, session }
    ).populate('user_id', 'name email');

    if (!application) {
      await session.abortTransaction();
      res.status(404).json(errorResponse('Application not found'));
      return;
    }

    // ✅ Upgrade user to premium if approved
    if (status === 'approved' && application.user_id) {
      const targetUserId = (application.user_id as any)._id || application.user_id;
      await User.findByIdAndUpdate(
        targetUserId,
        { 
          $set: { 
            accessLevel: 'subscribed', 
            role: 'premium',
            enrolledTrack: application.course // Transfer track
          } 
        },
        { session }
      );
      logger.info(`User ${targetUserId} upgraded to premium/subscribed`);
    }

    await session.commitTransaction();

    logger.info(`Application ${applicationId} updated to '${status}' by ${reviewerId}`);

    res.status(200).json(
      successResponse(application, `Application status updated to '${status}'`)
    );
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

// ANALYTICS (FIXED COUNTS)
export const getAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const [
      totalUsers,
      subscribedUsers,
      totalApplications,
      pendingApplications,
      followUpApplications,
      approvedApplications,
      rejectedApplications,
    ] = await Promise.all([
      User.countDocuments({ isDeleted: false }),
      User.countDocuments({ isDeleted: false, accessLevel: 'subscribed' }),
      Application.countDocuments({ isDeleted: false }),
      Application.countDocuments({ isDeleted: false, status: 'pending' }),
      Application.countDocuments({ isDeleted: false, status: 'follow_up' }),
      Application.countDocuments({ isDeleted: false, status: 'approved' }),
      Application.countDocuments({ isDeleted: false, status: 'rejected' }),
    ]);

    res.status(200).json(
      successResponse(
        {
          users: {
            total: totalUsers,
            subscribed: subscribedUsers,
            conversionRate:
              totalUsers > 0
                ? `${Math.round((subscribedUsers / totalUsers) * 100)}%`
                : '0%',
          },
          applications: {
            total: totalApplications,
            pending: pendingApplications,
            followUp: followUpApplications,
            approved: approvedApplications,
            rejected: rejectedApplications,
          },
        },
        'Analytics fetched'
      )
    );
  } catch (error) {
    next(error);
  }
};