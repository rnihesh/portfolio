import { useRef, useEffect } from "react";
import {
  gsap,
  ScrollTrigger,
  SplitText,
  DrawSVGPlugin,
  BREAKPOINTS,
  EASINGS,
  scrollVelocity,
} from "../../utils/gsapConfig";
import { applyMagneticEffect } from "../../hooks/useMagnetic";
import { experience } from "../../data/experience";

const EMERALD = "#10b981";

/**
 * The Journey — the experience timeline, cinematic edition.
 *
 * A single emerald spine (faint track + a DrawSVG line that draws on scroll,
 * scrub-linked to scroll progress through the whole list). As each chapter is
 * reached the node pops with a 3D / back-ease, the halo ring draws, the
 * connector DrawSVG's out to the panel, and the card reveals with layered
 * parallax depth, a masked clip wipe, and a staggered content cascade. Mono
 * dates scramble in. The cards container skews subtly with scroll velocity.
 *
 * RELIABILITY:
 *  - Opaque bg-neutral-50 root (the page behind this section is pure black, so
 *    the opaque background is load-bearing; nothing shows through).
 *  - NO pin. This is section 06 of 07 and Connect (07) MUST stay last, so the
 *    whole section animates with scrub + scroll-into-view triggers that cannot
 *    change document flow or overlap a neighbour.
 *  - Every reveal RESOLVES to opacity 1 / clip cleared / no transform. Scrub
 *    reveals finish ("end") above the viewport centre, and each card carries an
 *    onEnter/onLeave safety that hard-sets the final visible state so content
 *    can NEVER get stuck hidden once the user is on it.
 *  - reducedMotion branch sets clean final visible states (drawSVG 100%, opacity
 *    1, no transforms, clip cleared).
 *  - gsap.context + ctx.revert, mm.revert, SplitText.revert, magnetic cleanup,
 *    velocity unsubscribe on teardown.
 */
