import { createFileRoute } from "@tanstack/react-router";
import { Users, UserCheck, UserX, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { StatCard } from "@/components/site/StatCard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";

export const Route = createFileRoute("/school-admin/")({
  head: () => ({
    meta: [{ title: "Dashboard — School Admin — 2CaRvN" }],
  }),
  component: SchoolAdminDashboard,
});

const learningData = [
  { week: "Week 1", hours: 120, completions: 15 },
  { week: "Week 2", hours: 180, completions: 22 },
  { week: "Week 3", hours: 210, completions: 28 },
  { week: "Week 4", hours: 195, completions: 35 },
  { week: "Week 5", hours: 240, completions: 42 },
  { week: "Week 6", hours: 280, completions: 48 },
  { week: "Week 7", hours: 310, completions: 55 },
  { week: "Week 8", hours: 350, completions: 62 },
];

const topStudents = [
  { name: "Aarav Sharma", progress: 96, courses: 4 },
  { name: "Priya Patel", progress: 92, courses: 3 },
  { name: "Rahul Kumar", progress: 88, courses: 5 },
  { name: "Sneha Gupta", progress: 85, courses: 3 },
  { name: "Vikram Singh", progress: 82, courses: 4 },
];

function SchoolAdminDashboard() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Overview of your school's learning activity."
      />

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Students"
          value="420"
          icon={Users}
          trend="+18 this month"
          trendUp
          accent
        />
        <StatCard
          label="Active Students"
          value="368"
          icon={UserCheck}
          trend="87.6% active"
          trendUp
        />
        <StatCard
          label="Inactive Students"
          value="52"
          icon={UserX}
          trend="12.4% inactive"
          trendUp={false}
        />
        <StatCard
          label="Avg. Progress"
          value="74%"
          icon={TrendingUp}
          trend="+5.2% this month"
          trendUp
        />
      </div>

      {/* Learning Statistics */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="col-span-2 rounded-2xl border-border/60 p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-semibold">
                Learning Statistics
              </h3>
              <p className="text-sm text-muted-foreground">
                Total watch hours and course completions
              </p>
            </div>
            <Badge
              variant="outline"
              className="rounded-full border-primary/20 bg-primary/10 text-primary"
            >
              Last 8 weeks
            </Badge>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={learningData}>
                <defs>
                  <linearGradient
                    id="hoursGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="var(--primary)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--primary)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="week"
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
                <Area
                  type="monotone"
                  dataKey="hours"
                  stroke="var(--primary)"
                  fillOpacity={1}
                  fill="url(#hoursGradient)"
                  name="Watch Hours"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Top Students */}
        <Card className="rounded-2xl border-border/60 p-6">
          <h3 className="mb-4 font-display text-lg font-semibold">
            Top Students
          </h3>
          <div className="space-y-3">
            {topStudents.map((s, i) => (
              <div
                key={s.name}
                className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-accent/50"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-primary text-xs font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{s.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {s.courses} courses
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="rounded-full border-primary/20 bg-primary/10 text-xs text-primary"
                >
                  {s.progress}%
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
