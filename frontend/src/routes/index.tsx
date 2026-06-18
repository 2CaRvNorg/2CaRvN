import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import heroImg from "@/assets/hero-student.jpg";
import {
  Sparkles, ArrowRight, Play, Star, Users, Clock, Award,
  Code2, Palette, LineChart, Camera, Brain, Megaphone, Check,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "2CaRvN — Learning that feels alive" },
      { name: "description", content: "Master in-demand skills with world-class instructors. Bite-sized lessons, live cohorts, and certificates that count." },
      { property: "og:title", content: "2CaRvN — Learning that feels alive" },
      { property: "og:description", content: "Bite-sized lessons, live cohorts, and certificates that count." },
    ],
  }),
  component: Home,
});

const categories = [
  { icon: Code2, name: "Development", count: "1,240" },
  { icon: Palette, name: "Design", count: "860" },
  { icon: LineChart, name: "Business", count: "720" },
  { icon: Camera, name: "Photography", count: "410" },
  { icon: Brain, name: "AI & ML", count: "520" },
  { icon: Megaphone, name: "Marketing", count: "380" },
];

const courses = [
  {
    tag: "Bestseller",
    title: "Designing for the modern web",
    instructor: "Maya Okonkwo",
    rating: 4.9,
    students: "12.4k",
    hours: 18,
    price: "$49",
    accent: "from-primary to-primary-glow",
  },
  {
    tag: "New",
    title: "Full-stack React with TypeScript",
    instructor: "Daniel Reyes",
    rating: 4.8,
    students: "8.1k",
    hours: 26,
    price: "$59",
    accent: "from-primary-deep to-primary",
  },
  {
    tag: "Live cohort",
    title: "Product strategy fundamentals",
    instructor: "Aisha Bennett",
    rating: 4.9,
    students: "3.2k",
    hours: 12,
    price: "$129",
    accent: "from-primary-glow to-primary",
  },
];

const logos = ["Notion", "Linear", "Figma", "Vercel", "Stripe", "Loom", "Airbnb", "Spotify"];

