import { createFileRoute } from "@tanstack/react-router";
import { School, Users, UserCheck, BookOpen, Activity } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { StatCard } from "@/components/site/StatCard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/super-admin/")({
  head: () => ({
    meta: [{ title: "Dashboard — Super Admin — 2CaRvN" }],
  }),
  component: SuperAdminDashboard,
});

const chartData = [
  { month: "Jan", students: 420, courses: 12 },
  { month: "Feb", students: 580, courses: 15 },
  { month: "Mar", students: 710, courses: 18 },
  { month: "Apr", students: 890, courses: 22 },
  { month: "May", students: 1050, courses: 25 },
  { month: "Jun", students: 1240, courses: 28 },
];

const recentActivity = [
  {
    action: "New school registered",
    detail: "Delhi Public School — Branch 14",
    time: "2 min ago",
    type: "school" as const,
  },
  {
    action: "Course published",
    detail: "Advanced Mathematics — Grade 12",
    time: "15 min ago",
    type: "course" as const,
  },
  {
    action: "Video released",
    detail: "Physics Ch. 5 — Thermodynamics",
    time: "1 hour ago",
    type: "video" as const,
  },
  {
    action: "Quiz created",
    detail: "Chemistry Mid-Term — 40 Questions",
    time: "2 hours ago",
    type: "quiz" as const,
  },
  {
    action: "Student milestone",
    detail: "500 students completed Grade 10 Science",
    time: "3 hours ago",
    type: "student" as const,
  },
  {
    action: "New school registered",
    detail: "St. Xavier's Academy — Kolkata",
    time: "5 hours ago",
    type: "school" as const,
  },
];

function SuperAdminDashboard() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Overview of your entire learning platform."
      />

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Schools"
          value="148"
          icon={School}
          trend="+12 this month"
          trendUp
          accent
        />
        <StatCard
          label="Total Students"
          value="24,850"
          icon={Users}
          trend="+1,240 this month"
          trendUp
        />
        <StatCard
          label="Active Students"
          value="18,320"
          icon={UserCheck}
          trend="73.7% active"
          trendUp
        />
        <StatCard
          label="Total Courses"
          value="86"
          icon={BookOpen}
          trend="+6 new courses"
          trendUp
        />
      </div>

      {/* Course Statistics Chart */}
      <Card className="rounded-2xl border-border/60 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold">
              Course Statistics
            </h3>
            <p className="text-sm text-muted-foreground">
              Student enrollment and course growth over time
            </p>
          </div>
          <Badge
            variant="outline"
            className="rounded-full border-primary/20 bg-primary/10 text-primary"
          >
            Last 6 months
          </Badge>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                vertical={false}
              />
              <XAxis
                dataKey="month"
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
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "0.75rem",
                  fontSize: "0.875rem",
                }}
              />
              <Bar
                dataKey="students"
                fill="var(--primary)"
                radius={[6, 6, 0, 0]}
                name="Students"
              />
              <Bar
                dataKey="courses"
                fill="var(--primary-glow)"
                radius={[6, 6, 0, 0]}
                name="Courses"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="rounded-2xl border-border/60 p-6">
        <div className="mb-4">
          <h3 className="font-display text-lg font-semibold">
            Recent Activity
          </h3>
          <p className="text-sm text-muted-foreground">
            Latest updates across the platform
          </p>
        </div>
        <div className="space-y-1">
          {recentActivity.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-4 rounded-xl p-3 transition-colors hover:bg-accent/50"
            >
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                <Activity className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{item.action}</p>
                <p className="truncate text-sm text-muted-foreground">
                  {item.detail}
                </p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
