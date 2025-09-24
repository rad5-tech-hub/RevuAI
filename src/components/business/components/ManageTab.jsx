import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import QRCode from "qrcode";
import { QrCode, Download, Share2, Printer, Eye, Plus, X, Check, Loader2, Star, User, MessageCircle, Calendar, Award, Settings } from "lucide-react";
import { HeaderSection } from "../components/headerSection";
import { Tabs } from "../components/Tabs";
import { TypeCard } from "../components/TypeCard";
import { QRModal } from "../components/QRModal";
import BusinessHeader from "../components/headerComponents";
import LoadingState from "../components/LoadingState";
import { PreviewSection } from "../components/Preview";
import { CreateTab } from "../components/CreateTab";
import { UsageTips } from "../components/UsageTips";

// ManageTab Component with fixed qrcode_tags handling
export const ManageTab = ({ filteredQrCodes, isFetching, setActiveTab, editQR, shareQR, filterType, setFilterType }) => {
  const navigate = useNavigate();
  // Local state to manage feedback for each QR code
  const [qrCodesWithFeedback, setQrCodesWithFeedback] = useState(
    filteredQrCodes.map((code) => ({
      ...code,
      showFeedback: false,
      feedbacks: [],
      feedbackLoading: false,
      feedbackError: null,
      feedbackSummary: null,
    }))
  );

  // Sync local state when filteredQrCodes prop changes
  useEffect(() => {
    setQrCodesWithFeedback(
      filteredQrCodes.map((code) => {
        const existing = qrCodesWithFeedback.find((c) => c.id === code.id);
        return {
          ...code,
          showFeedback: existing?.showFeedback || false,
          feedbacks: existing?.feedbacks || [],
          feedbackLoading: existing?.feedbackLoading || false,
          feedbackError: existing?.feedbackError || null,
          feedbackSummary: existing?.feedbackSummary || null,
        };
      })
    );
  }, [filteredQrCodes]);

  const handleViewFeedbacks = async (code) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Please log in to view feedbacks.", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/businessAuth");
      return;
    }

    setQrCodesWithFeedback((prev) =>
      prev.map((qr) =>
        qr.id === code.id
          ? {
              ...qr,
              showFeedback: !qr.showFeedback,
              feedbackLoading: !qr.showFeedback,
              feedbackError: null,
              feedbacks: [],
              feedbackSummary: null,
            }
          : { ...qr, showFeedback: false }
      )
    );

    if (code.showFeedback) return; // If closing, no need to fetch

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/review/qrcode-reviews/${code.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { reviews, totalReviews, ratingSummary } = response.data;
      setQrCodesWithFeedback((prev) =>
        prev.map((qr) =>
          qr.id === code.id
            ? {
                ...qr,
                feedbacks: reviews || [],
                feedbackSummary: { totalReviews, ratingSummary },
                feedbackLoading: false,
                feedbackError: null,
              }
            : qr
        )
      );
    } catch (error) {
      console.error("Fetch feedbacks error:", error);
      setQrCodesWithFeedback((prev) =>
        prev.map((qr) =>
          qr.id === code.id
            ? {
                ...qr,
                feedbackLoading: false,
                feedbackError: error.response?.data?.message || "Failed to fetch feedbacks. Please try again.",
              }
            : qr
        )
      );
      toast.error(error.response?.data?.message || "Failed to fetch feedbacks.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const renderStarRating = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return "text-green-600 bg-green-50 border-green-200";
    if (rating >= 3) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
          <h2 className="font-medium text-lg sm:text-xl text-slate-800">Your QR Codes ({filteredQrCodes.length})</h2>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full sm:w-auto rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm sm:text-base text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="all">All Types</option>
            <option value="general">General Business</option>
            <option value="product">Specific Product</option>
            <option value="location">Location/Area</option>
            <option value="service">Service Type</option>
          </select>
        </div>
        <button
          onClick={() => setActiveTab("create")}
          className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-1 text-sm sm:text-base font-medium hover:bg-blue-700 transition"
          aria-label="Create New QR Code"
        >
          <Plus className="h-4 w-4" />
          Create New
        </button>
      </div>
      
      {isFetching && filteredQrCodes.length === 0 ? (
        <div className="space-y-4 sm:space-y-6" aria-busy="true" aria-label="Loading QR codes">
          {[1, 2, 3].map((i) => (
            <div
              key={`qr-skeleton-${i}`}
              className="bg-white shadow-sm sm:shadow-md rounded-lg sm:rounded-xl p-4 sm:p-6 space-y-4 border border-slate-200"
            >
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <div className="h-6 sm:h-7 w-40 sm:w-48 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-5 sm:h-6 w-16 sm:w-20 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-5 sm:h-6 w-16 sm:w-20 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
              <div className="h-4 sm:h-5 w-28 sm:w-32 bg-gray-200 rounded animate-pulse"></div>
              <div className="flex flex-wrap gap-2 sm:gap-4">
                <div className="h-8 sm:h-10 w-20 sm:w-24 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-8 sm:h-10 w-20 sm:w-24 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-8 sm:h-10 w-20 sm:w-24 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredQrCodes.length === 0 ? (
        <div className="text-center py-8 sm:py-12 text-slate-500 text-sm sm:text-base">
          No QR codes found for this type. Try creating a new one!
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {qrCodesWithFeedback.map((code) => (
            <div
              key={code.id}
              className="bg-white shadow-sm sm:shadow-md rounded-lg sm:rounded-xl p-4 sm:p-6 border border-slate-200 min-w-0"
            >
              <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-2 sm:gap-3">
                <h3 className="text-base sm:text-lg font-semibold text-slate-800 truncate">{code.title}</h3>
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-medium ${
                      code.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {code.status.charAt(0).toUpperCase() + code.status.slice(1)}
                  </span>
                  <span
                    className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {code.type.charAt(0).toUpperCase() + code.type.slice(1)}
                  </span>
                </div>
              </div>
              <div className="mt-2 text-sm sm:text-base text-slate-600 truncate">
                {code.businessName} • {code.categoryName} • {code.feedback} Feedback • Created {code.date}
              </div>
              <div className="mt-4 flex flex-wrap gap-2 sm:gap-4">
                <button
                  onClick={() => handleViewFeedbacks(code)}
                  className="inline-flex items-center gap-1 sm:gap-2 cursor-pointer rounded-lg border border-slate-300 bg-white px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm hover:bg-slate-50 transition"
                  aria-label={`View Feedbacks for ${code.title}`}
                >
                  <Eye className="h-3.5 sm:h-4 w-3.5 sm:w-4" /> View Feedbacks
                </button>
                <button
                  onClick={() => editQR && editQR(code)}
                  className="inline-flex items-center gap-1 sm:gap-2 cursor-pointer rounded-lg border border-slate-300 bg-white px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm hover:bg-slate-50 transition"
                  aria-label={`Edit QR code for ${code.title}`}
                >
                  <Settings className="h-3.5 sm:h-4 w-3.5 sm:w-4" /> Edit
                </button>
                <button
                  onClick={() => shareQR && shareQR(code.url, code.title)}
                  className="inline-flex items-center gap-1 sm:gap-2 cursor-pointer rounded-lg border border-slate-300 bg-white px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm hover:bg-slate-50 transition"
                  aria-label={`Share QR code for ${code.title}`}
                >
                  <Share2 className="h-3.5 sm:h-4 w-3.5 sm:w-4" /> Share
                </button>
              </div>
              
              {/* Enhanced Feedback Dropdown */}
              {code.showFeedback && (
                <div className="mt-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 shadow-inner overflow-hidden">
                  {code.feedbackLoading ? (
                    <div className="flex flex-col justify-center items-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-3" />
                      <p className="text-sm text-slate-600">Loading feedback...</p>
                    </div>
                  ) : code.feedbackError ? (
                    <div className="p-6 text-center">
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-600 text-sm font-medium">Error Loading Feedback</p>
                        <p className="text-red-500 text-xs mt-1">{code.feedbackError}</p>
                      </div>
                    </div>
                  ) : code.feedbacks?.length > 0 ? (
                    <div>
                      {/* Header Section */}
                      <div className="bg-white border-b border-slate-200 p-4 sm:p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <MessageCircle className="h-5 w-5 text-blue-600" />
                              <h4 className="text-lg font-semibold text-slate-800">
                                Customer Reviews ({code.feedbacks.length})
                              </h4>
                            </div>
                            
                            {/* Summary Stats */}
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4">
                              <div className="bg-blue-50 rounded-lg p-3 text-center">
                                <p className="text-2xl font-bold text-blue-600">{code.feedbackSummary?.totalReviews || 0}</p>
                                <p className="text-xs text-blue-700 font-medium">Total Reviews</p>
                              </div>
                              {code.feedbackSummary?.ratingSummary &&
                                Object.entries(code.feedbackSummary.ratingSummary).map(([label, count]) => (
                                  <div key={label} className="bg-green-50 rounded-lg p-3 text-center">
                                    <p className="text-2xl font-bold text-green-600">{count}</p>
                                    <p className="text-xs text-green-700 font-medium">{label}</p>
                                  </div>
                                ))}
                            </div>
                          </div>
                          <button
                            onClick={() => handleViewFeedbacks({ ...code, showFeedback: false })}
                            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
                            aria-label="Close feedback dropdown"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      {/* Reviews List */}
                      <div className="max-h-[500px] overflow-y-auto">
                        <div className="p-4 space-y-4">
                          {code.feedbacks.map((feedback, index) => (
                            <div
                              key={feedback.id}
                              className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow"
                            >
                              {/* Review Header */}
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="flex-shrink-0">
                                    {feedback.user && !feedback.isAnonymous ? (
                                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                                        <span className="text-white font-semibold text-sm">
                                          {feedback.user.fullname?.charAt(0)?.toUpperCase() || 'U'}
                                        </span>
                                      </div>
                                    ) : (
                                      <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                                        <User className="h-5 w-5 text-white" />
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2 mb-1">
                                      <p className="font-semibold text-slate-800">
                                        {feedback.user && !feedback.isAnonymous
                                          ? feedback.user.fullname
                                          : "Anonymous Customer"
                                        }
                                      </p>
                                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRatingColor(feedback.rating)}`}>
                                        {feedback.ratingLabel}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {renderStarRating(feedback.rating)}
                                      <span className="text-sm text-slate-600">
                                        ({feedback.rating}/5)
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(feedback.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </div>
                              </div>
                              {/* Review Content */}
                              <div className="mb-3">
                                <p className="text-slate-700 leading-relaxed">{feedback.comment}</p>
                              </div>
                              {/* QR Code Tags */}
                              {Array.isArray(feedback.qrcode_tags) && feedback.qrcode_tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-3">
                                  {feedback.qrcode_tags.map((tag, tagIndex) => (
                                    <span
                                      key={tagIndex}
                                      className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium"
                                    >
                                      #{tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                              {/* Business Responses */}
                              {feedback.responses?.length > 0 && (
                                <div className="mt-4 border-t border-slate-100 pt-3">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Award className="h-4 w-4 text-blue-600" />
                                    <p className="font-medium text-sm text-slate-700">Business Response:</p>
                                  </div>
                                  {feedback.responses.map((response) => (
                                    <div key={response.id} className="bg-blue-50 rounded-lg p-3 ml-6">
                                      <p className="text-sm text-slate-700 mb-1">{response.response}</p>
                                      <p className="text-xs text-slate-500">
                                        Responded on {new Date(response.createdAt).toLocaleDateString('en-US', {
                                          year: 'numeric',
                                          month: 'short',
                                          day: 'numeric'
                                        })}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <MessageCircle className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500 font-medium mb-1">No reviews yet</p>
                      <p className="text-sm text-slate-400">
                        Customer feedback will appear here once they start leaving reviews
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
