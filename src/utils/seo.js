// SEO utility functions for dynamic meta tag updates

export const updateMetaDescription = (description) => {
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute("content", description);
  }

  // Also update Open Graph description
  const ogDescription = document.querySelector(
    'meta[property="og:description"]'
  );
  if (ogDescription) {
    ogDescription.setAttribute("content", description);
  }

  // Also update Twitter description
  const twitterDescription = document.querySelector(
    'meta[name="twitter:description"]'
  );
  if (twitterDescription) {
    twitterDescription.setAttribute("content", description);
  }
};

export const updateCanonicalUrl = (url) => {
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) {
    canonical.setAttribute("href", url);
  }

  // Also update Open Graph URL
  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) {
    ogUrl.setAttribute("content", url);
  }
};

export const updatePageTitle = (title) => {
  document.title = title;

  // Also update Open Graph title
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) {
    ogTitle.setAttribute("content", title);
  }

  // Also update Twitter title
  const twitterTitle = document.querySelector('meta[name="twitter:title"]');
  if (twitterTitle) {
    twitterTitle.setAttribute("content", title);
  }
};

// Combined SEO update function
export const updateSEO = ({ title, description, url }) => {
  if (title) updatePageTitle(title);
  if (description) updateMetaDescription(description);
  if (url) updateCanonicalUrl(url);
};

// SEO configurations for different routes
export const SEO_CONFIG = {
  home: {
    title: "Nihesh Rachakonda | Portfolio - Choose Your Experience",
    description:
      "Choose your portfolio experience: Minimal clean interface or interactive 3D animations. Full Stack Developer portfolio by Nihesh Rachakonda.",
    url: "https://niheshr.com/",
  },
  minimal: {
    title: "Minimal Portfolio - Nihesh Rachakonda",
    description:
      "Clean, minimal portfolio experience showcasing Nihesh Rachakonda's skills, projects, and experience as a Full Stack Developer.",
    url: "https://niheshr.com/minimal",
  },
  gooey: {
    title: "Gooey Experience - Nihesh Rachakonda",
    description:
      "Interactive 3D portfolio experience with custom animations, 3D models, and immersive interactions by Nihesh Rachakonda.",
    url: "https://niheshr.com/gooey",
  },
};
