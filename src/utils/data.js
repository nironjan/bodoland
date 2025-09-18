import {
  LuLayoutDashboard,
  LuGalleryVerticalEnd,
  LuMessageSquareQuote,
  LuLayoutTemplate,
  LuUsers,
  LuNewspaper,
  LuLandmark,
  LuBriefcase,
  LuTrophy,
  LuGraduationCap,
} from "react-icons/lu";

export const SIDE_MENU_DATA = [
  {
    id: "01",
    label: "Dashboard",
    icon: LuLayoutDashboard,
    path: "/admin/dashboard",
  },
  {
    id: "02",
    label: "Stories",
    icon: LuGalleryVerticalEnd,
    path: "/admin/posts",
  },
  {
    id: "03",
    label: "Pages",
    icon: LuGalleryVerticalEnd,
    path: "/admin/pages",
  },
  {
    id: "04",
    label: "Comments",
    icon: LuMessageSquareQuote,
    path: "/admin/comments",
  },
  {
    id: "05",
    label: "Users",
    icon: LuUsers,
    path: "/admin/users",
  },
];

export const BLOG_NAVBAR_DATA = [
  {
    id: "01",
    label: "Home",
    icon: LuLayoutTemplate,
    path: "/",
  },
  {
    id: "02",
    label: "News",
    icon: LuNewspaper,
    path: "/tag/breaking-news",
  },
  {
    id: "03",
    label: "Politics",
    icon: LuLandmark,
    path: "/tag/politics",
  },
  {
    id: "04",
    label: "Business",
    icon: LuBriefcase,
    path: "/tag/Business",
  },
  {
    id: "05",
    label: "Sports",
    icon: LuTrophy,
    path: "/tag/Business",
  },
  {
    id: "06",
    label: "Career",
    icon: LuGraduationCap,
    path: "/tag/career-news",
  },
];
