import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import MDEditor, { commands } from "@uiw/react-md-editor";
import {
  LuLoaderCircle,
  LuSave,
  LuSend,
  LuSparkles,
  LuTrash2,
} from "react-icons/lu";
import { useNavigate, useParams } from "react-router-dom";
import CoverImageSelector from "../../components/Inputs/CoverImageSelector";
import TagInput from "../../components/Inputs/TagInput";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import SkeletonLoader from "../../components/Loader/SkeletonLoader";
import BlogPostIdeaCard from "../../components/Cards/BlogPostIdeaCard";
import Modal from "../../components/Modal";
import GenerateBlogPostForm from "./components/GenerateBlogPostForm";
import toast from "react-hot-toast";
import { getToastMessageByType } from "../../utils/helper";
import DeleteAlertContent from "../../components/DeleteAlertContent";

const BlogPostEditor = ({ isEdit }) => {
  const navigate = useNavigate();
  const { postSlug = "" } = useParams();

  const [postData, setPostData] = useState({
    id: "",
    title: "",
    description: "",
    content: "",
    coverImageUrl: "",
    coverImageFileId: "",
    coverPreview: "",
    coverFile: null,
    tags: "",
    isDraft: "",
    generatedByAI: false,
    language: "en",
  });

  const [postIdeas, setPostIdeas] = useState([]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [openBlogPostGenForm, setOpenBlogPostGenForm] = useState({
    open: false,
    data: null,
  });
  const [ideaLoading, setIdeaLoading] = useState(false);

  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const handleValueChange = (key, value) => {
    setPostData((prevData) => ({ ...prevData, [key]: value }));
  };

  // Generate Blog Post Ideas Using AI
  const generatePostIdeas = async () => {
    setIdeaLoading(true);
    try {
      const aiResponse = await axiosInstance.post(
        API_PATHS.AI.GENERATE_BLOG_POST_IDEAS,
        {
          topics: "latest news around Assam",
        }
      );
      const generatedIdeas = aiResponse.data;

      if (generatedIdeas?.length > 0) {
        setPostIdeas(generatedIdeas);
      }
    } catch (error) {
      console.error("Something went wrong. Please try again.", error);
    } finally {
      setIdeaLoading(false);
    }
  };

  // Handle Blog Post Publish
  const handlePublish = async (isDraft) => {
    // let coverImageUrl = "";
    // let coverImageFileId = "";

    if (!postData.title.trim()) {
      setError("Please enter a story title.");
      return;
    }
    if (!postData.content.trim()) {
      setError("Please write some content.");
      return;
    }

    if (!isDraft) {
      if (isEdit) {
        // In edit mode, at least one of coverImageUrl or coverPreview must be present
        if (!postData.coverImageUrl && !postData.coverPreview) {
          setError("Please select a cover image.");
          return;
        }
      } else {
        // In create mode, require coverImageUrl to be present (new post)
        if (!postData.coverImageUrl) {
          setError("Please select a cover image.");
          return;
        }
      }

      if (!postData.tags.length) {
        setError("Please add some story tags.");
        return;
      }
    }

    setLoading(true);
    setError("");

    try {
      const coverImageUrl =
        postData.coverImageUrl || postData.coverPreview || "";
      const coverImageFileId = postData.coverImageFileId || "";

      const reqPayload = {
        title: postData.title,
        description: postData.description,
        content: postData.content,
        coverImageUrl,
        coverImageFileId,
        tags: postData.tags,
        isDraft: isDraft ? true : false,
        generatedByAI: true,
        language: postData.language,
      };

      const response = isEdit
        ? await axiosInstance.put(
            API_PATHS.POSTS.UPDATE(postData.id),
            reqPayload
          )
        : await axiosInstance.post(API_PATHS.POSTS.CREATE, reqPayload);

      if (response.data) {
        toast.success(
          getToastMessageByType(
            isDraft ? "draft" : isEdit ? "edit" : "published"
          )
        );
        navigate("/admin/posts");
      }
    } catch (error) {
      setError("Failed to publish your story. Please try again.");
      console.error("Error on publishing story:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get Post Data By Slug
  const fetchPostDetailsBySlug = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.POSTS.GET_BY_SLUG(postSlug)
      );

      if (response.data) {
        const data = response.data;

        setPostData((prevState) => ({
          ...prevState,
          id: data._id,
          title: data.title,
          description: data.description,
          content: data.content,
          coverPreview: data.coverImageUrl || "",
          coverImageFileId: data.coverImageFileId || "",
          tags: Array.isArray(data.tags) ? data.tags : [],
          isDraft: !!data.isDraft,
          generatedByAI: !!data.generatedByAI,
          language: data.language || "en",
        }));
      }
    } catch (error) {
      console.error("Error fetching post by slug:", error);
      toast.error("Failed to fetch post details. Please try again");
    }
  };

  // Delete Blog Post
  const deletePost = async () => {
    try {
      setLoading(true);
      await axiosInstance.delete(API_PATHS.POSTS.DELETE(postData.id));

      toast.success("Story Deleted Successfully.");
      setOpenDeleteAlert(false);
      navigate("/admin/posts");
    } catch (error) {
      console.error("Error on deleting story:", error);
      toast.error("Failed to delete story. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isEdit) {
      fetchPostDetailsBySlug();
    } else {
      generatePostIdeas();
    }
    return () => {};
  }, []);
  return (
    <DashboardLayout activeMenu="Blog Posts">
      <div className="my-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 my-4">
          <div className="form-card p-6 col-span-12 md:col-span-8">
            <div className="flex items-center justify-between">
              <h2 className="text-base md:text-lg font-medium">
                {!isEdit ? "Add New Story" : "Edit Story"}
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
                Story Title
              </label>

              <input
                placeholder="How to Build a MERN App"
                className="form-input"
                value={postData.title}
                onChange={({ target }) =>
                  handleValueChange("title", target.value)
                }
              />
            </div>

            <div className="mt-4">
              <CoverImageSelector
                image={postData.coverImageUrl}
                setImage={(value) => handleValueChange("coverImageUrl", value)}
                preview={postData.coverPreview}
                setPreview={(value) => handleValueChange("coverPreview", value)}
                setFile={(file) => handleValueChange("coverFile", file)}
                setFileId={(fileId) =>
                  handleValueChange("coverImageFileId", fileId)
                }
              />
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium text-slate-600">
                Description
              </label>

              <textarea
                placeholder="Write Something..."
                className="form-textarea"
                rows="4"
                value={postData.description}
                onChange={({ target }) =>
                  handleValueChange("description", target.value)
                }
              ></textarea>
            </div>

            <div className="mt-3">
              <label className="text-sm font-medium text-slate-600">
                Content
              </label>

              <div data-color-mode="light" className="mt-3">
                <MDEditor
                  value={postData.content}
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

            <div className="mt-3">
              <label className="text-sm font-medium text-slate-600 mb-1 block">
                Language
              </label>
              <select
                value={postData.language}
                onChange={(e) => handleValueChange("language", e.target.value)}
                className="form-input w-full py-2 px-3 border border-gray-300 rounded-md"
              >
                <option value="en">English</option>
                <option value="brx">Bodo</option>
              </select>
            </div>

            <div className="mt-3">
              <label className="text-sm font-medium text-slate-600">Tags</label>

              <TagInput
                tags={postData?.tags || []}
                setTags={(data) => {
                  handleValueChange("tags", data);
                }}
              />
            </div>
          </div>

          {!isEdit && (
            <div className="form-card col-span-12 md:col-span-4 p-0">
              <div className="flex items-center justify-between px-6 pt-6">
                <h4 className="text-sm md:text-base font-medium inline-flex items-center gap-2">
                  <span className="text-sky-600">
                    <LuSparkles />
                  </span>
                  Ideas for your next post
                </h4>

                <button
                  className="bg-linear-to-r from-sky-500 to-cyan-400 text-[13px] font-semibold text-white px-3 py-1 rounded hover:bg-black hover:text-white transition-colors cursor-pointer hover:shadow-2xl hover:shadow-sky-200"
                  onClick={() =>
                    setOpenBlogPostGenForm({ open: true, data: null })
                  }
                >
                  Generate New
                </button>
              </div>

              <div>
                {ideaLoading ? (
                  <div className="p-5">
                    <SkeletonLoader />
                  </div>
                ) : (
                  postIdeas.map((idea, index) => (
                    <BlogPostIdeaCard
                      key={`idea_${index}`}
                      title={idea.title || ""}
                      description={idea.description || ""}
                      tags={idea.tags || []}
                      tone={idea.tone || "casual"}
                      onSelect={() =>
                        setOpenBlogPostGenForm({ open: true, data: idea })
                      }
                    />
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={openBlogPostGenForm?.open}
        onClose={() => {
          setOpenBlogPostGenForm({ open: false, data: null });
        }}
        hideHeader
      >
        <GenerateBlogPostForm
          contentParams={openBlogPostGenForm?.data || null}
          setPostContent={(title, content) => {
            const postInfo = openBlogPostGenForm?.data || null;
            setPostData((prevState) => ({
              ...prevState,
              title: title || prevState.title,
              content: content,
              tags: postInfo?.tags || prevState.tags,
              generatedByAI: true,
            }));
          }}
          handleCloseForm={() => {
            setOpenBlogPostGenForm({ open: false, data: null });
          }}
        />
      </Modal>
      <Modal
        isOpen={openDeleteAlert}
        onClose={() => {
          setOpenDeleteAlert(false);
        }}
        title="Delete Warning"
      >
        <div className="w-[30vw]">
          <DeleteAlertContent
            content="Are you sure you want to delete this story?"
            onDelete={() => deletePost()}
          />
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default BlogPostEditor;
