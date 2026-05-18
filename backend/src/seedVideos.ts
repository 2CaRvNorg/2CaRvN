import mongoose from 'mongoose';
import { Content } from './models/Content';
import { User } from './models/User';
import { config } from './config/env';
import { logger } from './utils/logger';

async function seedVideos() {
  try {
    logger.info('Connecting to MongoDB...');
    await mongoose.connect(config.mongoUri);
    logger.info('Connected.');

    // Find a teacher to assign as teacher_id
    const teacher = await User.findOne({ role: 'staff' });
    if (!teacher) {
      logger.error('No teacher/teacher found to assign content. Please run seed.ts first.');
      process.exit(1);
    }

    const videos = [
      {
        title: 'Introduction to Web Development',
        description: 'Learn the basics of how the web works and what you need to get started.',
        type: 'video',
        accessLevel: 'registered',
        track: 'all',
        media_url: 'https://res.cloudinary.com/demo/video/upload/dog.mp4', // Sample video
        teacher_id: teacher._id,
      },
      {
        title: 'Advanced CSS Layouts',
        description: 'Master Flexbox and Grid to create complex, responsive layouts.',
        type: 'video',
        accessLevel: 'subscribed',
        track: 'all',
        media_url: 'https://res.cloudinary.com/demo/video/upload/elephants.mp4',
        teacher_id: teacher._id,
      },
      {
        title: 'JavaScript Asynchronous Programming',
        description: 'Deep dive into Promises, Async/Await, and the Event Loop.',
        type: 'video',
        accessLevel: 'subscribed',
        track: 'verbal+tech',
        media_url: 'https://res.cloudinary.com/demo/video/upload/sea_turtle.mp4',
        teacher_id: teacher._id,
      },
      {
        title: 'Effective Communication for Developers',
        description: 'How to communicate technical concepts to non-technical stakeholders.',
        type: 'video',
        accessLevel: 'registered',
        track: 'verbal+communication',
        media_url: 'https://res.cloudinary.com/demo/video/upload/dog.mp4',
        teacher_id: teacher._id,
      },
      {
        title: 'React Hooks Deep Dive',
        description: 'Learn how to use useEffect, useMemo, and custom hooks effectively.',
        type: 'video',
        accessLevel: 'subscribed',
        track: 'verbal+tech+communication',
        media_url: 'https://res.cloudinary.com/demo/video/upload/elephants.mp4',
        teacher_id: teacher._id,
      }
    ];

    logger.info('Deleting existing video content...');
    await Content.deleteMany({ type: 'video' });

    logger.info('Seeding videos...');
    await Content.insertMany(videos);

    logger.info('✅ Videos seeded successfully.');
    process.exit(0);
  } catch (error) {
    logger.error('Error seeding videos:', error);
    process.exit(1);
  }
}

seedVideos();
