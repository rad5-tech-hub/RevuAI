import {
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Download,
  Mail,
  Volume2,
  PlayCircle,
  FileText,
  TrendingUp,
  MessageSquare,
  Star,
  TrendingDown,
  Share2,
  QrCode,
  LogOut,
  X,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import BusinessHeader from "./../components/headerComponents";
import StrengthsProblemsSection from "../components/StrengthsProblemsSection";

const ReportSection = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [dynamicFeedbackData, setDynamicFeedbackData] = useState([]);
  const [dynamicKeywordData, setDynamicKeywordData] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("This Week");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchData();
  }, [BASE_URL, selectedPeriod]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const businessId = localStorage.getItem("authBusinessId");
      if (!token || !businessId) throw new Error("No authentication token or business ID found");

      const [dashboardResponse, analyticsResponse] = await Promise.all([
        axios.get(`${BASE_URL}/api/v1/business/business-dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${BASE_URL}/api/v1/business/analytics/${businessId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      // Set dashboard data
      setMetrics(dashboardResponse.data || null);
      setDynamicFeedbackData(dashboardResponse.data.recent_feedbacks || []);

      // Combine top issues and positive highlights for keywords
      const keywords = [
        ...(analyticsResponse.data.aiAnalysis.topIssues || []).map((issue) => ({
          name: issue.issue,
          frequency: issue.count,
          type: "issue",
        })),
        ...(analyticsResponse.data.aiAnalysis.positiveHighlights || []).map((highlight) => ({
          name: highlight.highlight,
          frequency: highlight.count,
          type: "highlight",
        })),
      ];
      setDynamicKeywordData(keywords);
      setRecommendations(analyticsResponse.data.aiAnalysis.recommendations || []);

      setError("");
    } catch (err) {
      setError("Failed to load data.");
      console.error("Data fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/");
      return;
    }
    setIsLoading(true);
    try {
      await axios.post(
        `${BASE_URL}/api/v1/logout/logout`,
        { refreshToken: token },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.removeItem("authToken");
      localStorage.removeItem("authBusinessId");
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
      setError("Logout failed. Please try again.");
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  const LoadingSpinner = () => (
    <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-300 border-t-blue-600"></div>
  );

  // Prepare data for Feedback Trends chart
  const chartData = metrics?.rating_distribution
    ? Object.entries(metrics.rating_distribution).map(([label, count]) => ({
        name: label,
        count,
      }))
    : [];

  const downloadCSV = (data, filename) => {
    if (data.length === 0) return;
    const csv = "Name,Count\n" + data.map((row) => `${row.name},${row.count}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareContent = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Reports & Insights",
          text: "Check out the latest reports and insights!",
          url: window.location.href,
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      alert("Sharing is not supported in this browser.");
    }
  };

  const emailReports = () => {
    if (dynamicFeedbackData.length === 0) return;
    const subject = "Generated Reports";
    const body = dynamicFeedbackData
      .map(
        (f) =>
          `Feedback ID: ${f.id}\nRating: ${f.rating_label} (${f.rating}/5)\nComment: ${f.comment}\nReviewer: ${f.reviewer}\nDate: ${f.createdAt}\n\n`
      )
      .join("");
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen bg-white">
      <BusinessHeader onLogout={handleLogout} isLoggingOut={isLoading} />
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </div>
      )}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-0 items-center justify-between py-6">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">Reports & Insights</h1>
              <p className="text-base text-gray-500 mt-1">
                AI-powered analysis and automated reporting for {metrics?.business_name || "your business"}
              </p>
            </div>
            <div className="flex items-start lg:items-center gap-5">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-white cursor-pointer outline-blue-600 rounded-lg px-3 py-2 pr-8 appearance-none relative border border-gray-200"
                style={{
                  backgroundImage:
                    'url("data:image/svg+xml;utf8,<svg fill=\'%230055aa\' height=\'20\' viewBox=\'0 0 24 24\' width=\'20\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/></svg>")',
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0.5rem center",
                  backgroundSize: "1.2rem",
                  borderRadius: "0.5rem",
                }}
              >
                <option>This Week</option>
                <option>Today</option>
                <option>This Month</option>
                <option>This Quarter</option>
                <option>This Year</option>
              </select>
              <button
                onClick={fetchData}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-base font-medium flex items-center"
              >
                <span className="mr-2">✨</span>
                Generate Report
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : (
          <div>
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base text-gray-600">Total Feedback</p>
                    <p className="text-3xl font-semibold text-gray-900">
                      {metrics?.total_feedbacks ?? "Nothing here yet"}
                    </p>
                  </div>
                  <MessageSquare className="w-10 h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base text-gray-600">Avg Rating</p>
                    <p className="text-3xl font-semibold text-gray-900">
                      {metrics?.average_rating ? `${metrics.average_rating}/5` : "Nothing here yet"}
                    </p>
                  </div>
                  <Star className="w-10 h-10 text-yellow-500" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base text-gray-600">Response Rate</p>
                    <p className="text-3xl font-semibold text-gray-900">N/A</p>
                  </div>
                  <TrendingDown className="w-10 h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base text-gray-600">Growth</p>
                    <p className="text-3xl font-semibold text-gray-900">N/A</p>
                  </div>
                  <TrendingUp className="w-10 h-10 text-green-500" />
                </div>
              </div>
            </div>
            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Feedback Trends Chart */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-medium">Feedback Trends</h3>
                    <div className="flex gap-2">
                      <button
                        className="p-1 hover:bg-gray-100 rounded"
                        onClick={() => downloadCSV(chartData, "feedback_trends.csv")}
                      >
                        <Download className="w-5 h-5 text-gray-500" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded" onClick={shareContent}>
                        <Share2 className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={320}>
                      <BarChart data={chartData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-80 flex items-center justify-center">
                      <p className="text-base text-gray-500">No feedback data available yet</p>
                    </div>
                  )}
                </div>
              </div>
              {/* Top Keywords */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-xl font-medium">Top Keywords</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-base font-medium text-gray-500">Keyword</span>
                      <span className="text-base font-medium text-gray-500">Frequency</span>
                    </div>
                    {dynamicKeywordData.length > 0 ? (
                      dynamicKeywordData.map((keyword, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-base text-gray-900">{keyword.name}</span>
                          <span className="text-base text-gray-900">{keyword.frequency}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-base text-gray-500">
                        No keywords available yet
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Bottom Section - Insights and Reports */}
            <div className="mt-8">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-medium text-gray-900">AI-Powered Insights</h2>
                  <button className="text-base cursor-pointer text-blue-600 hover:text-blue-700" onClick={openModal}>
                    View All
                  </button>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6">
                  {dynamicKeywordData.length > 0 || recommendations.length > 0 ? (
                    <div className="space-y-6">
                      {recommendations.length > 0 && (
                        <div>
                          <h4 className="text-base font-medium text-gray-700 mb-2">Recommendations</h4>
                          <ul className="space-y-2">
                            {recommendations.slice(0, 3).map((rec, index) => ( // Show first 3 as teaser
                              <li key={index} className="text-base text-gray-600">
                                - {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-base text-gray-500">No insights available yet</p>
                  )}
                </div>
              </div>
<StrengthsProblemsSection 
    businessId={localStorage.getItem("authBusinessId")}
    authToken={localStorage.getItem("authToken")}
    baseUrl={BASE_URL}
  />
              <div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal for View All Insights */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium text-gray-900">All AI-Powered Insights</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-6">
              <ul className="space-y-4">
                {dynamicKeywordData.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Lightbulb
                      className={`w-6 h-6 ${item.type === "issue" ? "text-red-500" : "text-green-500"}`}
                    />
                    <div>
                      <p className="text-base font-medium text-gray-900">{item.name}</p>
                      <p className="text-base text-gray-500">Mentions: {item.frequency}</p>
                    </div>
                  </li>
                ))}
              </ul>
              {recommendations.length > 0 && (
                <div>
                  <h4 className="text-base font-medium text-gray-700 mb-2">Recommendations</h4>
                  <ul className="space-y-2">
                    {recommendations.map((rec, index) => (
                      <li key={index} className="text-base text-gray-600">
                        - {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportSection;