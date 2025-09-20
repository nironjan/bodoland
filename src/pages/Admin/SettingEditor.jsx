import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { LuLoaderCircle, LuSend } from "react-icons/lu";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import LogoUploader from "../../components/Inputs/LogoUploader";

const SettingEditor = () => {
  const [loading, setLoading] = useState(false);
  const [setting, setSetting] = useState(null);
  const [formData, setFormData] = useState({
    siteTitle: "",
    description: "",
    aboutSite: "",
    logoImageUrl: "",
    logoImageFileId: "",
    logoPreview: "",
    socialLinks: {
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: "",
      youtube: "",
    },
  });

  // Fetch settings
  const getSetting = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(API_PATHS.SETTINGS.GET);
      if (data && !data.message) {
        setSetting(data);
        setFormData({
          siteTitle: data.siteTitle || "",
          description: data.description || "",
          aboutSite: data.aboutSite || "",
          logoImageUrl: data.logoImageUrl || "",
          logoImageFileId: data.logoImageFileId || "",
          logoPreview: data.logoImageUrl || "",
          socialLinks: {
            facebook: data.socialLinks?.facebook || "",
            twitter: data.socialLinks?.twitter || "",
            instagram: data.socialLinks?.instagram || "",
            linkedin: data.socialLinks?.linkedin || "",
            youtube: data.socialLinks?.youtube || "",
          },
        });
      } else {
        setSetting(null);
      }
    } catch (error) {
      console.error("Error fetching setting:", error);
      setSetting(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSetting();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("socialLinks")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [key]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Create or update setting
  const handlePublish = async () => {
    if (!formData.siteTitle || !formData.aboutSite) {
      toast.error("Site Title and About Site are required");
      return;
    }

    setLoading(true);

    try {
      const response = setting
        ? await axiosInstance.put(API_PATHS.SETTINGS.UPDATE, formData)
        : await axiosInstance.post(API_PATHS.SETTINGS.CREATE, formData);

      if (response.data) {
        toast.success(
          `Setting ${setting ? "updated" : "created"} successfully`
        );
        getSetting(); // Refresh
      }
    } catch (error) {
      console.error("Error saving setting:", error);
      toast.error("Error saving setting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout activeMenu="Settings">
      <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-5 my-4">
        <div className="form-card p-6 col-span-12 md:col-span-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base md:text-lg font-medium">
              {setting ? "Edit Setting" : "Create Setting"}
            </h2>
            <button
              className="flex items-center gap-2.5 text-[13px] font-medium text-sky-600 hover:text-white hover:bg-linear-to-r hover:from-sky-500 hover:to-indigo-500 rounded px-3 py-[3px] border border-sky-500 hover:border-sky-50 cursor-pointer transition-all"
              disabled={loading}
              onClick={handlePublish}
            >
              {loading ? (
                <LuLoaderCircle className="animate-spin text-[15px]" />
              ) : (
                <LuSend className="text-sm" />
              )}
              {setting ? " Update" : " Create"}
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-600">
                Site Title
              </label>
              <input
                name="siteTitle"
                className="form-input"
                value={formData.siteTitle}
                onChange={handleChange}
              />
            </div>

            <LogoUploader
              logoUrl={formData.logoPreview}
              logoFileId={formData.logoImageFileId}
              onUpload={(url, fileId) => {
                setFormData((prev) => ({
                  ...prev,
                  logoImageUrl: url,
                  logoImageFileId: fileId,
                  logoPreview: url,
                }));
              }}
            />

            <div>
              <label className="text-sm font-medium text-slate-600">
                Site Description
              </label>
              <textarea
                name="description"
                className="form-textarea"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-600">
                About Site
              </label>
              <textarea
                name="aboutSite"
                className="form-textarea"
                value={formData.aboutSite}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-600">
                Social Links
              </label>
              {Object.keys(formData.socialLinks).map((key) => (
                <div className="mb-3" key={key}>
                  <label className="block capitalize">{key}</label>
                  <input
                    type="url"
                    name={`socialLinks.${key}`}
                    value={formData.socialLinks[key] || ""}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingEditor;
