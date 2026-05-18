import { z } from 'zod';

// ──────────────────────────────────────────────────────
// Create Exam
// ──────────────────────────────────────────────────────
const questionSchema = z.object({
  questionText: z
    .string()
    .trim()
    .min(5, 'Question too short')
    .max(500, 'Question too long'),

  options: z
    .array(z.string().trim().min(1).max(200))
    .min(2, 'At least 2 options required')
    .max(6, 'Maximum 6 options allowed'),

  correctAnswer: z
    .string()
    .trim()
    .min(1, 'Correct answer cannot be empty'),
});

export const createExamSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Title too short')
    .max(200, 'Title too long'),

  description: z
    .string()
    .trim()
    .min(10, 'Description too short')
    .max(2000, 'Description too long'),

  questions: z
    .array(questionSchema)
    .min(1, 'At least 1 question is required')
    .max(100, 'Maximum 100 questions allowed'),

  passingScore: z
    .number()
    .min(0)
    .max(100),

  timeLimitMinutes: z
    .number()
    .min(5, 'Minimum 5 minutes')
    .max(300, 'Maximum 300 minutes'),

  maxAttempts: z
    .number()
    .min(1, 'Minimum 1 attempt')
    .max(5, 'Maximum 5 attempts')
    .default(2),
 
  category: z
    .enum(['general', 'weekly'])
    .default('general'),
 
  weekNumber: z
    .number()
    .min(1)
    .max(52)
    .optional(),
});

export type CreateExamInput = z.infer<typeof createExamSchema>;

// ──────────────────────────────────────────────────────
// Submit Exam
// ──────────────────────────────────────────────────────
const answerSchema = z.object({
  question_id: z
    .string()
    .regex(/^[a-fA-F0-9]{24}$/, 'Invalid question ID'),

  selectedAnswer: z
    .string()
    .min(1, 'Answer cannot be empty'),
});


export const submitExamSchema = z.object({
  examId: z
    .string()
    .regex(/^[a-fA-F0-9]{24}$/, 'Invalid exam ID format'),

  answers: z
    .array(answerSchema)
    .min(1, 'At least one answer is required'),

  startedAt: z
    .string()
    .datetime({ message: 'startedAt must be a valid ISO datetime string' })
    .refine(
      (val) => {
        // Quick patch: startedAt must not be in the future
        const now = Date.now();
        const started = Date.parse(val);
        return started <= now;
      },
      {
        message: 'Invalid start time: startedAt cannot be in the future',
      }
    ),

  cheatingFlags: z
    .number()
    .min(0)
    .max(100)
    .default(0),
});

export type SubmitExamInput = z.infer<typeof submitExamSchema>;
