import { createFileRoute } from "@tanstack/react-router";
import { Clock, Eye, TrendingUp, Award, Search } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

export const Route = createFileRoute("/school-admin/analytics")({
  head: () => ({
    meta: [{ title: "Student Analytics — School Admin — 2CaRvN" }],
  }),
  component: StudentAnalytics,
});

const analyticsData = [
  {
    name: "Aarav Sharma",
    regNo: "STU-001",
    lastLogin: "2 hours ago",
    watchTime: "42h 15m",
    progress: 96,
    quizAvg: 92,
    courses: 4,
    status: "active" as const,
  },
  {
    name: "Priya Patel",
    regNo: "STU-023",
    lastLogin: "5 hours ago",
    watchTime: "38h 40m",
    progress: 92,
    quizAvg: 88,
    courses: 3,
    status: "active" as const,
  },
  {
    name: "Rahul Kumar",
    regNo: "STU-045",
    lastLogin: "1 day ago",
    watchTime: "35h 10m",
    progress: 88,
    quizAvg: 75,
    courses: 5,
    status: "active" as const,
  },
  {
    name: "Sneha Gupta",
    regNo: "STU-078",
    lastLogin: "3 hours ago",
    watchTime: "30h 25m",
    progress: 85,
    quizAvg: 90,
    courses: 3,
    status: "active" as const,
  },
  {
    name: "Vikram Singh",
    regNo: "STU-102",
    lastLogin: "5 days ago",
    watchTime: "18h 50m",
    progress: 72,
    quizAvg: 65,
    courses: 4,
    status: "at-risk" as const,
  },
  {
    name: "Ananya Reddy",
    regNo: "STU-119",
    lastLogin: "12 hours ago",
    watchTime: "22h 30m",
    progress: 68,
    quizAvg: 71,
    courses: 3,
    status: "active" as const,
  },
  {
    name: "Karthik Nair",
    regNo: "STU-134",
    lastLogin: "2 weeks ago",
    watchTime: "8h 15m",
    progress: 45,
    quizAvg: 52,
    courses: 4,
    status: "at-risk" as const,
  },
];

function StudentAnalytics() {
  const [search, setSearch] = useState("");
  const filtered = analyticsData.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.regNo.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Analytics"
        description="Track individual student learning activity and performance."
      />

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="rounded-2xl border-border/60 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg. Watch Time</p>
              <p className="font-display text-xl font-bold">28h 12m</p>
            </div>
          </div>
        </Card>
        <Card className="rounded-2xl border-border/60 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary">
              <Eye className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg. Last Login</p>
              <p className="font-display text-xl font-bold">1.2 days</p>
            </div>
          </div>
        </Card>
        <Card className="rounded-2xl border-border/60 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg. Progress</p>
              <p className="font-display text-xl font-bold">78%</p>
            </div>
          </div>
        </Card>
        <Card className="rounded-2xl border-border/60 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg. Quiz Score</p>
              <p className="font-display text-xl font-bold">76%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="rounded-2xl border-border/60 p-4">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search students…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-xl pl-9"
          />
        </div>
      </Card>

      {/* Analytics Table */}
      <Card className="overflow-hidden rounded-2xl border-border/60">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Watch Time</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead className="text-right">Quiz Avg.</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((s) => (
              <TableRow key={s.regNo}>
                <TableCell>
                  <div>
                    <p className="font-medium">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.regNo}</p>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {s.lastLogin}
                </TableCell>
                <TableCell className="text-sm font-medium">
                  {s.watchTime}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={s.progress} className="h-2 w-20" />
                    <span className="text-xs font-medium">{s.progress}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <span
                    className={`font-medium ${s.quizAvg >= 75 ? "text-emerald-700" : s.quizAvg >= 50 ? "text-amber-700" : "text-red-600"}`}
                  >
                    {s.quizAvg}%
                  </span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`rounded-full ${
                      s.status === "active"
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700"
                        : "border-amber-500/30 bg-amber-500/10 text-amber-700"
                    }`}
                  >
                    {s.status === "active" ? "Active" : "At Risk"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
