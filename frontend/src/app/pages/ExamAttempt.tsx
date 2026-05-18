import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { examService } from '@lib/services';
import { Button } from '@components/Button';
import { Card } from '@components/Card';
import { useAuth } from '@hooks/useAuth';
import type { Exam } from '@app-types/index';
import { motion } from 'motion/react';

export default function ExamAttempt() {
  const { examId } = useParams<{ examId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [exam, setExam] = useState<Exam | null>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [examStarted, setExamStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [startedAt, setStartedAt] = useState<string | null>(null);
  const [view, setView] = useState<'preview' | 'submissions'>('preview');

  const isteacher = ['admin', 'teacher', 'teacher'].includes(user?.role || '');

  useEffect(() => {
    const fetchData = async () => {
      if (!examId) return;
      try {
        const examData = await examService.getExam(examId);
        setExam(examData);
        
        if (isteacher) {
          const submissionData = await examService.getExamSubmissions(examId);
          setSubmissions(submissionData);
        }
      } catch (error) {
        console.error('Failed to fetch exam data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [examId, isteacher]);

  const handleStartExam = () => {
    setExamStarted(true);
    setStartedAt(new Date().toISOString());
  };

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setAnswers({
      ...answers,
      [questionId]: answer,
    });
  };

  const handleNext = () => {
    if (exam && currentQuestion < exam.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitExam = async () => {
    if (!examId || !exam || !startedAt) return;

    setIsSubmitting(true);
    try {
      // Format answers for the backend: array of { question_id, selectedAnswer }
      const formattedAnswers = exam.questions.map((q) => ({
        question_id: q._id,
        selectedAnswer: answers[q._id] || '',
      })).filter(a => a.selectedAnswer !== '');

      if (formattedAnswers.length === 0) {
        alert('Please answer at least one question.');
        setIsSubmitting(false);
        return;
      }

      await examService.submitExam(examId, {
        examId,
        answers: formattedAnswers,
        startedAt,
        submittedAt: new Date().toISOString(),
      });
      
      alert('Exam submitted successfully!');
      navigate('/exams');
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Unknown error';
      alert('Failed to submit exam: ' + message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading exam...</p>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-xl mb-4">Exam not found.</p>
        <Button onClick={() => navigate('/exams')}>Back to Exams</Button>
      </div>
    );
  }

  const question = exam.questions[currentQuestion];
  const isAnswered = !!answers[question?._id];

  if (isteacher) {
    return (
      <div className="min-h-screen bg-[#FBF9F4] p-4 sm:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] font-bold uppercase rounded-full border border-[#D4AF37]/20">
                  teacher View
                </span>
                <span className="text-[#757575] text-xs">ID: {exam.id}</span>
              </div>
              <h1 className="text-3xl font-bold text-[#1a1a1a]">{exam.title}</h1>
            </div>
            <Button variant="ghost" onClick={() => navigate(-1)} className="text-[#1a1a1a]">
              ← Back to Dashboard
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-[#e8e4dc]/30 p-1 rounded-xl mb-8 w-fit">
            <button
              onClick={() => setView('preview')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                view === 'preview' ? 'bg-white text-[#1a1a1a] shadow-sm' : 'text-[#757575] hover:text-[#1a1a1a]'
              }`}
            >
              Exam Questions
            </button>
            <button
              onClick={() => setView('submissions')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                view === 'submissions' ? 'bg-white text-[#1a1a1a] shadow-sm' : 'text-[#757575] hover:text-[#1a1a1a]'
              }`}
            >
              Student Attempts ({submissions.length})
            </button>
          </div>

          {view === 'preview' ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <Card className="p-4 border-[#e8e4dc]">
                  <p className="text-[10px] text-[#757575] uppercase mb-1">Time Limit</p>
                  <p className="text-xl font-bold text-[#1a1a1a]">{exam.timeLimitMinutes} Minutes</p>
                </Card>
                <Card className="p-4 border-[#e8e4dc]">
                  <p className="text-[10px] text-[#757575] uppercase mb-1">Total Questions</p>
                  <p className="text-xl font-bold text-[#1a1a1a]">{exam.questions.length}</p>
                </Card>
                <Card className="p-4 border-[#e8e4dc]">
                  <p className="text-[10px] text-[#757575] uppercase mb-1">Passing Score</p>
                  <p className="text-xl font-bold text-green-600">{exam.passingScore}%</p>
                </Card>
              </div>

              <h2 className="text-xl font-bold text-[#1a1a1a] mb-4">Question List</h2>
              {exam.questions.map((q, i) => (
                <motion.div
                  key={q._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="p-6 border-[#e8e4dc] hover:border-[#D4AF37]/30 transition-colors">
                    <div className="flex gap-4">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center text-sm font-bold">
                        {i + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-lg font-medium text-[#1a1a1a] mb-4">{q.questionText}</p>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {q.options.map((opt, idx) => (
                            <div 
                              key={idx}
                              className={`p-3 rounded-xl border text-sm flex items-center gap-3 ${
                                opt === q.correctAnswer 
                                  ? 'bg-green-50 border-green-200 text-green-800' 
                                  : 'bg-[#FBF9F4] border-[#e8e4dc] text-[#757575]'
                              }`}
                            >
                              <span className="w-5 h-5 rounded-full border flex items-center justify-center text-[10px]">
                                {String.fromCharCode(65 + idx)}
                              </span>
                              {opt}
                              {opt === q.correctAnswer && <span className="ml-auto text-xs font-bold uppercase">Correct</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="p-0 border-[#e8e4dc] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#FBF9F4] border-b border-[#e8e4dc]">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-[#757575] uppercase">Student</th>
                      <th className="px-6 py-4 text-xs font-bold text-[#757575] uppercase">Date</th>
                      <th className="px-6 py-4 text-xs font-bold text-[#757575] uppercase">Score</th>
                      <th className="px-6 py-4 text-xs font-bold text-[#757575] uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e8e4dc]">
                    {submissions.map((sub, i) => (
                      <tr key={i} className="hover:bg-[#FBF9F4]/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-[#1a1a1a]">{sub.user_id?.name || 'Unknown User'}</p>
                          <p className="text-xs text-[#757575]">{sub.user_id?.email || '-'}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-[#757575]">
                          {new Date(sub.submittedAt).toLocaleDateString()}
                          <br />
                          <span className="text-[10px]">{new Date(sub.submittedAt).toLocaleTimeString()}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-lg font-bold text-[#1a1a1a]">{sub.score}%</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                            sub.status === 'passed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {sub.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {submissions.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-[#757575]">
                          No attempts recorded yet for this exam.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF9F4] p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#1a1a1a]">{exam.title}</h1>
          <Button variant="ghost" onClick={() => navigate(-1)} className="text-[#1a1a1a]">
            Back
          </Button>
        </div>

        <Card className="p-8 border-[#e8e4dc]">
          {!examStarted ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-[#D4AF37]/10 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                📝
              </div>
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-4">Ready to Start?</h2>
              <div className="flex justify-center gap-8 mb-8">
                <div className="text-center">
                  <p className="text-[10px] text-[#757575] uppercase">Questions</p>
                  <p className="text-xl font-bold">{exam.questions.length}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-[#757575] uppercase">Duration</p>
                  <p className="text-xl font-bold">{exam.timeLimitMinutes}m</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-[#757575] uppercase">Passing</p>
                  <p className="text-xl font-bold">{exam.passingScore}%</p>
                </div>
              </div>
              <Button size="lg" onClick={handleStartExam} className="px-12 h-14 text-lg">
                Start Examination
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Progress */}
              <div className="flex justify-between items-center">
                <p className="text-sm font-bold text-[#1a1a1a]">
                  Question {currentQuestion + 1} <span className="text-[#757575] font-normal">of {exam.questions.length}</span>
                </p>
                <div className="w-32 h-1.5 bg-[#e8e4dc] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[#1a1a1a]"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${((currentQuestion + 1) / exam.questions.length) * 100}%`,
                    }}
                  ></motion.div>
                </div>
              </div>

              {/* Question */}
              {question && (
                <motion.div
                  key={question._id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h2 className="text-xl font-bold text-[#1a1a1a] mb-8">{question.questionText}</h2>

                  <div className="space-y-3">
                    {question.options.map((option, idx) => (
                      <label
                        key={idx}
                        className={`flex items-center p-4 border rounded-2xl cursor-pointer transition-all ${
                          answers[question._id] === option 
                            ? 'bg-[#1a1a1a] border-[#1a1a1a] text-white' 
                            : 'bg-white border-[#e8e4dc] hover:border-[#1a1a1a] text-[#1a1a1a]'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${question._id}`}
                          value={option}
                          checked={answers[question._id] === option}
                          onChange={() => handleAnswerSelect(question._id, option)}
                          className="sr-only"
                        />
                        <span className={`w-8 h-8 rounded-lg border flex items-center justify-center text-sm font-bold mr-4 transition-colors ${
                          answers[question._id] === option ? 'bg-white/20 border-white/30' : 'bg-[#FBF9F4] border-[#e8e4dc]'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="font-medium">{option}</span>
                      </label>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Navigation */}
              <div className="flex justify-between gap-4 pt-8 border-t border-[#e8e4dc]">
                <Button
                  variant="ghost"
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  className="text-[#1a1a1a]"
                >
                  ← Previous
                </Button>

                {currentQuestion === exam.questions.length - 1 ? (
                  <Button
                    onClick={handleSubmitExam}
                    disabled={isSubmitting || !isAnswered}
                    className="bg-[#D4AF37] hover:bg-[#b8962d] text-white px-8"
                  >
                    {isSubmitting ? 'Submitting...' : 'Finish Exam'}
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    disabled={!isAnswered}
                    className="bg-[#1a1a1a] hover:bg-[#2d2416] text-white px-8"
                  >
                    Next Question →
                  </Button>
                )}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
