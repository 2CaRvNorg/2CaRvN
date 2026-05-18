import { z } from 'zod';

// ──────────────────────────────────────────────────────
// Register Validator
// ──────────────────────────────────────────────────────
export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(80, 'Name must be under 80 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters'),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Invalid email address')
    .max(255, 'Email too long'),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_#\-])[A-Za-z\d@$!%*?&_#\-]{8,}$/,
      'Password must contain uppercase, lowercase, number, and special character (@$!%*?&_#-)'
    ),
});

export type RegisterInput = z.infer<typeof registerSchema>;

// ──────────────────────────────────────────────────────
// Login Validator
// ──────────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Invalid email address'),

  password: z
    .string()
    .min(1, 'Password is required'),
});

export const verifyOtpSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Invalid email address'),

  otpCode: z
    .string()
    .trim()
    .length(6, 'OTP code must be 6 digits'),
});

export const googleLoginSchema = z.object({
  credential: z.string().min(1, 'Google credential is required'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type GoogleLoginInput = z.infer<typeof googleLoginSchema>;

// ──────────────────────────────────────────────────────
// Update Profile Validator — strict mode prevents mass-assignment
// ──────────────────────────────────────────────────────
export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(80, 'Name must be under 80 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters')
    .optional(),
}).strict();

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
