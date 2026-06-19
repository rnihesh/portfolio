import { useRef, useEffect, useState } from "react";
import {
  gsap,
  ScrollTrigger,
  SplitText,
  Flip,
  DrawSVGPlugin,
  BREAKPOINTS,
  EASINGS,
  scrollVelocity,
} from "../../utils/gsapConfig";
import { projects } from "../../data/projects";

// A small, curated tech readout per project index (monospace stat line).
// Kept generic + cycled so every scene has a "spec" to scramble in.
const SCENE_TECH = [
  ["TypeScript", "Neo4j", "LLM"],
  ["Next.js", "Prisma", "React Flow"],
  ["Swift", "SwiftUI", "IOKit"],
  ["Go", "TipTap", "MCP"],
  ["Next.js", "MDX", "Search"],
  ["React", "MongoDB", "Leaflet"],
  ["React", "Cron", "Express"],
  ["React", "Gemini", "Cloudinary"],
  ["React", "WebSockets", "ws"],
];

function ScrollProjectsSection() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const galleryContainerRef = useRef(null);
  const titleRef = useRef(null);
  const counterRef = useRef(null);
  const spineRef = useRef(null);
  const [layout, setLayout] = useState("desktop");
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const mm = gsap.matchMedia();

    // ----------------------------------------------------------------
    // REDUCED MOTION: clean final states, no transforms, no splits.
    // ----------------------------------------------------------------
    mm.add(BREAKPOINTS.reducedMotion, () => {
      gsap.set(headerRef.current, { opacity: 1, y: 0 });
      const root = sectionRef.current;
      if (root) {
        gsap.set(
          root.querySelectorAll(
            ".project-card-mobile, .gallery-item, .project-image-container, .project-content, .project-content-mobile, .project-title, .project-description, .tech-tag, .project-links, .scene-stat",
          ),
          {
            opacity: 1,
            y: 0,
            x: 0,
            rotation: 0,
            scale: 1,
            skewX: 0,
            clipPath: "inset(0 0% 0 0%)",
          },
        );
        gsap.set(root.querySelectorAll(".scene-spine"), { drawSVG: "100%" });
      }
      return () => {};
    });

    // ----------------------------------------------------------------
    // MOBILE / TABLET: lighter cinematic. Masked SplitText line reveal
    // on titles, clip wipes on imagery, alternating card cuts.
    // ----------------------------------------------------------------
    const buildCompact = (config) => () => {
      setLayout("mobile");
      const splits = [];
      const ctx = gsap.context(() => {
        requestAnimationFrame(() => {
          const projectCards = gsap.utils.toArray(".project-card-mobile");

          gsap.fromTo(
            headerRef.current,
            { y: config.headerY, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.9,
              ease: EASINGS.cineOut,
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            },
          );

          projectCards.forEach((card, i) => {
            const isEven = i % 2 === 0;
            const imageContainer = card.querySelector(
              ".project-image-container",
            );
            const titleEl = card.querySelector(".project-title-mobile");

            // Alternating cinematic cut-in
            gsap.fromTo(
              card,
              { x: isEven ? -config.cardX : config.cardX, opacity: 0 },
              {
                x: 0,
                opacity: 1,
                duration: 0.8,
                ease: EASINGS.cine,
                scrollTrigger: {
                  trigger: card,
                  start: "top 90%",
                  toggleActions: "play none none reverse",
                },
              },
            );

            // Clip-path image wipe (alternating direction)
            if (imageContainer) {
              gsap.fromTo(
                imageContainer,
                {
                  clipPath: isEven
                    ? "inset(0 100% 0 0)"
                    : "inset(0 0 0 100%)",
                },
                {
                  clipPath: "inset(0 0% 0 0%)",
                  duration: 0.9,
                  ease: EASINGS.cine,
                  scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                    toggleActions: "play none none reverse",
                  },
                },
              );
            }

            // Masked SplitText line reveal on the title
            if (titleEl) {
              const split = new SplitText(titleEl, {
                type: "lines",
                linesClass: "split-line",
              });
              splits.push(split);
              split.lines.forEach((line) => {
                const wrap = document.createElement("span");
                wrap.style.display = "block";
                wrap.style.overflow = "hidden";
                line.parentNode.insertBefore(wrap, line);
                wrap.appendChild(line);
              });
              gsap.fromTo(
                split.lines,
                { yPercent: 110 },
                {
                  yPercent: 0,
                  duration: 0.8,
                  stagger: 0.08,
                  ease: EASINGS.cineOut,
                  scrollTrigger: {
                    trigger: card,
                    start: "top 82%",
                    toggleActions: "play none none reverse",
                  },
                },
              );
            }
          });
        });
      }, sectionRef);

      return () => {
        ctx.revert();
        splits.forEach((s) => s.revert());
      };
    };

    mm.add(BREAKPOINTS.mobile, buildCompact({ headerY: 50, cardX: 70 }));
    mm.add(BREAKPOINTS.tablet, buildCompact({ headerY: 60, cardX: 110 }));

    // ----------------------------------------------------------------
    // DESKTOP: pinned horizontal film-strip scrub. Each project is a
    // SCENE that cuts in with a clip-path wipe, masked SplitText title,
    // layered parallax depth, a scale "focus" on the active scene, a
    // DrawSVG spine readout, and a scrambled monospace index/stat.
    // ----------------------------------------------------------------
    mm.add(BREAKPOINTS.desktop, () => {
      setLayout("desktop");
      let velocityUnsubscribe = null;
      const splits = [];
      const cleanups = [];
      let scrubbedScrambles = [];

      const ctx = gsap.context(() => {
        requestAnimationFrame(() => {
          const container = galleryContainerRef.current;
          const galleryItems = gsap.utils.toArray(".gallery-item");
          if (!container) return;

          // Horizontal travel distance = full strip width minus one viewport.
          // The pinned scroll length MUST equal this exact distance so the
          // reel finishes translating precisely as the pin releases. Adding an
          // extra viewport (the previous bug) left dead scroll where the next
          // (Connect) section could show through / interleave with the reel.
          const getTravel = () => container.scrollWidth - window.innerWidth;

          scrollVelocity.start();

          // ---- Header title: masked line reveal via SplitText ----
          if (titleRef.current) {
            const titleSplit = new SplitText(titleRef.current, {
              type: "lines",
              linesClass: "split-line",
            });
            splits.push(titleSplit);
            titleSplit.lines.forEach((line) => {
              const wrap = document.createElement("span");
              wrap.style.display = "block";
              wrap.style.overflow = "hidden";
              line.parentNode.insertBefore(wrap, line);
              wrap.appendChild(line);
            });
            gsap.set(titleSplit.lines, { yPercent: 115 });

            gsap.timeline({
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            }).to(titleSplit.lines, {
              yPercent: 0,
              duration: 1,
              stagger: 0.08,
              ease: EASINGS.cineOut,
            });
          }

          // ---- The pinned horizontal scrub (the spine of the reel) ----
          const scrollTween = gsap.to(container, {
            x: () => -getTravel(),
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              // Reserve EXACTLY the horizontal travel so the strip is fully
              // played before the pin releases. With default pinSpacing (true)
              // the pin reserves its own scroll length, so the next section
              // cannot slide underneath: no bleed, no interleaving.
              end: () => `+=${getTravel()}`,
              scrub: 1,
              pin: true,
              pinSpacing: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onEnter: () =>
                gsap.set(container, { willChange: "transform" }),
              onLeave: () => gsap.set(container, { willChange: "auto" }),
              onUpdate: (self) => {
                const newIndex = Math.min(
                  Math.floor(self.progress * galleryItems.length),
                  galleryItems.length - 1,
                );
                setActiveIndex((prev) =>
                  prev === newIndex ? prev : newIndex,
                );
                // Scramble the master counter as the reel moves.
                if (counterRef.current) {
                  counterRef.current.textContent = `${String(
                    newIndex + 1,
                  ).padStart(2, "0")} / ${String(projects.length).padStart(
                    2,
                    "0",
                  )}`;
                }
              },
            },
          });

          // ---- DrawSVG progress spine tied to the scrub ----
          if (spineRef.current) {
            const spinePath = spineRef.current.querySelector(".scene-spine");
            if (spinePath) {
              gsap.set(spinePath, { drawSVG: "0%" });
              gsap.to(spinePath, {
                drawSVG: "100%",
                ease: "none",
                scrollTrigger: {
                  trigger: sectionRef.current,
                  start: "top top",
                  // Same length as the master scrub so the spine draws to
                  // 100% exactly when the reel completes.
                  end: () => `+=${getTravel()}`,
                  scrub: 1,
                },
              });
            }
          }

          // ---- Per scene choreography ----
          galleryItems.forEach((item, i) => {
            const imageContainer = item.querySelector(
              ".project-image-container",
            );
            const image = item.querySelector(".project-image");
            const content = item.querySelector(".project-content");
            const title = item.querySelector(".project-title");
            const description = item.querySelector(".project-description");
            const techTags = item.querySelectorAll(".tech-tag");
            const links = item.querySelector(".project-links");
            const stat = item.querySelector(".scene-stat");
            const isEven = i % 2 === 0;

            // SCENE ENTRANCE: a filmic settle (no chaotic spins).
            gsap.fromTo(
              item,
              { yPercent: isEven ? -14 : 14, opacity: 0, scale: 0.94 },
              {
                yPercent: 0,
                opacity: 1,
                scale: 1,
                ease: EASINGS.cine,
                scrollTrigger: {
                  trigger: item,
                  containerAnimation: scrollTween,
                  start: "left 95%",
                  end: "left 55%",
                  scrub: 1,
                },
              },
            );

            // SCENE EXIT: a decisive cut out (scale + opacity, no debris).
            gsap.to(item, {
              yPercent: isEven ? 12 : -12,
              opacity: 0,
              scale: 0.9,
              ease: EASINGS.cut,
              scrollTrigger: {
                trigger: item,
                containerAnimation: scrollTween,
                start: "right 45%",
                end: "right 8%",
                scrub: 1,
              },
            });

            // CLIP-PATH IMAGE WIPE: alternating cinematic mask.
            if (imageContainer) {
              const wipes = [
                { from: "inset(0 100% 0 0)", to: "inset(0 0% 0 0%)" }, // L to R
                { from: "inset(0 0 0 100%)", to: "inset(0 0 0 0%)" }, // R to L
                { from: "inset(100% 0 0 0)", to: "inset(0% 0 0 0)" }, // top down
                { from: "inset(0 0 100% 0)", to: "inset(0 0 0% 0)" }, // bottom up
              ];
              const clip = wipes[i % wipes.length];
              gsap.fromTo(
                imageContainer,
                { clipPath: clip.from },
                {
                  clipPath: clip.to,
                  ease: EASINGS.cine,
                  scrollTrigger: {
                    trigger: item,
                    containerAnimation: scrollTween,
                    start: "left 85%",
                    end: "left 48%",
                    scrub: 1,
                  },
                },
              );
            }

            // LAYERED PARALLAX (depth): image drifts, content drifts a touch.
            if (image) {
              gsap.fromTo(
                image,
                { xPercent: 8 },
                {
                  xPercent: -8,
                  ease: "none",
                  scrollTrigger: {
                    trigger: item,
                    containerAnimation: scrollTween,
                    start: "left 100%",
                    end: "right 0%",
                    scrub: 1,
                  },
                },
              );
            }

            if (content) {
              gsap.fromTo(
                content,
                { xPercent: isEven ? 5 : -5 },
                {
                  xPercent: 0,
                  ease: "none",
                  scrollTrigger: {
                    trigger: item,
                    containerAnimation: scrollTween,
                    start: "left 100%",
                    end: "right 0%",
                    scrub: 1,
                  },
                },
              );
            }

            // MASKED SPLITTEXT TITLE: lines wipe up from behind a mask.
            if (title) {
              const split = new SplitText(title, {
                type: "lines",
                linesClass: "split-line",
              });
              splits.push(split);
              split.lines.forEach((line) => {
                const wrap = document.createElement("span");
                wrap.style.display = "block";
                wrap.style.overflow = "hidden";
                line.parentNode.insertBefore(wrap, line);
                wrap.appendChild(line);
              });
              gsap.fromTo(
                split.lines,
                { yPercent: 115 },
                {
                  yPercent: 0,
                  duration: 0.9,
                  stagger: 0.07,
                  ease: EASINGS.cineOut,
                  scrollTrigger: {
                    trigger: item,
                    containerAnimation: scrollTween,
                    start: "left 60%",
                    toggleActions: "play none none reverse",
                  },
                },
              );
            }

            if (description) {
              gsap.fromTo(
                description,
                { y: 18, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 0.6,
                  ease: EASINGS.cineOut,
                  scrollTrigger: {
                    trigger: item,
                    containerAnimation: scrollTween,
                    start: "left 58%",
                    toggleActions: "play none none reverse",
                  },
                },
              );
            }

            // SCRAMBLE the per scene index + spec readout (monospace).
            if (stat) {
              const finalText = `0${i + 1} / ${SCENE_TECH[
                i % SCENE_TECH.length
              ].join("  ")}`;
              const st = ScrollTrigger.create({
                trigger: item,
                containerAnimation: scrollTween,
                start: "left 62%",
                onEnter: () =>
                  gsap.to(stat, {
                    duration: 1.1,
                    ease: "none",
                    scrambleText: {
                      text: finalText,
                      chars: "upperAndLowerCase",
                      speed: 0.4,
                      revealDelay: 0.2,
                    },
                  }),
                onLeaveBack: () => {
                  gsap.killTweensOf(stat);
                  stat.textContent = "";
                },
              });
              scrubbedScrambles.push(st);
            }

            if (techTags.length > 0) {
              gsap.fromTo(
                techTags,
                { y: 22, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 0.5,
                  stagger: 0.07,
                  ease: EASINGS.cineOut,
                  scrollTrigger: {
                    trigger: item,
                    containerAnimation: scrollTween,
                    start: "left 50%",
                    toggleActions: "play none none reverse",
                  },
                },
              );
            }

            if (links) {
              gsap.fromTo(
                links,
                { y: 18, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 0.5,
                  ease: EASINGS.cineOut,
                  scrollTrigger: {
                    trigger: item,
                    containerAnimation: scrollTween,
                    start: "left 45%",
                    toggleActions: "play none none reverse",
                  },
                },
              );
            }

            // SCALE FOCUS: the active scene image breathes to 1, neighbours
            // sit slightly pulled back. Driven by the scrub center cross.
            if (imageContainer) {
              gsap.fromTo(
                imageContainer,
                { scale: 0.96 },
                {
                  scale: 1,
                  ease: EASINGS.cineOut,
                  scrollTrigger: {
                    trigger: item,
                    containerAnimation: scrollTween,
                    start: "left center",
                    end: "center center",
                    scrub: 1,
                  },
                },
              );
            }

            // Hover parallax inside the framed image (pointer focus).
            if (imageContainer && image) {
              const onEnter = () =>
                gsap.to(image, {
                  scale: 1.1,
                  duration: 0.6,
                  ease: EASINGS.cineOut,
                });
              const onMove = (e) => {
                const rect = imageContainer.getBoundingClientRect();
                const cx = rect.width / 2;
                const cy = rect.height / 2;
                gsap.to(image, {
                  x: ((e.clientX - rect.left - cx) / cx) * -12,
                  y: ((e.clientY - rect.top - cy) / cy) * -8,
                  duration: 0.4,
                  ease: "power2.out",
                  overwrite: "auto",
                });
              };
              const onLeave = () =>
                gsap.to(image, {
                  scale: 1,
                  x: 0,
                  y: 0,
                  duration: 0.7,
                  ease: EASINGS.cineOut,
                });
              imageContainer.addEventListener("mouseenter", onEnter);
              imageContainer.addEventListener("mousemove", onMove);
              imageContainer.addEventListener("mouseleave", onLeave);
              cleanups.push(() => {
                imageContainer.removeEventListener("mouseenter", onEnter);
                imageContainer.removeEventListener("mousemove", onMove);
                imageContainer.removeEventListener("mouseleave", onLeave);
              });
            }
          });

          // VELOCITY-REACTIVE SKEW on the whole strip (restrained).
          velocityUnsubscribe = scrollVelocity.subscribe((velocity) => {
            const n = Math.min(Math.abs(velocity), 1500) / 1500;
            const skew = n * 2.2 * Math.sign(velocity);
            gsap.to(container, {
              skewY: skew,
              duration: 0.2,
              ease: "power1.out",
              overwrite: "auto",
            });
          });
        });
      }, sectionRef);

      return () => {
        ctx.revert();
        scrubbedScrambles.forEach((st) => st.kill());
        cleanups.forEach((fn) => fn());
        if (velocityUnsubscribe) velocityUnsubscribe();
        scrollVelocity.stop();
        splits.forEach((s) => s.revert());
      };
    });

    return () => mm.revert();
  }, []);

  // ---- FLIP-based active indicator focus (runs after activeIndex paint) ----
  useEffect(() => {
    if (layout !== "desktop") return;
    const dots = sectionRef.current?.querySelectorAll(".scene-dot");
    if (!dots || dots.length === 0) return;
    const state = Flip.getState(dots);
    dots.forEach((dot, i) => {
      dot.dataset.active = i === activeIndex ? "true" : "false";
    });
    Flip.from(state, {
      duration: 0.45,
      ease: EASINGS.cineOut,
      absolute: false,
    });
  }, [activeIndex, layout]);

  // ----------------------------------------------------------------
  // MOBILE / TABLET layout
  // ----------------------------------------------------------------
  if (layout === "mobile") {
    return (
      <section
        ref={sectionRef}
        className="min-h-screen w-full bg-black py-16 md:py-24 relative overflow-hidden"
      >
        <div className="dot-pattern absolute inset-0 pointer-events-none" />
        <div
          ref={headerRef}
          className="max-w-7xl mx-auto px-4 md:px-6 mb-12 md:mb-20"
        >
          <div className="flex items-center gap-4 md:gap-6 mb-4">
            <span className="font-mono text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] text-neutral-500">
              04
            </span>
            <div className="flex-1 h-px bg-neutral-800" />
          </div>
          <h2
            className="text-3xl md:text-5xl font-bold tracking-tight text-white"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Selected Work
          </h2>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="space-y-12 md:space-y-20">
            {projects.map((project, i) => (
              <article
                key={project.title}
                className="project-card-mobile relative"
              >
                <div className="project-image-container relative aspect-video overflow-hidden mb-4 md:mb-6">
                  <img
                    src={project.src}
                    alt={project.title}
                    className="project-image w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute bottom-3 right-3 font-mono text-xs text-white/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="project-content-mobile">
                  <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.15em] text-neutral-500 mb-1 block">
                    {project.description}
                  </span>
                  <h3
                    className="project-title-mobile text-xl md:text-2xl font-bold tracking-tight text-white mb-3"
                    style={{ fontFamily: "Space Grotesk, sans-serif" }}
                  >
                    {project.title}
                  </h3>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {SCENE_TECH[i % SCENE_TECH.length].map((tech) => (
                      <span
                        key={tech}
                        className="tech-tag px-2 py-0.5 text-[10px] font-mono border border-neutral-700 text-neutral-400"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    {project.ctaLink && (
                      <a
                        href={project.ctaLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 text-xs font-mono uppercase tracking-wider border border-white text-white hover:bg-emerald-500 hover:border-emerald-500 hover:text-black transition-colors"
                      >
                        View Live
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="absolute bottom-4 right-4 font-mono text-[10px] text-neutral-600 tracking-widest">
          04 / 07
        </div>
      </section>
    );
  }

  // ----------------------------------------------------------------
  // DESKTOP layout: pinned horizontal film-strip
  // ----------------------------------------------------------------
  return (
    <section
      ref={sectionRef}
      className="h-screen w-full bg-black overflow-hidden relative"
    >
      <div className="dot-pattern absolute inset-0 pointer-events-none" />

      <div className="absolute top-8 left-8 z-20">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-emerald-500">
          04 / Selected Work
        </span>
        <h2
          ref={titleRef}
          className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          The Reel
        </h2>
      </div>

      <div
        ref={counterRef}
        className="absolute top-8 right-8 z-20 font-mono text-sm text-neutral-400"
      >
        01 / {String(projects.length).padStart(2, "0")}
      </div>

      {/* DrawSVG progress spine: a line that draws as the reel runs */}
      <div
        ref={spineRef}
        className="absolute top-1/2 left-8 right-8 -translate-y-1/2 z-0 pointer-events-none"
      >
        <svg
          className="w-full"
          height="2"
          viewBox="0 0 1000 2"
          preserveAspectRatio="none"
        >
          <line
            x1="0"
            y1="1"
            x2="1000"
            y2="1"
            stroke="#262626"
            strokeWidth="2"
          />
          <line
            className="scene-spine"
            x1="0"
            y1="1"
            x2="1000"
            y2="1"
            stroke="#10b981"
            strokeWidth="2"
          />
        </svg>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {projects.map((_, i) => (
          <div
            key={i}
            data-active={i === activeIndex ? "true" : "false"}
            className="scene-dot w-2 h-2 rounded-full bg-neutral-600 data-[active=true]:bg-emerald-500 data-[active=true]:scale-[1.6] data-[active=true]:shadow-[0_0_10px_rgba(16,185,129,0.6)] transition-colors"
          />
        ))}
      </div>

      <div
        ref={galleryContainerRef}
        className="h-full flex items-center horizontal-scroll-container"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="w-[50vw] h-full shrink-0" />

        {projects.map((project, i) => (
          <article
            key={project.title}
            className="gallery-item shrink-0 h-full flex items-center px-8 relative"
            style={{ width: "80vw", maxWidth: "1400px" }}
          >
            <div className="relative z-10 grid grid-cols-12 gap-8 items-center w-full">
              <div className="col-span-7">
                <div className="project-image-container relative aspect-[16/10] overflow-hidden group">
                  <img
                    src={project.src}
                    alt={project.title}
                    className="project-image w-full h-full object-cover"
                    style={{ transform: "scale(1.1)" }}
                  />
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-6 z-10">
                    {project.ctaLink && (
                      <a
                        href={project.ctaLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-cta px-8 py-4 border border-emerald-500 text-emerald-400 text-sm font-mono uppercase tracking-wider hover:bg-emerald-500 hover:text-black transition-colors"
                      >
                        <span>View Live</span>
                      </a>
                    )}
                  </div>
                  <div className="absolute top-4 left-4 w-8 h-8 border-l border-t border-emerald-500/40" />
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-r border-b border-emerald-500/40" />
                </div>
              </div>

              <div className="col-span-5 project-content">
                <span className="scene-stat block font-mono text-[11px] uppercase tracking-[0.18em] text-emerald-500 mb-4 min-h-[14px]" />
                <span className="project-description font-mono text-xs uppercase tracking-[0.2em] text-neutral-500 mb-4 block">
                  {project.description}
                </span>
                <h3
                  className="project-title text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  {project.title}
                </h3>
                <div className="w-16 h-px bg-gradient-to-r from-emerald-500 to-transparent mb-6" />
                <div className="flex flex-wrap gap-2 mb-8">
                  {SCENE_TECH[i % SCENE_TECH.length].map((tech) => (
                    <span
                      key={tech}
                      className="tech-tag px-4 py-2 text-xs font-mono border border-neutral-700 text-neutral-300 hover:border-emerald-500 hover:text-white transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="project-links flex gap-4">
                  {project.ctaLink && (
                    <a
                      href={project.ctaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-2 text-white font-mono text-sm uppercase tracking-wider hover:text-emerald-400 transition-colors"
                    >
                      <span>Visit Project</span>
                      <svg
                        className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}

        <div className="w-screen h-full shrink-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-px bg-emerald-500/40 mx-auto mb-8" />
            <span className="font-mono text-sm uppercase tracking-[0.2em] text-neutral-500">
              Continue scrolling
            </span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 right-8 font-mono text-xs text-neutral-600 tracking-widest">
        04 / 07
      </div>
    </section>
  );
}

export default ScrollProjectsSection;
