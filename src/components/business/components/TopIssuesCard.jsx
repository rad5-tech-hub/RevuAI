import { Link } from "react-router-dom";
import { TrendingUp, TrendingDown } from "lucide-react";
// import { topIssues } from "../pages/BusinessDashboard";

const getPriorityColor = (priority) => {
  switch (priority) {
    case "high": return "bg-red-100 text-red-800";
    case "medium": return "bg-orange-100 text-orange-800";
    case "low": return "bg-green-100 text-green-800";
    default: return "bg-gray-100 text-gray-800";
  }
};
 
const topIssues = [
  { issue: "Long wait times", priority: "high", mentions: 12, trend: "up" },
  { issue: "Cold food temperature", priority: "medium", mentions: 8, trend: "down" },
  { issue: "Noisy environment", priority: "low", mentions: 6, trend: "stable" },
  { issue: "Limited seating", priority: "low", mentions: 4, trend: "down" },
];
const getTrendIcon = (trend) => {
  switch (trend) {
    case "up": return <TrendingUp className="text-red-600 w-4 h-4" />;
    case "down": return <TrendingDown className="text-green-600 w-4 h-4" />;
    case "stable": return <div className="w-4 h-4 bg-gray-500 rounded-full"></div>;
    default: return <div className="w-4 h-4 bg-gray-500 rounded-full"></div>;
  }
};

const TopIssuesCard = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-semibold text-gray-900">Top Issues This Week</h3>
      <Link to="/businessFeedback" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
        View All
      </Link>
    </div>
    <div className="space-y-4">
      {topIssues.map((issue, index) => (
        <div
          key={`issue-${issue.issue}-${index}`}
          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h4 className="font-medium text-gray-900">{issue.issue}</h4>
              <span className={`px-2 py-1 text-xs font-medium rounded-full text-center ${getPriorityColor(issue.priority)}`}>
                {issue.priority} priority
              </span>
            </div>
            <p className="text-sm text-gray-600">{issue.mentions} mentions</p>
          </div>
          <div className="text-lg ml-4">{getTrendIcon(issue.trend)}</div>
        </div>
      ))}
    </div>
  </div>
);

export default TopIssuesCard;