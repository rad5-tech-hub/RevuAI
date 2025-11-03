// components/Preview.jsx
import React, { useEffect, useState } from "react";
import QRCodeLib from "qrcode";
import { QrCode, Check, Copy, Download, Printer, Share2 } from "lucide-react";

const TEMPLATES = {
  room: { title: "Room", description: "We’d love to know how your stay has been so far.\nPlease share your feedback..." },
  restaurant: { title: "Restaurant", description: "Dining with us at [Hotel Name]?\nTell us how your meal..." },
  bar: { title: "Bar", description: "Hi there!\nWe'd love your thoughts on our drinks and bar service..." },
  lounge: { title: "Lounge", description: "Relaxing at [Hotel Name] Lounge?\nWe'd love to hear..." },
  reception: { title: "Reception", description: "Welcome to [Hotel Name]!\nPlease rate your check-in..." },
  general: { title: "General", description: "We'd love to know about your experience.\nPlease share your feedback..." },
};

export const PreviewSection = React.forwardRef(
  (
    {
      generatedQrData,
      generatedUrl,
      copyUrl,
      copied,
      downloadFullDesign,
      printFullDesign,
      shareQR,
      businessName = "Business Name",
      selectedTemplate = "general",
      setSelectedTemplate,
    },
    ref
  ) => {
    const [imgSrc, setImgSrc] = useState(null);
    const [imgError, setImgError] = useState(false);
    const template = TEMPLATES[selectedTemplate] || TEMPLATES.general;
    const description = template.description.replace(/\[Hotel Name\]/g, businessName);

    useEffect(() => {
      // Helpful debug log — remove later if desired
      console.debug("PreviewSection - generatedQrData keys:", generatedQrData && Object.keys(generatedQrData || {}).length ? generatedQrData : generatedQrData);

      setImgError(false);
      setImgSrc(null);

      if (!generatedQrData) return;

      // Try common possible fields that might carry an image URL from your backend
      const possibleImageKeys = ["qr_image", "image_url", "imageUrl", "qrImage", "image", "qrImg", "qrImageUrl"];
      let found = null;
      for (const k of possibleImageKeys) {
        if (generatedQrData[k]) {
          found = generatedQrData[k];
          break;
        }
      }

      // If we found a direct image URL, use it
      if (found) {
        setImgSrc(found);
        return;
      }

      // If there's an explicit 'scan_url' (link to the QR landing page), generate a QR image from that URL
      const scan = generatedQrData.scan_url || generatedQrData.scanUrl || generatedQrData.scan;
      if (scan && typeof scan === "string" && scan.trim() !== "") {
        // Generate a data URL for the QR code encoding the scan URL
        QRCodeLib.toDataURL(scan, { width: 350, margin: 1, errorCorrectionLevel: "H" })
          .then((dataUrl) => {
            setImgSrc(dataUrl);
          })
          .catch((err) => {
            console.error("PreviewSection: failed to generate QR DataURL from scan_url:", err);
            setImgError(true);
            setImgSrc(null);
          });
        return;
      }

      // Nothing usable found
      setImgSrc(null);
    }, [generatedQrData]);

    // Image onError fallback - logs the failing URL and shows placeholder
    const handleImgError = (e) => {
      console.error("PreviewSection: QR image failed to load:", e?.target?.src);
      setImgError(true);
      setImgSrc(null);
    };

    return (
      <section ref={ref} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-black">Preview</h3>
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            className="text-xs rounded-lg border border-gray-400 bg-white px-3 py-1.5 text-black focus:outline-none focus:ring-2 focus:ring-black transition"
          >
            {Object.entries(TEMPLATES).map(([key, { title }]) => (
              <option key={key} value={key}>{title} Template</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <div
            className="relative mx-auto border border-gray-300 bg-white text-black overflow-y-auto shadow-md w-[min(100%,148mm)] max-w-full h-[calc(min(100vw,148mm)*1.414)] p-[clamp(8px,2.5vw,12mm)] box-border font-sans"
            style={{ minWidth: "148mm" }}
          >
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                 style={{ backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)", backgroundSize: "18px 18px" }} />

            <div className="relative z-10 flex flex-col items-center justify-between h-full text-center">
              <h1 className="text-3xl font-bold text-[#0E5FD8] tracking-wide">{businessName}</h1>

              <p className="text-sm leading-relaxed whitespace-pre-line max-w-[80%] my-6 md:my-4">
                <span className="font-bold text-base text-[#0E5FD8]">Welcome to {businessName}!{"\n"}</span>
                {description}
              </p>

              <p className="font-bold text-center">Scan Me!!</p>
              <div className="flex items-center justify-center border-2 border-black rounded-lg bg-white h-[240px] w-[240px]">
                {imgSrc && !imgError ? (
                  // Note: no crossOrigin attr to avoid silent CORS failures
                  <img src={imgSrc} alt="QR Code" className="w-full h-full object-contain" onError={handleImgError} />
                ) : (
                  <QrCode className="w-20 h-20 text-gray-600" />
                )}
              </div>

              <div className="w-full border-t border-gray-300 pt-4 mt-6 mx-auto max-w-[75%]">
                <h3 className="text-[clamp(1rem,4vw,1.125rem)] font-bold mb-3">How to Use</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 md:gap-3 text-[clamp(0.75rem,2.8vw,0.875rem)]">
                  <div className="space-y-1 text-left">
                    <p><span className="font-bold">1.</span> Open your camera or Google Lens</p>
                    <p><span className="font-bold">2.</span> Scan the code</p>
                    <p><span className="font-bold">3.</span> Give your feedback</p>
                  </div>
                  <div className="space-y-1 text-left">
                    <p><span className="font-bold">4.</span> Sign up to get a reply</p>
                    <p><span className="font-bold">5.</span> And you’re done!</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-300 text-[clamp(0.65rem,2.5vw,0.75rem)] text-gray-600">
                Powered by <span className="font-semibold text-[#0E5FD8]">ScanRevuAI.com</span>
              </div>
            </div>

            {["top-6 left-6", "top-6 right-6", "bottom-6 left-6", "bottom-6 right-6"].map((pos) => (
              <div key={pos} className={`absolute ${pos} flex gap-1`}>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-[clamp(0.35rem,1vw,0.375rem)] h-[clamp(0.35rem,1vw,0.375rem)] rounded-full bg-gray-400 opacity-50" />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <div className="text-xs font-medium text-black mb-1">Generated URL:</div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input readOnly value={generatedUrl || ""} placeholder="No URL generated yet" className="flex-1 rounded border border-gray-400 bg-gray-50 px-3 py-2 text-xs text-black" />
            <button onClick={copyUrl} disabled={!generatedUrl} className="flex items-center justify-center gap-1.5 border border-gray-400 px-3 py-2 rounded text-xs font-medium text-black hover:bg-gray-50 disabled:opacity-50 transition">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button onClick={() => downloadFullDesign(ref.current, businessName)} disabled={!generatedUrl} className="flex items-center justify-center gap-1.5 border border-gray-400 px-2 py-2 rounded text-xs font-medium text-black hover:bg-gray-50 disabled:opacity-50 transition">
              <Download className="w-4 h-4" /> PNG
            </button>
            <button onClick={() => printFullDesign(ref.current)} disabled={!generatedUrl} className="flex items-center justify-center gap-1.5 border border-gray-400 px-2 py-2 rounded text-xs font-medium text-black hover:bg-gray-50 disabled:opacity-50 transition">
              <Printer className="w-4 h-4" /> Print
            </button>
            <button onClick={() => shareQR(generatedUrl, generatedQrData?.label || "QR Code")} disabled={!generatedUrl} className="flex items-center justify-center gap-1.5 border border-gray-400 px-2 py-2 rounded text-xs font-medium text-black hover:bg-gray-50 disabled:opacity-50 transition">
              <Share2 className="w-4 h-4" /> Share
            </button>
          </div>
        </div>
      </section>
    );
  }
);

PreviewSection.displayName = "PreviewSection";
export default PreviewSection;
