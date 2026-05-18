import mongoose, { Document, Schema } from 'mongoose';

export interface IBatch extends Document {
  name: string;
  startDate: Date;
  endDate: Date;
  students: mongoose.Types.ObjectId[];
  isDeleted: boolean; // Soft delete
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BatchSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true, index: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    students: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

export const Batch = mongoose.model<IBatch>('Batch', BatchSchema);
