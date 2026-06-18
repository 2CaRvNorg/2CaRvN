import { createFileRoute } from "@tanstack/react-router";
import {
  Lightbulb,
  TrendingUp,
  TrendingDown,
  Clock,
  Target,
  Brain,
  Zap,
  BookOpen,
} from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { StatCard } from "@/components/site/StatCard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/student/ai-insights")({
  head: () => ({
    meta: [{ title: "AI Learning Insights — Student — 2CaRvN" }],
  }),
  component: AiInsights,
});

const studyTimeData = [
  { day: "Mon", hours: 2.5 },
  { day: "Tue", hours: 1.8 },
  { day: "Wed", hours: 3.2 },
  { day: "Thu", hours: 2.1 },
  { day: "Fri", hours: 1.5 },
  { day: "Sat", hours: 4.0 },
  { day: "Sun", hours: 3.5 },
];

const strengths = [
  { topic: "Derivatives & Differentiation", score: 95, course: "Mathematics" },
  { topic: "Kinematics & Motion", score: 92, course: "Physics" },
  { topic: "Shakespeare Analysis", score: 88, course: "English" },
  { topic: "Data Structures", score: 85, course: "Computer Science" },
];

const weaknesses = [
  { topic: "Integration by Parts", score: 45, course: "Mathematics" },
  { topic: "Thermodynamics", score: 52, course: "Physics" },
  { topic: "Essay Writing", score: 58, course: "English" },
];

const recommendations = [
  {
    title: "Focus on Integration techniques",
    description:
      "Your quiz scores in integration are below average. Spend 30 min daily on practice problems from Module 3.",
    priority: "high" as const,
    icon: Target,
  },
  {
    title: "Review Thermodynamics chapter",
    description:
      "You haven't watched the Thermodynamics video yet. This topic appears frequently in exams.",
    priority: "high" as const,
    icon: BookOpen,
  },
  {
    title: "Maintain your momentum in Derivatives",
    description:
      "Excellent performance! Try the advanced practice set to push further.",
    priority: "medium" as const,
    icon: Zap,
  },
  {
    title: "Schedule regular study sessions",
    description:
      "Your study pattern shows inconsistency. Try studying at the same time daily for better retention.",
    priority: "low" as const,
    icon: Clock,
  },
];

function AiInsights() {
  const totalHours = studyTimeData.reduce((s, d) => s + d.hours, 0);

  return (
    <div className="space-y-8">
      <PageHeader
        title="AI Learning Insights"
        description="Personalized analysis of your learning patterns and performance."
      />

      {/* Overview Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Study Time (This Week)"
          value={`${totalHours.toFixed(1)}h`}
          icon={Clock}
          trend="+2.5h vs last week"
          trendUp
          accent
        />
        <StatCard
          label="Strongest Area"
          value="Derivatives"
          icon={TrendingUp}
          trend="95% quiz accuracy"
          trendUp
        />
        <StatCard
          label="Needs Improvement"
          value="Integration"
          icon={TrendingDown}
          trend="45% quiz accuracy"
          trendUp={false}
        />
        <StatCard
          label="Learning Streak"
          value="12 days"
          icon={Zap}
          trend="Personal best!"
          trendUp
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Study Time Chart */}
        <Card className="rounded-2xl border-border/60 p-6">
          <div className="mb-4">
            <h3 className="font-display text-lg font-semibold">
              Study Time Distribution
            </h3>
            <p className="text-sm text-muted-foreground">
              Hours studied per day this week
            </p>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studyTimeData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  stroke="var(--muted-foreground)"
                />
                <YAxis
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  stroke="var(--muted-foreground)"
                  unit="h"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "0.75rem",
                    fontSize: "0.875rem",
                  }}
                  formatter={(value: number) => [`${value}h`, "Study Time"]}
                />
                <Bar
                  dataKey="hours"
                  fill="var(--primary)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* AI Recommendations */}
        <Card className="rounded-2xl border-border/60 p-6">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
              <Brain className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold">
                AI Recommendations
              </h3>
              <p className="text-xs text-muted-foreground">
                Personalized suggestions to improve
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {recommendations.map((rec, i) => (
              <div
                key={i}
                className="rounded-xl border border-border/60 p-3 transition-colors hover:bg-accent/30"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                    <rec.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{rec.title}</p>
                      <Badge
                        variant="outline"
                        className={`rounded-full text-[10px] ${
                          rec.priority === "high"
                            ? "border-red-500/30 bg-red-500/10 text-red-700"
                            : rec.priority === "medium"
                              ? "border-amber-500/30 bg-amber-500/10 text-amber-700"
                              : "border-border bg-muted text-muted-foreground"
                        }`}
                      >
                        {rec.priority}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {rec.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Strengths */}
        <Card className="rounded-2xl border-border/60 p-6">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            <h3 className="font-display text-lg font-semibold">
              Your Strengths
            </h3>
          </div>
          <div className="space-y-3">
            {strengths.map((s) => (
              <div
                key={s.topic}
                className="flex items-center gap-4 rounded-xl p-2"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{s.topic}</p>
                  <p className="text-xs text-muted-foreground">{s.course}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={s.score} className="h-2 w-20" />
                  <span className="text-sm font-medium text-emerald-600">
                    {s.score}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Weaknesses */}
        <Card className="rounded-2xl border-border/60 p-6">
          <div className="mb-4 flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-amber-600" />
            <h3 className="font-display text-lg font-semibold">
              Needs Improvement
            </h3>
          </div>
          <div className="space-y-3">
            {weaknesses.map((w) => (
              <div
                key={w.topic}
                className="flex items-center gap-4 rounded-xl p-2"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{w.topic}</p>
                  <p className="text-xs text-muted-foreground">{w.course}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={w.score} className="h-2 w-20" />
                  <span className="text-sm font-medium text-amber-600">
                    {w.score}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
