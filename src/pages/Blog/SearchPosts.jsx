import React, { useEffect, useState } from "react";
import BlogLayout from "../../components/layouts/BlogLayout/BlogLayout";
import { useNavigate, useSearchParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import BlogPostSummaryCard from "../../components/Cards/BlogPostSummaryCard";
import moment from "moment/moment";
import Meta from "../../components/Meta";

const SearchPosts = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");

  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.POSTS.SEARCH, {
        params: { q: query },
      });
      if (response.data) {
        setSearchResults(response.data || []);
      }
    } catch (error) {
      console.error("Error searching post:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (post) => {
    navigate(`/story/${post.slug}`);
  };

  useEffect(() => {
    handleSearch();
  }, [query]);

  return (
    <BlogLayout>
      <Meta
        title={
          searchResults.length > 0
            ? `Search Results for "${query}" | The Bodoland`
            : `No results for "{query}" | The Bodoland`
        }
        description={
          searchResults.length > 0
            ? `Found ${searchResults.length} article(s) matching "${query}" on The Bodoland. Read the latest news and stories.`
            : `No articles found matching "${query}" on The Bodoland. Try another keyword.`
        }
        image={searchResults.length > 0 ? searchResults[0]?.coverImageUrl : ""}
        url={`${window.location.origin}/search?query=${encodeURIComponent(
          query
        )}`}
        keywords={`${query}, news, latest story`}
        author="The Bodoland Team"
        section="News"
        noIndex={true}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0">
        <h3 className="text-lg font-medium">
          {loading ? (
            <span className="animate-pulse bg-gray-200 rounded px-8 py-2 inline-block" />
          ) : (
            <>
              Showing search results matching "
              <span className="font-semibold">{query}</span>"
            </>
          )}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {loading &&
            Array.from({ length: 6 }).map((_, idx) => (
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
            searchResults.length > 0 &&
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

        {!loading && searchResults.length === 0 && (
          <p className="text-gray-500 mt-6">No results found for "{query}".</p>
        )}
      </div>
    </BlogLayout>
  );
};

export default SearchPosts;
