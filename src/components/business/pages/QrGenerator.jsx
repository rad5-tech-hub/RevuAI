import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import QRCode from "qrcode";
import { QrCode, Download, Share2, Printer, Eye, Plus, X, Check, Loader2 } from "lucide-react";
import { HeaderSection } from "../components/headerSection";
import { Tabs } from "../components/Tabs";
import { TypeCard } from "../components/TypeCard";
import { QRModal } from "../components/QrModal";
import BusinessHeader from "../components/headerComponents";
import LoadingState from "../components/LoadingStates";
import { PreviewSection } from "../components/Preview";
import { CreateTab } from "../components/CreateTab";
import { ManageTab } from "../components/ManageTab";
import { UsageTips } from "../components/UsageTips";
// Main QRGenerator Component
export default function QRGenerator() {
  const qrRef = useRef(null);
  const tagInputRef = useRef(null);
  const modalCanvasRef = useRef(null);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("create");
  const [qrType, setQrType] = useState("general");
  const [qrName, setQrName] = useState("");
  const [description, setDescription] = useState("");
  const [allowImages, setAllowImages] = useState(true);
  const [primaryColor, setPrimaryColor] = useState("#0E5FD8");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [isTagsLoading, setIsTagsLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCategoryLoading, setIsCategoryLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [generatedQrData, setGeneratedQrData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [qrCodeIds, setQrCodeIds] = useState(() => {
    const saved = localStorage.getItem("qrCodeIds");
    return saved ? JSON.parse(saved) : [];
  });
  const [qrCodes, setQrCodes] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const isValidUUID = (str) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  };
  useEffect(() => {
    localStorage.setItem("qrCodeIds", JSON.stringify(qrCodeIds));
  }, [qrCodeIds]);
  useEffect(() => {
    const fetchBusinessCategory = async () => {
      setIsCategoryLoading(true);
      const token = localStorage.getItem("authToken");
      const businessId = localStorage.getItem("authBusinessId");
      if (!token || !businessId) {
        toast.error("Please log in to access this page.", {
          position: "top-right",
          autoClose: 3000,
        });
        navigate("/businessAuth");
        setIsCategoryLoading(false);
        return;
      }
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/business/business-qrcode/${businessId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const business = response.data.business;
        const catId = business.categoryId;
        if (catId && isValidUUID(catId)) {
          setCategoryId(catId);
        } else {
          toast.error("Business category not found. Please contact support.", {
            position: "top-right",
            autoClose: 5000,
          });
        }
      } catch (err) {
        console.error("Business fetch error:", err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          toast.error("Session expired. Please log in again.", {
            position: "top-right",
            autoClose: 3000,
          });
          localStorage.removeItem("authToken");
          localStorage.removeItem("authBusinessId");
          navigate("/businessAuth");
        } else if (err.response?.status === 404) {
          toast.error("Business not found. Please verify your account details or contact support.", {
            position: "top-right",
            autoClose: 5000,
          });
          localStorage.removeItem("authBusinessId");
          navigate("/businessAuth");
        } else {
          toast.error("Failed to fetch business details. Please try again later.", {
            position: "top-right",
            autoClose: 5000,
          });
        }
      } finally {
        setIsCategoryLoading(false);
      }
    };
    fetchBusinessCategory();
  }, [navigate]);
  useEffect(() => {
    if (!categoryId || !isValidUUID(categoryId) || editingId) {
      // Skip fetching tags if editing a QR code to preserve qrData.qrcode_tags
      if (!editingId) setTags([]);
      return;
    }
    const fetchTags = async () => {
      setIsTagsLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        const headers = token ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/tags/${categoryId}`, { headers });
        const fetchedTags = response.data.data?.map((tag) => tag.name) || [];
        setTags(fetchedTags);
      } catch (error) {
        console.error("Error fetching tags:", error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          toast.error("Session expired or unauthorized. Please log in again.", {
            position: "top-right",
            autoClose: 3000,
          });
          localStorage.removeItem("authToken");
          navigate("/businessAuth");
        } else {
          toast.error("Failed to fetch tags. Please add tags manually.", {
            position: "top-right",
            autoClose: 3000,
          });
          setTags([]);
        }
      } finally {
        setIsTagsLoading(false);
      }
    };
    fetchTags();
  }, [categoryId, navigate, editingId]);
  useEffect(() => {
    if (activeTab !== "manage") {
      setQrCodes([]);
      return;
    }
    const fetchQrCodes = async () => {
      setIsFetching(true);
      const token = localStorage.getItem("authToken");
      const businessId = localStorage.getItem("authBusinessId");
      if (!token || !businessId) {
        toast.error("Please log in to view QR codes.", {
          position: "top-right",
          autoClose: 3000,
        });
        navigate("/businessAuth");
        setIsFetching(false);
        return;
      }
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/business/business-qrcode/${businessId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const qrTypeMap = JSON.parse(localStorage.getItem("qrTypeMap") || "{}");
        const fetchedQrCodes = (response.data.business.qrcodes || []).map((qr) => ({
          id: qr.id || "",
          title: qr.label || "Untitled",
          status: qr.is_active ? "active" : "inactive",
          type: qrTypeMap[qr.id] || (qr.type === "Product" ? "product" : qr.type === "Service" ? "service" : "general"),
          location: qr.product_or_service_id || qr.label?.toLowerCase().replace(/\s+/g, "-") || "",
          scans: 0,
          feedback: qr.reviews?.length || 0,
          date: qr.createdAt?.split("T")[0] || new Date().toISOString().split("T")[0],
          url: `${import.meta.env.VITE_SCAN_URL}/qr/${businessId}/${qr.id}`,
          businessName: response.data.business.business_name || "Unknown Business",
          categoryName: qr.category?.name || "Unknown Category",
          categoryId: qr.category?.id || "",
          description: qr.description || "",
          tags: Array.isArray(qr.qrcode_tags) ? qr.qrcode_tags : [],
        }));
        setQrCodes(fetchedQrCodes.sort((a, b) => new Date(b.date) - new Date(a.date)));
        const fetchedQrCodeIds = (response.data.business.qrcodes || [])
          .map((qr) => qr.id)
          .filter((id) => isValidUUID(id));
        setQrCodeIds(fetchedQrCodeIds);
        localStorage.setItem("qrCodeIds", JSON.stringify(fetchedQrCodeIds));
      } catch (error) {
        console.error("Fetch QR codes error:", error);
        if (error.response?.status === 401) {
          toast.error("Session expired. Please log in again.", {
            position: "top-right",
            autoClose: 3000,
          });
          localStorage.removeItem("authToken");
          localStorage.removeItem("authBusinessId");
          localStorage.removeItem("qrCodeIds");
          localStorage.removeItem("qrTypeMap");
          navigate("/businessAuth");
        } else {
          toast.error(error.response?.data?.message || "Failed to fetch QR codes. Please try again.", {
            position: "top-right",
            autoClose: 3000,
          });
          setQrCodes([]); // Fallback to empty list
        }
      } finally {
        setIsFetching(false);
      }
    };
    fetchQrCodes();
  }, [activeTab, navigate]);
  useEffect(() => {
    if (generatedQrData?.scan_url && qrRef.current) {
      qrRef.current.innerHTML = "";
      const canvas = document.createElement("canvas");
      qrRef.current.appendChild(canvas);
      QRCode.toCanvas(canvas, generatedQrData.scan_url, {
        width: 160,
        height: 160,
        color: { dark: primaryColor, light: "#ffffff" },
        errorCorrectionLevel: "H",
      }, (error) => {
        if (error) {
          console.error("QRCode generation error:", error);
          toast.error("Failed to generate QR code preview.", {
            position: "top-right",
            autoClose: 3000,
          });
          // Fallback: Clear preview
          qrRef.current.innerHTML = "<p class='text-red-500'>Preview unavailable</p>";
        }
      });
    }
  }, [generatedQrData, primaryColor]);
  useEffect(() => {
    if (showModal && modalCanvasRef.current && generatedQrData?.scan_url) {
      QRCode.toCanvas(modalCanvasRef.current, generatedQrData.scan_url, {
        width: 300,
        height: 300,
        color: { dark: primaryColor, light: "#ffffff" },
        errorCorrectionLevel: "H",
      }, (error) => {
        if (error) {
          console.error("Modal QRCode error:", error);
          toast.error("Failed to generate modal QR code.", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      });
    }
  }, [showModal, generatedQrData, primaryColor]);
  const copyUrl = async () => {
    const generatedUrl = generatedQrData?.scan_url || "";
    if (!generatedUrl) {
      toast.error("No URL available to copy.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
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
  const downloadPNG = () => {
    if (!generatedQrData?.scan_url) {
      toast.error("No QR code available to download.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    QRCode.toDataURL(generatedQrData.scan_url, {
      width: 160,
      height: 160,
      color: { dark: primaryColor, light: "#ffffff" },
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
      link.download = `qr_${generatedQrData?.label || "code"}.png`;
      link.click();
    });
  };
  const shareQR = async (url, title) => {
    if (!url || !title) {
      toast.error("No QR code available to share.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
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
  const printQR = () => {
    if (!generatedQrData?.scan_url) {
      toast.error("No QR code available to print.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    QRCode.toDataURL(generatedQrData.scan_url, {
      width: 160,
      height: 160,
      color: { dark: primaryColor, light: "#ffffff" },
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
            <img src="${url}" onload="window.print();window.close()" alt="${generatedQrData?.label || "QR Code"}" />
          </body>
        </html>
      `);
      printWindow.document.close();
    });
  };
  const viewQR = (code) => {
    if (!code?.url || !code?.title) {
      toast.error("Invalid QR code data for viewing.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    setGeneratedQrData({ scan_url: code.url, label: code.title });
    setActiveTab("create");
  };
  const editQR = async (code) => {
    const token = localStorage.getItem("authToken");
    const businessId = localStorage.getItem("authBusinessId");
    if (!token || !businessId) {
      toast.error("Please log in to edit QR code.", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/businessAuth");
      return;
    }
    setIsLoading(true); // Show loading while fetching for edit
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/qrcode/qrcode/${code.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const qrData = response.data.qr || {};
      // console.log("Fetched QR data for editing:", qrData); // Debug log
      const qrTypeMap = JSON.parse(localStorage.getItem("qrTypeMap") || "{}");
      setQrType(qrTypeMap[code.id] || (qrData.type === "Product" ? "product" : qrData.type === "Service" ? "service" : "general"));
      setQrName(qrData.label || "");
      setDescription(qrData.description || "");
      setTags(Array.isArray(qrData.qrcode_tags) ? qrData.qrcode_tags : []);
      setEditingId(code.id);
      // Set preview for editing
      const constructedScanUrl = `${import.meta.env.VITE_SCAN_URL}/qr/${businessId}/${code.id}`;
      setGeneratedQrData({
        ...qrData,
        scan_url: constructedScanUrl,
      });
      setActiveTab("create");
    } catch (error) {
      console.error("Edit QR fetch error:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Session expired. Please log in again.", {
          position: "top-right",
          autoClose: 3000,
        });
        localStorage.removeItem("authToken");
        navigate("/businessAuth");
      } else {
        toast.error("Failed to fetch QR code details. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } finally {
      setIsLoading(false);
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
      toast.error("Invalid category. Please contact support.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    setIsLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const businessId = localStorage.getItem("authBusinessId");
      if (!token || !businessId) {
        toast.error("Please log in to create a QR code.", {
          position: "top-right",
          autoClose: 3000,
        });
        navigate("/businessAuth");
        return;
      }
      const apiType = (qrType === "general" || qrType === "product" || qrType === "location") ? "Product" : "Service";
      const productOrServiceId = `${qrName.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
      const payload = {
        label: qrName.trim(),
        type: apiType,
        productOrServiceId,
        qrcode_tags: tags.map((tag) => tag.trim()).filter((tag) => tag !== ""),
        description: description?.trim() || undefined,
        categoryId,
      };
      let qrData;
      if (editingId) {
        const response = await axios.patch(
          `${import.meta.env.VITE_API_URL}/api/v1/qrcode/${editingId}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        qrData = response.data.data || {};
        setEditingId(null);
        toast.success("QR code updated successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
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
        qrData = response.data.data || {};
        setQrCodeIds((prev) => [...new Set([...prev, qrData.id])]);
        const qrTypeMap = JSON.parse(localStorage.getItem("qrTypeMap") || "{}");
        qrTypeMap[qrData.id] = qrType;
        localStorage.setItem("qrTypeMap", JSON.stringify(qrTypeMap));
        toast.success("QR code generated successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      }
      const constructedScanUrl = `${import.meta.env.VITE_SCAN_URL}/qr/${businessId || qrData.businessId}/${qrData.id}`;
      setGeneratedQrData({
        ...qrData,
        scan_url: constructedScanUrl,
      });
      setQrName("");
      setDescription("");
      setTags([]);
    } catch (error) {
      console.error("QR Code operation error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      if (error.response?.status === 401) {
        toast.error("Session expired or invalid token. Please log in again.", {
          position: "top-right",
          autoClose: 3000,
        });
        localStorage.removeItem("authToken");
        navigate("/businessAuth");
      } else if (error.response?.status === 409) {
        toast.error("A QR code with this name or ID already exists. Please choose a different name.", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        const errorMessage = error.response?.data?.message || "Failed to process QR code. Please try again.";
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  const filteredQrCodes = filterType === "all" ? qrCodes : qrCodes.filter((code) => code.type === filterType);
  return (
    <div className="min-h-screen bg-slate-50">
      <BusinessHeader
        onLogout={() => {
          localStorage.removeItem("authToken");
          localStorage.removeItem("authBusinessId");
          localStorage.removeItem("qrCodeIds");
          localStorage.removeItem("qrTypeMap");
          navigate("/businessAuth");
        }}
        isLoggingOut={isLoading}
      />
      <ToastContainer />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <HeaderSection />
        <div className="mt-4 rounded-xl border border-slate-200 bg-white overflow-hidden">
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
          {activeTab === "create" ? (
            isCategoryLoading ? (
              <LoadingState message="Loading business category..." />
            ) : !categoryId ? (
              <div className="p-6 text-center text-red-500">
                Failed to load category. Please try refreshing or contact support.
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row p-4 sm:p-6 gap-6">
                <div className="flex-1 min-w-0 space-y-8">
                  <CreateTab
                    qrType={qrType}
                    setQrType={setQrType}
                    qrName={qrName}
                    setQrName={setQrName}
                    description={description}
                    setDescription={setDescription}
                    tagInput={tagInput}
                    setTagInput={setTagInput}
                    tags={tags}
                    setTags={setTags}
                    isTagsLoading={isTagsLoading}
                    primaryColor={primaryColor}
                    setPrimaryColor={setPrimaryColor}
                    allowImages={allowImages}
                    setAllowImages={setAllowImages}
                    isLoading={isLoading}
                    handleCreateQR={handleCreateQR}
                    tagInputRef={tagInputRef}
                    editingId={editingId}
                  />
                </div>
                <div className="flex-1 min-w-0 space-y-4">
                  <PreviewSection
                    generatedQrData={generatedQrData}
                    qrRef={qrRef}
                    primaryColor={primaryColor}
                    generatedUrl={generatedQrData?.scan_url || ""}
                    copyUrl={copyUrl}
                    copied={copied}
                    downloadPNG={downloadPNG}
                    printQR={printQR}
                    shareQR={shareQR}
                    setShowModal={setShowModal}
                  />
                  <UsageTips />
                </div>
              </div>
            )
          ) : (
            <ManageTab
              filteredQrCodes={filteredQrCodes}
              isFetching={isFetching}
              setActiveTab={setActiveTab}
              viewQR={viewQR}
              editQR={editQR}
              shareQR={shareQR}
              filterType={filterType}
              setFilterType={setFilterType}
            />
          )}
        </div>
      </main>
      <QRModal
        showModal={showModal}
        setShowModal={setShowModal}
        modalCanvasRef={modalCanvasRef}
        generatedQrData={generatedQrData}
        primaryColor={primaryColor}
      />
    </div>
  );
}