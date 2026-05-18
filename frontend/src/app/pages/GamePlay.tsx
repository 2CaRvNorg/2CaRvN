import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { gameService } from '@lib/services';
import { Button } from '@components/ui/button';
import { Card } from '@components/ui/card';
import VarahaArena from './VarahaArena';

export default function GamePlay() {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStartGame = () => {
    setGameStarted(true);
  };

  const handleSubmitScore = async () => {
    if (!gameId) return;

    setIsSubmitting(true);
    try {
      const result = await gameService.submitGameResult(gameId, {
        score,
        timeSpent,
        playedAt: new Date().toISOString(),
        rewards: score * 10,
      });
      alert('Game result submitted! You earned ' + result.rewards + ' points!');
      navigate('/games');
    } catch (error) {
      alert('Failed to submit game result: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGameFinish = (finalScore: number, duration: number) => {
    setScore(finalScore);
    setTimeSpent(duration);
  };

  const isPremiumArena = gameId === 'varaha-arena';

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Game</h1>
          <Button variant="outline" onClick={() => navigate('/games')}>
            Back to Games
          </Button>
        </div>

        {isPremiumArena ? (
          <VarahaArena onFinish={handleGameFinish} />
        ) : (
          <Card className="p-8">
            {!gameStarted ? (
              <div className="text-center py-12">
                <h2 className="text-2xl font-semibold mb-4">Ready to Play?</h2>
                <p className="text-muted-foreground mb-8">
                  Test your skills and earn rewards! Click below to begin.
                </p>
                <Button size="lg" onClick={handleStartGame}>
                  Start Game
                </Button>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="text-center py-12 bg-muted rounded-lg">
                  <p className="text-muted-foreground mb-4">Game Area</p>
                  <p className="text-4xl font-bold text-primary">{score}</p>
                  <p className="text-muted-foreground mt-2">Current Score</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setScore(score + 10)}
                    disabled={isSubmitting}
                  >
                    +10 Points
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setScore(score + 50)}
                    disabled={isSubmitting}
                  >
                    +50 Points
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="secondary"
                    onClick={() => setTimeSpent(timeSpent + 30)}
                    disabled={isSubmitting}
                  >
                    +30s Time
                  </Button>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Time: {timeSpent}s</p>
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={handleSubmitScore}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Score'}
                </Button>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
