import { useState, useEffect, useMemo } from "react";
import Header from "@/components/layout/Header";
import ProgressChart from "@/components/progress/ProgressChart";
import ExerciseSelector from "@/components/progress/ExerciseSelector";
import RecentExercises from "@/components/progress/RecentExercises";
import { useExercises } from "@/hooks/useExercises";
import { useWorkoutLogs } from "@/hooks/useWorkoutData";
import { useExerciseStats } from "@/hooks/useStats";
import { useRecentExercises } from "@/hooks/useRecentExercises";
import { categoryColors } from "@/data/categories";
import { TrendingUp, Award, Target, Dumbbell, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Progress = () => {
  const { logs, loading: logsLoading } = useWorkoutLogs();
  const { exercises, loading: exercisesLoading } = useExercises();
  const { recentExercises, loading: recentLoading } = useRecentExercises(6);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);

  // Get exercises with data
  const exercisesWithData = useMemo(() => {
    if (!logs || !exercises) return [];
    return exercises.filter((exercise) =>
      logs.some(
        (log: { exercise_id?: string; exerciseId?: string }) =>
          (log.exercise_id || log.exerciseId) === exercise.id
      )
    );
  }, [logs, exercises]);

  // Auto-select first recent exercise if available and none selected
  useEffect(() => {
    if (!selectedExerciseId && recentExercises.length > 0) {
      setSelectedExerciseId(recentExercises[0].id);
    } else if (!selectedExerciseId && exercisesWithData.length > 0) {
      setSelectedExerciseId(exercisesWithData[0].id);
    }
  }, [recentExercises, exercisesWithData, selectedExerciseId]);

  const stats = useExerciseStats(selectedExerciseId || "");
  const selectedExercise = exercises.find((e) => e.id === selectedExerciseId);

  const loading = logsLoading || exercisesLoading;

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

        {loading ? (
          <div className="text-center py-16">
            <div className="text-slate-400">Loading exercises...</div>
          </div>
        ) : exercisesWithData.length === 0 ? (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              You haven't logged any workouts yet. Start logging workouts to track your progress!
            </AlertDescription>
          </Alert>
        ) : (
          <>
            {/* Recent Exercises Suggestions */}
            {recentExercises.length > 0 && (
              <div className="mb-8 opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
                <RecentExercises
                  exercises={recentExercises}
                  onSelect={setSelectedExerciseId}
                  selectedExerciseId={selectedExerciseId}
                  loading={recentLoading}
                />
              </div>
            )}

            {/* Exercise Selector */}
            <div className="mb-8 opacity-0 animate-fade-in" style={{ animationDelay: "150ms" }}>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                {selectedExerciseId ? "Currently Tracking" : "Select Exercise to View Progress"}
              </label>
              <ExerciseSelector
                exercises={exercises}
                selectedExerciseId={selectedExerciseId}
                onSelect={setSelectedExerciseId}
                exercisesWithData={exercisesWithData}
              />
            </div>
          </>
        )}

        {selectedExerciseId && stats && selectedExercise && (
          <>
            {/* Exercise Info Card */}
            <div className="mb-6 opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
              <div className="flex items-start gap-4 p-4 rounded-xl border border-border bg-gradient-card">
                {selectedExercise.img_url ? (
                  <img
                    src={selectedExercise.img_url}
                    alt={selectedExercise.name}
                    className="h-20 w-20 rounded-lg object-cover flex-shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div
                    className="h-20 w-20 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: `${categoryColors[selectedExercise?.category || 'chest']}40`,
                    }}
                  >
                    <Dumbbell
                      className="h-10 w-10"
                      style={{ color: categoryColors[selectedExercise?.category || 'chest'] }}
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h2 className="font-display text-2xl mb-1">{selectedExercise.name}</h2>
                  <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                    <span>{selectedExercise.muscle_group}</span>
                    <span>•</span>
                    <span>{selectedExercise.equipment}</span>
                    <span>•</span>
                    <span className="capitalize">{selectedExercise.category}</span>
                  </div>
                  {selectedExercise.description && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {selectedExercise.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 opacity-0 animate-fade-in" style={{ animationDelay: "250ms" }}>
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
