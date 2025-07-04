import React, { useState, useEffect } from "react";
import { isResourceLoaded } from "../../../utils/resourcePreloader";

const LazyImage = ({ src, alt, className, style, ...props }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(isResourceLoaded(src));

  useEffect(() => {
    // If already preloaded, skip
    if (isLoaded) return;

    // Use IntersectionObserver to detect when the image is in view
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    ); // Start loading when 200px away from viewport

    const imgElement = document.createElement("img");

    if (isVisible) {
      imgElement.src = src;
      imgElement.onload = () => setIsLoaded(true);
      imgElement.onerror = () => setIsLoaded(true); // Still remove placeholder on error
    }

    return () => {
      observer.disconnect();
    };
  }, [src, isVisible, isLoaded]);

  return (
    <>
      {!isLoaded && (
        <div
          className={`${className} bg-gray-200 dark:bg-gray-800 animate-pulse`}
          style={style}
        />
      )}
      {(isLoaded || isVisible) && (
        <img
          src={src}
          alt={alt}
          className={className}
          style={{
            ...style,
            display: !isLoaded ? "none" : "block",
          }}
          {...props}
        />
      )}
    </>
  );
};

export default LazyImage;
