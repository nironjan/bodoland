import React, { useEffect, useState } from "react";
import BlogLayout from "../../components/layouts/BlogLayout/BlogLayout";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import moment from "moment";
import TrendingPostSection from "./components/TrendingPostSection";
import BlogPostSummaryCard from "../../components/Cards/BlogPostSummaryCard";

const PostByTags = () => {
  const { tagName } = useParams();
  const navigate = useNavigate();

  const [blogPostList, setBlogPostList] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetch articles by tag
  const getPostByTag = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance(API_PATHS.POSTS.GET_BY_TAG(tagName));
      setBlogPostList(response.data?.length > 0 ? response.data : []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // handle article click
  const handleClick = (post) => {
    navigate(`/story/${post.slug}`);
  };

  useEffect(() => {
    getPostByTag();
  }, [tagName]);

  return (
    <BlogLayout>
      <div className="max-w-6xl mx-auto px-5 md:px-0">
        <div className="grid grid-cols-12 gap-5">
          {/* left side */}
          <div className="col-span-12 md:col-span-9">
            {/* header */}
            <div className="flex items-center justify-center bg-linear-to-r from-sky-50 via-teal-50 to-cyan-100 h-32 p-6 rounded-lg">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-sky-900">
                  # {tagName}
                </h3>
                <p className="text-sm font-medium text-gray-700 mt-1">
                  {loading
                    ? "Loading posts..."
                    : `Showing ${blogPostList.length} posts tagged with #${tagName}`}
                </p>
              </div>
            </div>

            {/* posts grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {loading &&
                Array.from({ length: 4 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="animate-pulse rounded-lg border border-gray-200 p-4 space-y-4"
                  >
                    <div className="h-40 bg-gray-200 rounded-md"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gray-200"></div>
                      <div className="h-3 w-24 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}

              {!loading &&
                blogPostList.length > 0 &&
                blogPostList.map((item) => (
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
          </div>

          {/* right side */}
          <div className="col-span-12 md:col-span-3">
            <TrendingPostSection />
          </div>
        </div>
      </div>
    </BlogLayout>
  );
};

export default PostByTags;
