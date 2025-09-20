import React from "react";
import { LuEye, LuHeart, LuTrash2 } from "react-icons/lu";
import ImageKit from "../../components/ImageKit";

const UserSummaryCard = ({ title, imgUrl, updatedOn, onClick, onDelete }) => {
  return (
    <div
      className="group flex items-start gap-4 bg-white p-3 mb-5 rounded-lg cursor-pointer"
      onClick={onClick}
    >
      <ImageKit
        src={imgUrl}
        alt={title}
        className="w-16 h-16 rounded-lg"
        w={64}
        h={64}
      />
      <div className="flex-1">
        <h3 className="text-[13px] md:text-[15px] text-black font-medium">
          {title}{" "}
        </h3>
        <div className="flex items-center gap-2.5 mt-2 flex-wrap">
          <div className="text-[11px] text-gray-700 font-medium bg-gray-100 px-2.5 py-1 rounded">
            Updated: {updatedOn}
          </div>
        </div>
      </div>
      <button
        className="hidden md:group-hover:flex items-center gap-2 text-xs text-rose-500 font-medium bg-rose-50 px-3 py-1 rounded whitespace-nowrap border border-rose-100 hover:border-rose-200 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        <LuTrash2 /> <span className="hidden md:block">Delete</span>
      </button>
    </div>
  );
};

export default UserSummaryCard;
