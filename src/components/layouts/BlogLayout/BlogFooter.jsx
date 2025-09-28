import { Link, useLocation } from "react-router-dom";
import { BLOG_FOOTER_DATA } from "../../../utils/data";
import { useSiteSetting } from "../../../context/SiteSettingContext";
import {
  LuFacebook,
  LuTwitter,
  LuInstagram,
  LuLinkedin,
  LuYoutube,
} from "react-icons/lu";
import { IoLogoReddit } from "react-icons/io";

const BlogFooter = () => {
  const location = useLocation();
  const { siteSetting } = useSiteSetting();

  const socialLinks = siteSetting?.socialLinks || {};

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-10 text-center">
        {/* Social Icons */}
        <div className="flex justify-center gap-5 mb-8">
          {socialLinks.facebook && (
            <a
              href={socialLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-sky-600 transition"
            >
              <LuFacebook className="w-6 h-6" />
            </a>
          )}
          {socialLinks.twitter && (
            <a
              href={socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-sky-600 transition"
            >
              <LuTwitter className="w-6 h-6" />
            </a>
          )}
          {socialLinks.instagram && (
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-sky-600 transition"
            >
              <LuInstagram className="w-6 h-6" />
            </a>
          )}
          {socialLinks.linkedin && (
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-sky-600 transition"
            >
              <LuLinkedin className="w-6 h-6" />
            </a>
          )}
          {socialLinks.youtube && (
            <a
              href={socialLinks.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-sky-600 transition"
            >
              <LuYoutube className="w-6 h-6" />
            </a>
          )}
          {socialLinks.reddit && (
            <a
              href={socialLinks.reddit}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-sky-600 transition"
            >
              <IoLogoReddit className="w-6 h-6" />
            </a>
          )}
        </div>

        {/* Menu Links */}
        <ul className="flex flex-wrap justify-center gap-6 mb-8">
          {BLOG_FOOTER_DATA.map((item) => {
            if (item?.onlySideMenu) return null;

            const isActive =
              location.pathname === item.path ||
              location.pathname.startsWith(item.path + "/");

            return (
              <li key={item.id} className="list-none">
                <Link
                  to={item.path}
                  className={`text-sm font-medium transition relative ${
                    isActive ? "text-sky-600" : "text-gray-700"
                  } hover:text-sky-600`}
                >
                  {item.label}
                  <span
                    className={`absolute left-0 -bottom-1 h-[2px] w-full bg-sky-500 transition-all duration-300 origin-left ${
                      isActive ? "scale-x-100" : "scale-x-0"
                    } group-hover:scale-x-100`}
                  ></span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* About Site */}
        {siteSetting?.aboutSite && (
          <p className="max-w-2xl mx-auto text-sm text-gray-500 mb-8">
            {siteSetting.aboutSite}
          </p>
        )}

        {/* Copyright */}
        <div className="border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} The Bodoland. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default BlogFooter;
