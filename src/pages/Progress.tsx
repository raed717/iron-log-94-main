import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import ProgressChart from "@/components/progress/ProgressChart";
import { exercises } from "@/data/exercises";
import { generateMockWorkoutLogs, generateMockExerciseStats } from "@/data/mockData";
import { WorkoutLog, ExerciseStats } from "@/types/workout";
import { categoryColors } from "@/data/exercises";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TrendingUp, Award, Target, Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";

const Progress = () => {
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>("bench-press");
  const [stats, setStats] = useState<ExerciseStats | null>(null);

  useEffect(() => {
    const mockLogs = generateMockWorkoutLogs();
    setLogs(mockLogs);
  }, []);

  useEffect(() => {
    if (logs.length > 0 && selectedExerciseId) {
      const exerciseStats = generateMockExerciseStats(selectedExerciseId, logs);
      setStats(exerciseStats);
    }
  }, [logs, selectedExerciseId]);

  const selectedExercise = exercises.find((e) => e.id === selectedExerciseId);

  // Get exercises with data
  const exercisesWithData = exercises.filter((exercise) =>
    logs.some((log) => log.exerciseId === exercise.id)
  );

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 opacity-0 animate-fade-in">
          <h1 className="font-display text-4xl md:text-5xl tracking-wide mb-2">
            <span className="text-gradient-power">TRACK</span>
            <span className="text-foreground"> PROGRESS</span>
          </h1>
          <p className="text-muted-foreground">
            Visualize your strength gains over time
          </p>
        </div>

        {/* Exercise Selector */}
        <div className="mb-8 opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Select Exercise
          </label>
          <Select value={selectedExerciseId} onValueChange={setSelectedExerciseId}>
            <SelectTrigger className="w-full md:w-80 h-12 bg-secondary/50">
              <SelectValue>
                {selectedExercise && (
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: categoryColors[selectedExercise.category] }}
                    />
                    <span>{selectedExercise.name}</span>
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {exercisesWithData.map((exercise) => (
                <SelectItem key={exercise.id} value={exercise.id}>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: categoryColors[exercise.category] }}
                    />
                    <span>{exercise.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {stats && selectedExercise && (
          <>
            {/* Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div
                className={cn(
                  "p-4 rounded-xl border border-border bg-gradient-card",
                  "opacity-0 animate-fade-in"
                )}
                style={{ animationDelay: "150ms" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-4 w-4 text-accent" />
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">
                    Max Weight
                  </span>
                </div>
                <p className="font-display text-3xl text-gradient-energy">
                  {stats.maxWeight} kg
                </p>
              </div>

              <div
                className={cn(
                  "p-4 rounded-xl border border-border bg-gradient-card",
                  "opacity-0 animate-fade-in"
                )}
                style={{ animationDelay: "200ms" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">
                    Avg Weight
                  </span>
                </div>
                <p className="font-display text-3xl text-gradient-power">
                  {stats.avgWeight} kg
                </p>
              </div>

              <div
                className={cn(
                  "p-4 rounded-xl border border-border bg-gradient-card",
                  "opacity-0 animate-fade-in"
                )}
                style={{ animationDelay: "250ms" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Dumbbell className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">
                    Total Sets
                  </span>
                </div>
                <p className="font-display text-3xl text-foreground">
                  {stats.totalSets}
                </p>
              </div>

              <div
                className={cn(
                  "p-4 rounded-xl border border-border bg-gradient-card",
                  "opacity-0 animate-fade-in"
                )}
                style={{ animationDelay: "300ms" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">
                    Total Reps
                  </span>
                </div>
                <p className="font-display text-3xl text-foreground">
                  {stats.totalReps}
                </p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ProgressChart
                data={stats.progressData}
                metric="weight"
                title="Weight Progression"
              />
              <ProgressChart
                data={stats.progressData}
                metric="volume"
                title="Volume Progression"
              />
            </div>

            {/* Last workout info */}
            <div
              className={cn(
                "mt-8 p-6 rounded-xl border border-border bg-gradient-card",
                "opacity-0 animate-fade-in"
              )}
              style={{ animationDelay: "400ms" }}
            >
              <h3 className="font-display text-xl mb-4">Training Tips</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-secondary/50">
                  <h4 className="font-semibold text-primary mb-2">Progressive Overload</h4>
                  <p className="text-sm text-muted-foreground">
                    Try adding 2.5kg when you can complete all sets with good form
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/50">
                  <h4 className="font-semibold text-accent mb-2">Rest & Recovery</h4>
                  <p className="text-sm text-muted-foreground">
                    Allow 48-72 hours between training the same muscle group
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/50">
                  <h4 className="font-semibold text-foreground mb-2">Consistency</h4>
                  <p className="text-sm text-muted-foreground">
                    Aim for at least 3-4 workouts per week for optimal progress
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Progress;
