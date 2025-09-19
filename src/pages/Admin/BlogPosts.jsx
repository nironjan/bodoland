import React, { useCallback, useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import {
  LuGalleryVerticalEnd,
  LuLoaderCircle,
  LuPlus,
  LuSearch,
} from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import Tabs from "../../components/Tabs";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import moment from "moment";
import BlogPostSumaryCard from "../../components/Cards/BlogPostSumaryCard";
import DeleteAlertContent from "../../components/DeleteAlertContent";
import Modal from "../../components/Modal";
import toast from "react-hot-toast";
import debounce from "lodash.debounce";

const BlogPosts = () => {
  const navigate = useNavigate();

  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [blogPostList, setBlogPostList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    open: false,
    data: null,
  });

  // fetch all blog
  const getAllPosts = async (pageNumber = 1) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(API_PATHS.POSTS.GET_ALL, {
        params: {
          status: filterStatus.toLowerCase(),
          page: pageNumber,
        },
      });

      const { posts, totalPages, counts } = response.data;

      setBlogPostList((prevPosts) =>
        pageNumber === 1 ? posts : [...prevPosts, ...posts]
      );
      setTotalPages(totalPages);
      setPage(pageNumber);

      // Map statusSummary
      const statusSummary = counts || {};

      const statusArray = [
        { label: "All", count: statusSummary.all || 0 },
        { label: "Published", count: statusSummary.published || 0 },
        { label: "Draft", count: statusSummary.draft || 0 },
      ];
      setTabs(statusArray);
    } catch (error) {
      console.error("Error on fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Search posts
  const searchPosts = async (query) => {
    try {
      setIsSearching(true);
      const response = await axiosInstance.get(API_PATHS.POSTS.SEARCH, {
        params: { q: query },
      });
      setBlogPostList(response.data);
      setTotalPages(1);
      setPage(1);
    } catch (error) {
      console.error("Error searching posts:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search for live typing
  const DebouncedSearch = useCallback(
    debounce((query) => {
      if (query.trim() === "") {
        getAllPosts(1);
      } else {
        searchPosts(query);
      }
    }, 500),
    [filterStatus]
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    DebouncedSearch(e.target.value);
  };

  // // Add if add Search Button
  // const handleSearchClick = () => {
  //   if (searchQuery.trim() === "") getAllPosts(1);
  //   else searchPosts(searchQuery);
  // };

  // delete blog post
  const deletePost = async (postId) => {
    try {
      await axiosInstance.delete(API_PATHS.POSTS.DELETE(postId));

      toast.success("Blog Post Deleted Successfully");
      setOpenDeleteAlert({
        open: false,
        data: null,
      });
      getAllPosts();
    } catch (error) {
      console.error("Error deleting blog post:", error);
    }
  };

  // Load more posts
  const handleLoadMore = () => {
    if (page < totalPages) {
      getAllPosts(page + 1);
    }
  };

  useEffect(() => {
    getAllPosts(1);
  }, [filterStatus]);

  return (
    <DashboardLayout activeMenu="Stories">
      <div className="w-auto sm:max-w-[900px] mx-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold mt-5 mb-5">Your Stories</h2>

          <button
            className="btn-small"
            onClick={() => navigate("/admin/post/create")}
          >
            <LuPlus className="text-[18px]" /> Create Story
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-3">
          <Tabs
            tabs={tabs}
            activeTab={filterStatus}
            setActiveTab={setFilterStatus}
          />

          <div className="w-full sm:w-auto flex items-center gap-2">
            <input
              type="text"
              placeholder="Search posts..."
              onChange={handleSearchChange}
              className="form-input text-base w-full sm:w-64"
            />
          </div>
        </div>
        {isLoading && (
          <LuLoaderCircle className="animate-spin text-2xl text-rose-100" />
        )}

        <div className="mt-5">
          {blogPostList.map((post) => (
            <BlogPostSumaryCard
              key={post._id}
              title={post.title}
              imgUrl={post.coverImageUrl}
              updatedOn={
                post.updatedAt
                  ? moment(post.updatedAt).format("Do MMM YYYY")
                  : "-"
              }
              tags={post.tags}
              likes={post.likes}
              views={post.views}
              onClick={() => navigate(`/admin/post/edit/${post.slug}`)}
              onDelete={() =>
                setOpenDeleteAlert({ open: true, data: post._id })
              }
            />
          ))}

          {!isSearching && page < totalPages && (
            <div className="flex items-center justify-center mb-8">
              <button
                className="flex items-center gap-3 text-sm text-black font-medium bg-rose-50 px-7 py-2.5 rounded-full text-nowrap hover:scale-105 transition-all cursor-pointer"
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
      </div>

      <Modal
        isOpen={openDeleteAlert?.open}
        onClose={() => {
          setOpenDeleteAlert({ open: false, data: null });
        }}
        title="Delete Alert"
      >
        <div className="w-[70vw] md:w-[30vw]">
          <DeleteAlertContent
            content="Are you sure you want to dlete this blog post?"
            onDelete={() => deletePost(openDeleteAlert.data)}
          />
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default BlogPosts;
