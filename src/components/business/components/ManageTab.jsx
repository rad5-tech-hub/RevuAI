// src/components/business/components/ManageTab.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import QRCode from "qrcode";
import domtoimage from "dom-to-image";
import {
  MessageCircle,
  Star,
  User,
  Calendar,
  Award,
  Settings,
  QrCode,
  X,
  Share2,
  Download,
  Printer,
  Plus,
  Loader2,
  Check,
  Copy,
  CheckSquare,
  Square,
  ChevronDown,
} from "lucide-react";

/**
 * In-file templates (kept as you asked — no external import)
 */
const TEMPLATES = {
  room: {
    title: "Room",
    description:
      "We’d love to know how your stay has been so far.\nPlease share your feedback on your overall comfort and experience — it helps us make your next visit even better.",
  },
  restaurant: {
    title: "Restaurant",
    description:
      "Dining with us at [Hotel Name]?\nTell us how your meal and dining experience went.\nYour honest feedback helps us make every bite better!",
  },
  bar: {
    title: "Bar",
    description:
      "Hi there!\nWe'd love your thoughts on our drinks and bar service.\nScan to share your quick feedback and help us improve.",
  },
  lounge: {
    title: "Lounge",
    description:
      "Relaxing at [Hotel Name] Lounge?\nWe'd love to hear about your ambience and service experience.\nTell us what you enjoyed or what could be better.",
  },
  reception: {
    title: "Reception",
    description:
      "Welcome to [Hotel Name]!\nPlease rate your check-in and front desk experience — your feedback helps us keep improving.",
  },
  general: {
    title: "General",
    description:
      "We'd love to know about your experience.\nPlease share your feedback — it helps us make your next visit even better.",
  },
};

