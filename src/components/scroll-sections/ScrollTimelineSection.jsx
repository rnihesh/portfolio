import { useRef, useEffect } from "react";
import {
  gsap,
  ScrollTrigger,
  SplitText,
  DrawSVGPlugin,
  ScrambleTextPlugin,
  BREAKPOINTS,
  EASINGS,
  scrollVelocity,
} from "../../utils/gsapConfig";
import { experience } from "../../data/experience";

const EMERALD = "#10b981";

function ScrollTimelineSection() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const eyebrowRef = useRef(null);
  const introRef = useRef(null);
  const cardsContainerRef = useRef(null);
  const spineWrapRef = useRef(null);
  const spinePathRef = useRef(null);
  const spineTrackRef = useRef(null);
  const progressLabelRef = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    const splits = [];

    const makeSplit = (el, type) => {
      if (!el) return null;
      const s = new SplitText(el, {
        type,
        linesClass: "exp-split-line",
        mask: type.includes("lines") ? "lines" : undefined,
      });
      splits.push(s);
      return s;
    };

    // ---------------------------------------------------------------
    // Reduced motion: clean, fully visible final state. No transforms.
    // ---------------------------------------------------------------
    mm.add(BREAKPOINTS.reducedMotion, () => {
      const items = sectionRef.current?.querySelectorAll(
        ".exp-card, .exp-node, .exp-skill, .exp-period, .exp-connector",
      );
      if (items) gsap.set(items, { opacity: 1, x: 0, y: 0, scale: 1, clearProps: "clipPath" });
      if (spinePathRef.current) gsap.set(spinePathRef.current, { drawSVG: "100%" });
      if (progressLabelRef.current) progressLabelRef.current.textContent = "100";
      return () => {};
    });

    // ---------------------------------------------------------------
    // MOBILE: lighter chapter reveals, spine still draws, no pin.
    // ---------------------------------------------------------------
    mm.add(BREAKPOINTS.mobile, () => {
      const ctx = gsap.context(() => {
        requestAnimationFrame(() => {
          const cards = gsap.utils.toArray(".exp-card");

          // Title: masked line reveal
          const tSplit = makeSplit(titleRef.current, "lines");
          if (tSplit) {
            gsap.from(tSplit.lines, {
              yPercent: 110,
              duration: 0.9,
              stagger: 0.08,
              ease: EASINGS.cine,
              scrollTrigger: { trigger: sectionRef.current, start: "top 82%" },
            });
          }

          // Spine draw as the whole list scrolls past
          if (spinePathRef.current && spineTrackRef.current) {
            gsap.set(spinePathRef.current, { drawSVG: "0%" });
            gsap.to(spinePathRef.current, {
              drawSVG: "100%",
              ease: "none",
              scrollTrigger: {
                trigger: cardsContainerRef.current,
                start: "top 70%",
                end: "bottom 75%",
                scrub: 0.6,
              },
            });
          }

          cards.forEach((card) => {
            const node = card.querySelector(".exp-node");
            const period = card.querySelector(".exp-period");
            const skills = card.querySelectorAll(".exp-skill");

            gsap.from(card, {
              y: 50,
              opacity: 0,
              duration: 0.8,
              ease: EASINGS.cineOut,
              scrollTrigger: { trigger: card, start: "top 88%" },
            });

            if (node) {
              gsap.from(node, {
                scale: 0,
                duration: 0.5,
                ease: EASINGS.snappy,
                scrollTrigger: { trigger: card, start: "top 84%" },
              });
            }

            if (period) {
              ScrollTrigger.create({
                trigger: card,
                start: "top 82%",
                once: true,
                onEnter: () => scramblePeriod(period),
              });
            }

            if (skills.length) {
              gsap.from(skills, {
                y: 14,
                opacity: 0,
                stagger: 0.05,
                duration: 0.35,
                ease: EASINGS.snappy,
                scrollTrigger: { trigger: card, start: "top 76%" },
              });
            }
          });
        });
      }, sectionRef);
      return () => ctx.revert();
    });

    // ---------------------------------------------------------------
    // TABLET: a fuller version, alternating slide-in, no pin.
    // ---------------------------------------------------------------
    mm.add(BREAKPOINTS.tablet, () => {
      const ctx = gsap.context(() => {
        requestAnimationFrame(() => {
          const cards = gsap.utils.toArray(".exp-card");

          const tSplit = makeSplit(titleRef.current, "lines");
          if (tSplit) {
            gsap.from(tSplit.lines, {
              yPercent: 110,
              duration: 1,
              stagger: 0.1,
              ease: EASINGS.cine,
              scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
            });
          }

          if (spinePathRef.current) {
            gsap.set(spinePathRef.current, { drawSVG: "0%" });
            gsap.to(spinePathRef.current, {
              drawSVG: "100%",
              ease: "none",
              scrollTrigger: {
                trigger: cardsContainerRef.current,
                start: "top 65%",
                end: "bottom 75%",
                scrub: 0.6,
              },
            });
          }

          cards.forEach((card) => {
            const node = card.querySelector(".exp-node");
            const connector = card.querySelector(".exp-connector");
            const period = card.querySelector(".exp-period");
            const skills = card.querySelectorAll(".exp-skill");

            gsap.from(card, {
              x: -70,
              opacity: 0,
              duration: 1,
              ease: EASINGS.cineOut,
              scrollTrigger: { trigger: card, start: "top 85%" },
            });

            if (connector) {
              gsap.fromTo(
                connector,
                { drawSVG: "0%" },
                {
                  drawSVG: "100%",
                  duration: 0.6,
                  ease: EASINGS.cut,
                  scrollTrigger: { trigger: card, start: "top 82%" },
                },
              );
            }

            if (node) {
              gsap.from(node, {
                scale: 0,
                duration: 0.55,
                ease: EASINGS.snappy,
                scrollTrigger: { trigger: card, start: "top 82%" },
              });
            }

            if (period) {
              ScrollTrigger.create({
                trigger: card,
                start: "top 80%",
                once: true,
                onEnter: () => scramblePeriod(period),
              });
            }

            if (skills.length) {
              gsap.from(skills, {
                y: 18,
                opacity: 0,
                scale: 0.85,
                stagger: 0.06,
                duration: 0.4,
                ease: EASINGS.snappy,
                scrollTrigger: { trigger: card, start: "top 72%" },
              });
            }
          });
        });
      }, sectionRef);
      return () => ctx.revert();
    });

    // ---------------------------------------------------------------
    // DESKTOP: cinematic pinned journey. Spine draws via DrawSVG on
    // scrub, nodes pop on cut, periods scramble, chapters cut in with
    // clip-path wipes + masked SplitText, layered parallax + velocity
    // skew. Each entry feels like advancing a chapter.
    // ---------------------------------------------------------------
    mm.add(BREAKPOINTS.desktop, () => {
      let velocityUnsub = null;

      const ctx = gsap.context(() => {
        requestAnimationFrame(() => {
          const cards = gsap.utils.toArray(".exp-card");

          scrollVelocity.start();

          // -- Header: eyebrow, masked title lines, intro fade --------
          const headerTl = gsap.timeline({
            scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
          });

          if (eyebrowRef.current) {
            headerTl.from(eyebrowRef.current, {
              scaleX: 0,
              transformOrigin: "left center",
              duration: 0.5,
              ease: EASINGS.cut,
            });
          }

          const tSplit = makeSplit(titleRef.current, "lines");
          if (tSplit) {
            headerTl.from(
              tSplit.lines,
              {
                yPercent: 115,
                duration: 1,
                stagger: 0.1,
                ease: EASINGS.cine,
              },
              "-=0.2",
            );
          }

          if (introRef.current) {
            const iSplit = makeSplit(introRef.current, "lines");
            if (iSplit) {
              headerTl.from(
                iSplit.lines,
                {
                  yPercent: 100,
                  opacity: 0,
                  duration: 0.7,
                  stagger: 0.07,
                  ease: EASINGS.cineOut,
                },
                "-=0.5",
              );
            }
          }

          // -- The spine: drawn continuously across the whole list ----
          if (spinePathRef.current) {
            gsap.set(spinePathRef.current, { drawSVG: "0%" });
            gsap.to(spinePathRef.current, {
              drawSVG: "100%",
              ease: "none",
              scrollTrigger: {
                trigger: cardsContainerRef.current,
                start: "top 60%",
                end: "bottom 70%",
                scrub: 0.5,
                // live "% advanced through the journey" readout
                onUpdate: (self) => {
                  if (progressLabelRef.current) {
                    progressLabelRef.current.textContent = String(
                      Math.round(self.progress * 100),
                    ).padStart(2, "0");
                  }
                },
              },
            });
          }

          // -- Per-entry chapters -------------------------------------
          cards.forEach((card, i) => {
            const node = card.querySelector(".exp-node");
            const nodeRing = card.querySelector(".exp-node-ring");
            const connector = card.querySelector(".exp-connector");
            const panel = card.querySelector(".exp-panel");
            const logo = card.querySelector(".exp-logo");
            const period = card.querySelector(".exp-period");
            const company = card.querySelector(".exp-company");
            const role = card.querySelector(".exp-role");
            const rule = card.querySelector(".exp-rule");
            const skills = card.querySelectorAll(".exp-skill");
            const cta = card.querySelector(".exp-cta");

            let descSplit = null;
            const description = card.querySelector(".exp-description");
            if (description) descSplit = makeSplit(description, "lines");

            // Chapter timeline: a hard "cut" into the entry as it lands.
            const chapter = gsap.timeline({
              scrollTrigger: { trigger: card, start: "top 78%" },
            });

            // Connector draws from the spine out to the node (cut ease)
            if (connector) {
              chapter.fromTo(
                connector,
                { drawSVG: "0%" },
                { drawSVG: "100%", duration: 0.45, ease: EASINGS.cut },
                0,
              );
            }

            // Node pops + ring snaps open
            if (node) {
              chapter.fromTo(
                node,
                { scale: 0 },
                { scale: 1, duration: 0.5, ease: EASINGS.snappyStrong },
                0.1,
              );
            }
            if (nodeRing) {
              chapter.fromTo(
                nodeRing,
                { scale: 0.3, opacity: 1 },
                { scale: 1.8, opacity: 0, duration: 0.7, ease: EASINGS.cineOut },
                0.15,
              );
            }

            // Panel: clip-path wipe cut (left to right) + slide
            if (panel) {
              chapter.fromTo(
                panel,
                {
                  clipPath: "inset(0 100% 0 0)",
                  x: -40,
                },
                {
                  clipPath: "inset(0 0% 0 0)",
                  x: 0,
                  duration: 0.85,
                  ease: EASINGS.cine,
                },
                0.05,
              );
            }

            // Logo cut-in
            if (logo) {
              chapter.fromTo(
                logo,
                { scale: 0.4, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.5, ease: EASINGS.snappy },
                0.35,
              );
            }

            // Period: scramble the date string into place
            if (period) {
              chapter.add(() => scramblePeriod(period), 0.4);
            }

            // Company + role: masked / slide reveals
            if (company) {
              chapter.from(
                company,
                { yPercent: 60, opacity: 0, duration: 0.6, ease: EASINGS.cineOut },
                0.45,
              );
            }
            if (role) {
              chapter.from(
                role,
                { x: -24, opacity: 0, duration: 0.45, ease: EASINGS.cineOut },
                0.55,
              );
            }
            if (rule) {
              chapter.fromTo(
                rule,
                { scaleX: 0, transformOrigin: "left center" },
                { scaleX: 1, duration: 0.5, ease: EASINGS.cut },
                0.6,
              );
            }

            // Description: masked line reveal
            if (descSplit) {
              chapter.from(
                descSplit.lines,
                {
                  yPercent: 100,
                  duration: 0.6,
                  stagger: 0.06,
                  ease: EASINGS.cineOut,
                },
                0.62,
              );
            }

            // Skills snap in
            if (skills.length) {
              chapter.from(
                skills,
                {
                  y: 16,
                  opacity: 0,
                  scale: 0.85,
                  stagger: 0.04,
                  duration: 0.4,
                  ease: EASINGS.snappy,
                },
                0.7,
              );
            }

            if (cta) {
              chapter.from(
                cta,
                { y: 14, opacity: 0, duration: 0.45, ease: EASINGS.cineOut },
                0.78,
              );
            }

            // Subtle depth parallax on the panel itself
            if (panel) {
              gsap.fromTo(
                panel,
                { yPercent: i % 2 === 0 ? 5 : 8 },
                {
                  yPercent: i % 2 === 0 ? -5 : -8,
                  ease: "none",
                  scrollTrigger: {
                    trigger: card,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1.6,
                  },
                },
              );
            }

            // Pointer-tilt accent on hover (decisive, restrained)
            const onEnter = () => {
              gsap.to(card, { y: -6, duration: 0.4, ease: EASINGS.cineOut });
              if (node)
                gsap.to(node, {
                  backgroundColor: EMERALD,
                  scale: 1.25,
                  duration: 0.3,
                  ease: EASINGS.snappy,
                });
            };
            const onLeave = () => {
              gsap.to(card, { y: 0, duration: 0.5, ease: EASINGS.cineOut });
              if (node)
                gsap.to(node, {
                  backgroundColor: "#0a0a0a",
                  scale: 1,
                  duration: 0.4,
                  ease: EASINGS.cineOut,
                });
            };
            card.addEventListener("mouseenter", onEnter);
            card.addEventListener("mouseleave", onLeave);
          });

          // -- Velocity-reactive skew on the spine wrapper ------------
          velocityUnsub = scrollVelocity.subscribe((velocity) => {
            const n = Math.min(Math.abs(velocity), 1600) / 1600;
            const skew = n * 2 * Math.sign(velocity);
            gsap.to(spineWrapRef.current, {
              skewY: skew,
              duration: 0.25,
              ease: "power1.out",
              overwrite: "auto",
            });
          });
        });
      }, sectionRef);

      return () => {
        ctx.revert();
        if (velocityUnsub) velocityUnsub();
        scrollVelocity.stop();
      };
    });

    // Scramble helper: animates the monospace period into place.
    function scramblePeriod(el) {
      const finalText = el.dataset.value || el.textContent;
      gsap.fromTo(
        el,
        { opacity: 0.4 },
        {
          opacity: 1,
          duration: 0.9,
          ease: "none",
          scrambleText: {
            text: finalText,
            chars: "upperAndLowerCase",
            speed: 0.5,
            tweenLength: false,
          },
        },
      );
    }

    return () => {
      mm.revert();
      splits.forEach((s) => s.revert());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen w-full bg-neutral-50 py-20 md:py-32 px-4 md:px-8 lg:px-16 relative overflow-hidden"
    >
      {/* Clean monochrome frame (no glow blobs, no gradients) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-neutral-200" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-neutral-200" />
      </div>

      {/* Live journey readout */}
      <div className="absolute top-6 right-6 md:top-10 md:right-10 z-20 hidden md:flex items-baseline gap-2 font-mono text-neutral-400">
        <span
          ref={progressLabelRef}
          className="text-sm tabular-nums"
          style={{ color: EMERALD }}
        >
          00
        </span>
        <span className="text-[10px] uppercase tracking-[0.3em]">advanced</span>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-16 md:mb-24">
          <div className="flex items-center gap-4 md:gap-6 mb-6">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-neutral-400">
              06
            </span>
            <div
              ref={eyebrowRef}
              className="flex-1 h-px bg-neutral-300"
              style={{ transformOrigin: "left center" }}
            />
          </div>
          <h2
            ref={titleRef}
            className="text-4xl md:text-6xl lg:text-8xl font-bold tracking-tight text-neutral-900"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            The Journey
          </h2>
          <p
            ref={introRef}
            className="mt-4 md:mt-6 font-mono text-xs md:text-sm text-neutral-500 max-w-lg"
          >
            Building real products with real teams. One chapter at a time.
          </p>
        </div>

        {/* Timeline: spine + entries.
            One shared vertical axis (--spine-x) keeps the drawn spine and
            every node centered on the exact same line at all breakpoints. */}
        <div
          ref={cardsContainerRef}
          className="relative [--spine-x:14px] md:[--spine-x:18px]"
        >
          {/* The drawn spine (DrawSVG). The 2px-wide wrapper is offset by half
              its width so its center lands exactly on --spine-x. Centering uses
              `left` (not transform) so the GSAP velocity skewY on this wrapper
              never fights the centering offset. */}
          <div
            ref={spineWrapRef}
            className="pointer-events-none absolute top-0 bottom-0 w-[2px]"
            style={{
              left: "calc(var(--spine-x) - 1px)",
              willChange: "transform",
            }}
          >
            <svg
              ref={spineTrackRef}
              className="h-full w-[2px] overflow-visible"
              preserveAspectRatio="none"
              viewBox="0 0 2 1000"
            >
              {/* faint full-length track */}
              <line
                x1="1"
                y1="0"
                x2="1"
                y2="1000"
                stroke="#e5e5e5"
                strokeWidth="2"
              />
              {/* the emerald spine that draws on scroll */}
              <line
                ref={spinePathRef}
                x1="1"
                y1="0"
                x2="1"
                y2="1000"
                stroke={EMERALD}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="space-y-12 md:space-y-20">
            {experience.map((job, i) => (
              <div
                key={i}
                className="exp-card relative pl-10 md:pl-16"
                style={{ perspective: "1200px" }}
              >
                {/* Node + connector, centered on the shared --spine-x axis.
                    The group is anchored at --spine-x and shifted left by half
                    the node width, so the NODE center sits exactly on the spine
                    line while the connector extends to the right of it.
                    Node width: 14px (mobile) / 18px (md) -> half = 7px / 9px. */}
                <div
                  className="absolute top-1 md:top-2 flex items-center -translate-x-[7px] md:-translate-x-[9px]"
                  style={{ left: "var(--spine-x)" }}
                >
                  <span className="relative flex items-center justify-center">
                    {/* Ring centered via inset-0 + m-auto (margin auto), NOT a
                        CSS transform, so GSAP's scale tween on this element does
                        not drop the centering. */}
                    <span className="exp-node-ring absolute inset-0 m-auto w-7 h-7 md:w-9 md:h-9 rounded-full border border-emerald-500/60" />
                    <span
                      className="exp-node relative w-3.5 h-3.5 md:w-[18px] md:h-[18px] rounded-full"
                      style={{ backgroundColor: "#0a0a0a" }}
                    />
                  </span>
                  {/* connector line drawn from spine to panel */}
                  <svg
                    className="hidden md:block h-px overflow-visible"
                    width="44"
                    height="2"
                    viewBox="0 0 44 2"
                    preserveAspectRatio="none"
                  >
                    <line
                      className="exp-connector"
                      x1="0"
                      y1="1"
                      x2="44"
                      y2="1"
                      stroke="#d4d4d4"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>

                {/* Entry panel */}
                <div
                  className="exp-panel relative bg-white rounded-2xl border border-neutral-200/80 overflow-hidden"
                  style={{
                    willChange: "transform",
                    boxShadow: "0 4px 24px -8px rgba(0,0,0,0.08)",
                  }}
                >
                  <div className="p-6 md:p-10 lg:p-12">
                    <div className="flex flex-col md:flex-row gap-6 md:gap-10">
                      {/* Logo column */}
                      <div className="shrink-0 flex items-start">
                        {job.logo && (
                          <div className="exp-logo w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-neutral-50 border border-neutral-200 p-3 flex items-center justify-center">
                            <img
                              src={job.logo}
                              alt={job.company}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        )}
                      </div>

                      {/* Details column */}
                      <div className="exp-details flex-1">
                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                          <h3
                            className="exp-company text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900 tracking-tight"
                            style={{ fontFamily: "Space Grotesk, sans-serif" }}
                          >
                            {job.company}
                          </h3>
                          <span
                            className="exp-period font-mono text-[10px] md:text-xs uppercase tracking-widest text-emerald-600 bg-emerald-500/10 px-3 py-1.5 rounded-full w-fit tabular-nums"
                            data-value={job.period}
                          >
                            {job.period}
                          </span>
                        </div>

                        <p className="exp-role text-base md:text-lg text-neutral-600 font-medium mb-4 md:mb-6">
                          {job.role}
                        </p>

                        <div
                          className="exp-rule w-12 h-px bg-neutral-300 mb-4 md:mb-6"
                          style={{ transformOrigin: "left center" }}
                        />

                        <p className="exp-description text-sm md:text-base text-neutral-500 leading-relaxed mb-6 md:mb-8 max-w-2xl">
                          {job.description}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {job.skills?.map((skill) => (
                            <span
                              key={skill}
                              className="exp-skill px-3 py-1.5 text-xs font-mono bg-neutral-900 text-white rounded-lg hover:bg-emerald-500 transition-colors cursor-default"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>

                        {job.link && (
                          <a
                            href={job.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="exp-cta inline-flex items-center gap-2 mt-6 md:mt-8 px-5 py-2.5 bg-neutral-900 text-white text-xs font-mono uppercase tracking-wider rounded-lg hover:bg-emerald-500 transition-colors group"
                          >
                            <span>Visit Company</span>
                            <svg
                              className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform"
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 font-mono text-xs text-neutral-400 tracking-widest">
        06 / 07
      </div>
    </section>
  );
}

export default ScrollTimelineSection;
