import React, { useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";

import SideMenu from "./SideMenu";
import { Link } from "react-router-dom";
import ImageKit from "../ImageKit";

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);

  return (
    <div className="flex gap-5 bg-white border border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-30 ">
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
        <ImageKit
          src="https://ik.imagekit.io/thebodoland/site/logo"
          alt="logo"
          className="h-[34px] md:h-[26px]"
        />
        <span className="logo-font text-orange-500 hidden md:block md:text-xl leading-3.5 mt-1 font-semibold">
          The Bodoland
        </span>
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
