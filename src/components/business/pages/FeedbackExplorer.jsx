import { useState, useCallback, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import useFetchReviews from "../hooks/useFetchReviews";
import FeedbackCard from "../components/FeedbackCard";
import FilterDropdown from "../components/FilterDropdown";
import { generatePDF } from "./../../../utils/pdfUtils";
import { MessageSquare, X } from "lucide-react";
import debounce from "lodash/debounce";
import BusinessHeader from "../components/headerComponents";
import { FeedbackCardSkeleton, StatsCardSkeleton, FullPageSkeleton } from "../components/SkeletonLoaders";

const FeedbackExplorer = () => {
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("All Ratings");
  const [sentimentFilter, setSentimentFilter] = useState("All Sentiments");
  const [dateFilter, setDateFilter] = useState("All Time");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState(null);
  const navigate = useNavigate();
  const modalRef = useRef(null);
  const { feedback, loading, error, page, meta, ratingSummary, averageRating, setPage } = useFetchReviews({
    search,
    ratingFilter,
    sentimentFilter,
    dateFilter,
  });

  const debouncedSetSearch = useCallback(
    debounce((value) => {
      setSearch(value);
    }, 300),
    []
  );

  const handleSearchChange = (e) => {
    e.preventDefault();
    e.stopPropagation();
    debouncedSetSearch(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("authBusinessId");
      localStorage.removeItem("qrCodeIds");
      localStorage.removeItem("qrTypeMap");
      navigate("/businessAuth");
      return;
    }
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/logout/logout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.removeItem("authToken");
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
      localStorage.removeItem("authToken");
      localStorage.removeItem("authBusinessId");
      localStorage.removeItem("qrCodeIds");
      localStorage.removeItem("qrTypeMap");
      navigate("/businessAuth");
    }
  };

  const downloadFeedbackCSV = (feedback) => {
    if (!feedback) {
      toast.error("No feedback data available to download.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    const tags = Array.isArray(feedback.qrcode_tags) ? feedback.qrcode_tags.join(";") : "";
    const csvContent = [
      ["ID", "Rating", "Rating Label", "Comment", "Reviewer", "Date", "QR Code", "Tags"],
      [
        feedback.id || "",
        feedback.rating || "",
        feedback.ratingLabel || "",
        `"${(feedback.comment || "").replace(/"/g, '""')}"`,
        feedback.reviewerName || "Anonymous",
        feedback.createdAt || "",
        feedback.qrcode_url || "",
        tags,
      ],
    ]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `feedback_${feedback.id}.csv`;
    link.click();
    toast.success("Feedback downloaded as CSV!", {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const downloadPDF = (feedback) => {
    try {
      generatePDF(feedback, `feedback_${feedback.id}.pdf`);
      toast.success("Feedback PDF downloaded!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Failed to generate PDF.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const shareFeedback = async (feedback) => {
    const shareData = {
      title: `Feedback for ${feedback.qrcode_url || "Business"}`,
      text: `Rating: ${feedback.rating} Stars\nComment: ${feedback.comment || "No comment"}`,
      url: feedback.qrcode_url || "Business Feedback",
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success("Feedback shared successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      } catch (error) {
        setCurrentFeedback(feedback);
        setIsShareModalOpen(true);
      }
    } else {
      setCurrentFeedback(feedback);
      setIsShareModalOpen(true);
    }
  };

  const handleShareOption = async (option, feedback) => {
    const shareData = {
      title: `Feedback for ${feedback.qrcode_url || "Business"}`,
      text: `Rating: ${feedback.rating} Stars\nComment: ${feedback.comment || "No comment"}`,
      url: feedback.qrcode_url || "Business Feedback",
    };
    try {
      switch (option) {
        case "email":
          const mailtoLink = `mailto:?subject=${encodeURIComponent(shareData.title)}&body=${encodeURIComponent(
            `${shareData.text}\nQR Code: ${shareData.url}`
          )}`;
          window.location.href = mailtoLink;
          toast.success("Opening email client to share feedback!", {
            position: "top-right",
            autoClose: 3000,
          });
          break;
        case "twitter":
          const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            `${shareData.text}\nQR Code: ${shareData.url}`
          )}`;
          window.open(twitterUrl, "_blank");
          toast.success("Opening Twitter to share feedback!", {
            position: "top-right",
            autoClose: 3000,
          });
          break;
        case "linkedin":
          const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            shareData.url
          )}&title=${encodeURIComponent(shareData.title)}&summary=${encodeURIComponent(shareData.text)}`;
          window.open(linkedinUrl, "_blank");
          toast.success("Opening LinkedIn to share feedback!", {
            position: "top-right",
            autoClose: 3000,
          });
          break;
        case "whatsapp":
          const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
            `${shareData.text}\nQR Code: ${shareData.url}`
          )}`;
          window.open(whatsappUrl, "_blank");
          toast.success("Opening WhatsApp to share feedback!", {
            position: "top-right",
            autoClose: 3000,
          });
          break;
        case "copy":
          await navigator.clipboard.writeText(shareData.url);
          toast.success("QR code URL copied to clipboard!", {
            position: "top-right",
            autoClose: 3000,
          });
          break;
        default:
          throw new Error("Unknown share option");
      }
    } catch (error) {
      console.error("Share error:", error);
      toast.error(`Failed to share via ${option}.`, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    setIsShareModalOpen(false);
  };

  // Apply client-side filtering for search, sentiment, and date
  const filteredFeedback = feedback.filter((fb) => {
    let matchesSearch = true;
    let matchesSentiment = true;
    let matchesDate = true;
    if (search) {
      matchesSearch = fb.comment?.toLowerCase().includes(search.toLowerCase());
    }
    if (sentimentFilter !== "All Sentiments") {
      const sentimentMap = {
        Positive: ["Excellent", "Very Good"],
        Neutral: ["Good"],
        Negative: ["Poor", "Very Poor"],
      };
      matchesSentiment = sentimentMap[sentimentFilter]?.includes(fb.ratingLabel) || false;
    }
    if (dateFilter !== "All Time") {
      const feedbackDate = new Date(fb.createdAt);
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
    return matchesSearch && matchesSentiment && matchesDate;
  });

  // Treat "No reviews found for this business" as a non-error state
  const isNoReviews = error === "No reviews found for this business";
  const showError = error && !isNoReviews;

  // Show full page skeleton only during initial load and no data
  if (loading && feedback.length === 0 && !isNoReviews) {
    return <FullPageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <ToastContainer />
      <BusinessHeader onLogout={handleLogout} isLoggingOut={loading} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-bold text-slate-900">Feedback Explorer</h1>
        <p className="mt-1 text-sm text-slate-500">View and manage customer feedback</p>
        {showError ? (
          <>
            <div className="mt-6 text-center">
              <p className="text-red-600 text-sm mb-4">{error}</p>
            </div>
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {Array(5).fill().map((_, index) => (
                <StatsCardSkeleton key={index} />
              ))}
            </div>
            <div className="mt-6 space-y-4 pb-10">
              {Array(3).fill().map((_, index) => (
                <FeedbackCardSkeleton key={index} />
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {loading && feedback.length === 0 ? (
                Array(5).fill().map((_, index) => (
                  <StatsCardSkeleton key={index} />
                ))
              ) : (
                [
                  { label: "Total", value: meta.total?.toString() || "0" },
                  {
                    label: "Positive",
                    value: ((ratingSummary["Excellent"] || 0) + (ratingSummary["Very Good"] || 0)).toString() || "0",
                  },
                  { label: "Neutral", value: (ratingSummary["Good"] || 0).toString() || "0" },
                  {
                    label: "Negative",
                    value: ((ratingSummary["Poor"] || 0) + (ratingSummary["Very Poor"] || 0)).toString() || "0",
                  },
                  { label: "Average Rating", value: averageRating || "0.0" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 text-center"
                  >
                    <div className="text-xl font-bold text-slate-800">{stat.value}</div>
                    <div className="text-sm text-slate-500">{stat.label}</div>
                  </div>
                ))
              )}
            </div>
            <div className="mt-6 flex flex-wrap gap-4 items-center">
              <input
                type="text"
                placeholder="Search feedback..."
                className="flex-1 min-w-[200px] rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                value={search}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                onSubmit={(e) => e.preventDefault()}
              />
              {/* <FilterDropdown
                value={ratingFilter}
                onChange={setRatingFilter}
                options={["All Ratings", "5 Stars", "4 Stars", "3 Stars", "2 Stars", "1 Star"]}
              /> */}
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
              {filteredFeedback.length === 0 || isNoReviews ? (
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
                    <MessageSquare className="w-4 h-4" />
                    Share your QR codes to get started
                  </Link>
                </div>
              ) : (
                filteredFeedback.map((fb) => (
                  <FeedbackCard
                    key={fb.id}
                    feedback={{
                      ...fb,
                      text: fb.comment,
                      qrCode: fb.qrcode_url,
                      reviewer: fb.reviewerName,
                    }}
                    onDownloadCSV={() => downloadFeedbackCSV(fb)}
                    onDownloadPDF={() => downloadPDF(fb)}
                    onShare={() => shareFeedback(fb)}
                  />
                ))
              )}
            </div>
            {meta.totalPages > 1 && !loading && (
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
          </>
        )}
      </main>
      {isShareModalOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
          role="dialog"
          aria-labelledby="shareModalTitle"
          ref={modalRef}
          tabIndex={-1}
        >
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 id="shareModalTitle" className="text-lg font-medium text-gray-900">Share Feedback</h2>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
                aria-label="Close share modal"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">Choose how to share the feedback:</p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleShareOption("email", currentFeedback)}
                className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-sm"
              >
                Email
              </button>
              <button
                onClick={() => handleShareOption("twitter", currentFeedback)}
                className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-sm"
              >
                Twitter
              </button>
              <button
                onClick={() => handleShareOption("linkedin", currentFeedback)}
                className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-sm"
              >
                LinkedIn
              </button>
              <button
                onClick={() => handleShareOption("whatsapp", currentFeedback)}
                className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-sm"
              >
                WhatsApp
              </button>
              <button
                onClick={() => handleShareOption("copy", currentFeedback)}
                className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-sm col-span-2"
              >
                Copy QR Code URL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackExplorer;