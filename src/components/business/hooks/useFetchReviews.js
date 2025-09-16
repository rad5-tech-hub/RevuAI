import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const useFetchReviews = ({ search, ratingFilter, sentimentFilter, dateFilter, retryTrigger }) => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1, currentPage: 1 });
  const [ratingSummary, setRatingSummary] = useState({});
  const [averageRating, setAverageRating] = useState(0);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const sort = "newest";
  const cancelTokenSource = useRef(null);

  useEffect(() => {
    let isMounted = true;
    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("authToken");
      const businessId = localStorage.getItem("authBusinessId");
      if (!token || !businessId) {
        if (isMounted) {
          setError("Please log in to view reviews.");
          toast.error("Please log in to view reviews.", {
            position: "top-right",
            autoClose: 3000,
          });
          navigate("/businessAuth");
        }
        setLoading(false);
        return;
      }
      if (cancelTokenSource.current) {
        cancelTokenSource.current.cancel("Operation canceled due to new request.");
      }
      cancelTokenSource.current = axios.CancelToken.source();
      const ratingMap = {
        "All Ratings": null,
        "5 Stars": 5,
        "4 Stars": 4,
        "3 Stars": 3,
        "2 Stars": 2,
        "1 Star": 1,
      };
      const params = {
        rating: ratingMap[ratingFilter] || undefined,
        page,
        sort,
      };
      try {
        console.log("Fetching reviews with:", { businessId, params, token: token.slice(0, 10) + "..." });
        console.log("Applied filters:", { rating: ratingMap[ratingFilter], page });
        const reviewsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/review/filter`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          params,
          cancelToken: cancelTokenSource.current.token,
        });
        if (isMounted) {
          console.log("Raw reviews response:", reviewsResponse.data);
          const reviews = reviewsResponse.data.reviews || [];
          console.log("Reviews count:", reviews.length, "Total reviews:", reviewsResponse.data.meta.total);
          const total = reviewsResponse.data.meta.total || reviews.length;
          const totalPages = reviewsResponse.data.meta.totalPages || 1;
          const ratingSummary = reviewsResponse.data.ratingSummary || {};
          const averageRating = reviewsResponse.data.averageRating || "0.00";
          const reviewsWithUrls = reviews.map((review) => {
            const mappedReview = {
              ...review,
              qrcode_url: review.qrcodeId || "Unknown QR Code",
              reviewerName: review.isAnonymous || !review.user?.fullname ? "Anonymous" : review.user.fullname,
            };
            console.log("Mapped review:", {
              id: review.id,
              reviewerName: mappedReview.reviewerName,
              qrcode_url: mappedReview.qrcode_url,
              user: review.user,
              qrcodeId: review.qrcodeId,
            });
            return mappedReview;
          });
          setFeedback(reviewsWithUrls);
          setMeta({ total, totalPages, currentPage: reviewsResponse.data.meta.page || page });
          setRatingSummary(ratingSummary);
          setAverageRating(averageRating);
          setLoading(false);
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Request canceled:", error.message);
          return;
        }
        console.error("Fetch reviews error:", {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
          params: error.config?.params,
          status: error.response?.status,
          responseData: error.response?.data,
          message: error.message,
        });
        if (error.response?.status === 401) {
          if (isMounted) {
            setError("Session expired. Please log in again.");
            toast.error("Session expired. Please log in again.", {
              position: "top-right",
              autoClose: 3000,
            });
            navigate("/businessAuth");
          }
        } else {
          setError(error.response?.data?.message || "Failed to fetch feedback.");
          toast.error(error.response?.data?.message || "Failed to fetch feedback.", {
            position: "top-right",
            autoClose: 3000,
          });
        }
        setLoading(false);
      }
    };
    fetchReviews();
    return () => {
      isMounted = false;
      if (cancelTokenSource.current) {
        cancelTokenSource.current.cancel("Component unmounted.");
      }
    };
  }, [ratingFilter, retryTrigger, page, navigate]);

  return { feedback, loading, error, meta, ratingSummary, averageRating, page, setPage };
};

export default useFetchReviews;