/* global process */

/* fetchSitemaps.js */
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

// Load environment variables from .env
dotenv.config();

// Your backend URL
const BASE_URL = process.env.VITE_APP_URL;
if (!BASE_URL) {
  console.error("Error: APP_URL not defined in .env");
  process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// List of sitemaps to fetch from backend
const sitemaps = [
  { url: "/api/sitemap-home.xml", filename: "sitemap-home.xml" },
  { url: "/api/sitemap-posts.xml", filename: "sitemap-posts.xml" },
  { url: "/api/sitemap-pages.xml", filename: "sitemap-pages.xml" },
  { url: "/api/sitemap-tags.xml", filename: "sitemap-tags.xml" },
  { url: "/api/sitemap-index.xml", filename: "sitemap-index.xml" },
];

async function fetchAndSaveSitemap(sitemap) {
  try {
    const res = await fetch(`${BASE_URL}${sitemap.url}`);
    if (!res.ok) throw new Error(`Failed to fetch ${sitemap.url}`);
    const text = await res.text();

    // Save to frontend public folder
    const filePath = path.join(__dirname, "..", "public", sitemap.filename);
    fs.writeFileSync(filePath, text, "utf8");
    console.log(`Saved sitemap: ${filePath}`);
  } catch (error) {
    console.error(`Error fetching ${sitemap.url}:`, error.message);
  }
}

(async () => {
  console.log("Fetching sitemaps from backend...");

  for (const sitemap of sitemaps) {
    await fetchAndSaveSitemap(sitemap);
  }

  console.log("All sitemaps updated successfully!");
})();
