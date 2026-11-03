import type { ImageMetadata } from "astro";

import gstRecon from "../assets/projects/gst-recon.png";
import secondBrain from "../assets/projects/second-brain.jpeg";
import capax from "../assets/projects/capax.jpeg";
import blog from "../assets/projects/niheshr-blog.jpeg";
import rideshare from "../assets/projects/rideshare.jpeg";
import habify from "../assets/projects/habify.jpeg";
import sellerPortal from "../assets/projects/nihesh_s_seller_portal.jpeg";
import liveCursors from "../assets/projects/live_cursors.jpeg";

import gstReconLogo from "../assets/projects/logos/gst-recon.png";
import secondBrainLogo from "../assets/projects/logos/second-brain.png";
import capaxLogo from "../assets/projects/logos/capax.png";
import blogLogo from "../assets/projects/logos/blog.png";
import rideshareLogo from "../assets/projects/logos/rideshare.png";
import habifyLogo from "../assets/projects/logos/habify.webp";
import sellerPortalLogo from "../assets/projects/logos/nihesh_s_seller_portal.png";
import cursorLogo from "../assets/projects/logos/cursor.png";

export interface Project {
  title: string;
  /** One line, from the old site's project cards. */
  description: string;
  stack: string[];
  image: ImageMetadata;
  logo: ImageMetadata;
  /** Live site. Omit when the project only lives on GitHub. */
  live?: string;
  github: string;
}

/** Order here is the order on the page. Add a project = add an entry. */
export const projects: Project[] = [
  {
    title: "GST Recon",
    description: "Tax Reconciliation Knowledge Graph",
    stack: ["TypeScript", "Python", "Neo4j", "Cypher", "LLM", "Docker"],
    image: gstRecon,
    logo: gstReconLogo,
    github: "https://github.com/rnihesh/acm-klh/?ref=niheshr.com",
  },
  {
    title: "Second Brain",
    description: "AI Knowledge Platform",
    stack: ["Next.js", "TypeScript", "Prisma", "NextAuth", "React Flow", "Pluggable AI providers"],
    image: secondBrain,
    logo: secondBrainLogo,
    github: "https://github.com/rnihesh/second-brain/?ref=niheshr.com",
  },
  {
    title: "Capax",
    description: "macOS Battery Health Menu-Bar App",
    stack: ["Swift", "SwiftUI", "Swift Charts", "libimobiledevice", "IOKit"],
    image: capax,
    logo: capaxLogo,
    github: "https://github.com/rnihesh/capax/?ref=niheshr.com",
  },
  {
    title: "Nihesh's Blog",
    description: "My Personal Blog Platform",
    stack: ["Next.js", "shadcn/ui", "Tailwind CSS", "MDX"],
    image: blog,
    logo: blogLogo,
    live: "https://blog.niheshr.com/?ref=niheshr.com",
    github: "https://github.com/rnihesh/blog/?ref=niheshr.com",
  },
  {
    title: "RideShare",
    description: "A Vehicle Pooling App",
    stack: ["React", "Node.js", "MongoDB", "Aggregation pipelines", "Leaflet", "Bootstrap", "Express", "Auth"],
    image: rideshare,
    logo: rideshareLogo,
    live: "https://ride-share.niheshr.com/?ref=niheshr.com",
    github: "https://github.com/rnihesh/car_pooling/?ref=niheshr.com",
  },
  {
    title: "Habify",
    description: "A Gamified Habit Tracker",
    stack: ["React", "Node.js", "Cron", "MongoDB", "Bootstrap", "Express", "Auth"],
    image: habify,
    logo: habifyLogo,
    live: "https://habify.niheshr.com/?ref=niheshr.com",
    github: "https://github.com/rnihesh/gamified_habit_tracker/?ref=niheshr.com",
  },
  {
    title: "Nihesh's Seller Portal",
    description: "A Modern Seller Portal",
    stack: ["React", "Node.js", "MongoDB", "Bootstrap", "Gemini AI", "Cloudinary", "Express", "Auth"],
    image: sellerPortal,
    logo: sellerPortalLogo,
    live: "https://seller-portal.niheshr.com/?ref=niheshr.com",
    github: "https://github.com/rnihesh/nihesh-s-seller-portal/?ref=niheshr.com",
  },
  {
    title: "Live Cursors",
    description: "A WebSocket Example",
    stack: ["React", "Node.js", "WebSockets", "Express", "ws"],
    image: liveCursors,
    logo: cursorLogo,
    live: "https://nihesh-cursors.vercel.app/?ref=niheshr.com",
    github: "https://github.com/rnihesh/live-cursors-app/?ref=niheshr.com",
  },
];
