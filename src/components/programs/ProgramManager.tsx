import { useState } from "react";
import { useExercises } from "@/hooks/useExercises";
import { useUsers } from "@/hooks/useUsers";
import { useProgramShares } from "@/hooks/useProgramShares";
import { useAuth } from "@/hooks/useAuth";
import { Program, ProgramFocusArea, ProgramLevel } from "@/types/workout";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trash2, Plus, Edit, Share2 } from "lucide-react";

const FOCUS_AREAS: ProgramFocusArea[] = [
  "upper body",
  "lower body",
  "full body",
  "push",
  "pull",
  "legs",
  "chest",
  "back",
  "shoulders",
  "arms",
  "cardio",
  "custom",
];

const PROGRAM_LEVELS: ProgramLevel[] = ["beginner", "intermediate", "advanced"];

interface ProgramManagerProps {
  programs: Program[];
  loading: boolean;
  onSelectProgram?: (programId: string) => void;
  createProgram: (
    name: string,
    focusArea: string,
    description?: string,
    level?: string
  ) => Promise<Program | null>;
  deleteProgram: (id: string) => Promise<boolean>;
  updateProgram: (
    id: string,
    name: string,
    focusArea: string,
    description?: string,
    level?: string
  ) => Promise<Program | null>;
  onProgramCreated?: (program: Program) => void;
}

