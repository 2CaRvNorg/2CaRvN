import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  authProvider: 'manual' | 'google' | 'github' | 'local';
  googleId?: string | null;
  providerId?: string | null;
  profilePicture?: string | null;
  emailVerified: boolean;
  otpCode?: string | null;
  otpExpiresAt?: Date | null;
  role: 'student' | 'admin' | 'teacher' | 'staff' | 'follow_up' | 'premium';
  accessLevel: 'public' | 'registered' | 'subscribed';
  enrolledTrack?: 'verbal+communication' | 'verbal+tech' | 'verbal+tech+communication' | null;
  status: 'active' | 'inactive' | 'suspended';
  isDeleted: boolean; // Soft delete
  deletedAt?: Date;
  createdBy?: mongoose.Types.ObjectId;  // Audit field
  updatedBy?: mongoose.Types.ObjectId;  // Audit field
  createdAt: Date;
  updatedAt: Date;
  tokenVersion: number;
  loginAttempts: number;
  lockUntil?: Date | null;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, select: false }, // Prevent returning password by default
    authProvider: {
      type: String,
      enum: ['manual', 'local', 'google', 'github'],
      default: 'manual',
    },
    googleId: { type: String, default: null, index: true },
    providerId: { type: String, default: null },
    profilePicture: { type: String, default: null },
    emailVerified: { type: Boolean, default: false },
    otpCode: { type: String, select: false, default: null },
    otpExpiresAt: { type: Date, default: null },
    role: {
      type: String,
      enum: ['student', 'admin', 'teacher', 'staff', 'follow_up', 'premium'],
      default: 'student',
    },
    accessLevel: {
      type: String,
      enum: ['public', 'registered', 'subscribed'],
      default: 'public',
    },
    enrolledTrack: {
      type: String,
      enum: ['verbal+communication', 'verbal+tech', 'verbal+tech+communication', null],
      default: null,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active',
    },
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    tokenVersion: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Password hashing proxy
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password as string, salt);
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', UserSchema);
