
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const useFetchReviews = ({ search, ratingFilter }) => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1, limit: 10 });
  const [ratingSummary, setRatingSummary] = useState({});
  const [averageRating, setAverageRating] = useState("0.00");

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
        const endpoint = query.toString()
          ? `${import.meta.env.VITE_API_URL}/api/v1/review/filter?${query.toString()}`
          : `${import.meta.env.VITE_API_URL}/api/v1/review/all-reviews`;

        const response = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });

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
            rating: review.rating,
            ratingLabel: review.ratingLabel,
            sentiment: getSentiment(review.rating),
            text: review.comment || "No comment provided",
            aspects: Array.isArray(review.qrcode_tags) ? review.qrcode_tags : [], // Ensure aspects is always an array
            qrCode: review.qrcode.label || review.qrcode.id,
            qrcode_url: review.qrcode.qrcode_url || `${import.meta.env.VITE_SCAN_URL}/qr/${review.businessId}/${review.qrcodeId}`,
            businessName: review.business.business_name,
            hasMedia: review.hasMedia || false,
          }))
        );
        setMeta({
          total: totalReviews || reviews.length,
          totalPages: response.data.meta?.totalPages || 1,
          page: response.data.meta?.page || 1,
          limit: response.data.meta?.limit || 10,
        });
        setRatingSummary(ratingSummary || {});
        setAverageRating(averageRating || "0.00");
      } catch (err) {
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
          toast.error("Failed to fetch reviews.", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [search, ratingFilter, page]);

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
