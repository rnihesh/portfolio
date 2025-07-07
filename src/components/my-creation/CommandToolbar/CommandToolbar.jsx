import { useEffect, useState } from "react";
import { shortcuts } from "../../../data/shortcuts";
import "./CommandToolbar.css"


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
      className="fixed bottom-4 right-4 bg-black/50 text-white dark:text-black text-sm p-3 rounded-lg z-50 hidden md:block backdrop-blur-lg  dark:bg-white/50 pb-13 rounded-br-4xl closing-toolbar"
      style={{ fontFamily: "Red Rose" , backdropFilter: "blur(4px)"}}
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
