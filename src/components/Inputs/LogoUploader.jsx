import React, { useRef, useState, useEffect } from "react";
import { LuTrash, LuFileImage } from "react-icons/lu";
import uploadImage from "../../utils/uploadImage";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";

const LogoUploader = ({ logoUrl, logoFileId, onUpload, folder = "/logo" }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(logoUrl || null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setPreviewUrl(logoUrl || null);
  }, [logoUrl]);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
    setUploading(true);

    try {
      const res = await uploadImage(file, folder);
      const imageUrl = res.url || res.imageUrl;
      const fileId = res.fileId;

      if (!imageUrl || !fileId) throw new Error("Upload failed");

      // Delete old logo if exists
      if (logoFileId && logoFileId !== fileId) {
        await axiosInstance
          .delete(`/api/auth/delete-image/${logoFileId}`)
          .catch(console.error);
      }

      onUpload(imageUrl, fileId);
      setPreviewUrl(imageUrl);
      toast.success("Logo uploaded successfully");
    } catch (err) {
      console.error("Logo upload error:", err);
      toast.error("Logo upload failed");
      setPreviewUrl(logoUrl || null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    if (onUpload) onUpload(null, null); // reset parent state
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
            {uploading ? "Uploading..." : "Click to upload logo"}
          </p>
        </div>
      ) : (
        <div className="relative w-full h-56 bg-gray-50 flex items-center justify-center rounded-md">
          <img
            src={previewUrl}
            alt="Logo Preview"
            className="max-h-full max-w-full object-contain"
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

export default LogoUploader;
