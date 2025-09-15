import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("No refresh token available");
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/refresh-token`, {
      refreshToken,
    });
    const newToken = response.data.accessToken;
    localStorage.setItem("authToken", newToken);
    return newToken;
  } catch (error) {
    console.error("Token refresh failed:", error);
    localStorage.removeItem("authToken");
    localStorage.removeItem("authBusinessId");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("qrCodeIds");
    localStorage.removeItem("qrTypeMap");
    return null;
  }
};

const useFetchReviews = ({ search, ratingFilter, sentimentFilter, dateFilter, retryTrigger }) => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1, currentPage: 1 });
  const [ratingSummary, setRatingSummary] = useState({});
  const [averageRating, setAverageRating] = useState(0);
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
        page,
        sort,
        businessId,
        search: search || undefined,
        rating: ratingMap[ratingFilter] || undefined,
        label: "Bar",
        type: "Service",
        productOrServiceId: "H001",
        qrcode_tags: JSON.stringify(["hospitality", "5-star", "city-center"]),
        description: "QR code for hotel guest feedback",
        categoryId: "2f0068c2-c600-4c1f-8ffa-f8a953d641c7",
      };
      try {
        console.log("Fetching reviews with:", { businessId, params, token: token.slice(0, 10) + "..." });
        const reviewsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/review/filter`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          params,
          cancelToken: cancelTokenSource.current.token,
        });
        console.log("Fetching QR codes for business:", businessId);
        const qrResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/business/business-qrcode/${businessId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            cancelToken: cancelTokenSource.current.token,
          }
        );
        if (isMounted) {
          console.log("Reviews response:", reviewsResponse.data);
          console.log("QR codes response:", qrResponse.data);
          const reviews = (reviewsResponse.data.reviews || []).filter(
            (review) => review.businessId === businessId
          );
          const total = reviews.length;
          const ratingSummary = reviews.reduce((acc, review) => {
            acc[review.ratingLabel] = (acc[review.ratingLabel] || 0) + 1;
            return acc;
          }, {});
          const averageRating = reviews.length
            ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(2)
            : "0.00";
          const totalPages = 1; // No pagination, all reviews fetched
          const qrCodeMap = new Map(
            (qrResponse.data.business.qrcodes || []).map((qr) => [qr.id, qr.qrcode_url])
          );
          const reviewsWithUrls = reviews.map((review) => ({
            ...review,
            qrcode_url: qrCodeMap.get(review.qrcodeId) || null,
          }));
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
        if (error.response?.status === 401) {
          const newToken = await refreshToken();
          if (newToken && isMounted) {
            localStorage.setItem("authToken", newToken);
            fetchReviews();
            return;
          } else {
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
  }, [search, ratingFilter, sentimentFilter, dateFilter, page, navigate, retryTrigger]);

  return { feedback, loading, error, page, meta, ratingSummary, averageRating, setPage };
};

export default useFetchReviews;