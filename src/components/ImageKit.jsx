import React from "react";
import { Image } from "@imagekit/react";

const ImageKit = ({ src, className, w, h, alt }) => {
  return (
    <Image
      urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      transformation={[
        {
          quality: "auto", // 🔹 compress automatically
          format: "auto", // 🔹 serve webp/avif if supported
        },
      ]}
      lqip={{ active: true }} // 🔹 blurred preview placeholder
      width={w}
      height={h}
      srcSet={[
        { width: 320, transformation: [{ quality: "auto", format: "auto" }] },
        { width: 640, transformation: [{ quality: "auto", format: "auto" }] },
        { width: 960, transformation: [{ quality: "auto", format: "auto" }] },
        { width: 1200, transformation: [{ quality: "auto", format: "auto" }] },
      ]}
      sizes="(max-width: 640px) 100vw, 
             (max-width: 1024px) 75vw, 
             50vw"
    />
  );
};

export default ImageKit;
