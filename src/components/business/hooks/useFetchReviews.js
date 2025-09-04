
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const useFetchReviews = ({ search, ratingFilter, sentimentFilter, dateFilter }) => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1, limit: 10 });
  const [ratingSummary, setRatingSummary] = useState({
    Excellent: 0,
    "Very Good": 0,
    Average: 0,
    Poor: 0,
    "Very Poor": 0,
  });
  const [averageRating, setAverageRating] = useState("0.0");

  const getSentiment = (rating) => {
    if (rating >= 4) return "Positive";
    if (rating === 3) return "Neutral";
    return "Negative";
  };

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Please log in to view feedback.", {
          position: "top-right",
          autoClose: 3000,
        });
        setLoading(false);
        return;
      }

      try {
        const query = new URLSearchParams();
        if (search) query.append("search", search);
        if (ratingFilter && ratingFilter !== "All Ratings") {
          query.append("rating", parseInt(ratingFilter));
        }
       
        query.append("page", page);
        query.append("limit", meta.limit);

        const endpoint =
          query.toString() && (search || ratingFilter !== "All Ratings")
            ? `${import.meta.env.VITE_API_URL}/api/v1/review/filter?${query.toString()}`
            : `${import.meta.env.VITE_API_URL}/api/v1/review/all-reviews`;

        const response = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("API response:", response.data); // Debug log

        const { reviews, totalReviews, ratingSummary, averageRating } = response.data;

        setFeedback(
          reviews.map((review) => ({
            id: review.id,
            name: review.isAnonymous ? "Anonymous" : review.user?.name || "Unknown User",
            date: new Date(review.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            rating: review.rating || 0,
            ratingLabel: review.ratingLabel || "N/A",
            sentiment: getSentiment(review.rating),
            text: review.comment || "No comment provided",
            aspects: Array.isArray(review.qrcode_tags) ? review.qrcode_tags : [],
            qrCode: review.qrcode?.label || review.qrcodeId || "Unknown QR",
            qrcode_url:
              review.qrcode?.qrcode_url ||
              `${import.meta.env.VITE_SCAN_URL}/qr/${review.businessId}/${review.qrcodeId}`,
            businessName: review.business?.business_name || "Unknown Business",
            replies: review.replies || [], // Include replies if provided
          }))
        );

        setMeta({
          total: totalReviews || reviews.length,
          totalPages: response.data.meta?.totalPages || 1,
          page: response.data.meta?.page || 1,
          limit: response.data.meta?.limit || 10,
        });

        setRatingSummary(
          ratingSummary || {
            Excellent: 0,
            "Very Good": 0,
            Average: 0,
            Poor: 0,
            "Very Poor": 0,
          }
        );

        setAverageRating(averageRating ? parseFloat(averageRating).toFixed(1) : "0.0");
      } catch (err) {
        console.error("Fetch reviews error:", err.response?.data || err.message); // Debug log
        if (err.response?.status === 401) {
          toast.error("Session expired. Please log in again.", {
            position: "top-right",
            autoClose: 3000,
          });
          localStorage.removeItem("authToken");
          localStorage.removeItem("qrCodeIds");
          localStorage.removeItem("qrTypeMap");
          window.location.href = "/businessAuth";
        } else {
          setError("Failed to fetch reviews. Please try again later.");
          toast.error(err.response?.data?.message || "Failed to fetch reviews.", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [search, ratingFilter, sentimentFilter, dateFilter, page]);

  return {
    feedback,
    loading,
    error,
    page,
    meta,
    ratingSummary,
    averageRating,
    setPage,
  };
};

export default useFetchReviews;
