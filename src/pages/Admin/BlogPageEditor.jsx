import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import MDEditor, { commands } from "@uiw/react-md-editor";
import { LuLoaderCircle, LuSave, LuSend, LuTrash2 } from "react-icons/lu";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import { getToastMessageByType } from "../../utils/helper";
import CoverImageSelector from "../../components/Inputs/CoverImageSelector";
import Modal from "../../components/Modal";
import DeleteAlertContent from "../../components/DeleteAlertContent";

const BlogPageEditor = ({ isEdit }) => {
  const navigate = useNavigate();
  const { pageSlug = "" } = useParams();

  const [pageData, setPageData] = useState({
    id: "",
    title: "",
    content: "",
    coverImageUrl: "",
    coverImageFileId: "",
    coverPreview: "",
    coverFile: null,
    isDraft: "",
    generatedByAI: false,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const handleValueChange = (key, value) => {
    setPageData((prevData) => ({ ...prevData, [key]: value }));
  };

  // Handle Page Publish
  const handlePublish = async (isDraft) => {
    // let coverImageUrl = "";

    if (!pageData.title.trim()) {
      setError("Please enter a page title");
      return;
    }
    if (!pageData.content.trim()) {
      setError("Please write some content");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const coverImageUrl =
        pageData.coverImageUrl || pageData.coverPreview || "";
      const coverImageFileId = pageData.coverImageFileId || "";

      const reqPayload = {
        title: pageData.title,
        content: pageData.content,
        coverImageUrl,
        coverImageFileId,
        isDraft: isDraft,
        generatedByAI: false,
      };

      const response = isEdit
        ? await axiosInstance.put(
            API_PATHS.PAGES.UPDATE(pageData.id),
            reqPayload
          )
        : await axiosInstance.post(API_PATHS.PAGES.CREATE, reqPayload);

      if (response.data) {
        toast.success(
          getToastMessageByType(
            isDraft ? "draft" : isEdit ? "edit" : "published"
          )
        );
        navigate("/admin/pages");
      }
    } catch (error) {
      setError("Failed to publish your page. Please try again.");
      console.error("Error on publishing page:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get Page by Slug
  const fetchPageDetailsBySlug = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.PAGES.GET_BY_SLUG(pageSlug)
      );

      if (response.data) {
        const data = response.data;

        setPageData((prevState) => ({
          ...prevState,
          id: data._id,
          title: data.title,
          content: data.content,
          coverPreview: data.coverImageUrl || "",
          coverImageUrl: data.coverImageUrl || "",
          coverImageFileId: data.coverImageFileId || "",
          isDraft: !!data.isDraft,
          generatedByAI: !!data.generatedByAI,
        }));
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to fetch post details. Please try again");
    }
  };

  // Delete Blog Page
  const deletePage = async () => {
    try {
      setLoading(true);
      await axiosInstance.delete(API_PATHS.PAGES.DELETE(pageData.id));

      toast.success("Page Deleted Successfully.");
      setOpenDeleteAlert(false);
      navigate("/admin/pages");
    } catch (error) {
      console.error("Error on deleting page", error);
      toast.error("Failed to delete page. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isEdit) {
      fetchPageDetailsBySlug();
    }
    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Pages">
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 my-4">
          <div className="form-card p-6 col-span-12 md:col-span-8">
            <div className="flex items-center justify-between">
              <h2 className="text-base md:text-lg font-medium">
                {!isEdit ? "Add New Page" : "Edit Page"}
              </h2>

              <div className="flex items-center gap-3">
                {isEdit && (
                  <button
                    className="flex items-center gap-2.5 text-[13px] font-medium text-rose-500 bg-rose-50/60 px-1.5 rounded md:px-3 py-1 md:py-[3px] border border-rose-50 hover:border-rose-300 cursor-pointer hover:scale-[1.02] transition-all"
                    disabled={loading}
                    onClick={() => setOpenDeleteAlert(true)}
                  >
                    <LuTrash2 className="text-sm" />{" "}
                    <span className="hidden md:block">Delete</span>
                  </button>
                )}

                <button
                  className="flex items-center gap-2.5 text-[13px] font-medium text-sky-500 bg-sky-50/60 rounded px-1.5 md:px-3 py-1 md:py-[3px] border border-sky-100 hover:border-sky-400 cursor-pointer hover:scale-[1.02] transition-all"
                  disabled={loading}
                  onClick={() => handlePublish(true)}
                >
                  <LuSave className="text-sm" />{" "}
                  <span className="hidden md:block">Save as Draft</span>
                </button>

                <button
                  className="flex items-center gap-2.5 text-[13px] font-medium text-sky-600 hover:text-white hover:bg-linear-to-r hover:from-sky-500 hover:to-indigo-500 rounded px-3 py-[3px] border border-sky-500 hover:border-sky-50 cursor-pointer transition-all"
                  disabled={loading}
                  onClick={() => handlePublish(false)}
                >
                  {loading ? (
                    <LuLoaderCircle className="animate-spin text-[15px]" />
                  ) : (
                    <LuSend className="text-sm" />
                  )}{" "}
                  Publish
                </button>
              </div>
            </div>

            {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

            <div className="mt-4">
              <label className="text-sm font-medium text-slate-600">
                Page Title
              </label>

              <input
                placeholder="How to Build a MERN App"
                className="form-input"
                value={pageData.title}
                onChange={({ target }) =>
                  handleValueChange("title", target.value)
                }
              />
            </div>

            <div className="mt-4">
              <CoverImageSelector
                folder="/pages"
                image={pageData.coverImageUrl}
                setImage={(value) => {
                  handleValueChange("coverImageUrl", value);
                  handleValueChange("coverPreview", value);
                }}
                preview={pageData.coverPreview}
                setPreview={(value) => handleValueChange("coverPreview", value)}
                setFileId={(fileId) =>
                  handleValueChange("coverImageFileId", fileId)
                }
              />
            </div>

            <div className="mt-3">
              <label className="text-sm font-medium text-slate-600">
                Content
              </label>

              <div data-color-mode="light" className="mt-3">
                <MDEditor
                  value={pageData.content}
                  onChange={(data) => {
                    handleValueChange("content", data);
                  }}
                  commands={[
                    commands.bold,
                    commands.italic,
                    commands.strikethrough,
                    commands.hr,
                    commands.title,
                    commands.divider,
                    commands.link,
                    commands.code,
                    commands.image,
                    commands.unorderedListCommand,
                    commands.orderedListCommand,
                    commands.checkedListCommand,
                  ]}
                />
              </div>
            </div>
          </div>

          {/* AI Content */}
        </div>
      </div>

      <Modal
        isOpen={openDeleteAlert}
        onClose={() => {
          setOpenDeleteAlert(false);
        }}
        title="Delete Warning"
      >
        <div className="w-[30vw]">
          <DeleteAlertContent
            content="Are you Sure You Want to Delete this Page?"
            onDelete={() => deletePage()}
          />
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default BlogPageEditor;
