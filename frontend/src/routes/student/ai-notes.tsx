import { createFileRoute } from "@tanstack/react-router";
import {
  StickyNote,
  RefreshCw,
  BookOpen,
  Filter,
  Sparkles,
  Copy,
  Clock,
} from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/student/ai-notes")({
  head: () => ({
    meta: [{ title: "AI Notes — Student — 2CaRvN" }],
  }),
  component: AiNotes,
});

const notes = [
  {
    id: 1,
    course: "Advanced Mathematics",
    module: "Module 3: Integration",
    chapter: "Definite Integrals & Area",
    generatedAt: "10 min ago",
    content: `## Key Concepts

**Definite Integrals** calculate the exact area under a curve between two points a and b.

### The Fundamental Theorem of Calculus
If F is an antiderivative of f, then:
∫ₐᵇ f(x) dx = F(b) - F(a)

### Properties
• **Linearity**: ∫ₐᵇ [f(x) + g(x)] dx = ∫ₐᵇ f(x) dx + ∫ₐᵇ g(x) dx
• **Reversal**: ∫ₐᵇ f(x) dx = -∫ᵇₐ f(x) dx
• **Zero width**: ∫ₐᵃ f(x) dx = 0

### Applications
1. Area between curves
2. Volume of revolution
3. Average value of a function`,
    tags: ["Integration", "Calculus", "Area"],
  },
  {
    id: 2,
    course: "Physics Fundamentals",
    module: "Module 3: Thermodynamics",
    chapter: "Laws of Thermodynamics",
    generatedAt: "2 hours ago",
    content: `## Laws of Thermodynamics

### Zeroth Law
If A is in thermal equilibrium with C, and B is in thermal equilibrium with C, then A and B are in thermal equilibrium.

### First Law (Conservation of Energy)
ΔU = Q - W
• ΔU = change in internal energy
• Q = heat added to system
• W = work done by system

### Second Law
Entropy of an isolated system never decreases. Heat flows from hot to cold spontaneously.

### Third Law
As temperature → absolute zero, entropy → constant minimum.`,
    tags: ["Thermodynamics", "Energy", "Entropy"],
  },
  {
    id: 3,
    course: "English Literature",
    module: "Module 8: Shakespeare",
    chapter: "Hamlet — Act III Analysis",
    generatedAt: "Yesterday",
    content: `## Hamlet — Act III Key Themes

### "To be or not to be" Soliloquy
- Explores existential questions about life and death
- Hamlet's internal conflict between action and inaction
- Philosophical meditation on suffering vs. the unknown

### The Play Within a Play
- "The Mousetrap" — Hamlet's plan to catch Claudius
- Metatheatrical device questioning appearance vs. reality
- Claudius's reaction confirms his guilt

### Key Quotes
• "The lady doth protest too much, methinks" — Gertrude
• "Suit the action to the word" — Hamlet to the players`,
    tags: ["Shakespeare", "Hamlet", "Drama"],
  },
];

function AiNotes() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Notes"
        description="AI-generated study notes from your course content."
      >
        <Button className="rounded-full bg-gradient-primary shadow-soft hover:opacity-95">
          <Sparkles className="mr-1 h-4 w-4" /> Generate Notes
        </Button>
      </PageHeader>

      {/* Filters */}
      <Card className="rounded-2xl border-border/60 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select defaultValue="all">
              <SelectTrigger className="w-[200px] rounded-xl">
                <SelectValue placeholder="Filter by course" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Courses</SelectItem>
                <SelectItem value="math">Advanced Mathematics</SelectItem>
                <SelectItem value="physics">
                  Physics Fundamentals
                </SelectItem>
                <SelectItem value="english">English Literature</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Select defaultValue="all-modules">
            <SelectTrigger className="w-[180px] rounded-xl">
              <SelectValue placeholder="Filter by module" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all-modules">All Modules</SelectItem>
              <SelectItem value="m1">Module 1</SelectItem>
              <SelectItem value="m2">Module 2</SelectItem>
              <SelectItem value="m3">Module 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Notes Cards */}
      <div className="space-y-6">
        {notes.map((note) => (
          <Card
            key={note.id}
            className="rounded-2xl border-border/60 transition-all hover:shadow-card-soft"
          >
            {/* Note Header */}
            <div className="flex flex-col gap-3 border-b border-border/60 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                  <StickyNote className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-base font-semibold">
                    {note.chapter}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {note.course} · {note.module}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" /> {note.generatedAt}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 rounded-full text-xs"
                >
                  <Copy className="h-3 w-3" /> Copy
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 rounded-full text-xs"
                >
                  <RefreshCw className="h-3 w-3" /> Regenerate
                </Button>
              </div>
            </div>

            {/* Note Content */}
            <div className="p-5">
              <div className="prose prose-sm max-w-none text-foreground">
                {note.content.split("\n").map((line, i) => {
                  if (line.startsWith("## "))
                    return (
                      <h2
                        key={i}
                        className="mb-2 font-display text-lg font-semibold"
                      >
                        {line.replace("## ", "")}
                      </h2>
                    );
                  if (line.startsWith("### "))
                    return (
                      <h3
                        key={i}
                        className="mb-1 mt-3 font-display text-sm font-semibold text-primary"
                      >
                        {line.replace("### ", "")}
                      </h3>
                    );
                  if (line.startsWith("• ") || line.startsWith("- "))
                    return (
                      <p
                        key={i}
                        className="ml-4 text-sm text-muted-foreground"
                      >
                        {line}
                      </p>
                    );
                  if (line.match(/^\d+\./))
                    return (
                      <p
                        key={i}
                        className="ml-4 text-sm text-muted-foreground"
                      >
                        {line}
                      </p>
                    );
                  if (line.trim() === "") return <div key={i} className="h-2" />;
                  return (
                    <p key={i} className="text-sm">
                      {line}
                    </p>
                  );
                })}
              </div>

              {/* Tags */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {note.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="rounded-full border-primary/20 bg-primary/5 text-[10px] text-primary"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
