import { X, Copy, Download, Mail, Twitter, MessageSquare, Linkedin, CheckCircle } from "lucide-react";
import { toast } from "react-toastify";
import QRCode from "qrcode";
import { useRef, useEffect, useState } from "react";

export const ShareModal = ({ isOpen, setIsOpen, url, title, primaryColor }) => {
  const canvasRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [qrImageData, setQrImageData] = useState(null);

  useEffect(() => {
    if (isOpen && canvasRef.current && url) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: 200,
        height: 200,
        color: { dark: primaryColor || "#0E5FD8", light: "#ffffff" },
        errorCorrectionLevel: "H",
        margin: 2,
      }, (error) => {
        if (error) {
          console.error("ShareModal QRCode error:", error);
          toast.error("Failed to generate QR code in share modal.", {
            position: "top-right",
            autoClose: 3000,
          });
        } else {
          // Generate data URL for sharing
          QRCode.toDataURL(url, {
            width: 400,
            height: 400,
            color: { dark: primaryColor || "#0E5FD8", light: "#ffffff" },
            errorCorrectionLevel: "H",
            margin: 2,
          }, (err, dataUrl) => {
            if (!err) {
              setQrImageData(dataUrl);
            }
          });
        }
      });
    }
  }, [isOpen, url, primaryColor]);

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("URL copied to clipboard!", {
        position: "top-right",
        autoClose: 2000,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy URL.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const downloadQRCode = () => {
    if (!qrImageData) {
      toast.error("QR code not ready for download.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    
    const link = document.createElement("a");
    link.href = qrImageData;
    link.download = `${title?.toLowerCase().replace(/\s+/g, '-') || 'qr-code'}.png`;
    link.click();
    toast.success("QR code downloaded!", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  // Handle sharing the QR code URL
  const handleShareQR = async () => {
    if (!url) {
      toast.error("No QR code URL available to share. Please try submitting feedback again.", {
        position: "top-right",
        autoClose: 3000,
      });
      console.error("handleShareQR - No qrCodeUrl available. URL:", url);
      return;
    }
    // Validate URL format
    try {
      new URL(url);
    } catch (error) {
      toast.error("Invalid QR code URL. Please contact support.", {
        position: "top-right",
        autoClose: 3000,
      });
      console.error("handleShareQR - Invalid qrCodeUrl:", url, error);
      return;
    }
    // Use Web Share API if available
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Share QR Code",
          text: "Scan this QR code to provide feedback!",
          url: url,
        });
        toast.success("QR code shared successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("handleShareQR - Web Share API error:", error);
          toast.error("Failed to share QR code. Trying to copy to clipboard.", {
            position: "top-right",
            autoClose: 3000,
          });
          // Fallback to clipboard
          try {
            await navigator.clipboard.writeText(url);
            toast.success("QR code URL copied to clipboard!", {
              position: "top-right",
              autoClose: 3000,
            });
          } catch (clipError) {
            console.error("handleShareQR - Clipboard copy error:", clipError);
            toast.error("Failed to copy QR code URL. Please copy it manually: " + url, {
              position: "top-right",
              autoClose: 5000,
            });
          }
        }
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        toast.success("QR code URL copied to clipboard!", {
          position: "top-right",
          autoClose: 3000,
        });
      } catch (clipError) {
        console.error("handleShareQR - Clipboard copy error:", clipError);
        toast.error("Failed to copy QR code URL. Please copy it manually: " + url, {
          position: "top-right",
          autoClose: 5000,
        });
      }
    }
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`QR Code: ${title}`);
    const body = encodeURIComponent(`Hi there!\n\nI'd like to share this QR code with you for "${title}".\n\nYou can scan the QR code or visit: ${url}\n\nBest regards`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  const shareViaTwitter = async () => {
    const text = encodeURIComponent(`Check out this QR code for "${title}"`);
    window.open(`https://x.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`, "_blank");
  };

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(`Check out this QR code for "${title}": ${url}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const shareViaLinkedIn = () => {
    const text = encodeURIComponent(`QR Code for "${title}"`);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&summary=${text}`, "_blank");
  };

  // Helper function to convert data URL to blob (kept for download functionality)
  const dataURLtoBlob = (dataURL) => {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" role="dialog" aria-labelledby="shareModalTitle">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 id="shareModalTitle" className="text-xl font-semibold text-gray-900">Share QR Code</h2>
            <p className="text-sm text-gray-500 mt-1">Share your feedback QR code</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close share modal"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* QR Code Display */}
        <div className="p-6">
          <div className="flex flex-col items-center">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <canvas 
                ref={canvasRef} 
                className="rounded-lg" 
                style={{ width: 180, height: 180 }} 
              />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">{title}</h3>
            <div className="mt-2 flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 w-full">
              <div className="text-sm text-gray-600 truncate flex-1">{url}</div>
              <button
                onClick={copyUrl}
                className="flex-shrink-0 p-1 hover:bg-white rounded-md transition-colors"
                aria-label="Copy URL"
              >
                {copied ? (
                  <CheckCircle size={16} className="text-green-500" />
                ) : (
                  <Copy size={16} className="text-gray-500" />
                )}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 space-y-3">
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleShareQR}
                className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-4 py-3 font-medium transition-colors"
              >
                <MessageSquare size={18} />
                Share
              </button>
              <button
                onClick={downloadQRCode}
                className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl px-4 py-3 font-medium transition-colors"
              >
                <Download size={18} />
                Download
              </button>
            </div>

            {/* Social Media Options */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Share via</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={shareViaEmail}
                  className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Mail size={16} className="text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Email</span>
                </button>
                
                <button
                  onClick={shareViaWhatsApp}
                  className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left"
                >
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <MessageSquare size={16} className="text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">WhatsApp</span>
                </button>

                <button
                  onClick={shareViaTwitter}
                  className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Twitter size={16} className="text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Twitter</span>
                </button>

                <button
                  onClick={shareViaLinkedIn}
                  className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Linkedin size={16} className="text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">LinkedIn</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};