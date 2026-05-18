import { Request, Response, NextFunction } from 'express';
import { Content } from '../models/Content';
import { successResponse, errorResponse } from '../utils/responseFormat';
import { logger } from '../utils/logger';
import cloudinary from '../utils/cloudinary';

// ──────────────────────────────────────────────────────
// POST /content
// Requires: requireAuth + requireRole(['admin', 'teacher']) + validate(createContentSchema)
// ──────────────────────────────────────────────────────
export const createContent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Debug: log incoming upload info
    try {
      const file = (req as any).file;
      logger.debug('[CreateContent] Incoming request content-type=%s, file=%s, body.media_url=%s', req.headers['content-type'], file ? Object.keys(file).join(', ') : 'no-file', (req.body as any).media_url);
    } catch (e) {}
    const { title, description, type, accessLevel, track, batch_id } = req.body;
    let { media_url } = req.body;
    const teacher_id = req.user?.userId;

    const content = await Content.create({
      title,
      description,
      type,
      accessLevel,
      track: track || 'all',
      media_url,
      teacher_id,
      batch_id: batch_id || undefined,
    });

    logger.info(`Content created: "${title}" by teacher ${teacher_id}`);

    res.status(201).json(successResponse(content, 'Content created successfully'));
  } catch (error) {
    logger.error('Error creating content:', error);
    next(error);
  }
};

// ──────────────────────────────────────────────────────
// GET /content
// Requires: requireAuth
// Access control: filters content based on user's accessLevel
// ──────────────────────────────────────────────────────
export const getContents = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20));
    const type = req.query.type as string | undefined;

    const skip = (page - 1) * limit;

    const userRole = req.user?.role;
    const userAccessLevel = req.user?.accessLevel;

    // Admin and teacher/staff see everything; students see based on their accessLevel and track
    let accessFilter: Record<string, unknown> = {};
    if (!['admin', 'teacher', 'staff'].includes(userRole as string)) {
      // Subscribed users see all content within their track; registered users only see 'registered' content
      if (userAccessLevel === 'subscribed') {
        const userTrack = req.user?.enrolledTrack;
        if (userTrack) {
          accessFilter = { track: { $in: [userTrack, 'all'] } };
        } else {
          accessFilter = {}; // No track restriction if user has no track? 
        }
      } else {
        accessFilter = { accessLevel: 'registered' };
      }
    }

    const query: Record<string, unknown> = { isDeleted: false, ...accessFilter };
    if (type && ['video', 'text', 'task'].includes(type)) {
      query.type = type;
    }

    const [contents, total] = await Promise.all([
      Content.find(query)
        .select('-__v')
        .populate('teacher_id', 'name')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      Content.countDocuments(query),
    ]);

    res.status(200).json(
      successResponse(
        {
          data: contents,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            hasNext: page < Math.ceil(total / limit),
            hasPrev: page > 1,
          },
        },
        'Content fetched successfully'
      )
    );
  } catch (error) {
    logger.error('Error fetching content:', error);
    next(error);
  }
};

// ──────────────────────────────────────────────────────
// PATCH /content/:contentId
// Update content (teacher can update only their own)
// ──────────────────────────────────────────────────────
export const updateContent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const contentId = req.params.contentId as string;
    const teacher_id = req.user?.userId;
    const { title, description, type, accessLevel, track } = req.body;
    let { media_url } = req.body;

    // Check if content exists and belongs to teacher
    const content = await Content.findById(contentId);
    if (!content) {
      res.status(404).json(errorResponse('Content not found'));
      return;
    }

    if (content.teacher_id.toString() !== teacher_id && req.user?.role !== 'admin') {
      res.status(403).json(errorResponse('You can only update your own content'));
      return;
    }

    // If a file was uploaded, use the new URL
    if ((req as any).file) {
      media_url = (req as any).file.path;
    }

    const updated = await Content.findByIdAndUpdate(
      contentId,
      {
        $set: {
          title: title || content.title,
          description: description || content.description,
          type: type || content.type,
          accessLevel: accessLevel || content.accessLevel,
          track: track || content.track,
          media_url: media_url !== undefined ? media_url : content.media_url,
        },
      },
      { new: true }
    );

    logger.info(`Content updated: "${updated?.title}" by teacher ${teacher_id}`);
    res.status(200).json(successResponse(updated, 'Content updated successfully'));
  } catch (error) {
    logger.error('Error updating content:', error);
    next(error);
  }
};

