import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Search, MoreHorizontal, Pencil } from "lucide-react";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/super-admin/schools")({
  head: () => ({
    meta: [{ title: "School Management — Super Admin — 2CaRvN" }],
  }),
  component: SchoolManagement,
});

const schools = [
  {
    id: "SCH-001",
    name: "Delhi Public School — Branch 14",
    code: "DPS-014",
    city: "New Delhi",
    students: 420,
    active: true,
    joinedAt: "Jan 2024",
  },
  {
    id: "SCH-002",
    name: "St. Xavier's Academy",
    code: "SXA-001",
    city: "Kolkata",
    students: 380,
    active: true,
    joinedAt: "Feb 2024",
  },
  {
    id: "SCH-003",
    name: "Mount Carmel High School",
    code: "MCH-007",
    city: "Bangalore",
    students: 290,
    active: true,
    joinedAt: "Mar 2024",
  },
  {
    id: "SCH-004",
    name: "Ryan International School",
    code: "RIS-003",
    city: "Mumbai",
    students: 510,
    active: false,
    joinedAt: "Apr 2024",
  },
  {
    id: "SCH-005",
    name: "Kendriya Vidyalaya No. 2",
    code: "KV-002",
    city: "Chennai",
    students: 345,
    active: true,
    joinedAt: "May 2024",
  },
  {
    id: "SCH-006",
    name: "DAV Public School",
    code: "DAV-009",
    city: "Pune",
    students: 275,
    active: true,
    joinedAt: "Jun 2024",
  },
];

function SchoolManagement() {
  const [search, setSearch] = useState("");
  const filtered = schools.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="School Management"
        description="Manage schools enrolled on the platform."
      >
        <Dialog>
          <DialogTrigger asChild>
            <Button className="rounded-full bg-gradient-primary shadow-soft hover:opacity-95">
              <Plus className="mr-1 h-4 w-4" /> Add School
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-display">Add New School</DialogTitle>
              <DialogDescription>
                Enter the school details to register them on the platform.
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="add-name">School Name</Label>
                <Input
                  id="add-name"
                  placeholder="e.g. Delhi Public School"
                  className="rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="add-code">School Code</Label>
                  <Input
                    id="add-code"
                    placeholder="e.g. DPS-001"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-city">City</Label>
                  <Input
                    id="add-city"
                    placeholder="e.g. New Delhi"
                    className="rounded-xl"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-admin">Admin Email</Label>
                <Input
                  id="add-admin"
                  type="email"
                  placeholder="admin@school.edu"
                  className="rounded-xl"
                />
              </div>
            </form>
            <DialogFooter>
              <Button
                variant="outline"
                className="rounded-full"
              >
                Cancel
              </Button>
              <Button className="rounded-full bg-gradient-primary shadow-soft hover:opacity-95">
                Add School
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* Search */}
      <Card className="rounded-2xl border-border/60 p-4">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search schools…"
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
              <TableHead>School</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>City</TableHead>
              <TableHead className="text-right">Students</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((school) => (
              <TableRow key={school.id}>
                <TableCell className="font-medium">{school.name}</TableCell>
                <TableCell>
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                    {school.code}
                  </code>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {school.city}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {school.students}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      defaultChecked={school.active}
                      className="data-[state=checked]:bg-primary"
                    />
                    <Badge
                      variant={school.active ? "default" : "secondary"}
                      className={`rounded-full ${school.active ? "border-0 bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/15" : ""}`}
                    >
                      {school.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {school.joinedAt}
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
                        <Pencil className="h-3.5 w-3.5" /> Edit School
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
