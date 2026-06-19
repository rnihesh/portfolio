import React, { useMemo, useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Section from "../layout/Section";
import { skills } from "../../data/skills";

function SkillsSection({ id, isVisible, animationProps }) {
  const rowRef = useRef(null);
  const [progress, setProgress] = useState(0);

  const categories = useMemo(() => {
    const map = new Map();
    skills.forEach((skill) => {
      if (!map.has(skill.category)) map.set(skill.category, []);
      map.get(skill.category).push(skill);
    });
    return [...map.entries()];
  }, []);

  // Vertical wheel drives the horizontal track. Releases to the page (next/prev
  // gooey section) only at the track's edges.
  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;

    const updateProgress = () => {
      const max = el.scrollWidth - el.clientWidth;
      setProgress(max > 0 ? el.scrollLeft / max : 0);
    };

    const onWheel = (e) => {
      const delta =
        Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0) return;
      const atStart = el.scrollLeft <= 0;
      const atEnd = el.scrollLeft >= max - 1;
      if ((delta > 0 && !atEnd) || (delta < 0 && !atStart)) {
        e.preventDefault();
        el.scrollLeft += delta;
        updateProgress();
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("scroll", updateProgress);
    };
  }, [isVisible]);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
    exit: { opacity: 0 },
  };
  const fade = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", damping: 22 } },
    exit: { y: -16, opacity: 0 },
  };

  return (
    <Section id={id} isVisible={isVisible} animationProps={animationProps}>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        exit="exit"
        className="flex flex-col w-[92vw] max-w-6xl"
      >
        {/* Header */}
        <motion.div variants={fade} className="flex items-end justify-between mb-5">
          <div>
            <h2
              className="text-4xl md:text-6xl font-bold text-black dark:text-white leading-none"
              style={{ fontFamily: "'Red Rose', cursive" }}
            >
              Skills
            </h2>
            <p
              className="mt-2 text-xs md:text-sm text-gray-500 dark:text-gray-400"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {skills.length} tools, {categories.length} domains
            </p>
          </div>
          <div
            className="flex items-center gap-2 text-[10px] md:text-xs uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            <span>scroll</span>
            <span className="text-emerald-500 text-base leading-none">→</span>
          </div>
        </motion.div>

        {/* Horizontal track of category cards */}
        <motion.div
          ref={rowRef}
          variants={fade}
          className="skills-hrow flex gap-5 md:gap-6 overflow-x-auto pb-4 h-[60vh] max-h-[480px] items-stretch select-none"
        >
          {categories.map(([category, items], i) => (
            <article
              key={category}
              className="group shrink-0 w-[82vw] sm:w-[360px] h-full flex flex-col rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03] p-5 md:p-6 transition-colors duration-300 hover:border-black/30 dark:hover:border-white/30"
            >
              {/* Card header */}
              <div className="flex items-start justify-between">
                <span
                  className="text-emerald-500 text-sm"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className="text-[10px] uppercase tracking-[0.18em] text-gray-400 dark:text-gray-500 text-right max-w-[55%]"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {category}
                </span>
              </div>

              {/* Skills list */}
              <div className="mt-5 flex-1 overflow-y-auto pr-1 grid grid-cols-2 gap-x-3 gap-y-3 content-start">
                {items.map((skill) => (
                  <div key={skill.name + category} className="flex items-center gap-2.5">
                    <div className="w-9 h-9 shrink-0 rounded-lg bg-white p-1.5 flex items-center justify-center shadow-sm">
                      <img
                        src={skill.image}
                        alt={skill.name}
                        loading="lazy"
                        className="w-6 h-6 object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://placehold.co/100x100/10b981/ffffff?text=${encodeURIComponent(
                            skill.name[0]
                          )}`;
                        }}
                      />
                    </div>
                    <span
                      className="text-xs text-gray-800 dark:text-gray-200 leading-tight"
                      style={{ fontFamily: "'Cascadia Code', monospace" }}
                    >
                      {skill.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Card footer readout */}
              <div className="mt-4 flex items-center gap-2 border-t border-black/10 dark:border-white/10 pt-3">
                <span className="text-xl font-bold text-black dark:text-white tabular-nums">
                  {items.length}
                </span>
                <span
                  className="text-[10px] uppercase tracking-[0.16em] text-gray-400 dark:text-gray-500"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  tools
                </span>
              </div>
            </article>
          ))}
        </motion.div>

        {/* Scroll progress */}
        <motion.div
          variants={fade}
          className="mt-3 h-px w-full bg-gray-200 dark:bg-neutral-800 relative overflow-hidden"
        >
          <div
            className="absolute inset-y-0 left-0 bg-emerald-500 transition-[width] duration-150"
            style={{ width: `${Math.max(5, progress * 100)}%` }}
          />
        </motion.div>
      </motion.div>
    </Section>
  );
}

export default SkillsSection;
