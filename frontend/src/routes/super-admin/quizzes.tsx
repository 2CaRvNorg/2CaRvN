import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Plus,
  Search,
  Trash2,
  Eye,
  CheckCircle,
  Circle,
  SquareCheck,
} from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/super-admin/quizzes")({
  head: () => ({
    meta: [{ title: "Quiz Management — Super Admin — 2CaRvN" }],
  }),
  component: QuizManagement,
});

const quizzes = [
  {
    id: "QZ-001",
    title: "Physics Mid-Term Quiz",
    course: "Physics Fundamentals",
    questions: 40,
    duration: "45 min",
    submissions: 820,
    avgScore: 72,
    status: "Active",
  },
  {
    id: "QZ-002",
    title: "Math Chapter Test — Integration",
    course: "Advanced Mathematics",
    questions: 25,
    duration: "30 min",
    submissions: 1050,
    avgScore: 68,
    status: "Active",
  },
  {
    id: "QZ-003",
    title: "English Grammar Assessment",
    course: "English Literature",
    questions: 50,
    duration: "60 min",
    submissions: 1400,
    avgScore: 81,
    status: "Completed",
  },
  {
    id: "QZ-004",
    title: "CS — Data Structures Quiz",
    course: "Computer Science",
    questions: 20,
    duration: "25 min",
    submissions: 0,
    avgScore: 0,
    status: "Draft",
  },
];

const sampleQuestions = [
  {
    id: 1,
    text: "What is Newton's second law of motion?",
    type: "MCQ",
    options: ["F = ma", "E = mc²", "F = mv", "F = m/a"],
    correct: 0,
  },
  {
    id: 2,
    text: "The SI unit of force is:",
    type: "MCQ",
    options: ["Joule", "Newton", "Watt", "Pascal"],
    correct: 1,
  },
  {
    id: 3,
    text: "Which of the following is a scalar quantity?",
    type: "MCQ",
    options: ["Velocity", "Force", "Mass", "Acceleration"],
    correct: 2,
  },
];

const results = [
  {
    student: "Aarav Sharma",
    regNo: "STU-001",
    school: "DPS-014",
    score: 36,
    total: 40,
    percentage: 90,
    submittedAt: "Dec 18, 2024",
  },
  {
    student: "Priya Patel",
    regNo: "STU-023",
    school: "SXA-001",
    score: 32,
    total: 40,
    percentage: 80,
    submittedAt: "Dec 18, 2024",
  },
  {
    student: "Rahul Kumar",
    regNo: "STU-045",
    school: "DPS-014",
    score: 28,
    total: 40,
    percentage: 70,
    submittedAt: "Dec 17, 2024",
  },
  {
    student: "Sneha Gupta",
    regNo: "STU-078",
    school: "MCH-007",
    score: 35,
    total: 40,
    percentage: 87.5,
    submittedAt: "Dec 17, 2024",
  },
  {
    student: "Vikram Singh",
    regNo: "STU-102",
    school: "RIS-003",
    score: 22,
    total: 40,
    percentage: 55,
    submittedAt: "Dec 16, 2024",
  },
];

