import React, { useMemo, useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Section from "../layout/Section";
import { skills } from "../../data/skills";

function SkillsSection({ id, isVisible, animationProps }) {
  const rowRef = useRef(null);
  const [progress, setProgress] = useState(0);

  // Group skills by category, preserving data order
  const categories = useMemo(() => {
    const map = new Map();
    skills.forEach((skill) => {
      if (!map.has(skill.category)) map.set(skill.category, []);
      map.get(skill.category).push(skill);
    });
    return [...map.entries()];
  }, []);

  // Translate vertical wheel into horizontal scroll. Release to the page
  // (advance to next/prev section) only when the row hits its edge.
  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;

    const updateProgress = () => {
      const max = el.scrollWidth - el.clientWidth;
      setProgress(max > 0 ? el.scrollLeft / max : 0);
    };

    const onWheel = (e) => {
      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
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
        className="flex flex-col w-[90vw] max-w-6xl"
      >
        {/* Header */}
        <motion.div variants={fade} className="flex items-end justify-between mb-6">
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
              {skills.length} tools across {categories.length} domains
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

        {/* Horizontal scroll: category columns */}
        <motion.div
          ref={rowRef}
          variants={fade}
          className="skills-hrow flex gap-10 md:gap-14 overflow-x-auto pb-4 select-none"
          style={{ scrollSnapType: "x proximity" }}
        >
          {categories.map(([category, items], i) => (
            <div
              key={category}
              className="shrink-0 flex flex-col"
              style={{ scrollSnapAlign: "start" }}
            >
              <div className="flex items-baseline gap-2 mb-4 border-b border-gray-200 dark:border-neutral-800 pb-2">
                <span
                  className="text-[10px] text-emerald-500"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3
                  className="text-xs uppercase tracking-[0.16em] text-gray-700 dark:text-gray-300 whitespace-nowrap"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {category}
                </h3>
                <span className="text-[10px] text-gray-400 dark:text-gray-600 font-mono">
                  {items.length}
                </span>
              </div>

              <div className="grid grid-flow-col grid-rows-5 gap-x-8 gap-y-3 auto-cols-max">
                {items.map((skill) => (
                  <div
                    key={skill.name + category}
                    className="group flex items-center gap-3"
                  >
                    <div className="w-11 h-11 shrink-0 rounded-lg bg-white dark:bg-neutral-100 p-2 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:-translate-y-0.5 transition-all duration-200">
                      <img
                        src={skill.image}
                        alt={skill.name}
                        loading="lazy"
                        className="w-7 h-7 object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://placehold.co/100x100/10b981/ffffff?text=${encodeURIComponent(
                            skill.name[0]
                          )}`;
                        }}
                      />
                    </div>
                    <span
                      className="text-sm text-gray-800 dark:text-gray-200 whitespace-nowrap"
                      style={{ fontFamily: "'Cascadia Code', monospace" }}
                    >
                      {skill.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Scroll progress */}
        <motion.div
          variants={fade}
          className="mt-3 h-px w-full bg-gray-200 dark:bg-neutral-800 relative overflow-hidden"
        >
          <div
            className="absolute inset-y-0 left-0 bg-emerald-500 transition-[width] duration-150"
            style={{ width: `${Math.max(6, progress * 100)}%` }}
          />
        </motion.div>
      </motion.div>
    </Section>
  );
}

export default SkillsSection;
