import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { examService } from '@lib/services';
import { Button } from '@components/ui/button';
import { Card } from '@components/ui/card';
import type { Exam } from '@app-types/index';

export default function Exams() {
  const navigate = useNavigate();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const data = await examService.getExams();
        setExams(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load exams');
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading exams...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Exams</h1>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-lg">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {exams.map((exam) => (
            <Card key={exam.id} className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-2">{exam.title}</h3>
              <p className="text-muted-foreground mb-4 line-clamp-2">{exam.description}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6 text-sm">
                <div>
                  <p className="text-muted-foreground">Duration</p>
                  <p className="font-semibold">{exam.timeLimitMinutes} min</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Questions</p>
                  <p className="font-semibold">{exam.questions?.length || 0}</p>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <p className="text-muted-foreground">Pass Score</p>
                  <p className="font-semibold">{exam.passingScore}%</p>
                </div>
              </div>
              <Button
                className="w-full"
                onClick={() => navigate(`/exams/${exam.id}`)}
              >
                Take Exam
              </Button>
            </Card>
          ))}
        </div>

        {exams.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No exams available</p>
          </div>
        )}
      </div>
    </div>
  );
}
