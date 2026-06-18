import { createFileRoute } from "@tanstack/react-router";
import { Calendar, Clock, School, CheckCircle, AlertCircle } from "lucide-react";
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

export const Route = createFileRoute("/super-admin/video-releases")({
  head: () => ({
    meta: [{ title: "Video Release Management — Super Admin — 2CaRvN" }],
  }),
  component: VideoReleaseManagement,
});

const releases = [
  {
    id: "VID-001",
    title: "Physics Ch. 5 — Thermodynamics",
    course: "Physics Fundamentals",
    scheduledAt: "2024-12-20 10:00 AM",
    status: "released",
    schoolAccess: 142,
    totalSchools: 148,
  },
  {
    id: "VID-002",
    title: "Math Ch. 8 — Integration",
    course: "Advanced Mathematics",
    scheduledAt: "2024-12-22 09:00 AM",
    status: "scheduled",
    schoolAccess: 148,
    totalSchools: 148,
  },
  {
    id: "VID-003",
    title: "Chemistry Ch. 3 — Organic Compounds",
    course: "Organic Chemistry",
    scheduledAt: "2024-12-25 11:00 AM",
    status: "scheduled",
    schoolAccess: 90,
    totalSchools: 148,
  },
  {
    id: "VID-004",
    title: "English — Shakespeare Sonnets",
    course: "English Literature",
    scheduledAt: "2024-12-18 08:00 AM",
    status: "released",
    schoolAccess: 148,
    totalSchools: 148,
  },
  {
    id: "VID-005",
    title: "CS — Data Structures Intro",
    course: "Computer Science",
    scheduledAt: "2024-12-28 10:00 AM",
    status: "draft",
    schoolAccess: 0,
    totalSchools: 148,
  },
];

const schoolAccessList = [
  { name: "Delhi Public School — Branch 14", code: "DPS-014", enabled: true },
  { name: "St. Xavier's Academy", code: "SXA-001", enabled: true },
  { name: "Mount Carmel High School", code: "MCH-007", enabled: false },
  { name: "Ryan International School", code: "RIS-003", enabled: true },
  { name: "Kendriya Vidyalaya No. 2", code: "KV-002", enabled: true },
  { name: "DAV Public School", code: "DAV-009", enabled: false },
];

function VideoReleaseManagement() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Video Release Management"
        description="Schedule and manage video content releases across schools."
      />

      {/* Schedule Section */}
      <Card className="rounded-2xl border-border/60 p-6">
        <h3 className="mb-4 font-display text-lg font-semibold">
          Schedule New Release
        </h3>
        <form className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="video-title">Video / Chapter</Label>
            <Input
              id="video-title"
              placeholder="Select chapter…"
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="release-date">Release Date</Label>
            <div className="relative">
              <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="release-date"
                type="date"
                className="rounded-xl pl-9"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="release-time">Release Time</Label>
            <div className="relative">
              <Clock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="release-time"
                type="time"
                className="rounded-xl pl-9"
              />
            </div>
          </div>
          <div className="flex items-end">
            <Button className="w-full rounded-xl bg-gradient-primary shadow-soft hover:opacity-95">
              Schedule Release
            </Button>
          </div>
        </form>
      </Card>

      {/* Release Status Table */}
      <Card className="overflow-hidden rounded-2xl border-border/60">
        <div className="border-b border-border/60 px-6 py-4">
          <h3 className="font-display text-lg font-semibold">
            Release Status
          </h3>
          <p className="text-sm text-muted-foreground">
            All scheduled and released video content
          </p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Video</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Scheduled At</TableHead>
              <TableHead>School Access</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {releases.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.title}</TableCell>
                <TableCell className="text-muted-foreground">
                  {r.course}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {r.scheduledAt}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <School className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {r.schoolAccess}/{r.totalSchools}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`rounded-full ${
                      r.status === "released"
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700"
                        : r.status === "scheduled"
                          ? "border-blue-500/30 bg-blue-500/10 text-blue-700"
                          : "border-border bg-muted text-muted-foreground"
                    }`}
                  >
                    {r.status === "released" && (
                      <CheckCircle className="mr-1 h-3 w-3" />
                    )}
                    {r.status === "scheduled" && (
                      <Clock className="mr-1 h-3 w-3" />
                    )}
                    {r.status === "draft" && (
                      <AlertCircle className="mr-1 h-3 w-3" />
                    )}
                    {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* School-wise Access */}
      <Card className="rounded-2xl border-border/60 p-6">
        <div className="mb-4">
          <h3 className="font-display text-lg font-semibold">
            School-wise Access Control
          </h3>
          <p className="text-sm text-muted-foreground">
            Toggle access for individual schools (applies to all scheduled
            releases)
          </p>
        </div>
        <div className="space-y-2">
          {schoolAccessList.map((school) => (
            <div
              key={school.code}
              className="flex items-center justify-between rounded-xl border border-border/60 p-4 transition-colors hover:bg-accent/30"
            >
              <div>
                <p className="text-sm font-medium">{school.name}</p>
                <p className="text-xs text-muted-foreground">{school.code}</p>
              </div>
              <Switch
                defaultChecked={school.enabled}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
