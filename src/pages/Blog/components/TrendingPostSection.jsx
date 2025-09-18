import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import PostCard from "../../../components/Cards/PostCard";
import TrendingPostSkeleton from "../../../components/Loader/TrendingPostSkeleton";

const TrendingPostSection = () => {
  const navigate = useNavigate();
  const [postList, setPostList] = useState([]);
  const [loading, setLoading] = useState(false);

  // fetch trending blog posts
  const getTrendingPosts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        API_PATHS.POSTS.GET_TRENDING_POSTS
      );

      setPostList(response.data?.length > 0 ? response.data : []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle post click
  const handleClick = (post) => {
    navigate(`/${post.slug}`);
  };

  useEffect(() => {
    getTrendingPosts();
    return () => {};
  }, []);
  return (
    <div className="text-base text-black font-medium mb-3">
      <h4 className="">Trending Stories</h4>

      {/* Skeltons while loading */}
      {loading &&
        Array.from({ length: 5 }).map((_, i) => (
          <TrendingPostSkeleton key={i} />
        ))}

      {/* Show posts after load */}
      {!loading &&
        postList.length > 0 &&
        postList.map((item) => (
          <PostCard
            key={item._id}
            title={item.title}
            coverImageUrl={item.coverImageUrl}
            tags={item.tags}
            onClick={() => handleClick(item)}
          />
        ))}
    </div>
  );
};

export default TrendingPostSection;
