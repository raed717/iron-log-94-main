import { useState } from "react";
import Header from "@/components/layout/Header";
import { useWorkoutSessions } from "@/hooks/useWorkoutData";
import SessionDetails from "@/components/history/SessionDetails";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const History = () => {
  const { sessions, loading } = useWorkoutSessions();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="font-display text-4xl">History</h1>
          <p className="text-muted-foreground">Your past workout sessions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-2">
            <div className="rounded-xl border border-border bg-gradient-card p-4">
              <h3 className="font-semibold mb-2">Sessions</h3>
              {loading && <div className="text-sm text-muted-foreground">Loading...</div>}
              {!loading && sessions.length === 0 && (
                <div className="text-sm text-muted-foreground">No sessions yet</div>
              )}
              <div className="space-y-2 mt-2">
                {sessions.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelected(s.id)}
                    className={cn(
                      "w-full text-left p-3 rounded-md hover:bg-secondary/50",
                      selected === s.id ? "bg-primary/10 border border-primary" : ""
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{s.session_name || "Workout"}</div>
                        <div className="text-xs text-muted-foreground">{format(new Date(s.session_date), 'PPP')}</div>
                      </div>
                      <div className="text-sm text-muted-foreground">{s.duration_minutes ? `${s.duration_minutes}m` : "-"}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-xl border border-border bg-gradient-card p-6">
              {selected ? (
                <SessionDetails sessionId={selected} />
              ) : (
                <div className="text-muted-foreground">Select a session to view details</div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default History;
