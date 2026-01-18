import { Exercise } from "@/types/workout";
import { RecentExercise } from "@/hooks/useRecentExercises";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { categoryColors } from "@/data/categories";
import { Dumbbell, Clock, TrendingUp } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface RecentExercisesProps {
  exercises: RecentExercise[];
  onSelect: (exerciseId: string) => void;
  selectedExerciseId: string | null;
  loading?: boolean;
}

const RecentExercises = ({
  exercises,
  onSelect,
  selectedExerciseId,
  loading,
}: RecentExercisesProps) => {
  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Recent Exercises</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-20 bg-secondary/50 rounded-lg mb-3" />
                <div className="h-4 bg-secondary/50 rounded w-3/4 mb-2" />
                <div className="h-3 bg-secondary/50 rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (exercises.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Recent Exercises</h3>
        <p className="text-sm text-muted-foreground">
          Select an exercise to view your progress
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {exercises.map((exercise) => {
          const isSelected = selectedExerciseId === exercise.id;
          const lastPerformedDate = exercise.lastPerformed
            ? new Date(exercise.lastPerformed)
            : null;

          return (
            <Card
              key={exercise.id}
              className={cn(
                "cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg",
                isSelected && "ring-2 ring-primary shadow-lg"
              )}
              onClick={() => onSelect(exercise.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {/* Exercise Image/Icon */}
                  {exercise.img_url ? (
                    <img
                      src={exercise.img_url}
                      alt={exercise.name}
                      className="h-16 w-16 rounded-lg object-cover flex-shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div
                      className="h-16 w-16 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: `${categoryColors[exercise.category]}40`,
                      }}
                    >
                      <Dumbbell
                        className="h-8 w-8"
                        style={{ color: categoryColors[exercise.category] }}
                      />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-semibold text-sm leading-tight line-clamp-2">
                        {exercise.name}
                      </h4>
                      {isSelected && (
                        <Badge variant="default" className="text-xs shrink-0">
                          Selected
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <TrendingUp className="h-3 w-3" />
                        <span>{exercise.totalWorkouts} workout{exercise.totalWorkouts !== 1 ? 's' : ''}</span>
                      </div>

                      {lastPerformedDate && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>
                            {formatDistanceToNow(lastPerformedDate, {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      )}

                      <div className="text-xs text-muted-foreground truncate">
                        {exercise.muscle_group.split(',')[0].trim()}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default RecentExercises;
