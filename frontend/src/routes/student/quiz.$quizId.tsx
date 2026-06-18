import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Flag,
  CheckCircle,
  Award,
  RotateCcw,
} from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/student/quiz/$quizId")({
  head: () => ({
    meta: [{ title: "Quiz — Student — 2CaRvN" }],
  }),
  component: QuizInterface,
});

const questions = [
  {
    id: 1,
    text: "What is the derivative of sin(x)?",
    options: ["cos(x)", "-cos(x)", "sin(x)", "-sin(x)"],
    correct: 0,
  },
  {
    id: 2,
    text: "The integral of 1/x dx is:",
    options: ["x", "ln|x| + C", "1/x² + C", "e^x + C"],
    correct: 1,
  },
  {
    id: 3,
    text: "Which rule is used to differentiate f(g(x))?",
    options: ["Product Rule", "Quotient Rule", "Chain Rule", "Power Rule"],
    correct: 2,
  },
  {
    id: 4,
    text: "The value of ∫₀¹ x² dx is:",
    options: ["1/2", "1/3", "1/4", "1"],
    correct: 1,
  },
  {
    id: 5,
    text: "If f'(x) = 0 at x = a, then x = a is a:",
    options: [
      "Point of inflection",
      "Critical point",
      "Maximum point",
      "Minimum point",
    ],
    correct: 1,
  },
  {
    id: 6,
    text: "The second derivative test determines:",
    options: [
      "Velocity",
      "Concavity",
      "Area",
      "Slope",
    ],
    correct: 1,
  },
  {
    id: 7,
    text: "L'Hôpital's rule applies to which form?",
    options: ["0/0", "1/0", "∞ × 0", "0 × 1"],
    correct: 0,
  },
  {
    id: 8,
    text: "The Fundamental Theorem of Calculus connects:",
    options: [
      "Algebra and Geometry",
      "Differentiation and Integration",
      "Trigonometry and Calculus",
      "Limits and Series",
    ],
    correct: 1,
  },
];

