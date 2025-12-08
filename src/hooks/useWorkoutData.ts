import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';

export interface WorkoutSession {
  id: string;
  user_id: string;
  session_date: string;
  session_name: string | null;
  duration_minutes: number | null;
  created_at: string;
  updated_at: string;
}

export interface WorkoutSet {
  id: string;
  user_id: string;
  workout_log_id: string;
  set_number: number;
  weight: number;
  reps: number;
  is_completed: boolean;
  created_at: string;
}

export interface WorkoutLog {
  id: string;
  user_id: string;
  exercise_id: string;
  workout_session_id: string;
  notes: string | null;
  sets?: WorkoutSet[];
  created_at: string;
  updated_at: string;
}

export function useWorkoutSessions() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchSessions = async () => {
      try {
        const { data, error } = await supabase
          .from('workout_sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('session_date', { ascending: false });
        
        if (error) throw error;
        setSessions(data || []);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch workout sessions';
        setError(errorMessage);
        console.error('Error fetching workout sessions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [user]);

  return { sessions, loading, error };
}

export function useWorkoutLogs(sessionId?: string) {
  const { user } = useAuth();
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchLogs = async () => {
      try {
        let query = supabase
          .from('workout_logs')
          .select('*')
          .eq('user_id', user.id);

        if (sessionId) {
          query = query.eq('workout_session_id', sessionId);
        }

        const { data, error } = await query.order('created_at', { ascending: false });
        
        if (error) throw error;
        setLogs(data || []);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch workout logs';
        setError(errorMessage);
        console.error('Error fetching workout logs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [user, sessionId]);

  return { logs, loading, error };
}

export function useWorkoutSets(logId?: string) {
  const { user } = useAuth();
  const [sets, setSets] = useState<WorkoutSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !logId) {
      setLoading(false);
      return;
    }

    const fetchSets = async () => {
      try {
        const { data, error } = await supabase
          .from('workout_sets')
          .select('*')
          .eq('user_id', user.id)
          .eq('workout_log_id', logId)
          .order('set_number', { ascending: true });
        
        if (error) throw error;
        setSets(data || []);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch workout sets';
        setError(errorMessage);
        console.error('Error fetching workout sets:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSets();
  }, [user, logId]);

  return { sets, loading, error };
}
