import { createFileRoute, Link } from "@tanstack/react-router";
import { Play, Clock, Users, Star, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/student/courses")({
  head: () => ({
    meta: [{ title: "My Courses — Student — 2CaRvN" }],
  }),
  component: MyCourses,
});

const courses = [
  {
    id: "crs-1",
    title: "Advanced Mathematics — Grade 12",
    instructor: "Dr. Rajesh Kumar",
    progress: 78,
    modules: 8,
    completedModules: 6,
    hours: 24,
    rating: 4.9,
    students: "1.2k",
    status: "in-progress" as const,
    accent: "from-primary-deep to-primary",
  },
  {
    id: "crs-2",
    title: "Physics Fundamentals — Grade 11",
    instructor: "Prof. Sunita Rao",
    progress: 45,
    modules: 6,
    completedModules: 3,
    hours: 18,
    rating: 4.8,
    students: "980",
    status: "in-progress" as const,
    accent: "from-primary to-primary-glow",
  },
  {
    id: "crs-3",
    title: "English Literature — Grade 10",
    instructor: "Ms. Aparna Das",
    progress: 92,
    modules: 10,
    completedModules: 9,
    hours: 20,
    rating: 4.9,
    students: "2.1k",
    status: "in-progress" as const,
    accent: "from-primary-glow to-primary",
  },
  {
    id: "crs-4",
    title: "Computer Science — Grade 11",
    instructor: "Mr. Anil Mehta",
    progress: 100,
    modules: 7,
    completedModules: 7,
    hours: 22,
    rating: 4.7,
    students: "760",
    status: "completed" as const,
    accent: "from-primary-deep to-primary-glow",
  },
  {
    id: "crs-5",
    title: "History — Modern India",
    instructor: "Dr. Meera Shah",
    progress: 0,
    modules: 4,
    completedModules: 0,
    hours: 12,
    rating: 4.6,
    students: "450",
    status: "not-started" as const,
    accent: "from-primary to-primary-deep",
  },
];

function MyCourses() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="My Courses"
        description="All your assigned courses in one place."
      />

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="rounded-full">
          <TabsTrigger value="all" className="rounded-full">
            All ({courses.length})
          </TabsTrigger>
          <TabsTrigger value="in-progress" className="rounded-full">
            In Progress (
            {courses.filter((c) => c.status === "in-progress").length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="rounded-full">
            Completed (
            {courses.filter((c) => c.status === "completed").length})
          </TabsTrigger>
          <TabsTrigger value="not-started" className="rounded-full">
            Not Started (
            {courses.filter((c) => c.status === "not-started").length})
          </TabsTrigger>
        </TabsList>

        {["all", "in-progress", "completed", "not-started"].map((tab) => (
          <TabsContent key={tab} value={tab}>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {courses
                .filter((c) => tab === "all" || c.status === tab)
                .map((course) => (
                  <Card
                    key={course.id}
                    className="group overflow-hidden rounded-2xl border-border/60 transition-all hover:-translate-y-1 hover:shadow-glow"
                  >
                    <div
                      className={`relative aspect-[16/10] bg-gradient-to-br ${course.accent}`}
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.3),transparent_50%)]" />
                      <Badge className="absolute left-4 top-4 rounded-full border-0 bg-background/95 text-foreground hover:bg-background">
                        {course.status === "completed"
                          ? "✓ Completed"
                          : course.status === "in-progress"
                            ? `${course.progress}%`
                            : "New"}
                      </Badge>
                      <div className="absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-background/95 text-primary shadow-soft transition-transform group-hover:scale-110">
                        <Play className="h-5 w-5 fill-current" />
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-display text-lg font-semibold leading-tight">
                        {course.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        by {course.instructor}
                      </p>

                      {/* Progress */}
                      <div className="mt-4">
                        <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                          <span>
                            {course.completedModules}/{course.modules} modules
                          </span>
                          <span className="font-medium text-foreground">
                            {course.progress}%
                          </span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>

                      {/* Stats */}
                      <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-primary text-primary" />{" "}
                          {course.rating}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" /> {course.students}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" /> {course.hours}h
                        </span>
                      </div>

                      {/* CTA */}
                      <div className="mt-5 border-t border-border pt-5">
                        <Button
                          className="w-full rounded-full bg-gradient-primary shadow-soft hover:opacity-95"
                          asChild
                        >
                          <Link
                            to="/student/course/$courseId"
                            params={{ courseId: course.id }}
                          >
                            {course.status === "completed"
                              ? "Review Course"
                              : course.status === "not-started"
                                ? "Start Learning"
                                : "Continue Learning"}
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
