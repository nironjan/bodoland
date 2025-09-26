import React, { useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";

import SideMenu from "./SideMenu";
import { Link } from "react-router-dom";
import ImageKit from "../ImageKit";

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);

  return (
    <div className="flex gap-2 bg-white border border-b border-gray-200/50 backdrop-blur-[2px] py-2 px-5 sticky top-0 z-30 ">
      <button
        className="block lg:hidden text-black -mt-1"
        onClick={() => {
          setOpenSideMenu(!openSideMenu);
        }}
      >
        {openSideMenu ? (
          <HiOutlineX className="text-2xl cursor-pointer" />
        ) : (
          <HiOutlineMenu className="text-2xl cursor-pointer" />
        )}
      </button>
      <Link to="/" className="flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="200"
          height="60"
          viewBox="0 0 200 60"
        >
          <text
            x="0"
            y="40"
            font-size="40"
            font-family="Georgia, serif"
            fill="#242424"
            font-weight="bold"
          >
            tb.
          </text>
        </svg>
      </Link>
      {openSideMenu && (
        <div className="fixed top-[60px] left-0 bg-white">
          <SideMenu activeMenu={activeMenu} setOpenSideMenu={setOpenSideMenu} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
