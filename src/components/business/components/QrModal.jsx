import { X, Copy, Download } from "lucide-react";
import { useEffect, useRef } from "react";

export const QRModal = ({ showModal, setShowModal, modalCanvasRef, generatedQrData, primaryColor, copyUrl }) => {
  const modalRef = useRef(null); // Ref to track modal content

  // Handle key press (any key closes the modal)
  useEffect(() => {
    const handleKeyPress = () => setShowModal(false);
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [setShowModal]);

  // Handle click outside modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowModal]);

  // Render QR code on canvas
  useEffect(() => {
    if (showModal && modalCanvasRef.current && generatedQrData?.scan_url) {
      // console.log("Rendering QR code with scan_url:", generatedQrData.scan_url); // Debug log
      modalCanvasRef.current.innerHTML = ""; // Clear canvas to prevent stale content
      const canvas = modalCanvasRef.current;
      import("qrcode").then((QRCode) => {
        QRCode.toCanvas(canvas, generatedQrData.scan_url, {
          width: 400, // Larger size for better scannability
          height: 400,
          color: { dark: primaryColor, light: "#ffffff" },
          errorCorrectionLevel: "H",
        }, (error) => {
          if (error) {
            console.error("Modal QRCode error:", error);
            import("react-toastify").then(({ toast }) => {
              toast.error("Failed to generate modal QR code.", {
                position: "top-right",
                autoClose: 3000,
              });
            });
            canvas.innerHTML = "<p class='text-red-500 text-center'>Failed to load QR code</p>";
          } else {
            console.log("QR code rendered successfully");
          }
        });
      }).catch((err) => {
        console.error("Failed to import qrcode library:", err);
        import("react-toastify").then(({ toast }) => {
          toast.error("Failed to load QR code library.", {
            position: "top-right",
            autoClose: 3000,
          });
        });
      });
    }
  }, [showModal, generatedQrData, primaryColor]);

  // Clean up canvas on unmount
  useEffect(() => {
    return () => {
      if (modalCanvasRef.current) {
        modalCanvasRef.current.innerHTML = "";
      }
    };
  }, []);

  // Handle copy URL
  const handleCopyUrl = async () => {
    if (!generatedQrData?.scan_url) {
      console.warn("No scan_url available for copying");
      import("react-toastify").then(({ toast }) => {
        toast.error("No URL available to copy.", {
          position: "top-right",
          autoClose: 3000,
        });
      });
      return;
    }
    try {
      await copyUrl(generatedQrData.scan_url); // Call the passed copyUrl function
      console.log("URL copied successfully:", generatedQrData.scan_url);
    } catch (error) {
      console.error("Copy URL error:", error);
      import("react-toastify").then(({ toast }) => {
        toast.error("Failed to copy URL. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
      });
    }
  };

  // Handle download
  const handleDownload = () => {
    if (!generatedQrData?.scan_url) {
      console.warn("No scan_url available for download");
      import("react-toastify").then(({ toast }) => {
        toast.error("No QR code available to download.", {
          position: "top-right",
          autoClose: 3000,
        });
      });
      return;
    }
    import("qrcode").then((QRCode) => {
      QRCode.toDataURL(generatedQrData.scan_url, {
        width: 400,
        height: 400,
        color: { dark: primaryColor, light: "#ffffff" },
        errorCorrectionLevel: "H",
      }, (error, url) => {
        if (error) {
          console.error("QRCode download error:", error);
          import("react-toastify").then(({ toast }) => {
            toast.error("Failed to download QR code.", {
              position: "top-right",
              autoClose: 3000,
            });
          });
          return;
        }
        // console.log("Download URL generated:", url);
        const link = document.createElement("a");
        link.href = url;
        link.download = `qr_${generatedQrData?.label || "code"}.png`;
        document.body.appendChild(link); // Append to body to ensure click works
        link.click();
        document.body.removeChild(link); // Clean up
      });
    }).catch((err) => {
      console.error("Failed to import qrcode library for download:", err);
      import("react-toastify").then(({ toast }) => {
        toast.error("Failed to load QR code library.", {
          position: "top-right",
          autoClose: 3000,
        });
      });
    });
  };

  if (!showModal || !generatedQrData?.scan_url) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
      role="dialog"
      aria-labelledby="qr-modal-title"
      aria-modal="true"
    >
      <div ref={modalRef} className="bg-white rounded-xl p-4 sm:p-6 max-w-[90%] sm:max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 id="qr-modal-title" className="text-lg sm:text-xl font-semibold text-slate-700">
            Scan QR Code
          </h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-slate-500 cursor-pointer hover:text-slate-700 transition"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex justify-center">
          <canvas
            ref={modalCanvasRef}
            className="rounded-lg border border-slate-300"
            style={{ background: "white" }}
          />
        </div>
        <div className="mt-3 text-sm text-slate-600 text-center">
          Scan this QR code with your device
        </div>
        <div className="mt-4 flex justify-center gap-3">
          <button
            onClick={handleCopyUrl}
            className="inline-flex items-center cursor-pointer justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm hover:bg-slate-50 transition"
          >
            <Copy className="h-4 w-4" /> Copy URL
          </button>
          <button
            onClick={handleDownload}
            className="inline-flex items-center cursor-pointer justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm hover:bg-slate-50 transition"
          >
            <Download className="h-4 w-4" /> Download
          </button>
        </div>
      </div>
    </div>
  );
};
