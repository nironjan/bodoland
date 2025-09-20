import React, { useContext } from "react";
import { LuLogOut } from "react-icons/lu";
import { Route, useNavigate } from "react-router-dom";
import { BLOG_NAVBAR_DATA, SIDE_MENU_DATA } from "../../utils/data";
import CharAvatar from "../Cards/CharAvatar";
import { UserContext } from "../../context/userContext";
import ImageKit from "../ImageKit";

const SideMenu = ({ activeMenu, isBlogMenu, setOpenSideMenu }) => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();
      return;
    }
    setOpenSideMenu((prevState) => !prevState);
    navigate(route);
  };
  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setOpenSideMenu((prevState) => !prevState);
    navigate("/");
  };
  return (
    <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 p-5 sticky top-[61px] z-20">
      {user && (
        <div className="flex flex-col items-center justify-center gap-1 mt-3 mb-7">
          {user?.profileImageUrl ? (
            <ImageKit
              src={user?.profileImageUrl || ""}
              alt="Profile Image"
              className="w-16 h-16 bg-slate-400 rounded-full"
              w={64}
              h={64}
            />
          ) : (
            <CharAvatar
              fullName={user?.name || ""}
              width="w-20"
              height="h-20"
              style="text-xl"
            />
          )}

          <div>
            <h5 className="text-gray-950 font-semibold text-center leading-6 mt-1">
              {user.name || ""}
            </h5>
            <p className="text-[13px] font-medium text-gray-600 text-center">
              {user?.email || ""}
            </p>
          </div>
        </div>
      )}

      {(isBlogMenu ? BLOG_NAVBAR_DATA : SIDE_MENU_DATA).map((item, index) => (
        <button
          key={`menu_${index}`}
          className={`w-full flex items-center gap-4 text-[15px] ${
            activeMenu === item.label
              ? "text-black bg-linear-to-r from-sky-200 to-cyan-50/10"
              : ""
          } py-2 px-6 rounded-lg mb-3 cursor-pointer`}
          onClick={() => handleClick(item.path)}
        >
          <item.icon className="text-xl" />
          {item.label}
        </button>
      ))}

      {user && (
        <button
          className={`w-full flex items-center gap-4 text-[15px] py-3 px-6 rounded-lg mb-3 cursor-pointer`}
          onClick={() => handleLogout()}
        >
          <LuLogOut className="text-xl" />
        </button>
      )}
    </div>
  );
};

export default SideMenu;
