import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import StatCard from "@/components/dashboard/StatCard";
import WeeklyChart from "@/components/dashboard/WeeklyChart";
import RecentWorkouts from "@/components/dashboard/RecentWorkouts";
import { useGlobalStats } from "@/hooks/useStats";
import { useWorkoutLogs } from "@/hooks/useWorkoutData";
import { WorkoutLog } from "@/types/workout";
import { Dumbbell, Flame, TrendingUp, Calendar, Zap, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const stats = useGlobalStats();
  const { logs, loading } = useWorkoutLogs();

  if (loading) {
    return (
      <div className="min-h-screen pb-24 md:pb-8">
        <Header />
        <main className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-slate-400">Loading dashboard...</div>
        </main>
      </div>
    );
  }

  // compute week-over-week trend: compare last 7 days total to previous 7 days
  const currentWeekTotal = stats.weeklyWorkouts?.reduce((a, b) => a + b, 0) || 0;
  const previousWeekTotal = stats.previousWeeklyTotal || 0;
  const trendPercent = previousWeekTotal > 0
    ? Math.round(((currentWeekTotal - previousWeekTotal) / previousWeekTotal) * 100)
    : (currentWeekTotal > 0 ? 100 : 0);
  const trendPositive = trendPercent >= 0;

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-12 opacity-0 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-2">
            <div>
              <p className="text-primary font-medium mb-2">Welcome back, Champion</p>
              <h1 className="font-display text-5xl md:text-6xl tracking-wide">
                <span className="text-gradient-power">TRACK</span>
                <span className="text-foreground"> YOUR </span>
                <span className="text-gradient-energy">GAINS</span>
              </h1>
            </div>
            <Button 
              variant="power" 
              size="xl"
              onClick={() => navigate("/workout")}
              className="md:mb-2"
            >
              <Zap className="h-5 w-5 mr-2" />
              Start Workout
            </Button>
          </div>
          <p className="text-muted-foreground text-lg max-w-xl">
            Every rep counts. Every set matters. Track your progress and watch yourself grow stronger.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Workouts"
            value={stats.totalWorkouts}
            subtitle="This month"
            icon={Dumbbell}
            variant="primary"
            trend={{ value: trendPercent, positive: trendPositive }}
            delay={100}
          />
          <StatCard
            title="Current Streak"
            value={`${stats.currentStreak} days`}
            subtitle={`Best: ${stats.longestStreak} days`}
            icon={Flame}
            variant="accent"
            delay={200}
          />
          <StatCard
            title="Total Volume"
            value={`${(stats.totalVolume / 1000).toFixed(1)}t`}
            subtitle="Total weight lifted"
            icon={TrendingUp}
            delay={300}
          />
          <StatCard
            title="Total Sets"
            value={stats.totalSets}
            subtitle={`${stats.totalReps.toLocaleString()} reps`}
            icon={Target}
            delay={400}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Weekly Activity */}
          <div className="lg:col-span-2 rounded-xl border border-border bg-gradient-card p-6 opacity-0 animate-fade-in" style={{ animationDelay: "150ms" }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl tracking-wide text-foreground">Weekly Activity</h3>
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </div>
            <WeeklyChart data={stats.weeklyWorkouts} />
            <div className="mt-4 flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-primary" />
                <span className="text-muted-foreground">Today</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-secondary" />
                <span className="text-muted-foreground">Other days</span>
              </div>
            </div>
          </div>

          {/* Recent Workouts */}
          <RecentWorkouts logs={logs} />
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="h-auto py-6 flex flex-col items-center gap-2 hover:bg-primary/5 hover:border-primary/30"
            onClick={() => navigate("/exercises")}
          >
            <Dumbbell className="h-6 w-6 text-primary" />
            <span className="font-display text-lg">Browse Exercises</span>
            <span className="text-xs text-muted-foreground">30+ exercises</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-6 flex flex-col items-center gap-2 hover:bg-accent/5 hover:border-accent/30"
            onClick={() => navigate("/workout")}
          >
            <Zap className="h-6 w-6 text-accent" />
            <span className="font-display text-lg">Log Workout</span>
            <span className="text-xs text-muted-foreground">Track your session</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-6 flex flex-col items-center gap-2 hover:bg-primary/5 hover:border-primary/30"
            onClick={() => navigate("/progress")}
          >
            <TrendingUp className="h-6 w-6 text-primary" />
            <span className="font-display text-lg">View Progress</span>
            <span className="text-xs text-muted-foreground">Charts & stats</span>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Index;
