import { useState, useMemo } from "react";
import { Exercise } from "@/types/workout";
import { categoryColors } from "@/data/categories";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ExerciseSelectorProps {
  exercises: Exercise[];
  selectedExerciseId: string | null;
  onSelect: (exerciseId: string) => void;
  exercisesWithData?: Exercise[];
}

const ExerciseItem = ({
  exercise,
  isSelected,
  hasData,
  onSelect,
}: {
  exercise: Exercise;
  isSelected: boolean;
  hasData: boolean;
  onSelect: (id: string) => void;
}) => {
  return (
    <CommandItem
      value={exercise.id}
      onSelect={() => onSelect(exercise.id)}
      className="cursor-pointer"
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {exercise.img_url ? (
          <img
            src={exercise.img_url}
            alt={exercise.name}
            className="h-10 w-10 rounded-lg object-cover flex-shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div
            className="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              backgroundColor: `${categoryColors[exercise.category]}40`,
            }}
          >
            <Dumbbell
              className="h-5 w-5"
              style={{ color: categoryColors[exercise.category] }}
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate">{exercise.name}</div>
          <div className="text-xs text-muted-foreground truncate">
            {exercise.muscle_group} • {exercise.equipment}
          </div>
        </div>
        {hasData && (
          <Badge variant="secondary" className="text-xs ml-2">
            Data
          </Badge>
        )}
        <Check
          className={cn(
            "ml-2 h-4 w-4 shrink-0",
            isSelected ? "opacity-100" : "opacity-0"
          )}
        />
      </div>
    </CommandItem>
  );
};

const ExerciseSelector = ({
  exercises,
  selectedExerciseId,
  onSelect,
  exercisesWithData = [],
}: ExerciseSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>("all");

  // Get unique muscle groups from exercises
  const muscleGroups = useMemo(() => {
    const groups = new Set<string>();
    exercises.forEach((exercise) => {
      const groupsList = exercise.muscle_group
        .split(",")
        .map((g) => g.trim())
        .filter(Boolean);
      groupsList.forEach((g) => groups.add(g));
    });
    return Array.from(groups).sort();
  }, [exercises]);

  // Filter exercises
  const filteredExercises = useMemo(() => {
    let filtered = exercises;

    // Filter by muscle group
    if (selectedMuscleGroup !== "all") {
      filtered = filtered.filter((exercise) =>
        exercise.muscle_group
          .split(",")
          .map((g) => g.trim())
          .includes(selectedMuscleGroup)
      );
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (exercise) =>
          exercise.name.toLowerCase().includes(query) ||
          exercise.muscle_group.toLowerCase().includes(query) ||
          exercise.category.toLowerCase().includes(query)
      );
    }

    // Prioritize exercises with data
    return filtered.sort((a, b) => {
      const aHasData = exercisesWithData.some((e) => e.id === a.id);
      const bHasData = exercisesWithData.some((e) => e.id === b.id);
      if (aHasData && !bHasData) return -1;
      if (!aHasData && bHasData) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [exercises, searchQuery, selectedMuscleGroup, exercisesWithData]);

  const selectedExercise = exercises.find((e) => e.id === selectedExerciseId);

  const handleSelect = (id: string) => {
    onSelect(id);
    setOpen(false);
  };

  return (
    <div className="space-y-3">
      {/* Muscle Group Filter - Only show when popover is closed or as a separate filter */}
      <Select
        value={selectedMuscleGroup}
        onValueChange={setSelectedMuscleGroup}
      >
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Filter by muscle group" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Muscle Groups</SelectItem>
          {muscleGroups.map((group) => (
            <SelectItem key={group} value={group}>
              {group}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Exercise Selector */}
      <div className="space-y-2">
        {selectedExerciseId && (
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <ChevronsUpDown className="h-3 w-3" />
            <span>
              Click the exercise card below to change and track another exercise
            </span>
          </p>
        )}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between h-auto min-h-[70px] p-4 bg-secondary/50 hover:bg-secondary/70 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group relative"
            >
              {selectedExercise ? (
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {selectedExercise.img_url ? (
                    <img
                      src={selectedExercise.img_url}
                      alt={selectedExercise.name}
                      className="h-10 w-10 rounded-lg object-cover flex-shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div
                      className="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: `${categoryColors[selectedExercise.category]
                          }40`,
                      }}
                    >
                      <Dumbbell
                        className="h-5 w-5"
                        style={{
                          color: categoryColors[selectedExercise.category],
                        }}
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0 text-left">
                    <div className="font-medium truncate">
                      {selectedExercise.name}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {selectedExercise.muscle_group}
                    </div>
                  </div>
                  {exercisesWithData.some(
                    (e) => e.id === selectedExercise.id
                  ) && (
                      <Badge variant="secondary" className="text-xs">
                        Has Data
                      </Badge>
                    )}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span>Select an exercise to view progress...</span>
                </div>
              )}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[400px] p-0" align="start">
            <Command shouldFilter={false}>
              <CommandInput
                placeholder="Search exercises by name, muscle group, or category..."
                value={searchQuery}
                onValueChange={setSearchQuery}
              />
              <CommandList>
                <CommandEmpty>No exercises found.</CommandEmpty>
                <CommandGroup>
                  {filteredExercises.map((exercise) => {
                    const hasData = exercisesWithData.some(
                      (e) => e.id === exercise.id
                    );
                    const isSelected = selectedExerciseId === exercise.id;

                    return (
                      <ExerciseItem
                        key={exercise.id}
                        exercise={exercise}
                        isSelected={isSelected}
                        hasData={hasData}
                        onSelect={handleSelect}
                      />
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default ExerciseSelector;
