import { site } from "../data/site";

const root = document.documentElement;

/* ---------- theme toggle ---------- */
function setTheme(t: "light" | "dark") {
  root.dataset.theme = t;
  try {
    localStorage.setItem("theme", t);
  } catch {}
  document.querySelectorAll<HTMLButtonElement>("[data-theme-toggle]").forEach((b) => {
    b.setAttribute("aria-pressed", String(t === "dark"));
  });
}

document.querySelectorAll<HTMLButtonElement>("[data-theme-toggle]").forEach((btn) => {
  btn.setAttribute("aria-pressed", String(root.dataset.theme === "dark"));
  btn.addEventListener("click", () => setTheme(root.dataset.theme === "dark" ? "light" : "dark"));
});

/* ---------- keyboard: R opens the résumé ---------- */
window.addEventListener("keydown", (e) => {
  if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
  const t = e.target as HTMLElement | null;
  if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
  if (document.querySelector("dialog[open]")) return;
  if (e.key === "r" || e.key === "R") {
    window.open(site.resume, "_blank", "noopener");
  }
});

/* ---------- reveal when scrolled into view ---------- */
const targets = document.querySelectorAll<HTMLElement>(".reveal");
if ("IntersectionObserver" in window && targets.length) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      }
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.15 },
  );
  targets.forEach((el) => io.observe(el));
} else {
  targets.forEach((el) => el.classList.add("in"));
}

/* ---------- lightbox for the contact sheet ---------- */
const dialog = document.querySelector<HTMLDialogElement>("#lightbox");
const frames = Array.from(document.querySelectorAll<HTMLAnchorElement>("[data-frame]"));

if (dialog && frames.length && typeof dialog.showModal === "function") {
  const img = dialog.querySelector<HTMLImageElement>("img")!;
  const caption = dialog.querySelector<HTMLElement>("[data-caption]")!;
  const count = dialog.querySelector<HTMLElement>("[data-count]")!;
  let index = 0;
  let opener: HTMLElement | null = null;

  const show = (i: number) => {
    index = (i + frames.length) % frames.length;
    const f = frames[index];
    const thumb = f.querySelector("img");
    img.removeAttribute("src");
    img.width = Number(f.dataset.w);
    img.height = Number(f.dataset.h);
    img.alt = thumb?.alt ?? "";
    img.src = f.href;
    caption.textContent = thumb?.alt ?? "";
    count.textContent = `${f.dataset.frame} of ${frames.length}`;
  };

  frames.forEach((f, i) => {
    f.addEventListener("click", (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      opener = f;
      show(i);
      dialog.showModal();
    });
  });

  dialog.querySelector("[data-prev]")?.addEventListener("click", () => show(index - 1));
  dialog.querySelector("[data-next]")?.addEventListener("click", () => show(index + 1));
  dialog.querySelector("[data-close]")?.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close();
  });
  dialog.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });
  dialog.addEventListener("close", () => opener?.focus());
}

/* ---------- visit ping (traana), live site only ---------- */
if (import.meta.env.PROD) {
  const send = async () => {
    const nav = navigator as Navigator & {
      connection?: { effectiveType?: string; downlink?: number; rtt?: number };
      deviceMemory?: number;
      getBattery?: () => Promise<{ level: number; charging: boolean }>;
    };
    const conn = nav.connection || {};
    const bat: { level: number | null; charging: boolean | null } = { level: null, charging: null };
    try {
      if (nav.getBattery) {
        const b = await nav.getBattery();
        bat.level = b.level;
        bat.charging = b.charging;
      }
    } catch {}
    const payload = {
      url: location.href,
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screenSize: `${window.innerWidth}x${window.innerHeight}`,
      referrer: document.referrer,
      viewport: `${document.documentElement.clientWidth}x${document.documentElement.clientHeight}`,
      colorDepth: window.screen.colorDepth,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      connection: conn.effectiveType,
      downlink: conn.downlink,
      rtt: conn.rtt,
      touchSupport: "ontouchstart" in window,
      orientation: screen.orientation?.type,
      batteryLevel: bat.level,
      charging: bat.charging,
      deviceMemory: nav.deviceMemory,
      hardwareConcurrency: navigator.hardwareConcurrency,
      pageTitle: document.title,
      timestamp: new Date().toISOString(),
    };
    fetch("https://traana.vercel.app/tra", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
  };
  // after the page has loaded, so it never competes with first paint
  if (document.readyState === "complete") send();
  else addEventListener("load", () => send(), { once: true });
}

/* ---------- WebMCP: read-only tools for AI agents in the browser ---------- */
type ModelContext = {
  registerTool: (tool: {
    name: string;
    description: string;
    inputSchema: object;
    annotations?: { readOnlyHint?: boolean };
    execute: (args: Record<string, unknown>) => Promise<string>;
  }) => unknown;
};
const mc =
  (document as Document & { modelContext?: ModelContext }).modelContext ??
  (navigator as Navigator & { modelContext?: ModelContext }).modelContext;
const agentData = document.getElementById("agent-data")?.textContent;
if (typeof mc?.registerTool === "function" && agentData) {
  const data = JSON.parse(agentData) as {
    profile: Record<string, unknown>;
    projects: { title: string; description: string; link: string }[];
    resume: string;
  };
  const noArgs = { type: "object", properties: {} };
  const tools = [
    {
      name: "get_profile",
      description: `Who ${site.name} is: role, short intro and links (résumé, GitHub, LinkedIn and more).`,
      run: () => data.profile,
    },
    {
      name: "list_projects",
      description: `${site.name}'s selected projects with a one-line description and link each.`,
      run: () => data.projects,
    },
    {
      name: "get_resume_link",
      description: `URL of ${site.name}'s résumé PDF.`,
      run: () => ({ resume: data.resume }),
    },
  ];
  for (const t of tools) {
    try {
      Promise.resolve(
        mc.registerTool({
          name: t.name,
          description: t.description,
          inputSchema: noArgs,
          annotations: { readOnlyHint: true },
          execute: async () => JSON.stringify(t.run()),
        }),
      ).catch(() => {});
    } catch {}
  }
}
