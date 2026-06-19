import React, { useMemo, useRef, useEffect, useState } from "react";
import { skills } from "../../data/skills";

/**
 * Skills — global-scroll-driven horizontal scrub.
 *
 * The <section> is RUNWAY_VH + 1 viewports tall and provides the vertical scroll
 * runway. A panel inside is manually pinned to the viewport (position: fixed)
 * while the section crosses the screen; the global scrollbar advances the whole
 * time and that progress translates a full-bleed horizontal card track. The
 * track carries symmetric center-padding so the FIRST card is centered at
 * progress 0 and the LAST card is centered at progress 1 (a true carousel).
 * The card nearest the viewport center grows, sharpens and lights up.
 *
 * Manual fixed-pin (not GSAP ScrollTrigger pin, which is unreliable inside the
 * gooey's absolute-overlay layout) is deterministic and works because nothing
 * in the ancestor chain establishes a containing block for position: fixed.
 *
 * LOAD-BEARING INVARIANT: the section is h-[700vh] (1 + RUNWAY_VH viewports).
 * RUNWAY_VH must equal SKILLS_PIN in useVisibilityOnScroll.js and the +600vh
 * added to the page min-h in GooeyPage.jsx (900vh -> 1500vh).
 */
const RUNWAY_VH = 6;

