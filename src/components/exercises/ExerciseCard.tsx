import { Exercise, WorkoutLog } from "@/types/workout";
import { categoryColors } from "@/data/exercises";
import { Dumbbell, TrendingUp, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ExerciseCardProps {
  exercise: Exercise;
  lastWorkout?: WorkoutLog;
  delay?: number;
}

const ExerciseCard = ({ exercise, lastWorkout, delay = 0 }: ExerciseCardProps) => {
  const navigate = useNavigate();
  const categoryColor = categoryColors[exercise.category] || "hsl(190, 100%, 50%)";

  const lastWeight = lastWorkout 
    ? Math.max(...lastWorkout.sets.map(s => s.weight))
    : null;

  const lastReps = lastWorkout
    ? lastWorkout.sets.reduce((acc, s) => acc + s.reps, 0)
    : null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

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
              {exercise.muscleGroup} • {exercise.equipment}
            </p>
          </div>
          <div 
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${categoryColor}20` }}
          >
            <Dumbbell className="h-5 w-5" style={{ color: categoryColor }} />
          </div>
        </div>

        {lastWorkout ? (
          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-lg font-bold text-foreground">{lastWeight} kg</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {lastWorkout.sets.length} sets • {lastReps} reps
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Last: {formatDate(lastWorkout.date)}</span>
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
