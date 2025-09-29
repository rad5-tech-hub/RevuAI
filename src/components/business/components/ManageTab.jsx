import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import QRCode from "qrcode";
import { MessageCircle, Star, User, Calendar, Award, Settings, QrCode, X, Share2, Download, Printer, Plus, Loader2, Check, Copy } from "lucide-react";

export const ManageTab = ({ filteredQrCodes, isFetching, setActiveTab, editQR, shareQR, filterType, setFilterType, viewQR }) => {
  const navigate = useNavigate();
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
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [currentQrCode, setCurrentQrCode] = useState(null);
  const [copied, setCopied] = useState(false);
  const qrModalCanvasRef = useRef(null);
  const modalRef = useRef(null);

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

  useEffect(() => {
    if (isQrModalOpen && qrModalCanvasRef.current && currentQrCode?.url) {
      QRCode.toCanvas(qrModalCanvasRef.current, currentQrCode.url, {
        width: 160,
        height: 160,
        color: { dark: "#0E5FD8", light: "#ffffff" },
        errorCorrectionLevel: "H",
      }, (error) => {
        if (error) {
          console.error("Modal QRCode error:", error);
          toast.error("Failed to generate QR code in modal.", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      });
    }
  }, [isQrModalOpen, currentQrCode]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isQrModalOpen) {
        setIsQrModalOpen(false);
        setCopied(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isQrModalOpen]);

  useEffect(() => {
    if (isQrModalOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isQrModalOpen]);

  const copyUrl = async () => {
    const generatedUrl = currentQrCode?.url || "";
    if (!generatedUrl) {
      toast.error("No URL available to copy.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(generatedUrl);
        setCopied(true);
        toast.success("URL copied to clipboard!", {
          position: "top-right",
          autoClose: 1600,
        });
        setTimeout(() => setCopied(false), 1600);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = generatedUrl;
        textarea.style.position = "fixed";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        try {
          const successful = document.execCommand("copy");
          if (successful) {
            setCopied(true);
            toast.success("URL copied to clipboard!", {
              position: "top-right",
              autoClose: 1600,
            });
            setTimeout(() => setCopied(false), 1600);
          } else {
            throw new Error("document.execCommand failed");
          }
        } catch (err) {
          throw new Error("Fallback copy failed");
        } finally {
          document.body.removeChild(textarea);
        }
      }
    } catch (error) {
      console.error("Copy URL error:", {
        message: error.message,
        name: error.name,
        stack: error.stack,
      });
      toast.error(
        "Failed to copy URL automatically. Please select and copy the URL manually from the input field.",
        {
          position: "top-right",
          autoClose: 5000,
        }
      );
    }
  };

  const handleViewQrCode = (code) => {
    setCurrentQrCode(code);
    setIsQrModalOpen(true);
  };

  const downloadPNG = (code) => {
    if (!code?.url) {
      toast.error("No QR code available to download.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    QRCode.toDataURL(code.url, {
      width: 160,
      height: 160,
      color: { dark: "#0E5FD8", light: "#ffffff" },
      errorCorrectionLevel: "H",
    }, (error, url) => {
      if (error) {
        console.error("QRCode download error:", error);
        toast.error("Failed to download QR code.", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }
      const link = document.createElement("a");
      link.href = url;
      link.download = `qr_${code.title || "code"}.png`;
      link.click();
      toast.success("QR code downloaded as PNG!", {
        position: "top-right",
        autoClose: 3000,
      });
    });
  };

  const printQR = (code) => {
    if (!code?.url) {
      toast.error("No QR code available to print.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    QRCode.toDataURL(code.url, {
      width: 160,
      height: 160,
      color: { dark: "#0E5FD8", light: "#ffffff" },
      errorCorrectionLevel: "H",
    }, (error, url) => {
      if (error) {
        console.error("QRCode print error:", error);
        toast.error("Failed to print QR code.", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }
      const printWindow = window.open("");
      if (!printWindow) {
        toast.error("Failed to open print window. Please check your browser settings.", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }
      printWindow.document.write(`
        <html>
          <body>
            <img src="${url}" onload="window.print();window.close()" alt="${code.title || "QR Code"}" />
          </body>
        </html>
      `);
      printWindow.document.close();
    });
  };

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
    if (code.showFeedback) return;
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
              star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
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
                {code.businessName} • {code.feedback} Feedback • Created {code.date}
              </div>
              <div className="mt-4 flex flex-wrap gap-2 sm:gap-4">
                <button
                  onClick={() => handleViewQrCode(code)}
                  className="inline-flex items-center gap-1 sm:gap-2 cursor-pointer rounded-lg border border-slate-300 bg-white px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm hover:bg-slate-50 transition"
                  aria-label={`View QR Code for ${code.title}`}
                >
                  <QrCode className="h-3.5 sm:h-4 w-3.5 sm:w-4" /> View QR Code
                </button>
                <button
                  onClick={() => handleViewFeedbacks(code)}
                  className="inline-flex items-center gap-1 sm:gap-2 cursor-pointer rounded-lg border border-slate-300 bg-white px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm hover:bg-slate-50 transition"
                  aria-label={`View Feedbacks for ${code.title}`}
                >
                  <MessageCircle className="h-3.5 sm:h-4 w-3.5 sm:w-4" /> View Feedbacks
                </button>
                <button
                  onClick={() => editQR && editQR(code)}
                  className="inline-flex items-center gap-1 sm:gap-2 cursor-pointer rounded-lg border border-slate-300 bg-white px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm hover:bg-slate-50 transition"
                  aria-label={`Edit QR code for ${code.title}`}
                >
                  <Settings className="h-3.5 sm:h-4 w-3.5 sm:w-4" /> Edit
                </button>
                <button
                  onClick={() => shareQR(code.url, code.title, "#0E5FD8")}
                  className="inline-flex items-center gap-1 sm:gap-2 cursor-pointer rounded-lg border border-slate-300 bg-white px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm hover:bg-slate-50 transition"
                  aria-label={`Share QR code for ${code.title}`}
                >
                  <Share2 className="h-3.5 sm:h-4 w-3.5 sm:w-4" /> Share
                </button>
              </div>
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
                      <div className="bg-white border-b border-slate-200 p-4 sm:p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <MessageCircle className="h-5 w-5 text-blue-600" />
                              <h4 className="text-lg font-semibold text-slate-800">
                                Customer Reviews ({code.feedbacks.length})
                              </h4>
                            </div>
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
                      <div className="max-h-[500px] overflow-y-auto">
                        <div className="p-4 space-y-4">
                          {code.feedbacks.map((feedback) => (
                            <div
                              key={feedback.id}
                              className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow"
                            >
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="flex-shrink-0">
                                    {feedback.user && !feedback.isAnonymous ? (
                                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                                        <span className="text-white font-semibold text-sm">
                                          {feedback.user.fullname?.charAt(0)?.toUpperCase() || "U"}
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
                                          : "Anonymous Customer"}
                                      </p>
                                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRatingColor(feedback.rating)}`}>
                                        {feedback.ratingLabel}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {renderStarRating(feedback.rating)}
                                      <span className="text-sm text-slate-600">({feedback.rating}/5)</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(feedback.createdAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </div>
                              </div>
                              <div className="mb-3">
                                <p className="text-slate-700 leading-relaxed">{feedback.comment}</p>
                              </div>
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
                                        Responded on {new Date(response.createdAt).toLocaleDateString("en-US", {
                                          year: "numeric",
                                          month: "short",
                                          day: "numeric",
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
      {isQrModalOpen && currentQrCode && (
        <div
          className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
          role="dialog"
          aria-labelledby="qrModalTitle"
          ref={modalRef}
          tabIndex={-1}
        >
          <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 lg:p-5 max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 id="qrModalTitle" className="text-sm sm:text-base font-semibold text-slate-700">Preview</h2>
              <button
                onClick={() => {
                  setIsQrModalOpen(false);
                  setCopied(false);
                }}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-lg hover:bg-slate-100"
                aria-label="Close QR code modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 sm:p-6 min-h-[200px] sm:min-h-[250px] flex items-center justify-center">
              <div className="flex flex-col items-center">
                <canvas
                  ref={qrModalCanvasRef}
                  className="rounded-2xl border border-slate-200"
                  style={{
                    width: 160,
                    height: 160,
                    background: "white",
                    boxShadow: "0 1px 0 rgba(0,0,0,0.02)",
                  }}
                />
                <div className="mt-2 sm:mt-3 text-[13px] sm:text-sm font-medium text-slate-600">QR Code Preview</div>
                <div className="mt-1 text-[12px] sm:text-[13px] text-slate-500 text-center max-w-[40%] sm:w-[40%] truncate sm:text-sm overflow-hidden">
                  {currentQrCode.url ? currentQrCode.url : "No URL available"}
                </div>
              </div>
            </div>
            <div className="mt-3 sm:mt-4">
              <div className="text-[13px] sm:text-sm font-medium text-slate-700">Generated URL:</div>
              <div className="mt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                <input
                  readOnly
                  value={currentQrCode.url || ""}
                  placeholder="No URL generated yet"
                  className="flex-1 min-w-0 truncate rounded-lg border border-slate-300 bg-white px-2 sm:px-3 py-2 text-[12px] sm:text-sm overflow-hidden"
                />
                <button
                  onClick={copyUrl}
                  disabled={!currentQrCode.url}
                  className="inline-flex items-center justify-center gap-1 sm:gap-2 rounded-lg border border-slate-300 bg-white px-2 sm:px-3 py-2 text-[12px] sm:text-sm hover:bg-slate-50 disabled:opacity-50 transition"
                  aria-label={copied ? "URL Copied" : "Copy URL"}
                >
                  {copied ? <Check className="h-3.5 sm:h-4 w-3.5 sm:w-4" /> : <Copy className="h-3.5 sm:h-4 w-3.5 sm:w-4" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                <button
                  onClick={() => downloadPNG(currentQrCode)}
                  disabled={!currentQrCode.url}
                  className="inline-flex items-center justify-center gap-1 sm:gap-2 rounded-lg border border-slate-300 bg-white px-2 sm:px-3 py-2 text-[12px] sm:text-sm hover:bg-slate-50 disabled:opacity-50 transition"
                  aria-label={`Download QR code for ${currentQrCode.title}`}
                >
                  <Download className="h-3.5 sm:h-4 w-3.5 sm:w-4" /> PNG
                </button>
                <button
                  onClick={() => printQR(currentQrCode)}
                  disabled={!currentQrCode.url}
                  className="inline-flex items-center justify-center gap-1 sm:gap-2 rounded-lg border border-slate-300 bg-white px-2 sm:px-3 py-2 text-[12px] sm:text-sm hover:bg-slate-50 disabled:opacity-50 transition"
                  aria-label={`Print QR code for ${currentQrCode.title}`}
                >
                  <Printer className="h-3.5 sm:h-4 w-3.5 sm:w-4" /> Print
                </button>
                <button
                  onClick={() => shareQR(currentQrCode.url, currentQrCode.title, "#0E5FD8")}
                  disabled={!currentQrCode.url}
                  className="inline-flex items-center justify-center gap-1 sm:gap-2 rounded-lg border border-slate-300 bg-white px-2 sm:px-3 py-2 text-[12px] sm:text-sm hover:bg-slate-50 disabled:opacity-50 transition"
                  aria-label={`Share QR code for ${currentQrCode.title}`}
                >
                  <Share2 className="h-3.5 sm:h-4 w-3.5 sm:w-4" /> Share
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};