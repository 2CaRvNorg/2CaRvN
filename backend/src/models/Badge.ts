import mongoose, { Schema, Document } from 'mongoose';

export interface IBadge extends Document {
  key: string; // unique key
  title: string;
  description?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon?: string; // url or emoji
  criteria?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const BadgeSchema = new Schema<IBadge>({
  key: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true, index: true },
  description: { type: String },
  rarity: { type: String, enum: ['common','rare','epic','legendary'], default: 'common' },
  icon: { type: String },
  criteria: { type: Schema.Types.Mixed },
}, { timestamps: true });

export const Badge = mongoose.model<IBadge>('Badge', BadgeSchema);

export default Badge;
