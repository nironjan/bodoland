import React from "react";

const BlogPostViewSkeleton = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-8">
          {/* Title */}
          <div className="h-8 sm:h-10 lg:h-12 bg-gray-200 rounded-md w-3/4 animate-pulse mb-3"></div>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-3 mt-3 mb-5">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
          </div>

          {/* Cover image */}
          <div className="w-full h-56 sm:h-72 md:h-80 lg:h-96 bg-gray-200 rounded-lg animate-pulse mb-6"></div>

          {/* Description */}
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
          </div>

          {/* Markdown content */}
          <div className="mt-8 space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-4 bg-gray-200 rounded animate-pulse w-full"
              ></div>
            ))}
          </div>

          {/* Share section */}
          <div className="mt-8 flex gap-3">
            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Sidebar (skipped Trending Section) */}
        <div className="lg:col-span-4 hidden lg:block"></div>
      </div>
    </div>
  );
};

export default BlogPostViewSkeleton;
