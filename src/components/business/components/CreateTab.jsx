import { Loader2, Plus, X, QrCode, ImageIcon, Star, Tag } from "lucide-react";

const TypeCard = ({ id, title, desc, icon, qrType, setQrType }) => (
  <button
    onClick={() => setQrType(id)}
    className={`w-full text-left rounded-xl border px-4 sm:px-5 py-4 sm:py-5 transition ${
      qrType === id ? "border-blue-600 ring-2 ring-blue-100 bg-white" : "border-slate-200 hover:border-slate-300 bg-white"
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

export const CreateTab = ({
  qrType,
  setQrType,
  qrName,
  setQrName,
  description,
  setDescription,
  tagInput,
  setTagInput,
  tags,
  setTags,
  isTagsLoading,
  primaryColor,
  setPrimaryColor,
  allowImages,
  setAllowImages,
  isLoading,
  handleCreateQR,
  tagInputRef,
  editingId,
}) => {
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
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const value = tagInput.replace(/,$/, "").trim();
      if (value) {
        addTag(value);
      }
    }
  };

  const handleTagBlur = () => {
    const value = tagInput.replace(/,$/, "").trim();
    if (value) {
      addTag(value);
    }
  };

  const handleAddTagClick = () => {
    const value = tagInput.replace(/,$/, "").trim();
    if (value) {
      addTag(value);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row p-4 sm:p-6 gap-6">
      <div className="min-w-0">
        <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="text-sm font-semibold text-slate-700">1. Choose QR Code Type</div>
          <div className="mt-3 space-y-3">
            <TypeCard
              id="general"
              title="General Business"
              desc="Overall business experience"
              icon={<QrCode className="h-5 w-5" />}
              qrType={qrType}
              setQrType={setQrType}
            />
            <TypeCard
              id="product"
              title="Specific Product"
              desc="Individual product feedback"
              icon={<ImageIcon className="h-5 w-5" />}
              qrType={qrType}
              setQrType={setQrType}
            />
            <TypeCard
              id="service"
              title="Service Type"
              desc="Specific service offering"
              icon={<Star className="h-5 w-5" />}
              qrType={qrType}
              setQrType={setQrType}
            />
            <TypeCard
              id="location"
              title="Location/Area"
              desc="Specific location within business"
              icon={<Tag className="h-5 w-5" />}
              qrType={qrType}
              setQrType={setQrType}
            />
          </div>
        </section>
        <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="text-sm font-semibold text-slate-700">2. Basic Information</div>
          <label className="mt-4 block text-[13px] font-medium text-slate-600">
            QR Code Name<span className="text-blue-600"> *</span>
          </label>
          <input
            value={qrName}
            onChange={(e) => setQrName(e.target.value)}
            placeholder="e.g., Bar, Room Service, Espresso Machine"
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
          />
          <label className="mt-4 block text-[13px] font-medium text-slate-600">
            Description (Optional) <span className="text-slate-500 text-[12px] ml-1">Visible to users</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of what this QR code is for..."
            rows={3}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
          />
          <label className="mt-4 block text-[13px] font-medium text-slate-600">
            Tags customers should review
          </label>
          <div className="mt-1 flex flex-col sm:flex-row gap-2">
            <input
              ref={tagInputRef}
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={onTagKeyDown}
              onBlur={handleTagBlur}
              placeholder="e.g., Food Quality, Cleanliness, Speed, Friendliness"
              className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
              disabled={isTagsLoading}
              inputMode="text"
              autoCapitalize="words"
            />
            <button
              onClick={handleAddTagClick}
              className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm hover:bg-slate-50 transition"
              aria-label="Add Tag"
              disabled={isTagsLoading || !tagInput.trim()}
            >
              <Plus className="h-4 w-4" /> Add
            </button>
          </div>
          {isTagsLoading && (
            <div className="mt-1.5 text-[12px] text-slate-500 flex items-center gap-2">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Loading tags...
            </div>
          )}
          {!isTagsLoading && (
            <div className="mt-1.5 text-[12px] text-slate-500 flex items-center gap-2">
              <Plus className="h-3.5 w-3.5" />
              Type a tag then press Enter, comma, or Add button.
            </div>
          )}
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
        </section>
        <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 mt-3">
          <div className="text-sm font-semibold text-slate-700">3. Customization</div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-[auto_1fr] items-center gap-3">
            <div className="text-[13px] font-medium text-slate-600">QR Code Color</div>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="h-10 w-14 cursor-pointer rounded-md border border-slate-300 bg-white"
                aria-label="Select QR code color"
              />
              <input
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-32 rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm font-mono"
                placeholder="#0E5FD8"
                aria-label="Enter QR code color hex code"
              />
            </div>
          </div>
          {/* <label className="mt-4 flex items-center gap-2 text-[13px]"> */}
            {/* <input
              type="checkbox"
              checked={allowImages}
              onChange={(e) => setAllowImages(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300"
            /> */}
            {/* <span className="text-slate-700">Allow image uploads in feedback</span> */}
          {/* </label> */}
        </section>
        <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-5">
          <button
            onClick={handleCreateQR}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-4 my-3 text-white text-sm font-semibold shadow-sm hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
            disabled={isLoading || !qrName}
            aria-label={editingId ? "Update QR Code" : "Create QR Code"}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {isLoading ? "Processing..." : editingId ? "Update QR Code" : "Create QR Code"}
          </button>
        </div>
      </div>
    </div>
  );
};