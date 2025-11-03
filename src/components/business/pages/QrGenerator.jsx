  import { useState, useEffect, useRef } from "react";
  import { useNavigate } from "react-router-dom";
  import { toast, ToastContainer } from "react-toastify";
  import "react-toastify/dist/ReactToastify.css";
  import axios from "axios";
  import QRCode from "qrcode";
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
    const [businessCategory, setBusinessCategory] = useState("");
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

    // Fetch business profile to get category
    useEffect(() => {
      const fetchBusinessProfile = async () => {
        const token = localStorage.getItem("authToken");
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/v1/business/profile`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const category = response.data.profile?.category || "";
          setBusinessCategory(category);
        } catch (err) {
          toast.error("Failed to load business category. Room range feature may not work.", {
            position: "top-right",
            autoClose: 5000,
          });
        }
      };
      fetchBusinessProfile();
    }, []);

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
            setQrCodes([]);
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
      const shareData = {
        title: `QR Code for ${title}`,
        text: `Scan this QR code to access ${title}`,
        url: url,
      };
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        try {
          await navigator.share(shareData);
          toast.success("QR code shared successfully!", {
            position: "top-right",
            autoClose: 3000,
          });
        } catch (error) {
          console.error("Web Share API error:", error);
          await copyUrl();
        }
      } else {
        try {
          await copyUrl();
          toast.info(
            "Web Share not supported. URL copied to clipboard. Paste it to share.",
            {
              position: "top-right",
              autoClose: 5000,
            }
          );
        } catch (error) {
          console.error("Clipboard copy error in shareQR:", error);
          toast.error(
            "Sharing not supported. Please copy the URL manually from the input field.",
            {
              position: "top-right",
              autoClose: 5000,
            }
          );
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
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/qrcode/qrcode/${code.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const qrData = response.data.qr || {};
        const qrTypeMap = JSON.parse(localStorage.getItem("qrTypeMap") || "{}");
        setQrType(qrTypeMap[code.id] || (qrData.type === "Product" ? "product" : qrData.type === "Service" ? "service" : "general"));
        setQrName(qrData.label || "");
        setDescription(qrData.description || "");
        setTags(Array.isArray(qrData.qrcode_tags) ? qrData.qrcode_tags : []);
        setStartRange(qrData.room_start || "");
        setEndRange(qrData.room_end || "");
        setEditingId(code.id);
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
          toast.error("Please provide both start and end room numbers.", {
            position: "top-right",
            autoClose: 3000,
          });
          return;
        }
        
        if (isNaN(start) || isNaN(end)) {
          toast.error("Room numbers must be valid numbers.", {
            position: "top-right",
            autoClose: 3000,
          });
          return;
        }
        
        if (start > end) {
          toast.error("Start room number must be less than or equal to end room number.", {
            position: "top-right",
            autoClose: 3000,
          });
          return;
        }
        
        const totalRooms = end - start + 1;
        if (totalRooms > 500) {
          toast.error("Maximum 500 rooms can be generated at once. Please reduce the range.", {
            position: "top-right",
            autoClose: 5000,
          });
          return;
        }
      }

      const isBulkGeneration = shouldIncludeRoomRange && startRange.trim() && endRange.trim();

      setIsLoading(true);

      // Declare bulk vars in scope for catch
      let start, end, totalRooms, roomPayloads = [];

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

        if (editingId) {
          const payload = {
            label: qrName.trim(),
            type: apiType,
            qrcode_tags: tags.map((tag) => tag.trim()).filter((tag) => tag !== ""),
            description: description?.trim() || undefined,
          };
          
          if (shouldIncludeRoomRange) {
            if (startRange.trim()) payload.room_start = startRange.trim();
            if (endRange.trim()) payload.room_end = endRange.trim();
          }
          
          const response = await axios.put(
            `${import.meta.env.VITE_API_URL}/api/v1/qrcode/edit-qrcode/${editingId}`,
            payload,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          
          const qrData = response.data.data || {};
          setEditingId(null);
          toast.success("QR code updated successfully!", {
            position: "top-right",
            autoClose: 3000,
          });
          
          const constructedScanUrl = `${import.meta.env.VITE_SCAN_URL}/qr/${businessId || qrData.businessId}/${qrData.id}`;
          setGeneratedQrData({
            ...qrData,
            scan_url: constructedScanUrl,
          });
          
          setTimeout(() => {
            setActiveTab("manage");
          }, 1500);

        
  } else if (isBulkGeneration) {
    // BULK GENERATION — Backend handles room iteration
    start = parseInt(startRange.trim());
    end = parseInt(endRange.trim());
    totalRooms = end - start + 1;

    toast.info(`Generating ${totalRooms} QR codes for rooms ${start} to ${end}...`, {
      position: "top-right",
      autoClose: 3000,
    });

    // Backend expects a SINGLE object with startRange/endRange, not an array
    const bulkPayload = {
      label: qrName.trim(), // Base label (e.g., "Room")
      type: apiType,
      productOrServiceId: "H001",
      qrcode_tags: tags.map((tag) => tag.trim()).filter((tag) => tag !== ""),
      description: description?.trim() || "QR code for hotel room for guests to give feedback",
      categoryId,
      startRange: start,  // ← Send as integers
      endRange: end,      // ← Backend will loop and create rooms
    };

    console.log("Sending bulk generation request:", bulkPayload);

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/v1/qrcode/generate`,
      bulkPayload, // ← Single object, NOT { data: [...] }
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const bulkData = response.data.data || [];
    const totalCreated = response.data.totalCreated || bulkData.length;

    // Extract IDs and store them
    const newQrIds = bulkData.map(qr => qr.id).filter(id => id);
    setQrCodeIds((prev) => [...new Set([...prev, ...newQrIds])]);

    // Store QR type mapping
    const qrTypeMap = JSON.parse(localStorage.getItem("qrTypeMap") || "{}");
    newQrIds.forEach(id => {
      qrTypeMap[id] = qrType;
    });
    localStorage.setItem("qrTypeMap", JSON.stringify(qrTypeMap));

    toast.success(
      `Successfully generated ${totalCreated} QR code${totalCreated !== 1 ? 's' : ''} for rooms ${start} to ${end}!`,
      {
        position: "top-right",
        autoClose: 5000,
      }
    );

    // Show preview of first QR code
    if (bulkData.length > 0) {
      setGeneratedQrData({
        ...bulkData[0],
        scan_url: bulkData[0].scan_url || `${import.meta.env.VITE_SCAN_URL}/qr/${businessId}/${bulkData[0].id}`,
      });
    }

    // Switch to manage tab after success
    setTimeout(() => {
      setActiveTab("manage");
    }, 2000);
        } else {
          // SINGLE GENERATION — SEND PLAIN OBJECT
          const productOrServiceId = `${qrName.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
          
          const payload = {
            label: qrName.trim(),
            type: apiType,
            productOrServiceId,
            qrcode_tags: tags.map((tag) => tag.trim()).filter((tag) => tag !== ""),
            description: description?.trim() || undefined,
            categoryId,
          };
          
          if (shouldIncludeRoomRange) {
            if (startRange.trim()) payload.room_start = startRange.trim();
            if (endRange.trim()) payload.room_end = endRange.trim();
          }

          
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/v1/qrcode/generate`,
            payload, // ← SINGLE OBJECT
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          
          const qrData = response.data.data || {};
          setQrCodeIds((prev) => [...new Set([...prev, qrData.id])]);
          const qrTypeMap = JSON.parse(localStorage.getItem("qrTypeMap") || "{}");
          qrTypeMap[qrData.id] = qrType;
          localStorage.setItem("qrTypeMap", JSON.stringify(qrTypeMap));
          
          toast.success("QR code generated successfully!", {
            position: "top-right",
            autoClose: 3000,
          });
          
          const constructedScanUrl = qrData.scan_url || `${import.meta.env.VITE_SCAN_URL}/qr/${businessId || qrData.businessId}/${qrData.id}`;
          setGeneratedQrData({
            ...qrData,
            scan_url: constructedScanUrl,
          });
          
          setTimeout(() => {
            setActiveTab("manage");
          }, 2000);
        }

        // Reset form
        setQrName("");
        setDescription("");
        setTags([]);
        setStartRange("");
        setEndRange("");

      } catch (error) {
        if (isBulkGeneration) {
          console.error("QR Code operation error (bulk):", {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
            requestBody: { data: roomPayloads },
            fullError: error
          });
        } else {
          console.error("QR Code operation error:", {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
            fullError: error
          });
        }

        if (error.response?.status === 400) {
          const errorMsg = error.response?.data?.message || error.response?.data?.error || "Invalid request data. Please check the input fields and try again.";
          toast.error(errorMsg, {
            position: "top-right",
            autoClose: 5000,
          });
        } else if (error.response?.status === 401) {
          toast.error("Session expired or invalid token. Please log in again.", {
            position: "top-right",
            autoClose: 3000,
          });
          localStorage.removeItem("authToken");
          navigate("/businessAuth");
        } else if (error.response?.status === 404) {
          toast.error("QR code not found or endpoint unavailable. Please verify the QR code ID or contact support.", {
            position: "top-right",
            autoClose: 3000,
          });
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
                      businessCategory={businessCategory}
                      hasHotelRoomKeywords={hasHotelRoomKeywords}
                      startRange={startRange}
                      setStartRange={setStartRange}
                      endRange={endRange}
                      setEndRange={setEndRange}
                    />
                  </div>
                  <div className="flex-1 space-y-4">
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