import React, { useEffect, useState } from "react";
import BlogLayout from "../../../components/layouts/BlogLayout/BlogLayout";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import moment from "moment";
import MarkdownContent from "../components/MarkdownContent";
import { sanitizeMarkdown } from "../../../utils/helper";
import TrendingPostSection from "../../Blog/components/TrendingPostSection";
import BlogPageContentSkeleton from "../../../components/Loader/BlogPageContentSkeleton";

const BlogPageView = () => {
  const { slug } = useParams();

  const [blogPageData, setBlogPageData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Get Page data by Slug
  const fetchPageDetailsBySlug = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        API_PATHS.PAGES.GET_BY_SLUG(slug)
      );

      if (response.data) {
        setBlogPageData(response.data);
      } else {
        setErrorMsg("Page not found.");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMsg("Something went wrong while fetching page details.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPageDetailsBySlug();
  }, [slug]);

  return (
    <BlogLayout>
      {isLoading ? (
        <BlogPageContentSkeleton />
      ) : blogPageData ? (
        <>
          {/* SEO Meta */}
          <title>{blogPageData.title}</title>
          <meta name="description" content={blogPageData.title} />
          <meta name="og:title" content={blogPageData.title} />
          <meta name="og:image" content={blogPageData.coverImageUrl} />
          <meta property="og:type" content="article" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-12">
                {/* Title */}
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 leading-snug">
                  {blogPageData.title}
                </h1>

                {/* Meta info */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-3 mb-5">
                  <span className="text-sm text-gray-500 font-medium">
                    <span className="font-bold italic">Last Updated on:</span>{" "}
                    {moment(blogPageData.updatedAt || "").format("Do MMM YYYY")}
                  </span>
                </div>

                {/* Content */}
                <div className="mt-8 text-base text-gray-600 font-medium">
                  {blogPageData?.content && (
                    <MarkdownContent
                      content={sanitizeMarkdown(blogPageData.content)}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : errorMsg ? (
        <div className="text-center py-10 text-red-500">{errorMsg}</div>
      ) : null}
    </BlogLayout>
  );
};

export default BlogPageView;
