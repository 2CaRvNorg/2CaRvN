import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Exam } from '../models/Exam';
import type { IExam } from '../models/Exam';
import { ExamSubmission } from '../models/ExamSubmission';
import { successResponse, errorResponse } from '../utils/responseFormat';
import { logger } from '../utils/logger';

// ──────────────────────────────────────────────────────
// POST /exams
// Requires: requireAuth + requireRole(['admin', 'teacher']) + validate(createExamSchema)
// ──────────────────────────────────────────────────────
export const createExam = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, description, questions, passingScore, timeLimitMinutes, maxAttempts, category, weekNumber } = req.body;
    const teacher_id = req.user?.userId;

    const exam = await Exam.create({
      title,
      description,
      questions,
      passingScore,
      timeLimitMinutes,
      maxAttempts,
      category: category || 'general',
      weekNumber,
      teacher_id,
    } as Partial<IExam>);

    logger.info(`Exam created: "${title}" by teacher ${teacher_id}`);

    res.status(201).json(successResponse(
      { examId: exam._id, title: exam.title },
      'Exam created successfully'
    ));
  } catch (error) {
    logger.error('Error creating exam:', error);
    next(error);
  }
};

// ──────────────────────────────────────────────────────
// GET /exams
// Requires: requireAuth + requireAccessLevel(['subscribed'])
// NEVER sends correct answers to client
// ──────────────────────────────────────────────────────
export const getExams = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(20, Math.max(1, parseInt(req.query.limit as string) || 10));
    const skip = (page - 1) * limit;
    const category = req.query.category as string;

    const query: any = { isDeleted: false };
    if (category) {
      query.category = category;
    }

    const [exams, total] = await Promise.all([
      Exam.find(query)
        .select('-questions.correctAnswer -__v') // ← Never leak correct answers
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Exam.countDocuments(query),
    ]);

    res.status(200).json(
      successResponse(
        {
          data: exams,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        },
        'Exams fetched successfully'
      )
    );
  } catch (error) {
    logger.error('Error fetching exams:', error);
    next(error);
  }
};

// ──────────────────────────────────────────────────────
// GET /exams/:examId
// Requires: requireAuth + requireAccessLevel(['subscribed'])
// ──────────────────────────────────────────────────────
export const getExamById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { examId } = req.params as { examId: string };

    if (!examId || !mongoose.Types.ObjectId.isValid(examId)) {
      res.status(400).json(errorResponse('Invalid exam ID'));
      return;
    }

    const exam = await Exam.findOne({ _id: examId, isDeleted: false })
      .select('-questions.correctAnswer -__v')
      .lean();

    if (!exam) {
      res.status(404).json(errorResponse('Exam not found'));
      return;
    }

    res.status(200).json(successResponse(exam, 'Exam fetched successfully'));
  } catch (error) {
    logger.error('Error fetching exam by ID:', error);
    next(error);
  }
};

// ──────────────────────────────────────────────────────
// POST /exams/submit
// Requires: requireAuth + requireAccessLevel(['subscribed']) + examLimiter + validate(submitExamSchema)
// ──────────────────────────────────────────────────────
export const submitExam = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const examId = (req.params.examId || req.body.examId) as string;
    const { answers, startedAt, cheatingFlags } = req.body;
    const userId = req.user?.userId;

    // ✅ FIX: Validate ObjectId before query (prevents CastError)
    if (!examId || !mongoose.Types.ObjectId.isValid(examId)) {
      res.status(400).json(errorResponse('Invalid exam ID'));
      return;
    }

    if (!userId || !mongoose.Types.ObjectId.isValid(userId as string)) {
      res.status(400).json(errorResponse('Invalid user ID'));
      return;
    }

    // Fetch the FULL exam WITH correct answers (server-side only — never sent to client)
    const exam = await Exam.findById(examId) as IExam | null;
    if (!exam || exam.isDeleted) {
      res.status(404).json(errorResponse('Exam not found'));
      return;
    }

    // Enforce max attempt limit
    const attemptCount = await ExamSubmission.countDocuments({
      exam_id: examId,
      user_id: userId,
    });

    if (attemptCount >= exam.maxAttempts) {
      res.status(403).json(
        errorResponse(`You have reached the maximum ${exam.maxAttempts} attempt(s) for this exam`)
      );
      return;
    }

    // Check time limit (prevent late submissions)
    const startTime = new Date(startedAt).getTime();
    const now = Date.now();
    const elapsedMinutes = (now - startTime) / 1000 / 60;
    const GRACE_PERIOD_MINUTES = 2;

    if (elapsedMinutes > exam.timeLimitMinutes + GRACE_PERIOD_MINUTES) {
      res.status(422).json(
        errorResponse('Exam time limit exceeded. Submission rejected.')
      );
      return;
    }

    // Score calculation (server-side — client cannot influence score)
    let correctCount = 0;
    const answersMap = new Map(
      answers.map((a: { question_id: string; selectedAnswer: string }) => [
        a.question_id,
        a.selectedAnswer,
      ])
    );

    exam.questions.forEach((q: any) => {
      const questionId = q._id.toString();
      const userAnswer = answersMap.get(questionId);
      if (userAnswer === q.correctAnswer) {
        correctCount += 1;
      }
    });

    const totalQuestions = exam.questions.length;
    const percentScore = totalQuestions > 0
      ? Math.round((correctCount / totalQuestions) * 100)
      : 0;
    const passed = percentScore >= exam.passingScore;

    // Persist submission
    await ExamSubmission.create({
      exam_id: examId,
      user_id: userId,
      score: percentScore,
      status: passed ? 'passed' : 'failed',
      attemptNumber: attemptCount + 1,
      startedAt: new Date(startedAt),
      submittedAt: new Date(),
      cheatingFlags: cheatingFlags || 0,
      answers,
    });

    logger.info(
      `Exam submission: user=${userId} exam=${examId} score=${percentScore}% passed=${passed}`
    );

    res.status(201).json(
      successResponse(
        {
          score: percentScore,
          passed,
          correctAnswers: correctCount,
          totalQuestions,
          attemptNumber: attemptCount + 1,
          maxAttempts: exam.maxAttempts,
          remainingAttempts: exam.maxAttempts - (attemptCount + 1),
        },
        passed ? 'Congratulations! You passed the exam.' : 'Exam submitted. Keep practicing!'
      )
    );
  } catch (error) {
    logger.error('Error submitting exam:', error);
    next(error);
  }
};

// ──────────────────────────────────────────────────────
// GET /exams/:examId/submissions
// Requires: requireAuth + requireRole(['admin', 'teacher', 'teacher'])
// ──────────────────────────────────────────────────────
export const getExamSubmissionsByExamId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { examId } = req.params as { examId: string };

    if (!examId || !mongoose.Types.ObjectId.isValid(examId)) {
      res.status(400).json(errorResponse('Invalid exam ID'));
      return;
    }

    const submissions = await ExamSubmission.find({ exam_id: examId })
      .populate('user_id', 'name email')
      .sort({ submittedAt: -1 })
      .lean();

    res.status(200).json(successResponse(submissions, 'Submissions fetched successfully'));
  } catch (error) {
    logger.error('Error fetching submissions for exam:', error);
    next(error);
  }
};
