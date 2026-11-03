// Agentic Resource Discovery manifest: tells AI agents what this site offers.
// https://developer.chrome.com/docs/lighthouse/agentic-browsing/ard
import type { APIRoute } from "astro";
import { site } from "../../data/site";

const host = new URL(site.url).host;
const abs = (path: string) => new URL(path, site.url).href;

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify(
      {
        specVersion: "0.91",
        entries: [
          {
            identifier: `urn:air:${host}:profile:llms`,
            displayName: `${site.name}, ${site.jobTitle}`,
            type: "text/markdown",
            url: abs("/llms.txt"),
            representativeQueries: [
              `Who is ${site.name}?`,
              `What projects has ${site.name} built?`,
              `What are ${site.name}'s skills and work experience?`,
            ],
            capabilities: ["Profile", "Projects", "Experience", "Skills"],
          },
          {
            identifier: `urn:air:${host}:profile:resume`,
            displayName: `${site.name} résumé (PDF)`,
            type: "application/pdf",
            url: abs(site.resume),
            representativeQueries: [
              `Get ${site.name}'s résumé`,
              `Download ${site.name}'s CV`,
            ],
          },
        ],
      },
      null,
      2,
    ),
    { headers: { "Content-Type": "application/json; charset=utf-8" } },
  );
