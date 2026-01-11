import { cn } from "@/lib/utils";
import { Activity, Dumbbell } from "lucide-react";

export type MuscleGroupType =
    | "Abs"
    | "Back / Wing"
    | "Biceps"
    | "Triceps"
    | "Calf"
    | "Chest"
    | "Forearm"
    | "Leg"
    | "Neck"
    | "Shoulders"
    | "Trapezius"
    | "Erector Spinae"
    | "Hip"
    | "Cardio"
    | "Calisthenic"
    | "Full Body"
    | "Yoga";

const MUSCLE_GROUPS: MuscleGroupType[] = [
    "Abs",
    "Back / Wing",
    "Biceps",
    "Calf",
    "Chest",
    "Forearm",
    "Leg",
    "Neck",
    "Shoulders",
    "Trapezius",
    "Triceps",
    "Erector Spinae",
    "Hip",
];

const FITNESS_CATEGORIES: MuscleGroupType[] = [
    "Cardio",
    "Calisthenic",
    "Full Body",
    "Yoga",
];

interface MuscleGroupFilterProps {
    selected: Set<MuscleGroupType>;
    onSelect: (muscleGroup: MuscleGroupType) => void;
}

const MuscleGroupFilter = ({ selected, onSelect }: MuscleGroupFilterProps) => {
    const getMuscleGroupIcon = (muscleGroup: MuscleGroupType) => {
        if (FITNESS_CATEGORIES.includes(muscleGroup)) {
            return <Activity className="h-4 w-4" />;
        }
        return <Dumbbell className="h-4 w-4" />;
    };

    return (
        <div className="space-y-4">
            {/* Muscle Groups & Body Parts Section */}
            <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                    Muscle Groups & Body Parts
                </h3>
                <div className="flex flex-wrap gap-2">
                    {MUSCLE_GROUPS.map((muscleGroup) => {
                        const isSelected = selected.has(muscleGroup);

                        return (
                            <button
                                key={muscleGroup}
                                onClick={() => onSelect(muscleGroup)}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                                    "border hover:scale-105 flex items-center gap-2",
                                    isSelected
                                        ? "border-primary bg-primary text-primary-foreground"
                                        : "border-border text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5"
                                )}
                            >
                                {getMuscleGroupIcon(muscleGroup)}
                                {muscleGroup}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Fitness Categories Section */}
            <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                    Fitness Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                    {FITNESS_CATEGORIES.map((muscleGroup) => {
                        const isSelected = selected.has(muscleGroup);

                        return (
                            <button
                                key={muscleGroup}
                                onClick={() => onSelect(muscleGroup)}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                                    "border hover:scale-105 flex items-center gap-2",
                                    isSelected
                                        ? "border-primary bg-primary text-primary-foreground"
                                        : "border-border text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5"
                                )}
                            >
                                {getMuscleGroupIcon(muscleGroup)}
                                {muscleGroup}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default MuscleGroupFilter;
