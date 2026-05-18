import { z } from 'zod';

export const createContentSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title too long'),

  description: z
    .string()
    .trim()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description too long'),

  type: z.enum(['video', 'text', 'task']),

  accessLevel: z.enum(['registered', 'subscribed']),

  track: z.enum([
    'verbal+communication',
    'verbal+tech',
    'verbal+tech+communication',
    'all'
  ]).default('all'),

  media_url: z
    .string()
    .optional(),

  batch_id: z
    .string()
    .regex(/^[a-fA-F0-9]{24}$/, 'Invalid batch ID format')
    .optional(),
}).refine((data) => {
  // For video content, media_url is required and must be a valid URL
  if (data.type === 'video' && (!data.media_url || !data.media_url.match(/^https?:\/\/.+/))) {
    return false;
  }
  // For text content, media_url is optional
  return true;
}, {
  message: "Video content requires a valid media URL",
  path: ["media_url"]
});

export type CreateContentInput = z.infer<typeof createContentSchema>;
