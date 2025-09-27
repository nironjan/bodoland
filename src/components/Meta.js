import { useEffect } from "react";

const Meta = ({
  title,
  description,
  image,
  url,
  keywords,
  author,
  publishedTime,
  modifiedTime,
  section,
  tags = [],
  noIndex = false,
}) => {
  useEffect(() => {
    if (title) document.title = title;

    // helper function for meta
    const setMeta = (attr, key, value) => {
      if (!value) return;
      let tag = document.querySelector(`meta[${attr}='${key}']`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attr, key);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", value);
    };

    // Standard SEO
    setMeta("name", "description", description);
    setMeta("name", "keywords", keywords);
    setMeta("name", "author", author);

    // Open Graph
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:image", image);
    setMeta("property", "og:url", url || window.location.href);
    setMeta("property", "og:type", "article");
    setMeta("property", "og:site_name", "Your News Site");

    // Twitter
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", image);

    // News-specific (Google)
    setMeta("property", "article:published_time", publishedTime);
    setMeta("property", "article:modified_time", modifiedTime);
    setMeta("property", "article:section", section);

    // Remove old article:tag meta tags first
    document
      .querySelectorAll("meta[property='article:tag']")
      .forEach((el) => el.remove());

    // Multiple tags (categories/tags)
    tags.forEach((tag) => {
      let tagEl = document.createElement("meta");
      tagEl.setAttribute("property", "article:tag");
      tagEl.setAttribute("content", tag);
      document.head.appendChild(tagEl);
    });

    // ✅ Canonical tag
    const canonicalUrl = url || window.location.href;
    let link = document.querySelector("link[rel='canonical']");
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", canonicalUrl);

    // ✅ noIndex for disallowed pages
    let robotsTag = document.querySelector("meta[name='robots']");
    if (!robotsTag) {
      robotsTag = document.createElement("meta");
      robotsTag.setAttribute("name", "robots");
      document.head.appendChild(robotsTag);
    }
    robotsTag.setAttribute(
      "content",
      noIndex ? "noindex, nofollow" : "index, follow"
    );
  }, [
    title,
    description,
    image,
    url,
    keywords,
    author,
    publishedTime,
    modifiedTime,
    section,
    tags,
    noIndex,
  ]);

  return null;
};

export default Meta;
