import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useExercises } from "@/hooks/useExercises";
import { Program, ProgramExercise } from "@/types/workout";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Plus, GripVertical, Search, Play } from "lucide-react";

interface ProgramExercisesProps {
  program: Program;
  addExerciseToProgram: (
    programId: string,
    exerciseId: string,
    orderIndex: number,
    setsTarget?: number,
    repsTarget?: number
  ) => Promise<ProgramExercise | null>;
  removeExerciseFromProgram: (programExerciseId: string) => Promise<boolean>;
}

export const ProgramExercises = ({
  program,
  addExerciseToProgram,
  removeExerciseFromProgram,
}: ProgramExercisesProps) => {
  const navigate = useNavigate();
  const { exercises } = useExercises();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedExerciseId, setSelectedExerciseId] = useState("");
  const [setsTarget, setSetsTarget] = useState(3);
  const [repsTarget, setRepsTarget] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddExercise = async () => {
    if (!selectedExerciseId) {
      alert("Please select an exercise");
      return;
    }

    const newOrderIndex = (program.exercises?.length || 0) + 1;
    await addExerciseToProgram(
      program.id,
      selectedExerciseId,
      newOrderIndex,
      setsTarget,
      repsTarget
    );

    setSelectedExerciseId("");
    setSetsTarget(3);
    setRepsTarget(10);
    setSearchQuery("");
    setIsOpen(false);
  };

  const handleRemoveExercise = async (programExerciseId: string) => {
    if (confirm("Remove this exercise from the program?")) {
      await removeExerciseFromProgram(programExerciseId);
    }
  };

  const programExercises = program.exercises || [];
  const usedExerciseIds = new Set(programExercises.map((pe) => pe.exercise_id));
  const availableExercises = exercises.filter(
    (ex) => !usedExerciseIds.has(ex.id)
  );

  // Filter exercises based on search query
  const filteredExercises = availableExercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          Exercises in Program
        </h3>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Exercise
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">
                Add Exercise to Program
              </DialogTitle>
              <DialogDescription>
                Select an exercise and set your targets for this program
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="exercise" className="text-slate-200">
                  Exercise *
                </Label>
                <Select
                  value={selectedExerciseId}
                  onValueChange={setSelectedExerciseId}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select exercise" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600 max-h-60">
                    <div className="sticky top-0 bg-slate-700 p-2 border-b border-slate-600">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                          type="text"
                          placeholder="Search exercises..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyDown={(e) => e.stopPropagation()}
                          onClick={(e) => e.stopPropagation()}
                          className="bg-slate-600 border-slate-500 text-white pl-10 h-8"
                        />
                      </div>
                    </div>
                    {filteredExercises.length === 0 ? (
                      <div className="p-4 text-center text-slate-400">
                        No exercises found
                      </div>
                    ) : (
                      filteredExercises.map((exercise) => (
                        <SelectItem
                          key={exercise.id}
                          value={exercise.id}
                          className="text-slate-100"
                        >
                          <img
                            src={exercise.img_url}
                            alt={exercise.name}
                            className="w-16 h-16 rounded-full mr-2 object-cover inline-block"
                          />
                          {exercise.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sets" className="text-slate-200">
                    Target Sets
                  </Label>
                  <Input
                    id="sets"
                    type="number"
                    min="1"
                    max="10"
                    value={setsTarget}
                    onChange={(e) => setSetsTarget(parseInt(e.target.value))}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="reps" className="text-slate-200">
                    Target Reps
                  </Label>
                  <Input
                    id="reps"
                    type="number"
                    min="1"
                    max="100"
                    value={repsTarget}
                    onChange={(e) => setRepsTarget(parseInt(e.target.value))}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="text-slate-300 border-slate-600"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddExercise}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Add Exercise
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {programExercises.length === 0 ? (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6 text-center text-slate-400">
            <p>No exercises in this program yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {programExercises.map((pe, index) => (
            <Card key={pe.id} className="bg-slate-700 border-slate-600">
              <CardContent className="flex items-center gap-4 py-3">
                <GripVertical className="w-4 h-4 text-slate-500 flex-shrink-0" />
                <img
                  src={pe.exercise?.img_url}
                  alt={pe.exercise?.name}
                  className="w-16 h-16 rounded-full mr-2 object-cover inline-block"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white">
                    {index + 1}. {pe.exercise?.name || "Unknown Exercise"}
                  </div>
                  <div className="text-xs text-slate-400">
                    {pe.sets_target} sets × {pe.reps_target} reps
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/workout?exercise=${pe.exercise?.id}`)}
                    className="text-slate-400 hover:text-green-500"
                    title="Start this exercise"
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveExercise(pe.id)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};