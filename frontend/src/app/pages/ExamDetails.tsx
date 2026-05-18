import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { examService } from '@lib/services';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import type { Exam } from '@app-types/index';

export default function ExamDetails() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        if (!examId) return;
        const data = await examService.getExam(examId);
        setExam(data);
      } catch (e) {
        console.error('Failed to load exam', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [examId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!exam) return <div className="min-h-screen flex items-center justify-center">Exam not found</div>;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{exam.title}</h1>
          <Button variant="ghost" onClick={() => navigate(-1)}>Back</Button>
        </div>

        <Card>
          <p className="mb-4">{exam.description}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500">Duration</p>
              <p className="font-semibold">{exam.timeLimitMinutes} minutes</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Questions</p>
              <p className="font-semibold">{exam.questions?.length || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Pass Score</p>
              <p className="font-semibold">{exam.passingScore}%</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={() => navigate(`/exams/${exam.id}`)}>Start / Attempt</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
