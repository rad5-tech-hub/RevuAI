import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart, Legend } from "recharts";
// import { weeklyData } from "../pages/BusinessDashboard";

const weeklyData = [
  { day: "Mon", feedback: 12, rating: 4.2 },
  { day: "Tue", feedback: 19, rating: 4.1 },
  { day: "Wed", feedback: 15, rating: 4.5 },
  { day: "Thu", feedback: 25, rating: 4.3 },
  { day: "Fri", feedback: 30, rating: 4.4 },
  { day: "Sat", feedback: 28, rating: 4.6 },
  { day: "Sun", feedback: 22, rating: 4.2 },
];

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

const WeeklyTrendChart = () => (
  <>
    <h3 className="text-lg font-semibold text-gray-900 mb-6">Weekly Feedback Trends</h3>
    <div className="h-72 md:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={weeklyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="day" tick={{ fill: "#6b7280", fontSize: 12 }} />
          <YAxis yAxisId="feedback" tick={{ fill: "#6b7280", fontSize: 12 }} />
          <YAxis yAxisId="rating" orientation="right" domain={[0, 5]} tick={{ fill: "#6b7280", fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar yAxisId="feedback" dataKey="feedback" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Line yAxisId="rating" type="monotone" dataKey="rating" stroke="#f59e0b" strokeWidth={3} dot />
          <Legend verticalAlign="top" height={36} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  </>
);

export default WeeklyTrendChart;