
import React from "react";

const LoadingState = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 sm:p-6" aria-busy="true" aria-label="Loading QR code generator">
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
        <div className="h-5 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={`type-card-${i}`} className="flex items-start gap-4 p-4 border border-slate-200 rounded-xl">
              <div className="mt-0.5 h-10 w-10 bg-gray-200 rounded-xl animate-pulse"></div>
              <div className="flex-1">
                <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
        <div className="h-5 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>
        <div className="space-y-4">
          <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-20 w-full bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="flex flex-wrap gap-2">
            {[1, 2].map((i) => (
              <div key={`tag-${i}`} className="h-6 w-24 bg-gray-200 rounded-full animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
        <div className="h-5 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>
        <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] items-center gap-3">
          <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-14 bg-gray-200 rounded-md animate-pulse"></div>
            <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>
        <div className="mt-4 h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="h-12 w-full sm:w-40 bg-gray-200 rounded-xl animate-pulse"></div>
        <div className="h-12 w-full sm:w-40 bg-gray-200 rounded-xl animate-pulse"></div>
      </div>
    </div>
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
        <div className="h-5 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 min-h-[300px] flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="h-40 w-40 bg-gray-200 rounded-2xl animate-pulse"></div>
            <div className="mt-3 h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="mt-1 h-3 w-64 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="mt-4">
          <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
          <div className="mt-1 flex items-center gap-2">
            <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-10 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={`action-${i}`} className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
        <div className="h-5 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={`tip-${i}`} className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default LoadingState;