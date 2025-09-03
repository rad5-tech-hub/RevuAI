
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const useFetchDashboardData = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError("");
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("No authentication token found. Please sign in.");
      toast.error("Please log in to view dashboard.", {
        position: "top-right",
        autoClose: 3000,
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/business/business-dashboard`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.data) {
        throw new Error("No data received from the server");
      }

      const ratingDistribution = Object.entries(response.data.rating_distribution || {}).map(
        ([rating, count]) => ({
          rating,
          count,
          percentage: response.data.total_feedbacks
            ? ((count / response.data.total_feedbacks) * 100).toFixed(1)
            : 0,
        })
      );

      const recentFeedback = (response.data.recent_feedbacks || []).map((feedback) => ({
        id: feedback.id || `feedback-${Math.random()}`,
        rating: feedback.rating || 0,
        ratingLabel: feedback.rating_label || "N/A",
        text: feedback.comment || "No comment provided",
        name: feedback.isAnonymous ? "Anonymous" : feedback.reviewer || "Unknown User",
        date: feedback.createdAt || "Recent",
        qrCode: feedback.qrcodeTitle || "Unknown",
        aspects: Array.isArray(feedback.qrcodeTags) ? feedback.qrcodeTags : [],
        hasMedia: feedback.hasMedia || false, // Default to false as not provided in API
      }));

      setDashboardData({
        business_name: response.data.business_name || "Business Dashboard",
        total_feedbacks: response.data.total_feedbacks || 0,
        average_rating: response.data.average_rating || 0,
        ratingDistribution,
        recentFeedback,
      });
      setRetryCount(0);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to fetch dashboard data";
      setError(errorMessage);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
      if (err.response?.status === 401) {
        localStorage.removeItem("authToken");
        window.location.href = "/";
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
    fetchDashboardData();
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return { dashboardData, isLoading, error, retryCount, handleRetry };
};

export default useFetchDashboardData;