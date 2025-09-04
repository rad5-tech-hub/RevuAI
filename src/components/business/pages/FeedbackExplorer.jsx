
import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import useFetchReviews from "../hooks/useFetchReviews";
import FeedbackCard from "../components/FeedbackCard";
import FilterDropdown from "../components/FilterDropdown";
import { generatePDF } from "./../../../utils/pdfUtils";
import { QrCode, Download, Share2, MessageSquare, LogOut, Loader2 } from "lucide-react";
import debounce from "lodash/debounce";

const FeedbackExplorer = () => {
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("All Ratings");
  const [sentimentFilter, setSentimentFilter] = useState("All Sentiments");
  const [dateFilter, setDateFilter] = useState("All Time");
  const navigate = useNavigate();
  const {
    feedback: rawFeedback,
    loading,
    error,
    page,
    meta,
    ratingSummary,
    averageRating,
    setPage,
  } = useFetchReviews({ search, ratingFilter, sentimentFilter, dateFilter });

  // Debounced search handler
  const debouncedSetSearch = useCallback(
    debounce((value) => {
      console.log("Search value updated:", value); // Debug log
      setSearch(value);
    }, 300),
    []
  );

  const handleSearchChange = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling
    console.log("Search input change:", e.target.value); // Debug log
    debouncedSetSearch(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent Enter key reload
      e.stopPropagation();
      console.log("Enter key pressed, prevented default"); // Debug log
    }
  };

  // Client-side filtering for sentiment and date
  const feedback = rawFeedback.filter((fb) => {
    let matchesSentiment = true;
    let matchesDate = true;

    if (sentimentFilter !== "All Sentiments") {
      matchesSentiment = fb.sentiment === sentimentFilter;
    }

    if (dateFilter !== "All Time") {
      const feedbackDate = new Date(fb.date);
      const today = new Date();
      if (dateFilter === "Today") {
        matchesDate = feedbackDate.toDateString() === today.toDateString();
      } else if (dateFilter === "This Week") {
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        matchesDate = feedbackDate >= weekStart;
      } else if (dateFilter === "This Month") {
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        matchesDate = feedbackDate >= monthStart;
      } else if (dateFilter === "This Quarter") {
        const quarterStart = new Date(today);
        quarterStart.setMonth(Math.floor(today.getMonth() / 3) * 3, 1);
        matchesDate = feedbackDate >= quarterStart;
      }
    }

    return matchesSentiment && matchesDate;
  });

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
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Loader2 size={18} />
            <span>Retry</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <ToastContainer />
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-4 mb-4 lg:mb-0">
              <Link to="/businessDashboard" className="flex items-center space-x-2">
                <div className="w-10 h-10 text-white bg-blue-600 rounded-full flex items-center justify-center">
                  <QrCode className="w-6 h-6" />
                </div>
                <span className="text-xl font-bold text-slate-900">RevuAi</span>
              </Link>
              <span className="text-slate-500">Business Portal</span>
            </div>
            <nav className="flex flex-wrap gap-2 lg:gap-8 mb-4 lg:mb-0 items-center">
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
            </nav>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-bold text-slate-900">Feedback Explorer</h1>
        <p className="mt-1 text-sm text-slate-500">View and manage customer feedback</p>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { label: "Total", value: meta.total.toString() },
            {
              label: "Positive",
              value: (ratingSummary["Excellent"] || 0) + (ratingSummary["Very Good"] || 0),
            },
            { label: "Neutral", value: ratingSummary["Average"] || 0 },
            {
              label: "Negative",
              value: (ratingSummary["Poor"] || 0) + (ratingSummary["Very Poor"] || 0),
            },
            { label: "Average Rating", value: averageRating },
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
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            onSubmit={(e) => e.preventDefault()} // Extra safety
          />
          <FilterDropdown
            value={ratingFilter}
            onChange={setRatingFilter}
            options={["All Ratings", "5 Stars", "4 Stars", "3 Stars", "2 Stars", "1 Star"]}
          />
          <FilterDropdown
            value={sentimentFilter}
            onChange={setSentimentFilter}
            options={["All Sentiments", "Positive", "Neutral", "Negative"]}
          />
          <FilterDropdown
            value={dateFilter}
            onChange={setDateFilter}
            options={["All Time", "Today", "This Week", "This Month", "This Quarter"]}
          />
        </div>
        <div className="mt-6 space-y-4 pb-10">
          {feedback.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-gray-400" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">No feedback yet</h4>
              <p className="text-gray-500 text-sm max-w-xs">
                When customers start sharing their thoughts, their feedback will appear here.
              </p>
              <Link
                to="/businessQrpage"
                className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                aria-label="Share QR codes"
              >
                <QrCode className="w-4 h-4" />
                Share your QR codes to get started
              </Link>
            </div>
          ) : (
            feedback.map((fb) => (
              <FeedbackCard
                key={fb.id}
                feedback={fb}
                onDownloadPNG={() => downloadPNG(fb.qrcode_url, `qr_${fb.qrCode}.png`)}
                onDownloadSVG={() => downloadSVG(fb.qrcode_url, `qr_${fb.qrCode}.png`)}
                onDownloadPDF={() => downloadPDF(fb)}
                onShare={() => shareFeedback(fb)}
              />
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
      </main>
    </div>
  );
};

export default FeedbackExplorer;
