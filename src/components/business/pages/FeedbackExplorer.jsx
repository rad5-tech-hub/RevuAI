import { useState, useEffect } from "react";
import {
  Eye,
  QrCode,
  Download,
  Share2,
  MessageCircle,
  Star,
  RefreshCw,
  LogOut,
  Loader2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { generatePDF } from "./../../../utils/pdfUtils";

const sentimentColors = {
  Positive: "bg-green-100 text-green-700",
  Neutral: "bg-yellow-100 text-yellow-700",
  Negative: "bg-red-100 text-red-700",
};

const FeedbackExplorer = () => {
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("All Ratings");
  const [sentimentFilter, setSentimentFilter] = useState("All Sentiments");
  const [dateFilter, setDateFilter] = useState("All Time");
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1, limit: 10 });
  const [ratingSummary, setRatingSummary] = useState({});
  const [averageRating, setAverageRating] = useState("0.00");
  const navigate = useNavigate();

  const getSentiment = (rating) => {
    if (rating >= 4) return "Positive";
    if (rating === 3) return "Neutral";
    return "Negative";
  };

  const fetchReviews = async (params = {}) => {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("authToken");
    try {
      const query = new URLSearchParams();
      if (params.search) query.append("search", params.search);
      if (params.rating && params.rating !== "All Ratings") {
        query.append("rating", parseInt(params.rating));
      }
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/review/filter?${query.toString()}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          data: {
            label: "",
            type: "",
            productOrServiceId: "",
            qrcode_tags: [],
            description: "",
            categoryId: "",
          },
        }
      );
      const { reviews, meta, ratingSummary, averageRating } = response.data;
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
          sentiment: getSentiment(review.rating),
          text: review.comment,
          aspects: review.qrcode_tags,
          qrCode: review.qrcode.label || review.qrcode.id,
          qrcode_url: review.qrcode.qrcode_url || "",
          businessName: review.business.business_name,
        }))
      );
      setMeta(meta || { total: reviews.length, totalPages: 1, page: 1, limit: 10 });
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
        navigate("/businessAuth");
      } else {
        setError(err.response?.data?.message || "Failed to fetch reviews. Please try again later.");
        toast.error(err.response?.data?.message || "Failed to fetch reviews.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Please log in to view feedback.", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/businessAuth");
      return;
    }
    fetchReviews({ search, rating: ratingFilter });
  }, [navigate, search, ratingFilter, page]);

  const handleLogout = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      localStorage.removeItem("qrCodeIds");
      localStorage.removeItem("qrTypeMap");
      navigate("/businessAuth");
      return;
    }
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/logout/logout`,
        { refreshToken: token },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.removeItem("authToken");
      localStorage.removeItem("qrCodeIds");
      localStorage.removeItem("qrTypeMap");
      toast.success("Logged out successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/businessAuth");
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error("Logout failed. Redirecting to login.", {
        position: "top-right",
        autoClose: 3000,
      });
      localStorage.removeItem("authToken");
      localStorage.removeItem("qrCodeIds");
      localStorage.removeItem("qrTypeMap");
      navigate("/businessAuth");
    }
  };

  const downloadPNG = (url, filename) => {
    if (!url) {
      toast.error("No QR code available to download.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
  };

  const downloadSVG = (url, filename) => {
    if (!url) {
      toast.error("No QR code available to download.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    const svgUrl = url.replace(".png", ".svg");
    const link = document.createElement("a");
    link.href = svgUrl;
    link.download = filename.replace(".png", ".svg");
    link.click();
  };

  const downloadPDF = (feedback) => {
    try {
      generatePDF(feedback, `feedback_${feedback.id}.pdf`);
      toast.success("Feedback PDF downloaded!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error("Failed to generate PDF.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const shareFeedback = async (feedback) => {
    const shareData = {
      title: `Feedback for ${feedback.qrCode}`,
      text: `Rating: ${feedback.rating} Stars\nComment: ${feedback.text}`,
      url: feedback.qrcode_url || window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success("Feedback shared successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      } catch (error) {
        try {
          await navigator.clipboard.writeText(shareData.text);
          toast.success("Share not supported. Feedback text copied to clipboard!", {
            position: "top-right",
            autoClose: 3000,
          });
        } catch (copyError) {
          toast.error("Failed to share or copy feedback.", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.text);
        toast.success("Share not supported. Feedback text copied to clipboard!", {
          position: "top-right",
          autoClose: 3000,
        });
      } catch (error) {
        toast.error("Failed to copy feedback.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };

  const handleRetry = () => {
    fetchReviews({ search, rating: ratingFilter });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600 text-lg">Loading feedback data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
            <p className="text-lg font-medium">{error}</p>
          </div>
          <button
            onClick={handleRetry}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw size={18} />
            <span>Retry</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <ToastContainer />
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-4">
            <div className="flex items-center space-x-4 mb-4 lg:mb-0">
              <Link to="/businessDashboard" className="flex items-center space-x-2">
                <div className="w-10 h-10 text-white bg-blue-600 rounded-full flex items-center justify-center">
                  <QrCode className="w-6 h-6" />
                </div>
                <span className="text-xl font-bold text-slate-900">RevuAi</span>
              </Link>
              <span className="text-slate-500">Business Portal</span>
            </div>
            <div className="flex flex-wrap gap-2 lg:gap-8 mb-4 lg:mb-0 items-center">
              <Link
                to="/businessDashboard"
                className="px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
              >
                📊 Dashboard
              </Link>
              <Link
                to="/businessFeedback"
                className="px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
                aria-current="page"
              >
                💬 Feedback
              </Link>
              <Link
                to="/businessQrpage"
                className="px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
              >
                📱 QR Codes
              </Link>
              <Link
                to="/businessReports"
                className="px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
              >
                📈 Reports
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors flex items-center gap-1"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-bold text-slate-900">Feedback Explorer</h1>
        <p className="mt-1 text-sm text-slate-500">View and manage customer feedback</p>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-6 gap-4">
          {[
            { label: "Total", value: meta.total.toString() },
            { label: "Positive", value: ratingSummary["Excellent"] + ratingSummary["Very Good"] || 0 },
            { label: "Neutral", value: ratingSummary["Average"] || 0 },
            { label: "Negative", value: ratingSummary["Poor"] + ratingSummary["Very Poor"] || 0 },
            { label: "Average Rating", value: averageRating },
            { label: "With Media", value: feedback.filter((f) => f.hasMedia).length.toString() },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 text-center"
            >
              <div className="text-xl font-bold text-slate-800">{stat.value}</div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-4 items-center">
          <input
            type="text"
            placeholder="Search feedback..."
            className="flex-1 min-w-[200px] rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-200 pr-8 appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='%236B7280' height='20' viewBox='0 0 24 24' width='20' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 0.5rem center",
              backgroundSize: "1.2rem",
            }}
          >
            <option>All Ratings</option>
            <option>5 Stars</option>
            <option>4 Stars</option>
            <option>3 Stars</option>
            <option>2 Stars</option>
            <option>1 Star</option>
          </select>
          <select
            value={sentimentFilter}
            onChange={(e) => setSentimentFilter(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-200 pr-8 appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='%236B7280' height='20' viewBox='0 0 24 24' width='20' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 0.5rem center",
              backgroundSize: "1.2rem",
            }}
          >
            <option>All Sentiments</option>
            <option>Positive</option>
            <option>Neutral</option>
            <option>Negative</option>
          </select>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-200 pr-8 appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='%236B7280' height='20' viewBox='0 0 24 24' width='20' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 0.5rem center",
              backgroundSize: "1.2rem",
            }}
          >
            <option>All Time</option>
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
            <option>This Quarter</option>
          </select>
        </div>
        <div className="mt-6 space-y-4 pb-10">
          {feedback.length === 0 ? (
            <div className="text-center text-slate-600">No feedback found. Try adjusting your filters.</div>
          ) : (
            feedback.map((fb) => (
              <div
                key={fb.id}
                className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 shadow-sm"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < fb.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-300"}
                        />
                      ))}
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${sentimentColors[fb.sentiment]}`}>
                        {fb.sentiment}
                      </span>
                    </div>
                    <div className="text-sm text-slate-500">{fb.date}</div>
                  </div>
                  <p className="mt-2 text-slate-700">{fb.text}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {fb.aspects.map((tag) => (
                      <span key={tag} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                    <QrCode size={16} /> {fb.qrCode} ({fb.businessName})
                  </div>
                </div>
                <div className="flex gap-2 self-end sm:self-start">
                  <button
                    onClick={() => toast.info("View feedback details coming soon!", { position: "top-right", autoClose: 3000 })}
                    className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                    aria-label="View Feedback"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => toast.info("Reply to feedback coming soon!", { position: "top-right", autoClose: 3000 })}
                    className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"
                    aria-label="Reply to Feedback"
                  >
                    <MessageCircle size={18} />
                  </button>
                  <div className="relative group">
                    <button
                      className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100"
                      aria-label="Download Feedback"
                    >
                      <Download size={18} />
                    </button>
                    <div className="absolute hidden group-hover:block bg-white border border-slate-200 rounded-lg shadow-lg z-10">
                      <button
                        onClick={() => downloadPNG(fb.qrcode_url, `qr_${fb.qrCode}.png`)}
                        className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        PNG
                      </button>
                      <button
                        onClick={() => downloadSVG(fb.qrcode_url, `qr_${fb.qrCode}.png`)}
                        className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        SVG
                      </button>
                      <button
                        onClick={() => downloadPDF(fb)}
                        className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        PDF
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => shareFeedback(fb)}
                    className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100"
                    aria-label="Share Feedback"
                  >
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        {meta.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-slate-300"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-slate-700">
              Page {page} of {meta.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              disabled={page === meta.totalPages}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-slate-300"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackExplorer;