import type { ImageMetadata } from "astro";
import dattam from "../assets/work/dattam_in_logo_nobg.png";

export interface Job {
  company: string;
  role: string;
  period: string;
  /** ISO dates for <time> elements. */
  start: string;
  end?: string;
  logo?: ImageMetadata;
  description: string;
  skills: string[];
  link?: string;
}

export const experience: Job[] = [
  {
    company: "Dattam Labs",
    role: "Software Engineer Intern",
    period: "Aug 2025 to Mar 2026",
    start: "2025-08",
    end: "2026-03",
    logo: dattam,
    description:
      "Built backend services in Python and FastAPI on AWS, and wrote Playwright scrapers to pull data from government portals. Also contributed to a React Native (Expo) mobile app and worked on AI features that processed the collected data.",
    skills: ["Python", "FastAPI", "AWS", "Playwright", "React Native", "Expo"],
    link: "https://dattam.in?ref=nihesh",
  },
];

export interface Study {
  title: string;
  period: string;
  start: string;
  end?: string;
  description: string;
}

export const education: Study[] = [
  {
    title: "Bachelor's in Computer Science",
    period: "2021 to 2025",
    start: "2021",
    end: "2025",
    description:
      "Focused on web development, algorithms and software engineering principles. Active in coding competitions and open-source contributions.",
  },
];

/** Self-directed learning, carried over from the old minimal page. */
export const learning: string[] = [
  "AI-native full-stack engineering (self-taught)",
  "MongoDB and database design",
  "React and modern frontend development",
  "Cloud computing with AWS",
  "Git and version control",
];
