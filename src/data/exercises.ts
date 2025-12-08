import { Exercise } from "@/types/workout";

export const exercises: Exercise[] = [
  // Chest
  {
    id: "bench-press",
    name: "Bench Press",
    category: "chest",
    muscleGroup: "Chest",
    muscle_group: "Chest",
    equipment: "Barbell",
    description: "Classic compound movement for chest development"
  },
  {
    id: "incline-bench",
    name: "Incline Bench Press",
    category: "chest",
    muscleGroup: "Upper Chest",
    muscle_group: "Upper Chest",
    equipment: "Barbell",
    description: "Targets upper chest fibers"
  },
  {
    id: "dumbbell-fly",
    name: "Dumbbell Fly",
    category: "chest",
    muscleGroup: "Chest",
    muscle_group: "Chest",
    equipment: "Dumbbells",
    description: "Isolation movement for chest stretch and contraction"
  },
  {
    id: "cable-crossover",
    name: "Cable Crossover",
    category: "chest",
    muscleGroup: "Chest",
    muscle_group: "Chest",
    equipment: "Cable Machine",
    description: "Constant tension chest isolation"
  },
  {
    id: "chest-press-machine",
    name: "Chest Press Machine",
    category: "chest",
    muscleGroup: "Chest",
    muscle_group: "Chest",
    equipment: "Machine",
    description: "Machine-assisted chest press"
  },

  // Back
  {
    id: "deadlift",
    name: "Deadlift",
    category: "back",
    muscleGroup: "Back",
    muscle_group: "Back",
    equipment: "Barbell",
    description: "King of all exercises - full posterior chain"
  },
  {
    id: "lat-pulldown",
    name: "Lat Pulldown",
    category: "back",
    muscleGroup: "Lats",
    muscle_group: "Lats",
    equipment: "Cable Machine",
    description: "Vertical pull for lat development"
  },
  {
    id: "barbell-row",
    name: "Barbell Row",
    category: "back",
    muscleGroup: "Back",
    muscle_group: "Back",
    equipment: "Barbell",
    description: "Horizontal pull for back thickness"
  },
  {
    id: "cable-row",
    name: "Seated Cable Row",
    category: "back",
    muscleGroup: "Back",
    muscle_group: "Back",
    equipment: "Cable Machine",
    description: "Controlled horizontal pull"
  },
  {
    id: "pull-up",
    name: "Pull-Up",
    category: "back",
    muscleGroup: "Lats",
    muscle_group: "Lats",
    equipment: "Bodyweight",
    description: "Bodyweight vertical pull"
  },

  // Shoulders
  {
    id: "overhead-press",
    name: "Overhead Press",
    category: "shoulders",
    muscleGroup: "Shoulders",
    muscle_group: "Shoulders",
    equipment: "Barbell",
    description: "Compound shoulder movement"
  },
  {
    id: "lateral-raise",
    name: "Lateral Raise",
    category: "shoulders",
    muscleGroup: "Side Delts",
    muscle_group: "Side Delts",
    equipment: "Dumbbells",
    description: "Isolation for lateral deltoids"
  },
  {
    id: "front-raise",
    name: "Front Raise",
    category: "shoulders",
    muscleGroup: "Front Delts",
    muscle_group: "Front Delts",
    equipment: "Dumbbells",
    description: "Isolation for anterior deltoids"
  },
  {
    id: "face-pull",
    name: "Face Pull",
    category: "shoulders",
    muscleGroup: "Rear Delts",
    muscle_group: "Rear Delts",
    equipment: "Cable Machine",
    description: "Rear delt and rotator cuff work"
  },
  {
    id: "shoulder-press-machine",
    name: "Shoulder Press Machine",
    category: "shoulders",
    muscleGroup: "Shoulders",
    muscle_group: "Shoulders",
    equipment: "Machine",
    description: "Machine-assisted shoulder press"
  },

  // Arms
  {
    id: "barbell-curl",
    name: "Barbell Curl",
    category: "arms",
    muscleGroup: "Biceps",
    muscle_group: "Biceps",
    equipment: "Barbell",
    description: "Classic bicep builder"
  },
  {
    id: "tricep-pushdown",
    name: "Tricep Pushdown",
    category: "arms",
    muscleGroup: "Triceps",
    muscle_group: "Triceps",
    equipment: "Cable Machine",
    description: "Tricep isolation with cable"
  },
  {
    id: "hammer-curl",
    name: "Hammer Curl",
    category: "arms",
    muscleGroup: "Biceps",
    muscle_group: "Biceps",
    equipment: "Dumbbells",
    description: "Targets brachialis and biceps"
  },
  {
    id: "skull-crusher",
    name: "Skull Crusher",
    category: "arms",
    muscleGroup: "Triceps",
    muscle_group: "Triceps",
    equipment: "EZ Bar",
    description: "Lying tricep extension"
  },
  {
    id: "preacher-curl",
    name: "Preacher Curl",
    category: "arms",
    muscleGroup: "Biceps",
    muscle_group: "Biceps",
    equipment: "Machine",
    description: "Isolated bicep curl"
  },

  // Legs
  {
    id: "squat",
    name: "Squat",
    category: "legs",
    muscleGroup: "Quads",
    muscle_group: "Quads",
    equipment: "Barbell",
    description: "King of leg exercises"
  },
  {
    id: "leg-press",
    name: "Leg Press",
    category: "legs",
    muscleGroup: "Quads",
    muscle_group: "Quads",
    equipment: "Machine",
    description: "Machine compound leg movement"
  },
  {
    id: "leg-curl",
    name: "Leg Curl",
    category: "legs",
    muscleGroup: "Hamstrings",
    muscle_group: "Hamstrings",
    equipment: "Machine",
    description: "Hamstring isolation"
  },
  {
    id: "leg-extension",
    name: "Leg Extension",
    category: "legs",
    muscleGroup: "Quads",
    muscle_group: "Quads",
    equipment: "Machine",
    description: "Quad isolation"
  },
  {
    id: "calf-raise",
    name: "Calf Raise",
    category: "legs",
    muscleGroup: "Calves",
    muscle_group: "Calves",
    equipment: "Machine",
    description: "Calf development"
  },
  {
    id: "romanian-deadlift",
    name: "Romanian Deadlift",
    category: "legs",
    muscleGroup: "Hamstrings",
    muscle_group: "Hamstrings",
    equipment: "Barbell",
    description: "Hamstring and glute focus"
  },

  // Core
  {
    id: "cable-crunch",
    name: "Cable Crunch",
    category: "core",
    muscleGroup: "Abs",
    muscle_group: "Abs",
    equipment: "Cable Machine",
    description: "Weighted ab exercise"
  },
  {
    id: "hanging-leg-raise",
    name: "Hanging Leg Raise",
    category: "core",
    muscleGroup: "Abs",
    muscle_group: "Abs",
    equipment: "Bodyweight",
    description: "Lower ab focus"
  },
  {
    id: "plank",
    name: "Plank",
    category: "core",
    muscleGroup: "Core",
    muscle_group: "Core",
    equipment: "Bodyweight",
    description: "Core stability"
  },
];

export const categoryColors: Record<string, string> = {
  chest: "hsl(190, 100%, 50%)",
  back: "hsl(280, 80%, 60%)",
  shoulders: "hsl(35, 100%, 55%)",
  arms: "hsl(340, 80%, 55%)",
  legs: "hsl(150, 70%, 45%)",
  core: "hsl(45, 90%, 55%)",
  cardio: "hsl(0, 80%, 55%)",
};

export const categoryIcons: Record<string, string> = {
  chest: "💪",
  back: "🔙",
  shoulders: "🎯",
  arms: "💪",
  legs: "🦵",
  core: "🎯",
  cardio: "❤️",
};
