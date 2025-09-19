import React, { useState } from "react";

import LOGO from "../../assets/logo.svg";
import Login from "../../components/Auth/Login";
import SignUp from "../../components/Auth/SignUp";

const AdminLogin = () => {
  const [currentPage, setCurrentPage] = useState("login");
  return (
    <>
      <div className="bg-white py-5 border-b border-gray-50">
        <div className="container mx-auto flex items-center">
          <img src={LOGO} alt="logo" className="h-[26px] pl-6" />
          <span className="hidden md:block font-semibold text-lg">
            The Bodoland
          </span>
        </div>
      </div>

      <div className="min-h-[calc(100vh-67px)] flex items-center justify-center">
        <div className="bg-white rounded-2xl overflow-hidden shadow-2xl shadow-gray-200/60 my-3">
          {currentPage === "login" ? (
            <Login setCurrentPage={setCurrentPage} />
          ) : (
            <SignUp setCurrentPage={setCurrentPage} />
          )}
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
