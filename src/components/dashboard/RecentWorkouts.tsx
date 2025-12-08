import { WorkoutLog } from "@/types/workout";
import { exercises } from "@/data/exercises";
import { Calendar, Dumbbell, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecentWorkoutsProps {
  logs: WorkoutLog[];
}

const RecentWorkouts = ({ logs }: RecentWorkoutsProps) => {
  // Group logs by date
  const groupedLogs = logs.reduce((acc, log) => {
    if (!acc[log.date]) {
      acc[log.date] = [];
    }
    acc[log.date].push(log);
    return acc;
  }, {} as Record<string, WorkoutLog[]>);

  const sortedDates = Object.keys(groupedLogs).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  ).slice(0, 5);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (dateStr === today.toISOString().split('T')[0]) return "Today";
    if (dateStr === yesterday.toISOString().split('T')[0]) return "Yesterday";
    
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="rounded-xl border border-border bg-gradient-card p-6 opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-xl tracking-wide text-foreground">Recent Activity</h3>
        <Calendar className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="space-y-4">
        {sortedDates.map((date, dateIndex) => {
          const dayLogs = groupedLogs[date];
          const totalVolume = dayLogs.reduce(
            (acc, log) => acc + log.sets.reduce((setAcc, set) => setAcc + set.weight * set.reps, 0),
            0
          );

          return (
            <div 
              key={date} 
              className={cn(
                "p-4 rounded-lg bg-secondary/50 border border-border/50",
                "opacity-0 animate-slide-in-right"
              )}
              style={{ animationDelay: `${300 + dateIndex * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-primary">
                  {formatDate(date)}
                </span>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3" />
                  <span>{totalVolume.toLocaleString()} kg</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {dayLogs.slice(0, 4).map((log, logIndex) => {
                  const exercise = exercises.find(e => e.id === log.exerciseId);
                  return (
                    <div 
                      key={log.id}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/50 text-xs"
                    >
                      <Dumbbell className="h-3 w-3 text-primary" />
                      <span className="text-foreground/80">{exercise?.name || log.exerciseId}</span>
                      <span className="text-muted-foreground">
                        {log.sets.length}×{Math.round(Math.max(...log.sets.map(s => s.weight)))}kg
                      </span>
                    </div>
                  );
                })}
                {dayLogs.length > 4 && (
                  <span className="px-3 py-1.5 text-xs text-muted-foreground">
                    +{dayLogs.length - 4} more
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentWorkouts;
