import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

import app from './app';
import { config } from './config/env';
import { connectDB } from './config/db';
import { logger } from './utils/logger';

const startServer = async () => {
  // Connect to Database
  await connectDB();

  // Start Express Server
  app.listen(config.port, () => {
    logger.info(`Server is running in ${config.nodeEnv} mode on port ${config.port}`);
  });
};

// Handle Uncaught Exceptions & Rejections
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down...', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! Shutting down...', err);
  process.exit(1);
});

startServer();
