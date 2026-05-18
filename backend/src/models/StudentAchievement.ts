import mongoose, { Schema, Document } from 'mongoose';

export interface IStudentAchievement extends Document {
  studentId: mongoose.Types.ObjectId;
  badges: { badgeKey: string; awardedAt: Date; meta?: any }[];
  xp: number;
  rank?: number;
  achievements: { key: string; data?: any; createdAt: Date }[];
  createdAt: Date;
  updatedAt: Date;
}

const StudentAchievementSchema = new Schema<IStudentAchievement>({
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
  badges: [{ badgeKey: String, awardedAt: Date, meta: Schema.Types.Mixed }],
  xp: { type: Number, default: 0, index: true },
  rank: { type: Number },
  achievements: [{ key: String, data: Schema.Types.Mixed, createdAt: { type: Date, default: () => new Date() } }],
}, { timestamps: true });

export const StudentAchievement = mongoose.model<IStudentAchievement>('StudentAchievement', StudentAchievementSchema);

export default StudentAchievement;
