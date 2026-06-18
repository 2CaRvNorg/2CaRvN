import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  ChevronDown,
  ChevronRight,
  GripVertical,
} from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/super-admin/courses")({
  head: () => ({
    meta: [{ title: "Course Management — Super Admin — 2CaRvN" }],
  }),
  component: CourseManagement,
});

const courses = [
  {
    id: "CRS-001",
    title: "Advanced Mathematics — Grade 12",
    category: "Mathematics",
    modules: 8,
    chapters: 42,
    status: "Published",
    students: 1240,
  },
  {
    id: "CRS-002",
    title: "Physics Fundamentals — Grade 11",
    category: "Science",
    modules: 6,
    chapters: 30,
    status: "Published",
    students: 980,
  },
  {
    id: "CRS-003",
    title: "Organic Chemistry — Grade 12",
    category: "Science",
    modules: 5,
    chapters: 25,
    status: "Draft",
    students: 0,
  },
  {
    id: "CRS-004",
    title: "English Literature — Grade 10",
    category: "Languages",
    modules: 10,
    chapters: 48,
    status: "Published",
    students: 2100,
  },
  {
    id: "CRS-005",
    title: "Computer Science — Grade 11",
    category: "Technology",
    modules: 7,
    chapters: 35,
    status: "Published",
    students: 760,
  },
  {
    id: "CRS-006",
    title: "History — Modern India",
    category: "Humanities",
    modules: 4,
    chapters: 20,
    status: "Draft",
    students: 0,
  },
];

const sampleModules = [
  {
    id: 1,
    title: "Module 1: Introduction & Foundations",
    chapters: ["Chapter 1: Overview", "Chapter 2: Basic Concepts", "Chapter 3: Getting Started"],
  },
  {
    id: 2,
    title: "Module 2: Core Principles",
    chapters: ["Chapter 4: Theory", "Chapter 5: Applications", "Chapter 6: Practice Problems"],
  },
  {
    id: 3,
    title: "Module 3: Advanced Topics",
    chapters: ["Chapter 7: Deep Dive", "Chapter 8: Case Studies"],
  },
];

function CourseManagement() {
  const [search, setSearch] = useState("");
  const filtered = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Course Management"
        description="Create, edit, and organize courses and modules."
      >
        <Dialog>
          <DialogTrigger asChild>
            <Button className="rounded-full bg-gradient-primary shadow-soft hover:opacity-95">
              <Plus className="mr-1 h-4 w-4" /> Create Course
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-display">
                Create New Course
              </DialogTitle>
              <DialogDescription>
                Set up a new course with its basic information.
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="course-title">Course Title</Label>
                <Input
                  id="course-title"
                  placeholder="e.g. Advanced Mathematics — Grade 12"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="course-category">Category</Label>
                <Input
                  id="course-category"
                  placeholder="e.g. Mathematics, Science"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="course-desc">Description</Label>
                <Textarea
                  id="course-desc"
                  placeholder="Brief description of the course..."
                  className="min-h-[80px] rounded-xl"
                />
              </div>
            </form>
            <DialogFooter>
              <Button variant="outline" className="rounded-full">
                Cancel
              </Button>
              <Button className="rounded-full bg-gradient-primary shadow-soft hover:opacity-95">
                Create Course
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList className="rounded-full">
          <TabsTrigger value="courses" className="rounded-full">
            Course List
          </TabsTrigger>
          <TabsTrigger value="modules" className="rounded-full">
            Module Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4">
          {/* Search */}
          <Card className="rounded-2xl border-border/60 p-4">
            <div className="relative max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search courses…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-xl pl-9"
              />
            </div>
          </Card>

          {/* Table */}
          <Card className="overflow-hidden rounded-2xl border-border/60">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Modules</TableHead>
                  <TableHead className="text-right">Chapters</TableHead>
                  <TableHead className="text-right">Students</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">
                      {course.title}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {course.category}
                    </TableCell>
                    <TableCell className="text-right">
                      {course.modules}
                    </TableCell>
                    <TableCell className="text-right">
                      {course.chapters}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {course.students.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`rounded-full ${
                          course.status === "Published"
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700"
                            : "border-amber-500/30 bg-amber-500/10 text-amber-700"
                        }`}
                      >
                        {course.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="modules" className="space-y-4">
          <Card className="rounded-2xl border-border/60 p-6">
            <div className="mb-4">
              <h3 className="font-display text-lg font-semibold">
                Advanced Mathematics — Grade 12
              </h3>
              <p className="text-sm text-muted-foreground">
                Manage modules and chapters for this course
              </p>
            </div>

            <div className="space-y-2">
              {sampleModules.map((mod) => (
                <ModuleItem key={mod.id} module={mod} />
              ))}
            </div>

            <Button
              variant="outline"
              className="mt-4 rounded-full border-dashed"
            >
              <Plus className="mr-1 h-4 w-4" /> Add Module
            </Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ModuleItem({
  module,
}: {
  module: { id: number; title: string; chapters: string[] };
}) {
  const [open, setOpen] = useState(false);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="rounded-xl border border-border/60 bg-card">
        <CollapsibleTrigger className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-accent/50">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
          {open ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="flex-1 text-sm font-medium">{module.title}</span>
          <Badge
            variant="secondary"
            className="rounded-full text-xs"
          >
            {module.chapters.length} chapters
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={(e) => e.stopPropagation()}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="border-t border-border/60 px-4 py-3">
            <div className="space-y-1">
              {module.chapters.map((ch, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent/50"
                >
                  <GripVertical className="h-3.5 w-3.5" />
                  <span className="flex-1">{ch}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Pencil className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 text-xs text-primary"
            >
              <Plus className="mr-1 h-3 w-3" /> Add Chapter
            </Button>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
