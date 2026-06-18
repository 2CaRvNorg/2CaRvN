import { createFileRoute, Link } from "@tanstack/react-router";
import { GraduationCap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/auth/school-admin-login")({
  head: () => ({
    meta: [
      { title: "School Admin Login — 2CaRvN" },
      {
        name: "description",
        content: "Sign in to your school admin dashboard.",
      },
    ],
  }),
  component: SchoolAdminLogin,
});

function SchoolAdminLogin() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4">
      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-hero" />
      <div className="pointer-events-none absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-[400px] w-[400px] rounded-full bg-primary-glow/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <Link to="/" className="group flex items-center gap-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-primary shadow-glow transition-transform group-hover:scale-105">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-display text-2xl font-bold tracking-tight">
              2CaRvN<span className="text-primary">.</span>
            </span>
          </Link>
          <p className="mt-3 text-sm text-muted-foreground">
            School Administration Portal
          </p>
        </div>

        {/* Login Card */}
        <Card className="rounded-2xl border-border/60 bg-card/95 p-8 shadow-card-soft backdrop-blur-xl">
          <div className="mb-6">
            <h1 className="font-display text-2xl font-bold tracking-tight">
              Welcome back
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign in to manage your school's learning platform.
            </p>
          </div>

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="school-code">School Code</Label>
              <Input
                id="school-code"
                placeholder="e.g. SCH-2024-001"
                className="h-11 rounded-xl border-border bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter your username"
                className="h-11 rounded-xl border-border bg-background"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="h-11 rounded-xl border-border bg-background"
              />
            </div>

            <Button
              type="submit"
              className="h-11 w-full rounded-xl bg-gradient-primary shadow-soft hover:opacity-95"
              asChild
            >
              <Link to="/school-admin">
                Sign in <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Are you a student?{" "}
              <Link
                to="/auth/student-login"
                className="font-medium text-primary hover:underline"
              >
                Student Login →
              </Link>
            </p>
          </div>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} 2CaRvN Learning. All rights reserved.
        </p>
      </div>
    </div>
  );
}
