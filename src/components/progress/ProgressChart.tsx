import { ProgressPoint } from "@/types/workout";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { cn } from "@/lib/utils";

interface ProgressChartProps {
  data: ProgressPoint[];
  metric: "weight" | "volume" | "reps";
  title: string;
}

const ProgressChart = ({ data, metric, title }: ProgressChartProps) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const chartData = data.map(point => ({
    ...point,
    displayDate: formatDate(point.date),
  }));

  const getMetricLabel = () => {
    switch (metric) {
      case "weight": return "Max Weight (kg)";
      case "volume": return "Total Volume (kg)";
      case "reps": return "Total Reps";
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm text-muted-foreground mb-1">{label}</p>
          <p className="font-display text-xl text-primary">
            {payload[0].value.toLocaleString()}
            <span className="text-sm text-muted-foreground ml-1">
              {metric === "reps" ? "" : "kg"}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-gradient-card p-6">
        <h4 className="font-display text-lg mb-4">{title}</h4>
        <div className="h-48 flex items-center justify-center text-muted-foreground">
          No data available yet
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-gradient-card p-6 opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-display text-lg">{title}</h4>
        <span className="text-xs text-muted-foreground uppercase tracking-wider">
          {getMetricLabel()}
        </span>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(190, 100%, 50%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(190, 100%, 50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
            <XAxis 
              dataKey="displayDate" 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: 'hsl(215, 15%, 55%)', fontSize: 11 }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: 'hsl(215, 15%, 55%)', fontSize: 11 }}
              width={50}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey={metric}
              stroke="hsl(190, 100%, 50%)"
              strokeWidth={2}
              fill="url(#colorMetric)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProgressChart;
