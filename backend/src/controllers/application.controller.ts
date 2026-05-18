import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Application } from '../models/Application';
import { User } from '../models/User';
import { successResponse, errorResponse } from '../utils/responseFormat';
import { logger } from '../utils/logger';
import { sendApplicationEmails } from '../utils/email';

// ──────────────────────────────────────────────────────
// POST /application
// Requires: requireAuth + requireAccessLevel(['registered', 'subscribed']) + validate(applicationSchema)
// ──────────────────────────────────────────────────────
export const submitApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const {
      name,
      phone,
      college,
      course,
      yearOfStudy,
      skills,
      whyJoin2CaRvN,
      availability,
      goals,
    } = req.body;

    console.log('FORM DATA:', req.body);

    // Prevent duplicate applications (one per user) - ONLY IN PRODUCTION
    const isDevelopment = process.env.NODE_ENV !== 'production';
    const existingApp = await Application.findOne({ user_id: userId, isDeleted: false });
    
    if (!isDevelopment && existingApp) {
      logger.warn(`Duplicate application prevented for user ${userId}`);
      res.status(409).json(errorResponse('You have already submitted an application. Please wait for review.'));
      return;
    }

    const application = await Application.create({
      user_id: userId,
      name,
      phone,
      college,
      course,
      yearOfStudy,
      skills: skills || [],
      whyJoin2CaRvN,
      availability,
      goals,
      status: 'pending',
    });

    logger.info(`New application submitted by user ${userId}`);

    try {
      console.log('Sending email...');
      const user = await User.findById(userId).select('email name isDeleted');
      if (!user || user.isDeleted || !user.email) {
        const message = `User ${userId} is deleted, not found, or missing email for application notification`;
        logger.warn(message);
        throw new Error(message);
      }

      const emailResult = await sendApplicationEmails({
        applicantEmail: user.email,
        applicantName: user.name || name,
        applicationId: application._id.toString(),
        phone,
        college,
        course,
        yearOfStudy,
        skills: skills || [],
        whyJoin2CaRvN,
        availability,
        goals,
      });

      console.log('Application email send completed', emailResult);
    } catch (emailError) {
      logger.error('Application email send failed:', emailError);
      res.status(502).json(
        errorResponse('Application submitted but email notification failed. Please contact support.')
      );
      return;
    }

    res.status(201).json(
      successResponse(
        {
          applicationId: application._id,
          status: application.status,
        },
        'Application submitted successfully. Our team will contact you within 24 hours.'
      )
    );
  } catch (error) {
    logger.error('Error submitting application:', error);
    next(error);
  }
};

// ──────────────────────────────────────────────────────
// GET /application/status
// Requires: requireAuth
// ──────────────────────────────────────────────────────
export const getApplicationStatus = async (
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

    const application = await Application.findOne({ user_id: userId, isDeleted: false })
      .select('status notes createdAt updatedAt')
      .lean();

    if (!application) {
      res.status(404).json(errorResponse('No application found. Please submit your application.'));
      return;
    }

    res.status(200).json(
      successResponse(
        {
          status: application.status,
          notes: application.notes || null,
          appliedAt: application.createdAt,
          lastUpdated: application.updatedAt,
        },
        'Application status fetched'
      )
    );
  } catch (error) {
    logger.error('Error fetching application status:', error);
    next(error);
  }
};
