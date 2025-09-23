import React, { useEffect, useState } from "react";
import BlogLayout from "../../components/layouts/BlogLayout/BlogLayout";
import { LuGalleryVerticalEnd, LuLoaderCircle } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import moment from "moment/moment";
import FeaturedBlogPost from "./components/FeaturedBlogPost";
import BlogPostSummaryCard from "../../components/Cards/BlogPostSummaryCard";
import TrendingPostSection from "./components/TrendingPostSection";
import FeaturedPostSkeleton from "../../components/Loader/FeaturedPostSkeleton";
import BlogCardSkeleton from "../../components/Loader/BlogCardSkeleton";
import { useSiteSetting } from "../../context/SiteSettingContext";

const BlogLandingPage = () => {
  const navigate = useNavigate();
  const { siteSetting } = useSiteSetting();

  const [blogPostList, setBlogPostList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch paginated articles
  const getAllPosts = async (pageNumber = 1) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(API_PATHS.POSTS.GET_ALL, {
        params: {
          status: "published",
          page: pageNumber,
        },
      });
      const { posts, totalPages } = response.data;

      setBlogPostList((prevPosts) =>
        pageNumber === 1 ? posts : [...prevPosts, ...posts]
      );

      setTotalPages(totalPages);
      setPage(pageNumber);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load more articles
  const handleLoadMore = () => {
    if (page < totalPages) {
      getAllPosts(page + 1);
    }
  };

  // Initial load
  useEffect(() => {
    getAllPosts(1);
  }, []);

  // Navigate single article
  const handleClick = (post) => {
    navigate(`/story/${post.slug}`);
  };

  return (
    <BlogLayout>
      <title>{siteSetting?.siteTitle || "Home Page"}</title>
      <meta name="description" content={siteSetting?.description || ""} />
      <meta name="og:title" content={siteSetting?.siteTitle || ""} />

      <div className="max-w-6xl mx-auto px-5 md:px-0">
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-12 md:col-span-9">
            {/* Featured Post */}
            {isLoading && blogPostList.length === 0 ? (
              <FeaturedPostSkeleton />
            ) : (
              blogPostList.length > 0 && (
                <FeaturedBlogPost
                  title={blogPostList[0].title}
                  coverImageUrl={blogPostList[0].coverImageUrl}
                  description={blogPostList[0].description}
                  tags={blogPostList[0].tags}
                  updatedOn={
                    blogPostList[0].updatedAt
                      ? moment(blogPostList[0].updatedAt).format("Do MMM YYYY")
                      : "-"
                  }
                  authorName={blogPostList[0].author.name}
                  authorProfileImg={blogPostList[0].author.profileImageUrl}
                  onClick={() => handleClick(blogPostList[0])}
                />
              )
            )}

            {/* Grid Posts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {isLoading && blogPostList.length === 0
                ? Array.from({ length: 5 }).map((_, i) => (
                    <BlogCardSkeleton key={i} />
                  ))
                : blogPostList
                    .slice(1)
                    .map((item) => (
                      <BlogPostSummaryCard
                        key={item._id}
                        title={item.title}
                        coverImageUrl={item.coverImageUrl}
                        description={item.description}
                        tags={item.tags}
                        updatedOn={
                          item.updatedAt
                            ? moment(item.updatedAt).format("Do MMM YYYY")
                            : "-"
                        }
                        authorName={item.author.name}
                        authProfileImg={item.author.profileImageUrl}
                        onClick={() => handleClick(item)}
                      />
                    ))}
            </div>

            {/* Load More Button */}
            {page < totalPages && (
              <div className="flex items-center justify-center mt-5">
                <button
                  className="flex items-center gap-3 text-sm text-white font-medium bg-black px-7 py-2.5 mt-6 rounded-full text-nowrap hover:scale-105 transition-all cursor-pointer"
                  disabled={isLoading}
                  onClick={handleLoadMore}
                >
                  {isLoading ? (
                    <LuLoaderCircle className="animate-spin text-[15px]" />
                  ) : (
                    <LuGalleryVerticalEnd className="text-lg" />
                  )}{" "}
                  {isLoading ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </div>

          <div className="col-span-12 md:col-span-3">
            <TrendingPostSection />
          </div>
        </div>
      </div>
    </BlogLayout>
  );
};

export default BlogLandingPage;
