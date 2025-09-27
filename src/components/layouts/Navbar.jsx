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
          <HiOutlineX
            className="text-2xl cursor-pointer"
            aria-label="outline"
          />
        ) : (
          <HiOutlineMenu className="text-2xl cursor-pointer" aria-label="bar" />
        )}
      </button>
      <Link to="/" className="flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 80 60"
          className="h-12 md:h-16"
        >
          <text
            x="0"
            y="40"
            fontSize="40"
            fontFamily="Georgia, serif"
            fill="#242424"
            fontWeight="bold"
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
