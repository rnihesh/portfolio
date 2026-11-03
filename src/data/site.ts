export const site = {
  name: "Nihesh Rachakonda",
  shortName: "Nihesh",
  jobTitle: "AI-Native Full-Stack Engineer",
  location: "Hyderabad, India",
  url: "https://niheshr.com",
  email: "niheshr03@gmail.com",
  emailHref: "mailto:niheshr03+portfolio@gmail.com",
  resume: "/resume/v7.pdf",
  openToWork: true,
  title: "Nihesh Rachakonda | AI-Native Full-Stack Engineer Portfolio",
  description:
    "Nihesh Rachakonda is an AI-Native Full-Stack Engineer building fast, well-made web products, agentic AI tools and native apps. Projects, work, photography and contact.",
  ogImage: "/nihesh.png",
  ogImageAlt: "Nihesh Rachakonda portfolio logo and profile image",
  twitter: "@niheshr03",
  alternateNames: ["rnihesh", "niheshr", "niheshr03", "Nihesh R", "R. Nihesh"],
  // Short bio. Shown in the hero and about block.
  intro:
    "I build digital experiences that merge form and function: AI-native products, full-stack web apps and the occasional native Mac app.",
  about: [
    "I care about design and detail as much as the code underneath. Clean code, careful design, pixel-level execution.",
    "I'm self-taught in most of what I use, currently exploring agentic infrastructure, and always learning to improve my craft.",
  ],
} as const;

export type SocialIcon =
  | "github"
  | "linkedin"
  | "x"
  | "instagram"
  | "bluesky"
  | "vsco"
  | "mail";

export interface Social {
  label: string;
  handle: string;
  href: string;
  icon: SocialIcon;
}

export const socials: Social[] = [
  { label: "GitHub", handle: "rnihesh", href: "https://github.com/rnihesh", icon: "github" },
  {
    label: "LinkedIn",
    handle: "rachakonda-nihesh",
    href: "https://www.linkedin.com/in/rachakonda-nihesh/",
    icon: "linkedin",
  },
  { label: "X", handle: "niheshr03", href: "https://x.com/niheshr03", icon: "x" },
  { label: "Instagram", handle: "niheshr", href: "https://instagram.com/niheshr", icon: "instagram" },
  {
    label: "Bluesky",
    handle: "niheshr.com",
    href: "https://bsky.app/profile/niheshr.com",
    icon: "bluesky",
  },
  { label: "VSCO", handle: "niheshr", href: "https://vsco.co/niheshr/", icon: "vsco" },
];

export const nav = [
  { href: "/#projects", label: "Projects" },
  { href: "/#work", label: "Work" },
  { href: "/#photos", label: "Photos" },
  { href: "/#skills", label: "Skills" },
  { href: "/#contact", label: "Contact" },
];
