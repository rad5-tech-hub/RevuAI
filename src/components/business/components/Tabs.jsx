
export const Tabs = ({ activeTab, setActiveTab }) => (
  <div className="flex">
    <button
      onClick={() => setActiveTab("create")}
      className={`flex-1 px-4 py-3 cursor-pointer sm:py-3.5 text-sm font-medium ${
        activeTab === "create" ? "text-blue-700 cursor-pointer bg-blue-50" : "text-slate-600 cursor-pointer hover:bg-slate-50"
      }`}
    >
      Create New QR Code
    </button>
    <button
      onClick={() => setActiveTab("manage")}
      className={`flex-1 px-4 py-3 sm:py-3.5 text-sm cursor-pointer font-medium ${
        activeTab === "manage" ? "text-blue-700 bg-blue-50 cursor-pointer" : " cursor-pointer text-slate-600 hover:bg-slate-50"
      }`}
    >
      Manage Existing
    </button>
  </div>
);