function QuizManagement() {
  const [search, setSearch] = useState("");
  const filtered = quizzes.filter((q) =>
    q.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quiz Management"
        description="Create quizzes, manage questions, and view student results."
      >
        <Dialog>
          <DialogTrigger asChild>
            <Button className="rounded-full bg-gradient-primary shadow-soft hover:opacity-95">
              <Plus className="mr-1 h-4 w-4" /> Create Quiz
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-display">
                Create New Quiz
              </DialogTitle>
              <DialogDescription>
                Set up a new quiz for a course.
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="quiz-title">Quiz Title</Label>
                <Input
                  id="quiz-title"
                  placeholder="e.g. Physics Mid-Term Quiz"
                  className="rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quiz-course">Course</Label>
                  <Input
                    id="quiz-course"
                    placeholder="Select course"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quiz-duration">Duration (min)</Label>
                  <Input
                    id="quiz-duration"
                    type="number"
                    placeholder="45"
                    className="rounded-xl"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quiz-instructions">Instructions</Label>
                <Textarea
                  id="quiz-instructions"
                  placeholder="Instructions for students..."
                  className="min-h-[80px] rounded-xl"
                />
              </div>
            </form>
            <DialogFooter>
              <Button variant="outline" className="rounded-full">
                Cancel
              </Button>
              <Button className="rounded-full bg-gradient-primary shadow-soft hover:opacity-95">
                Create Quiz
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <Tabs defaultValue="quizzes" className="space-y-6">
        <TabsList className="rounded-full">
          <TabsTrigger value="quizzes" className="rounded-full">
            Quiz List
          </TabsTrigger>
          <TabsTrigger value="questions" className="rounded-full">
            Manage Questions
          </TabsTrigger>
          <TabsTrigger value="results" className="rounded-full">
            View Results
          </TabsTrigger>
        </TabsList>

        {/* Quiz List */}
        <TabsContent value="quizzes" className="space-y-4">
          <Card className="rounded-2xl border-border/60 p-4">
            <div className="relative max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search quizzes…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-xl pl-9"
              />
            </div>
          </Card>
          <Card className="overflow-hidden rounded-2xl border-border/60">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quiz</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead className="text-right">Questions</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead className="text-right">Submissions</TableHead>
                  <TableHead className="text-right">Avg Score</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((quiz) => (
                  <TableRow key={quiz.id}>
                    <TableCell className="font-medium">{quiz.title}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {quiz.course}
                    </TableCell>
                    <TableCell className="text-right">
                      {quiz.questions}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {quiz.duration}
                    </TableCell>
                    <TableCell className="text-right">
                      {quiz.submissions.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {quiz.avgScore > 0 ? `${quiz.avgScore}%` : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`rounded-full ${
                          quiz.status === "Active"
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700"
                            : quiz.status === "Completed"
                              ? "border-blue-500/30 bg-blue-500/10 text-blue-700"
                              : "border-border bg-muted text-muted-foreground"
                        }`}
                      >
                        {quiz.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Manage Questions */}
        <TabsContent value="questions" className="space-y-4">
          <Card className="rounded-2xl border-border/60 p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-semibold">
                  Physics Mid-Term Quiz
                </h3>
                <p className="text-sm text-muted-foreground">
                  {sampleQuestions.length} questions · 45 min
                </p>
              </div>
              <Button
                variant="outline"
                className="rounded-full"
              >
                <Plus className="mr-1 h-4 w-4" /> Add Question
              </Button>
            </div>

            <div className="space-y-4">
              {sampleQuestions.map((q, i) => (
                <div
                  key={q.id}
                  className="rounded-xl border border-border/60 p-4"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <p className="text-sm font-medium">
                      <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {i + 1}
                      </span>
                      {q.text}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <RadioGroup defaultValue={String(q.correct)} className="space-y-2 pl-8">
                    {q.options.map((opt, j) => (
                      <div key={j} className="flex items-center gap-2">
                        <RadioGroupItem value={String(j)} id={`q${q.id}-o${j}`} />
                        <Label
                          htmlFor={`q${q.id}-o${j}`}
                          className={`text-sm ${j === q.correct ? "font-medium text-emerald-700" : "text-muted-foreground"}`}
                        >
                          {opt}
                          {j === q.correct && (
                            <CheckCircle className="ml-1 inline h-3.5 w-3.5 text-emerald-600" />
                          )}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* View Results */}
        <TabsContent value="results" className="space-y-4">
          <Card className="overflow-hidden rounded-2xl border-border/60">
            <div className="border-b border-border/60 px-6 py-4">
              <h3 className="font-display text-lg font-semibold">
                Physics Mid-Term Quiz — Results
              </h3>
              <p className="text-sm text-muted-foreground">
                {results.length} submissions
              </p>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Reg. No.</TableHead>
                  <TableHead>School</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                  <TableHead className="text-right">Percentage</TableHead>
                  <TableHead>Submitted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((r, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{r.student}</TableCell>
                    <TableCell>
                      <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                        {r.regNo}
                      </code>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {r.school}
                    </TableCell>
                    <TableCell className="text-right">
                      {r.score}/{r.total}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={`font-medium ${r.percentage >= 75 ? "text-emerald-700" : r.percentage >= 50 ? "text-amber-700" : "text-red-600"}`}
                      >
                        {r.percentage}%
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {r.submittedAt}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
