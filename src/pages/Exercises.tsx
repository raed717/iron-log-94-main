import { useState, useMemo } from "react";
import Header from "@/components/layout/Header";
import ExerciseCard from "@/components/exercises/ExerciseCard";
import CategoryFilter from "@/components/exercises/CategoryFilter";
import { useExercises } from "@/hooks/useExercises";
import { ExerciseCategory } from "@/types/workout";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const Exercises = () => {
  const { exercises, loading } = useExercises();
  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories: ExerciseCategory[] = ["chest", "back", "shoulders", "arms", "legs", "core"];

  const filteredExercises = useMemo(() => {
    return exercises.filter((exercise) => {
      const matchesCategory = selectedCategory === "all" || exercise.category === selectedCategory;
      const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.muscle_group.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [exercises, selectedCategory, searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen pb-24 md:pb-8">
        <Header />
        <main className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-slate-400">Loading exercises...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 opacity-0 animate-fade-in">
          <h1 className="font-display text-4xl md:text-5xl tracking-wide mb-2">
            <span className="text-gradient-power">EXERCISE</span>
            <span className="text-foreground"> LIBRARY</span>
          </h1>
          <p className="text-muted-foreground">
            Browse {exercises.length} exercises and track your progress
          </p>
        </div>

        {/* Filters */}
        <div className="space-y-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search exercises..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary/50"
            />
          </div>

          <CategoryFilter
            categories={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>

        {/* Exercise Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExercises.map((exercise, index) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              delay={index * 50}
            />
          ))}
        </div>

        {filteredExercises.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No exercises found matching your criteria</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Exercises;
