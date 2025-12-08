export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  muscle_group: string;
  muscleGroup?: string; // Support both for backwards compatibility
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
  set_number?: number;
  setNumber?: number;
  weight: number;
  reps: number;
  is_completed?: boolean;
  completed?: boolean;
}

export interface WorkoutLog {
  id: string;
  date?: string;
  exercise_id?: string;
  exerciseId?: string;
  sets?: WorkoutSet[];
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
  previousWeeklyTotal?: number;
}
