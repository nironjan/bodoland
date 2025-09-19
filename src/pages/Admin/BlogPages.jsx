import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import { LuGalleryVerticalEnd, LuLoaderCircle, LuPlus } from "react-icons/lu";
import Tabs from "../../components/Tabs";
import moment from "moment";
import BlogPageSummaryCard from "../../components/Cards/BlogPageSummaryCard";
import Modal from "../../components/Modal";
import debounce from "lodash.debounce";
import DeleteAlertContent from "../../components/DeleteAlertContent";

const BlogPages = () => {
  const navigate = useNavigate();

  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [blogPageList, setBlogPageList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    open: false,
    data: null,
  });

  // fetch all blog pages
  const getAllPages = async (pageNumber = 1) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(API_PATHS.PAGES.GET_ALL, {
        params: {
          status: filterStatus.toLowerCase(),
          page: pageNumber,
        },
      });

      const { pages, totalPages, counts } = response.data;

      setBlogPageList((prevPages) =>
        pageNumber === 1 ? pages : [...prevPages, ...pages]
      );
      setTotalPages(totalPages);
      setPage(pageNumber);

      // Map Status Summary
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

  // search pages
  const searchPages = async (query) => {
    try {
      setIsSearching(true);
      const response = await axiosInstance.get(API_PATHS.PAGES.SEARCH, {
        params: { q: query },
      });
      setBlogPageList(response.data);
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
        getAllPages(1);
      } else {
        searchPages(query);
      }
    }, 500),
    [filterStatus]
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    DebouncedSearch(e.target.value);
  };

  // Load more posts
  const handleLoadMore = () => {
    if (page < totalPages) {
      getAllPages(page + 1);
    }
  };

  // delete page
  const deletePage = async (pageId) => {
    try {
      await axiosInstance.delete(API_PATHS.PAGES.DELETE(pageId));

      toast.success("Blog Post Deleted Successfully");
      setOpenDeleteAlert({
        open: false,
        data: null,
      });
      getAllPages();
    } catch (error) {
      console.error("Error deleting blog post:", error);
    }
  };

  useEffect(() => {
    getAllPages(1);
  }, [filterStatus]);

  return (
    <DashboardLayout activeMenu="Pages">
      <div className="w-auto sm:max-w-[900px] mx-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold mt-5 mb-5">Blog Pages</h2>

          <button
            className="btn-small"
            onClick={() => navigate("/admin/page/create")}
          >
            <LuPlus className="text-[18px]" />
            Create Page
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
          {blogPageList.map((page) => (
            <BlogPageSummaryCard
              key={page._id}
              title={page.title}
              imgUrl={page.coverImageUrl}
              updatedOn={
                page.updatedAt
                  ? moment(page.updatedAt).format("Do MMM YYYY")
                  : "-"
              }
              onClick={() => navigate(`/admin/page/edit/${page.slug}`)}
              onDelete={() =>
                setOpenDeleteAlert({ open: true, data: page._id })
              }
            />
          ))}

          {page < totalPages && (
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
            content="Are You Sure You Want to Delete this Page?"
            onDelete={() => deletePage(openDeleteAlert.data)}
          />
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default BlogPages;