export const ManageTab = ({
  filteredQrCodes = [],
  isFetching = false,
  setActiveTab,
  editQR,
  shareQR,
  filterType,
  setFilterType,
  viewQR,
}) => {
  const navigate = useNavigate();

  // === Existing State ===
  const [qrCodesWithFeedback, setQrCodesWithFeedback] = useState(
    (filteredQrCodes || []).map((code) => ({
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
  const designRef = useRef(null);
  const isBulkModeRef = useRef(false);

  // === NEW: Bulk Download Modal State ===
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [selectedQrs, setSelectedQrs] = useState(new Set());
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isDownloading, setIsDownloading] = useState(false);

  // Sync filteredQrCodes
  useEffect(() => {
    setQrCodesWithFeedback((prev) => {
      const prevMap = new Map(prev.map((p) => [p.id, p]));
      return filteredQrCodes.map((code) => {
        const existing = prevMap.get(code.id);
        return {
          ...code,
          showFeedback: existing?.showFeedback || false,
          feedbacks: existing?.feedbacks || [],
          feedbackLoading: existing?.feedbackLoading || false,
          feedbackError: existing?.feedbackError || null,
          feedbackSummary: existing?.feedbackSummary || null,
        };
      });
    });
  }, [filteredQrCodes]);

  // QR Modal Canvas
  useEffect(() => {
    if (isQrModalOpen && qrModalCanvasRef.current && currentQrCode?.url) {
      try {
        QRCode.toCanvas(
          qrModalCanvasRef.current,
          currentQrCode.url,
          {
            width: 240,
            height: 240,
            color: { dark: "#0E5FD8", light: "#ffffff" },
            errorCorrectionLevel: "H",
          },
          (error) => {
            if (error) {
              console.error("Modal QRCode error:", error);
              toast.error("Failed to generate QR in modal.");
            }
          }
        );
      } catch (err) {
        console.error("QRCode.toCanvas threw:", err);
        toast.error("Failed to generate QR image in modal.");
      }
    }
  }, [isQrModalOpen, currentQrCode]);

  // Escape to close modals
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") {
        if (isQrModalOpen) {
          setIsQrModalOpen(false);
          setCopied(false);
        }
        if (isBulkModalOpen) {
          setIsBulkModalOpen(false);
        }
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isQrModalOpen, isBulkModalOpen]);

  // Autofocus modal
  useEffect(() => {
    if (isQrModalOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isQrModalOpen]);

  const copyUrl = async () => {
    const url = currentQrCode?.url || "";
    if (!url) return toast.error("No URL to copy.");
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Copied!");
      setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error("Failed to copy URL.");
    }
  };

  const handleViewQrCode = (code) => {
    const templateMap = JSON.parse(localStorage.getItem("templateMap") || "{}");
    const templateType = templateMap[code.id] || "general";
    setCurrentQrCode({ ...code, templateType });
    setIsQrModalOpen(true);
  };

  const downloadPNG = async (code) => {
    if (!designRef.current) return toast.error("Design not ready.");
    try {
      toast.info("Generating PNG...");
      const dataUrl = await domtoimage.toPng(designRef.current, {
        quality: 1,
        bgcolor: "#ffffff",
        width: designRef.current.offsetWidth * 2,
        height: designRef.current.offsetHeight * 2,
        style: { transform: "scale(2)", transformOrigin: "top left" },
      });
      const link = document.createElement("a");
      link.href = dataUrl;
      const safeName = (code?.businessName || "QR_Design")
        .replace(/\s+/g, "_")
        .replace(/[^\w\-_.]/g, "");
      link.download = `${safeName}_QR_Design.png`;
      link.click();
      toast.success("Downloaded!");
    } catch (err) {
      console.error("downloadPNG err:", err);
      toast.error("Download failed.");
    }
  };

  const printQR = async (code) => {
    if (!designRef.current) return toast.error("Design not ready.");
    try {
      toast.info("Preparing print...");
      const dataUrl = await domtoimage.toPng(designRef.current, {
        quality: 1,
        bgcolor: "#ffffff",
        width: designRef.current.offsetWidth * 2,
        height: designRef.current.offsetHeight * 2,
        style: { transform: "scale(2)", transformOrigin: "top left" },
      });
      const win = window.open("");
      if (!win) return toast.error("Allow popups for printing.");
      win.document.write(`
        <html><head><title>Print QR</title></head>
        <body style="margin:0;padding:0;display:flex;align-items:center;justify-content:center;">
          <img src="${dataUrl}" style="max-width:100%;height:auto" onload="window.print();window.close()" />
        </body></html>
      `);
      win.document.close();
    } catch (err) {
      console.error("printQR err:", err);
      toast.error("Print failed.");
    }
  };

  const handleViewFeedbacks = async (code) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Login required.");
      navigate("/businessAuth");
      return;
    }

    setQrCodesWithFeedback((prev) =>
      prev.map((qr) =>
        qr.id === code.id
          ? { ...qr, showFeedback: !qr.showFeedback, feedbackLoading: !qr.showFeedback, feedbackError: null, feedbacks: [], feedbackSummary: null }
          : { ...qr, showFeedback: false }
      )
    );

    if (code.showFeedback) return;

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/review/qrcode-reviews/${code.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { reviews = [], totalReviews = 0, ratingSummary = {} } = res.data || {};
      setQrCodesWithFeedback((prev) =>
        prev.map((qr) =>
          qr.id === code.id
            ? { ...qr, feedbacks: reviews, feedbackSummary: { totalReviews, ratingSummary }, feedbackLoading: false, feedbackError: null }
            : qr
        )
      );
    } catch (err) {
      console.error("fetch feedbacks error:", err);
      setQrCodesWithFeedback((prev) =>
        prev.map((qr) =>
          qr.id === code.id
            ? { ...qr, feedbackLoading: false, feedbackError: err.response?.data?.message || "Failed to load feedback." }
            : qr
        )
      );
    }
  };

  const renderStarRating = (rating) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
        />
      ))}
    </div>
  );

  const getRatingColor = (rating) => {
    if (rating >= 4) return "text-green-600 bg-green-50 border-green-200";
    if (rating >= 3) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Unknown";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  // === BULK DOWNLOAD HELPERS ===
  const getFilteredQrCodesForBulk = () => {
    return filteredQrCodes.filter((code) => {
      const createdAt = new Date(code.date);
      const from = dateFrom ? new Date(dateFrom) : null;
      const to = dateTo ? new Date(dateTo) : null;

      if (from && createdAt < from) return false;
      if (to && createdAt > to) return false;
      if (typeFilter !== "all" && code.type !== typeFilter) return false;
      return true;
    });
  };

  const toggleQrSelection = (id) => {
    setSelectedQrs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const selectAllQrs = () => {
    const filtered = getFilteredQrCodesForBulk();
    setSelectedQrs(new Set(filtered.map((c) => c.id)));
  };

  const deselectAllQrs = () => {
    setSelectedQrs(new Set());
  };

const generateQrCodeImage = async (code) => {
  // -------------------------------------------------
  // 1. Template + description
  // -------------------------------------------------
  const templateMap = JSON.parse(localStorage.getItem("templateMap") || "{}");
  const templateType = templateMap[code.id] || "general";
  const template = TEMPLATES[templateType] || TEMPLATES.general;
  const desc = template.description.replace(/\[Hotel Name\]/g, code.businessName || "");

  // -------------------------------------------------
  // 2. Hidden A3 container (exact same size as PreviewSection)
  // -------------------------------------------------
  const container = document.createElement("div");
  Object.assign(container.style, {
    position: "absolute",
    left: "-9999px",
    top: "0",
    width: "148mm",
    minWidth: "148mm",
    height: "calc(148mm * 1.414)",   // A3 ratio
    padding: "12mm",
    background: "#ffffff",
    fontFamily: "sans-serif",
    boxShadow: "0 0 20px rgba(0,0,0,0.1)",
    border: "1px solid #d1d5db",
    boxSizing: "border-box",
  });
  document.body.appendChild(container);

  // -------------------------------------------------
  // 3. QR canvas (240×240 px)
  // -------------------------------------------------
  const canvas = document.createElement("canvas");
  canvas.width = 240;
  canvas.height = 240;

  await new Promise((resolve, reject) => {
    QRCode.toCanvas(
      canvas,
      code.url,
      {
        width: 240,
        color: { dark: "#0E5FD8", light: "#ffffff" },
        errorCorrectionLevel: "H",
      },
      (err) => (err ? reject(err) : resolve())
    );
  });
  const qrDataUrl = canvas.toDataURL("image/png");

  // -------------------------------------------------
  // 4. Build **exactly** the same markup that PreviewSection uses
  // -------------------------------------------------
  const welcomeText = code.title || code.businessName;

  container.innerHTML = `
    <div style="position:relative;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:space-between;text-align:center;">
      <!-- faint dot background -->
      <div style="background:radial-gradient(circle,#000 1px,transparent 1px);background-size:18px 18px;opacity:0.1;position:absolute;inset:0;pointer-events:none;"></div>

      <h1 style="font-size:2.5rem;font-weight:bold;color:#0E5FD8;margin:0;">${code.businessName}</h1>

      <p style="font-size:0.875rem;line-height:1.5;max-width:80%;margin:1.5rem 0;">
        <span style="font-weight:bold;font-size:1rem;color:#0E5FD8;">
          Welcome to ${welcomeText}!<br>
        </span>
        ${desc.replace(/\n/g, "<br>")}
      </p>

      <p style="font-weight:bold;margin-bottom:0.5rem;">Scan Me!!</p>

      <div style="border:2px solid black;border-radius:0.5rem;background:white;width:240px;height:240px;display:flex;align-items:center;justify-content:center;">
        <img src="${qrDataUrl}" style="width:100%;height:100%;object-fit:contain;" />
      </div>

      <div style="width:100%;border-top:1px solid #d1d5db;padding-top:1rem;margin-top:1.5rem;max-width:75%;">
        <h3 style="font-size:1.125rem;font-weight:bold;margin-bottom:0.75rem;">How to Use</h3>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;font-size:0.875rem;text-align:left;">
          <div><strong>1.</strong> Open camera or Google Lens.<br><strong>2.</strong> Scan the QR code.<br><strong>3.</strong> Give your feedback.</div>
          <div><strong>4.</strong> Sign up to get reply.<br><strong>5.</strong> And you're done!</div>
        </div>
      </div>

      <div style="margin-top:1rem;padding-top:0.75rem;border-top:1px solid #d1d5db;font-size:0.75rem;color:#6b7280;">
        Powered by <span style="font-weight:600;color:#0E5FD8;">ScanRevuAI.com</span>
      </div>

      <!-- four corner-dot groups (identical to PreviewSection) -->
      ${["top-6 left-6", "top-6 right-6", "bottom-6 left-6", "bottom-6 right-6"]
        .map(
          (pos) => `
          <div style="position:absolute;${pos.replace(/-/g, ":")};display:flex;gap:0.25rem;">
            ${Array.from({ length: 3 })
              .map(
                () =>
                  `<div style="width:0.375rem;height:0.375rem;border-radius:9999px;background:#9ca3af;opacity:0.5;"></div>`
              )
              .join("")}
          </div>`
        )
        .join("")}
    </div>
  `;

  // -------------------------------------------------
  // 5. Wait for the browser to layout the hidden element
  // -------------------------------------------------
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

  // -------------------------------------------------
  // 6. Convert to PNG (2× scaling – same as single download)
  // -------------------------------------------------
  try {
    const dataUrl = await domtoimage.toPng(container, {
      width: container.offsetWidth * 2,
      height: container.offsetHeight * 2,
      style: { transform: "scale(2)", transformOrigin: "top left" },
      bgcolor: "#ffffff",
    });
    document.body.removeChild(container);
    return dataUrl;
  } catch (err) {
    document.body.removeChild(container);
    throw err;
  }
};

const downloadBulkQrCodes = async () => {
  const selectedIds = Array.from(selectedQrs);
  if (selectedIds.length === 0) return;

  setIsDownloading(true);
  toast.info(`Generating ${selectedIds.length} QR designs...`);

  let successCount = 0;
  let failCount = 0;

  // Reuse the working downloadPNG logic
  const originalDownloadPNG = downloadPNG;

  for (let i = 0; i < selectedIds.length; i++) {
    const id = selectedIds[i];
    const code = filteredQrCodes.find((c) => c.id === id);
    if (!code) continue;

    try {
      // --- 1. Open modal programmatically (off-screen) ---
      isBulkModeRef.current = true;
      const templateMap = JSON.parse(localStorage.getItem("templateMap") || "{}");
      const templateType = templateMap[code.id] || "general";
      setCurrentQrCode({ ...code, templateType });
      setIsQrModalOpen(true);

      // --- 2. Wait for modal + canvas + design to render ---
      await new Promise((resolve) => setTimeout(resolve, 300)); // wait for modal
      if (!designRef.current || !qrModalCanvasRef.current) {
        throw new Error("Design not ready");
      }

      // Force QR render
      await new Promise((resolve, reject) => {
        QRCode.toCanvas(
          qrModalCanvasRef.current,
          code.url,
          {
            width: 240,
            height: 240,
            color: { dark: "#0E5FD8", light: "#ffffff" },
            errorCorrectionLevel: "H",
          },
          (err) => (err ? reject(err) : resolve())
        );
      });

      // Wait one more frame for layout
      await new Promise((r) => requestAnimationFrame(r));

      // --- 3. Trigger the EXACT same downloadPNG logic ---
      const dataUrl = await domtoimage.toPng(designRef.current, {
        quality: 1,
        bgcolor: "#ffffff",
        width: designRef.current.offsetWidth * 2,
        height: designRef.current.offsetHeight * 2,
        style: { transform: "scale(2)", transformOrigin: "top left" },
      });

      const link = document.createElement("a");
      link.href = dataUrl;
      const safeName = (code.businessName || "QR_Design")
        .replace(/\s+/g, "_")
        .replace(/[^\w\-_.]/g, "");
      link.download = `${safeName}_${code.title || "QR"}_Design.png`;
      link.click();

      successCount++;
    } catch (err) {
      console.error(`Bulk failed for ${code.id}:`, err);
      toast.error(`Failed: ${code.businessName || "Unknown"}`);
      failCount++;
    } finally {
      // --- 4. Clean up ---
      setIsQrModalOpen(false);
      setCurrentQrCode(null);
      isBulkModeRef.current = false;

      // Small delay between downloads
      if (i < selectedIds.length - 1) {
        await new Promise((r) => setTimeout(r, 400));
      }
    }
  }

  setIsDownloading(false);
  toast.success(`Downloaded ${successCount} QR design(s)!`);
  if (failCount > 0) toast.warn(`${failCount} failed.`);
};

  const closeBulkModal = () => {
    setIsBulkModalOpen(false);
    setSelectedQrs(new Set());
    setDateFrom("");
    setDateTo("");
    setTypeFilter("all");
  };

  const filteredForBulk = getFilteredQrCodesForBulk();
  const selectedCount = selectedQrs.size;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header with Create + Bulk Download */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
          <h2 className="font-medium text-lg sm:text-xl text-slate-800">Your QR Codes ({filteredQrCodes.length})</h2>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            aria-label="Filter QR codes by type"
            className="w-full sm:w-auto rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="all">All Types</option>
            <option value="general">General Business</option>
            <option value="product">Specific Product</option>
            <option value="location">Location/Area</option>
            <option value="service">Service Type</option>
          </select>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button
            onClick={() => setIsBulkModalOpen(true)}
            className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-1.5 text-sm font-medium hover:bg-green-700 transition cursor-pointer"
            aria-label="Bulk download QR codes"
          >
            <Download className="h-4 w-4" /> Bulk Download
          </button>

          <button
            onClick={() => setActiveTab?.("create")}
            className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-1 text-sm font-medium hover:bg-blue-700 transition cursor-pointer"
            aria-label="Create new QR code"
          >
            <Plus className="h-4 w-4" /> Create New
          </button>
        </div>
      </div>

      {/* Existing List */}
      {isFetching && filteredQrCodes.length === 0 ? (
        <div className="space-y-4" aria-busy="true">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white shadow-sm rounded-lg p-6 border border-slate-200 animate-pulse">
              <div className="h-6 w-48 bg-gray-200 rounded" />
              <div className="mt-2 h-4 w-32 bg-gray-200 rounded" />
              <div className="mt-4 flex gap-2">
                <div className="h-8 w-24 bg-gray-200 rounded-lg" />
                <div className="h-8 w-24 bg-gray-200 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredQrCodes.length === 0 ? (
        <div className="text-center py-12 text-slate-500">No QR codes found. Create one!</div>
      ) : (
        <div className="space-y-6">
          {qrCodesWithFeedback.map((code) => (
            <div key={code.id} className="bg-white shadow-sm rounded-xl p-6 border border-slate-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <h3 className="text-lg font-semibold text-slate-800 truncate">{code.title}</h3>
                <div className="flex gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      code.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {code.status}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {code.type}
                  </span>
                </div>
              </div>

              <div className="mt-2 text-sm text-slate-600">
                {code.businessName} • {code.feedback} Feedback • Created {formatDate(code.date)}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => handleViewQrCode(code)}
                  className="flex items-center gap-2 px-3 py-1.5 border border-slate-300 rounded-lg text-xs hover:bg-slate-50 cursor-pointer"
                  aria-label={`View ${code.title}`}
                >
                  <QrCode className="h-4 w-4" /> View Qr Code
                </button>

                <button
                  onClick={() => handleViewFeedbacks(code)}
                  className="flex items-center gap-2 px-3 py-1.5 border border-slate-300 rounded-lg text-xs hover:bg-slate-50 cursor-pointer"
                  aria-label={`Feedback for ${code.title}`}
                >
                  <MessageCircle className="h-4 w-4" /> View Feedbacks
                </button>

                <button
                  onClick={() => editQR?.(code)}
                  className="flex items-center gap-2 px-3 py-1.5 border border-slate-300 rounded-lg text-xs hover:bg-slate-50 cursor-pointer"
                  aria-label={`Edit ${code.title}`}
                >
                  <Settings className="h-4 w-4" /> Edit
                </button>

                <button
                  onClick={() => shareQR?.(code.url, code.title)}
                  className="flex items-center gap-2 px-3 py-1.5 border border-slate-300 rounded-lg text-xs hover:bg-slate-50 cursor-pointer"
                  aria-label={`Share ${code.title}`}
                >
                  <Share2 className="h-4 w-4" /> Share
                </button>
              </div>

              {code.showFeedback && (
                <div className="mt-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 p-4">
                  {code.feedbackLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    </div>
                  ) : code.feedbackError ? (
                    <p className="text-red-500 text-center">{code.feedbackError}</p>
                  ) : code.feedbacks && code.feedbacks.length > 0 ? (
                    <div>
                      <div className="bg-white p-4 border-b">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold flex items-center gap-2">
                            <MessageCircle className="h-5 w-5 text-blue-600" />
                            Reviews ({code.feedbacks.length})
                          </h4>
                          <button onClick={() => handleViewFeedbacks(code)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      </div>

                      <div className="max-h-96 overflow-y-auto p-4 space-y-4">
                        {code.feedbacks.map((f) => (
                          <div key={f.id} className="bg-white p-4 rounded-lg border">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                  {f.user?.fullname?.[0] || "A"}
                                </div>
                                <div>
                                  <p className="font-semibold">{f.user?.fullname || "Anonymous"}</p>
                                  <div className="flex items-center gap-2">
                                    {renderStarRating(f.rating)}
                                    <span className="text-xs text-slate-500">({f.rating}/5)</span>
                                  </div>
                                </div>
                              </div>

                              <span className="text-xs text-slate-500 flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(f.createdAt)}
                              </span>
                            </div>

                            <p className="text-slate-700">{f.comment}</p>

                            {Array.isArray(f.qrcode_tags) && f.qrcode_tags.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-2">
                                {f.qrcode_tags.map((tag, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}

                            {f.responses?.length > 0 && (
                              <div className="mt-4 border-t pt-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <Award className="h-4 w-4 text-blue-600" />
                                  <p className="font-medium text-sm text-slate-700">Business Response:</p>
                                </div>
                                {f.responses.map((r) => (
                                  <div key={r.id} className="bg-blue-50 rounded-lg p-3 ml-6 mb-2">
                                    <p className="text-sm text-slate-700 mb-1">{r.response}</p>
                                    <p className="text-xs text-slate-500">
                                      Responded on {formatDate(r.createdAt)}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-center text-slate-500 py-8">No reviews yet.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* QR MODAL (unchanged) */}
      {isQrModalOpen && currentQrCode && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          ref={modalRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby="qrModalTitle"
        >
          <div className="bg-white rounded-xl border border-slate-200 p-4 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 id="qrModalTitle" className="text-lg font-semibold">QR Code Preview</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (currentQrCode?.url) {
                      navigator.clipboard?.writeText(currentQrCode.url).then(() => {
                        toast.success("URL copied!");
                      }).catch(() => toast.error("Copy failed"));
                    }
                  }}
                  className="p-1 rounded hover:bg-slate-100 cursor-pointer"
                  aria-label="Copy QR url"
                >
                  <Copy className="h-4 w-4" />
                </button>

                <button
                  onClick={() => {
                    setIsQrModalOpen(false);
                    setCopied(false);
                    setCurrentQrCode(null);
                  }}
                  className="p-1 hover:bg-slate-100 rounded cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <div
                ref={designRef}
                className="relative mx-auto border border-gray-300 bg-white text-black w-[min(100%,148mm)] h-[calc(min(100vw,148mm)*1.414)] p-[12mm] font-sans shadow-lg"
                style={{ minWidth: "148mm" }}
              >
                <div
                  className="absolute inset-0 opacity-10 pointer-events-none"
                  style={{ background: "radial-gradient(circle, #000 1px, transparent 1px)", backgroundSize: "18px 18px" }}
                />

                <div className="absolute top-1/2 right-[10mm] flex flex-col gap-1 opacity-10 -translate-y-1/2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="text-2xl font-bold">X</div>
                  ))}
                </div>

                <div className="relative z-10 flex flex-col items-center justify-between h-full text-center">
                  <h1 className="text-3xl font-bold text-[#0E5FD8] tracking-wide">{currentQrCode.businessName}</h1>

                  {(() => {
                    const template = TEMPLATES[currentQrCode.templateType] || TEMPLATES.general;
                    const desc = (template?.description || "").replace(/\[Hotel Name\]/g, currentQrCode.businessName || "");
                    return (
                      <p className="text-sm leading-relaxed whitespace-pre-line max-w-[80%] my-6">
                        <span className="font-bold text-base text-[#0E5FD8]">
                          Welcome to our {currentQrCode.title || currentQrCode.businessName}!{"\n"}
                        </span>
                        {desc}
                      </p>
                    );
                  })()}

                  <p className="font-bold mb-2">Scan Me!!</p>

                  <div className="flex items-center justify-center border-2 border-black rounded-lg bg-white h-[240px] w-[240px]">
                    <canvas ref={qrModalCanvasRef} className="w-full h-full object-contain" />
                  </div>

                  <div className="w-full border-t border-gray-300 pt-4 mt-6 max-w-[75%] mx-auto">
                    <h3 className="text-lg font-bold mb-3">How to Use</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div className="text-left space-y-1">
                        <p><strong>1.</strong> Open camera or Google Lens.</p>
                        <p><strong>2.</strong> Scan the QR code.</p>
                        <p><strong>3.</strong> Give your feedback about the service you've received.</p>
                      </div>
                      <div className="text-left space-y-1">
                        <p><strong>4.</strong> Sign up to get reply from management.</p>
                        <p><strong>5.</strong> And you're done!</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-300 text-xs text-gray-600">
                    Powered by <span className="font-semibold text-[#0E5FD8]">ScanRevuAI.com</span>
                  </div>
                </div>

                {["top-6 left-6", "top-6 right-6", "bottom-6 left-6", "bottom-6 right-6"].map((pos) => (
                  <div key={pos} className={`absolute ${pos} flex gap-1`}>
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="w-1 h-1 rounded-full bg-gray-400 opacity-50" />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <div className="text-xs font-medium">Generated URL:</div>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={currentQrCode.url || ""}
                  className="flex-1 px-3 py-2 border rounded text-xs bg-gray-50"
                  aria-label="Generated QR url"
                />
                <button onClick={copyUrl} className="flex items-center gap-1.5 px-3 py-2 border rounded text-xs hover:bg-gray-50 cursor-pointer">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => downloadPNG(currentQrCode)} className="flex items-center justify-center gap-1.5 px-2 py-2 border rounded text-xs hover:bg-gray-50 cursor-pointer">
                  <Download className="h-4 w-4" /> PNG
                </button>
                <button onClick={() => printQR(currentQrCode)} className="flex items-center justify-center gap-1.5 px-2 py-2 border rounded text-xs hover:bg-gray-50 cursor-pointer">
                  <Printer className="h-4 w-4" /> Print
                </button>
                <button onClick={() => shareQR?.(currentQrCode.url, currentQrCode.title)} className="flex items-center justify-center gap-1.5 px-2 py-2 border rounded text-xs hover:bg-gray-50 cursor-pointer">
                  <Share2 className="h-4 w-4" /> Share
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BULK DOWNLOAD MODAL */}
      {isBulkModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="bulkModalTitle"
        >
          <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 id="bulkModalTitle" className="text-xl font-semibold">Bulk Download QR Codes</h2>
              <button
                onClick={closeBulkModal}
                className="p-1 hover:bg-slate-100 rounded cursor-pointer"
                aria-label="Close bulk download modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Filters */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date From</label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date To</label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Type Filter</label>
                  <div className="relative">
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="w-full px-3 py-2 pr-8 border border-slate-300 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-200"
                    >
                      <option value="all">All Types</option>
                      <option value="general">General Business</option>
                      <option value="product">Specific Product</option>
                      <option value="location">Location/Area</option>
                      <option value="service">Service Type</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mt-4">
                <div className="flex gap-2">
                  <button
                    onClick={selectAllQrs}
                    className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 cursor-pointer"
                  >
                    Select All ({filteredForBulk.length})
                  </button>
                  <button
                    onClick={deselectAllQrs}
                    className="px-3 py-1.5 border border-slate-300 text-sm rounded-lg hover:bg-slate-50 cursor-pointer"
                  >
                    Deselect All
                  </button>
                </div>
                <span className="text-sm text-slate-600">
                  {selectedCount} selected
                </span>
              </div>
            </div>

            {/* QR List */}
            <div className="max-h-96 overflow-y-auto border border-slate-200 rounded-lg bg-white">
              {filteredForBulk.length === 0 ? (
                <p className="text-center py-8 text-slate-500">No QR codes match your filters.</p>
              ) : (
                <div className="p-2 space-y-2">
                  {filteredForBulk.map((code) => (
                    <div
                      key={code.id}
                      onClick={() => toggleQrSelection(code.id)}
                      className={`p-3 rounded-lg border cursor-pointer transition ${
                        selectedQrs.has(code.id)
                          ? "bg-blue-50 border-blue-400"
                          : "bg-white border-slate-200 hover:bg-slate-50"
                      }`}
                      role="checkbox"
                      aria-checked={selectedQrs.has(code.id)}
                    >
                      <div className="flex items-center gap-3">
                        {selectedQrs.has(code.id) ? (
                          <CheckSquare className="h-5 w-5 text-blue-600" />
                        ) : (
                          <Square className="h-5 w-5 text-slate-400" />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-slate-800">{code.title}</h4>
                            <div className="flex gap-2">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                code.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                              }`}>
                                {code.status}
                              </span>
                              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {code.type}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-slate-600 mt-1">
                            {code.businessName} • Created {formatDate(code.date)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={closeBulkModal}
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm hover:bg-slate-50 cursor-pointer"
                disabled={isDownloading}
              >
                Cancel
              </button>
              <button
                onClick={downloadBulkQrCodes}
                disabled={selectedCount === 0 || isDownloading}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition ${
                  selectedCount === 0 || isDownloading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                }`}
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Download ({selectedCount})
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTab; 
