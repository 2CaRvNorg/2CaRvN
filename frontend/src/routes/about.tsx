import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — 2CaRvN" },
      { name: "description", content: "We're building the most human learning platform on the internet." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <Layout>
      <section className="bg-gradient-hero">
        <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
          <p className="text-sm font-medium text-primary">About 2CaRvN</p>
          <h1 className="mt-3 font-display text-5xl font-bold tracking-tight sm:text-6xl">We believe learning should feel like <span className="text-gradient-primary">a great conversation.</span></h1>
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
          <p>2CaRvN started in a tiny studio in Lisbon in 2022 with one stubborn belief: the internet has all the knowledge, but very little of the magic that makes a great teacher unforgettable.</p>
          <p>We obsess over the small things — the pacing of a lesson, the tone of feedback, the quiet click when a concept lands. Every course is built with a working practitioner and a learning designer, side by side.</p>
          <p>Today, more than 250,000 people learn with us across 140 countries. We're just getting started.</p>
        </div>
        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          {[{ k: "2022", v: "Founded in Lisbon" }, { k: "250k+", v: "Active learners" }, { k: "140", v: "Countries" }].map((s) => (
            <div key={s.k} className="rounded-2xl border border-border bg-card p-6">
              <p className="font-display text-3xl font-bold text-primary">{s.k}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.v}</p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
