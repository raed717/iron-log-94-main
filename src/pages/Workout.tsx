import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import WorkoutLogger from "@/components/workout/WorkoutLogger";
import { useExercises } from "@/hooks/useExercises";
import { Exercise } from "@/types/workout";
import { ChevronLeft, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categoryColors } from "@/data/categories";

const Workout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { exercises } = useExercises();

  useEffect(() => {
    // Check for exercise in URL params and set once exercises are loaded
    const exerciseId = searchParams.get("exercise");
    if (!exerciseId) return;
    if (exercises.length === 0) return;
    const exercise = exercises.find((e) => e.id === exerciseId);
    if (exercise) setSelectedExercise(exercise);
  }, [searchParams, exercises]);

  const handleExerciseSelect = (exerciseId: string) => {
    const exercise = exercises.find((e) => e.id === exerciseId);
    if (exercise) {
      setSelectedExercise(exercise);
    }
  };

  const handleWorkoutSaved = () => {
    // Refresh to show updated data
    setRefreshKey(prev => prev + 1);
  };

  // Group exercises by category
  const exercisesByCategory = exercises.reduce((acc, exercise) => {
    if (!acc[exercise.category]) {
      acc[exercise.category] = [];
    }
    acc[exercise.category].push(exercise);
    return acc;
  }, {} as Record<string, Exercise[]>);

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="mb-8 opacity-0 animate-fade-in">
          <Button
            variant="ghost"
            className="mb-4 -ml-2"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>

          <h1 className="font-display text-4xl md:text-5xl tracking-wide mb-2">
            <span className="text-gradient-power">LOG</span>
            <span className="text-foreground"> WORKOUT</span>
          </h1>
          <p className="text-muted-foreground">
            Select an exercise and track your sets
          </p>
        </div>

        {/* Exercise Selector */}
        <div className="mb-8 opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Select Exercise
          </label>
          <Select
            value={selectedExercise?.id || ""}
            onValueChange={handleExerciseSelect}
          >
            <SelectTrigger className="w-full h-14 text-lg bg-secondary/50">
              <SelectValue placeholder="Choose an exercise...">
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
            <SelectContent className="max-h-80">
              {Object.entries(exercisesByCategory).map(([category, categoryExercises]) => (
                <div key={category}>
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {category}
                  </div>
                  {categoryExercises.map((exercise) => (
                    <SelectItem key={exercise.id} value={exercise.id}>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: categoryColors[exercise.category] }}
                        />
                        <img src={exercise.img_url} alt={exercise.name} className="w-6 h-6" />
                        <span>{exercise.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {exercise.equipment}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </div>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Workout Logger */}
        {selectedExercise ? (
          <div className="opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
            <div className="p-6 rounded-xl border border-border bg-gradient-card mb-6">
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: `${categoryColors[selectedExercise.category]}20` }}
                >
                  <Dumbbell
                    className="h-6 w-6"
                    style={{ color: categoryColors[selectedExercise.category] }}
                  />
                </div>
                <div>
                  <h2 className="font-display text-2xl tracking-wide">
                    {selectedExercise.name}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedExercise.muscleGroup} • {selectedExercise.equipment}
                  </p>
                  <img src={selectedExercise.img_url} alt={selectedExercise.name} className="w-24 h-24" />
                </div>
              </div>

              <WorkoutLogger
                key={refreshKey}
                exercise={selectedExercise}
                onSaved={handleWorkoutSaved}
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-16 opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-4">
              <Dumbbell className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">
              Select an exercise above to start logging
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Workout;
