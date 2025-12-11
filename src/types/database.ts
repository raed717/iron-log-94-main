export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "13.0.5";
  };
  public: {
    Tables: {
      exercises: {
        Row: {
          category: string;
          created_at: string | null;
          description: string | null;
          equipment: string;
          id: string;
          img_url: string | null;
          muscle_group: string;
          name: string;
          updated_at: string | null;
        };
        Insert: {
          category: string;
          created_at?: string | null;
          description?: string | null;
          equipment: string;
          id: string;
          img_url?: string | null;
          muscle_group: string;
          name: string;
          updated_at?: string | null;
        };
        Update: {
          category?: string;
          created_at?: string | null;
          description?: string | null;
          equipment?: string;
          id?: string;
          img_url?: string | null;
          muscle_group?: string;
          name?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      program_exercises: {
        Row: {
          created_at: string | null;
          exercise_id: string;
          id: string;
          order_index: number;
          program_id: string;
          reps_target: number | null;
          sets_target: number | null;
        };
        Insert: {
          created_at?: string | null;
          exercise_id: string;
          id?: string;
          order_index: number;
          program_id: string;
          reps_target?: number | null;
          sets_target?: number | null;
        };
        Update: {
          created_at?: string | null;
          exercise_id?: string;
          id?: string;
          order_index?: number;
          program_id?: string;
          reps_target?: number | null;
          sets_target?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "program_exercises_exercise_id_fkey";
            columns: ["exercise_id"];
            isOneToOne: false;
            referencedRelation: "exercises";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "program_exercises_program_id_fkey";
            columns: ["program_id"];
            isOneToOne: false;
            referencedRelation: "programs";
            referencedColumns: ["id"];
          }
        ];
      };
      programs: {
        Row: {
          created_at: string | null;
          description: string | null;
          focus_area: string;
          id: string;
          name: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          focus_area: string;
          id?: string;
          name: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          focus_area?: string;
          id?: string;
          name?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "programs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      users: {
        Row: {
          avatar_url: string | null;
          created_at: string | null;
          email: string;
          full_name: string | null;
          id: string;
          updated_at: string | null;
          username: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string | null;
          email: string;
          full_name?: string | null;
          id: string;
          updated_at?: string | null;
          username: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string | null;
          email?: string;
          full_name?: string | null;
          id?: string;
          updated_at?: string | null;
          username?: string;
        };
        Relationships: [];
      };
      workout_logs: {
        Row: {
          created_at: string | null;
          exercise_id: string;
          id: string;
          notes: string | null;
          updated_at: string | null;
          user_id: string;
          workout_session_id: string;
        };
        Insert: {
          created_at?: string | null;
          exercise_id: string;
          id?: string;
          notes?: string | null;
          updated_at?: string | null;
          user_id: string;
          workout_session_id: string;
        };
        Update: {
          created_at?: string | null;
          exercise_id?: string;
          id?: string;
          notes?: string | null;
          updated_at?: string | null;
          user_id?: string;
          workout_session_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "workout_logs_exercise_id_fkey";
            columns: ["exercise_id"];
            isOneToOne: false;
            referencedRelation: "exercises";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "workout_logs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "workout_logs_workout_session_id_fkey";
            columns: ["workout_session_id"];
            isOneToOne: false;
            referencedRelation: "workout_sessions";
            referencedColumns: ["id"];
          }
        ];
      };
      workout_sessions: {
        Row: {
          created_at: string | null;
          duration_minutes: number | null;
          id: string;
          session_date: string;
          session_name: string | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          duration_minutes?: number | null;
          id?: string;
          session_date: string;
          session_name?: string | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          duration_minutes?: number | null;
          id?: string;
          session_date?: string;
          session_name?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "workout_sessions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      workout_sets: {
        Row: {
          created_at: string | null;
          id: string;
          is_completed: boolean | null;
          reps: number;
          set_number: number;
          user_id: string;
          weight: number;
          workout_log_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          is_completed?: boolean | null;
          reps: number;
          set_number: number;
          user_id: string;
          weight: number;
          workout_log_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          is_completed?: boolean | null;
          reps?: number;
          set_number?: number;
          user_id?: string;
          weight?: number;
          workout_log_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "workout_sets_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "workout_sets_workout_log_id_fkey";
            columns: ["workout_log_id"];
            isOneToOne: false;
            referencedRelation: "workout_logs";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
