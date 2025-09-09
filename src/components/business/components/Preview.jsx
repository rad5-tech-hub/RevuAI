import { QrCode, Check, Copy, Download, Printer, Share2 } from "lucide-react";

export const PreviewSection = ({
  generatedQrData,
  qrRef,
  primaryColor,
  generatedUrl,
  copyUrl,
  copied,
  downloadPNG,
  printQR,
  shareQR,
  setShowModal,
}) => (
  <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
    <div className="text-sm font-semibold text-slate-700">Preview</div>
    <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 min-h-[300px] flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div
          ref={qrRef}
          onClick={() => generatedQrData?.scan_url && setShowModal(true)}
          className="flex items-center justify-center rounded-2xl cursor-pointer"
          style={{
            width: 160,
            height: 160,
            background: "white",
            border: "1px solid #E5E7EB",
            boxShadow: "0 1px 0 rgba(0,0,0,0.02)",
          }}
        >
          {!generatedQrData?.scan_url && <QrCode className="h-16 w-16" style={{ color: primaryColor }} />}
        </div>
        <div className="mt-3 text-[13px] font-medium text-slate-600">QR Code Preview</div>
        <div className="mt-1 text-[12px] text-slate-500 text-center max-w-[520px] truncate">
          {generatedUrl || "Generate a QR code to see the preview URL"}
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
          disabled={!generatedUrl}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm hover:bg-slate-50 disabled:opacity-50"
          aria-label={copied ? "URL Copied" : "Copy URL"}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
        <button
          onClick={downloadPNG}
          disabled={!generatedUrl}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm hover:bg-slate-50 disabled:opacity-50"
          aria-label="Download QR Code as PNG"
        >
          <Download className="h-4 w-4" /> PNG
        </button>
        <button
          onClick={printQR}
          disabled={!generatedUrl}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm hover:bg-slate-50 disabled:opacity-50"
          aria-label="Print QR Code"
        >
          <Printer className="h-4 w-4" /> Print
        </button>
        <button
          onClick={() => shareQR(generatedUrl, generatedQrData?.label || "QR Code")}
          disabled={!generatedUrl}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm hover:bg-slate-50 disabled:opacity-50"
          aria-label="Share QR Code"
        >
          <Share2 className="h-4 w-4" /> Share
        </button>
      </div>
    </div>
  </section>
);