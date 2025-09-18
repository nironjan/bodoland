import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import { LuLoaderCircle } from "react-icons/lu";

const UserEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    profileImageUrl: "",
    role: "member",
  });

  const [isLoading, setIsLoading] = useState(false);

  // fetch user by ID (for prefill)
  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.AUTH.USER_BY_ID(id));
      const user = res.data;
      setFormData({
        name: user.name,
        email: user.email,
        bio: user.bio || "",
        profileImageUrl: user.profileImageUrl || "",
        role: user.role,
      });
    } catch (err) {
      console.error("Error fetching user:", err);
      toast.error("Failed to load user details");
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  // handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // update user
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await axiosInstance.put(API_PATHS.AUTH.UPDATE(id), formData);
      toast.success("User updated successfully");
      navigate("/admin/users"); // go back to users list
    } catch (err) {
      console.error("Error updating user:", err);
      toast.error(err.response?.data?.message || "Failed to update user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout activeMenu="Users">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">Edit User</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              className="form-input w-full"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              className="form-input w-full"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Bio</label>
            <textarea
              name="bio"
              className="form-input w-full"
              rows="3"
              value={formData.bio}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Profile Image URL
            </label>
            <input
              type="text"
              name="profileImageUrl"
              className="form-input w-full"
              value={formData.profileImageUrl}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Role</label>
            <select
              name="role"
              className="form-input w-full"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center"
          >
            {isLoading && (
              <LuLoaderCircle className="animate-spin mr-2 text-lg" />
            )}
            {isLoading ? "Updating..." : "Update User"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default UserEditor;