function QuizInterface() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [flagged, setFlagged] = useState<Set<number>>(new Set());

  const handleAnswer = (value: string) => {
    setAnswers((prev) => ({ ...prev, [currentQ]: value }));
  };

  const toggleFlag = () => {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(currentQ)) next.delete(currentQ);
      else next.add(currentQ);
      return next;
    });
  };

  const score = submitted
    ? questions.reduce(
        (s, q, i) => (answers[i] === String(q.correct) ? s + 1 : s),
        0,
      )
    : 0;

  const percentage = Math.round((score / questions.length) * 100);

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg space-y-6 py-8">
        <Card className="overflow-hidden rounded-2xl border-border/60">
          <div className="bg-gradient-primary p-8 text-center text-primary-foreground">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.2),transparent_50%)]" />
            <Award className="mx-auto h-16 w-16" />
            <h1 className="mt-4 font-display text-3xl font-bold">
              Quiz Complete!
            </h1>
            <p className="mt-2 text-primary-foreground/80">
              Math Mid-Term Quiz
            </p>
          </div>
          <div className="p-8 text-center">
            <div className="mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-full border-4 border-primary/20">
              <span
                className={`font-display text-4xl font-bold ${percentage >= 75 ? "text-emerald-600" : percentage >= 50 ? "text-amber-600" : "text-red-600"}`}
              >
                {percentage}%
              </span>
            </div>
            <p className="text-lg font-medium">
              You scored {score} out of {questions.length}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {percentage >= 75
                ? "Excellent work! You've mastered this topic."
                : percentage >= 50
                  ? "Good effort! Review the topics you missed."
                  : "Keep practicing! Review the material and try again."}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <Card className="rounded-xl border-border/60 p-4">
                <p className="text-sm text-muted-foreground">Correct</p>
                <p className="font-display text-2xl font-bold text-emerald-600">
                  {score}
                </p>
              </Card>
              <Card className="rounded-xl border-border/60 p-4">
                <p className="text-sm text-muted-foreground">Incorrect</p>
                <p className="font-display text-2xl font-bold text-red-500">
                  {questions.length - score}
                </p>
              </Card>
            </div>

            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                className="flex-1 rounded-full"
                onClick={() => {
                  setSubmitted(false);
                  setAnswers({});
                  setCurrentQ(0);
                  setFlagged(new Set());
                }}
              >
                <RotateCcw className="mr-1 h-4 w-4" /> Retake Quiz
              </Button>
              <Button className="flex-1 rounded-full bg-gradient-primary shadow-soft hover:opacity-95">
                Continue Learning
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const q = questions[currentQ];

  return (
    <div className="space-y-6">
      {/* Header with Timer */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Math Mid-Term Quiz
          </h1>
          <p className="text-sm text-muted-foreground">
            Question {currentQ + 1} of {questions.length}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Card className="flex items-center gap-2 rounded-full border-border/60 px-4 py-2">
            <Clock className="h-4 w-4 text-primary" />
            <span className="font-display text-lg font-bold tabular-nums">
              32:45
            </span>
          </Card>
          <Button
            variant="outline"
            size="sm"
            className={`rounded-full ${flagged.has(currentQ) ? "border-amber-500 bg-amber-500/10 text-amber-700" : ""}`}
            onClick={toggleFlag}
          >
            <Flag className="mr-1 h-3.5 w-3.5" />
            {flagged.has(currentQ) ? "Flagged" : "Flag"}
          </Button>
        </div>
      </div>

      {/* Progress */}
      <Progress
        value={((currentQ + 1) / questions.length) * 100}
        className="h-2"
      />

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Question */}
        <div className="lg:col-span-3">
          <Card className="rounded-2xl border-border/60 p-6">
            <div className="mb-6">
              <Badge
                variant="outline"
                className="mb-3 rounded-full border-primary/20 bg-primary/10 text-primary"
              >
                Question {currentQ + 1}
              </Badge>
              <h2 className="font-display text-xl font-semibold">
                {q.text}
              </h2>
            </div>

            <RadioGroup
              value={answers[currentQ] ?? ""}
              onValueChange={handleAnswer}
              className="space-y-3"
            >
              {q.options.map((opt, i) => (
                <Label
                  key={i}
                  htmlFor={`option-${i}`}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all ${
                    answers[currentQ] === String(i)
                      ? "border-primary bg-primary/5"
                      : "border-border/60 hover:border-primary/40 hover:bg-accent/30"
                  }`}
                >
                  <RadioGroupItem value={String(i)} id={`option-${i}`} />
                  <span className="text-sm">{opt}</span>
                </Label>
              ))}
            </RadioGroup>

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-between">
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => setCurrentQ((p) => Math.max(0, p - 1))}
                disabled={currentQ === 0}
              >
                <ChevronLeft className="mr-1 h-4 w-4" /> Previous
              </Button>
              {currentQ === questions.length - 1 ? (
                <Button
                  className="rounded-full bg-gradient-primary shadow-soft hover:opacity-95"
                  onClick={() => setSubmitted(true)}
                >
                  <CheckCircle className="mr-1 h-4 w-4" /> Submit Quiz
                </Button>
              ) : (
                <Button
                  className="rounded-full bg-gradient-primary shadow-soft hover:opacity-95"
                  onClick={() =>
                    setCurrentQ((p) => Math.min(questions.length - 1, p + 1))
                  }
                >
                  Next <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              )}
            </div>
          </Card>
        </div>

        {/* Question Navigation */}
        <div>
          <Card className="sticky top-20 rounded-2xl border-border/60 p-4">
            <h3 className="mb-3 text-sm font-semibold">Questions</h3>
            <div className="grid grid-cols-4 gap-2">
              {questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentQ(i)}
                  className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                    i === currentQ
                      ? "bg-gradient-primary text-primary-foreground shadow-soft"
                      : answers[i] !== undefined
                        ? "bg-emerald-500/15 text-emerald-700"
                        : flagged.has(i)
                          ? "bg-amber-500/15 text-amber-700"
                          : "bg-muted text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-emerald-500/15" />
                Answered ({Object.keys(answers).length})
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-amber-500/15" />
                Flagged ({flagged.size})
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-muted" />
                Unanswered (
                {questions.length - Object.keys(answers).length})
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
