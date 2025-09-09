
import { Eye, Plus, Settings, Share2 } from "lucide-react";

// ManageTab Component
export const ManageTab = ({ filteredQrCodes, isFetching, setActiveTab, viewQR, editQR, shareQR, filterType, setFilterType }) => (
  <div className="p-4 sm:p-6 lg:p-8">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
        <h2 className="font-medium text-lg sm:text-xl text-slate-800">Your QR Codes ({filteredQrCodes.length})</h2>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="w-full sm:w-auto rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm sm:text-base text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <option value="all">All Types</option>
          <option value="general">General Business</option>
          <option value="product">Specific Product</option>
          <option value="location">Location/Area</option>
          <option value="service">Service Type</option>
        </select>
      </div>
      <button
        onClick={() => setActiveTab("create")}
        className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-1 text-sm sm:text-base font-medium hover:bg-blue-700 transition"
        aria-label="Create New QR Code"
      >
        <Plus className="h-4 w-4" />
        Create New
      </button>
    </div>
    {isFetching && filteredQrCodes.length === 0 ? (
      <div className="space-y-4 sm:space-y-6" aria-busy="true" aria-label="Loading QR codes">
        {[1, 2, 3].map((i) => (
          <div
            key={`qr-skeleton-${i}`}
            className="bg-white shadow-sm sm:shadow-md rounded-lg sm:rounded-xl p-4 sm:p-6 space-y-4 border border-slate-200"
          >
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="h-6 sm:h-7 w-40 sm:w-48 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-5 sm:h-6 w-16 sm:w-20 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="h-5 sm:h-6 w-16 sm:w-20 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
            <div className="h-4 sm:h-5 w-28 sm:w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="flex flex-wrap gap-2 sm:gap-4">
              <div className="h-8 sm:h-10 w-20 sm:w-24 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-8 sm:h-10 w-20 sm:w-24 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-8 sm:h-10 w-20 sm:w-24 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    ) : filteredQrCodes.length === 0 ? (
      <div className="text-center py-8 sm:py-12 text-slate-500 text-sm sm:text-base">
        No QR codes found for this type. Try creating a new one!
      </div>
    ) : (
      <div className="space-y-4 sm:space-y-6">
        {filteredQrCodes.map((code) => (
          <div
            key={code.id}
            className="bg-white shadow-sm sm:shadow-md rounded-lg sm:rounded-xl p-4 sm:p-6 border border-slate-200 min-w-0"
          >
            <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-2 sm:gap-3">
              <h3 className="text-base sm:text-lg font-semibold text-slate-800 truncate">{code.title}</h3>
              <div className="flex flex-wrap gap-2">
                <span
                  className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-medium ${
                    code.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {code.status.charAt(0).toUpperCase() + code.status.slice(1)}
                </span>
                <span
                  className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {code.type.charAt(0).toUpperCase() + code.type.slice(1)}
                </span>
              </div>
            </div>
            <div className="mt-2 text-sm sm:text-base text-slate-600 truncate">
              {code.businessName} • {code.categoryName} • {code.feedback} Feedback • Created {code.date}
            </div>
            <div className="mt-4 flex flex-wrap gap-2 sm:gap-4">
              <button
                onClick={() => viewQR(code)}
                className="inline-flex items-center gap-1 sm:gap-2 rounded-lg border border-slate-300 bg-white px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm hover:bg-slate-50 transition"
                aria-label={`View QR code for ${code.title}`}
              >
                <Eye className="h-3.5 sm:h-4 w-3.5 sm:w-4" /> View
              </button>
              <button
                onClick={() => editQR(code)}
                className="inline-flex items-center gap-1 sm:gap-2 rounded-lg border border-slate-300 bg-white px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm hover:bg-slate-50 transition"
                aria-label={`Edit QR code for ${code.title}`}
              >
                <Settings className="h-3.5 sm:h-4 w-3.5 sm:w-4" /> Edit
              </button>
              <button
                onClick={() => shareQR(code.url, code.title)}
                className="inline-flex items-center gap-1 sm:gap-2 rounded-lg border border-slate-300 bg-white px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm hover:bg-slate-50 transition"
                aria-label={`Share QR code for ${code.title}`}
              >
                <Share2 className="h-3.5 sm:h-4 w-3.5 sm:w-4" /> Share
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);