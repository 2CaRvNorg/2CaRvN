import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gameService } from '@lib/services';
import { Button } from '@components/ui/button';
import { Card } from '@components/ui/card';
import type { Game } from '@app-types/index';

export default function Games() {
  const navigate = useNavigate();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const data = await gameService.getGames();
        setGames(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load games');
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const premiumGame: Game = {
    id: 'varaha-arena',
    name: '2carvn Arena',
    description: 'Premium learning game with words, code puzzles and life skills challenges.',
    type: 'quiz',
    difficulty: 'medium',
    reward: 150,
    playedCount: 0,
  };

  const allGames = [premiumGame, ...games.filter((game) => game.id !== premiumGame.id)];

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading games...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Games</h1>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-lg">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {allGames.map((game) => (
            <Card key={game.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{game.name}</h3>
                <p className="text-muted-foreground mb-4 line-clamp-2">{game.description}</p>
                <div className="flex justify-between items-center mb-4 text-sm">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full capitalize">
                    {game.difficulty}
                  </span>
                  <span className="text-muted-foreground">{game.playedCount} plays</span>
                </div>
                <div className="mb-4">
                  <div className="text-lg font-semibold text-primary">{game.reward} pts</div>
                  {game.userScore && (
                    <p className="text-sm text-muted-foreground">Your score: {game.userScore}</p>
                  )}
                </div>
                <Button
                  className="w-full"
                  onClick={() => navigate(`/games/${game.id}`)}
                >
                  Play Now
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {games.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No games available yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
