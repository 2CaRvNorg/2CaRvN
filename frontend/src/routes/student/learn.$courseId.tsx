import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  Maximize,
  StickyNote,
  FileDown,
  BookOpen,
  CheckCircle,
  ChevronRight,
  Save,
} from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

export const Route = createFileRoute("/student/learn/$courseId")({
  head: () => ({
    meta: [{ title: "Learning — Student — 2CaRvN" }],
  }),
  component: LearningPage,
});

const chapters = [
  { id: 1, title: "Introduction to Limits", completed: true, active: false },
  {
    id: 2,
    title: "Continuity and Differentiability",
    completed: true,
    active: false,
  },
  {
    id: 3,
    title: "Practice Problems — Set 1",
    completed: true,
    active: false,
  },
  {
    id: 4,
    title: "Rules of Differentiation",
    completed: true,
    active: false,
  },
  {
    id: 5,
    title: "Chain Rule & Implicit Differentiation",
    completed: true,
    active: false,
  },
  {
    id: 6,
    title: "Applications of Derivatives",
    completed: true,
    active: false,
  },
  { id: 7, title: "Indefinite Integrals", completed: true, active: false },
  {
    id: 8,
    title: "Definite Integrals & Area",
    completed: false,
    active: true,
  },
  { id: 9, title: "Integration by Parts", completed: false, active: false },
];

const resources = [
  { name: "Lecture Slides — Integration.pdf", size: "2.4 MB", type: "PDF" },
  { name: "Practice Worksheet.pdf", size: "1.1 MB", type: "PDF" },
  { name: "Formula Sheet.pdf", size: "480 KB", type: "PDF" },
  {
    name: "Supplementary Reading.pdf",
    size: "3.2 MB",
    type: "PDF",
  },
];

function LearningPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [notes, setNotes] = useState(
    "Key points:\n- Definite integrals represent the area under a curve\n- The Fundamental Theorem of Calculus connects differentiation and integration\n",
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Definite Integrals & Area"
        description="Module 3: Integration · Chapter 8 of 9"
      />

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Main content area */}
        <div className="space-y-6 xl:col-span-2">
          {/* Video Player */}
          <Card className="overflow-hidden rounded-2xl border-border/60">
            <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-gray-800">
              {/* Video placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-glow transition-transform hover:scale-110"
                >
                  {isPlaying ? (
                    <Pause className="h-8 w-8" />
                  ) : (
                    <Play className="h-8 w-8 translate-x-0.5" />
                  )}
                </button>
              </div>

              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <div className="mb-2 h-1 overflow-hidden rounded-full bg-white/20">
                  <div
                    className="h-full rounded-full bg-gradient-primary"
                    style={{ width: "42%" }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-white/80">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setIsPlaying(!isPlaying)}>
                      {isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </button>
                    <SkipBack className="h-4 w-4" />
                    <SkipForward className="h-4 w-4" />
                    <Volume2 className="h-4 w-4" />
                    <span>10:08 / 24:00</span>
                  </div>
                  <Maximize className="h-4 w-4" />
                </div>
              </div>
            </div>
          </Card>

          {/* Notes & Resources Tabs */}
          <Tabs defaultValue="notes">
            <TabsList className="rounded-full">
              <TabsTrigger value="notes" className="gap-1.5 rounded-full">
                <StickyNote className="h-3.5 w-3.5" /> Notes
              </TabsTrigger>
              <TabsTrigger value="resources" className="gap-1.5 rounded-full">
                <FileDown className="h-3.5 w-3.5" /> Resources
              </TabsTrigger>
            </TabsList>

            <TabsContent value="notes">
              <Card className="rounded-2xl border-border/60 p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-display text-base font-semibold">
                    Your Notes
                  </h3>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 rounded-full"
                  >
                    <Save className="h-3.5 w-3.5" /> Save
                  </Button>
                </div>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Take notes while watching..."
                  className="min-h-[200px] rounded-xl border-border bg-background"
                />
              </Card>
            </TabsContent>

            <TabsContent value="resources">
              <Card className="rounded-2xl border-border/60 p-5">
                <h3 className="mb-3 font-display text-base font-semibold">
                  Downloadable Resources
                </h3>
                <div className="space-y-2">
                  {resources.map((r, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-xl border border-border/60 p-3 transition-colors hover:bg-accent/30"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-primary">
                        <FileDown className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {r.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {r.type} · {r.size}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="shrink-0 rounded-full text-primary"
                      >
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Module Navigation Sidebar */}
        <div>
          <Card className="sticky top-20 rounded-2xl border-border/60">
            <div className="border-b border-border/60 p-4">
              <h3 className="font-display text-base font-semibold">
                Module Navigation
              </h3>
              <p className="text-xs text-muted-foreground">
                Advanced Mathematics — Grade 12
              </p>
            </div>
            <ScrollArea className="h-[500px]">
              <div className="space-y-0.5 p-2">
                {chapters.map((ch) => (
                  <button
                    key={ch.id}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                      ch.active
                        ? "bg-primary/10 font-medium text-primary"
                        : ch.completed
                          ? "text-muted-foreground hover:bg-accent/50"
                          : "text-muted-foreground/60"
                    }`}
                  >
                    {ch.completed ? (
                      <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />
                    ) : ch.active ? (
                      <Play className="h-4 w-4 shrink-0 text-primary" />
                    ) : (
                      <div className="h-4 w-4 shrink-0 rounded-full border-2 border-muted" />
                    )}
                    <span className="flex-1 truncate">{ch.title}</span>
                    {ch.active && (
                      <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>
    </div>
  );
}
