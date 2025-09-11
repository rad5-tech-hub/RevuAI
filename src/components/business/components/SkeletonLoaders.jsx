// SkeletonLoaders.jsx - Create this as a new component file
import React from "react";

export const FeedbackCardSkeleton = () => (
  <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm animate-pulse">
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div className="flex-1">
        {/* Rating and sentiment skeleton */}
        <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-4 h-4 bg-slate-200 rounded"></div>
              ))}
            </div>
            <div className="w-16 h-5 bg-slate-200 rounded-full"></div>
          </div>
          <div className="w-20 h-4 bg-slate-200 rounded"></div>
        </div>
        
        {/* Comment skeleton */}
        <div className="space-y-2 mb-3">
          <div className="w-full h-4 bg-slate-200 rounded"></div>
          <div className="w-3/4 h-4 bg-slate-200 rounded"></div>
        </div>
        
        {/* User info skeleton */}
        <div className="mb-3">
          <div className="w-32 h-4 bg-slate-200 rounded"></div>
        </div>
        
        {/* Tags skeleton */}
        <div className="flex gap-2 mb-3">
          <div className="w-16 h-6 bg-slate-200 rounded-full"></div>
          <div className="w-20 h-6 bg-slate-200 rounded-full"></div>
          <div className="w-14 h-6 bg-slate-200 rounded-full"></div>
        </div>
        
        {/* QR Code info skeleton */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-4 h-4 bg-slate-200 rounded"></div>
          <div className="w-24 h-4 bg-slate-200 rounded"></div>
        </div>
        
        {/* Reply button skeleton */}
        <div className="w-16 h-6 bg-slate-200 rounded"></div>
      </div>
      
      {/* Action buttons skeleton */}
      <div className="flex gap-2 self-end sm:self-start">
        <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
        <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
        <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
      </div>
    </div>
  </div>
);

export const StatsCardSkeleton = () => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 text-center animate-pulse">
    <div className="h-8 bg-slate-200 rounded w-3/4 mx-auto mb-2"></div>
    <div className="h-4 bg-slate-200 rounded w-1/2 mx-auto"></div>
  </div>
);

export const FullPageSkeleton = () => (
  <div className="min-h-screen bg-slate-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header skeleton */}
      <div className="mb-6">
        <div className="w-48 h-8 bg-slate-200 rounded mb-2 animate-pulse"></div>
        <div className="w-72 h-4 bg-slate-200 rounded animate-pulse"></div>
      </div>
      
      {/* Stats skeleton */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {Array(5).fill().map((_, index) => (
          <StatsCardSkeleton key={index} />
        ))}
      </div>
      
      {/* Filters skeleton */}
      <div className="mt-6 flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px] h-10 bg-slate-200 rounded-lg animate-pulse"></div>
        <div className="w-32 h-10 bg-slate-200 rounded-lg animate-pulse"></div>
        <div className="w-32 h-10 bg-slate-200 rounded-lg animate-pulse"></div>
        <div className="w-32 h-10 bg-slate-200 rounded-lg animate-pulse"></div>
      </div>
      
      {/* Feedback cards skeleton */}
      <div className="mt-6 space-y-4 pb-10">
        {Array(3).fill().map((_, index) => (
          <FeedbackCardSkeleton key={index} />
        ))}
      </div>
    </div>
  </div>
);