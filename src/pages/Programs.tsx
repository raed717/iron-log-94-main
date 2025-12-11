import { useState } from "react";
import { usePrograms } from "@/hooks/usePrograms";
import { ProgramManager } from "@/components/programs/ProgramManager";
import { ProgramExercises } from "@/components/programs/ProgramExercises";
import Header from "@/components/layout/Header";
import { Program } from "@/types/workout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function Programs() {
  const {
    programs,
    loading,
    createProgram,
    updateProgram,
    deleteProgram,
    addExerciseToProgram,
    removeExerciseFromProgram,
  } = usePrograms();
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(
    null
  );

  const handleProgramCreated = (program: Program) => {
    setSelectedProgramId(program.id);
  };

  const selectedProgram = programs.find((p) => p.id === selectedProgramId);

  if (selectedProgram) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-slate-900 p-4 md:p-6 pt-24">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedProgramId(null)}
                className="text-slate-400 hover:text-white"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <h1 className="text-3xl font-bold text-white">
                {selectedProgram.name}
              </h1>
            </div>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Program Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-slate-300">
                    Focus Area
                  </h3>
                  <p className="text-white capitalize">
                    {selectedProgram.focus_area}
                  </p>
                </div>
                {selectedProgram.description && (
                  <div>
                    <h3 className="text-sm font-medium text-slate-300">
                      Description
                    </h3>
                    <p className="text-slate-200">
                      {selectedProgram.description}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <ProgramExercises
              program={selectedProgram}
              addExerciseToProgram={addExerciseToProgram}
              removeExerciseFromProgram={removeExerciseFromProgram}
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-slate-900 p-4 md:p-6 pt-24">
        <div className="max-w-6xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold text-white">Training Programs</h1>

          <div className="grid gap-4">
            <ProgramManager
              programs={programs}
              loading={loading}
              createProgram={createProgram}
              deleteProgram={deleteProgram}
              updateProgram={updateProgram}
              onSelectProgram={(id) => setSelectedProgramId(id)}
              onProgramCreated={handleProgramCreated}
            />


          </div>
        </div>
      </div>
    </>
  );
}
