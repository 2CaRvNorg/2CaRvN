import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — 2CaRvN" },
      { name: "description", content: "Simple pricing. Cancel anytime. 7-day free trial on all plans." },
    ],
  }),
  component: Pricing,
});

const plans = [
  { name: "Curious", price: "$0", period: "forever", desc: "Sample any course, no card required.", features: ["50+ free intro lessons", "Community access", "Weekly newsletter"], cta: "Get started" },
  { name: "Pro", price: "$19", period: "/month", desc: "Unlimited access to every on-demand course.", features: ["4,200+ courses", "AI mentor 24/7", "Verified certificates", "Offline downloads", "Priority support"], cta: "Start 7-day trial", popular: true },
  { name: "Cohort", price: "$49", period: "/month", desc: "Everything in Pro, plus live cohort-based learning.", features: ["All Pro features", "Live cohorts & office hours", "1:1 mentor sessions", "Career coaching", "Hiring partner intros"], cta: "Join a cohort" },
];

function Pricing() {
  return (
    <Layout>
      <section className="bg-gradient-hero">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h1 className="font-display text-5xl font-bold tracking-tight sm:text-6xl">Pricing that <span className="text-gradient-primary">respects your time.</span></h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">Pick a plan. Try it free for 7 days. Switch or cancel whenever.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((p) => (
            <Card key={p.name} className={`relative rounded-3xl p-8 ${p.popular ? "border-primary bg-gradient-primary text-primary-foreground shadow-glow" : "border-border/60 bg-card"}`}>
              {p.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-background px-3 py-1 text-xs font-semibold text-primary shadow-card-soft">Most popular</span>
              )}
              <h3 className="font-display text-2xl font-bold">{p.name}</h3>
              <p className={`mt-2 text-sm ${p.popular ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{p.desc}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-display text-5xl font-bold">{p.price}</span>
                <span className={p.popular ? "text-primary-foreground/80" : "text-muted-foreground"}>{p.period}</span>
              </div>
              <Button className={`mt-6 w-full rounded-full ${p.popular ? "bg-background text-foreground hover:bg-background/90" : "bg-gradient-primary"}`} size="lg">{p.cta}</Button>
              <ul className="mt-8 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className={`mt-0.5 h-4 w-4 shrink-0 ${p.popular ? "" : "text-primary"}`} />
                    {f}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>
    </Layout>
  );
}
