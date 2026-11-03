export {};

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
    window.open("/resume/v1.pdf", "_blank", "noopener");
  }
});

/* ---------- reveal + pencil draw-in when scrolled into view ---------- */
const targets = document.querySelectorAll<HTMLElement>(".reveal, .draw[data-on-view]");
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
    count.textContent = `Frame ${f.dataset.frame} of ${frames.length}`;
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
