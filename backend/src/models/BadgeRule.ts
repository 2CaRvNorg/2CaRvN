import mongoose, { Schema, Document } from 'mongoose';

export interface IBadgeRule extends Document {
  key: string;
  description?: string;
  conditions: Record<string, any>;
  badgeKey: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BadgeRuleSchema = new Schema<IBadgeRule>({
  key: { type: String, required: true, unique: true, index: true },
  description: { type: String },
  conditions: { type: Schema.Types.Mixed, required: true },
  badgeKey: { type: String, required: true, index: true },
  active: { type: Boolean, default: true },
}, { timestamps: true });

export const BadgeRule = mongoose.model<IBadgeRule>('BadgeRule', BadgeRuleSchema);

export default BadgeRule;
