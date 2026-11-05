// /llms.txt (https://llmstxt.org): the page's content as plain markdown for
// AI agents and LLM tools. Built from the same data files as the site.
import type { APIRoute } from "astro";
import { site, socials } from "../data/site";
import { projects } from "../data/projects";
import { experience, achievements } from "../data/experience";
import { skills } from "../data/skills";

const abs = (path: string) => new URL(path, site.url).href;

export const GET: APIRoute = () => {
  const lines = [
    `# ${site.name}`,
    "",
    `> ${site.name}, ${site.jobTitle}.`,
    "",
    site.intro,
    "",
    `- Website: ${abs("/")}`,
    `- Résumé (PDF): ${abs(site.resume)}`,
    `- Blog: https://blog.niheshr.com`,
    `- Email: ${site.email}`,
    "",
    "## Projects",
    "",
    ...projects.map((p) => `- [${p.title}](${p.live ?? p.github}): ${p.description}`),
    `- More on GitHub: ${socials.find((s) => s.icon === "github")!.href}`,
    "",
    "## Work",
    "",
    ...experience.map(
      (j) => `- ${j.role}, ${j.company} (${j.period}): ${j.description}${j.skills.length ? ` Stack: ${j.skills.join(", ")}.` : ""}`,
    ),
    "",
    "## Achievements",
    "",
    ...achievements.map((a) => `- ${a}`),
    "",
    "## Skills",
    "",
    ...skills.map((g) => `- ${g.category}: ${g.items.join(", ")}`),
    "",
    "## Elsewhere",
    "",
    ...socials.map((s) => `- [${s.label}](${s.href})`),
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
