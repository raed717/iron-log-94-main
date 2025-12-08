import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";

interface WeeklyChartProps {
  data: number[];
}

const WeeklyChart = ({ data }: WeeklyChartProps) => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const today = new Date().getDay();
  const todayIndex = today === 0 ? 6 : today - 1;

  const chartData = data.map((workouts, index) => ({
    day: days[index],
    workouts,
    isToday: index === todayIndex,
  }));

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} barCategoryGap="20%">
          <XAxis 
            dataKey="day" 
            axisLine={false} 
            tickLine={false}
            tick={{ fill: 'hsl(215, 15%, 55%)', fontSize: 12 }}
          />
          <YAxis hide />
          <Bar dataKey="workouts" radius={[6, 6, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.isToday ? "hsl(190, 100%, 50%)" : "hsl(220, 15%, 25%)"}
                className={entry.isToday ? "animate-pulse-glow" : ""}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyChart;
