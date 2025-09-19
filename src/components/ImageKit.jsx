import React from "react";
import { Image } from "@imagekit/react";

const ImageKitWrapper = ({ src, className, w, h, alt }) => {
  const urlEndpoint = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;

  // If no src or it’s falsy, return null or placeholder
  if (!src) {
    // optionally return a placeholder image or just null
    return null;
  }

  // Normalize src: if it is a full URL and matches your endpoint, don't double-up
  let finalSrc = src;

  try {
    const srcUrl = new URL(src);
    // If the origin + pathname starts with the endpoint URL
    if (src.startsWith(urlEndpoint)) {
      // Remove the endpoint part so that ImageKit uses the relative path
      finalSrc = src.replace(urlEndpoint, "");
    }
  } catch (e) {
    // Not a full URL, or invalid URL, leave finalSrc as is
  }

  return (
    <Image
      urlEndpoint={urlEndpoint}
      src={finalSrc}
      alt={alt}
      className={className}
      loading="lazy"
      width={w}
      height={h}
      transformation={[{ quality: "auto", format: "auto" }]}
      // optional: srcSet or responsive props if needed
    />
  );
};

export default ImageKitWrapper;