export const ProgramManager = ({
  programs,
  loading,
  onSelectProgram,
  createProgram,
  deleteProgram,
  updateProgram,
  onProgramCreated,
}: ProgramManagerProps) => {
  const { exercises } = useExercises();
  const { users } = useUsers();
  const { shareProgram } = useProgramShares();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [focusFilter, setFocusFilter] = useState<ProgramFocusArea | "all">(
    "all"
  );
  const [levelFilter, setLevelFilter] = useState<ProgramLevel | "all">("all");
  const [minExercises, setMinExercises] = useState<string>("");
  const [maxExercises, setMaxExercises] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    focusArea: "upper body" as ProgramFocusArea,
    level: "" as ProgramLevel | "",
    description: "",
  });
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [sharingProgram, setSharingProgram] = useState<Program | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  const handleOpenDialog = (program?: Program) => {
    if (program) {
      setEditingProgram(program);
      setIsEditMode(true);
      setFormData({
        name: program.name,
        focusArea: program.focus_area as ProgramFocusArea,
        level: (program.level as ProgramLevel) || "",
        description: program.description || "",
      });
    } else {
      setEditingProgram(null);
      setIsEditMode(false);
      setFormData({
        name: "",
        focusArea: "upper body" as ProgramFocusArea,
        level: "",
        description: "",
      });
    }
    setIsOpen(true);
  };

  const handleCloseDialog = () => {
    setIsOpen(false);
    setFormData({
      name: "",
      focusArea: "upper body" as ProgramFocusArea,
      level: "",
      description: "",
    });
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.focusArea) {
      alert("Please fill in all required fields");
      return;
    }

    if (isEditMode && editingProgram) {
      await updateProgram(
        editingProgram.id,
        formData.name,
        formData.focusArea,
        formData.description,
        formData.level || undefined
      );
    } else {
      const newProgram = await createProgram(
        formData.name,
        formData.focusArea,
        formData.description,
        formData.level || undefined
      );
      if (newProgram && onProgramCreated) {
        onProgramCreated(newProgram);
      }
    }

    handleCloseDialog();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this program?")) {
      await deleteProgram(id);
    }
  };

  if (loading) {
    return <div className="text-slate-400">Loading programs...</div>;
  }

  const filteredPrograms = programs.filter((program) => {
    const matchesSearch =
      !searchTerm ||
      program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (program.description || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesFocus =
      focusFilter === "all" || program.focus_area === focusFilter;

    const matchesLevel =
      levelFilter === "all" || program.level === levelFilter;

    const exerciseCount = program.exercises?.length || 0;
    const min = minExercises ? parseInt(minExercises, 10) : null;
    const max = maxExercises ? parseInt(maxExercises, 10) : null;
    const matchesMin = min === null || exerciseCount >= min;
    const matchesMax = max === null || exerciseCount <= max;

    return matchesSearch && matchesFocus && matchesLevel && matchesMin && matchesMax;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Programs</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="w-4 h-4" />
              New Program
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">
                {isEditMode ? "Edit Program" : "Create New Program"}
              </DialogTitle>
              <DialogDescription>
                {isEditMode
                  ? "Update your training program details"
                  : "Set up a new training program for your workout"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-slate-200">
                  Program Name *
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., Upper Body Strength"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div>
                <Label htmlFor="focusArea" className="text-slate-200">
                  Focus Area *
                </Label>
                <Select
                  value={formData.focusArea}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      focusArea: value as ProgramFocusArea,
                    })
                  }
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select focus area" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {FOCUS_AREAS.map((area) => (
                      <SelectItem
                        key={area}
                        value={area}
                        className="text-slate-100"
                      >
                        {area.charAt(0).toUpperCase() + area.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="level" className="text-slate-200">
                  Level
                </Label>
                <Select
                  value={formData.level !== "" ? formData.level : undefined}
                  onValueChange={(value) => {
                    if (PROGRAM_LEVELS.includes(value as ProgramLevel)) {
                      setFormData({
                        ...formData,
                        level: value as ProgramLevel,
                      });
                    }
                  }}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select level (optional)" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {PROGRAM_LEVELS.map((level) => (
                      <SelectItem
                        key={level}
                        value={level}
                        className="text-slate-100 capitalize"
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.level !== "" && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      setFormData({ ...formData, level: "" as ProgramLevel | "" });
                    }}
                    className="mt-2 text-xs text-slate-400 hover:text-slate-200"
                  >
                    Clear level
                  </Button>
                )}
              </div>

              <div>
                <Label htmlFor="description" className="text-slate-200">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Add notes about this program..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button
                  variant="outline"
                  onClick={handleCloseDialog}
                  className="text-slate-300 border-slate-600"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isEditMode ? "Update Program" : "Create Program"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Share Program Dialog */}
        <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
          <DialogContent className="bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Share Program</DialogTitle>
              <DialogDescription>
                Share "{sharingProgram?.name}" with another user
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="share-user" className="text-slate-200">
                  Select User
                </Label>
                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Choose a user to share with" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {users
                      .filter((user) => user.id !== sharingProgram?.user_id) // Don't show the owner
                      .map((user) => (
                        <SelectItem
                          key={user.id}
                          value={user.id}
                          className="text-slate-100"
                        >
                          {user.username} {user.full_name && `(${user.full_name})`}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 justify-end pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsShareOpen(false);
                    setSharingProgram(null);
                    setSelectedUserId("");
                  }}
                  className="text-slate-300 border-slate-600"
                >
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    if (sharingProgram && selectedUserId) {
                      const result = await shareProgram(sharingProgram.id, selectedUserId);
                      if (result.success) {
                        setIsShareOpen(false);
                        setSharingProgram(null);
                        setSelectedUserId("");
                        // Could show success toast here
                      } else {
                        alert(result.message);
                      }
                    }
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={!selectedUserId}
                >
                  Share Program
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-3 md:grid-cols-5">
        <div className="md:col-span-2">
          <Label htmlFor="search" className="text-slate-200">
            Search
          </Label>
          <Input
            id="search"
            placeholder="Search by name or description"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-700 border-slate-600 text-white"
          />
        </div>
        <div>
          <Label htmlFor="focus-filter" className="text-slate-200">
            Focus Area
          </Label>
          <Select
            value={focusFilter}
            onValueChange={(value) =>
              setFocusFilter(value as ProgramFocusArea | "all")
            }
          >
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue placeholder="All focus areas" />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600">
              <SelectItem value="all" className="text-slate-100">
                All focus areas
              </SelectItem>
              {FOCUS_AREAS.map((area) => (
                <SelectItem
                  key={area}
                  value={area}
                  className="text-slate-100 capitalize"
                >
                  {area}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="level-filter" className="text-slate-200">
            Level
          </Label>
          <Select
            value={levelFilter}
            onValueChange={(value) =>
              setLevelFilter(value as ProgramLevel | "all")
            }
          >
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue placeholder="All levels" />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600">
              <SelectItem value="all" className="text-slate-100">
                All levels
              </SelectItem>
              {PROGRAM_LEVELS.map((level) => (
                <SelectItem
                  key={level}
                  value={level}
                  className="text-slate-100 capitalize"
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="min-exercises" className="text-slate-200">
              Min exercises
            </Label>
            <Input
              id="min-exercises"
              type="number"
              min={0}
              value={minExercises}
              onChange={(e) => setMinExercises(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
          <div>
            <Label htmlFor="max-exercises" className="text-slate-200">
              Max exercises
            </Label>
            <Input
              id="max-exercises"
              type="number"
              min={0}
              value={maxExercises}
              onChange={(e) => setMaxExercises(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
        </div>
      </div>

      {programs.length === 0 ? (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6 text-center text-slate-400">
            <p>No programs yet. Create one to get started!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPrograms.map((program) => (
            <Card
              key={program.id}
              onClick={() =>
                onSelectProgram ? onSelectProgram(program.id) : undefined
              }
              className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-white">{program.name}</CardTitle>
                      {program.user_id !== user?.id && program.shared_by && (
                        <span className="px-2 py-1 text-xs bg-blue-600 text-white rounded-full">
                          Shared by: {program.shared_by.full_name || program.shared_by.username}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <CardDescription className="text-slate-400 capitalize">
                        {program.focus_area}
                      </CardDescription>
                      {program.level && (
                        <span className="px-2 py-1 text-xs bg-slate-700 text-slate-300 rounded-full capitalize">
                          {program.level}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {program.user_id === user?.id && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSharingProgram(program);
                            setIsShareOpen(true);
                          }}
                          className="text-slate-400 hover:text-white"
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDialog(program);
                          }}
                          className="text-slate-400 hover:text-white"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(program.id);
                          }}
                          className="text-slate-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent
                onClick={() =>
                  onSelectProgram ? onSelectProgram(program.id) : undefined
                }
                className={
                  onSelectProgram
                    ? "cursor-pointer hover:bg-slate-700 transition-colors"
                    : ""
                }
              >
                {program.description && (
                  <p className="text-sm text-slate-300 mb-3">
                    {program.description}
                  </p>
                )}
                <div className="text-sm text-slate-400">
                  <span className="font-semibold text-slate-300">
                    {program.exercises?.length || 0}
                  </span>{" "}
                  exercises
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
