import React from "react";
import moment from "moment";
import { LuDot } from "react-icons/lu";
import ImageKit from "../../components/ImageKit";

const RecentCommentList = ({ comments }) => {
  return (
    <div className="mt-4">
      <ul className="space-y-4">
        {comments?.slice(0, 10)?.map((comment) => (
          <li
            key={comment._id}
            className="flex gap-4 border-b border-gray-100 pb-4 last:border-none"
          >
            <ImageKit
              src={comment.author?.profileImageUrl}
              alt={comment.author?.name}
              className="w-10 h-10 rounded-full object-cover"
              w={40}
              h={40}
            />
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1">
                    <p className="font-medium text-[13px] text-gray-500">
                      @ {comment.author?.name}
                    </p>

                    <LuDot className="text-gray-500" />
                    <span className="text-[12px] text-gray-500 font-medium">
                      {moment(comment.updatedAt).format("Do MM YYYY")}
                    </span>
                  </div>
                  <p className="text-sm text-black mt-0.5">{comment.content}</p>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-3">
                <img
                  src={comment.post?.coverImageUrl}
                  alt={comment.post?.title}
                  className="w-9 h-9 rounded-md object-cover"
                />
                <p className="text-[13px] text-gray-700 line-clamp-2">
                  {comment.post?.title}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentCommentList;
