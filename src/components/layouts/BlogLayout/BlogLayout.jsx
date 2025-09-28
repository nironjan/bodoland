import React from "react";
import BlogNavbar from "./BlogNavbar";
import BlogFooter from "./BlogFooter";

const BlogLayout = ({ children, activeMenu }) => {
  return (
    <div className="bg-white">
      <BlogNavbar activeMenu={activeMenu} />
      <div className="mt-4 md:mt-10">{children}</div>
      <BlogFooter />
    </div>
  );
};

export default BlogLayout;
