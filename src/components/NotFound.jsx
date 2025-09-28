import React from "react";
import { useNavigate } from "react-router-dom";
import { LuArrowLeft } from "react-icons/lu";

const NotFound = ({ message }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center px-4 text-center">
      {/* Large 404 Number */}
      <h1 className="text-9xl font-extrabold text-gray-300 mb-6 select-none">
        404
      </h1>

      {/* Message */}
      <p className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4">
        {message || "Oops! Page not found."}
      </p>

      {/* Subtext */}
      <p className="text-gray-500 mb-8 max-w-md">
        The page you are looking for might have been moved, deleted, or never
        existed.
      </p>

      {/* Go Home Button */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 bg-black text-white font-semibold px-6 py-3 rounded-full hover:bg-gray-900 transition cursor-pointer"
      >
        <LuArrowLeft className="w-5 h-5" />
        Go Back Home
      </button>
    </div>
  );
};

export default NotFound;
