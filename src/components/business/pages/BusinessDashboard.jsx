import { Link, useNavigate } from "react-router-dom";
import useFetchDashboardData from "../hooks/useFetchDashboardData";
import DashboardStatCard from "../components/DashboardStatCard";
import WeeklyTrendChart from "../components/WeeklyTrendChart";
import RatingDistribution from "../components/RatingDistribution";
import TopIssuesCard from "../components/TopIssuesCard";
import RecentFeedbackCard from "../components/RecentFeedbackCard";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import {
  QrCode,
  Download,
  Share2,
  LogOut,
  MessageSquare,
  Star,
  Users,
  AlertTriangle
} from "lucide-react";
import axios from "axios";
const BusinessDashboard = () => {
  const { dashboardData, isLoading, error, retryCount, handleRetry } = useFetchDashboardData();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/");
      return;
    }
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/logout/logout`,
        { refreshToken: token },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.removeItem("authToken");
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
      navigate("/");
    }
  };

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState onRetry={handleRetry} retryCount={retryCount} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-4 mb-4 lg:mb-0">
              <Link to="/businessDashboard" className="flex items-center space-x-2" aria-current="page">
                <div className="w-10 h-10 text-white mx-auto bg-blue-500 mr-2 rounded-full flex items-center justify-center">
                  <QrCode className="w-6 h-6" />
                </div>
                <span className="text-xl font-bold text-black">RevuAi</span>
              </Link>
              <span className="text-gray-500">Business Portal</span>
            </div>
            <nav className="flex flex-wrap gap-2 lg:gap-8 mb-4 lg:mb-0 items-center">
              <Link
                to="/businessDashboard"
                className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                aria-current="page"
              >
                📊 Dashboard
              </Link>
              <Link
                to="/businessFeedback"
                className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
              >
                💬 Feedback
              </Link>
              <Link
                to="/businessQrpage"
                className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
              >
                📱 QR Codes
              </Link>
              <Link
                to="/businessReports"
                className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
              >
                📈 Reports
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors flex items-center gap-1"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </nav>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {dashboardData?.business_name ?? "Business"} Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Welcome back! Here's what's happening with your customer feedback.
            </p>
          </div>
          <div className="flex flex-row gap-3 items-center">
            <button
              className="flex items-center gap-2 bg-gray-100 hover:bg-blue-200 text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              aria-label="Export report"
            >
              <Download className="w-4 h-4" />
              Export Report
            </button>
            <button
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              aria-label="Share insights"
            >
              <Share2 className="w-4 h-4" />
              Share Insights
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardStatCard
            title="Total Feedback"
            value={dashboardData?.total_feedbacks ?? 0}
            icon={<MessageSquare className="w-6 h-6 text-blue-500" />}
          />
          <DashboardStatCard
            title="Average Rating"
            value={dashboardData?.average_rating?.toFixed(1) ?? "N/A"}
            icon={<Star className="w-6 h-6 text-yellow-500" />}
          />
          <DashboardStatCard
            title="Response Rate"
            value="N/A"
            icon={<Users className="w-6 h-6 text-green-500" />}
          />
          <DashboardStatCard
            title="Active Issues"
            value="N/A"
            icon={<AlertTriangle className="w-6 h-6 text-red-500" />}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <WeeklyTrendChart />
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <RatingDistribution data={dashboardData?.ratingDistribution} />
          </div>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <TopIssuesCard />
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <RecentFeedbackCard feedbacks={dashboardData?.recentFeedback} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default BusinessDashboard;