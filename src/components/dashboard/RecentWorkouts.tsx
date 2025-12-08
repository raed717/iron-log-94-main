import { useEffect, useMemo, useState } from "react";
import { Calendar, Dumbbell, TrendingUp } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { exercises } from "@/data/exercises";
import { cn } from "@/lib/utils";

interface RecentWorkoutsProps {
  logs?: Array<{ id: string; exercise_id?: string; exerciseId?: string; created_at?: string }>;
}

type SetRow = { workout_log_id: string; weight: number; reps: number };
type WorkoutLog = { id: string; exercise_id?: string; exerciseId?: string; created_at?: string };

const RecentWorkouts = ({ logs }: RecentWorkoutsProps) => {
  const [sets, setSets] = useState<Record<string, SetRow[]>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSets = async () => {
      if (!logs || logs.length === 0) {
        setSets({});
        return;
      }

      setLoading(true);
      try {
        const logIds = logs.map(l => l.id);
        const { data, error } = await supabase
          .from("workout_sets")
          .select("workout_log_id, weight, reps")
          .in("workout_log_id", logIds);

        if (error) throw error;

        const map: Record<string, SetRow[]> = {};
        (data || []).forEach((row: SetRow) => {
          const lid = row.workout_log_id as string;
          map[lid] = map[lid] || [];
          map[lid].push({ workout_log_id: lid, weight: Number(row.weight), reps: Number(row.reps) });
        });

        setSets(map);
      } catch (err) {
        console.error("Failed to fetch sets for recent workouts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSets();
  }, [logs]);

  const grouped = useMemo(() => {
    if (!logs || logs.length === 0) return {} as Record<string, WorkoutLog[]>;
    return logs.reduce((acc: Record<string, WorkoutLog[]>, log) => {
      const date = log.created_at ? new Date(log.created_at).toISOString().split("T")[0] : "unknown";
      acc[date] = acc[date] || [];
      acc[date].push(log);
      return acc;
    }, {} as Record<string, WorkoutLog[]>);
  }, [logs]);

  const sortedDates = useMemo(() => Object.keys(grouped).sort((a, b) => new Date(b).getTime() - new Date(a).getTime()).slice(0, 5), [grouped]);

  if (!logs || logs.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-gradient-card p-6 opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-xl tracking-wide text-foreground">Recent Activity</h3>
          <Calendar className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">No workouts logged yet</p>
          <p className="text-xs text-muted-foreground/60">Start logging to see activity</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-gradient-card p-6 opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-xl tracking-wide text-foreground">Recent Activity</h3>
        <Calendar className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="space-y-4">
        {sortedDates.map((date, dateIndex) => {
          const dayLogs = grouped[date];

          const totalVolume = dayLogs.reduce((acc: number, log: WorkoutLog) => {
            const logSets = sets[log.id] || [];
            return acc + logSets.reduce((sa, s) => sa + (s.weight * s.reps), 0);
          }, 0);

          return (
            <div key={date} className={cn("p-4 rounded-lg bg-secondary/50 border border-border/50", "opacity-0 animate-slide-in-right")} style={{ animationDelay: `${300 + dateIndex * 100}ms` }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-primary">{new Date(date).toLocaleDateString()}</span>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3" />
                  <span>{totalVolume.toLocaleString()} kg</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {dayLogs.slice(0, 4).map((log: WorkoutLog) => {
                  const exercise = exercises.find(e => e.id === (log.exercise_id || log.exerciseId));
                  const logSets = sets[log.id] || [];
                  const maxWeight = logSets.length ? Math.max(...logSets.map(s => s.weight)) : 0;
                  return (
                    <div key={log.id} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/50 text-xs">
                      <Dumbbell className="h-3 w-3 text-primary" />
                      <span className="text-foreground/80">{exercise?.name || (log.exercise_id || log.exerciseId)}</span>
                      <span className="text-muted-foreground">{logSets.length}×{Math.round(maxWeight)}kg</span>
                    </div>
                  );
                })}
                {dayLogs.length > 4 && (
                  <span className="px-3 py-1.5 text-xs text-muted-foreground">+{dayLogs.length - 4} more</span>
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
