import dotenv from 'dotenv';
import path from 'path';
import { SignOptions } from 'jsonwebtoken';

// 📁 Decide which .env file to use (ONLY for local)
const envFile =
  process.env.NODE_ENV === 'production'
    ? '.env.production'
    : '.env.development';

// ✅ Load .env ONLY in development (Render uses its own env vars)
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.resolve(process.cwd(), envFile) });
}

export const config = {
  // 🌍 Environment
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),

  // 🗄️ MongoDB (REQUIRED)
  mongoUri: process.env.MONGO_URI || (() => {
    throw new Error('FATAL: MONGO_URI environment variable is required');
  })(),

  // 🔐 JWT Secrets (REQUIRED)
  jwtAccessSecret: (() => {
    if (!process.env.JWT_ACCESS_SECRET) {
      throw new Error('FATAL: JWT_ACCESS_SECRET is required');
    }
    return process.env.JWT_ACCESS_SECRET;
  })(),

  jwtRefreshSecret: (() => {
    if (!process.env.JWT_REFRESH_SECRET) {
      throw new Error('FATAL: JWT_REFRESH_SECRET is required');
    }
    return process.env.JWT_REFRESH_SECRET;
  })(),

  // ⏱️ Token Expiry
  jwtAccessExpiration:
    (process.env.JWT_ACCESS_EXPIRATION || '15m') as SignOptions['expiresIn'],

  jwtRefreshExpiration:
    (process.env.JWT_REFRESH_EXPIRATION || '7d') as SignOptions['expiresIn'],

  // 🌐 CORS (supports multiple origins)
  corsOrigin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
    : ['http://localhost:3000'],

  // 📧 Email Config
  emailHost: process.env.EMAIL_HOST || '',
  emailPort: process.env.EMAIL_PORT
    ? Number(process.env.EMAIL_PORT)
    : 587,
  emailUser: process.env.EMAIL_USER || '',
  emailPass: process.env.EMAIL_PASS || '',
  emailFrom: process.env.EMAIL_FROM || 'no-reply@2CaRvN.com',

  // 📬 Resend Config
  resendApiKey: process.env.RESEND_API_KEY || '',
  resendFrom:
    process.env.RESEND_FROM ||
    process.env.EMAIL_FROM ||
    'onboarding@resend.dev',

  adminNotificationEmail:
    process.env.ADMIN_NOTIFICATION_EMAIL || 'admin@resend.dev',

  // 🔗 URLs
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  backendUrl:
    process.env.BACKEND_URL ||
    `http://localhost:${process.env.PORT || 5000}`,

  // 🔑 OAuth
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  githubClientId: process.env.GITHUB_CLIENT_ID || '',
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET || '',

  // ☁️ Cloudinary
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '',
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || '',
};