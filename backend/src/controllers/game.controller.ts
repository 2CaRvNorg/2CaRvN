import { Request, Response, NextFunction } from 'express';
import { successResponse, errorResponse } from '../utils/responseFormat';
import { logger } from '../utils/logger';

interface GameDefinition {
  id: string;
  name: string;
  description: string;
  type: 'quiz' | 'puzzle' | 'arcade';
  difficulty: 'easy' | 'medium' | 'hard';
  reward: number;
  playedCount: number;
  userScore?: number;
}

interface GameResultPayload {
  score: number;
  timeSpent: number;
  playedAt: string;
  rewards: number;
}

interface UserGameStats {
  totalXP: number;
  gamesPlayed: number;
  lastPlayedAt?: string;
  history: Array<{ gameId: string; score: number; rewards: number; playedAt: string }>;
}

const GAMES: GameDefinition[] = [
  {
    id: 'varaha-arena',
    name: 'Varaha Arena',
    description: 'Premium learning game with words, code puzzles and life skills challenges.',
    type: 'quiz',
    difficulty: 'medium',
    reward: 150,
    playedCount: 0,
  },
  {
    id: 'word-duel',
    name: 'Word Duel',
    description: 'Battle with words, synonyms, meanings & more.',
    type: 'quiz',
    difficulty: 'easy',
    reward: 80,
    playedCount: 0,
  },
  {
    id: 'code-sprint',
    name: 'Code Sprint',
    description: 'Race through coding challenges and logic puzzles.',
    type: 'quiz',
    difficulty: 'medium',
    reward: 120,
    playedCount: 0,
  },
  {
    id: 'pitch-master',
    name: 'Pitch Master',
    description: 'Practice real-life communication scenarios with confidence.',
    type: 'quiz',
    difficulty: 'easy',
    reward: 90,
    playedCount: 0,
  },
];

const userGameStats = new Map<string, UserGameStats>();

const getUserStatsRecord = (userId: string): UserGameStats => {
  if (!userGameStats.has(userId)) {
    userGameStats.set(userId, {
      totalXP: 0,
      gamesPlayed: 0,
      history: [],
    });
  }

  return userGameStats.get(userId)!;
};

export const getUserGames = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json(errorResponse('Unauthorized')); 
      return;
    }

    const games = GAMES.map((game) => ({ ...game }));
    res.status(200).json(successResponse(games, 'Games fetched successfully'));
  } catch (error) {
    logger.error('Error fetching games:', error);
    next(error);
  }
};

export const playUserGame = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const gameId = Array.isArray(req.params.gameId) ? req.params.gameId[0] : req.params.gameId;
    if (!userId) {
      res.status(401).json(errorResponse('Unauthorized'));
      return;
    }

    const game = GAMES.find((item) => item.id === gameId);
    if (!game) {
      res.status(404).json(errorResponse('Game not found'));
      return;
    }

    game.playedCount += 1;
    res.status(200).json(successResponse(game, 'Game session started successfully'));
  } catch (error) {
    logger.error('Error starting game:', error);
    next(error);
  }
};

export const submitGameResult = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const gameId = Array.isArray(req.params.gameId) ? req.params.gameId[0] : req.params.gameId;
    const payload = req.body as GameResultPayload;

    if (!userId) {
      res.status(401).json(errorResponse('Unauthorized'));
      return;
    }

    const game = GAMES.find((item) => item.id === gameId);
    if (!game) {
      res.status(404).json(errorResponse('Game not found'));
      return;
    }

    if (typeof payload.score !== 'number' || typeof payload.timeSpent !== 'number' || typeof payload.rewards !== 'number') {
      res.status(400).json(errorResponse('Invalid result payload')); 
      return;
    }

    const stats = getUserStatsRecord(userId);
    stats.totalXP += payload.rewards;
    stats.gamesPlayed += 1;
    stats.lastPlayedAt = payload.playedAt;
    stats.history.push({ gameId, score: payload.score, rewards: payload.rewards, playedAt: payload.playedAt });

    game.playedCount += 1;
    game.userScore = payload.score;

    res.status(200).json(successResponse({ gameId, ...payload }, 'Game result submitted successfully'));
  } catch (error) {
    logger.error('Error submitting game result:', error);
    next(error);
  }
};

export const getUserGameStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json(errorResponse('Unauthorized'));
      return;
    }

    const stats = getUserStatsRecord(userId);
    const payload = {
      totalXP: stats.totalXP,
      gamesPlayed: stats.gamesPlayed,
      lastPlayedAt: stats.lastPlayedAt || null,
      history: stats.history.slice(-5).reverse(),
    };

    res.status(200).json(successResponse(payload, 'Game stats fetched successfully'));
  } catch (error) {
    logger.error('Error fetching game stats:', error);
    next(error);
  }
};
