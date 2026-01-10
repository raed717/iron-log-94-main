import { useState, useMemo, useEffect } from "react";
import Header from "@/components/layout/Header";
import ExerciseCard from "@/components/exercises/ExerciseCard";
import CategoryFilter from "@/components/exercises/CategoryFilter";
import { useExercises } from "@/hooks/useExercises";
import { useDebounce } from "@/hooks/useDebounce";
import { useExerciseStatsBatch } from "@/hooks/useExerciseStatsBatch";
import { ExerciseCategory } from "@/types/workout";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 24; // 24 exercises per page (8 rows of 3 on desktop)

const Exercises = () => {
  const { exercises, loading } = useExercises();
  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Debounce search query to reduce filtering operations
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const categories: ExerciseCategory[] = ["chest", "back", "shoulders", "arms", "legs", "core"];

  // Filter exercises based on category and search
  const filteredExercises = useMemo(() => {
    return exercises.filter((exercise) => {
      const matchesCategory = selectedCategory === "all" || exercise.category === selectedCategory;
      const matchesSearch = exercise.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        exercise.muscle_group.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [exercises, selectedCategory, debouncedSearchQuery]);

  // Calculate pagination
  const totalPages = Math.max(1, Math.ceil(filteredExercises.length / ITEMS_PER_PAGE));
  
  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, debouncedSearchQuery]);
  
  // Ensure current page doesn't exceed total pages (safeguard)
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedExercises = useMemo(() => {
    return filteredExercises.slice(startIndex, endIndex);
  }, [filteredExercises, startIndex, endIndex]);

  // Get exercise IDs for batch stats fetching (only for visible exercises)
  const visibleExerciseIds = useMemo(() => {
    return paginatedExercises.map(ex => ex.id);
  }, [paginatedExercises]);

  // Batch fetch stats for visible exercises only
  const statsMap = useExerciseStatsBatch(visibleExerciseIds);

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
            {filteredExercises.length !== exercises.length && (
              <span className="ml-2">
                ({filteredExercises.length} matching)
              </span>
            )}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {paginatedExercises.map((exercise, index) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              delay={index * 50}
              stats={statsMap.get(exercise.id)}
            />
          ))}
        </div>

        {filteredExercises.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No exercises found matching your criteria</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={safeCurrentPage === 1}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Page {safeCurrentPage} of {totalPages}
              </span>
              <span className="text-sm text-muted-foreground/60">
                ({filteredExercises.length} exercises)
              </span>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={safeCurrentPage === totalPages}
              className="gap-2"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Exercises;
