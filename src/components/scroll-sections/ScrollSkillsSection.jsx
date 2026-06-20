import { useRef, useEffect } from "react";
import {
  gsap,
  ScrollTrigger,
  BREAKPOINTS,
  EASINGS,
  scrollVelocity,
} from "../../utils/gsapConfig";
import { applyMagneticEffect } from "../../hooks/useMagnetic";
import { splitText, revertSplit } from "../../utils/textSplit";
import { skills } from "../../data/skills";

const EMERALD = "#10b981";

function ScrollSkillsSection() {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const titleRef = useRef(null);
  const marqueeRef = useRef(null);
  const spineRef = useRef(null);
  const indexRef = useRef(null);

  // Group skills by category
  const categories = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});

  // Create marquee text from skill names
  const marqueeText = skills.map((s) => s.name).join(" • ");

  useEffect(() => {
    const mm = gsap.matchMedia();
    let magneticCleanups = [];
    let titleSplit = null;
    let velocityUnsubscribe = null;

    const cleanupTitleSplit = () => {
      if (titleRef.current) {
        const titleElement = titleRef.current.querySelector("h2");
        if (titleElement) revertSplit(titleElement);
      }
    };

    // ---------------------------------------------------------------
    // Reduced motion: clean, fully visible final states. No transforms.
    // ---------------------------------------------------------------
    mm.add(BREAKPOINTS.reducedMotion, () => {
      const skillItems = sectionRef.current?.querySelectorAll(".skill-item");
      const categoryHeaders = sectionRef.current?.querySelectorAll(".category-header");
      const categoryLines = sectionRef.current?.querySelectorAll(".category-line");
      const blocks = sectionRef.current?.querySelectorAll(".category-block");
      gsap.set(titleRef.current, { opacity: 1, y: 0, clipPath: "inset(0 0% 0 0%)" });
      if (skillItems)
        gsap.set(skillItems, {
          opacity: 1,
          scale: 1,
          rotation: 0,
          rotateY: 0,
          clipPath: "inset(0 0% 0 0%)",
        });
      if (categoryHeaders) gsap.set(categoryHeaders, { opacity: 1, x: 0 });
      if (categoryLines) gsap.set(categoryLines, { scaleX: 1 });
      if (blocks) gsap.set(blocks, { opacity: 1, yPercent: 0 });
      if (spineRef.current) gsap.set(spineRef.current, { drawSVG: "100%" });
      return () => {};
    });

    // ---------------------------------------------------------------
    // Mobile: lighter version (no pin, no velocity skew, simpler cuts)
    // ---------------------------------------------------------------
    mm.add(BREAKPOINTS.mobile, () => {
      const ctx = gsap.context(() => {
        const skillItems = gsap.utils.toArray(".skill-item");
        const categoryHeaders = gsap.utils.toArray(".category-header");

        gsap.fromTo(
          titleRef.current,
          { y: 50, opacity: 0, clipPath: "inset(0 100% 0 0)" },
          {
            y: 0,
            opacity: 1,
            clipPath: "inset(0 0% 0 0%)",
            duration: 0.9,
            ease: EASINGS.cineOut,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        );

        gsap.fromTo(
          categoryHeaders,
          { x: -24, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.6,
            ease: EASINGS.cineOut,
            stagger: 0.08,
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        );

        // Scrub-driven mask-wipe reveal for skill items (cinematic cut, lighter)
        skillItems.forEach((item) => {
          gsap.fromTo(
            item,
            { opacity: 0, y: 26, clipPath: "inset(0 0 100% 0)" },
            {
              opacity: 1,
              y: 0,
              clipPath: "inset(0 0 0% 0)",
              ease: "none",
              scrollTrigger: {
                trigger: item,
                start: "top 94%",
                end: "top 72%",
                scrub: 1,
              },
            },
          );
        });
      }, sectionRef);

      return () => ctx.revert();
    });

    // ---------------------------------------------------------------
    // Tablet: mid cinematic (clip-path wipes + depth parallax, no pin)
    // ---------------------------------------------------------------
    mm.add(BREAKPOINTS.tablet, () => {
      const ctx = gsap.context(() => {
        const categoryBlocks = gsap.utils.toArray(".category-block");

        gsap.fromTo(
          titleRef.current,
          { y: 70, opacity: 0, clipPath: "inset(0 100% 0 0)" },
          {
            y: 0,
            opacity: 1,
            clipPath: "inset(0 0% 0 0%)",
            duration: 1,
            ease: EASINGS.cine,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        );

        categoryBlocks.forEach((block, blockIndex) => {
          const header = block.querySelector(".category-header");
          const line = block.querySelector(".category-line");
          const items = block.querySelectorAll(".skill-item");
          const dir = blockIndex % 2 === 0 ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)";

          if (line) {
            gsap.fromTo(
              line,
              { scaleX: 0, transformOrigin: "left" },
              {
                scaleX: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: block,
                  start: "top 82%",
                  end: "top 62%",
                  scrub: 1,
                },
              },
            );
          }

          if (header) {
            gsap.fromTo(
              header,
              { x: -36, opacity: 0 },
              {
                x: 0,
                opacity: 1,
                duration: 0.7,
                ease: EASINGS.cineOut,
                scrollTrigger: {
                  trigger: block,
                  start: "top 78%",
                  toggleActions: "play none none reverse",
                },
              },
            );
          }

          // Cinematic clip-path mask wipe per item, scrubbed
          items.forEach((item) => {
            gsap.fromTo(
              item,
              { clipPath: dir, opacity: 0, scale: 0.92 },
              {
                clipPath: "inset(0 0% 0 0%)",
                opacity: 1,
                scale: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: item,
                  start: "top 90%",
                  end: "top 66%",
                  scrub: 1,
                },
              },
            );
          });

          // (per-block vertical parallax removed: it pulled blocks up into
          // the header/subtitle. Depth comes from the clip-path reveals.)
        });
      }, sectionRef);

      return () => ctx.revert();
    });

    // ---------------------------------------------------------------
    // Desktop: full cinematic
    // ---------------------------------------------------------------
    mm.add(BREAKPOINTS.desktop, () => {
      const ctx = gsap.context(() => {
        const skillItems = gsap.utils.toArray(".skill-item");
        const categoryBlocks = gsap.utils.toArray(".category-block");

        // --- SplitText heading: masked word reveal (yPercent from 100) ---
        if (titleRef.current) {
          const titleElement = titleRef.current.querySelector("h2");
          if (titleElement) {
            titleSplit = splitText(titleElement, { type: "words" });
            // Each word lives in an overflow-hidden mask so it slides up clean
            titleSplit.words.forEach((word) => {
              word.style.display = "inline-block";
              word.style.overflow = "hidden";
              word.style.paddingBottom = "0.12em";
              word.style.marginBottom = "-0.12em";
            });

            gsap.set(titleSplit.words, { yPercent: 100, opacity: 0 });

            // Header eyebrow + paragraph also wipe in as a clip cut
            gsap.fromTo(
              titleRef.current,
              { clipPath: "inset(0 100% 0 0)" },
              {
                clipPath: "inset(0 0% 0 0%)",
                duration: 1,
                ease: EASINGS.cine,
                scrollTrigger: {
                  trigger: sectionRef.current,
                  start: "top 78%",
                  toggleActions: "play none none reverse",
                },
              },
            );

            gsap.to(titleSplit.words, {
              yPercent: 0,
              opacity: 1,
              duration: 0.9,
              stagger: { each: 0.08, from: "start" },
              ease: EASINGS.cineOut,
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 78%",
                toggleActions: "play none none reverse",
              },
            });
          }
        }

        // --- DrawSVG spine: vertical timeline-style connector ---
        if (spineRef.current) {
          gsap.fromTo(
            spineRef.current,
            { drawSVG: "0%" },
            {
              drawSVG: "100%",
              ease: "none",
              scrollTrigger: {
                trigger: gridRef.current,
                start: "top 80%",
                end: "bottom 60%",
                scrub: 1,
              },
            },
          );
        }

        // --- ScrambleText filmic readouts (index + per-category counts) ---
        if (indexRef.current) {
          const finalIndex = indexRef.current.textContent;
          ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
            onEnter: () => {
              gsap.to(indexRef.current, {
                duration: 1.1,
                ease: "none",
                scrambleText: {
                  text: finalIndex,
                  chars: "0123456789",
                  speed: 0.6,
                },
              });
            },
          });
        }

        gsap.utils.toArray(".category-count").forEach((countEl) => {
          const finalCount = countEl.textContent;
          ScrollTrigger.create({
            trigger: countEl,
            start: "top 88%",
            once: true,
            onEnter: () => {
              gsap.to(countEl, {
                duration: 0.7,
                ease: "none",
                scrambleText: {
                  text: finalCount,
                  chars: "0123456789()",
                  speed: 0.8,
                },
              });
            },
          });
        });

        // Start velocity tracking for skew + marquee boost
        scrollVelocity.start();

        // --- Category blocks: cinematic scrubbed clip-path reveal + depth ---
        categoryBlocks.forEach((block, blockIndex) => {
          const header = block.querySelector(".category-header");
          const items = block.querySelectorAll(".skill-item");
          const line = block.querySelector(".category-line");
          const dot = block.querySelector(".category-dot");
          // alternate wipe direction per block for filmic variety
          const dir = blockIndex % 2 === 0 ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)";

          // Line draw (scrub)
          if (line) {
            gsap.fromTo(
              line,
              { scaleX: 0, transformOrigin: "left" },
              {
                scaleX: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: block,
                  start: "top 80%",
                  end: "top 60%",
                  scrub: 1,
                },
              },
            );
          }

          // Header slide + emerald dot ignite
          if (header) {
            gsap.fromTo(
              header,
              { x: -60, opacity: 0 },
              {
                x: 0,
                opacity: 1,
                duration: 0.7,
                ease: EASINGS.cineOut,
                scrollTrigger: {
                  trigger: block,
                  start: "top 78%",
                  toggleActions: "play none none reverse",
                },
              },
            );
          }
          if (dot) {
            gsap.fromTo(
              dot,
              { scale: 0, backgroundColor: "#ffffff" },
              {
                scale: 1,
                backgroundColor: EMERALD,
                duration: 0.5,
                ease: EASINGS.cut,
                scrollTrigger: {
                  trigger: block,
                  start: "top 76%",
                  toggleActions: "play none none reverse",
                },
              },
            );
          }

          // Skill items: scrubbed clip-path mask wipe (cinematic cut)
          if (items.length > 0) {
            Array.from(items).forEach((item) => {
              gsap.fromTo(
                item,
                {
                  clipPath: dir,
                  opacity: 0,
                  scale: 0.9,
                  transformOrigin: "left center",
                },
                {
                  clipPath: "inset(0 0% 0 0%)",
                  opacity: 1,
                  scale: 1,
                  ease: "none",
                  scrollTrigger: {
                    trigger: item,
                    start: "top 90%",
                    end: "top 64%",
                    scrub: 1,
                  },
                },
              );
            });
          }

          // (per-block vertical parallax removed: it pulled blocks up into
          // the header/subtitle and broke alignment. Depth comes from the
          // clip-path reveals and the active-pop instead.)

          // --- "Active" pop: center-of-viewport category gains emerald edge ---
          ScrollTrigger.create({
            trigger: block,
            start: "top 60%",
            end: "bottom 40%",
            onToggle: (self) => {
              const active = self.isActive;
              if (line) {
                gsap.to(line, {
                  backgroundImage: active
                    ? `linear-gradient(to right, ${EMERALD}, transparent)`
                    : "linear-gradient(to right, rgb(82 82 82), transparent)",
                  duration: 0.4,
                  ease: EASINGS.smooth,
                });
              }
              if (header) {
                gsap.to(header, {
                  color: active ? "#ffffff" : "rgb(163 163 163)",
                  duration: 0.4,
                  ease: EASINGS.smooth,
                });
              }
              gsap.to(block, {
                "--active-scale": active ? 1.015 : 1,
                scale: active ? 1.015 : 1,
                duration: 0.5,
                ease: EASINGS.cineOut,
                overwrite: "auto",
              });
            },
          });
        });

        // --- Magnetic hover + 3D tilt (preserved, eased filmic) ---
        skillItems.forEach((item) => {
          const cleanup = applyMagneticEffect(item, {
            strength: 0.25,
            ease: 0.25,
            resetEase: 0.5,
            resetEaseType: "power3.out",
          });
          magneticCleanups.push(cleanup);

          const icon = item.querySelector("img");
          const name = item.querySelector(".skill-name");
          const edge = item.querySelector(".skill-edge");

          item.addEventListener("mouseenter", () => {
            gsap.to(item, {
              scale: 1.12,
              boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
              borderColor: "rgba(16,185,129,0.55)",
              duration: 0.3,
              ease: EASINGS.cineOut,
            });
            if (name) gsap.to(name, { color: "#fff", duration: 0.2 });
            if (edge)
              gsap.to(edge, {
                scaleX: 1,
                duration: 0.35,
                ease: EASINGS.cut,
              });
          });

          item.addEventListener("mousemove", (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -15;
            const rotateY = ((x - centerX) / centerX) * 15;

            gsap.to(item, {
              rotateX,
              rotateY,
              duration: 0.3,
              ease: "power2.out",
            });

            if (icon) {
              gsap.to(icon, {
                x: ((x - centerX) / centerX) * -12,
                y: ((y - centerY) / centerY) * -12,
                scale: 1.25,
                duration: 0.3,
                ease: "power2.out",
              });
            }
          });

          item.addEventListener("mouseleave", () => {
            gsap.to(item, {
              scale: 1,
              rotateX: 0,
              rotateY: 0,
              boxShadow: "none",
              borderColor: "rgba(64,64,64,1)",
              duration: 0.5,
              ease: "power3.out",
            });
            if (icon) {
              gsap.to(icon, { x: 0, y: 0, scale: 1, duration: 0.5, ease: "power3.out" });
            }
            if (name) gsap.to(name, { color: "rgb(212 212 212)", duration: 0.3 });
            if (edge)
              gsap.to(edge, { scaleX: 0, duration: 0.4, ease: "power3.out" });
          });
        });

        // --- Velocity-reactive marquee (kept + improved) ---
        let marqueeTween = null;
        if (marqueeRef.current) {
          marqueeTween = gsap.to(marqueeRef.current, {
            x: "-50%",
            ease: "none",
            duration: 40,
            repeat: -1,
          });
        }

        velocityUnsubscribe = scrollVelocity.subscribe(() => {
          const normalizedVelocity = scrollVelocity.getNormalizedVelocity(1500);
          const skewAmount =
            normalizedVelocity * 3 * Math.sign(scrollVelocity.velocity);

          if (gridRef.current) {
            gsap.to(gridRef.current, {
              skewY: skewAmount,
              duration: 0.2,
              ease: "power1.out",
              overwrite: "auto",
            });
          }

          // Marquee speed boost (timeScale, not property) + slight skew reaction
          if (marqueeTween) {
            const speedMultiplier = 1 + normalizedVelocity * 3;
            marqueeTween.timeScale(speedMultiplier);
          }
          if (marqueeRef.current) {
            gsap.to(marqueeRef.current, {
              skewX: skewAmount * 1.5,
              duration: 0.25,
              ease: "power1.out",
              overwrite: "auto",
            });
          }
        });

        // (grid parallax removed to guarantee the grid never drifts up into
        // the header/subtitle. The section stays cleanly laid out.)
      }, sectionRef);

      return () => {
        ctx.revert();
        magneticCleanups.forEach((cleanup) => cleanup());
        magneticCleanups = [];
        if (velocityUnsubscribe) velocityUnsubscribe();
        scrollVelocity.stop();
        cleanupTitleSplit();
      };
    });

    return () => {
      mm.revert();
      cleanupTitleSplit();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen w-full bg-neutral-950 py-16 md:py-24 sticky top-0 overflow-hidden"
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent" />

      {/* Marquee */}
      <div className="hidden lg:block absolute top-4 left-0 w-full overflow-hidden opacity-10">
        <div
          ref={marqueeRef}
          className="whitespace-nowrap font-mono text-sm text-neutral-500 uppercase tracking-widest"
          style={{ width: "200%", willChange: "transform" }}
        >
          {marqueeText} • {marqueeText} •{" "}
        </div>
      </div>

      {/* DrawSVG spine connector (left rail, desktop) */}
      <svg
        className="hidden lg:block absolute left-6 top-40 bottom-24 w-px pointer-events-none"
        width="1"
        height="100%"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <line
          ref={spineRef}
          x1="0.5"
          y1="0"
          x2="0.5"
          y2="100%"
          stroke={EMERALD}
          strokeWidth="1"
          strokeOpacity="0.5"
        />
      </svg>

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        {/* Section header */}
        <div
          ref={titleRef}
          className="relative z-20 mb-12 md:mb-20"
          style={{ perspective: "1000px", willChange: "clip-path" }}
        >
          <div className="flex items-center gap-4 md:gap-6 mb-4">
            <span
              ref={indexRef}
              className="font-mono text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] text-emerald-500"
            >
              03
            </span>
            <div className="flex-1 h-px bg-neutral-800" />
          </div>
          <h2
            className="text-3xl md:text-5xl lg:text-7xl font-bold tracking-tight text-white"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Skills
          </h2>
          <p className="mt-4 md:mt-5 text-neutral-400 font-mono text-xs md:text-sm max-w-xl">
            Technologies and tools I work with to bring ideas to life.
          </p>
        </div>

        {/* Skills grid by category */}
        <div
          ref={gridRef}
          className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12"
          style={{ perspective: "1200px", willChange: "transform" }}
        >
          {Object.entries(categories).map(([category, categorySkills]) => (
            <div
              key={category}
              className="category-block space-y-4"
              style={{ willChange: "transform" }}
            >
              <div className="category-line h-px w-full bg-gradient-to-r from-neutral-600 to-transparent mb-2" />

              <div className="category-header flex items-center gap-3 text-neutral-400">
                <div className="category-dot w-2 h-2 bg-white rounded-full pulse-glow" />
                <h3 className="font-mono text-xs uppercase tracking-[0.2em]">
                  {category}
                </h3>
                <span className="category-count font-mono text-[10px] text-neutral-600">
                  ({categorySkills.length})
                </span>
              </div>

              <div className="flex flex-wrap gap-2 md:grid md:grid-cols-2 md:gap-3">
                {categorySkills.map((skill) => (
                  <div
                    key={skill.name}
                    className="skill-item group relative p-2 md:p-4 border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800/80 transition-colors cursor-default"
                    style={{
                      transformStyle: "preserve-3d",
                      backfaceVisibility: "hidden",
                    }}
                  >
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center relative">
                        <img
                          src={skill.image}
                          alt={skill.name}
                          className="w-4 h-4 md:w-6 md:h-6 object-contain invert opacity-70 group-hover:opacity-100 transition-opacity"
                          style={{ transform: "translateZ(20px)" }}
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      </div>
                      <span className="skill-name text-xs md:text-sm text-neutral-300 group-hover:text-white transition-colors">
                        {skill.name}
                      </span>
                    </div>

                    {/* Emerald top edge wipe (GSAP-driven on hover) */}
                    <div
                      className="skill-edge absolute top-0 left-0 w-full h-px origin-left"
                      style={{ backgroundColor: EMERALD, transform: "scaleX(0)" }}
                    />
                    <div className="hidden md:block absolute bottom-0 right-0 w-3 h-3 border-r border-b border-neutral-700 group-hover:border-emerald-500/60 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative corner elements */}
      <div className="hidden md:block absolute top-8 right-8 w-16 h-16 border-r border-t border-neutral-800" />
      <div className="hidden md:block absolute bottom-8 left-8 w-16 h-16 border-l border-b border-neutral-800" />

      <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 font-mono text-[10px] md:text-xs text-neutral-600 tracking-widest">
        03 / 07
      </div>
    </section>
  );
}

export default ScrollSkillsSection;