function Home() {
  return (
    <Layout>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="mx-auto grid max-w-7xl gap-16 px-4 pt-16 pb-24 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:pt-24 lg:pb-32">
          <div className="relative z-10 flex flex-col justify-center">
            <Badge className="w-fit gap-1.5 rounded-full border-primary/20 bg-primary/10 px-3 py-1.5 text-primary hover:bg-primary/15" variant="outline">
              <Sparkles className="h-3.5 w-3.5" /> New · AI mentor in every course
            </Badge>
            <h1 className="mt-6 font-display text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Learning that <span className="text-gradient-primary">feels alive.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Bite-sized lessons, live cohorts, hands-on projects. Build skills that move careers — taught by people who actually do the work.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" className="rounded-full bg-gradient-primary px-6 shadow-glow hover:opacity-95">
                Start free trial <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-full border-foreground/15 px-6">
                <Play className="mr-1 h-4 w-4 fill-current" /> Watch demo
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="h-8 w-8 rounded-full border-2 border-background bg-gradient-to-br from-primary-glow to-primary-deep" />
                  ))}
                </div>
                <span><span className="font-semibold text-foreground">250k+</span> active learners</span>
              </div>
              <div className="flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-primary text-primary" />)}
                <span className="ml-1"><span className="font-semibold text-foreground">4.9</span> on Trustpilot</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-8 -z-10 rounded-[3rem] bg-gradient-primary opacity-20 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card shadow-glow">
              <img src={heroImg} alt="Student learning online" width={1280} height={1280} className="aspect-square w-full object-cover" />
            </div>

            <Card className="absolute -left-6 top-10 hidden gap-3 rounded-2xl border-border/60 bg-card/95 p-4 shadow-card-soft backdrop-blur-xl sm:flex animate-float">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Award className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-xs text-muted-foreground">Certificate earned</p>
                <p className="text-sm font-semibold">UI Design — Level 2</p>
              </div>
            </Card>

            <Card className="absolute -right-6 bottom-10 hidden w-56 rounded-2xl border-border/60 bg-card/95 p-4 shadow-card-soft backdrop-blur-xl sm:block animate-float" style={{ animationDelay: "1.5s" }}>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Weekly progress</span>
                <span className="font-semibold text-primary">+24%</span>
              </div>
              <div className="mt-3 flex h-16 items-end gap-1.5">
                {[40, 65, 50, 80, 45, 90, 75].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-primary-deep to-primary-glow" style={{ height: `${h}%` }} />
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* logos marquee */}
        <div className="relative border-y border-border/60 bg-background/60 py-8 backdrop-blur-sm">
          <p className="mb-6 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">Teams learning with 2CaRvN</p>
          <div className="flex overflow-hidden">
            <div className="flex shrink-0 animate-marquee gap-16 pr-16">
              {[...logos, ...logos].map((l, i) => (
                <span key={i} className="font-display text-2xl font-semibold text-muted-foreground/60">{l}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-primary">Explore</p>
            <h2 className="mt-2 max-w-xl font-display text-4xl font-bold tracking-tight sm:text-5xl">Find your next obsession.</h2>
          </div>
          <Link to="/courses" className="text-sm font-medium text-primary hover:underline">Browse all categories →</Link>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <Card key={c.name} className="group flex cursor-pointer items-center gap-4 rounded-2xl border-border/60 p-5 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-card-soft">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-primary transition-colors group-hover:bg-gradient-primary group-hover:text-primary-foreground">
                <c.icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{c.name}</p>
                <p className="text-sm text-muted-foreground">{c.count} courses</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </Card>
          ))}
        </div>
      </section>

      {/* COURSES */}
      <section className="bg-secondary/40 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-primary">Trending</p>
              <h2 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">Loved by learners this week.</h2>
            </div>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((c) => (
              <Card key={c.title} className="group overflow-hidden rounded-2xl border-border/60 bg-card transition-all hover:-translate-y-1 hover:shadow-glow">
                <div className={`relative aspect-[16/10] bg-gradient-to-br ${c.accent}`}>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.3),transparent_50%)]" />
                  <Badge className="absolute left-4 top-4 rounded-full border-0 bg-background/95 text-foreground hover:bg-background">{c.tag}</Badge>
                  <div className="absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-background/95 text-primary shadow-soft transition-transform group-hover:scale-110">
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
                    <Button size="sm" variant="ghost" className="rounded-full text-primary hover:bg-primary/10">Enroll →</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-medium text-primary">Why 2CaRvN</p>
            <h2 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">A learning experience that actually sticks.</h2>
            <p className="mt-4 max-w-lg text-muted-foreground">
              We obsess over the small things — pacing, feedback, projects — so you finish with skills, not just certificates.
            </p>
            <div className="mt-8 space-y-4">
              {[
                "Project-based curriculum reviewed by industry mentors",
                "Live cohorts with weekly office hours and peer reviews",
                "Personal AI tutor available 24/7, trained on your course",
                "Verified certificates accepted by 1,200+ companies",
              ].map((f) => (
                <div key={f} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-primary">
                    <Check className="h-3.5 w-3.5 text-primary-foreground" />
                  </div>
                  <p className="text-sm">{f}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { stat: "98%", label: "Completion rate on cohort courses" },
              { stat: "4.9★", label: "Average instructor rating" },
              { stat: "1,200+", label: "Hiring partners worldwide" },
              { stat: "12 min", label: "Average lesson length" },
            ].map((s, i) => (
              <Card key={s.label} className={`rounded-2xl border-border/60 p-6 ${i % 3 === 0 ? "bg-gradient-primary text-primary-foreground" : "bg-card"}`}>
                <p className="font-display text-4xl font-bold">{s.stat}</p>
                <p className={`mt-2 text-sm ${i % 3 === 0 ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{s.label}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="bg-secondary/40 py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="flex justify-center gap-1">
            {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-primary text-primary" />)}
          </div>
          <p className="mt-6 font-display text-3xl font-medium leading-snug sm:text-4xl">
            "I went from tutorial hell to shipping a real product in 8 weeks. 2CaRvN's cohort format and mentor feedback changed how I learn — forever."
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary-glow to-primary-deep" />
            <div className="text-left">
              <p className="font-semibold">Priya Sharma</p>
              <p className="text-sm text-muted-foreground">Product Engineer at Linear</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-primary p-12 text-center text-primary-foreground shadow-glow sm:p-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.2),transparent_50%)]" />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl font-display text-4xl font-bold tracking-tight sm:text-5xl">Start learning today. Cancel anytime.</h2>
            <p className="mx-auto mt-4 max-w-xl text-primary-foreground/90">Get 7 days free. Full access to every course, cohort, and AI mentor.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button size="lg" className="rounded-full bg-background px-6 text-foreground hover:bg-background/90">Start free trial</Button>
              <Button size="lg" variant="outline" className="rounded-full border-primary-foreground/30 bg-transparent px-6 text-primary-foreground hover:bg-primary-foreground/10">View pricing</Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
