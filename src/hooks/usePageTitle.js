import { useEffect } from "react";
import { updateSEO, SEO_CONFIG } from "../utils/seo";

export const usePageTitle = (title, route = null) => {
  useEffect(() => {
    const previousTitle = document.title;

    // If route is provided, use SEO config
    if (route && SEO_CONFIG[route]) {
      updateSEO(SEO_CONFIG[route]);
    } else {
      // Fallback to just updating title
      document.title = title;
    }

    return () => {
      document.title = previousTitle;
    };
  }, [title, route]);
};
