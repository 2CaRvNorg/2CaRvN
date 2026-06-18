import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  UserX,
  UserCheck,
  Filter,
} from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/school-admin/students")({
  head: () => ({
    meta: [{ title: "Student Management — School Admin — 2CaRvN" }],
  }),
  component: StudentManagement,
});

const students = [
  {
    regNo: "STU-001",
    name: "Aarav Sharma",
    email: "aarav@student.edu",
    grade: "12",
    section: "A",
    courses: 4,
    progress: 96,
    active: true,
    joinedAt: "Aug 2024",
  },
  {
    regNo: "STU-023",
    name: "Priya Patel",
    email: "priya@student.edu",
    grade: "12",
    section: "B",
    courses: 3,
    progress: 92,
    active: true,
    joinedAt: "Aug 2024",
  },
  {
    regNo: "STU-045",
    name: "Rahul Kumar",
    email: "rahul@student.edu",
    grade: "11",
    section: "A",
    courses: 5,
    progress: 88,
    active: true,
    joinedAt: "Sep 2024",
  },
  {
    regNo: "STU-078",
    name: "Sneha Gupta",
    email: "sneha@student.edu",
    grade: "11",
    section: "B",
    courses: 3,
    progress: 85,
    active: true,
    joinedAt: "Sep 2024",
  },
  {
    regNo: "STU-102",
    name: "Vikram Singh",
    email: "vikram@student.edu",
    grade: "10",
    section: "A",
    courses: 4,
    progress: 72,
    active: false,
    joinedAt: "Oct 2024",
  },
  {
    regNo: "STU-119",
    name: "Ananya Reddy",
    email: "ananya@student.edu",
    grade: "10",
    section: "C",
    courses: 3,
    progress: 68,
    active: true,
    joinedAt: "Oct 2024",
  },
  {
    regNo: "STU-134",
    name: "Karthik Nair",
    email: "karthik@student.edu",
    grade: "12",
    section: "A",
    courses: 4,
    progress: 45,
    active: false,
    joinedAt: "Nov 2024",
  },
];

function StudentManagement() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.regNo.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && s.active) ||
      (statusFilter === "inactive" && !s.active);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Management"
        description="Add, edit, and manage students in your school."
      >
        <Dialog>
          <DialogTrigger asChild>
            <Button className="rounded-full bg-gradient-primary shadow-soft hover:opacity-95">
              <Plus className="mr-1 h-4 w-4" /> Add Student
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-display">
                Add New Student
              </DialogTitle>
              <DialogDescription>
                Register a new student to the platform.
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="student-name">Full Name</Label>
                  <Input
                    id="student-name"
                    placeholder="Full name"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-reg">Registration No.</Label>
                  <Input
                    id="student-reg"
                    placeholder="Auto-generated"
                    className="rounded-xl"
                    disabled
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="student-email">Email</Label>
                <Input
                  id="student-email"
                  type="email"
                  placeholder="student@school.edu"
                  className="rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="student-grade">Grade</Label>
                  <Input
                    id="student-grade"
                    placeholder="e.g. 12"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-section">Section</Label>
                  <Input
                    id="student-section"
                    placeholder="e.g. A"
                    className="rounded-xl"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="student-password">Initial Password</Label>
                <Input
                  id="student-password"
                  type="password"
                  placeholder="Set initial password"
                  className="rounded-xl"
                />
              </div>
            </form>
            <DialogFooter>
              <Button variant="outline" className="rounded-full">
                Cancel
              </Button>
              <Button className="rounded-full bg-gradient-primary shadow-soft hover:opacity-95">
                Add Student
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* Search and Filter */}
      <Card className="rounded-2xl border-border/60 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search students…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-xl pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] rounded-xl">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Students</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden rounded-2xl border-border/60">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Reg. No.</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead className="text-right">Courses</TableHead>
              <TableHead className="text-right">Progress</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((student) => (
              <TableRow key={student.regNo}>
                <TableCell>
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {student.email}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                    {student.regNo}
                  </code>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {student.grade}-{student.section}
                </TableCell>
                <TableCell className="text-right">{student.courses}</TableCell>
                <TableCell className="text-right">
                  <span
                    className={`font-medium ${student.progress >= 80 ? "text-emerald-700" : student.progress >= 60 ? "text-amber-700" : "text-red-600"}`}
                  >
                    {student.progress}%
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      defaultChecked={student.active}
                      className="data-[state=checked]:bg-primary"
                    />
                    <Badge
                      variant={student.active ? "default" : "secondary"}
                      className={`rounded-full ${student.active ? "border-0 bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/15" : ""}`}
                    >
                      {student.active ? "Active" : "Disabled"}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl">
                      <DropdownMenuItem className="gap-2">
                        <Pencil className="h-3.5 w-3.5" /> Edit Student
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="gap-2 text-destructive">
                        <UserX className="h-3.5 w-3.5" /> Disable Student
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
