import { Link } from "react-router-dom";
import { AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";

const getPriorityColor = (mentions) => {
  if (mentions >= 10) return "bg-red-100 text-red-800"; // High priority
  if (mentions >= 5) return "bg-orange-100 text-orange-800"; // Medium priority
  return "bg-green-100 text-green-800"; // Low priority
};

const getTrendIcon = (trend) => {
  switch (trend) {
    case "up":
      return <TrendingUp className="text-red-600 w-4 h-4" />;
    case "down":
      return <TrendingDown className="text-green-600 w-4 h-4" />;
    default:
      return <div className="w-4 h-4 bg-gray-500 rounded-full"></div>;
  }
};

const TopIssuesCard = ({ tags }) => {
  // Aggregate tag counts
  const tagCounts = (tags || []).reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {});
  const topTags = Object.entries(tagCounts)
    .map(([tag, count]) => ({
      issue: tag,
      mentions: count,
      priority: count >= 10 ? "high" : count >= 5 ? "medium" : "low",
      trend: count >= 10 ? "up" : count >= 5 ? "down" : "stable", // Simplified trend logic
    }))
    .sort((a, b) => b.mentions - a.mentions)
    .slice(0, 5);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Top Issues This Week</h3>
        <Link
          to="/businessFeedback"
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          View All
        </Link>
      </div>
      <div className="space-y-4">
        {topTags.length > 0 ? (
          topTags.map((issue, index) => (
            <div
              key={`issue-${issue.issue}-${index}`}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="font-medium text-gray-900">{issue.issue}</h4>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full text-center ${getPriorityColor(issue.mentions)}`}
                  >
                    {issue.priority} priority
                  </span>
                </div>
                <p className="text-sm text-gray-600">{issue.mentions} mentions</p>
              </div>
              <div className="text-lg ml-4">{getTrendIcon(issue.trend)}</div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">No issues identified</h4>
            <p className="text-gray-500 text-sm max-w-xs">
              As feedback comes in, common issues will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopIssuesCard;