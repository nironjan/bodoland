import React, { useEffect, useState } from "react";
import BlogLayout from "../../components/layouts/BlogLayout/BlogLayout";
import { useNavigate, useSearchParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import BlogPostSummaryCard from "../../components/Cards/BlogPostSummaryCard";
import moment from "moment/moment";

const SearchPosts = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");

  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.POSTS.SEARCH, {
        params: { q: query },
      });
      if (response.data) {
        setSearchResults(response.data || []);
      }
    } catch (error) {
      console.error("Error searching post:", error);
    }
  };

  const handleClick = (post) => {
    navigate(`/story/${post.slug}`);
  };

  useEffect(() => {
    handleSearch();

    return () => {};
  });

  return (
    <BlogLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0">
        <h3 className="text-lg font-medium">
          Showing search results matching "
          <span className="font-semibold">{query}</span>"
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {searchResults.length > 0 &&
            searchResults.map((item) => (
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
    </BlogLayout>
  );
};

export default SearchPosts;
