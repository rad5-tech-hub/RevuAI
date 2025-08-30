import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  QrCode,
  ChevronDown,
  Star,
  ImageIcon,
  Tag,
  Copy,
  LogOut,
  Download,
  Printer,
  Share2,
  Eye,
  Plus,
  X,
  Check,
  Settings,
  Loader2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

export default function QRGenerator() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("create");
  const [qrType, setQrType] = useState("general");
  const [qrName, setQrName] = useState("");
  const [description, setDescription] = useState("");
  const [allowImages, setAllowImages] = useState(true);
  const [primaryColor, setPrimaryColor] = useState("#0E5FD8");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState(["Service Quality", "Customer Experience"]);
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generatedQrData, setGeneratedQrData] = useState(null);
  const [qrCodeIds, setQrCodeIds] = useState(() => {
    const saved = localStorage.getItem("qrCodeIds");
    return saved ? JSON.parse(saved) : [];
  });
  const [qrCodes, setQrCodes] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const tagInputRef = useRef(null);

  // UUID validation regex
  const isValidUUID = (str) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  };

  // Save qrCodeIds to localStorage
  useEffect(() => {
    localStorage.setItem("qrCodeIds", JSON.stringify(qrCodeIds));
  }, [qrCodeIds]);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      setIsCategoriesLoading(true);
      const token = localStorage.getItem("authToken");
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/category/all-category`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const fetchedCategories = response.data.categories || response.data || [];
        const validCategories = fetchedCategories.filter((cat) => isValidUUID(cat.id));
        setCategories(validCategories);
        if (validCategories.length > 0) {
          setCategoryId(validCategories[0].id);
        } else {
          toast.error("No valid categories found. Please contact support.", {
            position: "top-right",
            autoClose: 5000,
          });
        }
      } catch (err) {
        console.error("Category fetch error:", err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          if (token) {
            try {
              const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/category/all-category`);
              const fetchedCategories = response.data.categories || response.data || [];
              const validCategories = fetchedCategories.filter((cat) => isValidUUID(cat.id));
              setCategories(validCategories);
              if (validCategories.length > 0) {
                setCategoryId(validCategories[0].id);
              } else {
                toast.error("No valid categories found. Please contact support.", {
                  position: "top-right",
                  autoClose: 5000,
                });
              }
            } catch (publicErr) {
              console.error("Public category fetch error:", publicErr);
              toast.error("Failed to fetch categories. Please contact support or try again later.", {
                position: "top-right",
                autoClose: 5000,
              });
            }
          } else {
            toast.error("Please log in to fetch categories.", {
              position: "top-right",
              autoClose: 3000,
            });
            navigate("/businessAuth");
          }
        } else {
          toast.error("Failed to fetch categories. Please contact support or try again later.", {
            position: "top-right",
            autoClose: 5000,
          });
        }
      } finally {
        setIsCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, [navigate]);

  // Update tags when qrType or categoryId changes
  useEffect(() => {
    const selectedCategory = categories.find((cat) => cat.id === categoryId);
    const businessCategory = selectedCategory?.name || "Others";
    let defaultTags = ["Service Quality", "Customer Experience"];
    if (businessCategory === "Hotels") {
      defaultTags = ["Cleanliness", "Staff Service", "Amenities"];
    } else if (businessCategory === "Restaurants") {
      defaultTags = ["Food Quality", "Service Speed", "Ambiance"];
    } else if (businessCategory === "Schools") {
      defaultTags = ["Teaching Quality", "Facilities", "Safety"];
    }
    setTags(defaultTags);
  }, [qrType, categoryId, categories]);

  const addTag = (value) => {
    const v = (value ?? tagInput).trim();
    if (!v) return;
    if (tags.some((t) => t.toLowerCase() === v.toLowerCase())) {
      setTagInput("");
      return;
    }
    setTags((prev) => [...prev, v]);
    setTagInput("");
  };

  const removeTag = (value) => setTags((prev) => prev.filter((t) => t !== value));

  const onTagKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    } else if (e.key === ",") {
      e.preventDefault();
      addTag(tagInput.replace(/,$/, ""));
    } else if (e.key === "Backspace" && !tagInput && tags.length) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const generatedUrl = useMemo(() => {
    return generatedQrData?.scan_url || "https://rad5.com.ng/review/feedback";
  }, [generatedQrData]);

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(generatedUrl);
      setCopied(true);
      toast.success("URL copied to clipboard!", {
        position: "top-right",
        autoClose: 1600,
      });
      setTimeout(() => setCopied(false), 1600);
    } catch (error) {
      toast.error("Failed to copy URL. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleCreateQR = async () => {
    if (!qrName || qrName.trim() === "") {
      toast.error("QR Code Name is required.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (!tags.length || tags.some((tag) => tag.trim() === "")) {
      toast.error("At least one valid tag is required.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (!categoryId || !isValidUUID(categoryId)) {
      toast.error("Please select a valid category.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    setIsLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Please log in to create a QR code.", {
          position: "top-right",
          autoClose: 3000,
        });
        navigate("/businessAuth");
        return;
      }
      const apiType = qrType === "product" ? "Product" : "Service";
      const payload = {
        label: qrName.trim(),
        type: apiType,
        productOrServiceId: qrName.toLowerCase().replace(/\s+/g, "-"),
        qrcode_tags: tags.map((tag) => tag.trim()).filter((tag) => tag !== ""),
        description: description?.trim() || undefined,
        categoryId,
      };
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/qrcode/generate`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const qrData = response.data.data;
      setGeneratedQrData(qrData);
      setQrCodeIds((prev) => [...new Set([...prev, qrData.id])]);
      const qrTypeMap = JSON.parse(localStorage.getItem("qrTypeMap") || "{}");
      qrTypeMap[qrData.id] = qrType;
      localStorage.setItem("qrTypeMap", JSON.stringify(qrTypeMap));
      toast.success("QR code generated successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      setQrName("");
      setDescription("");
      setTags(["Service Quality", "Customer Experience"]);
      setCategoryId(categories[0]?.id || "");
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.", {
          position: "top-right",
          autoClose: 3000,
        });
        localStorage.removeItem("authToken");
        navigate("/businessAuth");
      } else {
        toast.error(error.response?.data?.message || "Failed to generate QR code.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab !== "manage" || !qrCodeIds.length) {
      setQrCodes([]);
      return;
    }
    const fetchQrCodes = async () => {
      setIsFetching(true);
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Please log in to view QR codes.", {
          position: "top-right",
          autoClose: 3000,
        });
        navigate("/businessAuth");
        return;
      }
      try {
        const qrTypeMap = JSON.parse(localStorage.getItem("qrTypeMap") || "{}");
        const fetchedQrCodes = [];
        for (const id of qrCodeIds) {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/v1/qrcode/qrcode/${id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const qrData = response.data.qr;
          fetchedQrCodes.push({
            id: qrData.id,
            title: qrData.label,
            status: qrData.is_active ? "active" : "inactive",
            type: qrTypeMap[qrData.id] || (qrData.type === "Product" ? "product" : "service"),
            location: qrData.product_or_service_id,
            scans: 0, // Placeholder
            feedback: 0, // Placeholder
            date: qrData.createdAt.split("T")[0],
            url: qrData.scan_url,
            qrcode_url: qrData.qrcode_url,
          });
        }
        setQrCodes(fetchedQrCodes);
      } catch (error) {
        if (error.response?.status === 401) {
          toast.error("Session expired. Please log in again.", {
            position: "top-right",
            autoClose: 3000,
          });
          localStorage.removeItem("authToken");
          navigate("/businessAuth");
        } else {
          toast.error(error.response?.data?.message || "Failed to fetch QR codes.", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      } finally {
        setIsFetching(false);
      }
    };
    fetchQrCodes();
  }, [activeTab, qrCodeIds, navigate]);

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

  const shareQR = async (url, title) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Share Feedback: ${title}`,
          text: `Scan this QR code to provide feedback for ${title}`,
          url,
        });
        toast.success("QR code shared successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      } catch (error) {
        console.error("Share error:", error);
        // Fallback to copying URL
        try {
          await navigator.clipboard.writeText(url);
          toast.success("Share not supported. URL copied to clipboard!", {
            position: "top-right",
            autoClose: 3000,
          });
        } catch (copyError) {
          toast.error("Failed to share or copy URL. Please try again.", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      }
    } else {
      // Fallback for browsers without Web Share API
      try {
        await navigator.clipboard.writeText(url);
        toast.success("Share not supported. URL copied to clipboard!", {
          position: "top-right",
          autoClose: 3000,
        });
      } catch (error) {
        toast.error("Failed to copy URL. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };

  const printQR = (url, title) => {
    if (!url) {
      toast.error("No QR code available to print.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    const printWindow = window.open("");
    printWindow.document.write(`
      <html>
        <body>
          <img src="${url}" onload="window.print();window.close()" alt="${title}" />
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const viewQR = (code) => {
    setGeneratedQrData({ scan_url: code.url, qrcode_url: code.qrcode_url, label: code.title });
    setActiveTab("create");
  };

  const editQR = (code) => {
    const qrTypeMap = JSON.parse(localStorage.getItem("qrTypeMap") || "{}");
    setQrType(qrTypeMap[code.id] || (code.type === "Product" ? "product" : "service"));
    setQrName(code.title);
    setDescription("");
    setTags(["Service Quality", "Customer Experience"]);
    setCategoryId(categories[0]?.id || "");
    setActiveTab("create");
  };

  const TypeCard = ({ id, title, desc, icon }) => (
    <button
      onClick={() => setQrType(id)}
      className={`w-full text-left rounded-xl border px-4 sm:px-5 py-4 sm:py-5 transition ${
        qrType === id
          ? "border-blue-600 ring-2 ring-blue-100 bg-white"
          : "border-slate-200 hover:border-slate-300 bg-white"
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl ${
            qrType === id ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-600"
          }`}
        >
          {icon}
        </div>
        <div>
          <div className="text-[15px] sm:text-base font-semibold text-slate-800">{title}</div>
          <div className="text-[13px] sm:text-sm text-slate-500">{desc}</div>
        </div>
      </div>
    </button>
  );

  const handleLogout = async () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("qrCodeIds");
    localStorage.removeItem("qrTypeMap");
    navigate("/businessAuth");
  };

  const filteredQrCodes = filterType === "all" ? qrCodes : qrCodes.filter((code) => code.type === filterType);

  const LoadingState = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 sm:p-6" aria-busy="true" aria-label="Loading QR code generator">
      <div className="space-y-6">
        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="h-5 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={`type-card-${i}`} className="flex items-start gap-4 p-4 border border-slate-200 rounded-xl">
                <div className="mt-0.5 h-10 w-10 bg-gray-200 rounded-xl animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="h-5 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>
          <div className="space-y-4">
            <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-20 w-full bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="flex flex-wrap gap-2">
              {[1, 2].map((i) => (
                <div key={`tag-${i}`} className="h-6 w-24 bg-gray-200 rounded-full animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="h-5 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] items-center gap-3">
            <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-14 bg-gray-200 rounded-md animate-pulse"></div>
              <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
          <div className="mt-4 h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="h-12 w-full sm:w-40 bg-gray-200 rounded-xl animate-pulse"></div>
          <div className="h-12 w-full sm:w-40 bg-gray-200 rounded-xl animate-pulse"></div>
        </div>
      </div>
      <div className="space-y-6">
        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="h-5 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 min-h-[300px] flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="h-40 w-40 bg-gray-200 rounded-2xl animate-pulse"></div>
              <div className="mt-3 h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
              <div className="mt-1 h-3 w-64 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="mt-4">
            <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
            <div className="mt-1 flex items-center gap-2">
              <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-10 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={`action-${i}`} className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="h-5 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={`tip-${i}`} className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <ToastContainer />
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-4">
            <div className="flex items-center space-x-4 mb-4 lg:mb-0">
              <Link to="/businessDashboard" className="flex items-center space-x-2" aria-current="page">
                <div className="w-10 h-10 text-white mx-auto bg-blue-500 mr-2 rounded-full flex items-center justify-center">
                  <QrCode className="w-6 h-6" />
                </div>
                <span className="text-xl font-bold text-black">RevuAi</span>
              </Link>
              <span className="text-gray-500">Business Portal</span>
            </div>
            <div className="flex flex-wrap gap-2 lg:gap-8 mb-4 lg:mb-0 items-center">
              <Link
                to="/businessDashboard"
                className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
              >
                📊 Dashboard
              </Link>
              <Link
                to="/businessFeedback"
                className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
              >
                💬 Feedback
              </Link>
              <Link
                to="/businessQrpage"
                className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                aria-current="page"
              >
                📱 QR Codes
              </Link>
              <Link
                to="/businessReports"
                className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
              >
                📈 Reports
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors flex items-center gap-1"
                aria-label="Logout"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-[22px] sm:text-2xl font-bold text-slate-900">QR Code Generator</h1>
        <p className="mt-1 text-slate-500 text-sm">Create and manage QR codes for feedback collection</p>
        <div className="mt-4 rounded-xl border border-slate-200 bg-white overflow-hidden">
          <div className="flex">
            <button
              onClick={() => setActiveTab("create")}
              className={`flex-1 px-4 py-3 sm:py-3.5 text-sm font-medium ${
                activeTab === "create" ? "text-blue-700 bg-blue-50" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              Create New QR Code
            </button>
            <button
              onClick={() => setActiveTab("manage")}
              className={`flex-1 px-4 py-3 sm:py-3.5 text-sm font-medium ${
                activeTab === "manage" ? "text-blue-700 bg-blue-50" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              Manage Existing
            </button>
          </div>
          {activeTab === "create" ? (
            isCategoriesLoading ? (
              <LoadingState />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 sm:p-6">
                <div className="space-y-6">
                  <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
                    <div className="text-sm font-semibold text-slate-700">1. Choose QR Code Type</div>
                    <div className="mt-3 space-y-3">
                      <TypeCard
                        id="general"
                        title="General Business"
                        desc="Overall business experience"
                        icon={<QrCode className="h-5 w-5" />}
                      />
                      <TypeCard
                        id="product"
                        title="Specific Product"
                        desc="Individual product feedback"
                        icon={<ImageIcon className="h-5 w-5" />}
                      />
                      <TypeCard
                        id="location"
                        title="Location/Area"
                        desc="Specific location within business"
                        icon={<Tag className="h-5 w-5" />}
                      />
                      <TypeCard
                        id="service"
                        title="Service Type"
                        desc="Specific service offering"
                        icon={<Star className="h-5 w-5" />}
                      />
                    </div>
                  </section>
                  <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
                    <div className="text-sm font-semibold text-slate-700">2. Basic Information</div>
                    <label className="mt-4 block text-[13px] font-medium text-slate-600">
                      Category<span className="text-blue-600"> *</span>
                    </label>
                    {categories.length === 0 ? (
                      <div className="mt-2 text-sm text-slate-600">
                        Unable to load categories. Please contact support or try again later.
                      </div>
                    ) : (
                      <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                      >
                        <option value="" disabled>
                          Select category
                        </option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    )}
                    <label className="mt-4 block text-[13px] font-medium text-slate-600">
                      QR Code Name<span className="text-blue-600"> *</span>
                    </label>
                    <input
                      value={qrName}
                      onChange={(e) => setQrName(e.target.value)}
                      placeholder="e.g., Bar, Room Service, Espresso Machine"
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                    />
                    <label className="mt-4 block text-[13px] font-medium text-slate-600">Description (Optional)</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Brief description of what this QR code is for..."
                      rows={3}
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                    />
                    <label className="mt-4 block text-[13px] font-medium text-slate-600">Tags customers should review (Press Enter)</label>
                    <div className="mt-1">
                      <input
                        ref={tagInputRef}
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={onTagKeyDown}
                        placeholder="e.g., Food Quality, Cleanliness, Speed, Friendliness"
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                      />
                      <div className="mt-1.5 text-[12px] text-slate-500 flex items-center gap-2">
                        <Plus className="h-3.5 w-3.5" />
                        Type a tag then press Enter or comma. Backspace deletes the last tag.
                      </div>
                      {!!tags.length && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {tags.map((t) => (
                            <span
                              key={t}
                              className="group inline-flex items-center gap-1 rounded-full border border-slate-300 bg-slate-50 px-2.5 py-1 text-[12px] text-slate-700"
                            >
                              {t}
                              <button
                                type="button"
                                onClick={() => removeTag(t)}
                                className="rounded-full p-0.5 hover:bg-slate-200"
                                aria-label={`Remove ${t}`}
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </section>
                  <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
                    <div className="text-sm font-semibold text-slate-700">3. Customization</div>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-[auto_1fr] items-center gap-3">
                      <div className="text-[13px] font-medium text-slate-600">Primary Color</div>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="h-10 w-14 cursor-pointer rounded-md border border-slate-300 bg-white"
                        />
                        <input
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="w-32 rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm font-mono"
                        />
                      </div>
                    </div>
                    <label className="mt-4 flex items-center gap-2 text-[13px]">
                      <input
                        type="checkbox"
                        checked={allowImages}
                        onChange={(e) => setAllowImages(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300"
                      />
                      <span className="text-slate-700">Allow image uploads in feedback</span>
                    </label>
                  </section>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleCreateQR}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-white text-sm font-semibold shadow-sm hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
                      disabled={isLoading || !qrName || !categoryId || categories.length === 0}
                      aria-label="Create QR Code"
                    >
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                      {isLoading ? "Creating..." : "Create QR Code"}
                    </button>
                    <button
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-700 text-sm font-semibold hover:bg-slate-50"
                      aria-label="Preview QR Code"
                    >
                      <Eye className="h-4 w-4" />
                      Preview
                    </button>
                  </div>
                </div>
                <div className="space-y-6">
                  <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
                    <div className="text-sm font-semibold text-slate-700">Preview</div>
                    <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 min-h-[300px] flex items-center justify-center">
                      <div className="flex flex-col items-center">
                        {generatedQrData?.qrcode_url ? (
                          <img
                            src={generatedQrData.qrcode_url}
                            alt="Generated QR Code"
                            style={{
                              width: 160,
                              height: 160,
                              borderRadius: "16px",
                              border: "1px solid #E5E7EB",
                              boxShadow: "0 1px 0 rgba(0,0,0,0.02)",
                            }}
                          />
                        ) : (
                          <div
                            className="flex items-center justify-center rounded-2xl"
                            style={{
                              width: 160,
                              height: 160,
                              background: "white",
                              border: "1px solid #E5E7EB",
                              boxShadow: "0 1px 0 rgba(0,0,0,0.02)",
                            }}
                          >
                            <QrCode className="h-16 w-16" style={{ color: primaryColor }} />
                          </div>
                        )}
                        <div className="mt-3 text-[13px] font-medium text-slate-600">QR Code Preview</div>
                        <div className="mt-1 text-[12px] text-slate-500 text-center max-w-[520px] truncate">
                          {generatedUrl}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="text-[13px] font-medium text-slate-700">Generated URL:</div>
                      <div className="mt-1 flex items-center gap-2">
                        <input
                          readOnly
                          value={generatedUrl}
                          className="flex-1 truncate rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"
                        />
                        <button
                          onClick={copyUrl}
                          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm hover:bg-slate-50"
                          aria-label={copied ? "URL Copied" : "Copy URL"}
                        >
                          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          {copied ? "Copied" : "Copy"}
                        </button>
                      </div>
                      <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <button
                          onClick={() => downloadPNG(generatedQrData?.qrcode_url, `qr_${generatedQrData?.label || 'code'}.png`)}
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm hover:bg-slate-50"
                          aria-label="Download QR Code as PNG"
                        >
                          <Download className="h-4 w-4" /> PNG
                        </button>
                        <button
                          onClick={() => downloadSVG(generatedQrData?.qrcode_url, `qr_${generatedQrData?.label || 'code'}.png`)}
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm hover:bg-slate-50"
                          aria-label="Download QR Code as SVG"
                        >
                          <Download className="h-4 w-4" /> SVG
                        </button>
                        <button
                          onClick={() => printQR(generatedQrData?.qrcode_url, generatedQrData?.label || 'QR Code')}
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm hover:bg-slate-50"
                          aria-label="Print QR Code"
                        >
                          <Printer className="h-4 w-4" /> Print
                        </button>
                        <button
                          onClick={() => shareQR(generatedUrl, generatedQrData?.label || 'QR Code')}
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm hover:bg-slate-50"
                          aria-label="Share QR Code"
                        >
                          <Share2 className="h-4 w-4" /> Share
                        </button>
                      </div>
                    </div>
                  </section>
                  <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
                    <div className="text-sm font-semibold text-slate-700">Usage Tips</div>
                    <ul className="mt-3 space-y-2 text-[13px] text-slate-600 list-disc pl-5">
                      <li>Place QR codes in visible, easily accessible locations</li>
                      <li>Include clear instructions like "Scan to share feedback"</li>
                      <li>Test your QR codes regularly to ensure they work</li>
                      <li>Consider different QR codes for different areas/products</li>
                    </ul>
                  </section>
                </div>
              </div>
            )
          ) : (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <h2 className="font-medium text-lg">Your QR Codes ({filteredQrCodes.length})</h2>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
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
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-1 text-sm"
                  aria-label="Create New QR Code"
                >
                  <Plus className="h-4 w-4" />
                  Create New
                </button>
              </div>
              {isFetching && filteredQrCodes.length === 0 ? (
                <div className="space-y-4" aria-busy="true" aria-label="Loading QR codes">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={`qr-skeleton-${i}`}
                      className="bg-white shadow rounded-lg p-6 space-y-4 border border-slate-200"
                    >
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                        <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                      </div>
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                      <div className="flex flex-wrap gap-4">
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                      <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((j) => (
                          <div key={`action-${j}`} className="h-10 w-10 bg-gray-200 rounded-lg animate-pulse"></div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredQrCodes.length === 0 ? (
                <div className="text-center text-slate-600">No QR codes found for this type. Create a new one to get started.</div>
              ) : (
                <div className="space-y-4">
                  {filteredQrCodes.map((code) => (
                    <div
                      key={code.id}
                      className="bg-white shadow rounded-lg p-6 space-y-4 border border-slate-200"
                    >
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-semibold text-lg text-slate-800">{code.title}</h3>
                        <span className="bg-green-100 text-green-700 text-xs px-2.5 py-1 rounded-full">
                          {code.status}
                        </span>
                        <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-full">
                          {code.type === "general"
                            ? "General Business"
                            : code.type === "product"
                            ? "Specific Product"
                            : code.type === "location"
                            ? "Location/Area"
                            : "Service Type"}
                        </span>
                      </div>
                      <p className="text-slate-600 text-sm">{code.location}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" /> {code.scans} scans
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4" /> {code.feedback} feedback
                        </span>
                        <span>Created {code.date}</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-700 break-all font-mono">
                        {code.url}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => viewQR(code)}
                          className="p-2 border rounded-lg hover:bg-slate-50 text-slate-600"
                          aria-label="View QR Code"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => editQR(code)}
                          className="p-2 border rounded-lg hover:bg-slate-50 text-slate-600"
                          aria-label="Edit QR Code"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => downloadPNG(code.qrcode_url, `qr_${code.title}.png`)}
                          className="p-2 border rounded-lg hover:bg-slate-50 text-slate-600"
                          aria-label="Download QR Code as PNG"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => downloadSVG(code.qrcode_url, `qr_${code.title}.png`)}
                          className="p-2 border rounded-lg hover:bg-slate-50 text-slate-600"
                          aria-label="Download QR Code as SVG"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => shareQR(code.url, code.title)}
                          className="p-2 border rounded-lg hover:bg-slate-50 text-slate-600"
                          aria-label="Share QR Code"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(code.url);
                            toast.success("URL copied to clipboard!", {
                              position: "top-right",
                              autoClose: 1600,
                            });
                          }}
                          className="p-2 border rounded-lg hover:bg-slate-50 text-slate-600"
                          aria-label="Copy QR Code URL"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}