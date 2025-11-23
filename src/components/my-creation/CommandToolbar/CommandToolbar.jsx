import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { shortcuts } from "../../../data/shortcuts";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import "./CommandToolbar.css";

const CommandToolbar = ({ showKeyboardHelp = false }) => {
  const [isMac, setIsMac] = useState(false);
  const [isDocked, setIsDocked] = useState(!showKeyboardHelp);
  const [dockSide, setDockSide] = useState("right"); // "left" or "right"

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

  useEffect(() => {
    if (showKeyboardHelp) {
      setIsDocked(false);
    }
  }, [showKeyboardHelp]);

  return (
    <>
      <AnimatePresence mode="wait">
        {isDocked ? (
          <motion.div
            key="docked"
            initial={{ x: dockSide === "right" ? 100 : -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: dockSide === "right" ? 100 : -100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`hidden md:block fixed top-1/2 -translate-y-1/2 z-50 cursor-pointer ${
              dockSide === "right" ? "right-0" : "left-0"
            }`}
            onClick={() => setIsDocked(false)}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, info) => {
              if (dockSide === "right" && info.offset.x < -30)
                setIsDocked(false);
              if (dockSide === "left" && info.offset.x > 30) setIsDocked(false);
            }}
          >
            <div
              className={`bg-white/80 dark:bg-black/80 backdrop-blur-md border-t border-b border-gray-200 dark:border-gray-800 py-5 px-1 shadow-lg hover:bg-white dark:hover:bg-black transition-colors group ${
                dockSide === "right"
                  ? "rounded-l-md border-l"
                  : "rounded-r-md border-r"
              }`}
            >
              {dockSide === "right" ? (
                <LuChevronLeft className="w-4 h-4 text-black dark:text-white group-hover:scale-115 transition-transform" />
              ) : (
                <LuChevronRight className="w-4 h-4 text-black dark:text-white group-hover:scale-115 transition-transform" />
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="expanded"
            initial={{ x: dockSide === "right" ? 300 : -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: dockSide === "right" ? 300 : -300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`hidden md:block fixed top-20 z-50 ${
              dockSide === "right" ? "right-4" : "left-4"
            }`}
            drag
            dragConstraints={
              dockSide === "right"
                ? {
                    left: -window.innerWidth + 50,
                    right: 0,
                    top: -100,
                    bottom: window.innerHeight - 300,
                  }
                : {
                    left: 0,
                    right: window.innerWidth - 50,
                    top: -100,
                    bottom: window.innerHeight - 300,
                  }
            }
            onDragEnd={(e, info) => {
              const x = info.point.x;
              const width = window.innerWidth;

              // Dock to right if dragged near right edge
              if (x > width - 100) {
                setDockSide("right");
                setIsDocked(true);
              }
              // Dock to left if dragged near left edge
              else if (x < 100) {
                setDockSide("left");
                setIsDocked(true);
              }
            }}
          >
            <div
              className="bg-white/90 dark:bg-black/90 backdrop-blur-xl text-black dark:text-white p-5 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 w-64"
              style={{ fontFamily: "Red Rose" }}
            >
              <div
                className={`flex items-center mb-4 border-b border-gray-200 dark:border-gray-800 pb-2 ${
                  dockSide === "right" ? "flex-row-reverse" : "flex-row"
                } justify-between`}
              >
                <span className="font-bold text-lg">Shortcuts</span>
                <button
                  onClick={() => setIsDocked(true)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                  {dockSide === "right" ? (
                    <LuChevronRight className="w-5 h-5" />
                  ) : (
                    <LuChevronLeft className="w-5 h-5" />
                  )}
                </button>
              </div>

              <div className="space-y-2 max-h-[60vh] overflow-y-auto scrollbar-hide">
                {shortcuts.map((s, index) => (
                  <div
                    key={`${s.key}-${index}`}
                    className="flex justify-between items-center text-sm opacity-80 hover:opacity-100 transition-opacity"
                  >
                    <span>{s.label}</span>
                    <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-xs font-mono">
                      {s.sectionId
                        ? (isMac ? "⌘" : "Ctrl") + " + " + s.key
                        : s.key}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-800 pt-3 mt-3 text-xs opacity-60 space-y-1">
                <div className="flex justify-between">
                  <span>Toggle Help</span>
                  <span className="font-mono">H</span>
                </div>
                <div className="flex justify-between">
                  <span>Back to Home</span>
                  <span className="font-mono">B / ESC</span>
                </div>
                <div className="mt-2 text-center italic text-[10px]">
                  {dockSide === "right"
                    ? "Drag right to minimize →"
                    : "← Drag left to minimize"}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CommandToolbar;
