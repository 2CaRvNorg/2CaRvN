import mongoose from 'mongoose';
import { User } from './models/User';
import { Exam } from './models/Exam';
import { config } from './config/env';
import { logger } from './utils/logger';

async function seedExams() {
  try {
    logger.info('Connecting to MongoDB...');
    await mongoose.connect(config.mongoUri);
    logger.info('Connected.');

    const teacher = await User.findOne({ email: 'teacher@2CaRvN.com' });
    if (!teacher) {
      logger.error('teacher account not found. Please run seed.ts first.');
      process.exit(1);
    }

    const examData = [
      {
        title: 'HTML & CSS Fundamentals',
        description: 'Test your knowledge of basic web structure and styling. This exam covers semantic HTML5 and modern CSS layouts.',
        questions: [
          {
            questionText: 'What does HTML stand for?',
            options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Transfer Markup Language', 'Home Tool Markup Language'],
            correctAnswer: 'Hyper Text Markup Language',
          },
          {
            questionText: 'Which CSS property is used to change the background color?',
            options: ['color', 'background-color', 'bgcolor', 'fill'],
            correctAnswer: 'background-color',
          },
          {
            questionText: 'What is the correct HTML element for the largest heading?',
            options: ['<heading>', '<h6>', '<head>', '<h1>'],
            correctAnswer: '<h1>',
          }
        ],
        passingScore: 70,
        timeLimitMinutes: 30,
        maxAttempts: 3,
        category: 'weekly',
        weekNumber: 1,
        teacher_id: teacher._id,
      },
      {
        title: 'JavaScript Logic Quiz',
        description: 'Challenge yourself with core JavaScript concepts, including arrays, functions, and async/await.',
        questions: [
          {
            questionText: 'Which operator is used to assign a value to a variable?',
            options: ['*', '=', '-', 'x'],
            correctAnswer: '=',
          },
          {
            questionText: 'How do you create a function in JavaScript?',
            options: ['function:myFunction()', 'function = myFunction()', 'function myFunction()', 'create myFunction()'],
            correctAnswer: 'function myFunction()',
          }
        ],
        passingScore: 60,
        timeLimitMinutes: 20,
        maxAttempts: 2,
        category: 'weekly',
        weekNumber: 2,
        teacher_id: teacher._id,
      }
    ];

    logger.info('Seeding exams...');
    for (const data of examData) {
      await Exam.findOneAndUpdate(
        { title: data.title },
        data,
        { upsert: true, new: true }
      );
    }

    logger.info('✅ Test exams seeded successfully.');
    process.exit(0);
  } catch (error) {
    logger.error('Error seeding exams:', error);
    process.exit(1);
  }
}

seedExams();
