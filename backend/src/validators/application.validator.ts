import { z } from 'zod';

export const applicationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name too long'),

  phone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s\-()]{7,20}$/, 'Invalid phone number format'),

  college: z
    .string()
    .trim()
    .min(2, 'College name too short')
    .max(200, 'College name too long'),

  course: z.enum([
    'verbal+communication',
    'verbal+tech',
    'verbal+tech+communication'
  ]),

  yearOfStudy: z.enum(
    ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate', 'Post-Graduate', 'Working Professional']
  ),

  skills: z
    .array(z.string().trim().max(50))
    .max(20, 'Too many skills listed')
    .default([]),

  whyJoin2CaRvN: z
    .string()
    .trim()
    .min(50, 'Please write at least 50 characters explaining why you want to join')
    .max(1000, 'Response too long (max 1000 characters)'),

  availability: z
    .string()
    .trim()
    .min(3, 'Please describe your availability')
    .max(200, 'Availability description too long'),

  goals: z
    .string()
    .trim()
    .min(20, 'Please describe your goals (minimum 20 characters)')
    .max(500, 'Goals too long (max 500 characters)'),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;
