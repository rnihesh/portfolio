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
  /** Short line, written on the slide mount. */
  tagline: string;
  summary: string;
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
    tagline: "Tax reconciliation knowledge graph",
    summary:
      "A GST reconciliation engine that matches GSTR returns inside a Neo4j knowledge graph, surfacing circular-trading fraud, vendor risk scoring, and a graph-aware LLM audit chatbot that answers questions grounded in the underlying graph.",
    stack: ["TypeScript", "Python", "Neo4j", "Cypher", "LLM", "Docker"],
    image: gstRecon,
    logo: gstReconLogo,
    github: "https://github.com/rnihesh/acm-klh/?ref=niheshr.com",
  },
  {
    title: "Second Brain",
    tagline: "AI knowledge platform",
    summary:
      "An AI knowledge platform for capturing notes, AI summarization and auto-tagging, with conversational query over your own notes, knowledge-graph visualization, plus a public query API and an embeddable widget.",
    stack: ["Next.js", "TypeScript", "Prisma", "NextAuth", "React Flow", "Pluggable AI providers"],
    image: secondBrain,
    logo: secondBrainLogo,
    github: "https://github.com/rnihesh/second-brain/?ref=niheshr.com",
  },
  {
    title: "Capax",
    tagline: "macOS battery health menu-bar app",
    summary:
      "A native macOS menu-bar app that reads detailed Mac plus iPhone and iPad battery health over USB, with local Swift Charts history. It runs fully offline, with no telemetry.",
    stack: ["Swift", "SwiftUI", "Swift Charts", "libimobiledevice", "IOKit"],
    image: capax,
    logo: capaxLogo,
    github: "https://github.com/rnihesh/capax/?ref=niheshr.com",
  },
  {
    title: "Nihesh's Blog",
    tagline: "My personal blog platform",
    summary:
      "A Next.js 16 powered blogging platform with markdown support, smart search and adaptive theming, built for seamless writing, fast navigation and a good reading experience.",
    stack: ["Next.js", "shadcn/ui", "Tailwind CSS", "MDX"],
    image: blog,
    logo: blogLogo,
    live: "https://blog.niheshr.com/?ref=niheshr.com",
    github: "https://github.com/rnihesh/blog/?ref=niheshr.com",
  },
  {
    title: "RideShare",
    tagline: "A vehicle pooling app",
    summary:
      "A MERN-based vehicle pooling app using MongoDB aggregation pipelines and geo-coordinates for efficient driver-passenger matching and location-based queries, with secure authentication through Clerk.",
    stack: ["React", "Node.js", "MongoDB", "Aggregation pipelines", "Leaflet", "Bootstrap", "Express", "Auth"],
    image: rideshare,
    logo: rideshareLogo,
    live: "https://ride-share.niheshr.com/?ref=niheshr.com",
    github: "https://github.com/rnihesh/car_pooling/?ref=niheshr.com",
  },
  {
    title: "Habify",
    tagline: "A gamified habit tracker",
    summary:
      "A gamified habit tracker built on the MERN stack, using MongoDB for progress tracking, dynamic scoring and level systems, with responsive dashboards, leaderboards, secure user auth and role control.",
    stack: ["React", "Node.js", "Cron", "MongoDB", "Bootstrap", "Express", "Auth"],
    image: habify,
    logo: habifyLogo,
    live: "https://habify.niheshr.com/?ref=niheshr.com",
    github: "https://github.com/rnihesh/gamified_habit_tracker/?ref=niheshr.com",
  },
  {
    title: "Nihesh's Seller Portal",
    tagline: "A modern seller portal",
    summary:
      "A MERN stack app integrated with Cloudinary for media management and Gemini AI for smart content generation, enabling product uploads, edits and seller analytics.",
    stack: ["React", "Node.js", "MongoDB", "Bootstrap", "Gemini AI", "Cloudinary", "Express", "Auth"],
    image: sellerPortal,
    logo: sellerPortalLogo,
    live: "https://seller-portal.niheshr.com/?ref=niheshr.com",
    github: "https://github.com/rnihesh/nihesh-s-seller-portal/?ref=niheshr.com",
  },
  {
    title: "Live Cursors",
    tagline: "A WebSocket example",
    summary:
      "A real-time collaborative web app using WebSockets where users join with a name and see each other's cursor movements live, enabling shared interaction through minimal input and seamless syncing.",
    stack: ["React", "Node.js", "WebSockets", "Express", "ws"],
    image: liveCursors,
    logo: cursorLogo,
    live: "https://nihesh-cursors.vercel.app/?ref=niheshr.com",
    github: "https://github.com/rnihesh/live-cursors-app/?ref=niheshr.com",
  },
];
