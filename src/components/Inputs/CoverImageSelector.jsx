import React, { useRef, useState, useEffect } from "react";
import { LuTrash, LuFileImage } from "react-icons/lu";
import uploadImage from "../../utils/uploadImage"; // your utility to upload to /api/auth/upload-image
import toast from "react-hot-toast";

const CoverImageSelector = ({
  setImage,
  preview,
  setPreview,
  setFileId,
  folder = "/article",
}) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(preview || null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // Keep previewUrl in sync with parent
    setPreviewUrl(preview || null);
  }, [preview]);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImage(file);
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
    if (setPreview) setPreview(localPreview);

    // Upload to ImageKit
    setUploading(true);
    try {
      const res = await uploadImage(file, folder);

      if (res?.imageUrl && res?.fileId) {
        setImage(res.imageUrl); // Set the uploaded URL
        setPreview(res.imageUrl); // Update preview
        if (setFileId) setFileId(res.fileId); // Track fileId for backend
      } else {
        toast.error("Image upload failed. Please try again.");
        setPreviewUrl(null);
        setImage(null);
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Image upload failed. Please try again.");
      setPreviewUrl(null);
      setImage(null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);
    if (setPreview) setPreview(null);
    if (setFileId) setFileId(null);
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };

  return (
    <div className="mb-6">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {!previewUrl ? (
        <div
          className={`w-full h-56 flex flex-col items-center justify-center gap-2 bg-gray-50/50 rounded-md border border-dashed border-gray-300 cursor-pointer relative ${
            uploading ? "opacity-50 pointer-events-none" : ""
          }`}
          onClick={onChooseFile}
        >
          <div className="w-14 h-14 flex items-center justify-center bg-sky-50 rounded-full">
            <LuFileImage className="text-xl text-sky-600" />
          </div>
          <p className="text-sm text-gray-700">
            {uploading ? "Uploading..." : "Click to upload a cover image"}
          </p>
        </div>
      ) : (
        <div className="relative w-full h-56">
          <img
            src={previewUrl}
            alt="Cover Image"
            className="w-full h-full object-cover rounded-md"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-md cursor-pointer"
          >
            <LuTrash />
          </button>
        </div>
      )}
    </div>
  );
};

export default CoverImageSelector;
