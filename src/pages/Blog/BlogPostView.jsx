import React, { useContext, useEffect, useState } from "react";
import BlogLayout from "../../components/layouts/BlogLayout/BlogLayout";
import { LuDot } from "react-icons/lu";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import moment from "moment";
import TrendingPostSection from "./components/TrendingPostSection";
import MarkdownContent from "./components/MarkdownContent";
import SharePost from "./components/SharePost";
import { htmlToText, sanitizeMarkdown } from "../../utils/helper";
import BlogPostViewSkeleton from "../../components/Loader/BlogPostViewSkeleton";
import ImageKit from "../../components/ImageKit";
import CommentReplyInput from "../../components/Inputs/CommentReplyInput";
import CommentInfoCard from "../Blog/components/CommentInfoCard";
import toast from "react-hot-toast";
import LikeCommentButton from "./components/LikeCommentButton";
import Meta from "../../components/Meta";
import NotFound from "../../components/NotFound";

const BlogPostView = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const BASE_URL = window.location.origin;

  const [blogPostData, setBlogPostData] = useState(null);
  const [comments, setComments] = useState(null);
  const [_relatedPosts, setRelatedPosts] = useState([]);
  const [injectedContent, setInjectedContent] = useState("");

  const { user, setOpenAuthForm } = useContext(UserContext);

  const [replyText, setReplyText] = useState("");
  const [showReplyForm, setShowReplyForm] = useState(false);

  const [notFound, setNotFound] = useState(false);

  const [_openDeleteAlert, setOpenDeleteAlert] = useState({
    open: false,
    data: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg] = useState("");

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

        // fetch related posts
        if (data.tags?.length) {
          fetchRelatedPosts(data.tags, data._id, data.content);
        }
        setNotFound(false);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setNotFound(true);
      } else {
        console.error("Error fetching data:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch related posts by Tags
  const fetchRelatedPosts = async (tags, postId, content) => {
    try {
      const res = await axiosInstance.get(API_PATHS.POSTS.GET_BY_TAG(tags[0]));

      if (res.data) {
        const filtered = res.data.filter((p) => p._id !== postId);
        setRelatedPosts(filtered);

        // inject links
        const injected = injectMultipleLinks(content, filtered);
        setInjectedContent(injected);
      }
    } catch (error) {
      console.error("Error fetching related posts:", error);
    }
  };

  // Inject at least 3 random links at different spots
  const injectMultipleLinks = (content, relatedPosts) => {
    if (relatedPosts.length < 3) return content;

    // Pick 3 random posts (no duplicates)
    const shufled = [...relatedPosts].sort(() => 0.5 - Math.random());
    const selected = shufled.slice(0, 3);

    const paragraphs = content.split(/\n\s*\n/);

    //Define injection position
    const positions = [
      2,
      Math.floor(paragraphs.length / 2),
      paragraphs.length - 1,
    ];

    selected.forEach((post, index) => {
      const linksBlock = `***"Read Also:"***  [${post.title}](/story/${post.slug})`;
      const pos =
        positions[index] < paragraphs.length
          ? positions[index]
          : paragraphs.length - 1;
      paragraphs.splice(pos, 0, linksBlock);
    });

    return paragraphs.join("\n\n");
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

  // Increment View
  const incrementViews = async (postId) => {
    if (!postId) return;

    try {
      await axiosInstance.post(API_PATHS.POSTS.INCREMENT_VIEW(postId));
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
  const handleAddReply = async () => {
    try {
      await axiosInstance.post(API_PATHS.COMMENTS.ADD(blogPostData._id), {
        content: replyText,
        parComment: "",
      });
      toast.success("Reply added successfully");

      setReplyText("");
      setShowReplyForm(false);
      fetchCommentByPostId(blogPostData._id);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPostDetailsBySlug();
    return () => {};
  }, [slug]);

  return (
    <BlogLayout>
      {isLoading ? (
        <BlogPostViewSkeleton />
      ) : notFound ? (
        <NotFound message="The story you’re looking for doesn’t exist." />
      ) : blogPostData ? (
        <>
          <Meta
            title={blogPostData.title}
            description={
              blogPostData.description ||
              htmlToText(sanitizeMarkdown(blogPostData.content))?.slice(0, 150)
            }
            image={blogPostData.coverImageUrl}
            url={`${BASE_URL}/story/${blogPostData.slug}`}
            keywords={blogPostData.tags?.join(", ")}
            author={blogPostData.author?.name}
            publishedTime={blogPostData.createdAt}
            modifiedTime={blogPostData.updatedAt}
            section="News"
            tags={blogPostData.tags}
          />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Main Content */}
              <div
                className={`lg:col-span-8 ${
                  blogPostData.language === "brx" ? "notranslate bodo-font" : ""
                }`}
              >
                {/* Title */}
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 leading-snug line-clamp-3">
                  {blogPostData.title}
                </h1>

                {/* Meta info */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-3 mb-5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm text-gray-500 font-medium">
                      <span className="font-semibold">By </span>
                      {blogPostData.author.name}
                    </span>
                  </div>

                  <LuDot className="text-xl text-gray-400 hidden sm:block" />

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
                          navigate(`/story/tag/${tag}`);
                        }}
                      >
                        # {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="my-8 text-base text-gray-500 font-medium italic">
                  {blogPostData?.description}
                </div>

                {/* Cover image */}
                <ImageKit
                  src={blogPostData.coverImageUrl}
                  alt={blogPostData.title}
                  className="w-full h-56 sm:h-72 md:h-80 lg:h-96 object-cover rounded-lg mb-6"
                  w={1200}
                  h={675}
                />

                {/* Markdown content */}
                <MarkdownContent
                  content={sanitizeMarkdown(
                    injectedContent || blogPostData?.content || ""
                  )}
                />

                {/* Share section */}
                <div className="mt-8">
                  <SharePost title={blogPostData.title} />
                </div>

                {/* Comments */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold">Comments</h4>
                    <button
                      className="flex items-center justify-center gap-3 bg-linear-to-r from-sky-500 to-cyan-400 text-xs font-semibold text-white px-5 py-2 rounded-full hover:bg-black hover:text-white cursor-pointer"
                      onClick={() => {
                        if (!user) {
                          setOpenAuthForm(true);
                          return;
                        }
                        setShowReplyForm(true);
                      }}
                    >
                      Add Comment
                    </button>
                  </div>

                  {showReplyForm && (
                    <div className="bg-white pt-1 pb-5 pr-8 rounded-lg mb-8">
                      <CommentReplyInput
                        user={user}
                        autorName={user.name}
                        content={""}
                        replyText={replyText}
                        setReplyText={setReplyText}
                        handleAddReply={handleAddReply}
                        handleCancelReply={handleCancelReply}
                        disableAutoGen
                        type="new"
                      />
                    </div>
                  )}

                  <div id="comment-section" className="scroll-mt-36">
                    {comments?.length > 0 &&
                      comments.map((comment) => (
                        <CommentInfoCard
                          key={comment._id}
                          commentId={comment._id || null}
                          authorName={comment.author.name}
                          authorPhoto={comment.author.profileImageUrl}
                          content={comment.content}
                          updatedOn={
                            comment.updatedAt
                              ? moment(comment.updatedAt).format("Do MMM YYYY")
                              : "-"
                          }
                          post={comment.post}
                          replies={comment.replies || []}
                          getAllComments={() =>
                            fetchCommentByPostId(blogPostData._id)
                          }
                          onDelete={(commentId) =>
                            setOpenDeleteAlert({
                              open: true,
                              data: commentId || comment._id,
                            })
                          }
                        />
                      ))}
                  </div>
                </div>

                <LikeCommentButton
                  postId={blogPostData._id || ""}
                  likes={blogPostData.likes || 0}
                  comments={comments?.length || 0}
                />
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