// ──────────────────────────────────────────────────────
// DELETE /content/:contentId
// Delete content (soft delete - teacher can delete only their own)
// ──────────────────────────────────────────────────────
export const deleteContent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const contentId = req.params.contentId as string;
    const teacher_id = req.user?.userId;

    const content = await Content.findById(contentId);
    if (!content) {
      res.status(404).json(errorResponse('Content not found'));
      return;
    }

    if (content.teacher_id.toString() !== teacher_id && req.user?.role !== 'admin') {
      res.status(403).json(errorResponse('You can only delete your own content'));
      return;
    }

    await Content.findByIdAndUpdate(
      contentId,
      { $set: { isDeleted: true, deletedAt: new Date() } }
    );

    logger.info(`Content deleted: "${content.title}" by teacher ${teacher_id}`);
    res.status(200).json(successResponse(null, 'Content deleted successfully'));
  } catch (error) {
    logger.error('Error deleting content:', error);
    next(error);
  }
};

// ──────────────────────────────────────────────────────
// GET /content/my (teacher only)
// Get all content created by the teacher
// ──────────────────────────────────────────────────────
export const getMyContent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const teacher_id = req.user?.userId;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20));

    const skip = (page - 1) * limit;

    const [contents, total] = await Promise.all([
      Content.find({ teacher_id, isDeleted: false })
        .select('-__v')
        .populate('teacher_id', 'name')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      Content.countDocuments({ teacher_id, isDeleted: false }),
    ]);

    res.status(200).json(
      successResponse(
        {
          data: contents,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            hasNext: page < Math.ceil(total / limit),
            hasPrev: page > 1,
          },
        },
        'Your content fetched successfully'
      )
    );
  } catch (error) {
    logger.error('Error fetching teacher content:', error);
    next(error);
  }
};

// Download / redirect helper for content media
export const downloadContent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const contentId = req.params.contentId as string;
    const content = await Content.findById(contentId).lean();
    if (!content) {
      res.status(404).json(errorResponse('Content not found'));
      return;
    }

    // Access control similar to getContents
    const userRole = req.user?.role;
    const userAccessLevel = req.user?.accessLevel;
    if (!['admin', 'teacher', 'staff'].includes(userRole as string)) {
      if (userAccessLevel !== 'subscribed' && content.accessLevel !== 'registered') {
        res.status(403).json(errorResponse('You do not have access to this content'));
        return;
      }
    }

    const mediaUrl: string | undefined = (content as any).media_url;
    if (!mediaUrl) {
      res.status(404).json(errorResponse('No media attached to this content'));
      return;
    }

    // Attempt to detect Cloudinary URLs and generate a signed URL if needed
    try {
      const cloudinaryRegex = /https:\/\/res\.cloudinary\.com\/(?:[^\/]+)\/([^\/]+)\/upload\/(?:v\d+\/)?(.+)\.(?:[^.\/]+)/;
      const match = mediaUrl.match(cloudinaryRegex);
      if (match) {
        const resourceType = match[1];
        const publicId = match[2]; // includes folder(s) + public id without extension
        const signed = cloudinary.url(publicId, {
          resource_type: resourceType === 'raw' ? 'raw' : 'auto',
          sign_url: true,
          secure: true,
        });
        res.redirect(signed);
        return;
      }
    } catch (e) {
      logger.warn('Failed to build signed Cloudinary URL, falling back to stored URL', e);
    }

    // Fallback: redirect to stored URL
    res.redirect(mediaUrl);
  } catch (error) {
    next(error);
  }
};
