import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Lock,
  Unlock,
  CheckCircle,
  Play,
  ChevronDown,
  ChevronRight,
  Clock,
  FileText,
} from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export const Route = createFileRoute("/student/course/$courseId")({
  head: () => ({
    meta: [{ title: "Course Details — Student — 2CaRvN" }],
  }),
  component: CourseDetails,
});

const modules = [
  {
    id: 1,
    title: "Module 1: Foundations of Calculus",
    progress: 100,
    chapters: [
      { id: "c1", title: "Introduction to Limits", duration: "18 min", status: "completed" as const },
      { id: "c2", title: "Continuity and Differentiability", duration: "22 min", status: "completed" as const },
      { id: "c3", title: "Practice Problems — Set 1", duration: "15 min", status: "completed" as const },
    ],
  },
  {
    id: 2,
    title: "Module 2: Derivatives",
    progress: 100,
    chapters: [
      { id: "c4", title: "Rules of Differentiation", duration: "25 min", status: "completed" as const },
      { id: "c5", title: "Chain Rule & Implicit Differentiation", duration: "28 min", status: "completed" as const },
      { id: "c6", title: "Applications of Derivatives", duration: "30 min", status: "completed" as const },
    ],
  },
  {
    id: 3,
    title: "Module 3: Integration",
    progress: 66,
    chapters: [
      { id: "c7", title: "Indefinite Integrals", duration: "20 min", status: "completed" as const },
      { id: "c8", title: "Definite Integrals & Area", duration: "24 min", status: "completed" as const },
      { id: "c9", title: "Integration by Parts", duration: "22 min", status: "unlocked" as const },
    ],
  },
  {
    id: 4,
    title: "Module 4: Differential Equations",
    progress: 0,
    chapters: [
      { id: "c10", title: "First Order Equations", duration: "26 min", status: "locked" as const },
      { id: "c11", title: "Second Order Equations", duration: "30 min", status: "locked" as const },
      { id: "c12", title: "Applications in Physics", duration: "28 min", status: "locked" as const },
    ],
  },
  {
    id: 5,
    title: "Module 5: Vectors & 3D Geometry",
    progress: 0,
    chapters: [
      { id: "c13", title: "Vector Algebra", duration: "22 min", status: "locked" as const },
      { id: "c14", title: "Lines and Planes in 3D", duration: "25 min", status: "locked" as const },
    ],
  },
];

function CourseDetails() {
  const { courseId } = Route.useParams();
  const totalChapters = modules.reduce((s, m) => s + m.chapters.length, 0);
  const completedChapters = modules.reduce(
    (s, m) => s + m.chapters.filter((c) => c.status === "completed").length,
    0,
  );
  const overallProgress = Math.round((completedChapters / totalChapters) * 100);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Advanced Mathematics — Grade 12"
        description="Dr. Rajesh Kumar · 8 modules · 42 chapters"
      >
        <Button
          className="rounded-full bg-gradient-primary shadow-soft hover:opacity-95"
          asChild
        >
          <Link to="/student/learn/$courseId" params={{ courseId }}>
            <Play className="mr-1 h-4 w-4" /> Continue Learning
          </Link>
        </Button>
      </PageHeader>

      {/* Overall Progress */}
      <Card className="rounded-2xl border-border/60 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold">
              Overall Progress
            </h3>
            <p className="text-sm text-muted-foreground">
              {completedChapters} of {totalChapters} chapters completed
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Progress value={overallProgress} className="h-3 w-48" />
            <span className="font-display text-xl font-bold text-primary">
              {overallProgress}%
            </span>
          </div>
        </div>
      </Card>

      {/* Modules */}
      <div className="space-y-3">
        {modules.map((mod) => (
          <ModuleAccordion key={mod.id} module={mod} courseId={courseId} />
        ))}
      </div>
    </div>
  );
}

function ModuleAccordion({
  module,
  courseId,
}: {
  module: (typeof modules)[0];
  courseId: string;
}) {
  const [open, setOpen] = useState(module.progress > 0 && module.progress < 100);
  const isCompleted = module.progress === 100;
  const isLocked = module.chapters.every((c) => c.status === "locked");

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card className="overflow-hidden rounded-2xl border-border/60">
        <CollapsibleTrigger className="flex w-full items-center gap-4 p-5 text-left transition-colors hover:bg-accent/30">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
              isCompleted
                ? "bg-emerald-500/15 text-emerald-600"
                : isLocked
                  ? "bg-muted text-muted-foreground"
                  : "bg-primary/10 text-primary"
            }`}
          >
            {isCompleted ? (
              <CheckCircle className="h-5 w-5" />
            ) : isLocked ? (
              <Lock className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-display text-sm font-semibold">
              {module.title}
            </p>
            <p className="text-xs text-muted-foreground">
              {module.chapters.length} chapters ·{" "}
              {module.chapters.reduce((s, c) => s + parseInt(c.duration), 0)}{" "}
              min
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 sm:flex">
              <Progress value={module.progress} className="h-2 w-20" />
              <span className="text-xs font-medium">{module.progress}%</span>
            </div>
            {open ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="border-t border-border/60 px-5 py-3">
            <div className="space-y-1">
              {module.chapters.map((ch) => (
                <div
                  key={ch.id}
                  className={`flex items-center gap-3 rounded-xl p-3 transition-colors ${
                    ch.status === "locked"
                      ? "opacity-50"
                      : "hover:bg-accent/50"
                  }`}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                    {ch.status === "completed" ? (
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                    ) : ch.status === "locked" ? (
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Unlock className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{ch.title}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" /> {ch.duration}
                  </div>
                  {ch.status !== "locked" && (
                    <Button
                      size="sm"
                      variant={ch.status === "completed" ? "ghost" : "default"}
                      className={`h-7 rounded-full px-3 text-xs ${ch.status !== "completed" ? "bg-gradient-primary" : ""}`}
                      asChild
                    >
                      <Link
                        to="/student/learn/$courseId"
                        params={{ courseId }}
                      >
                        {ch.status === "completed" ? "Review" : "Play"}
                      </Link>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
