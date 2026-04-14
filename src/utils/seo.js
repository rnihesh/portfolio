// SEO utility functions for dynamic meta tag updates

export const updateMetaDescription = (description) => {
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute("content", description);
  }

  // Also update Open Graph description
  const ogDescription = document.querySelector(
    'meta[property="og:description"]',
  );
  if (ogDescription) {
    ogDescription.setAttribute("content", description);
  }

  // Also update Twitter description
  const twitterDescription = document.querySelector(
    'meta[name="twitter:description"]',
  );
  if (twitterDescription) {
    twitterDescription.setAttribute("content", description);
  }
};

export const updateMetaKeywords = (keywords) => {
  const metaKeywords = document.querySelector('meta[name="keywords"]');
  if (metaKeywords) {
    metaKeywords.setAttribute("content", keywords);
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
export const updateSEO = ({ title, description, keywords, url }) => {
  if (title) updatePageTitle(title);
  if (description) updateMetaDescription(description);
  if (keywords) updateMetaKeywords(keywords);
  if (url) updateCanonicalUrl(url);
};

// SEO configurations for different routes
export const SEO_CONFIG = {
  home: {
    title: "Nihesh Rachakonda | Full Stack Developer Portfolio",
    description:
      "Full stack developer portfolio of Nihesh Rachakonda featuring React, Node.js, MongoDB, and two browsing modes: minimal and interactive 3D.",
    keywords:
      "Nihesh Rachakonda portfolio, full stack developer portfolio, software engineer portfolio website, web developer portfolio website, frontend developer portfolio, frontend engineer portfolio, react developer portfolio, react portfolio website, javascript developer portfolio, node.js developer portfolio, nestjs developer portfolio, MERN stack developer portfolio, mern full stack developer portfolio, three js portfolio website, react three fiber portfolio, framer motion portfolio, graphql developer portfolio, postgresql developer portfolio, redis developer portfolio, docker developer portfolio, developer portfolio github",
    url: "https://niheshr.com/",
  },
  minimal: {
    title: "Minimal Developer Portfolio | Nihesh Rachakonda",
    description:
      "Minimal software engineer portfolio with projects, skills, and experience in React, JavaScript, Node.js, and modern full-stack development.",
    keywords:
      "minimal developer portfolio, clean software engineer portfolio, text based portfolio website, developer portfolio with keyboard navigation, full stack developer resume portfolio, frontend developer portfolio website, web developer portfolio examples, react developer portfolio examples, node.js and nestjs portfolio, software engineer personal website, minimalist web developer portfolio",
    url: "https://niheshr.com/minimal",
  },
  gooey: {
    title: "Interactive 3D Portfolio | Nihesh Rachakonda",
    description:
      "Interactive 3D developer portfolio built with React, Three.js, Framer Motion, and immersive animations showcasing projects and technical skills.",
    keywords:
      "interactive 3d developer portfolio, three js portfolio, three js portfolio website, react three fiber portfolio, react three fiber projects, framer motion portfolio, creative frontend developer portfolio, animated portfolio website, immersive web portfolio, 3d web animation portfolio, full stack portfolio with nestjs and react",
    url: "https://niheshr.com/gooey",
  },
};
