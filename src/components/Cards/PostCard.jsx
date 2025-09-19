import React from "react";
import ImageKit from "../ImageKit";

const PostCard = ({ title, coverImageUrl, tags, onClick }) => {
  return (
    <div className="cursor-pointer my-3" onClick={onClick}>
      <h6 className="text-[10px] font-semibold text-sky-500">
        {tags[0]?.toUpperCase() || "BLOG"}
      </h6>

      <div className="flex items-start gap-4 mt-2">
        <ImageKit
          src={coverImageUrl}
          alt={title}
          className="w-14 h-14 object-cover rounded"
          w={56}
          h={56}
        />

        <h2 className="text-sm md:text-sm font-medium mb-2 line-clamp-3">
          {title}
        </h2>
      </div>
    </div>
  );
};

export default PostCard;
