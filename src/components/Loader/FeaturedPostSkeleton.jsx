import React from "react";
import SkeletonBox from "./SkeletonBox";

const FeaturedPostSkeleton = () => {
  return (
    <div className="w-full">
      <SkeletonBox className="w-full h-60 mb-4 rounded-xl" />
      <SkeletonBox className="w-3/4 h-6 mb-2" />
      <SkeletonBox className="w-1/2 h-5 mb-2" />
      <SkeletonBox className="w-1/3 h-4" />
    </div>
  );
};

export default FeaturedPostSkeleton;
