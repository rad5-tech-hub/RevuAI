	
import React from "react";

const TabNavigation = ({ activeTab, setActiveTab }) => {
  return (
    <div className="mb-6">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab("create")}
            className={`${
              activeTab === "create"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Create QR Code
          </button>
          <button
            onClick={() => setActiveTab("manage")}
            className={`${
              activeTab === "manage"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Manage QR Codes
          </button>
        </nav>
      </div>
    </div>
  );
};

export default TabNavigation;