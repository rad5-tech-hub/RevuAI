import { Star } from "lucide-react";
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart,
  Legend,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length && label) {
    return (
      <div className="bg-white p-2 sm:p-3 border border-gray-200 rounded-lg shadow-sm text-xs sm:text-sm">
        <p className="font-medium">{label}</p>
        {payload.map((entry, index) => (
          <p key={`tooltip-${index}`} style={{ color: entry.color }}>
            {entry.dataKey === "feedback" ? "Feedback" : "Rating"}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const WeeklyTrendChart = ({ data }) => {
  if (!data?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Star className="w-6 h-6 text-gray-400" />
        </div>
        <h4 className="text-lg font-medium text-gray-900 mb-2">No feedback trends yet</h4>
        <p className="text-gray-500 text-sm max-w-xs">
          Once you receive more feedback, you'll see weekly trends here.
        </p>
      </div>
    );
  }

  // Aggregate feedback by day (last 7 days)
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(today);
    day.setDate(today.getDate() - i);
    return day.toLocaleDateString("en-US", { weekday: "short" });
  }).reverse();

  const feedbackByDay = days.map((day, index) => {
    const dayDate = new Date(today);
    dayDate.setDate(today.getDate() - (6 - index));
    const dayFeedback = data.filter((fb) => {
      const fbDate = new Date(fb.date);
      return (
        fbDate.getDate() === dayDate.getDate() &&
        fbDate.getMonth() === dayDate.getMonth() &&
        fbDate.getFullYear() === dayDate.getFullYear()
      );
    });
    return {
      day,
      feedback: dayFeedback.length,
      rating: dayFeedback.length
        ? (dayFeedback.reduce((sum, fb) => sum + fb.rating, 0) / dayFeedback.length).toFixed(1)
        : 0,
    };
  });

  return (
    <>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Weekly Feedback Trends</h3>
      <div className="h-72 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={feedbackByDay}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="day" tick={{ fill: "#6b7280", fontSize: 12 }} />
            <YAxis
              yAxisId="feedback"
              tick={{ fill: "#6b7280", fontSize: 12 }}
              label={{ value: "Feedback Count", angle: -90, position: "insideLeft", offset: -10 }}
            />
            <YAxis
              yAxisId="rating"
              orientation="right"
              domain={[0, 5]}
              tick={{ fill: "#6b7280", fontSize: 12 }}
              label={{ value: "Rating", angle: 90, position: "insideRight", offset: -10 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              yAxisId="feedback"
              dataKey="feedback"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
            />
            <Line
              yAxisId="rating"
              type="monotone"
              dataKey="rating"
              stroke="#f59e0b"
              strokeWidth={3}
              dot
            />
            <Legend verticalAlign="top" height={36} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default WeeklyTrendChart;