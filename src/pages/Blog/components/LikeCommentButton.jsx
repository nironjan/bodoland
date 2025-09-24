import React, { useState } from "react";
import { LuMessageCircleDashed } from "react-icons/lu";
import { PiHandsClapping } from "react-icons/pi";
import clsx from "clsx";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import toast from "react-hot-toast";

const LikeCommentButton = ({ postId, likes, comments }) => {
  const [postLikes, setPostlikes] = useState(likes || 0);
  const [liked, setLiked] = useState(false);

  const handleComentClick = () => {
    const commentSection = document.getElementById("comment-section");
    if (commentSection) {
      commentSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLikeClick = async () => {
    if (!postId) return null;

    try {
      const response = await axiosInstance.post(API_PATHS.POSTS.LIKE(postId));
      if (response.data) {
        setPostlikes((prevState) => !prevState + 1);
        setLiked(true);

        setTimeout(() => {
          setLiked(false);
        }, 500);
      }
    } catch (error) {
      console.error("Error liked article:", error);
      toast.error("You need to Login first!. ");
    }
  };
  return (
    <div className="flex justify-center items-center">
      <div className="fixed bottom-8 right-8 px-6 py-3 bg-black text-white rounded-full shadow-lg flex items-center justify-center ">
        <button
          className="flex items-end gap-2 cursor-pointer"
          onClick={handleLikeClick}
        >
          <PiHandsClapping
            className={clsx(
              "text-[22px] transition-transform duration-300",
              liked && "scale-125 text-cyan-500"
            )}
          />
          <span className="text-base font-medium leading-4">{postLikes}</span>
        </button>

        <div className="h-6 w-px bg-gray-500 mx-5"></div>
        <button
          onClick={handleComentClick}
          className="flex items-end gap-2 cursor-pointer"
        >
          <LuMessageCircleDashed className="text-[22px]" />
          <span className="text-base font-medium leading-4">{comments}</span>
        </button>
      </div>
    </div>
  );
};

export default LikeCommentButton;
