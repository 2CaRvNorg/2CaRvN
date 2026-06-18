import { createFileRoute } from "@tanstack/react-router";
import {
  Download,
  FileSpreadsheet,
  FileText,
  FileDown,
} from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/school-admin/reports")({
  head: () => ({
    meta: [{ title: "Reports — School Admin — 2CaRvN" }],
  }),
  component: Reports,
});

const progressData = [
  {
    name: "Aarav Sharma",
    regNo: "STU-001",
    course: "Advanced Mathematics",
    progress: 96,
    modulesCompleted: "7/8",
    lastActive: "2 hours ago",
  },
  {
    name: "Priya Patel",
    regNo: "STU-023",
    course: "Physics Fundamentals",
    progress: 85,
    modulesCompleted: "5/6",
    lastActive: "5 hours ago",
  },
  {
    name: "Rahul Kumar",
    regNo: "STU-045",
    course: "English Literature",
    progress: 72,
    modulesCompleted: "7/10",
    lastActive: "1 day ago",
  },
  {
    name: "Sneha Gupta",
    regNo: "STU-078",
    course: "Computer Science",
    progress: 60,
    modulesCompleted: "4/7",
    lastActive: "3 hours ago",
  },
  {
    name: "Vikram Singh",
    regNo: "STU-102",
    course: "Advanced Mathematics",
    progress: 45,
    modulesCompleted: "3/8",
    lastActive: "5 days ago",
  },
];

const completionData = [
  {
    course: "Advanced Mathematics — Grade 12",
    enrolled: 120,
    completed: 45,
    inProgress: 62,
    notStarted: 13,
    avgScore: 78,
  },
  {
    course: "Physics Fundamentals — Grade 11",
    enrolled: 98,
    completed: 32,
    inProgress: 50,
    notStarted: 16,
    avgScore: 72,
  },
  {
    course: "English Literature — Grade 10",
    enrolled: 145,
    completed: 89,
    inProgress: 42,
    notStarted: 14,
    avgScore: 81,
  },
  {
    course: "Computer Science — Grade 11",
    enrolled: 76,
    completed: 18,
    inProgress: 45,
    notStarted: 13,
    avgScore: 68,
  },
];

function Reports() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="View and export student progress and completion reports."
      />

      <Tabs defaultValue="progress" className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList className="rounded-full">
            <TabsTrigger value="progress" className="rounded-full">
              Progress Reports
            </TabsTrigger>
            <TabsTrigger value="completion" className="rounded-full">
              Completion Reports
            </TabsTrigger>
          </TabsList>

          {/* Export Options */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 rounded-full"
            >
              <FileSpreadsheet className="h-3.5 w-3.5" /> CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 rounded-full"
            >
              <FileText className="h-3.5 w-3.5" /> PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 rounded-full"
            >
              <FileDown className="h-3.5 w-3.5" /> Excel
            </Button>
          </div>
        </div>

        {/* Progress Reports */}
        <TabsContent value="progress">
          <Card className="overflow-hidden rounded-2xl border-border/60">
            <div className="border-b border-border/60 px-6 py-4">
              <h3 className="font-display text-lg font-semibold">
                Student Progress Report
              </h3>
              <p className="text-sm text-muted-foreground">
                Individual student progress across courses
              </p>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Modules</TableHead>
                  <TableHead>Last Active</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {progressData.map((r, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{r.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {r.regNo}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {r.course}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={r.progress} className="h-2 w-24" />
                        <span
                          className={`text-xs font-medium ${r.progress >= 80 ? "text-emerald-700" : r.progress >= 50 ? "text-amber-700" : "text-red-600"}`}
                        >
                          {r.progress}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {r.modulesCompleted}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {r.lastActive}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Completion Reports */}
        <TabsContent value="completion">
          <Card className="overflow-hidden rounded-2xl border-border/60">
            <div className="border-b border-border/60 px-6 py-4">
              <h3 className="font-display text-lg font-semibold">
                Course Completion Report
              </h3>
              <p className="text-sm text-muted-foreground">
                Aggregated completion data per course
              </p>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead className="text-right">Enrolled</TableHead>
                  <TableHead className="text-right">Completed</TableHead>
                  <TableHead className="text-right">In Progress</TableHead>
                  <TableHead className="text-right">Not Started</TableHead>
                  <TableHead className="text-right">Avg Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {completionData.map((c, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{c.course}</TableCell>
                    <TableCell className="text-right">{c.enrolled}</TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant="outline"
                        className="rounded-full border-emerald-500/30 bg-emerald-500/10 text-emerald-700"
                      >
                        {c.completed}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant="outline"
                        className="rounded-full border-blue-500/30 bg-blue-500/10 text-blue-700"
                      >
                        {c.inProgress}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary" className="rounded-full">
                        {c.notStarted}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {c.avgScore}%
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
