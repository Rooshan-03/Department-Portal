import React from "react";

/* ✅ Define SkeletonBox HERE (or import it if separate file) */
const SkeletonBox = ({ className }) => (
  <div
    className={`animate-pulse bg-gray-200 rounded ${className}`}
  />
);

const ComplaintsLoader = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      
      {/* Header */}
      <div className="mb-8">
        <SkeletonBox className="h-8 w-64 mb-2" />
        <SkeletonBox className="h-4 w-80" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-lg ">
            <SkeletonBox className="h-4 w-20 mb-2" />
            <SkeletonBox className="h-6 w-10" />
          </div>
        ))}
      </div>

      {/* Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-xl ">
            
            <SkeletonBox className="h-4 w-24 mb-3" />
            <SkeletonBox className="h-5 w-3/4 mb-2" />

            <SkeletonBox className="h-4 w-full mb-1" />
            <SkeletonBox className="h-4 w-5/6 mb-1" />
            <SkeletonBox className="h-4 w-2/3 mb-4" />

            <div className="flex gap-4 mb-4">
              <SkeletonBox className="h-3 w-20" />
              <SkeletonBox className="h-3 w-16" />
            </div>

            <SkeletonBox className="h-4 w-28" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComplaintsLoader;