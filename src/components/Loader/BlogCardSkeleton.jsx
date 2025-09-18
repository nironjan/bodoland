import React from "react";
import SkeletonBox from "./SkeletonBox";

const BlogCardSkeleton = () => {
  return (
    <div className="w-full">
      <SkeletonBox className="w-full h-40 mb-3 rounded-lg" />
      <SkeletonBox className="w-3/4 h-5 mb-2" />
      <SkeletonBox className="w-1/2 h-4" />
    </div>
  );
};

export default BlogCardSkeleton;
