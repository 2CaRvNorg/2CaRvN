import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { User } from './models/User';
import { config } from './config/env';
import { logger } from './utils/logger';

async function seed() {
  try {
    logger.info('Connecting to MongoDB...');
    await mongoose.connect(config.mongoUri);
    logger.info('Connected.');

    const adminEmail = 'admin@2CaRvN.com';
    const teacherEmail = 'teacher@2CaRvN.com';
    const premiumEmail = 'premium@2CaRvN.com';

    // Hash a generic password for all accounts
    const hashedPassword = await bcrypt.hash('password', 10);

    logger.info('Upserting admin account...');
    await User.findOneAndUpdate(
      { email: adminEmail },
      {
        name: '2CaRvN Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        accessLevel: 'subscribed',
        status: 'active',
      },
      { upsert: true, new: true }
    );

    logger.info('Upserting teacher account...');
    await User.findOneAndUpdate(
      { email: teacherEmail },
      {
        name: '2CaRvN teacher',
        email: teacherEmail,
        password: hashedPassword,
        role: 'staff',
        accessLevel: 'subscribed',
        status: 'active',
      },
      { upsert: true, new: true }
    );

    logger.info('Upserting premium student account...');
    await User.findOneAndUpdate(
      { email: premiumEmail },
      {
        name: 'Premium Student',
        email: premiumEmail,
        password: hashedPassword,
        role: 'premium',
        accessLevel: 'subscribed',
        status: 'active',
      },
      { upsert: true, new: true }
    );

    logger.info('✅ Database seeded successfully.');
    logger.info('─────────────────────────────────────');
    logger.info('Test Accounts (password: "password")');
    logger.info(`  Admin:   ${adminEmail}`);
    logger.info(`  teacher: ${teacherEmail}`);
    logger.info(`  Premium: ${premiumEmail}`);
    logger.info('─────────────────────────────────────');
    process.exit(0);
  } catch (error) {
    logger.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
