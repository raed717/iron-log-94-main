import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useExercises } from "@/hooks/useExercises";
import { Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


type WorkoutSetRow = {
  id: string;
  workout_log_id: string;
  weight: number;
  reps: number;
  set_number: number;
};

type WorkoutLogRow = {
  id: string;
  exercise_id: string;
  notes?: string | null;
  created_at: string;
  img_url?: string;
  workout_sets?: WorkoutSetRow[];
};

interface SessionDetailsProps {
  sessionId: string;
}

const SessionDetails = ({ sessionId }: SessionDetailsProps) => {
  const [logs, setLogs] = useState<WorkoutLogRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Record<string, { weight: number; reps: number; saving?: boolean }>>({});
  const { exercises, loading: exercisesLoading } = useExercises();

  useEffect(() => {
    if (!sessionId) return;
    const fetch = async () => {
      setLoading(true);
      try {
        // fetch logs with nested sets
        const { data, error } = await supabase
          .from("workout_logs")
          .select("id, exercise_id, notes, created_at, workout_sets(*)")
          .eq("workout_session_id", sessionId)
          .order("created_at", { ascending: true });

        if (error) throw error;

        setLogs((data as WorkoutLogRow[]) || []);
      } catch (err) {
        console.error("Failed to fetch session logs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [sessionId]);

  if (loading) return <div className="p-4">Loading session...</div>;

  if (!logs || logs.length === 0) return <div className="p-4 text-sm text-muted-foreground">No exercises logged for this session.</div>;
  // Group logs by exercise category
  const groups = logs.reduce((acc: Record<string, WorkoutLogRow[]>, log) => {
    const ex = exercises.find((e) => e.id === log.exercise_id);
    const cat = ex?.category || 'uncategorized';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(log);
    return acc;
  }, {} as Record<string, WorkoutLogRow[]>);

  const sortedCategories = Object.keys(groups).sort();

  return (
    <div className="space-y-6">
      {sortedCategories.map((category) => (
        <div key={category}>
          <h4 className="text-sm font-semibold mb-2 capitalize">{category}</h4>
          <div className="space-y-4">
            {groups[category].map((log) => {
              const exercise = exercises.find((e) => e.id === log.exercise_id);
              const sets = log.workout_sets || [];
              const totalVolume = sets.reduce((a, s) => a + (s.weight * s.reps), 0);

              return (
                <div key={log.id} className="p-4 rounded-lg border border-border bg-gradient-card">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {exercise?.img_url && (
                        <img src={exercise.img_url} alt={exercise.name} className="h-8 w-8 object-cover rounded-md mr-2 inline-block" />
                      )}
                      <div>
                        <div className="font-semibold">{exercise?.name || log.exercise_id}</div>
                        {log.notes && <div className="text-xs text-muted-foreground">{log.notes}</div>}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">{totalVolume.toLocaleString()} kg</div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2 text-xs">
                    {sets.map((s) => {
                      const edit = editing[s.id];
                      return (
                        <div key={s.id} className="p-2 rounded-md bg-secondary/40">
                          <div className="flex items-center justify-between mb-1">
                            <div className="font-medium">Set {s.set_number}</div>
                            {!edit && (
                              <Button size="sm" variant="ghost" onClick={() => setEditing(prev => ({ ...prev, [s.id]: { weight: s.weight, reps: s.reps } }))}>
                                Edit
                              </Button>
                            )}
                          </div>

                          {!edit ? (
                            <>
                              <div className="text-muted-foreground">{s.reps} reps</div>
                              <div className="text-muted-foreground">{s.weight} kg</div>
                            </>
                          ) : (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Input type="number" value={String(edit.weight)} onChange={(e) => setEditing(prev => ({ ...prev, [s.id]: { ...prev[s.id], weight: Number(e.target.value) } }))} className="w-24" />
                                <span className="text-xs text-muted-foreground">kg</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Input type="number" value={String(edit.reps)} onChange={(e) => setEditing(prev => ({ ...prev, [s.id]: { ...prev[s.id], reps: Number(e.target.value) } }))} className="w-24" />
                                <span className="text-xs text-muted-foreground">reps</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button size="sm" onClick={async () => {
                                  try {
                                    setEditing(prev => ({ ...prev, [s.id]: { ...prev[s.id], saving: true } }));
                                    const updated = editing[s.id];
                                    const { error } = await supabase
                                      .from('workout_sets')
                                      .update({ weight: updated.weight, reps: updated.reps })
                                      .eq('id', s.id);
                                    if (error) throw error;

                                    // update local state
                                    setLogs(prevLogs => prevLogs.map(logItem => ({
                                      ...logItem,
                                      workout_sets: logItem.workout_sets?.map(ws => ws.id === s.id ? { ...ws, weight: updated.weight, reps: updated.reps } : ws)
                                    })));

                                    // remove editing state for this set
                                    setEditing(prev => {
                                      const copy = { ...prev };
                                      delete copy[s.id];
                                      return copy;
                                    });
                                  } catch (err) {
                                    console.error('Failed to update set:', err);
                                    setEditing(prev => ({ ...prev, [s.id]: { ...prev[s.id], saving: false } }));
                                  }
                                }}>
                                  Save
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => setEditing(prev => { const copy = { ...prev }; delete copy[s.id]; return copy; })}>
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SessionDetails;
