import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Star, Clock, Users, Play } from "lucide-react";

export const Route = createFileRoute("/courses")({
  head: () => ({
    meta: [
      { title: "Courses — 2CaRvN" },
      { name: "description", content: "Browse 4,000+ courses across design, development, business, AI, and more." },
    ],
  }),
  component: Courses,
});

const filters = ["All", "Development", "Design", "Business", "AI & ML", "Marketing", "Photography"];

const courses = Array.from({ length: 9 }).map((_, i) => ({
  title: [
    "Designing for the modern web",
    "Full-stack React with TypeScript",
    "Product strategy fundamentals",
    "Brand identity that resonates",
    "Data visualization with D3",
    "Prompt engineering masterclass",
    "Growth marketing playbook",
    "Cinematic photography",
    "System design interview prep",
  ][i],
  instructor: ["Maya O.", "Daniel R.", "Aisha B.", "Liam K.", "Sofia M.", "Noah L.", "Eva T.", "Jonas P.", "Riya V."][i],
  rating: (4.7 + (i % 3) * 0.1).toFixed(1),
  students: `${(2 + i * 1.4).toFixed(1)}k`,
  hours: 8 + i * 2,
  price: `$${39 + i * 10}`,
  tag: ["Bestseller", "New", "Live", "Bestseller", "New", "Live", "Bestseller", "New", "Live"][i],
}));

function Courses() {
  return (
    <Layout>
      <section className="bg-gradient-hero">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <h1 className="font-display text-5xl font-bold tracking-tight sm:text-6xl">Every course, <span className="text-gradient-primary">one library.</span></h1>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">4,200 courses. 380 live cohorts. One subscription.</p>
          <div className="relative mt-8 max-w-xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search courses, skills, instructors…" className="h-14 rounded-full border-border bg-card pl-12 text-base shadow-card-soft" />
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {filters.map((f, i) => (
              <Button key={f} variant={i === 0 ? "default" : "outline"} className={`rounded-full ${i === 0 ? "bg-gradient-primary" : "border-border"}`} size="sm">{f}</Button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((c, i) => (
            <Card key={i} className="group overflow-hidden rounded-2xl border-border/60 transition-all hover:-translate-y-1 hover:shadow-glow">
              <div className="relative aspect-[16/10] bg-gradient-primary">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.3),transparent_50%)]" />
                <Badge className="absolute left-4 top-4 rounded-full border-0 bg-background/95 text-foreground hover:bg-background">{c.tag}</Badge>
                <div className="absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-background/95 text-primary shadow-soft">
                  <Play className="h-5 w-5 fill-current" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-semibold leading-tight">{c.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">by {c.instructor}</p>
                <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-primary text-primary" /> {c.rating}</span>
                  <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {c.students}</span>
                  <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {c.hours}h</span>
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-border pt-5">
                  <span className="font-display text-2xl font-bold">{c.price}</span>
                  <Button size="sm" className="rounded-full bg-gradient-primary">Enroll</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </Layout>
  );
}
