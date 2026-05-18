import { Router } from 'express';
import { createContent, getContents, updateContent, deleteContent, getMyContent, downloadContent } from '../controllers/content.controller';
import { requireAuth, requireRole, requireAccessLevel } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { createContentSchema } from '../validators/content.validator';
import { upload } from '../middlewares/upload';
import { logger } from '../utils/logger';
import { config } from '../config/env';

const router = Router();

// All content routes require authentication
router.use(requireAuth);

/**
 * GET /api/v1/content/my
 * Get all content created by the teacher (teacher/staff/admin only)
 */
router.get('/my', requireRole(['admin', 'teacher', 'staff']), getMyContent);

/**
 * GET /api/v1/content/:contentId/download
 * Redirects to media download URL (signed if necessary)
 */
router.get('/:contentId/download', requireAccessLevel(['registered', 'subscribed']), downloadContent);

/**
 * GET /api/v1/content
 * Returns content based on user's access level:
 *   - registered → only 'registered' content
 *   - subscribed → all content
 *   - admin/teacher → all content
 */
router.get('/', requireAccessLevel(['registered', 'subscribed']), getContents);

/**
 * POST /api/v1/content
 * Admin and teaching teacher only — create new content
 */
router.post(
  '/',
  requireRole(['admin', 'teacher', 'staff']),
  upload.single('file'), // Handle optional file upload
  // If multer uploaded a file to Cloudinary, copy its URL into req.body.media_url
  (req, _res, next) => {
    // Debug: log multer file and any incoming media_url for diagnosis
    try {
      const file = (req as any).file;
      logger.debug('[Upload Debug] content-type: %s', (req.headers['content-type'] || 'unknown'));
      logger.debug('[Upload Debug] multer file keys: %s', file ? Object.keys(file).join(', ') : 'no-file');
      if (file) {
        // also log core props we expect
        logger.debug('[Upload Debug] file.path=%s file.url=%s file.secure_url=%s', (file as any).path, (file as any).url, (file as any).secure_url);
      }
    } catch (e) {
      logger.warn('Failed to log upload file debug info', e);
    }

    // Normalize incoming mediaUrl -> media_url for clients that use camelCase
    try {
      if ((req.body as any).mediaUrl && !(req.body as any).media_url) {
        (req.body as any).media_url = (req.body as any).mediaUrl;
        logger.debug('[Upload Debug] Normalized mediaUrl -> media_url: %s', (req.body as any).media_url);
      }
    } catch (e) {}

    if ((req as any).file && !(req.body as any).media_url) {
      // multer-storage-cloudinary places the uploaded URL on file.path or file.secure_url
      // OR multer-disk-storage places the local file path on file.path
      const file = (req as any).file;
      let mediaUrl = file.path || file.secure_url || file.url || undefined;
      
      // If it's a local file path (not a URL), convert to HTTP URL
      if (mediaUrl && !mediaUrl.match(/^https?:\/\//)) {
        // Local file path - convert to HTTP URL
        const filename = file.filename || mediaUrl.split(/[\\/]/).pop();
        const protocol = config.nodeEnv === 'production' ? 'https' : 'http';
        const host = config.nodeEnv === 'production' ? new URL(config.backendUrl).host : 'localhost:5000';
        mediaUrl = `${protocol}://${host}/uploads/${filename}`;
        logger.debug('[Upload Debug] Converted local path to HTTP URL: %s', mediaUrl);
      }
      
      req.body.media_url = mediaUrl;
      logger.debug('[Upload Debug] Copied uploaded file URL into req.body.media_url: %s', req.body.media_url);
    } else {
      logger.debug('[Upload Debug] req.body.media_url present: %s', (req.body as any).media_url);
    }
    next();
  },
  validate(createContentSchema),
  createContent
);

/**
 * PATCH /api/v1/content/:contentId
 * Update content (teacher can update only their own)
 */
router.patch(
  '/:contentId',
  requireRole(['admin', 'teacher', 'staff']),
  upload.single('file'),
  updateContent
);

/**
 * DELETE /api/v1/content/:contentId
 * Delete content (soft delete - teacher can delete only their own)
 */
router.delete(
  '/:contentId',
  requireRole(['admin', 'teacher', 'staff']),
  deleteContent
);

export default router;
