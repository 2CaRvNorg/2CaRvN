import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion {
  questionText: string;
  options: string[];
  correctAnswer: string;
}

export interface IExam extends Document {
  title: string;
  description: string;
  questions: IQuestion[];
  passingScore: number;
  timeLimitMinutes: number; // For anti-cheating, tracking time
  maxAttempts: number;
  category: 'general' | 'weekly';
  weekNumber?: number;
  teacher_id: mongoose.Types.ObjectId;
  isDeleted: boolean; // Soft delete
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema: Schema = new Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true }, // The index or string
});

const ExamSchema: Schema = new Schema(
  {
    title: { type: String, required: true, index: true },
    description: { type: String, required: true },
    questions: [QuestionSchema],
    passingScore: { type: Number, required: true, default: 70 },
    timeLimitMinutes: { type: Number, required: true, default: 60 },
    maxAttempts: { type: Number, required: true, default: 2 },
    category: { type: String, enum: ['general', 'weekly'], default: 'general' },
    weekNumber: { type: Number },
    teacher_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

export const Exam = mongoose.model<IExam>('Exam', ExamSchema);
