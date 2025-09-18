import React from "react";
import SkeletonBox from "./SkeletonBox";

const TrendingPostSkeleton = () => {
  return (
    <div className="flex items-center gap-3 mb-4 animate-pulse">
      {/* Thumbnail */}
      <SkeletonBox className="w-16 h-16 rounded-md shrink-0" />

      {/* Texts */}
      <div className="flex-1">
        <SkeletonBox className="w-3/4 h-4 mb-2" />
        <SkeletonBox className="w-1/2 h-3" />
      </div>
    </div>
  );
};

export default TrendingPostSkeleton;
