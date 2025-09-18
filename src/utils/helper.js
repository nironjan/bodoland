import { marked } from "marked";
import DOMPurify from "dompurify";

export const getInitials = (title) => {
  if (title) return "";

  const words = title.split(" ");
  let initials = "";

  for (let i = 0; i < Math.min(words.length, 2); i++) {
    initials += words[i][0];
  }
  return initials.toUpperCase();
};

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const getToastMessageByType = (type) => {
  switch (type) {
    case "edit":
      return "Your Story updated successfully";
    case "draft":
      return "Your Story Saved as Draft.";
    case "published":
      return "Your Story Published Successfully";
  }
};

// export const senitizeMarkdown = (content) => {
//   const markdownBlockRegex = /^```(?:markdown)?\n([\s\S]*?)\n```$/;
//   const match = content.match(markdownBlockRegex);
//   return match ? match[1] : content;
// };

// Detects if content is raw HTML or Markdown and returns safe HTML
export const sanitizeMarkdown = (content) => {
  if (!content) return "";

  // Step 1: Remove ```markdown fences if wrapped
  const markdownBlockRegex = /^```(?:markdown)?\n([\s\S]*?)\n```$/;
  const match = content.match(markdownBlockRegex);
  const cleanedContent = match ? match[1] : content;

  // Step 2: Detect if already HTML
  const looksLikeHtml = /^<\/?[a-z][\s\S]*>/i.test(cleanedContent);

  let rawHtml = looksLikeHtml
    ? cleanedContent // already HTML
    : marked.parse(cleanedContent); // convert Markdown → HTML

  // Step 3: Sanitize HTML
  return DOMPurify.sanitize(rawHtml);
};
