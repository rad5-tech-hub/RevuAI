// src/components/business/pages/QRGenerator.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { QrCode, Download, Share2, Printer, Eye, Plus, X, Check, Loader2 } from "lucide-react";
import { HeaderSection } from "../components/HeaderSection";
import { Tabs } from "../components/Tabs";
import { TypeCard } from "../components/TypeCard";
import { QRModal } from "../components/QRModal";
import BusinessHeader from "../components/headerComponents";
import LoadingState from "../components/LoadingState";
import { PreviewSection } from "../components/Preview";
import { CreateTab } from "../components/CreateTab";
import { ManageTab } from "../components/ManageTab";
import { UsageTips } from "../components/UsageTips";
import { downloadFullDesign, printFullDesign } from "../../../utils/qrHelpers";

export default function QRGenerator() {
  const previewRef = useRef(null);
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
  const [businessCategory, setBusinessCategory] = useState("");
  const [businessName, setBusinessName] = useState("Business Name");
  const [startRange, setStartRange] = useState("");
  const [endRange, setEndRange] = useState("");
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
  const [selectedTemplate, setSelectedTemplate] = useState("general");

    const isValidUUID = (str) => {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      return uuidRegex.test(str);
    };

    const hasHotelRoomKeywords = (label) => {
      if (!label || typeof label !== 'string') return false;
      const keywords = ["room", "suite", "bed", "cabin", "villa", "apartment", "unit"];
      const lowerLabel = label.toLowerCase();
      return keywords.some((keyword) => lowerLabel.includes(keyword));
    };

    useEffect(() => {
      localStorage.setItem("qrCodeIds", JSON.stringify(qrCodeIds));
    }, [qrCodeIds]);

  // Fetch business profile
  useEffect(() => {
    const fetchBusinessProfile = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/business/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const profile = response.data.profile;
        setBusinessCategory(profile?.category || "");
        setBusinessName(profile?.business_name || "Business Name");
      } catch (err) {
        toast.error("Failed to load business name.");
      }
    };
    fetchBusinessProfile();
  }, []);

  // Fetch category ID
  useEffect(() => {
    const fetchBusinessCategory = async () => {
      setIsCategoryLoading(true);
      const token = localStorage.getItem("authToken");
      const businessId = localStorage.getItem("authBusinessId");
      if (!token || !businessId) {
        toast.error("Please log in.");
        navigate("/businessAuth");
        setIsCategoryLoading(false);
        return;
      }
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/business/business-qrcode/${businessId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const catId = response.data.business.categoryId;
        if (catId && isValidUUID(catId)) setCategoryId(catId);
        else toast.error("Invalid category.");
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.clear();
          navigate("/businessAuth");
        }
      } finally {
        setIsCategoryLoading(false);
      }
    };
    fetchBusinessCategory();
  }, [navigate]);

  // Fetch tags
  useEffect(() => {
    if (!categoryId || editingId) return;
    const fetchTags = async () => {
      setIsTagsLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/tags/${categoryId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTags(response.data.data?.map(t => t.name) || []);
      } catch (err) {
        setTags([]);
      } finally {
        setIsTagsLoading(false);
      }
    };
    fetchTags();
  }, [categoryId, editingId]);

  // Fetch QR codes
  useEffect(() => {
    if (activeTab !== "manage") return;
    const fetchQrCodes = async () => {
      setIsFetching(true);
      const token = localStorage.getItem("authToken");
      const businessId = localStorage.getItem("authBusinessId");
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/business/business-qrcode/${businessId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const qrTypeMap = JSON.parse(localStorage.getItem("qrTypeMap") || "{}");
        const fetched = (response.data.business.qrcodes || []).map(qr => ({
          id: qr.id,
          title: qr.label || "Untitled",
          status: qr.is_active ? "active" : "inactive",
          type: qrTypeMap[qr.id] || (qr.type === "Product" ? "product" : qr.type === "Service" ? "service" : "general"),
          location: qr.product_or_service_id || "",
          scans: 0,
          feedback: qr.reviews?.length || 0,
          date: qr.createdAt?.split("T")[0] || "",
          url: `${import.meta.env.VITE_SCAN_URL}/qr/${businessId}/${qr.id}`,
          businessName: response.data.business.business_name,
          description: qr.description || "",
          tags: Array.isArray(qr.qrcode_tags) ? qr.qrcode_tags : [],
        }));
        setQrCodes(fetched.sort((a, b) => new Date(b.date) - new Date(a.date)));
        const ids = fetched.map(q => q.id).filter(isValidUUID);
        setQrCodeIds(ids);
        localStorage.setItem("qrCodeIds", JSON.stringify(ids));
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.clear();
          navigate("/businessAuth");
        }
      } finally {
        setIsFetching(false);
      }
    };
    fetchQrCodes();
  }, [activeTab, navigate]);

  const copyUrl = async () => {
    const url = generatedQrData?.scan_url || "";
    if (!url) return toast.error("No URL.");
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Copied!");
      setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error("Copy failed.");
    }
  };

  const shareQR = async (url, title) => {
    if (navigator.share && navigator.canShare({ url })) {
      try {
        await navigator.share({ title, url });
      } catch {
        await copyUrl();
      }
    } else {
      await copyUrl();
    }
  };

  const viewQR = (code) => {
    const templateMap = JSON.parse(localStorage.getItem("templateMap") || "{}");
    setSelectedTemplate(templateMap[code.id] || "general");
    setGeneratedQrData({ scan_url: code.url, label: code.title });
    setActiveTab("create");
  };

  const editQR = async (code) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const businessId = localStorage.getItem("authBusinessId");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/qrcode/qrcode/${code.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const qr = res.data.qr;
      const map = JSON.parse(localStorage.getItem("qrTypeMap") || "{}");

      setQrType(map[code.id] || (qr.type === "Product" ? "product" : "service"));
      setQrName(qr.label || "");
      setDescription(qr.description || "");
      setTags(Array.isArray(qr.qrcode_tags) ? qr.qrcode_tags : []);
      setStartRange(qr.room_start || "");
      setEndRange(qr.room_end || "");
      setEditingId(code.id);

      const templateMap = JSON.parse(localStorage.getItem("templateMap") || "{}");
      setSelectedTemplate(templateMap[code.id] || "general");

      const scanUrl = `${import.meta.env.VITE_SCAN_URL}/qr/${businessId}/${code.id}`;
      setGeneratedQrData({ scan_url: scanUrl, label: qr.label });

      setActiveTab("create");
    } catch (err) {
      toast.error("Failed to load QR.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateQR = async () => {
    if (!qrName || qrName.trim() === "") {
      toast.error("QR Code Name is required.");
      return;
    }
    if (!tags.length || tags.some((tag) => tag.trim() === "")) {
      toast.error("At least one valid tag is required.");
      return;
    }
    if (!categoryId || !isValidUUID(categoryId)) {
      toast.error("Invalid category.");
      return;
    }

    const isHotel = businessCategory && (
      businessCategory.toLowerCase() === "hotel" ||
      businessCategory.toLowerCase() === "hotels"
    );
    const hasRoomKeywords = hasHotelRoomKeywords(qrName);
    const shouldIncludeRoomRange = isHotel && hasRoomKeywords;

    if (shouldIncludeRoomRange && (startRange.trim() || endRange.trim())) {
      const start = parseInt(startRange.trim());
      const end = parseInt(endRange.trim());

      if (!startRange.trim() || !endRange.trim()) {
        toast.error("Please provide both start and end room numbers.");
        return;
      }
      if (isNaN(start) || isNaN(end)) {
        toast.error("Room numbers must be valid numbers.");
        return;
      }
      if (start > end) {
        toast.error("Start room number must be less than or equal to end room number.");
        return;
      }
      const totalRooms = end - start + 1;
      if (totalRooms > 500) {
        toast.error("Maximum 500 rooms can be generated at once.");
        return;
      }
    }

      const isBulkGeneration = shouldIncludeRoomRange && startRange.trim() && endRange.trim();

    setIsLoading(true);
    const token = localStorage.getItem("authToken");
    const businessId = localStorage.getItem("authBusinessId");

    try {
      const apiType = qrType === "general" || qrType === "location" ? "Product" : "Service";

      /* ---------- EDIT ---------- */
      if (editingId) {
        const payload = {
          label: qrName.trim(),
          type: apiType,
          qrcode_tags: tags.map(t => t.trim()).filter(t => t),
          description: description?.trim() || undefined,
        };
        if (shouldIncludeRoomRange) {
          if (startRange.trim()) payload.room_start = startRange.trim();
          if (endRange.trim()) payload.room_end = endRange.trim();
        }

        await axios.put(`${import.meta.env.VITE_API_URL}/api/v1/qrcode/edit-qrcode/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
        });

        // *** SAVE TEMPLATE FOR EDITED QR ***
        const templateMap = JSON.parse(localStorage.getItem("templateMap") || "{}");
        templateMap[editingId] = selectedTemplate;
        localStorage.setItem("templateMap", JSON.stringify(templateMap));

        toast.success("QR code updated!");
        setEditingId(null);
      }

      /* ---------- BULK ---------- */
      else if (isBulkGeneration) {
        const start = parseInt(startRange.trim());
        const end = parseInt(endRange.trim());

        const bulkPayload = {
          label: qrName.trim(),
          type: apiType,
          productOrServiceId: "H001",
          qrcode_tags: tags.map(t => t.trim()).filter(t => t),
          description: description?.trim() || "QR code for hotel room for guests to give feedback",
          categoryId,
          startRange: start,
          endRange: end,
        };

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/v1/qrcode/generate`,
          bulkPayload,
          { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
        );

        const bulkData = response.data.data || [];
        const newQrIds = bulkData.map(qr => qr.id).filter(id => id);
        setQrCodeIds(prev => [...new Set([...prev, ...newQrIds])]);

        const qrTypeMap = JSON.parse(localStorage.getItem("qrTypeMap") || "{}");
        newQrIds.forEach(id => { qrTypeMap[id] = qrType; });
        localStorage.setItem("qrTypeMap", JSON.stringify(qrTypeMap));

        // *** SAVE TEMPLATE FOR EVERY BULK QR ***
        const templateMap = JSON.parse(localStorage.getItem("templateMap") || "{}");
        newQrIds.forEach(id => { templateMap[id] = selectedTemplate; });
        localStorage.setItem("templateMap", JSON.stringify(templateMap));

        toast.success(`Generated ${bulkData.length} QR codes!`);
        if (bulkData.length > 0) {
          setGeneratedQrData({
            scan_url: bulkData[0].scan_url || `${import.meta.env.VITE_SCAN_URL}/qr/${businessId}/${bulkData[0].id}`,
            label: bulkData[0].label
          });
        }
      }

      /* ---------- SINGLE ---------- */
      else {
        const productOrServiceId = `${qrName.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
        const payload = {
          label: qrName.trim(),
          type: apiType,
          productOrServiceId,
          qrcode_tags: tags.map(t => t.trim()).filter(t => t),
          description: description?.trim() || undefined,
          categoryId,
        };
        if (shouldIncludeRoomRange) {
          if (startRange.trim()) payload.room_start = startRange.trim();
          if (endRange.trim()) payload.room_end = endRange.trim();
        }

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/v1/qrcode/generate`,
          payload,
          { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
        );

        const qrData = response.data.data;
        setQrCodeIds(prev => [...new Set([...prev, qrData.id])]);

        const qrTypeMap = JSON.parse(localStorage.getItem("qrTypeMap") || "{}");
        qrTypeMap[qrData.id] = qrType;
        localStorage.setItem("qrTypeMap", JSON.stringify(qrTypeMap));

        // *** SAVE TEMPLATE FOR SINGLE QR ***
        const templateMap = JSON.parse(localStorage.getItem("templateMap") || "{}");
        templateMap[qrData.id] = selectedTemplate;
        localStorage.setItem("templateMap", JSON.stringify(templateMap));

        toast.success("QR code generated!");
        setGeneratedQrData({
          scan_url: qrData.scan_url || `${import.meta.env.VITE_SCAN_URL}/qr/${businessId}/${qrData.id}`,
          label: qrData.label
        });
      }

      setTimeout(() => setActiveTab("manage"), 1500);
    } catch (err) {
      const msg = err.response?.data?.message || "Operation failed.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
      setQrName("");
      setDescription("");
      setTags([]);
      setStartRange("");
      setEndRange("");
    }
  };

  const filteredQrCodes = filterType === "all" ? qrCodes : qrCodes.filter(c => c.type === filterType);

  return (
    <div className="min-h-screen bg-slate-50">
      <BusinessHeader onLogout={() => { localStorage.clear(); navigate("/businessAuth"); }} isLoggingOut={isLoading} />
      <ToastContainer />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <HeaderSection />
        <div className="mt-4 rounded-xl border border-slate-200 bg-white overflow-hidden">
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
          {activeTab === "create" ? (
            isCategoryLoading ? <LoadingState /> : !categoryId ? <div className="p-6 text-red-500">Category error.</div> : (
              <div className="flex flex-col lg:flex-row p-4 sm:p-6 gap-6">
                <div className="flex-1 space-y-8">
                  <CreateTab
                    qrType={qrType} setQrType={setQrType}
                    qrName={qrName} setQrName={setQrName}
                    description={description} setDescription={setDescription}
                    tagInput={tagInput} setTagInput={setTagInput}
                    tags={tags} setTags={setTags}
                    isTagsLoading={isTagsLoading}
                    primaryColor={primaryColor} setPrimaryColor={setPrimaryColor}
                    allowImages={allowImages} setAllowImages={setAllowImages}
                    isLoading={isLoading} handleCreateQR={handleCreateQR}
                    tagInputRef={tagInputRef} editingId={editingId}
                    businessCategory={businessCategory} hasHotelRoomKeywords={hasHotelRoomKeywords}
                    startRange={startRange} setStartRange={setStartRange}
                    endRange={endRange} setEndRange={setEndRange}
                  />
                </div>
                <div className="flex-1 space-y-4">
                  <PreviewSection
                    ref={previewRef}
                    generatedQrData={generatedQrData}
                    generatedUrl={generatedQrData?.scan_url || ""}
                    copyUrl={copyUrl}
                    copied={copied}
                    downloadFullDesign={downloadFullDesign}
                    printFullDesign={printFullDesign}
                    shareQR={shareQR}
                    businessName={businessName}
                    selectedTemplate={selectedTemplate}
                    setSelectedTemplate={setSelectedTemplate}
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
      <QRModal showModal={showModal} setShowModal={setShowModal} modalCanvasRef={modalCanvasRef} generatedQrData={generatedQrData} primaryColor={primaryColor} />
    </div>
  );
}
