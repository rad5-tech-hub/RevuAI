import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { Loader2 } from "lucide-react"; // Added missing import

const useQRGenerator = () => {
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

  const isValidUUID = (str) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  };

  useEffect(() => {
    localStorage.setItem("qrCodeIds", JSON.stringify(qrCodeIds));
  }, [qrCodeIds]);

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
            scans: 0,
            feedback: 0,
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

  const handleLogout = async () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("qrCodeIds");
    localStorage.removeItem("qrTypeMap");
    navigate("/businessAuth");
  };

  const filteredQrCodes = filterType === "all" ? qrCodes : qrCodes.filter((code) => code.type === filterType);

  return {
    activeTab,
    setActiveTab,
    isCategoriesLoading,
    handleLogout,
    qrType,
    setQrType,
    qrName,
    setQrName,
    description,
    setDescription,
    allowImages,
    setAllowImages,
    primaryColor,
    setPrimaryColor,
    tagInput,
    setTagInput,
    tags,
    setTags,
    categoryId,
    setCategoryId,
    categories,
    isLoading,
    copied,
    generatedQrData,
    qrCodeIds,
    qrCodes,
    isFetching,
    filterType,
    setFilterType,
    tagInputRef,
    isValidUUID,
    generatedUrl,
    copyUrl,
    handleCreateQR,
    addTag,
    removeTag,
    onTagKeyDown,
    downloadPNG,
    downloadSVG,
    shareQR,
    printQR,
    viewQR,
    editQR,
    filteredQrCodes,
  };
};

export default useQRGenerator;