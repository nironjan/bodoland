import React, { useContext, useState } from "react";
import Logo from "../../../assets/logo.svg";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { Link } from "react-router-dom";
import { LuSearch } from "react-icons/lu";
import { BLOG_NAVBAR_DATA } from "../../../utils/data";
import SideMenu from "../SideMenu";
import { UserContext } from "../../../context/userContext";
import ProfileInfoCard from "../../Cards/ProfileInfoCard";
import Login from "../../Auth/Login";
import SignUp from "../../Auth/SignUp";
import Modal from "../../Modal";
import ImageKit from "../../ImageKit";

const BlogNavbar = ({ activeMenu }) => {
  const { user, setOpenAuthForm } = useContext(UserContext);
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const [openSearchBar, setOpenSearchBar] = useState(false);

  return (
    <>
      <div className="bg-white border border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-5">
          <div className="flex gap-1 items-center">
            <button
              className="block md:hidden text-black -mt-1"
              onClick={() => {
                setOpenSideMenu(!openSideMenu);
              }}
            >
              {openSideMenu ? (
                <HiOutlineX className="text-[28px] cursor-pointer" />
              ) : (
                <HiOutlineMenu className="text-[28px] cursor-pointer" />
              )}
            </button>
            <Link to="/" className="flex items-center">
              <ImageKit
                src="https://ik.imagekit.io/thebodoland/site/logo"
                alt="logo"
                className="h-[34px] md:h-[26px]"
                h={43}
              />

              <span className="logo-font text-orange-500 hidden md:block md:text-xl leading-3.5 mt-1 font-semibold">
                The Bodoland
              </span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-4 lg:gap-10">
            {BLOG_NAVBAR_DATA.map((item, index) => {
              if (item?.onlySideMenu) return;

              return (
                <Link key={item.id} to={item.path}>
                  <li className="text-[15px] text-black font-medium list-none relative group cursor-pointer">
                    {item.label}
                    <span
                      className={`absolute inset-x-0 bottom-0 h-[2px] bg-sky-500 transition-all duration-300 origin-left ${
                        index == 0 ? "scale-x-100" : "scale-x-0"
                      } group-hover:scale-x-100`}
                    ></span>
                  </li>
                </Link>
              );
            })}
          </nav>

          {/* Right side Menu */}
          <div className="flex items-center gap-6">
            <button
              className="hover:text-sky-500 cursor-pointer"
              onClick={() => setOpenSearchBar(true)}
            >
              <LuSearch className="text-[22px]" />
            </button>

            {!user ? (
              <button
                className="flex items-center justify-center gap-3 bg-linear-to-r from-sky-500 to-cyan-400 text-xs md:text-sm font-semibold text-white px-5 md:px-7 py-2 rounded-full hover:bg-black hover:text-white transition-colors cursor-pointer hover:shadow-2xl hover:shadow-cyan-200 "
                onClick={() => setOpenAuthForm(true)}
              >
                Login/Signup
              </button>
            ) : (
              // Right side Profile hidden on mobile view
              <div className="hidden md:block">
                <ProfileInfoCard />
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          {openSideMenu && (
            <div className="fixed top-[61px] left-0 w-full bg-white">
              <SideMenu
                activeMenu={activeMenu}
                isBlogMenu
                setOpenSideMenu={setOpenSideMenu}
              />
            </div>
          )}
        </div>
      </div>

      <AuthModel />
    </>
  );
};

export default BlogNavbar;

const AuthModel = () => {
  const { openAuthForm, setOpenAuthForm } = useContext(UserContext);
  const [currentPage, setCurrentPage] = useState("login");

  return (
    <>
      <Modal
        isOpen={openAuthForm}
        onClose={() => {
          setOpenAuthForm(false);
          setCurrentPage("login");
        }}
        hideHeader
      >
        <div>
          {currentPage === "login" && <Login setCurrentPage={setCurrentPage} />}
          {currentPage === "signup" && (
            <SignUp setCurrentPage={setCurrentPage} />
          )}
        </div>
      </Modal>
    </>
  );
};
