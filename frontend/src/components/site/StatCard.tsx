import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: string;
  trendUp?: boolean;
  accent?: boolean;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  trendUp,
  accent = false,
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden rounded-2xl border-border/60 p-6 transition-all hover:-translate-y-0.5 hover:shadow-card-soft",
        accent && "bg-gradient-primary text-primary-foreground",
      )}
    >
      {accent && (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.2),transparent_50%)]" />
      )}
      <div className="relative flex items-start justify-between">
        <div>
          <p
            className={cn(
              "text-sm font-medium",
              accent ? "text-primary-foreground/80" : "text-muted-foreground",
            )}
          >
            {label}
          </p>
          <p className="mt-2 font-display text-3xl font-bold tracking-tight">
            {value}
          </p>
          {trend && (
            <p
              className={cn(
                "mt-1 text-xs font-medium",
                accent
                  ? "text-primary-foreground/70"
                  : trendUp
                    ? "text-emerald-600"
                    : "text-red-500",
              )}
            >
              {trendUp ? "↑" : "↓"} {trend}
            </p>
          )}
        </div>
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-xl transition-colors",
            accent
              ? "bg-primary-foreground/20"
              : "bg-accent text-primary group-hover:bg-gradient-primary group-hover:text-primary-foreground",
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}
