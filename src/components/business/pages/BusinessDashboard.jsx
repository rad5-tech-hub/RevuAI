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
import BusinessHeader from './../components/headerComponents';

const BusinessDashboard = () => {
  const { dashboardData, isLoading, error, retryCount, handleRetry } = useFetchDashboardData();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [loading, setLoading] = useState(false);

 const handleLogout = async () => {
    setLoading(true);
    
    const token = localStorage.getItem("authToken");
    const refreshToken = localStorage.getItem("refreshToken");
    
    if (!token || !refreshToken) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("authBusinessId");
      localStorage.removeItem("qrCodeIds");
      localStorage.removeItem("qrTypeMap");
      navigate("/businessAuth");
      setLoading(false);
      return;
    }
    
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/logout/logout`,
        { refreshToken },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("authBusinessId");
      localStorage.removeItem("qrCodeIds");
      localStorage.removeItem("qrTypeMap");
      
      toast.success("Logged out successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      
      navigate("/businessAuth");
    } catch (err) {
      console.error("Logout failed:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      
      toast.error("Logout failed. Redirecting to login.", {
        position: "top-right",
        autoClose: 3000,
      });
      
      // Clear storage anyway and redirect
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("authBusinessId");
      localStorage.removeItem("qrCodeIds");
      localStorage.removeItem("qrTypeMap");
      navigate("/businessAuth");
    } finally {
      setLoading(false);
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
   <BusinessHeader onLogout={handleLogout} isLoggingOut={isLoading} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Business Dashboard
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