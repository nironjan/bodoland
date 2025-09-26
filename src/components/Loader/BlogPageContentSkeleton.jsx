// src/components/Loader/BlogPageContentSkeleton.jsx
import React from "react";

const BlogPageContentSkeleton = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Skeleton */}
        <div className="lg:col-span-8 animate-pulse">
          {/* Title */}
          <div className="h-8 sm:h-10 lg:h-12 bg-gray-200 rounded w-3/4 mb-4"></div>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-3 mb-6">
            <div className="h-4 bg-gray-200 rounded w-40"></div>
          </div>

          {/* Content (multiple lines) */}
          <div className="mt-8 space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPageContentSkeleton;
