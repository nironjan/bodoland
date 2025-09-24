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
  LuSettings,
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
  {
    id: "06",
    label: "Settings",
    icon: LuSettings,
    path: "/admin/settings",
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
    path: "/story/tag/breaking-news",
  },
  {
    id: "03",
    label: "Politics",
    icon: LuLandmark,
    path: "/story/tag/politics",
  },
  {
    id: "04",
    label: "Business",
    icon: LuBriefcase,
    path: "/story/tag/Business",
  },
  {
    id: "05",
    label: "Sports",
    icon: LuTrophy,
    path: "/story/tag/sports",
  },
  {
    id: "06",
    label: "Career",
    icon: LuGraduationCap,
    path: "/story/tag/react",
  },
];
