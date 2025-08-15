import React, { useMemo, useRef, useState } from "react";
import { QrCode, ChevronDown, Star, Image as ImageIcon, Tag, Copy, Download, Printer, Share2, Eye, Plus, X, Check, Settings } from "lucide-react";
import { Link } from 'react-router-dom';

export default function QRGenerator() {
  const [activeTab, setActiveTab] = useState("create");
  
  // Step 1: QR Code Type
  const [qrType, setQrType] = useState("general");

  // Step 2: Basic Information
  const [qrName, setQrName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("Main Store");
  const [allowImages, setAllowImages] = useState(true);
  const [primaryColor, setPrimaryColor] = useState("#0E5FD8");

  // Tags
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState(["Food Quality", "Customer Service"]);
  const tagInputRef = useRef(null);

  const addTag = (value) => {
    const v = (value ?? tagInput).trim();
    if (!v) return;
    if (tags.some(t => t.toLowerCase() === v.toLowerCase())) {
      setTagInput("");
      return;
    }
    setTags(prev => [...prev, v]);
    setTagInput("");
  };

  const removeTag = (value) => setTags(prev => prev.filter(t => t !== value));

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

  // Derived: Generated URL (mocked for demo)
  const generatedUrl = useMemo(() => {
    const base = "https://scanreview.app/feedback";
    const params = new URLSearchParams();
    params.set("business", "Demo+Coffee+Shop");
    params.set("type", qrType);
    if (qrName) params.set("name", qrName.replace(/\s+/g, "+"));
    return `${base}?${params.toString()}`;
  }, [qrType, qrName]);

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(generatedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  };

  const [copied, setCopied] = useState(false);

  // QR Codes data for Manage Existing tab
  const qrCodes = [
    {
      title: "Main Counter",
      status: "paused",
      type: "business",
      location: "Main Store - Counter",
      scans: 1247,
      feedback: 89,
      date: "2024-12-15",
      url: "https://scanreview.app/feedback?business=Demo%20coffee%20shop&location=main-counter",
    },
    {
      title: "Table Service",
      status: "active",
      type: "business",
      location: "Main Store - Tables",
      scans: 823,
      feedback: 56,
      date: "2024-12-20",
      url: "https://scanreview.app/feedback?business=Demo%20coffee%20shop&location=tables",
    },
    {
      title: "Signature Blend Coffee",
      status: "active",
      type: "product",
      location: "Product - Coffee Bags",
      scans: 342,
      feedback: 23,
      date: "2025-01-05",
      url: "https://scanreview.app/feedback?business=Demo%20coffee%20shop&location=signature-blend-coffee",
    },
  ];

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
        <div className={`mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl ${
          qrType === id ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-600"
        }`}>
          {icon}
        </div>
        <div>
          <div className="text-[15px] sm:text-base font-semibold text-slate-800">{title}</div>
          <div className="text-[13px] sm:text-sm text-slate-500">{desc}</div>
        </div>
      </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top App Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-4">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4 mb-4 lg:mb-0">
              <a href="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 text-white mx-auto bg-blue-500 mr-2 rounded-full flex items-center justify-center">
                  <QrCode />
                </div>
                <span className="text-xl font-bold text-black">RevuAi</span>
              </a>
              <span className="text-gray-500">Business Portal</span>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-wrap gap-2 lg:gap-8 mb-4 lg:mb-0">
              <Link
                to="/businessDashboard"
                className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
              >
                📊 Dashboard
              </Link>
              <Link
                to="/businessFeedback"
                className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"              >
                💬 Feedback
              </Link>
              <Link
                to="#"
                className="px-3 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600 bg-blue-50 rounded-t-md"
              >
                📱 QR Codes
              </Link>
              <Link
                to="/businessReports"
                className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
              >
                📈 Reports
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* Page Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-[22px] sm:text-2xl font-bold text-slate-900">QR Code Generator</h1>
        <p className="mt-1 text-slate-500 text-sm">
          Create and manage QR codes for feedback collection
        </p>

        {/* Tabs */}
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

          {/* Body content */}
          {activeTab === "create" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 sm:p-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* 1. Choose Type */}
                <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
                  <div className="text-sm font-semibold text-slate-700">1. Choose QR Code Type</div>
                  <div className="mt-3 space-y-3">
                    <TypeCard id="general" title="General Business" desc="Overall business experience" icon={<QrCode className="h-5 w-5" />} />
                    <TypeCard id="product" title="Specific Product" desc="Individual product feedback" icon={<ImageIcon className="h-5 w-5" />} />
                    <TypeCard id="location" title="Location/Area" desc="Specific location within business" icon={<Tag className="h-5 w-5" />} />
                    <TypeCard id="service" title="Service Type" desc="Specific service offering" icon={<Star className="h-5 w-5" />} />
                  </div>
                </section>

                {/* 2. Basic Information */}
                <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
                  <div className="text-sm font-semibold text-slate-700">2. Basic Information</div>

                  {/* Name */}
                  <label className="mt-4 block text-[13px] font-medium text-slate-600">QR Code Name<span className="text-blue-600"> *</span></label>
                  <input
                    value={qrName}
                    onChange={(e) => setQrName(e.target.value)}
                    placeholder="e.g., Main Counter, Espresso Machine, Patio Tables"
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                  />

                  {/* Description */}
                  <label className="mt-4 block text-[13px] font-medium text-slate-600">Description (Optional)</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of what this QR code is for..."
                    rows={3}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                  />

                  {/* Location */}
                  <label className="mt-4 block text-[13px] font-medium text-slate-600">Location</label>
                  <div className="relative mt-1">
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                    >
                      <option>Main Store</option>
                      <option>Patio</option>
                      <option>Counter</option>
                      <option>Drive-Thru</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  </div>

                  {/* Expected Review Tags */}
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
                    {/* Helper row */}
                    <div className="mt-1.5 text-[12px] text-slate-500 flex items-center gap-2">
                      <Plus className="h-3.5 w-3.5" />
                      Type a tag then press Enter or comma. Backspace deletes the last tag.
                    </div>

                    {/* Tags List */}
                    {!!tags.length && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {tags.map((t) => (
                          <span key={t} className="group inline-flex items-center gap-1 rounded-full border border-slate-300 bg-slate-50 px-2.5 py-1 text-[12px] text-slate-700">
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

                {/* 3. Customization */}
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

                {/* CTA Row */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-white text-sm font-semibold shadow-sm hover:bg-blue-700">
                    <Plus className="h-4 w-4" />
                    Create QR Code
                  </button>
                  <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-700 text-sm font-semibold hover:bg-slate-50">
                    <Eye className="h-4 w-4" />
                    Preview
                  </button>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Preview */}
                <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
                  <div className="text-sm font-semibold text-slate-700">Preview</div>
                  <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 min-h-[300px] flex items-center justify-center">
                    <div className="flex flex-col items-center">
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
                      <div className="mt-3 text-[13px] font-medium text-slate-600">QR Code Preview</div>
                      <div className="mt-1 text-[12px] text-slate-500 text-center max-w-[520px] truncate">
                        {generatedUrl}
                      </div>
                    </div>
                  </div>

                  {/* Generated URL & Actions */}
                  <div className="mt-4">
                    <div className="text-[13px] font-medium text-slate-700">Generated URL:</div>
                    <div className="mt-1 flex items-center gap-2">
                      <input
                        readOnly
                        value={generatedUrl}
                        className="flex-1 truncate rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"
                      />
                      <button onClick={copyUrl} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm hover:bg-slate-50">
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copied ? "Copied" : "Copy"}
                      </button>
                    </div>

                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm hover:bg-slate-50">
                        <Download className="h-4 w-4" /> PNG
                      </button>
                      <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm hover:bg-slate-50">
                        <Download className="h-4 w-4" /> SVG
                      </button>
                      <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm hover:bg-slate-50">
                        <Printer className="h-4 w-4" /> Print
                      </button>
                      <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm hover:bg-slate-50">
                        <Share2 className="h-4 w-4" /> Share
                      </button>
                    </div>
                  </div>
                </section>

                {/* Usage Tips */}
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
          ) : (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-medium text-lg">
                  Your QR Codes ({qrCodes.length})
                </h2>
                <button 
                  onClick={() => setActiveTab("create")}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-1 text-sm"
                >
                  <Plus className="h-4 w-4" />
                  Create New
                </button>
              </div>

              <div className="space-y-4">
                {qrCodes.map((code) => (
                  <div
                    key={code.title}
                    className="bg-white shadow rounded-lg p-6 space-y-4 border border-slate-200"
                  >
                    {/* Title & Badges */}
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-semibold text-lg text-slate-800">{code.title}</h3>
                      <span className="bg-green-100 text-green-700 text-xs px-2.5 py-1 rounded-full">
                        {code.status}
                      </span>
                      <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-full">
                        {code.type}
                      </span>
                    </div>

                    {/* Location */}
                    <p className="text-slate-600 text-sm">{code.location}</p>

                    {/* Stats */}
                    <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" /> {code.scans} scans
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4" /> {code.feedback} feedback
                      </span>
                      <span>Created {code.date}</span>
                    </div>

                    {/* URL */}
                    <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-700 break-all font-mono">
                      {code.url}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button className="p-2 border rounded-lg hover:bg-slate-50 text-slate-600">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 border rounded-lg hover:bg-slate-50 text-slate-600">
                        <Settings className="w-4 h-4" />
                      </button>
                      <button className="p-2 border rounded-lg hover:bg-slate-50 text-slate-600">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-2 border rounded-lg hover:bg-slate-50 text-slate-600">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}