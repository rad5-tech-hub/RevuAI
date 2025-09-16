import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const useFetchReviews = ({ search, ratingFilter, sentimentFilter, dateFilter, retryTrigger }) => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1, currentPage: 1 });
  const [ratingSummary, setRatingSummary] = useState({});
  const [averageRating, setAverageRating] = useState(0);
  const [page, setPage] = useState(1);
  const sort = "newest";
  const cancelTokenSource = useRef(null);
  const businessId = localStorage.getItem("authBusinessId");

  // Fallback function to calculate average rating from reviews
  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return "0.00";
    const totalRating = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
    const average = totalRating / reviews.length;
    return average.toFixed(2); // Format to two decimal places
  };

  useEffect(() => {
    let isMounted = true;
    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("authToken");
      if (!token || !businessId) {
        if (isMounted) {
          setError("Please log in to view reviews.");
          toast.error("Please log in to view reviews.", {
            position: "top-right",
            autoClose: 3000,
          });
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
        search: search || undefined,
        sentiment: sentimentFilter || undefined,
        date: dateFilter || undefined,
        page,
        sort,
      };
      try {
        console.log("Fetching reviews with:", { businessId, params, token: token.slice(0, 10) + "..." });
        const reviewsResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/review/reviews/${businessId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            params,
            cancelToken: cancelTokenSource.current.token,
          }
        );
        if (isMounted) {
          console.log("Raw reviews response:", reviewsResponse.data);
          const reviews = reviewsResponse.data.reviews || [];
          console.log("Reviews count:", reviews.length, "Total reviews:", reviewsResponse.data.totalReviews);
          const total = reviewsResponse.data.totalReviews || reviews.length;
          const totalPages = Math.ceil(total / 10) || 1; // Assuming 10 reviews per page
          const ratingSummary = reviewsResponse.data.ratingSummary || {};
          const averageRating = reviewsResponse.data.averageRating || calculateAverageRating(reviews);
          const reviewsWithUrls = reviews.map((review) => {
            const mappedReview = {
              ...review,
              qrcode_url: review.qrcode?.id || "Unknown QR Code",
              reviewerName: review.isAnonymous || !review.user?.fullname ? "Anonymous" : review.user.fullname,
            };
            console.log("Mapped review:", {
              id: review.id,
              reviewerName: mappedReview.reviewerName,
              qrcode_url: mappedReview.qrcode_url,
              user: review.user,
              qrcodeId: review.qrcode?.id,
            });
            return mappedReview;
          });
          setFeedback(reviewsWithUrls);
          setMeta({ total, totalPages, currentPage: page });
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
        if (isMounted) {
          setError(error.response?.data?.message || "Failed to fetch feedback. Please try again.");
          toast.error(error.response?.data?.message || "Failed to fetch feedback.", {
            position: "top-right",
            autoClose: 3000,
          });
          setAverageRating("0.00"); // Fallback to 0.00 on API failure
          setFeedback([]);
          setMeta({ total: 0, totalPages: 1, currentPage: 1 });
          setRatingSummary({});
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
  }, [ratingFilter, search, sentimentFilter, dateFilter, retryTrigger, page, businessId]);

  return { feedback, loading, error, meta, ratingSummary, averageRating, page, setPage };
};

export default useFetchReviews;