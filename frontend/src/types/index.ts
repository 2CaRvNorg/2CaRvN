// Auth Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'staff' | 'admin' | 'premium' | 'teacher' | 'follow_up';
  accessLevel?: 'public' | 'registered' | 'subscribed';
  enrolledTrack?: 'verbal+communication' | 'verbal+tech' | 'verbal+tech+communication' | null;
  avatar?: string;
  profilePicture?: string;
  authProvider?: 'manual' | 'google' | 'github' | 'local';
  googleId?: string;
  emailVerified?: boolean;
  isVerified: boolean;
  createdAt: string;
}

export interface AuthErrorData {
  attemptsRemaining?: number;
  error?: {
    code?: 'ACCOUNT_LOCKED';
    retryAfter?: number;
  };
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  accessToken?: string;
  attemptsRemaining?: number;
  error?: {
    code?: 'ACCOUNT_LOCKED';
    retryAfter?: number;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface OtpVerification {
  email: string;
  otp: string;
}

// Application Types
export interface Application {
  id: string;
  userId: string;
  batchId: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  updatedAt: string;
  documents?: string[];
}

export interface ApplicationFormData {
  name: string;
  phone: string;
  college: string;
  course: 'verbal+communication' | 'verbal+tech' | 'verbal+tech+communication' | '';
  yearOfStudy: '1st Year' | '2nd Year' | '3rd Year' | '4th Year' | 'Graduate' | 'Post-Graduate' | 'Working Professional';
  skills: string[];
  whyJoin2CaRvN: string;
  availability: string;
  goals: string;
}

export interface ApplicationStatusResponse {
  status: 'pending' | 'approved' | 'follow_up' | 'rejected';
  notes: string | null;
  appliedAt: string;
  lastUpdated: string;
}

// Exam Types
export interface IQuestion {
  _id: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
}

export interface Exam {
  id: string;
  _id: string;
  title: string;
  description: string;
  questions: IQuestion[];
  passingScore: number;
  timeLimitMinutes: number;
  maxAttempts: number;
  category: 'general' | 'weekly';
  weekNumber?: number;
  createdAt: string;
}

export interface ExamSubmission {
  id?: string;
  examId: string;
  userId?: string;
  answers: {
    question_id: string;
    selectedAnswer: string;
  }[];
  score?: number;
  startedAt: string;
  submittedAt: string;
  status?: 'passed' | 'failed' | 'pending';
}

// Content Types
export interface Content {
  id: string;
  _id: string;
  title: string;
  description: string;
  type: 'video' | 'text' | 'task';
  accessLevel: 'registered' | 'subscribed';
  track?: 'verbal+communication' | 'verbal+tech' | 'verbal+tech+communication' | 'all';
  media_url?: string;
  teacher_id: string;
  batch_id?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Batch {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  capacity: number;
  enrolledCount: number;
  status: 'upcoming' | 'ongoing' | 'completed';
}

// Game Types
export interface Game {
  id: string;
  name: string;
  description: string;
  type: 'quiz' | 'puzzle' | 'arcade';
  difficulty: 'easy' | 'medium' | 'hard';
  reward: number;
  playedCount: number;
  userScore?: number;
}

export interface GameResult {
  gameId: string;
  score: number;
  timeSpent: number;
  playedAt: string;
  rewards: number;
}

// Badges / Certifications
export interface BadgeDefinition {
  _id?: string;
  key: string;
  title: string;
  description?: string;
  icon?: string;
  category?: string;
  createdAt?: string;
}

export interface StudentBadge {
  _id?: string;
  studentId: string;
  badgeKey: string;
  awardedAt: string;
  meta?: any;
}

export interface BadgeRule {
  _id?: string;
  key: string;
  badgeKey: string;
  description?: string;
  conditions: Record<string, any>;
  active: boolean;
  createdAt?: string;
}

export interface Certificate {
  _id: string;
  certificateId?: string;
  studentId: string;
  title: string;
  description?: string;
  category?: string;
  skillLevel?: string;
  issuedBy?: string;
  assetUrl?: string;
  createdAt?: string;
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Error Response
export interface ErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  data?: AuthErrorData;
}
