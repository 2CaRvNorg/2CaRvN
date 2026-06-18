import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BookOpen,
  TrendingUp,
  Bell,
  ClipboardList,
  ArrowRight,
  Clock,
  Play,
} from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { StatCard } from "@/components/site/StatCard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/student/")({
  head: () => ({
    meta: [{ title: "Dashboard — Student — 2CaRvN" }],
  }),
  component: StudentDashboard,
});

const assignedCourses = [
  {
    id: "crs-1",
    title: "Advanced Mathematics",
    instructor: "Dr. Rajesh Kumar",
    progress: 78,
    nextChapter: "Ch. 6: Differential Equations",
    accent: "from-primary-deep to-primary",
  },
  {
    id: "crs-2",
    title: "Physics Fundamentals",
    instructor: "Prof. Sunita Rao",
    progress: 45,
    nextChapter: "Ch. 4: Wave Motion",
    accent: "from-primary to-primary-glow",
  },
  {
    id: "crs-3",
    title: "English Literature",
    instructor: "Ms. Aparna Das",
    progress: 92,
    nextChapter: "Ch. 9: Modern Poetry",
    accent: "from-primary-glow to-primary",
  },
];

const notifications = [
  {
    message: "New video released: Thermodynamics Ch. 5",
    time: "10 min ago",
    unread: true,
  },
  {
    message: "Quiz available: Math Mid-Term",
    time: "1 hour ago",
    unread: true,
  },
  {
    message: "Certificate earned: English — Module 8",
    time: "Yesterday",
    unread: false,
  },
  {
    message: "Course updated: Physics — new resources added",
    time: "2 days ago",
    unread: false,
  },
];

const upcomingQuizzes = [
  {
    title: "Math Mid-Term Quiz",
    course: "Advanced Mathematics",
    dueDate: "Dec 22, 2024",
    questions: 40,
    duration: "45 min",
  },
  {
    title: "Physics Chapter Test",
    course: "Physics Fundamentals",
    dueDate: "Dec 25, 2024",
    questions: 25,
    duration: "30 min",
  },
];

function StudentDashboard() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Welcome back, Aarav 👋"
        description="Continue your learning journey."
      />

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Assigned Courses"
          value="4"
          icon={BookOpen}
          accent
        />
        <StatCard
          label="Overall Progress"
          value="74%"
          icon={TrendingUp}
          trend="+5% this week"
          trendUp
        />
        <StatCard
          label="Notifications"
          value="2"
          icon={Bell}
          trend="2 unread"
          trendUp
        />
        <StatCard
          label="Upcoming Quizzes"
          value="2"
          icon={ClipboardList}
          trend="Next: Dec 22"
          trendUp
        />
      </div>

      {/* Course cards + Notifications */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Assigned Courses */}
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">
              Continue Learning
            </h2>
            <Link
              to="/student/courses"
              className="text-sm font-medium text-primary hover:underline"
            >
              View all →
            </Link>
          </div>
          {assignedCourses.map((course) => (
            <Card
              key={course.id}
              className="group overflow-hidden rounded-2xl border-border/60 transition-all hover:-translate-y-0.5 hover:shadow-card-soft"
            >
              <div className="flex flex-col sm:flex-row">
                <div
                  className={`relative flex h-24 w-full items-center justify-center bg-gradient-to-br sm:h-auto sm:w-32 ${course.accent}`}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.3),transparent_50%)]" />
                  <Play className="h-8 w-8 text-primary-foreground" />
                </div>
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <h3 className="font-display text-base font-semibold">
                      {course.title}
                    </h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {course.instructor}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center gap-4">
                    <div className="flex-1">
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="text-muted-foreground">
                          {course.nextChapter}
                        </span>
                        <span className="font-medium">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                    <Button
                      size="sm"
                      className="shrink-0 rounded-full bg-gradient-primary shadow-soft hover:opacity-95"
                      asChild
                    >
                      <Link to="/student/learn/$courseId" params={{ courseId: course.id }}>
                        Continue
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Notifications */}
          <Card className="rounded-2xl border-border/60 p-5">
            <h3 className="mb-3 font-display text-base font-semibold">
              Notifications
            </h3>
            <div className="space-y-2">
              {notifications.map((n, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-accent/50"
                >
                  <div
                    className={`mt-1 h-2 w-2 shrink-0 rounded-full ${n.unread ? "bg-primary" : "bg-muted"}`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm">{n.message}</p>
                    <p className="text-xs text-muted-foreground">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Upcoming Quizzes */}
          <Card className="rounded-2xl border-border/60 p-5">
            <h3 className="mb-3 font-display text-base font-semibold">
              Upcoming Quizzes
            </h3>
            <div className="space-y-3">
              {upcomingQuizzes.map((q, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border/60 p-3"
                >
                  <p className="text-sm font-medium">{q.title}</p>
                  <p className="text-xs text-muted-foreground">{q.course}</p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {q.duration}
                    </span>
                    <span>{q.questions} questions</span>
                    <Badge
                      variant="outline"
                      className="ml-auto rounded-full border-primary/20 bg-primary/10 text-[10px] text-primary"
                    >
                      Due {q.dueDate}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
