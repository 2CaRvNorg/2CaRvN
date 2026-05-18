import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary';
import { config } from '../config/env';
import path from 'path';

// Temporary: use disk storage instead of Cloudinary to test upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads')); // Create uploads folder
  },
  filename: (req, file, cb) => {
    const sanitizedName = file.originalname.split('.')[0].replace(/[^a-zA-Z0-9-_]/g, '_');
    cb(null, `${Date.now()}-${sanitizedName}${path.extname(file.originalname)}`);
  },
});

export const upload = multer({ 
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit for videos
  }
});
