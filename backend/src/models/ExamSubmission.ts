import mongoose, { Document, Schema } from 'mongoose';

export interface IExamSubmission extends Document {
  exam_id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  score: number;
  status: 'passed' | 'failed' | 'in_progress';
  attemptNumber: number;
  startedAt: Date;
  submittedAt?: Date;
  cheatingFlags: number; // E.g. count of tab switches or blurs
  answers: {
    question_id: string; // the string ID or text of question
    selectedAnswer: string;
  }[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ExamSubmissionSchema: Schema = new Schema(
  {
    exam_id: { type: Schema.Types.ObjectId, ref: 'Exam', required: true, index: true },
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    score: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['passed', 'failed', 'in_progress'],
      default: 'in_progress',
    },
    attemptNumber: { type: Number, required: true, default: 1 },
    startedAt: { type: Date, required: true, default: Date.now },
    submittedAt: { type: Date },
    cheatingFlags: { type: Number, default: 0 }, // Cheating prevention (Frontend will increment this if user switches tabs)
    answers: [
      {
        question_id: { type: String },
        selectedAnswer: { type: String },
      },
    ],
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const ExamSubmission = mongoose.model<IExamSubmission>('ExamSubmission', ExamSubmissionSchema);
