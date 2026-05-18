import { Router } from 'express';
import { requireAuth } from '../middlewares/auth';
import { getUserGames, playUserGame, submitGameResult, getUserGameStats } from '../controllers/game.controller';

const router = Router();

router.use(requireAuth);

router.get('/', getUserGames);
router.post('/:gameId/play', playUserGame);
router.post('/:gameId/result', submitGameResult);
router.get('/stats', getUserGameStats);

export default router;
