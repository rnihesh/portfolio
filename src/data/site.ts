export const site = {
  name: "Nihesh Rachakonda",
  jobTitle: "AI Engineer",
  url: "https://niheshr.com",
  email: "niheshr03@gmail.com",
  emailHref: "mailto:niheshr03+portfolio@gmail.com",
  resume: "/resume/v8.pdf",
  title: "Nihesh Rachakonda | AI Engineer",
  description:
    "Nihesh Rachakonda, AI engineer. Projects, work, achievements and contact.",
  ogImage: "/nihesh.png",
  ogImageAlt: "Nihesh Rachakonda portfolio logo and profile image",
  twitter: "@niheshr03",
  alternateNames: ["rnihesh", "niheshr", "niheshr03", "Nihesh R", "R. Nihesh"],
  // From the old site's "What am I" section.
  intro:
    "With a strong eye for design and detail, I build modern web applications that are not only functional but also intuitive and visually clean.",
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
  { href: "/#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];
