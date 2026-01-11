import { cn } from "@/lib/utils";
import { Dumbbell, Wrench, Cable, Weight, Circle, Box } from "lucide-react";

export type EquipmentType =
  | "Full Gym"
  | "NO EQUIPMENT"
  | "Machine"
  | "Cable"
  | "Barbell"
  | "Dumbbells"
  | "Kettlebell"
  | "Resistance Band"
  | "Landmine";

interface EquipmentFilterProps {
  selected: Set<EquipmentType>;
  onSelect: (equipment: EquipmentType) => void;
}

const EquipmentFilter = ({ selected, onSelect }: EquipmentFilterProps) => {
  const equipmentOptions: EquipmentType[] = [
    "Full Gym",
    "NO EQUIPMENT",
    "Machine",
    "Cable",
    "Barbell",
    "Dumbbells",
    "Kettlebell",
    "Resistance Band",
  ];

  const getEquipmentIcon = (equipment: EquipmentType) => {
    switch (equipment) {
      case "Full Gym":
        return <Weight className="h-4 w-4" />;
      case "NO EQUIPMENT":
        return <Circle className="h-4 w-4" />;
      case "Machine":
        return <Wrench className="h-4 w-4" />;
      case "Cable":
        return <Cable className="h-4 w-4" />;
      case "Barbell":
      case "Dumbbells":
        return <Dumbbell className="h-4 w-4" />;
      case "Kettlebell":
        return <Weight className="h-4 w-4" />;
      case "Resistance Band":
        return <Box className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const isAllSelected = selected.size === 0;

  const handleAllEquipmentClick = () => {
    // If something is selected, clear all by toggling each selected item
    if (selected.size > 0) {
      // Create a copy of the array to avoid iteration issues
      Array.from(selected).forEach((eq) => onSelect(eq));
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-muted-foreground mb-2">
        Equipment
      </h3>
      <div className="flex flex-wrap gap-2">
        {/* All Equipment button - shows as selected when nothing is selected */}
        <button
          onClick={handleAllEquipmentClick}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
            "border hover:scale-105 flex items-center gap-2",
            isAllSelected
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5"
          )}
        >
          <Weight className="h-4 w-4" />
          All Equipment
        </button>

        {/* Individual equipment options */}
        {equipmentOptions.map((equipment) => {
          const isSelected = selected.has(equipment);

          return (
            <button
              key={equipment}
              onClick={() => onSelect(equipment)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                "border hover:scale-105 flex items-center gap-2",
                isSelected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5"
              )}
            >
              {getEquipmentIcon(equipment)}
              {equipment}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default EquipmentFilter;
