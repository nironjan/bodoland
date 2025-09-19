import React, { useContext, useEffect, useState } from "react";
import BlogLayout from "../../components/layouts/BlogLayout/BlogLayout";
import { LuCircleAlert, LuDot, LuSparkles } from "react-icons/lu";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import moment from "moment";
import TrendingPostSection from "./components/TrendingPostSection";
import MarkdownContent from "./components/MarkdownContent";
import SharePost from "./components/SharePost";
import { sanitizeMarkdown } from "../../utils/helper";
import BlogPostViewSkeleton from "../../components/Loader/BlogPostViewSkeleton";
import ImageKit from "../../components/ImageKit";

const BlogPostView = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [blogPostData, setBlogPostData] = useState(null);
  const [comments, setComments] = useState(null);

  const { user, setOpenAuthForm } = useContext(UserContext);

  const [replyText, setReplyText] = useState("");
  const [showReplyForm, setShowReplyForm] = useState(false);

  const [openSummarizeDrawer, setSummarizeDrawer] = useState(false);
  const [summaryContent, setSummaryContent] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Get Post Data By slug
  const fetchPostDetailsBySlug = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        API_PATHS.POSTS.GET_BY_SLUG(slug)
      );

      if (response.data) {
        const data = response.data;
        setBlogPostData(data);
        fetchCommentByPostId(data._id);
        incrementViews(data._id);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  //Get Comment by Post ID
  const fetchCommentByPostId = async (postId) => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.COMMENTS.GET_ALL_BY_POST(postId)
      );

      if (response.data) {
        const data = response.data;
        setComments(data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Generate Blog post Summary
  const generateBlogPostSumary = async () => {};

  // Increment View
  const incrementViews = async (postId) => {
    if (!postId) return;

    try {
      const response = await axiosInstance.post(
        API_PATHS.POSTS.INCREMENT_VIEW(postId)
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // handles canceling a reply
  const handleCancelReply = () => {
    setReplyText("");
    setShowReplyForm(false);
  };

  // Add reply
  const handleAddReply = async () => {};

  useEffect(() => {
    fetchPostDetailsBySlug();
    return () => {};
  }, [slug]);

  return (
    <BlogLayout>
      {isLoading ? (
        <BlogPostViewSkeleton />
      ) : blogPostData ? (
        <>
          <title>{blogPostData.title}</title>
          <meta name="description" content={blogPostData.title} />
          <meta name="og:title" content={blogPostData.title} />
          <meta name="og:image" content={blogPostData.coverImageUrl} />
          <meta property="og:type" content="article" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-8">
                {/* Title */}
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 leading-snug line-clamp-3">
                  {blogPostData.title}
                </h1>

                {/* Meta info */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-3 mb-5">
                  <span className="text-sm text-gray-500 font-medium">
                    {moment(blogPostData.updatedAt || "").format("Do MMM YYYY")}
                  </span>

                  <LuDot className="text-xl text-gray-400 hidden sm:block" />

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {blogPostData.tags.slice(0, 3).map((tag, index) => (
                      <button
                        key={index}
                        className="bg-sky-200/50 text-sky-800/80 text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/tag/${tag}`);
                        }}
                      >
                        # {tag}
                      </button>
                    ))}
                  </div>

                  <LuDot className="text-xl text-gray-400 hidden sm:block" />

                  {/* Summarize button */}
                  <button
                    className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-cyan-400 text-xs text-white font-medium px-3 py-1 rounded-full whitespace-nowrap cursor-pointer hover:scale-105 transition-transform"
                    onClick={generateBlogPostSumary}
                  >
                    <LuSparkles /> Summarize
                  </button>
                </div>

                {/* Cover image */}
                <ImageKit
                  src={blogPostData.coverImageUrl}
                  alt={blogPostData.title}
                  className="w-full h-56 sm:h-72 md:h-80 lg:h-96 object-cover rounded-lg mb-6"
                  w={1200}
                  h={675}
                />

                {/* Description */}
                <div className="mt-8 text-base text-gray-500 font-medium">
                  {blogPostData?.description}
                </div>

                {/* Markdown content */}
                <MarkdownContent
                  content={sanitizeMarkdown(blogPostData?.content || "")}
                />

                {/* Share section */}
                <div className="mt-8">
                  <SharePost title={blogPostData.title} />
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-4">
                <TrendingPostSection />
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

export default BlogPostView;
