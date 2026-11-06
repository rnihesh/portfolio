import type { ImageMetadata } from "astro";
import dattam from "../assets/work/dattam_in_logo_nobg.png";
import xlventures from "../assets/work/xlventures_logo_nobg.png";

export interface Job {
  company: string;
  role: string;
  period: string;
  logo?: ImageMetadata;
  description: string;
  skills: string[];
  link?: string;
}

// Carried over from the old site's src/data/experience.js.
export const experience: Job[] = [
  {
    company: "XL Ventures",
    role: "Software Engineer",
    period: "Jul 2026 – Present",
    logo: xlventures,
    description:
      "Shaped how the platform is built and shipped. Turned a single app into a foundation that now powers several products, launched new public-facing sites on top of it, and kept everything fast, secure and reliable as usage grew.",
    skills: ["Python", "FastAPI", "PostgreSQL", "Redis", "Next.js", "TypeScript", "Docker", "GCP"],
    link: "https://xlventures.ai?ref=nihesh",
  },
  {
    company: "Dattam Labs",
    role: "Software Engineer Intern",
    period: "Aug 2025 – Apr 2026",
    logo: dattam,
    description:
      "Built backend services in Python and FastAPI on AWS, and wrote Playwright scrapers to pull data from government portals. Also contributed to a React Native (Expo) mobile app and worked on AI features that processed the collected data.",
    skills: ["Python", "FastAPI", "AWS", "Playwright", "React Native", "Expo"],
    link: "https://dattam.in?ref=nihesh",
  },
];

// From the resume. No prize amounts.
export const achievements: string[] = [
  "Winner, National ACM-KLH HackWithAI 2026 (GST Reconciliation Engine)",
  "Winner, GDG TechSprint 2026 (Civic Lemma, AI civic-grievance platform)",
  "Winner, AI Week Vibe Coding 2026 (SEFS, smart file organizer)",
  "AWS Open Data contributor (Indian Court Judgements dataset on S3)",
  "Research paper: Model Selection via Hypothesis Testing (IJFMR)",
];
