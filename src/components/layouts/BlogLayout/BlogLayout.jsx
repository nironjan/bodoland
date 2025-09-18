import React from "react";
import BlogNavbar from "./BlogNavbar";

const BlogLayout = ({ children, activeMenu }) => {
  return (
    <div className="bg-white pb-30">
      <BlogNavbar activeMenu={activeMenu} />
      <div className="mt-4 md:mt-10">{children}</div>
    </div>
  );
};

export default BlogLayout;
