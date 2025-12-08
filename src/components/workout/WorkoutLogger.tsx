import { useState, useEffect } from "react";
import { Exercise, WorkoutSet, WorkoutLog } from "@/types/workout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus, Check, Trash2, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useSaveWorkout } from "@/hooks/useSaveWorkout";

interface WorkoutLoggerProps {
  exercise: Exercise;
  lastWorkout?: WorkoutLog;
  onSave?: (log: Omit<WorkoutLog, "id">) => void;
  onSaved?: () => void;
}

const WorkoutLogger = ({ exercise, lastWorkout, onSaved }: WorkoutLoggerProps) => {
  const [sets, setSets] = useState<WorkoutSet[]>([]);
  const { saveWorkout, loading: saving } = useSaveWorkout();

  useEffect(() => {
    // Initialize with last workout data or default
    if (lastWorkout) {
      setSets(lastWorkout.sets.map((set, idx) => ({
        ...set,
        id: `new-${idx}`,
        completed: false,
      })));
    } else {
      setSets([
        { id: "new-0", setNumber: 1, weight: 20, reps: 10, completed: false },
        { id: "new-1", setNumber: 2, weight: 20, reps: 10, completed: false },
        { id: "new-2", setNumber: 3, weight: 20, reps: 10, completed: false },
      ]);
    }
  }, [lastWorkout]);

  const addSet = () => {
    const lastSet = sets[sets.length - 1];
    setSets([
      ...sets,
      {
        id: `new-${sets.length}`,
        setNumber: sets.length + 1,
        weight: lastSet?.weight || 20,
        reps: lastSet?.reps || 10,
        completed: false,
      },
    ]);
  };

  const removeSet = (index: number) => {
    if (sets.length > 1) {
      const newSets = sets.filter((_, i) => i !== index).map((set, i) => ({
        ...set,
        setNumber: i + 1,
      }));
      setSets(newSets);
    }
  };

  const updateSet = (index: number, field: "weight" | "reps", value: number) => {
    const newSets = [...sets];
    newSets[index] = { ...newSets[index], [field]: Math.max(0, value) };
    setSets(newSets);
  };

  const toggleComplete = (index: number) => {
    const newSets = [...sets];
    newSets[index] = { ...newSets[index], completed: !newSets[index].completed };
    setSets(newSets);
  };

  const handleSave = async () => {
    const completedSets = sets.filter(s => s.completed);
    if (completedSets.length === 0) {
      toast.error("Complete at least one set before saving");
      return;
    }

    const result = await saveWorkout(
      exercise.id,
      completedSets.map(s => ({
        setNumber: s.setNumber || 1,
        weight: s.weight,
        reps: s.reps,
      }))
    );

    if (result) {
      toast.success("Workout logged successfully!", {
        description: `${completedSets.length} sets saved for ${exercise.name}`,
      });
      
      // Reset form
      setSets([
        { id: "new-0", setNumber: 1, weight: 20, reps: 10, completed: false },
        { id: "new-1", setNumber: 2, weight: 20, reps: 10, completed: false },
        { id: "new-2", setNumber: 3, weight: 20, reps: 10, completed: false },
      ]);

      // Call callback if provided
      if (onSaved) {
        onSaved();
      }
    } else {
      toast.error("Failed to save workout. Please try again.");
    }
  };

  const totalVolume = sets
    .filter(s => s.completed)
    .reduce((acc, set) => acc + set.weight * set.reps, 0);

  const lastVolume = lastWorkout
    ? lastWorkout.sets.reduce((acc, set) => acc + set.weight * set.reps, 0)
    : 0;

  const volumeChange = lastVolume > 0 
    ? Math.round(((totalVolume - lastVolume) / lastVolume) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Last workout reference */}
      {lastWorkout && (
        <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Last Session</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {lastWorkout.sets.map((set, idx) => (
              <div key={idx} className="text-sm text-muted-foreground">
                Set {set.setNumber}: <span className="text-foreground font-medium">{set.weight}kg × {set.reps}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sets */}
      <div className="space-y-3">
        <div className="grid grid-cols-12 gap-3 text-xs font-medium text-muted-foreground uppercase tracking-wider px-2">
          <div className="col-span-2">Set</div>
          <div className="col-span-4 text-center">Weight (kg)</div>
          <div className="col-span-4 text-center">Reps</div>
          <div className="col-span-2"></div>
        </div>

        {sets.map((set, index) => (
          <div
            key={set.id}
            className={cn(
              "grid grid-cols-12 gap-3 items-center p-3 rounded-lg border transition-all duration-200",
              set.completed 
                ? "bg-primary/10 border-primary/30" 
                : "bg-secondary/50 border-border"
            )}
          >
            <div className="col-span-2 font-display text-lg text-center">
              {set.setNumber}
            </div>

            <div className="col-span-4 flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => updateSet(index, "weight", set.weight - 2.5)}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <Input
                type="number"
                value={set.weight}
                onChange={(e) => updateSet(index, "weight", parseFloat(e.target.value) || 0)}
                className="text-center h-8 bg-background"
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => updateSet(index, "weight", set.weight + 2.5)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            <div className="col-span-4 flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => updateSet(index, "reps", set.reps - 1)}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <Input
                type="number"
                value={set.reps}
                onChange={(e) => updateSet(index, "reps", parseInt(e.target.value) || 0)}
                className="text-center h-8 bg-background"
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => updateSet(index, "reps", set.reps + 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            <div className="col-span-2 flex items-center justify-end gap-1">
              <Button
                variant={set.completed ? "default" : "outline"}
                size="icon"
                className={cn("h-8 w-8", set.completed && "bg-primary")}
                onClick={() => toggleComplete(index)}
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={() => removeSet(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Button variant="outline" className="w-full" onClick={addSet}>
        <Plus className="h-4 w-4 mr-2" />
        Add Set
      </Button>

      {/* Volume summary */}
      <div className="p-4 rounded-lg bg-gradient-card border border-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Volume</p>
            <p className="font-display text-3xl text-gradient-power">
              {totalVolume.toLocaleString()} kg
            </p>
          </div>
          {volumeChange !== 0 && (
            <div className={cn(
              "px-3 py-1 rounded-full text-sm font-semibold",
              volumeChange > 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
            )}>
              {volumeChange > 0 ? "+" : ""}{volumeChange}%
            </div>
          )}
        </div>
      </div>

      <Button variant="power" size="lg" className="w-full" onClick={handleSave} disabled={saving}>
        {saving ? "Saving..." : "Save Workout"}
      </Button>
    </div>
  );
};

export default WorkoutLogger;
