import { createFileRoute } from "@tanstack/react-router";
import { Award, Download, Calendar, BookOpen } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/student/certificates")({
  head: () => ({
    meta: [{ title: "Certificates — Student — 2CaRvN" }],
  }),
  component: CertificatesPage,
});

const certificates = [
  {
    id: 1,
    title: "Computer Science — Grade 11",
    issuedAt: "Nov 15, 2024",
    instructor: "Mr. Anil Mehta",
    score: "92%",
    credentialId: "CERT-2CARVN-CS11-001",
    accent: "from-primary-deep to-primary",
  },
  {
    id: 2,
    title: "English Literature — Module 8",
    issuedAt: "Dec 10, 2024",
    instructor: "Ms. Aparna Das",
    score: "88%",
    credentialId: "CERT-2CARVN-ENG10-008",
    accent: "from-primary to-primary-glow",
  },
  {
    id: 3,
    title: "Physics — Mechanics Module",
    issuedAt: "Oct 22, 2024",
    instructor: "Prof. Sunita Rao",
    score: "85%",
    credentialId: "CERT-2CARVN-PHY11-003",
    accent: "from-primary-glow to-primary",
  },
];

function CertificatesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Certificates"
        description={`You've earned ${certificates.length} certificates. Keep learning to unlock more!`}
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {certificates.map((cert) => (
          <Card
            key={cert.id}
            className="group overflow-hidden rounded-2xl border-border/60 transition-all hover:-translate-y-1 hover:shadow-glow"
          >
            {/* Certificate visual */}
            <div
              className={`relative bg-gradient-to-br p-8 text-center text-primary-foreground ${cert.accent}`}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent_50%)]" />
              <div className="relative">
                <Award className="mx-auto h-12 w-12 opacity-90" />
                <p className="mt-3 font-display text-lg font-bold">
                  Certificate of Completion
                </p>
                <p className="mt-1 text-sm text-primary-foreground/80">
                  {cert.title}
                </p>
              </div>
              {/* Decorative border */}
              <div className="absolute inset-3 rounded-xl border border-dashed border-primary-foreground/20" />
            </div>

            {/* Details */}
            <div className="p-5">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>Instructor: {cert.instructor}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Issued: {cert.issuedAt}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Award className="h-3.5 w-3.5" />
                  <span>Score: {cert.score}</span>
                </div>
              </div>

              <div className="mt-3">
                <code className="rounded bg-muted px-2 py-1 text-[11px] text-muted-foreground">
                  {cert.credentialId}
                </code>
              </div>

              <Button className="mt-4 w-full rounded-full bg-gradient-primary shadow-soft hover:opacity-95">
                <Download className="mr-1 h-4 w-4" /> Download Certificate
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