function SkillsSection({ id }) {
  const wrapRef = useRef(null);
  const panelRef = useRef(null);
  const trackRef = useRef(null);
  const fillRef = useRef(null);
  const cardsRef = useRef([]);
  const distRef = useRef(0);
  const [reduced, setReduced] = useState(false);

  const categories = useMemo(() => {
    const map = new Map();
    skills.forEach((s) => {
      if (!map.has(s.category)) map.set(s.category, []);
      map.get(s.category).push(s);
    });
    return [...map.entries()];
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const upd = () => setReduced(mq.matches);
    upd();
    mq.addEventListener("change", upd);
    return () => mq.removeEventListener("change", upd);
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    const panel = panelRef.current;
    const track = trackRef.current;
    if (!wrap || !panel || !track) return;

    let raf = 0;

    // Symmetric padding centers the FIRST card at progress 0; distance is taken
    // from the LAST card's real layout position so it centers at progress 1
    // (scrollWidth omits a flex container's right padding, so don't use it).
    const measure = () => {
      const card = cardsRef.current[0];
      const cw = card ? card.offsetWidth : window.innerWidth * 0.8;
      const pad = Math.max(16, (window.innerWidth - cw) / 2);
      track.style.paddingLeft = pad + "px";
      track.style.paddingRight = pad + "px";
      const last = cardsRef.current[cardsRef.current.length - 1];
      distRef.current = last
        ? Math.max(
            0,
            last.offsetLeft + last.offsetWidth / 2 - window.innerWidth / 2
          )
        : 0;
    };

    const apply = () => {
      const vh = window.innerHeight;
      const total = wrap.offsetHeight - vh; // px of vertical runway
      const rectTop = wrap.getBoundingClientRect().top;

      let p;
      if (rectTop > 0) {
        panel.style.position = "absolute";
        panel.style.top = "0px";
        p = 0;
      } else if (-rectTop <= total) {
        panel.style.position = "fixed";
        panel.style.top = "0px";
        p = total > 0 ? -rectTop / total : 0;
      } else {
        panel.style.position = "absolute";
        panel.style.top = total + "px";
        p = 1;
      }

      track.style.transform = `translate3d(${-p * distRef.current}px,0,0)`;
      if (fillRef.current) {
        fillRef.current.style.width = `${Math.max(4, p * 100)}%`;
      }

      if (!reduced) {
        const cx = window.innerWidth / 2;
        const reach = window.innerWidth * 0.5;
        cardsRef.current.forEach((c) => {
          if (!c) return;
          const r = c.getBoundingClientRect();
          const d = Math.min(1, Math.abs(r.left + r.width / 2 - cx) / reach);
          c.style.transform = `scale(${1 - d * 0.14})`;
          c.style.opacity = `${1 - d * 0.55}`;
          c.classList.toggle("skills-card-active", d < 0.14);
        });
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(apply);
    };
    const onResize = () => {
      measure();
      apply();
    };

    measure();
    apply();
    // Re-measure after async logos/fonts settle the card widths.
    const t1 = setTimeout(onResize, 400);
    const t2 = setTimeout(onResize, 1600);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("load", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", onResize);
      clearTimeout(t1);
      clearTimeout(t2);
      cancelAnimationFrame(raf);
    };
  }, [reduced, categories.length]);

  return (
    <section id={id} ref={wrapRef} className="relative w-full h-[700vh]">
      <div
        ref={panelRef}
        className="absolute top-0 left-0 z-20 w-full h-screen overflow-hidden flex flex-col justify-center bg-white dark:bg-black"
      >
        {/* Header (constrained) */}
        <div className="w-[92vw] max-w-6xl mx-auto flex items-end justify-between mb-6 relative z-10">
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
            <span className="text-emerald-500 text-base leading-none">↓</span>
          </div>
        </div>

        {/* Full-bleed horizontal track */}
        <div
          ref={trackRef}
          className="flex gap-6 h-[58vh] max-h-[480px] items-stretch select-none will-change-transform relative z-10"
        >
          {categories.map(([category, items], i) => (
            <article
              key={category}
              ref={(el) => (cardsRef.current[i] = el)}
              className="skills-card group relative shrink-0 w-[78vw] sm:w-[380px] h-full flex flex-col
                         rounded-[22px] border border-black/[0.08] dark:border-white/[0.09]
                         bg-black/[0.015] dark:bg-white/[0.04] p-6 overflow-hidden
                         shadow-sm transition-[border-color,box-shadow] duration-300 will-change-transform"
            >
              {/* Active top accent */}
              <span className="skills-card-accent pointer-events-none absolute top-0 left-0 h-[3px] w-full origin-left scale-x-0 bg-emerald-500 transition-transform duration-500" />

              {/* Watermark index */}
              <span className="pointer-events-none select-none absolute -right-2 -top-8 text-[9rem] font-black leading-none text-black/[0.035] dark:text-white/[0.05]">
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Header row */}
              <div className="relative flex items-center gap-3">
                <span
                  className="text-emerald-500 text-sm font-semibold"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
                <span
                  className="text-[10px] uppercase tracking-[0.16em] text-gray-400 dark:text-gray-500"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {items.length} tools
                </span>
              </div>

              {/* Domain title */}
              <h3 className="relative mt-4 text-xl md:text-2xl font-bold text-black dark:text-white leading-tight tracking-tight">
                {category}
              </h3>

              {/* Skill grid */}
              <div className="relative mt-6 flex-1 overflow-y-auto pr-1 grid grid-cols-2 gap-x-4 gap-y-3.5 content-start scrollbar-hide">
                {items.map((skill) => (
                  <div
                    key={skill.name + category}
                    className="flex items-center gap-3"
                  >
                    <div className="w-10 h-10 shrink-0 rounded-xl bg-white border border-black/5 p-2 flex items-center justify-center shadow-sm">
                      <img
                        src={skill.image}
                        alt={skill.name}
                        loading="lazy"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://placehold.co/100x100/10b981/ffffff?text=${encodeURIComponent(
                            skill.name[0]
                          )}`;
                        }}
                      />
                    </div>
                    <span
                      className="text-[13px] text-gray-700 dark:text-gray-200 leading-tight"
                      style={{ fontFamily: "'Cascadia Code', monospace" }}
                    >
                      {skill.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer accent */}
              <div className="relative mt-5 flex items-center justify-between">
                <div className="h-1 w-10 rounded-full bg-emerald-500/70 transition-all duration-300 group-hover:w-16" />
                <span
                  className="text-[10px] uppercase tracking-[0.2em] text-gray-300 dark:text-gray-600"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {category.split(/[\s&]+/)[0]}
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Scroll progress */}
        <div className="w-[92vw] max-w-6xl mx-auto mt-5 h-px bg-gray-200 dark:bg-neutral-800 relative overflow-hidden z-10">
          <div
            ref={fillRef}
            className="absolute inset-y-0 left-0 bg-emerald-500"
            style={{ width: "4%" }}
          />
        </div>
      </div>
    </section>
  );
}

export default SkillsSection;
