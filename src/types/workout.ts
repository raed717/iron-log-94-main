export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  muscleGroup: string;
  equipment: string;
  description?: string;
}

export type ExerciseCategory = 
  | 'chest' 
  | 'back' 
  | 'shoulders' 
  | 'arms' 
  | 'legs' 
  | 'core' 
  | 'cardio';

export interface WorkoutSet {
  id: string;
  setNumber: number;
  weight: number;
  reps: number;
  completed: boolean;
}

export interface WorkoutLog {
  id: string;
  date: string;
  exerciseId: string;
  sets: WorkoutSet[];
  notes?: string;
}

export interface WorkoutSession {
  id: string;
  date: string;
  name: string;
  logs: WorkoutLog[];
  duration?: number;
}

export interface ExerciseStats {
  exerciseId: string;
  totalSets: number;
  totalReps: number;
  maxWeight: number;
  avgWeight: number;
  lastWorkout: string;
  progressData: ProgressPoint[];
}

export interface ProgressPoint {
  date: string;
  weight: number;
  reps: number;
  volume: number;
}

export interface GlobalStats {
  totalWorkouts: number;
  totalSets: number;
  totalReps: number;
  totalVolume: number;
  currentStreak: number;
  longestStreak: number;
  weeklyWorkouts: number[];
}
