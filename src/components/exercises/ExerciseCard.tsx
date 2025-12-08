import { Exercise } from "@/types/workout";
import { categoryColors } from "@/data/exercises";
import { Dumbbell, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useExerciseStats } from "@/hooks/useStats";

interface ExerciseCardProps {
  exercise: Exercise;
  delay?: number;
}

const ExerciseCard = ({ exercise, delay = 0 }: ExerciseCardProps) => {
  const navigate = useNavigate();
  const stats = useExerciseStats(exercise.id);
  const categoryColor = categoryColors[exercise.category] || "hsl(190, 100%, 50%)";

  return (
    <div 
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-gradient-card p-5",
        "opacity-0 animate-fade-in card-hover"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Category indicator */}
      <div 
        className="absolute top-0 left-0 w-1 h-full"
        style={{ backgroundColor: categoryColor }}
      />

      <div className="pl-3">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-display text-xl tracking-wide text-foreground group-hover:text-primary transition-colors">
              {exercise.name}
            </h3>
            <p className="text-sm text-muted-foreground capitalize">
              {exercise.muscle_group || exercise.muscleGroup} • {exercise.equipment}
            </p>
          </div>
          <div 
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${categoryColor}20` }}
          >
            <Dumbbell className="h-5 w-5" style={{ color: categoryColor }} />
          </div>
        </div>

        {stats.lastWorkout !== 'Never' ? (
          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-lg font-bold text-foreground">{stats.maxWeight} kg</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {stats.totalSets} sets • {stats.totalReps} reps
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Last: {stats.lastWorkout}</span>
            </div>
          </div>
        ) : (
          <div className="py-4 mb-4 text-center">
            <p className="text-sm text-muted-foreground">No previous data</p>
            <p className="text-xs text-muted-foreground/60">Start logging to track progress</p>
          </div>
        )}

        <Button 
          variant="outline" 
          className="w-full group-hover:border-primary/50 group-hover:bg-primary/5"
          onClick={() => navigate(`/workout?exercise=${exercise.id}`)}
        >
          Log Workout
        </Button>
      </div>
    </div>
  );
};

export default ExerciseCard;
