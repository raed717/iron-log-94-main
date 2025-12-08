import { ExerciseCategory } from "@/types/workout";
import { categoryColors } from "@/data/categories";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  categories: ExerciseCategory[];
  selected: ExerciseCategory | "all";
  onSelect: (category: ExerciseCategory | "all") => void;
}

const CategoryFilter = ({ categories, selected, onSelect }: CategoryFilterProps) => {
  const allCategories: (ExerciseCategory | "all")[] = ["all", ...categories];

  const getCategoryLabel = (category: ExerciseCategory | "all") => {
    if (category === "all") return "All";
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {allCategories.map((category) => {
        const isSelected = selected === category;
        const color = category === "all" ? "hsl(190, 100%, 50%)" : categoryColors[category];

        return (
          <button
            key={category}
            onClick={() => onSelect(category)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              "border hover:scale-105",
              isSelected 
                ? "border-transparent text-primary-foreground" 
                : "border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
            )}
            style={{
              backgroundColor: isSelected ? color : "transparent",
            }}
          >
            {getCategoryLabel(category)}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;
