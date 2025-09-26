export const BASE_URL = import.meta.env.VITE_APP_URL;

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    SEARCH: "/api/auth/search",
    GET_ALL: "/api/auth/users",
    DELETE: (id) => `/api/auth/users/${id}`,
    UPDATE: (id) => `/api/auth/update/${id}`,
    USER_BY_ID: (id) => `/api/auth/users/${id}`,
    GET_PROFILE: "/api/auth/profile",
  },
  IMAGE: {
    UPLOAD_IMAGE: "/api/auth/upload-image",
  },
  DASHBOARD: {
    GET_DASHBOARD_DATA: "/api/dashboard-summary",
  },
  AI: {
    GENERATE_BLOG_POST: "/api/ai/generate",
    GENERATE_BLOG_POST_IDEAS: "/api/ai/generate-ideas",
    GENERATE_COMMENT_REPLY: "/api/ai/generate-reply",
    GENERATE_POST_SUMMARY: "/api/ai/generate-summary",
  },

  POSTS: {
    CREATE: "/api/posts",
    GET_ALL: "/api/posts",
    GET_TRENDING_POSTS: "/api/posts/trending",
    GET_BY_SLUG: (slug) => `/api/posts/slug/${slug}`,
    UPDATE: (id) => `/api/posts/${id}`,
    DELETE: (id) => `/api/posts/${id}`,
    GET_BY_TAG: (tag) => `/api/posts/tag/${tag}`,
    SEARCH: "/api/posts/search",
    INCREMENT_VIEW: (id) => `/api/posts/${id}/view`,
    LIKE: (id) => `/api/posts/${id}/like`,
  },

  PAGES: {
    CREATE: "/api/pages",
    GET_ALL: "/api/pages",
    GET_BY_SLUG: (slug) => `/api/pages/slug/${slug}`,
    SEARCH: "/api/pages/search",
    UPDATE: (id) => `/api/pages/${id}`,
    DELETE: (id) => `/api/pages/${id}`,
  },
  COMMENTS: {
    ADD: (postId) => `/api/comments/${postId}`,
    GET_ALL: "/api/comments",
    GET_ALL_BY_POST: (postId) => `/api/comments/${postId}`,
    DELETE: (commentId) => `/api/comments/${commentId}`,
  },
  SETTINGS: {
    CREATE: "/api/setting",
    UPDATE: "/api/setting",
    GET: "/api/setting",
  },
  SITEMAP: {
    POSTS: "/api/sitemap.xml",
    TAGS: "/api/sitemap-tags",
    INDEX: "/api/sitemap-index",
  },
};
