import mongoose, { Document, Schema } from 'mongoose';

export interface IApplication extends Document {
  user_id: mongoose.Types.ObjectId;
  name: string;
  phone: string;
  college: string;
  course: string;
  yearOfStudy: string;
  skills: string[];
  whyJoin2CaRvN: string;
  availability: string;
  goals: string;
  status: 'pending' | 'follow_up' | 'approved' | 'rejected';
  notes?: string;   // For follow_up team
  isDeleted: boolean; // Soft delete
  deletedAt?: Date;
  reviewedBy?: mongoose.Types.ObjectId; // Audit field
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema: Schema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    college: { type: String, required: true },
    course: { type: String, required: true },
    yearOfStudy: { type: String, required: true }, // e.g., '1st Year', 'Graduate'
    skills: { type: [String], default: [] },
    whyJoin2CaRvN: { type: String, required: true },
    availability: { type: String, required: true },
    goals: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'follow_up', 'approved', 'rejected'],
      default: 'pending',
    },
    notes: { type: String }, // Internal notes for teacher
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  }
);

export const Application = mongoose.model<IApplication>('Application', ApplicationSchema);
