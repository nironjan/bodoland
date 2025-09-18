import React from "react";

const SkeletonBox = ({ className }) => {
  return (
    <div className={`animate-pulse bg-gray-200 rounded-md ${className}`}></div>
  );
};

export default SkeletonBox;
