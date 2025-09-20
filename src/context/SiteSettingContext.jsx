// src/context/SiteSettingContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import toast from "react-hot-toast";

// Create context
const SiteSettingContext = createContext({});

// Provider component
export const SiteSettingProvider = ({ children }) => {
  const [siteSetting, setSiteSetting] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSiteSetting = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(API_PATHS.SETTINGS.GET);
      if (data && !data.message) {
        setSiteSetting(data);
      }
    } catch (error) {
      console.error("Failed to fetch site setting:", error);
      toast.error("Failed to fetch site settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSiteSetting();
  }, []);

  return (
    <SiteSettingContext.Provider
      value={{ siteSetting, loading, refresh: fetchSiteSetting }}
    >
      {children}
    </SiteSettingContext.Provider>
  );
};

// Custom hook to use site setting
export const useSiteSetting = () => {
  return useContext(SiteSettingContext);
};
