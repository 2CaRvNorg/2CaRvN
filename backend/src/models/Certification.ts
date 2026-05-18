import mongoose, { Schema, Document } from 'mongoose';

export interface ICertification extends Document {
  title: string;
  description?: string;
  issuedBy: string;
  issueDate: Date;
  certificateId: string;
  category?: string;
  skillLevel?: string;
  assetUrl?: string; // pdf or image
  studentId: mongoose.Types.ObjectId;
  teacherId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CertificationSchema = new Schema<ICertification>({
  title: { type: String, required: true, index: true },
  description: { type: String },
  issuedBy: { type: String, required: true },
  issueDate: { type: Date, default: () => new Date() },
  certificateId: { type: String, required: true, unique: true, index: true },
  category: { type: String },
  skillLevel: { type: String },
  assetUrl: { type: String },
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  teacherId: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

CertificationSchema.index({ studentId: 1, certificateId: 1 });

export const Certification = mongoose.model<ICertification>('Certification', CertificationSchema);

export default Certification;
