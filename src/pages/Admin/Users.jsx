import React, { useCallback, useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { LuLoaderCircle, LuGalleryVerticalEnd, LuSearch } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import moment from "moment";
import Modal from "../../components/Modal";
import toast from "react-hot-toast";
import DeleteAlertContent from "../../components/DeleteAlertContent";
import debounce from "lodash.debounce";
import UserSummaryCard from "../../components/Cards/UserSummaryCard";

const Users = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    open: false,
    data: null,
  });

  // fetch all users
  const getAllUsers = async (pageNumber = 1) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(API_PATHS.AUTH.GET_ALL, {
        params: { page: pageNumber },
      });

      const { users, totalPages } = response.data;

      setUsers((prevUsers) =>
        pageNumber === 1 ? users : [...prevUsers, ...users]
      );
      setTotalPages(totalPages);
      setPage(pageNumber);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Search users
  const searchUsers = async (query) => {
    try {
      setIsSearching(true);
      const response = await axiosInstance.get(API_PATHS.AUTH.SEARCH, {
        params: { q: query },
      });
      setUsers(response.data);
      setTotalPages(1);
      setPage(1);
    } catch (error) {
      console.error("Error searching users:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  const DebouncedSearch = useCallback(
    debounce((query) => {
      if (query.trim() === "") {
        getAllUsers(1);
      } else {
        searchUsers(query);
      }
    }, 500),
    []
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    DebouncedSearch(e.target.value);
  };

  // delete user
  const deleteUser = async (userId) => {
    try {
      await axiosInstance.delete(API_PATHS.AUTH.DELETE(userId));

      toast.success("User Deleted Successfully");
      setOpenDeleteAlert({
        open: false,
        data: null,
      });
      getAllUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Load more
  const handleLoadMore = () => {
    if (page < totalPages) {
      getAllUsers(page + 1);
    }
  };

  useEffect(() => {
    getAllUsers(1);
  }, []);

  return (
    <DashboardLayout activeMenu="Users">
      <div className="w-auto sm:max-w-[900px] mx-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold mt-5 mb-5">Users</h2>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-3">
          <div className="w-full sm:w-auto flex items-center gap-2">
            <LuSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              onChange={handleSearchChange}
              className="form-input text-base w-full sm:w-64"
            />
          </div>
        </div>

        {isLoading && (
          <LuLoaderCircle className="animate-spin text-2xl text-rose-100" />
        )}

        <div className="mt-5">
          {users.map((user) => (
            <UserSummaryCard
              key={user._id}
              title={user.name}
              imgUrl={user.profileImageUrl || ""}
              onClick={() => navigate(`/admin/users/edit/${user._id}`)}
              updatedOn={
                user.updatedAt
                  ? moment(user.updatedAt).format("Do MMM YYYY")
                  : "-"
              }
              onDelete={() =>
                setOpenDeleteAlert({ open: true, data: user._id })
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
            content="Are you sure you want to delete this user?"
            onDelete={() => deleteUser(openDeleteAlert.data)}
          />
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default Users;
