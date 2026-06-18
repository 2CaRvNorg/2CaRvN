import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

export const Route = createFileRoute("/instructors")({
  head: () => ({
    meta: [
      { title: "Instructors — 2CaRvN" },
      { name: "description", content: "Learn from practitioners shipping at Linear, Figma, Stripe, OpenAI, and more." },
    ],
  }),
  component: Instructors,
});

const people = [
  { name: "Maya Okonkwo", role: "Design Lead, Figma", courses: 8, students: "42k" },
  { name: "Daniel Reyes", role: "Staff Engineer, Vercel", courses: 6, students: "31k" },
  { name: "Aisha Bennett", role: "Head of Product, Linear", courses: 4, students: "18k" },
  { name: "Liam Karlsson", role: "Brand Director, Loom", courses: 5, students: "22k" },
  { name: "Sofia Mendes", role: "Data Scientist, Spotify", courses: 7, students: "28k" },
  { name: "Noah Levi", role: "AI Researcher, OpenAI", courses: 3, students: "51k" },
];

function Instructors() {
  return (
    <Layout>
      <section className="bg-gradient-hero">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <h1 className="font-display text-5xl font-bold tracking-tight sm:text-6xl max-w-3xl">Taught by people who <span className="text-gradient-primary">actually do the work.</span></h1>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">Every instructor is vetted, currently shipping, and trained to teach.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {people.map((p) => (
            <Card key={p.name} className="rounded-2xl border-border/60 p-6 text-center transition-all hover:-translate-y-1 hover:shadow-card-soft">
              <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-primary-glow to-primary-deep shadow-glow" />
              <h3 className="mt-4 font-display text-xl font-semibold">{p.name}</h3>
              <p className="text-sm text-muted-foreground">{p.role}</p>
              <div className="mt-4 flex items-center justify-center gap-4 text-sm">
                <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-primary text-primary" /> 4.9</span>
                <span className="text-muted-foreground">{p.courses} courses</span>
                <span className="text-muted-foreground">{p.students} students</span>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </Layout>
  );
}