function ScrollTimelineSection() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const eyebrowRef = useRef(null);
  const eyebrowRuleRef = useRef(null);
  const indexRef = useRef(null);
  const spinePathRef = useRef(null);
  const spineGlowRef = useRef(null);
  const cardsContainerRef = useRef(null);
  const parallaxBackRef = useRef(null);
  const parallaxMidRef = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    let titleSplitLines = null;
    let titleSplitChars = null;
    const magneticCleanups = [];
    let velocityUnsubscribe = null;

    const FINAL_VISIBLE = ".exp-card, .exp-node, .exp-connector, .exp-reveal";

    // -----------------------------------------------------------------
    // Reduced motion: everything fully visible, no transforms, clip clear,
    // spine drawn complete so the chronology still reads.
    // -----------------------------------------------------------------
    mm.add(BREAKPOINTS.reducedMotion, () => {
      const root = sectionRef.current;
      if (!root) return () => {};
      gsap.set(root.querySelectorAll(FINAL_VISIBLE), {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotateX: 0,
        rotateY: 0,
        clipPath: "inset(0 0% 0 0%)",
      });
      gsap.set(root.querySelectorAll(".exp-parallax"), { y: 0 });
      if (spinePathRef.current)
        gsap.set(spinePathRef.current, { drawSVG: "100%" });
      if (spineGlowRef.current)
        gsap.set(spineGlowRef.current, { drawSVG: "100%", opacity: 0.25 });
      gsap.set(root.querySelectorAll(".exp-halo"), { drawSVG: "100%" });
      if (eyebrowRuleRef.current)
        gsap.set(eyebrowRuleRef.current, { drawSVG: "100%" });
      return () => {};
    });

    // -----------------------------------------------------------------
    // Motion (no-preference): rich, layered, choreographed. No pin.
    // -----------------------------------------------------------------
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        const isMobile = window.matchMedia("(max-width: 767px)").matches;

        // Wait a frame so layout (and SplitText measurement) is settled.
        requestAnimationFrame(() => {
          // ===========================================================
          // HEADER — eyebrow rule DrawSVG, mono index scramble, masked
          // line + character reveal of the title.
          // ===========================================================
          const headerTl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          });

          if (eyebrowRuleRef.current) {
            headerTl.fromTo(
              eyebrowRuleRef.current,
              { drawSVG: "0%" },
              { drawSVG: "100%", duration: 0.9, ease: EASINGS.cineOut },
              0,
            );
          }
          if (eyebrowRef.current) {
            headerTl.from(
              eyebrowRef.current,
              { opacity: 0, x: -14, duration: 0.6, ease: EASINGS.cineOut },
              0,
            );
          }

          // Title: split into lines (masked) AND characters for a layered
          // cinematic reveal — lines rise out of their mask, chars settle.
          if (titleRef.current) {
            titleSplitLines = new SplitText(titleRef.current, {
              type: "lines",
              linesClass: "exp-title-line",
              mask: "lines",
            });
            titleSplitChars = new SplitText(titleSplitLines.lines, {
              type: "chars",
              charsClass: "exp-title-char",
            });

            headerTl.from(
              titleSplitLines.lines,
              {
                yPercent: 115,
                duration: 1,
                stagger: 0.12,
                ease: EASINGS.cine,
              },
              0.1,
            );
            headerTl.from(
              titleSplitChars.chars,
              {
                opacity: 0,
                yPercent: 40,
                rotateX: -55,
                transformOrigin: "50% 100% -20px",
                duration: 0.7,
                stagger: 0.018,
                ease: EASINGS.cineOut,
              },
              0.25,
            );
            // Hard safety: when the header scroll-trigger fires, guarantee the
            // title resolves fully visible regardless of timeline state.
            ScrollTrigger.create({
              trigger: sectionRef.current,
              start: "top 60%",
              once: true,
              onEnter: () => {
                if (titleSplitChars)
                  gsap.set(titleSplitChars.chars, {
                    opacity: 1,
                    yPercent: 0,
                    rotateX: 0,
                  });
                if (titleSplitLines)
                  gsap.set(titleSplitLines.lines, { yPercent: 0 });
              },
            });
          }

          // Mono index readout scrambles in.
          if (indexRef.current) {
            const finalIndex = indexRef.current.textContent;
            ScrollTrigger.create({
              trigger: sectionRef.current,
              start: "top 78%",
              once: true,
              onEnter: () => {
                gsap.to(indexRef.current, {
                  duration: 1.1,
                  ease: "none",
                  scrambleText: {
                    text: finalIndex,
                    chars: "0123456789/JOURNEY",
                    speed: 0.5,
                  },
                });
              },
            });
          }

          // ===========================================================
          // PARALLAX DEPTH — two faint background layers move at different
          // scrub speeds as the section passes (multi-layer depth).
          // ===========================================================
          if (parallaxBackRef.current) {
            gsap.fromTo(
              parallaxBackRef.current,
              { yPercent: -8 },
              {
                yPercent: 8,
                ease: "none",
                scrollTrigger: {
                  trigger: sectionRef.current,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1.2,
                },
              },
            );
          }
          if (parallaxMidRef.current) {
            gsap.fromTo(
              parallaxMidRef.current,
              { yPercent: -4 },
              {
                yPercent: 6,
                ease: "none",
                scrollTrigger: {
                  trigger: sectionRef.current,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.8,
                },
              },
            );
          }

          // ===========================================================
          // SPINE — emerald line DrawSVG's scrub-linked to scroll progress
          // through the entire cards container (NOT one-shot). A soft glow
          // strand draws alongside it for depth.
          // ===========================================================
          if (spinePathRef.current && cardsContainerRef.current) {
            gsap.set(spinePathRef.current, { drawSVG: "0%" });
            gsap.to(spinePathRef.current, {
              drawSVG: "100%",
              ease: "none",
              scrollTrigger: {
                trigger: cardsContainerRef.current,
                start: "top 82%",
                end: "bottom 60%",
                scrub: 1,
                // Safety: once the list is mostly past, lock the spine full.
                onLeave: () =>
                  gsap.set(spinePathRef.current, { drawSVG: "100%" }),
              },
            });
          }
          if (spineGlowRef.current && cardsContainerRef.current) {
            gsap.set(spineGlowRef.current, { drawSVG: "0%", opacity: 0.22 });
            gsap.to(spineGlowRef.current, {
              drawSVG: "100%",
              ease: "none",
              scrollTrigger: {
                trigger: cardsContainerRef.current,
                start: "top 82%",
                end: "bottom 60%",
                scrub: 1.4,
                onLeave: () =>
                  gsap.set(spineGlowRef.current, { drawSVG: "100%" }),
              },
            });
          }

          // ===========================================================
          // CARDS — per chapter: node 3D pop, halo draw, connector DrawSVG,
          // masked clip-wipe panel reveal, layered parallax on inner depth
          // layers, staggered content cascade, scrambled date.
          // ===========================================================
          const cards = gsap.utils.toArray(".exp-card");
          cards.forEach((card, i) => {
            const node = card.querySelector(".exp-node");
            const halo = card.querySelector(".exp-halo");
            const connector = card.querySelector(".exp-connector");
            const panel = card.querySelector(".exp-panel");
            const reveal = card.querySelectorAll(".exp-reveal");
            const date = card.querySelector(".exp-date");
            const fromLeft = i % 2 === 0;
            const wipe = fromLeft
              ? "inset(0 100% 0 0)"
              : "inset(0 0 0 100%)";

            // --- Node: 3D back-ease pop onto the spine ---------------
            if (node) {
              gsap.set(node, { transformPerspective: 600 });
              gsap.from(node, {
                scale: 0,
                rotateY: 140,
                opacity: 0,
                duration: 0.7,
                ease: EASINGS.snappyStrong,
                scrollTrigger: {
                  trigger: card,
                  start: "top 80%",
                  toggleActions: "play none none reverse",
                },
              });
            }

            // --- Halo ring draws around the node --------------------
            if (halo) {
              gsap.fromTo(
                halo,
                { drawSVG: "0%" },
                {
                  drawSVG: "100%",
                  duration: 0.8,
                  ease: EASINGS.cineOut,
                  scrollTrigger: {
                    trigger: card,
                    start: "top 80%",
                    toggleActions: "play none none reverse",
                    onLeave: () => gsap.set(halo, { drawSVG: "100%" }),
                  },
                },
              );
            }

            // --- Connector draws from spine out to the panel --------
            if (connector) {
              gsap.fromTo(
                connector,
                { drawSVG: "0%" },
                {
                  drawSVG: "100%",
                  duration: 0.6,
                  ease: EASINGS.cut,
                  scrollTrigger: {
                    trigger: card,
                    start: "top 78%",
                    toggleActions: "play none none reverse",
                    onLeave: () => gsap.set(connector, { drawSVG: "100%" }),
                  },
                },
              );
            }

            // --- Panel: masked clip-wipe + 3D rotateY settle, scrubbed
            //     so depth tracks scroll. Finishes ABOVE centre and is
            //     hard-locked visible by the safety trigger below. -----
            if (panel) {
              gsap.set(panel, {
                transformPerspective: 1100,
                transformOrigin: fromLeft ? "left center" : "right center",
              });
              gsap.fromTo(
                panel,
                {
                  clipPath: wipe,
                  opacity: 0,
                  y: 60,
                  rotateY: fromLeft ? -12 : 12,
                  scale: 0.96,
                },
                {
                  clipPath: "inset(0 0% 0 0%)",
                  opacity: 1,
                  y: 0,
                  rotateY: 0,
                  scale: 1,
                  ease: "none",
                  scrollTrigger: {
                    trigger: card,
                    start: "top 88%",
                    end: "top 58%",
                    scrub: 1,
                  },
                },
              );
            }

            // --- Inner depth layers parallax at their own speeds -----
            const parallaxLayers = card.querySelectorAll(".exp-parallax");
            parallaxLayers.forEach((layer) => {
              const depth = parseFloat(layer.dataset.depth || "0.5");
              gsap.fromTo(
                layer,
                { y: 28 * depth },
                {
                  y: -22 * depth,
                  ease: "none",
                  scrollTrigger: {
                    trigger: card,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1,
                  },
                },
              );
            });

            // --- Content cascade: staggered masked rise. Finishes above
            //     centre; safety trigger guarantees opacity 1 / y 0. -----
            if (reveal.length) {
              gsap.fromTo(
                reveal,
                { y: 34, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 0.85,
                  stagger: 0.07,
                  ease: EASINGS.cineOut,
                  scrollTrigger: {
                    trigger: card,
                    start: "top 78%",
                    toggleActions: "play none none reverse",
                  },
                },
              );
            }

            // --- Date scrambles in as a mono readout ----------------
            if (date) {
              const finalDate = date.dataset.full || date.textContent;
              ScrollTrigger.create({
                trigger: card,
                start: "top 76%",
                once: true,
                onEnter: () => {
                  gsap.to(date, {
                    duration: 0.9,
                    ease: "none",
                    scrambleText: {
                      text: finalDate,
                      chars: "0123456789-",
                      speed: 0.7,
                    },
                  });
                },
              });
            }

            // --- HARD VISIBILITY SAFETY -----------------------------
            // The moment a card is centred, everything in it is forced to
            // its final readable state. Nothing can ever stay hidden.
            ScrollTrigger.create({
              trigger: card,
              start: "top 55%",
              once: true,
              onEnter: () => {
                if (panel)
                  gsap.set(panel, {
                    clipPath: "inset(0 0% 0 0%)",
                    opacity: 1,
                    y: 0,
                    rotateY: 0,
                    scale: 1,
                  });
                if (reveal.length) gsap.set(reveal, { opacity: 1, y: 0 });
                if (node)
                  gsap.set(node, { scale: 1, rotateY: 0, opacity: 1 });
                if (connector) gsap.set(connector, { drawSVG: "100%" });
                if (halo) gsap.set(halo, { drawSVG: "100%" });
              },
            });
          });

          // ===========================================================
          // VELOCITY-REACTIVE SKEW — the cards container skews subtly with
          // scroll velocity for that "alive" inertial feel (desktop only;
          // skip on mobile to keep it calm + performant).
          // ===========================================================
          if (!isMobile && cardsContainerRef.current) {
            scrollVelocity.start();
            velocityUnsubscribe = scrollVelocity.subscribe(() => {
              const nv = scrollVelocity.getNormalizedVelocity(1800);
              const skew = nv * 2.2 * Math.sign(scrollVelocity.velocity);
              gsap.to(cardsContainerRef.current, {
                skewY: skew,
                duration: 0.3,
                ease: "power1.out",
                overwrite: "auto",
              });
            });
          }

          // ===========================================================
          // MAGNETIC HOVER — node markers + CTAs pull toward the cursor.
          // ===========================================================
          if (!isMobile) {
            cards.forEach((card) => {
              const node = card.querySelector(".exp-node");
              if (node) {
                magneticCleanups.push(
                  applyMagneticEffect(node, {
                    strength: 0.45,
                    ease: 0.3,
                    resetEase: 0.6,
                    resetEaseType: "elastic.out(1, 0.4)",
                  }),
                );
              }
              card.querySelectorAll(".exp-magnetic").forEach((el) => {
                magneticCleanups.push(
                  applyMagneticEffect(el, {
                    strength: 0.28,
                    ease: 0.3,
                    resetEase: 0.55,
                    resetEaseType: "elastic.out(1, 0.45)",
                  }),
                );
              });
            });
          }

          ScrollTrigger.refresh();
        });
      }, sectionRef);

      return () => {
        ctx.revert();
        magneticCleanups.forEach((fn) => fn());
        magneticCleanups.length = 0;
        if (velocityUnsubscribe) velocityUnsubscribe();
        velocityUnsubscribe = null;
        scrollVelocity.stop();
        // Reset any leftover skew on the persistent container.
        if (cardsContainerRef.current)
          gsap.set(cardsContainerRef.current, { skewY: 0 });
        if (titleSplitChars) {
          titleSplitChars.revert();
          titleSplitChars = null;
        }
        if (titleSplitLines) {
          titleSplitLines.revert();
          titleSplitLines = null;
        }
      };
    });

    return () => {
      mm.revert();
      if (titleSplitChars) titleSplitChars.revert();
      if (titleSplitLines) titleSplitLines.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen w-full bg-neutral-50 text-neutral-900 py-24 md:py-32 px-6 md:px-12 lg:px-16 relative overflow-hidden"
    >
      {/* OPAQUE backdrop guarantee + faint multi-layer parallax depth.
          These are monochrome, low-contrast and sit BEHIND content (z-0).
          No giant ghost words/numbers — just a hairline grid + a soft band. */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-neutral-200" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-neutral-200" />
        {/* deepest layer: faint horizontal rules */}
        <div
          ref={parallaxBackRef}
          className="exp-parallax-bg absolute inset-x-0 -top-24 bottom-[-6rem] opacity-[0.5]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, transparent 0 119px, #e5e5e5 119px 120px)",
            willChange: "transform",
          }}
        />
        {/* mid layer: a single soft emerald wash band, very low alpha */}
        <div
          ref={parallaxMidRef}
          className="exp-parallax-mid absolute left-1/2 top-1/3 h-[60vh] w-[80vw] -translate-x-1/2 rounded-full opacity-[0.06]"
          style={{
            background: `radial-gradient(closest-side, ${EMERALD}, transparent 70%)`,
            willChange: "transform",
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-16 md:mb-24">
          <div className="flex items-center gap-4 md:gap-6 mb-7">
            <span
              ref={indexRef}
              className="font-mono text-xs uppercase tracking-[0.3em] text-neutral-400 tabular-nums"
            >
              06 / Journey
            </span>
            {/* DrawSVG eyebrow rule */}
            <span ref={eyebrowRef} className="flex-1">
              <svg
                className="block w-full h-px overflow-visible"
                preserveAspectRatio="none"
                viewBox="0 0 100 1"
                aria-hidden="true"
              >
                <line
                  ref={eyebrowRuleRef}
                  x1="0"
                  y1="0.5"
                  x2="100"
                  y2="0.5"
                  stroke="#d4d4d4"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </span>
          </div>
          <h2
            ref={titleRef}
            className="font-bold tracking-tight leading-[1.05] text-neutral-900"
            style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontSize: "clamp(2.5rem, 7vw, 5rem)",
              perspective: "800px",
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
          style={{ willChange: "transform" }}
        >
          {/*
            The spine. The wrapper is offset left by half its width so its
            center lands exactly on --spine-x. Centering uses `left` (not a
            transform) so nothing fights the offset.
          */}
          <div
            className="pointer-events-none absolute top-0 bottom-0 w-[6px]"
            style={{ left: "calc(var(--spine-x) - 3px)" }}
          >
            <svg
              className="h-full w-[6px] overflow-visible"
              preserveAspectRatio="none"
              viewBox="0 0 6 1000"
            >
              {/* faint full-length track */}
              <line
                x1="3"
                y1="0"
                x2="3"
                y2="1000"
                stroke="#e5e5e5"
                strokeWidth="2"
              />
              {/* soft emerald glow strand (drawn alongside, low alpha) */}
              <line
                ref={spineGlowRef}
                x1="3"
                y1="0"
                x2="3"
                y2="1000"
                stroke={EMERALD}
                strokeWidth="6"
                strokeLinecap="round"
                opacity="0.22"
              />
              {/* the crisp emerald spine that draws on scroll */}
              <line
                ref={spinePathRef}
                x1="3"
                y1="0"
                x2="3"
                y2="1000"
                stroke={EMERALD}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="space-y-12 md:space-y-16">
            {experience.map((job, i) => {
              // Mono date: keep the literal final string for scramble.
              const dateText = job.period;
              return (
                <div key={i} className="exp-card relative pl-10 md:pl-16">
                  {/*
                    Node + connector + halo, centered on the shared --spine-x
                    axis. The group is anchored at --spine-x and shifted left by
                    half the node width so the NODE center sits exactly on the
                    spine line, while the connector extends to the right of it.
                    Node width: 14px (mobile) / 18px (md) -> half = 7px / 9px.
                  */}
                  <div
                    className="absolute top-1.5 md:top-2.5 flex items-center -translate-x-[7px] md:-translate-x-[9px]"
                    style={{ left: "var(--spine-x)" }}
                  >
                    <span className="relative flex items-center justify-center">
                      {/* halo ring — DrawSVG draws around the node */}
                      <svg
                        className="absolute inset-0 m-auto w-7 h-7 md:w-9 md:h-9 overflow-visible"
                        viewBox="0 0 36 36"
                        aria-hidden="true"
                      >
                        <circle
                          className="exp-halo"
                          cx="18"
                          cy="18"
                          r="17"
                          fill="none"
                          stroke={EMERALD}
                          strokeWidth="1.5"
                          strokeOpacity="0.45"
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="exp-node relative w-3.5 h-3.5 md:w-[18px] md:h-[18px] rounded-full bg-neutral-50 ring-2 ring-emerald-500 flex items-center justify-center cursor-pointer shadow-[0_0_0_4px_rgb(249,250,251)]">
                        <span
                          className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full"
                          style={{ backgroundColor: EMERALD }}
                        />
                      </span>
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

                  {/* Entry panel (opaque) — clip-wipe + 3D settle on scrub */}
                  <div
                    className="exp-panel relative bg-white rounded-2xl border border-neutral-200/80"
                    style={{
                      boxShadow: "0 4px 24px -8px rgba(0,0,0,0.08)",
                      willChange: "transform, clip-path, opacity",
                    }}
                  >
                    <div className="p-6 md:p-9 lg:p-10">
                      <div className="flex flex-col md:flex-row gap-5 md:gap-8">
                        {/* Logo — sits on its own parallax depth layer */}
                        {job.logo && (
                          <div
                            className="exp-reveal exp-parallax shrink-0"
                            data-depth="1"
                          >
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
                        <div
                          className="exp-parallax flex-1 min-w-0"
                          data-depth="0.35"
                        >
                          <div className="exp-reveal flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                            <h3
                              className="text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight"
                              style={{
                                fontFamily: "Space Grotesk, sans-serif",
                              }}
                            >
                              {job.company}
                            </h3>
                            <span
                              className="exp-date font-mono text-[10px] md:text-xs uppercase tracking-widest text-emerald-600 bg-emerald-500/10 px-3 py-1.5 rounded-full w-fit tabular-nums"
                              data-full={dateText}
                            >
                              {dateText}
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
                              className="exp-reveal exp-magnetic inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-neutral-900 text-white text-xs font-mono uppercase tracking-wider rounded-lg hover:bg-emerald-500 transition-colors group"
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
              );
            })}
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 font-mono text-[10px] text-neutral-400 tracking-widest z-10">
        06 / 07
      </div>
    </section>
  );
}

export default ScrollTimelineSection;
