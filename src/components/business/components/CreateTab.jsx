import { Plus, X, Loader2, Target, Package, Wrench, MapPin } from "lucide-react";

export function CreateTab({
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
  businessCategory,
  hasHotelRoomKeywords,
  startRange,
  setStartRange,
  endRange,
  setEndRange,
}) {
  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };
 const isHotel = businessCategory && (
    businessCategory.toLowerCase() === "hotel" || 
    businessCategory.toLowerCase() === "hotels"
  );
  const showRoomRange = isHotel && hasHotelRoomKeywords(qrName);

  const qrTypes = [
    { value: "general", label: "General", icon: Target },
    { value: "product", label: "Product", icon: Package },
    { value: "service", label: "Service", icon: Wrench },
    { value: "location", label: "Location", icon: MapPin },
  ];

  return (
    <div className="space-y-8">
      {/* QR Code Type Selection */}
      <div>
        <h3 className="text-base font-semibold text-slate-900 mb-3">
          QR Code Type
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {qrTypes.map((type) => {
            const IconComponent = type.icon;
            return (
              <button
                key={type.value}
                type="button"
                onClick={() => setQrType(type.value)}
                disabled={isLoading}
                className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                  qrType === type.value
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              >
                <IconComponent className="w-6 h-6 mb-2" strokeWidth={1.5} />
                <span className="text-sm font-medium">{type.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Basic Information */}
      <div>
        <h3 className="text-base font-semibold text-slate-900 mb-3">
          Basic Information
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              QR Code Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={qrName}
              onChange={(e) => setQrName(e.target.value)}
              placeholder="e.g., Restaurant Menu, Product Info, Hotel Room 205"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
              disabled={isLoading}
            />
            {qrName.trim() === "" && (
              <p className="mt-1 text-xs text-slate-500">
                Give your QR code a descriptive name
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of what this QR code is for"
              rows={3}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 resize-none transition-all disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
              disabled={isLoading}
            />
            <p className="mt-1 text-xs text-slate-500">
              {description.length}/500 characters
            </p>
          </div>

          {/* Hotel Room Range Input - Conditional */}
      {/* Hotel Room Range Input - Conditional */}
{showRoomRange && (
  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-4 shadow-sm mb-4">
    <div className="flex items-center gap-2 mb-3">
      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
        <MapPin className="w-5 h-5 text-white" strokeWidth={2} />
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-900">
          Room Number Range
        </label>
        <p className="text-xs text-slate-600">
          Generate QR codes for multiple rooms
        </p>
      </div>
    </div>
    
    <div className="flex gap-3 mb-2">
      <div className="flex-1">
        <label className="block text-xs font-medium text-slate-700 mb-1">
          Start Room
        </label>
        <input
          type="number"
          value={startRange}
          onChange={(e) => setStartRange(e.target.value)}
          placeholder="e.g., 101"
          min="1"
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all disabled:bg-slate-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        />
      </div>
      <div className="flex items-end pb-2">
        <span className="text-slate-400 font-medium">→</span>
      </div>
      <div className="flex-1">
        <label className="block text-xs font-medium text-slate-700 mb-1">
          End Room
        </label>
        <input
          type="number"
          value={endRange}
          onChange={(e) => setEndRange(e.target.value)}
          placeholder="e.g., 150"
          min="1"
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all disabled:bg-slate-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        />
      </div>
    </div>
    
    <div className="flex items-start gap-2 mt-3 p-2 bg-white/50 rounded">
      <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
        <span className="text-blue-600 text-xs font-bold">i</span>
      </div>
      <p className="text-xs text-slate-700 leading-relaxed">
        <strong>Bulk Generation:</strong> Enter a range to automatically generate individual QR codes for each room number. Maximum 100 rooms per batch.
      </p>
    </div>
    
    {startRange && endRange && (
      <>
        {(() => {
          const start = parseInt(startRange);
          const end = parseInt(endRange);
          const count = !isNaN(start) && !isNaN(end) && start <= end ? end - start + 1 : 0;
          
          return count > 0 ? (
            <div className={`mt-3 p-2 border rounded text-xs ${
              count > 100 
                ? 'bg-red-50 border-red-200 text-red-700' 
                : 'bg-green-50 border-green-200 text-green-700'
            }`}>
              <span className="font-medium">
                {count > 100 ? '⚠️ Too many rooms!' : '✓ Ready to generate:'}
              </span> {count} QR code{count !== 1 ? 's' : ''} (Rooms {start} - {end})
              {count > 100 && <div className="mt-1">Please reduce the range to 100 rooms or less.</div>}
            </div>
          ) : (
            <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-700">
              <span className="font-medium">⚠️ Invalid range:</span> Start must be less than or equal to end
            </div>
          );
        })()}
      </>
    )}
  </div>
)}
        </div>
        
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              ref={tagInputRef}
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              placeholder="Add tags (e.g., menu, wifi, payment)"
              className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all disabled:bg-slate-50 disabled:cursor-not-allowed"
              disabled={isLoading || isTagsLoading}
            />
            <button
              type="button"
              onClick={handleAddTag}
              disabled={!tagInput.trim() || isLoading || isTagsLoading}
              className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 text-sm font-medium shadow-sm hover:shadow disabled:shadow-none"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>

          {isTagsLoading ? (
            <div className="flex items-center justify-center py-6 bg-slate-50 rounded-lg border border-slate-200">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              <span className="ml-2 text-sm text-slate-600">Loading tags...</span>
            </div>
          ) : tags.length > 0 ? (
            <div className="min-h-[60px] p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={`${tag}-${index}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200 hover:bg-blue-100 transition-colors"
                  >
                    <span className="text-blue-600">#</span>
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      disabled={isLoading}
                      className="hover:bg-blue-200 rounded-full p-0.5 transition-colors disabled:cursor-not-allowed ml-1"
                      aria-label={`Remove ${tag} tag`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-6 bg-slate-50 rounded-lg border border-dashed border-slate-300">
              <div className="text-center">
                <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Plus className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-sm text-slate-600 font-medium">No tags added yet</p>
                <p className="text-xs text-slate-500 mt-1">
                  Add at least one tag to continue
                </p>
              </div>
            </div>
          )}
          
          <p className="text-xs text-slate-500">
            <span className="font-medium">Tip:</span> Press Enter to quickly add tags
          </p>
        </div>
      </div>

      {/* Customization */}
      <div>
        <h3 className="text-base font-semibold text-slate-900 mb-3">
          Customization
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Primary Color
            </label>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="h-11 w-20 rounded-lg border-2 border-slate-300 cursor-pointer transition-all hover:border-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isLoading}
                />
                <div 
                  className="absolute inset-0 rounded-lg pointer-events-none ring-2 ring-transparent"
                  style={{ backgroundColor: primaryColor, opacity: 0.1 }}
                />
              </div>
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                placeholder="#0E5FD8"
                maxLength={7}
                className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 font-mono transition-all disabled:bg-slate-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setPrimaryColor("#0E5FD8")}
                disabled={isLoading}
                className="px-3 py-2.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                Reset
              </button>
            </div>
            <p className="mt-1.5 text-xs text-slate-500">
              This color will be used in your QR code design
            </p>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-slate-900">Allow Image Uploads</p>
                {allowImages && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Users can upload images when scanning this QR code
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAllowImages(!allowImages)}
              disabled={isLoading}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 ${
                allowImages ? "bg-blue-600" : "bg-slate-300"
              } ${isLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer"} hover:shadow-md`}
              aria-label="Toggle image uploads"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 shadow-sm ${
                  allowImages ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <div className="pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={handleCreateQR}
          disabled={isLoading || !qrName.trim() || tags.length === 0}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3.5 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:shadow-none transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>{editingId ? "Updating QR Code..." : "Generating QR Code..."}</span>
            </>
          ) : (
            <>
              <span>{editingId ? "Update QR Code" : "Generate QR Code"}</span>
              {!editingId && <span className="text-blue-200">→</span>}
            </>
          )}
        </button>
        
        {(!qrName.trim() || tags.length === 0) && !isLoading && (
          <div className="mt-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded px-3 py-2">
            <span className="font-medium">Required:</span> QR code name and at least one tag
          </div>
        )}
      </div>
    </div>
  );
}