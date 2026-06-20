import { useRef, useEffect } from "react";
import {
  gsap,
  SplitText,
  DrawSVGPlugin,
  BREAKPOINTS,
  EASINGS,
} from "../../utils/gsapConfig";
import { experience } from "../../data/experience";

const EMERALD = "#10b981";

/**
 * The Journey — the experience timeline.
 *
 * A single vertical spine (faint track + an emerald DrawSVG line) with circular
 * nodes that sit exactly on the line at every width. As the list scrolls into
 * view the spine simply draws in once, each node pops gently, and every card
 * fades + slides up with an elegant stagger. After the entrance the whole
 * timeline stays fully readable.
 *
 * Deliberately restrained: opaque background, NO pin, no scrubbed multi-step
 * timeline, no clip-path wipes, no scramble, no ghost backdrop. Entrances use
 * ScrollTrigger with toggleActions "play none none reverse" so nothing can ever
 * get stuck hidden, plus a reduced-motion branch that sets clean visible states.
 */
function ScrollTimelineSection() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const eyebrowRef = useRef(null);
  const spinePathRef = useRef(null);
  const cardsContainerRef = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    let titleSplit = null;

    // -----------------------------------------------------------------
    // Reduced motion: everything fully visible, no transforms. The spine
    // is drawn complete so the chronology still reads.
    // -----------------------------------------------------------------
    mm.add(BREAKPOINTS.reducedMotion, () => {
      const root = sectionRef.current;
      if (!root) return () => {};
      gsap.set(
        root.querySelectorAll(".exp-card, .exp-node, .exp-connector"),
        { opacity: 1, x: 0, y: 0, scale: 1 },
      );
      if (spinePathRef.current) gsap.set(spinePathRef.current, { drawSVG: "100%" });
      return () => {};
    });

    // -----------------------------------------------------------------
    // Motion (no-preference): one-shot entrance reveals, no pin/scrub.
    // -----------------------------------------------------------------
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        // Wait a frame so layout (and SplitText measurement) is settled.
        requestAnimationFrame(() => {
          // -- Header: eyebrow rule, then masked title lines rise in -----
          const headerTl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 72%",
              toggleActions: "play none none reverse",
            },
          });

          if (eyebrowRef.current) {
            headerTl.from(eyebrowRef.current, {
              scaleX: 0,
              transformOrigin: "left center",
              duration: 0.6,
              ease: EASINGS.cineOut,
            });
          }

          if (titleRef.current) {
            titleSplit = new SplitText(titleRef.current, {
              type: "lines",
              linesClass: "exp-title-line",
              mask: "lines",
            });
            headerTl.from(
              titleSplit.lines,
              {
                yPercent: 110,
                duration: 0.9,
                stagger: 0.1,
                ease: EASINGS.cine,
              },
              "-=0.25",
            );
          }

          // -- Spine: draws in once as the list reaches view (no scrub) --
          if (spinePathRef.current) {
            gsap.set(spinePathRef.current, { drawSVG: "0%" });
            gsap.to(spinePathRef.current, {
              drawSVG: "100%",
              duration: 1.4,
              ease: "power2.inOut",
              scrollTrigger: {
                trigger: cardsContainerRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            });
          }

          // -- Each entry: clean fade + slide up, node pops, connector ----
          const cards = gsap.utils.toArray(".exp-card");
          cards.forEach((card) => {
            const node = card.querySelector(".exp-node");
            const connector = card.querySelector(".exp-connector");
            const reveal = card.querySelectorAll(".exp-reveal");

            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: card,
                start: "top 82%",
                toggleActions: "play none none reverse",
              },
            });

            // Node pops gently onto the spine.
            if (node) {
              tl.from(
                node,
                { scale: 0, duration: 0.5, ease: EASINGS.snappy },
                0,
              );
            }

            // Connector draws from the spine out to the panel.
            if (connector) {
              tl.fromTo(
                connector,
                { drawSVG: "0%" },
                { drawSVG: "100%", duration: 0.5, ease: EASINGS.cineOut },
                0.1,
              );
            }

            // Panel content: a single tasteful fade + slide-up with stagger.
            if (reveal.length) {
              tl.from(
                reveal,
                {
                  y: 28,
                  opacity: 0,
                  duration: 0.8,
                  stagger: 0.07,
                  ease: EASINGS.cineOut,
                },
                0.08,
              );
            }
          });
        });
      }, sectionRef);

      return () => ctx.revert();
    });

    return () => {
      mm.revert();
      if (titleSplit) titleSplit.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen w-full bg-neutral-50 text-neutral-900 py-24 md:py-32 px-6 md:px-12 lg:px-16 relative overflow-hidden"
    >
      {/* Clean monochrome frame (no glow, no gradient, no ghost words) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-neutral-200" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-neutral-200" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-16 md:mb-24">
          <div className="flex items-center gap-4 md:gap-6 mb-7">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-neutral-400">
              06 / Journey
            </span>
            <div
              ref={eyebrowRef}
              className="flex-1 h-px bg-neutral-200"
              style={{ transformOrigin: "left center" }}
            />
          </div>
          <h2
            ref={titleRef}
            className="font-bold tracking-tight leading-[1.05] text-neutral-900"
            style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontSize: "clamp(2.5rem, 7vw, 5rem)",
            }}
          >
            The Journey
          </h2>
          <p className="mt-5 md:mt-6 font-mono text-xs md:text-sm text-neutral-500 max-w-lg leading-relaxed">
            Building real products with real teams. One chapter at a time.
          </p>
        </div>

        {/*
          Timeline: one shared vertical axis (--spine-x) keeps the drawn spine
          and every node centered on the exact same line at all breakpoints.
        */}
        <div
          ref={cardsContainerRef}
          className="relative [--spine-x:13px] md:[--spine-x:17px]"
        >
          {/*
            The spine. The 2px-wide wrapper is offset left by half its width so
            its center lands exactly on --spine-x. Centering uses `left` (not a
            transform) so nothing fights the offset.
          */}
          <div
            className="pointer-events-none absolute top-0 bottom-0 w-[2px]"
            style={{ left: "calc(var(--spine-x) - 1px)" }}
          >
            <svg
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

          <div className="space-y-12 md:space-y-16">
            {experience.map((job, i) => (
              <div key={i} className="exp-card relative pl-10 md:pl-16">
                {/*
                  Node + connector, centered on the shared --spine-x axis. The
                  group is anchored at --spine-x and shifted left by half the
                  node width so the NODE center sits exactly on the spine line,
                  while the connector extends to the right of it.
                  Node width: 14px (mobile) / 18px (md) -> half = 7px / 9px.
                */}
                <div
                  className="absolute top-1.5 md:top-2.5 flex items-center -translate-x-[7px] md:-translate-x-[9px]"
                  style={{ left: "var(--spine-x)" }}
                >
                  <span className="relative flex items-center justify-center">
                    {/* static halo ring, centered via margin auto (no transform) */}
                    <span className="absolute inset-0 m-auto w-7 h-7 md:w-9 md:h-9 rounded-full border border-emerald-500/40" />
                    <span
                      className="exp-node relative w-3.5 h-3.5 md:w-[18px] md:h-[18px] rounded-full ring-4 ring-neutral-50"
                      style={{ backgroundColor: EMERALD }}
                    />
                  </span>
                  {/* connector line drawn from spine to panel */}
                  <svg
                    className="hidden md:block h-px overflow-visible"
                    width="40"
                    height="2"
                    viewBox="0 0 40 2"
                    preserveAspectRatio="none"
                  >
                    <line
                      className="exp-connector"
                      x1="0"
                      y1="1"
                      x2="40"
                      y2="1"
                      stroke="#d4d4d4"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>

                {/* Entry panel (opaque) */}
                <div
                  className="relative bg-white rounded-2xl border border-neutral-200/80"
                  style={{ boxShadow: "0 4px 24px -8px rgba(0,0,0,0.08)" }}
                >
                  <div className="p-6 md:p-9 lg:p-10">
                    <div className="flex flex-col md:flex-row gap-5 md:gap-8">
                      {/* Logo */}
                      {job.logo && (
                        <div className="exp-reveal shrink-0">
                          <div className="w-14 h-14 md:w-[72px] md:h-[72px] rounded-2xl bg-neutral-50 border border-neutral-200 p-3 flex items-center justify-center">
                            <img
                              src={job.logo}
                              alt={job.company}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </div>
                      )}

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="exp-reveal flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                          <h3
                            className="text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight"
                            style={{ fontFamily: "Space Grotesk, sans-serif" }}
                          >
                            {job.company}
                          </h3>
                          <span className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-emerald-600 bg-emerald-500/10 px-3 py-1.5 rounded-full w-fit tabular-nums">
                            {job.period}
                          </span>
                        </div>

                        <p className="exp-reveal text-base md:text-lg text-neutral-600 font-medium mb-4 md:mb-5">
                          {job.role}
                        </p>

                        <div className="exp-reveal w-12 h-px bg-neutral-300 mb-4 md:mb-5" />

                        <p className="exp-reveal text-sm md:text-base text-neutral-500 leading-relaxed mb-6 max-w-2xl">
                          {job.description}
                        </p>

                        {job.skills?.length > 0 && (
                          <div className="exp-reveal flex flex-wrap gap-2">
                            {job.skills.map((skill) => (
                              <span
                                key={skill}
                                className="px-3 py-1.5 text-xs font-mono bg-neutral-900 text-white rounded-lg hover:bg-emerald-500 transition-colors cursor-default"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}

                        {job.link && (
                          <a
                            href={job.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="exp-reveal inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-neutral-900 text-white text-xs font-mono uppercase tracking-wider rounded-lg hover:bg-emerald-500 transition-colors group"
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

      <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 font-mono text-[10px] text-neutral-400 tracking-widest">
        06 / 07
      </div>
    </section>
  );
}

export default ScrollTimelineSection;
