import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import ImageKit from "../ImageKit";

const ProfileInfoCard = () => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/");
  };

  return (
    user && (
      <div className="flex items-center">
        <ImageKit
          src={user.profileImageUrl}
          alt="profile image"
          className="w-11 h-11 bg-gray-300 rounded-full mr-3"
          w={44}
          h={44}
        />
        <div>
          <div className="text-[15px] text-black font-bold leading-3">
            {user?.first_name || ""}
          </div>
          <button
            className="text-sky-600 text-sm font-semibold cursor-pointer hover:underline"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    )
  );
};

export default ProfileInfoCard;
