import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useNavigate } from 'react-router-dom';
import api from '@lib/api';

interface Question {
  questionText: string;
  options: string[];
  correctAnswer: string;
}

export function CreateExam() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [examData, setExamData] = useState({
    title: '',
    description: '',
    passingScore: 70,
    timeLimitMinutes: 60,
    maxAttempts: 2,
    category: 'general' as 'general' | 'weekly',
    weekNumber: 1,
  });

  const [questions, setQuestions] = useState<Question[]>(
    Array(20).fill(null).map(() => ({
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: '',
    }))
  );

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const updateExamData = (field: string, value: any) => {
    setExamData({ ...examData, [field]: value });
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuestions(newQuestions);
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const handleSubmit = async () => {
    // Validate that all questions have text and a correct answer
    const invalidQuestions = questions.filter(
      (q) => !q.questionText || !q.correctAnswer || q.options.some((o) => !o)
    );

    if (invalidQuestions.length > 0) {
      alert('Please complete all 20 questions before submitting.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/exams', {
        ...examData,
        questions,
      });
      alert('Exam created successfully!');
      navigate('/teacher-dashboard');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create exam');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F4] px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/teacher-dashboard')}
          className="flex items-center gap-2 text-[#757575] mb-8 hover:text-[#1a1a1a]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1a1a1a]">Create New Exam</h1>
          <p className="text-[#757575]">Configure your test and add questions</p>
        </div>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setStep(1)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              step === 1 ? 'bg-[#D4AF37] text-white shadow-lg' : 'bg-white text-[#757575] border border-[#e8e4dc]'
            }`}
          >
            1. General Info
          </button>
          <button
            onClick={() => setStep(2)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              step === 2 ? 'bg-[#D4AF37] text-white shadow-lg' : 'bg-white text-[#757575] border border-[#e8e4dc]'
            }`}
          >
            2. Questions (20)
          </button>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <Card>
                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    label="Exam Title"
                    placeholder="e.g. Weekly Quiz #1"
                    value={examData.title}
                    onChange={(e) => updateExamData('title', e.target.value)}
                  />
                  <div>
                    <label className="block text-sm text-[#1a1a1a] mb-2">Category</label>
                    <select
                      className="w-full px-4 py-3 bg-white rounded-[16px] border-2 border-[#e8e4dc] focus:border-[#D4AF37] focus:outline-none"
                      value={examData.category}
                      onChange={(e) => updateExamData('category', e.target.value)}
                    >
                      <option value="general">General</option>
                      <option value="weekly">Weekly (Premium Only)</option>
                    </select>
                  </div>
                  {examData.category === 'weekly' && (
                    <Input
                      label="Week Number"
                      type="number"
                      value={examData.weekNumber}
                      onChange={(e) => updateExamData('weekNumber', parseInt(e.target.value))}
                    />
                  )}
                  <Input
                    label="Passing Score (%)"
                    type="number"
                    value={examData.passingScore}
                    onChange={(e) => updateExamData('passingScore', parseInt(e.target.value))}
                  />
                  <Input
                    label="Time Limit (Minutes)"
                    type="number"
                    value={examData.timeLimitMinutes}
                    onChange={(e) => updateExamData('timeLimitMinutes', parseInt(e.target.value))}
                  />
                  <Input
                    label="Max Attempts"
                    type="number"
                    value={examData.maxAttempts}
                    onChange={(e) => updateExamData('maxAttempts', parseInt(e.target.value))}
                  />
                </div>
                <div className="mt-6">
                  <label className="block text-sm text-[#1a1a1a] mb-2">Description</label>
                  <textarea
                    className="w-full px-4 py-3 bg-white rounded-[16px] border-2 border-[#e8e4dc] focus:border-[#D4AF37] focus:outline-none h-32 resize-none"
                    placeholder="Briefly describe what this exam covers"
                    value={examData.description}
                    onChange={(e) => updateExamData('description', e.target.value)}
                  />
                </div>
              </Card>
              <div className="flex justify-end">
                <Button onClick={() => setStep(2)}>Next: Add Questions →</Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="grid lg:grid-cols-4 gap-6">
                {/* Question Sidebar */}
                <div className="lg:col-span-1 space-y-2">
                  <p className="text-sm font-medium text-[#757575] mb-4">Question List</p>
                  <div className="grid grid-cols-5 lg:grid-cols-4 gap-2">
                    {questions.map((q, idx) => {
                      const isComplete = q.questionText && q.correctAnswer && q.options.every(o => o);
                      return (
                        <button
                          key={idx}
                          onClick={() => setCurrentQuestionIndex(idx)}
                          className={`w-full aspect-square rounded-xl text-sm font-bold transition-all border-2 ${
                            idx === currentQuestionIndex
                              ? 'border-[#D4AF37] bg-[#D4AF37] text-white shadow-md'
                              : isComplete
                              ? 'border-[#4ade80] bg-[#4ade80]/10 text-[#1a1a1a]'
                              : 'border-[#e8e4dc] bg-white text-[#757575]'
                          }`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Question Editor */}
                <div className="lg:col-span-3">
                  <Card>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold">Question {currentQuestionIndex + 1}</h3>
                      <span className="text-xs text-[#D4AF37] uppercase font-bold tracking-wider">
                        {currentQuestionIndex + 1} of 20
                      </span>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm text-[#1a1a1a] mb-2 font-medium">Question Text</label>
                        <textarea
                          className="w-full px-4 py-3 bg-[#FBF9F4] rounded-[16px] border-2 border-[#e8e4dc] focus:border-[#D4AF37] focus:outline-none h-24 resize-none"
                          placeholder="Type your question here..."
                          value={questions[currentQuestionIndex].questionText}
                          onChange={(e) => updateQuestion(currentQuestionIndex, 'questionText', e.target.value)}
                        />
                      </div>

                      <div className="space-y-4">
                        <label className="block text-sm text-[#1a1a1a] mb-2 font-medium">Options (Select the correct one)</label>
                        {questions[currentQuestionIndex].options.map((option, oIdx) => (
                          <div key={oIdx} className="flex gap-4 items-center">
                            <input
                              type="radio"
                              name={`correct-${currentQuestionIndex}`}
                              checked={questions[currentQuestionIndex].correctAnswer === option && option !== ''}
                              onChange={() => updateQuestion(currentQuestionIndex, 'correctAnswer', option)}
                              className="w-5 h-5 accent-[#D4AF37]"
                            />
                            <div className="flex-1">
                              <Input
                                placeholder={`Option ${oIdx + 1}`}
                                value={option}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  updateOption(currentQuestionIndex, oIdx, val);
                                  // If this was the correct answer, update the reference
                                  if (questions[currentQuestionIndex].correctAnswer === option) {
                                    updateQuestion(currentQuestionIndex, 'correctAnswer', val);
                                  }
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-6 flex justify-between border-t border-[#e8e4dc]">
                        <Button
                          variant="ghost"
                          disabled={currentQuestionIndex === 0}
                          onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                        >
                          Previous
                        </Button>
                        
                        {currentQuestionIndex < 19 ? (
                          <Button
                            onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                          >
                            Next Question
                          </Button>
                        ) : (
                          <Button
                            onClick={handleSubmit}
                            disabled={loading}
                          >
                            {loading ? 'Creating...' : 'Finalize & Create Exam'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
