import { useEffect, useState } from "react";

const shortcuts = [
  { key: "1", label: "Intro", sectionId: "intro" },
  { key: "2", label: "Name", sectionId: "name" },
  { key: "3", label: "WhatAmI", sectionId: "whatami" },
  { key: "4", label: "Skills", sectionId: "skills" },
  { key: "5", label: "Model", sectionId: "model" },
  { key: "6", label: "Photos", sectionId: "photos" },
  { key: "7", label: "Projects", sectionId: "projects" },
  { key: "8", label: "Vibes", sectionId: "vibe" },
];

const CommandToolbar = () => {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().includes("MAC"));

    const handler = (e) => {
      const mod = isMac ? e.metaKey : e.ctrlKey;
      if (!mod) return;

      const match = shortcuts.find((s) => s.key === e.key);
      if (match) {
        e.preventDefault();
        const el = document.getElementById(match.sectionId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isMac]);

  return (
    <div
      className="fixed top-4 right-4 bg-black text-white dark:text-black text-sm p-3 rounded-lg z-50 hidden md:block backdrop-blur-4xl opacity-60 dark:bg-white"
      style={{ fontFamily: "Red Rose" }}
    >
      {shortcuts.map((s) => (
        <div key={s.key}>
          {isMac ? `⌘ + ${s.key}` : `Ctrl + ${s.key}`} → {s.label}
        </div>
      ))}
    </div>
  );
};

export default CommandToolbar;
