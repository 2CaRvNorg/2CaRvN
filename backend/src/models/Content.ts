import mongoose, { Document, Schema } from 'mongoose';

export interface IContent extends Document {
  title: string;
  description: string;
  type: 'video' | 'text' | 'task';
  accessLevel: 'registered' | 'subscribed';
  track?: 'verbal+communication' | 'verbal+tech' | 'verbal+tech+communication' | 'all';
  media_url?: string;
  teacher_id: mongoose.Types.ObjectId;
  batch_id?: mongoose.Types.ObjectId; // Optional: content specific to a batch
  isDeleted: boolean; // Soft delete
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ContentSchema: Schema = new Schema(
  {
    title: { type: String, required: true, index: true },
    description: { type: String, required: true },
    type: {
      type: String,
      enum: ['video', 'text', 'task'],
      required: true,
    },
    accessLevel: {
      type: String,
      enum: ['registered', 'subscribed'],
      default: 'registered',
      index: true
    },
    track: {
      type: String,
      enum: ['verbal+communication', 'verbal+tech', 'verbal+tech+communication', 'all'],
      default: 'all',
      index: true
    },
    media_url: { type: String }, // Provided via Cloudinary or similar
    teacher_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    batch_id: { type: Schema.Types.ObjectId, ref: 'Batch' },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

export const Content = mongoose.model<IContent>('Content', ContentSchema);
