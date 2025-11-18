import { useEffect, useState } from "react";
import { shortcuts } from "../../../data/shortcuts";
import "./CommandToolbar.css";

const CommandToolbar = ({ showKeyboardHelp = false }) => {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().includes("MAC"));

    const handler = (e) => {
      const mod = isMac ? e.metaKey : e.ctrlKey;
      if (!mod) return;

      const match = shortcuts.find((s) => s.key === e.key);
      if (match && match.sectionId) {
        e.preventDefault();
        const el = document.getElementById(match.sectionId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isMac]);

  if (!showKeyboardHelp) return null;

  return (
    <div
      className="fixed top-4 right-4 bg-black/50 text-white dark:text-black text-sm p-3 rounded-lg z-50 backdrop-blur-lg dark:bg-white/50 "
      style={{ fontFamily: "Red Rose", backdropFilter: "blur(4px)" }}
    >
      {shortcuts.map((s, index) => (
        <div key={`${s.key}-${index}`}>
          {s.sectionId ? (
            <>
              {isMac ? `⌘ + ${s.key}` : `Ctrl + ${s.key}`} → {s.label}
            </>
          ) : (
            <>
              {s.key} → {s.label}
            </>
          )}
        </div>
      ))}
      <div className="border-t border-white/20 dark:border-black/20 pt-2 mt-2">
        <div>H → Show/Hide Shortcuts</div>
        <div>B / ESC → Back to Home</div>
      </div>
    </div>
  );
};

export default CommandToolbar;
