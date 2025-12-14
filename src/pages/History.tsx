import { useState } from "react";
import Header from "@/components/layout/Header";
import { useWorkoutSessions } from "@/hooks/useWorkoutData";
import SessionDetails from "@/components/history/SessionDetails";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Pencil, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { updateSessionName } from "@/hooks/useWorkoutData";
import { Button } from "@/components/ui/button";

const History = () => {
  const { sessions, loading, refetch } = useWorkoutSessions();
  const [selected, setSelected] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const handleStartEdit = (e: React.MouseEvent, session: any) => {
    e.stopPropagation();
    setEditingId(session.id);
    setEditName(session.session_name || "Workout");
  };

  const handleSaveEdit = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!editingId) return;

    try {
      await updateSessionName(editingId, editName);
      toast.success("Session updated successfully");
      setEditingId(null);
      refetch();
    } catch (error) {
      toast.error("Failed to update session");
    }
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
    setEditName("");
  };

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
                  <div
                    key={s.id}
                    onClick={() => setSelected(s.id)}
                    className={cn(
                      "w-full text-left p-3 rounded-md hover:bg-secondary/50 cursor-pointer group transition-colors",
                      selected === s.id ? "bg-primary/10 border border-primary" : ""
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0 mr-4">
                        <div className="flex items-center gap-2">
                          {editingId === s.id ? (
                            <div className="flex items-center gap-1 flex-1" onClick={(e) => e.stopPropagation()}>
                              <Input
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="h-7 text-sm py-1 px-2"
                                autoFocus
                              />
                              <Button size="icon" variant="ghost" className="h-7 w-7 text-green-500" onClick={handleSaveEdit}>
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500" onClick={handleCancelEdit}>
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <>
                              <div className="font-medium truncate">{s.session_name || "Workout"}</div>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => handleStartEdit(e, s)}
                              >
                                <Pencil className="h-3 w-3" />
                              </Button>
                            </>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">{format(new Date(s.session_date), 'PPP')}</div>
                      </div>
                      <div className="text-sm text-muted-foreground whitespace-nowrap">{s.duration_minutes ? `${s.duration_minutes}m` : "-"}</div>
                    </div>
                  </div>
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
