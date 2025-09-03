import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useFetchDashboardData from "../hooks/useFetchDashboardData";
import DashboardStatCard from "../components/DashboardStatCard";
import WeeklyTrendChart from "../components/WeeklyTrendChart";
import RatingDistribution from "../components/RatingDistribution";
import TopIssuesCard from "../components/TopIssuesCard";
import RecentFeedbackCard from "../components/RecentFeedbackCard";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { QrCode, Download, Share2, LogOut, MessageSquare, Star, Users, AlertTriangle } from "lucide-react";
import axios from "axios";

const BusinessDashboard = () => {
  const { dashboardData, isLoading, error, retryCount, handleRetry } = useFetchDashboardData();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const token = localStorage.getItem("authToken");
    if (!token) {
      localStorage.removeItem("authToken");
      navigate("/");
      setIsLoggingOut(false);
      return;
    }
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/logout/logout`,
        { refreshToken: token },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.removeItem("authToken");
      toast.success("Logged out successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error("Logout failed. Redirecting to login.", {
        position: "top-right",
        autoClose: 3000,
      });
      localStorage.removeItem("authToken");
      navigate("/");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleExportReport = () => {
    if (!dashboardData?.recentFeedback?.length) {
      toast.info("No feedback available to export.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    const csvContent = [
      ["ID", "Rating", "Rating Label", "Comment", "Reviewer", "Date", "QR Code", "Tags"],
      ...dashboardData.recentFeedback.map((fb) => [
        fb.id,
        fb.rating,
        fb.ratingLabel,
        `"${fb.text.replace(/"/g, '""')}"`,
        fb.name,
        fb.date,
        fb.qrCode,
        fb.aspects.join(";"),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${dashboardData.business_name || "Business"}_Feedback_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    toast.success("Report exported as CSV!", {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const handleShareInsights = async () => {
    const shareData = {
      title: `${dashboardData?.business_name || "Business"} Feedback Insights`,
      text: `Total Feedback: ${dashboardData?.total_feedbacks || 0}\nAverage Rating: ${dashboardData?.average_rating?.toFixed(1) || "N/A"}\nRecent Feedback: ${dashboardData?.recentFeedback?.length ? dashboardData.recentFeedback[0].text : "No recent feedback"}`,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success("Insights shared successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      } catch (error) {
        toast.error("Failed to share insights.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.text);
        toast.success("Insights copied to clipboard!", {
          position: "top-right",
          autoClose: 3000,
        });
      } catch (error) {
        toast.error("Failed to copy insights.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState onRetry={handleRetry} retryCount={retryCount} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-4 mb-4 lg:mb-0">
              <Link to="/businessDashboard" className="flex items-center space-x-2" aria-current="page">
                <div className="w-10 h-10 text-white bg-blue-500 rounded-full flex items-center justify-center">
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
                disabled={isLoggingOut}
                className="px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors flex items-center gap-1 disabled:opacity-50"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
                {isLoggingOut ? "Logging out..." : "Logout"}
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
              onClick={handleExportReport}
              className="flex items-center gap-2 bg-gray-100 hover:bg-blue-200 text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              aria-label="Export report"
            >
              <Download className="w-4 h-4" />
              Export Report
            </button>
            <button
              onClick={handleShareInsights}
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
            value="N/A" // Placeholder until backend provides data
            icon={<Users className="w-6 h-6 text-green-500" />}
          />
          <DashboardStatCard
            title="Active Issues"
            value="N/A" // Placeholder until backend provides data
            icon={<AlertTriangle className="w-6 h-6 text-red-500" />}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <WeeklyTrendChart data={dashboardData?.recentFeedback} />
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <RatingDistribution data={dashboardData?.ratingDistribution} />
          </div>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <TopIssuesCard tags={dashboardData?.recentFeedback?.flatMap((fb) => fb.aspects)} />
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <RecentFeedbackCard feedbacks={dashboardData?.recentFeedback} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default BusinessDashboard;