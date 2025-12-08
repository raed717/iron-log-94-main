import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    positive: boolean;
  };
  variant?: "default" | "primary" | "accent";
  delay?: number;
}

const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  variant = "default",
  delay = 0 
}: StatCardProps) => {
  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-xl border border-border p-6 bg-gradient-card card-hover",
        "opacity-0 animate-fade-in"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Gradient overlay */}
      {variant === "primary" && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
      )}
      {variant === "accent" && (
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent pointer-events-none" />
      )}

      <div className="relative flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <p className={cn(
              "font-display text-4xl tracking-wide",
              variant === "primary" && "text-gradient-power",
              variant === "accent" && "text-gradient-energy",
              variant === "default" && "text-foreground"
            )}>
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            {trend && (
              <span className={cn(
                "text-sm font-semibold",
                trend.positive ? "text-green-400" : "text-red-400"
              )}>
                {trend.positive ? "+" : ""}{trend.value}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>

        <div className={cn(
          "p-3 rounded-lg",
          variant === "primary" && "bg-primary/20 text-primary",
          variant === "accent" && "bg-accent/20 text-accent",
          variant === "default" && "bg-secondary text-muted-foreground"
        )}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
