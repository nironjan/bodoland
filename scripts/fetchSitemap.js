/* global process */

import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();

const BASE_URL = process.env.VITE_APP_URL;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sitemaps = [
  { url: "/api/sitemap-home.xml", filename: "sitemap-home.xml" },
  { url: "/api/sitemap-posts.xml", filename: "sitemap-posts.xml" },
  { url: "/api/sitemap-pages.xml", filename: "sitemap-pages.xml" },
  { url: "/api/sitemap-tags.xml", filename: "sitemap-tags.xml" },
  { url: "/api/sitemap-index.xml", filename: "sitemap-index.xml" },
];

(async () => {
  try {
    for (const sitemap of sitemaps) {
      const res = await fetch(`${BASE_URL}${sitemap.url}`);
      if (!res.ok) throw new Error(`Failed to fetch ${sitemap.url}`);
      const text = await res.text();

      const filePath = path.join(__dirname, "..", "public", sitemap.filename);
      fs.writeFileSync(filePath, text, "utf8");
      console.log(`Saved: ${filePath}`);
    }
    console.log("All sitemaps saved to public folder");
  } catch (error) {
    console.error("Error fetching sitemaps:", error);
  }
})();
